---
title: "طراحی Importer پایدار و Idempotent با PostgreSQL"
description: "معماری importer با صف دیتابیسی، SKIP LOCKED، payload منجمد، idempotency key و مدیریت نتیجه نامشخص درخواست."
pubDatetime: 2026-08-24
author: "حسین مختاری"
tags: ["Python", "PostgreSQL", "Importer", "Idempotency"]
featured: false
draft: true
ogImage: "/images/articles/idempotent-importer-cover-16x9.svg"
---

Importer در نگاه اول برنامه‌ای است که رکورد را می‌خواند، payload می‌سازد و به API مقصد می‌فرستد. در happy path همین سه مرحله کافی به نظر می‌رسند. مشکل وقتی شروع می‌شود که درخواست timeout می‌شود: آیا مقصد چیزی نساخته، یا رکورد ساخته شده و فقط پاسخ به دست ما نرسیده است؟ اگر برنامه دوباره ارسال کند ممکن است داده تکراری بسازد؛ اگر ارسال نکند شاید رکورد برای همیشه جا بماند.

در importerهای پلتفرم داده میخوام، این وضعیت یک استثنای عجیب نبود؛ نتیجه طبیعی ارتباط شبکه‌ای با یک سیستم دیگر بود. بنابراین معماری را حول «اثبات نتیجه» و «تکرار امن» طراحی کردم. این نوشته درباره صف PostgreSQL، claim اتمیک، payload منجمد، idempotency key و وضعیت `unknown outcome` است. مثال‌ها پاک‌سازی شده‌اند و جزئیات API واقعی نمایش داده نمی‌شود.

<figure>
  <img src="/images/articles/idempotent-importer-architecture.svg" width="1200" height="675" alt="نمودار آماده‌سازی payload منجمد، claim توسط worker، ارسال با کلید idempotency و ثبت نتیجه قطعی یا نامشخص" loading="lazy" />
  <figcaption>Importer باید میان شکست قطعی و نتیجه نامشخص فرق بگذارد؛ timeout مدرک شکست عملیات مقصد نیست.</figcaption>
</figure>

## سه حقیقت جدا: منبع، تلاش ارسال و موجودیت مقصد

اگر همه اطلاعات در همان رکورد crawler با flagهایی مانند `imported` و `error` ذخیره شوند، خیلی زود معلوم نیست آخرین payload چه بوده و چند بار ارسال شده است. من سه مفهوم را جدا کردم:

1. **Source record:** حقیقت دریافت‌شده و نرمال‌شده از منبع.
2. **Import item:** تصمیم برای واردکردن یک نسخه مشخص از source با policy یا mapping مشخص.
3. **Attempt:** یک تلاش شبکه‌ای با زمان، کلید، پاسخ و نتیجه قابل طبقه‌بندی.

موجودیت مقصد نیز با `destination_id` و در صورت امکان URL یا نسخه API ثبت می‌شود. این تفکیک اجازه می‌دهد source بعداً ویرایش شود، بدون اینکه شواهد تلاش قبلی از بین برود. همچنین می‌توان فهمید یک رکورد چرا در review است یا با کدام payload ساخته شده است.

## Idempotency چیست و چه چیزی نیست؟

یک عملیات idempotent با تکرار همان درخواست منطقی، اثر جدیدی ایجاد نمی‌کند. این مفهوم با retry برابر نیست. retry فقط درخواست را دوباره اجرا می‌کند؛ اگر مقصد idempotency را نفهمد، هر بار می‌تواند موجودیت تازه بسازد.

کلید idempotency باید برای یک **عملیات منطقی** ثابت باشد. ساخت UUID تازه در هر تلاش شبکه‌ای مشکل را حل نمی‌کند. وقتی payload یا قصد کاربر به‌شکل معنادار تغییر می‌کند، عملیات جدید و کلید جدید لازم است. اما timeout و retry همان عملیات، همان کلید را حفظ می‌کنند.

در بهترین حالت API مقصد کلید را در header یا payload می‌پذیرد، آن را با نتیجه عملیات ذخیره می‌کند و درخواست تکراری را به همان نتیجه متصل می‌سازد. اگر چنین قراردادی وجود ندارد، می‌توان یک `external_id` یکتا از منبع ارسال کرد و مقصد روی آن unique constraint داشته باشد. lookup پس از timeout نیز کمک می‌کند، ولی جای تضمین اتمیک سمت مقصد را کامل نمی‌گیرد.

## Frozen Payload: retry نباید هدف متحرک داشته باشد

فرض کنید source بعد از تلاش اول اصلاح شود. اگر retry payload را دوباره از آخرین source بسازد ولی همان idempotency key را استفاده کند، یک کلید به دو درخواست متفاوت متصل می‌شود. بعضی مقصدها این را conflict می‌دانند و بعضی اولین پاسخ را برمی‌گردانند؛ در هر دو حالت رفتار برای اپراتور مبهم است.

برای همین پیش از ورود به صف ارسال، payload نهایی ساخته، اعتبارسنجی و freeze می‌شود. hash canonical payload کنار رکورد ImportItem ذخیره می‌شود. همه تلاش‌های آن item دقیقاً همان payload را می‌فرستند. تغییر mapping یا source یک item جدید می‌سازد و item قبلی برای audit باقی می‌ماند.

```python
import hashlib
import json

def freeze_payload(data: dict) -> tuple[dict, str]:
    serialized = json.dumps(
        data,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    digest = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    return json.loads(serialized), digest
```

Canonicalization باید با قرارداد دامنه هماهنگ باشد. ترتیب عناصر یک آرایه ممکن است مهم یا بی‌اهمیت باشد. مرتب‌کردن کورکورانه همه لیست‌ها می‌تواند معنای payload را عوض کند. در پروژه، ابتدا مدل Pydantic خروجی مشخص می‌ساخت و serialization همان مدل hash می‌شد.

## صف PostgreSQL و claim اتمیک Workerها

برای این مقیاس، صف دیتابیسی مزیت مهمی داشت: source، state و transaction در یک سیستم بودند و ابزارهای عملیاتی با SQL قابل ساخت بودند. Worker باید یک item آماده را طوری claim کند که worker دوم همان رکورد را برندارد.

الگوی PostgreSQL با `FOR UPDATE SKIP LOCKED` انتخاب شد. تراکنش claim کوتاه است: یک item با زمان تلاش مناسب انتخاب، state به `processing` تغییر و lease ثبت می‌شود. سپس commit انجام می‌شود و درخواست HTTP خارج از تراکنش اجرا می‌گردد.

```sql
WITH candidate AS (
  SELECT id
  FROM import_items
  WHERE state IN ('ready', 'retryable')
    AND next_attempt_at <= now()
  ORDER BY priority DESC, id
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
UPDATE import_items AS item
SET state = 'processing',
    claimed_by = $1,
    lease_until = now() + interval '90 seconds',
    updated_at = now()
FROM candidate
WHERE item.id = candidate.id
RETURNING item.*;
```

این query فقط نمونه ساده‌شده است. index روی state و next_attempt_at لازم است و ترتیب باید از starvation کارهای قدیمی جلوگیری کند. lease نیز باید با زمان واقعی طول درخواست و سیاست timeout هماهنگ باشد.

چرا درخواست شبکه بیرون تراکنش است؟ چون API خارجی تحت کنترل ما نیست. باز نگه‌داشتن row lock هنگام timeout ظرفیت دیتابیس را هدر می‌دهد و shutdown را سخت می‌کند. lease نشان می‌دهد چه کسی مسئول کار است و پس از مرگ process امکان بازیابی می‌دهد.

## State Machine واردکننده

Booleanهایی مثل `done` برای نتیجه‌های واقعی کافی نیستند. stateهای مفهومی importer من شامل این موارد بودند:

- `pending_validation`: داده هنوز برای مقصد بررسی نشده است.
- `needs_review`: mapping یا ورودی ابهام مؤثر دارد.
- `ready`: payload freeze شده و قابل ارسال است.
- `processing`: worker دارای lease روی آن کار می‌کند.
- `retryable`: خطای موقت با زمان تلاش بعدی.
- `unknown_outcome`: درخواست ارسال شده ولی اثر مقصد قابل اثبات نیست.
- `completed`: شناسه معتبر مقصد ذخیره شده است.
- `rejected`: مقصد خطای قطعی قرارداد یا policy داده است.
- `cancelled`: تصمیم انسانی عملیات را متوقف کرده است.

`unknown_outcome` مهم‌ترین تفاوت با صف ساده است. timeout بعد از نوشتن body یا قطع اتصال هنگام خواندن response به این وضعیت می‌رود. worker معمولی نباید آن را مانند خطای 503 فوراً retry کند. ابتدا reconciliation انجام می‌شود: lookup با idempotency key یا external id، بررسی endpoint وضعیت، یا بازپخش همان کلید در مقصدی که idempotency رسمی دارد.

## ثبت Attempt پیش از ارسال

اگر برنامه پس از ارسال و قبل از درج لاگ crash کند، اثری از درخواست باقی نمی‌ماند. بنابراین Attempt با state `started` و همان کلید پیش از network call ثبت می‌شود. پس از پاسخ، status، latency، hash پاسخ پاک‌سازی‌شده و طبقه‌بندی نتیجه به‌روزرسانی می‌شود.

نمی‌توان با یک دیتابیس محلی و API خارجی یک transaction اتمیک واقعی داشت. ثبت پیش از ارسال نیز پنجره‌ای دارد: ممکن است attempt ساخته شود اما درخواست هرگز از process خارج نشود. به همین دلیل started به معنی «مقصد حتماً دیده» نیست. این ابهام پذیرفته و با reconciliation و idempotency مدیریت می‌شود، نه با ادعای exactly-once.

اطلاعات حساس پاسخ در attempt ذخیره نمی‌شوند. برای debugging، status code، نوع خطا، request id مقصد و بخش امن validation کافی است. token، شماره تماس کامل یا payload خصوصی نباید در log عمومی ظاهر شود.

## طبقه‌بندی پاسخ‌ها

همه پاسخ‌های 4xx قطعی و همه 5xx موقت نیستند. قرارداد مقصد باید مشخص کند کدام خطا قابلیت retry دارد. یک 409 ممکن است نشانه duplicate موفق قبلی باشد و به lookup نیاز داشته باشد. 422 معمولاً validation قطعی است، اما شاید taxonomy cache ما قدیمی باشد و با refresh حل شود.

طبقه‌بندی نمونه:

- `2xx` همراه شناسه معتبر: completed.
- `2xx` بدون شناسه یا body قابل تأیید: unknown outcome.
- `409` با external id موجود: reconcile و اتصال به موجودیت قبلی.
- `401/403`: خطای تنظیمات یا مجوز؛ صف عمومی متوقف و alert ایجاد می‌شود.
- `422`: rejected یا needs_review همراه خطاهای فیلد.
- `429`: retryable با احترام به Retry-After.
- `5xx`: retryable محدود، مگر پاسخ قرارداد دیگری داشته باشد.
- timeout پس از شروع ارسال: unknown outcome.
- خطای DNS پیش از اتصال: retryable؛ احتمال اثر مقصد پایین است.

دانستن مرحله exception مهم است. بعضی HTTP clientها اطلاعاتی درباره connect timeout و read timeout می‌دهند. read timeout پس از ارسال، ابهام بیشتری از connect failure دارد.

## Reconciliation؛ کارگری متفاوت از Retry

صف retry هدفش تکرار خطای موقت است. Reconciler هدف دیگری دارد: پیدا کردن حقیقت عملیات نامشخص. ترکیب این دو باعث می‌شود timeoutها بدون بررسی دوباره ارسال شوند.

Reconciler itemهای `unknown_outcome` را با فاصله مناسب می‌خواند. ابتدا idempotency key یا external id را در مقصد جست‌وجو می‌کند. اگر موجودیت پیدا شد، شناسه و پاسخ اثبات‌کننده ذخیره و item completed می‌شود. اگر مقصد به‌طور قطعی نبود عملیات را ثابت کند، همان کلید می‌تواند بازپخش شود. اگر هیچ روش اثباتی وجود ندارد، item به review انسانی می‌رود.

این مسیر کندتر است، ولی ثبت تکراری داده تولیدی هزینه بیشتری دارد. داشبورد باید تعداد و سن unknownها را جدا نشان دهد؛ ماندن طولانی در این وضعیت یک مسئله عملیاتی است، نه صرفاً خطای لاگ.

## Mapping و وضعیت needs_review

Importer معمولاً میان دو مدل داده قرار دارد. دسته، شهر، نوع رسانه یا enumها ممکن است یک‌به‌یک نباشند. mapping با fuzzy match می‌تواند گزینه پیشنهاد کند، اما نباید همه عدم قطعیت‌ها را خودکار حل کند.

من mappingهای تأییدشده را با version نگهداری کردم. payload freeze شده نسخه mapping را ثبت می‌کند. اگر دسته منبع چند مقصد ممکن داشته باشد، item به `needs_review` می‌رود. اپراتور انتخاب می‌کند و این تصمیم می‌تواند برای رکوردهای مشابه بعدی به rule پایدار تبدیل شود.

مزیت review این است که ورودی ناسازگار صف worker را با retry بی‌پایان اشغال نمی‌کند. عیب آن نیاز به رابط یا CLI مناسب است. بدون نمایش context و تفاوت گزینه‌ها، review به کار دستی خسته‌کننده تبدیل می‌شود.

## Dry-run و ابزارهای عملیاتی

پیش از فعال‌کردن اثر جانبی، dry-run payload، mapping، validation و انتخاب endpoint را اجرا می‌کند ولی ارسال ندارد. خروجی باید همان serialization واقعی را نشان دهد؛ نسخه جداگانه‌ای از builder برای dry-run ممکن است تفاوت پنهان بسازد.

ابزار `status` شمار stateها، قدیمی‌ترین ready، attemptهای اخیر و unknown outcomeها را نمایش می‌دهد. `doctor` اتصال دیتابیس، migration، تنظیمات مقصد و دسترسی secret را بدون چاپ مقدار secret بررسی می‌کند. فرمان requeue نیز باید هدف دقیق و شرط state داشته باشد؛ requeue کل صف یک عملیات خطرناک است.

عملیات انسانی مانند approve mapping، cancel یا force reconcile با نام اپراتور و زمان ثبت می‌شود. ممیزی برای سرزنش نیست؛ برای فهم این است که state چگونه تغییر کرده است.

## امنیت داده و رازها

Importer به داده منبع و credential مقصد دسترسی دارد و مرز حساسی است. اصل least privilege مهم است: token فقط مجوز endpointهای لازم را دارد و دیتابیس crawler برای worker تا حد ممکن read-only است. secret از environment یا secret store می‌آید و هرگز در Frozen Payload قرار نمی‌گیرد.

لاگ ساخت‌یافته باید allowlist فیلد داشته باشد. حذف چند کلید شناخته‌شده کافی نیست، چون ممکن است API بعداً فیلد حساس جدیدی اضافه کند. در محیط توسعه نیز fixtureها باید ناشناس یا ساختگی باشند؛ snapshot تولیدی به مخزن عمومی منتقل نمی‌شود.

SSRF در importer رسانه یک ریسک واقعی است. اگر URL رسانه از داده خارجی می‌آید، scheme، hostname، redirect و محدوده IP باید کنترل شوند. دریافت‌کننده نباید بتواند به metadata service یا شبکه داخلی دسترسی پیدا کند.

## روش تست

من تست را بر invariantهای عملیات متمرکز کردم:

- دو worker نمی‌توانند هم‌زمان یک item را claim کنند.
- lease منقضی پس از بررسی دوباره قابل بازیابی است.
- retry همان Frozen Payload و idempotency key را نگه می‌دارد.
- تغییر source بعد از freeze، payload item جاری را عوض نمی‌کند.
- پاسخ بدون شناسه، completed نمی‌سازد.
- timeout read به unknown outcome می‌رود، نه ready فوری.
- 422 فیلدی به rejected/review می‌رود و بی‌نهایت retry نمی‌شود.
- unique constraint از اتصال دو destination id به یک عملیات جلوگیری می‌کند.

برای race واقعی، تست integration با PostgreSQL و connectionهای جدا لازم است. mock ORM رفتار lock را نشان نمی‌دهد. یک HTTP server fake پاسخ را دیر می‌فرستد، اتصال را قطع می‌کند یا همان idempotency key را دوباره دریافت می‌کند. ساعت و random backoff inject می‌شوند تا تست سریع و قطعی بماند.

Crash testing نیز ارزشمند است: process را پس از claim، پس از ساخت attempt و پس از دریافت پاسخ متوقف می‌کنیم و سپس می‌بینیم اجرای بعدی چگونه state را بازیابی می‌کند. هدف این نیست که هیچ ابهامی وجود نداشته باشد؛ هدف این است که ابهام در state مشخص و قابل رسیدگی قرار گیرد.

## راه‌حل‌های کنارگذاشته‌شده

**علامت imported در جدول source** اطلاعات تلاش و نسخه payload را از بین می‌برد و کنار گذاشته شد.

**ساخت payload هنگام هر retry** می‌توانست با تغییر source یا mapping، درخواست متفاوتی زیر همان عملیات بسازد. Frozen Payload جایگزین شد.

**قفل دیتابیس دور HTTP request** throughput و بازیابی را بدتر می‌کرد. claim کوتاه و lease انتخاب شد.

**تفسیر هر timeout به‌عنوان شکست** رکورد تکراری می‌ساخت. unknown outcome و reconciliation اضافه شدند.

**حذف رکوردهای completed از صف** فضای کمتری می‌گرفت، اما audit و اتصال source به مقصد را از بین می‌برد. retention و archive کنترل‌شده بهتر بود.

## trade-off و محدودیت‌ها

صف PostgreSQL برای همه مقیاس‌ها بهترین انتخاب نیست. در throughput بسیار بالا، نیاز به routing پیچیده یا چند مصرف‌کننده ناهمگون، message broker تخصصی می‌تواند مناسب‌تر باشد. با این حال broker نیز idempotency مقصد و result ambiguity را حل نمی‌کند؛ فقط تحویل پیام را مدیریت می‌کند.

Frozen Payload فضای بیشتری مصرف می‌کند و migration قرارداد را پیچیده‌تر می‌سازد. در مقابل، قابلیت بازتولید و audit دقیق می‌دهد. lease نیاز به تنظیم TTL دارد؛ کوتاه‌بودن آن باعث claim دوباره حین درخواست سالم و بلندبودن آن بازیابی crash را کند می‌کند. تمدید lease ممکن است لازم باشد، اما heartbeat نیز failure mode خودش را دارد.

در نهایت اگر مقصد هیچ کلید خارجی، lookup یا idempotency نداشته باشد، تضمین جلوگیری از تکرار کامل نیست. در این شرایط review انسانی برای unknown outcome صادقانه‌تر از retry خودکار است.

## جمع‌بندی عملی

Importer پایدار یک حلقه POST نیست. عملیات منطقی باید هویت ثابت، payload منجمد و تاریخچه attempt داشته باشد. Worker با claim کوتاه و `SKIP LOCKED` کار را می‌گیرد، درخواست را بیرون تراکنش اجرا می‌کند و فقط با شواهد معتبر وضعیت completed را ثبت می‌کند.

مهم‌ترین اصل این معماری پذیرفتن «نتیجه نامشخص» به‌عنوان state درجه‌اول است. شبکه همیشه به ما اجازه نمی‌دهد فوراً بفهمیم چه اتفاقی افتاده است. وقتی این واقعیت در مدل داده حضور داشته باشد، reconciliation، alert و review مسیر روشن دارند. وقتی پنهان شود، سیستم یا داده را جا می‌اندازد یا با retryهای بی‌احتیاط رکورد تکراری می‌سازد.

برای دیدن زمینه این معماری می‌توانید [Case Study پلتفرم داده میخوام](/projects/mikham-data-platform/)، [Mikham Ingestion API](/projects/mikham-ingestion-api/) و [Avval Scraper و Importer](/projects/avval-scraper/) را بخوانید. مقاله crawler نیز درباره نیمه دریافت داده و checkpoint توضیح می‌دهد.
