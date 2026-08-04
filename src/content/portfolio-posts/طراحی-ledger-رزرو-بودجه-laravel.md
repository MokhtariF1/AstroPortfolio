---
title: "طراحی Ledger و رزرو بودجه در Laravel برای جلوگیری از پرداخت تکراری"
description: "تجربه طراحی دفتر کل، خزانه، رزرو بودجه، policy نسخه‌دار و چرخه برداشت در یک محصول مأموریت‌محور Laravel."
pubDatetime: 2026-08-04
author: "حسین مختاری"
tags: ["Laravel", "Ledger", "دیتابیس", "هم‌زمانی"]
featured: false
draft: false
ogImage: "/images/articles/laravel-ledger-cover-16x9.svg"
---

نمایش موجودی در رابط کاربری ساده است: یک عدد از API می‌آید و کنار کیف پول قرار می‌گیرد. اما وقتی این عدد از انجام مأموریت، بودجه کمپین و درخواست برداشت تأثیر می‌گیرد، دیگر یک ستون قابل ویرایش در جدول کاربران کافی نیست. سیستم باید بتواند توضیح دهد هر واحد اعتبار از کجا آمده، تحت چه قانونی صادر شده و آیا بودجه متناظر قبلاً مصرف یا رزرو شده است.

در Mecoin با یک اقتصاد مأموریت‌محور روبه‌رو بودم. کاربر مأموریت انجام می‌داد، پاداش دریافت می‌کرد و در صورت داشتن شرایط، درخواست برداشت ثبت می‌کرد. عملیات هم‌زمان و retry می‌توانستند باعث صدور یا رزرو دوباره شوند. این مقاله مسیر طراحی ledger، treasury، budget reservation و چرخه برداشت در Laravel را توضیح می‌دهد. نمونه‌ها ساده و پاک‌سازی شده‌اند و هیچ داده مالی واقعی یا جزئیات مشتری در آن‌ها نیست.

<figure>
  <img src="/images/articles/laravel-ledger-architecture.svg" width="1200" height="675" alt="نمودار ارتباط مأموریت، policy، خزانه کمپین، رزرو بودجه، ledger و درخواست برداشت" loading="lazy" />
  <figcaption>موجودی یک نمای مشتق‌شده است؛ رویدادهای ledger و رزرو بودجه دلیل تغییر آن را نگه می‌دارند.</figcaption>
</figure>

## چرا ستون balance به‌تنهایی کافی نیست؟

فرض کنید کنترلر تکمیل مأموریت مقدار `balance` را افزایش دهد. اگر همان request به دلیل timeout از سمت client دوباره ارسال شود، موجودی دوبار زیاد می‌شود. می‌توان یک flag `rewarded` روی مأموریت گذاشت، اما دو transaction هم‌زمان ممکن است هر دو قبل از update آن را false ببینند. علاوه بر آن، فقط می‌دانیم موجودی چقدر است؛ دلیل هر تغییر، policy و بودجه پشتیبان آن گم شده‌اند.

در سیستم مالی یا شبه‌مالی، پرسش‌های زیر باید پاسخ قابل اثبات داشته باشند:

- این پاداش مربوط به کدام مأموریت و کدام کاربر است؟
- قانون پاداش در آن زمان چه نسخه‌ای داشت؟
- مبلغ از کدام خزانه یا کمپین تأمین شد؟
- آیا بخشی از بودجه رزرو شده ولی هنوز نهایی نشده است؟
- اگر عملیات لغو شد، با ثبت جبرانی برگشت یا history ویرایش شد؟
- آیا retry همان عملیات است یا یک رویداد تجاری تازه؟

Ledger برای پاسخ به این پرسش‌هاست. موجودی می‌تواند cache یا projection باشد، اما رویداد ثبت‌شده منشأ تغییر را حفظ می‌کند.

## مدل دامنه: Account، Entry و Transaction

نسخه دقیق ledger به نیاز محصول بستگی دارد. برای این پروژه مفاهیم اصلی عبارت بودند از حساب، تراکنش منطقی و entryهای تغییر. هر عملیات تجاری یک شناسه یکتا دارد و entryها به آن متصل‌اند. مقدار با عدد صحیح در کوچک‌ترین واحد نگهداری می‌شود؛ float برای ارزش مالی مناسب نیست.

یک مدل ساده‌شده Laravel می‌تواند چنین invariantهایی داشته باشد:

```php
final class LedgerService
{
    public function creditReward(
        Account $account,
        RewardDecision $decision,
        string $operationKey,
    ): LedgerTransaction {
        return DB::transaction(function () use ($account, $decision, $operationKey) {
            $existing = LedgerTransaction::query()
                ->where('operation_key', $operationKey)
                ->first();

            if ($existing) {
                return $existing;
            }

            $lockedAccount = Account::query()
                ->lockForUpdate()
                ->findOrFail($account->id);

            return $this->recordCredit($lockedAccount, $decision, $operationKey);
        });
    }
}
```

این snippet همه جزئیات را نشان نمی‌دهد. unique index روی `operation_key` ضروری است؛ check داخل transaction به‌تنهایی در همه raceها کافی نیست. اگر دو request هم‌زمان نبود رکورد را ببینند، دیتابیس باید درج دوم را رد کند و سرویس نتیجه عملیات موجود را بازیابی کند.

در دفتر کل double-entry کلاسیک، مجموع debit و credit هر transaction صفر است. حتی اگر محصول رابط ساده‌ای دارد، نگاه دوطرفه به انتقال ارزش کمک می‌کند منشأ و مقصد روشن بمانند. برای نمونه صدور پاداش می‌تواند انتقال از خزانه کمپین به حساب کاربر باشد، نه ایجاد عدد از هیچ.

## خزانه و تفاوت available، reserved و spent

بودجه کمپین یک عدد واحد نیست. بخشی ممکن است آزاد، بخشی برای عملیات در حال انجام رزرو و بخشی نهایی مصرف شده باشد. اگر فقط `remaining_budget` کم شود، لغو یا timeout مسیر مبهمی ایجاد می‌کند.

مدل مفهومی من سه مقدار را از رویدادها یا projection دنبال می‌کند:

- **available:** ظرفیتی که هنوز می‌توان رزرو کرد.
- **reserved:** ظرفیت متصل به عملیات باز که دیگر برای عملیات دیگر آزاد نیست.
- **spent:** مقدار نهایی‌شده که رویداد مالی متناظر دارد.

قانون اصلی این است که `available` هیچ‌گاه منفی نشود و هر reservation یک owner و operation key داشته باشد. رزرو در transaction با lock مناسب انجام می‌شود. بررسی موجودی بیرون transaction و سپس update، race کلاسیک check-then-act است.

```php
public function reserve(
    CampaignTreasury $treasury,
    int $amount,
    string $operationKey,
): BudgetReservation {
    return DB::transaction(function () use ($treasury, $amount, $operationKey) {
        $treasury = CampaignTreasury::query()
            ->lockForUpdate()
            ->findOrFail($treasury->id);

        $existing = BudgetReservation::query()
            ->where('operation_key', $operationKey)
            ->first();
        if ($existing) {
            return $existing;
        }

        if ($treasury->available_amount < $amount) {
            throw new InsufficientBudget();
        }

        $treasury->decrement('available_amount', $amount);
        $treasury->increment('reserved_amount', $amount);

        return $treasury->reservations()->create([
            'amount' => $amount,
            'operation_key' => $operationKey,
            'state' => 'active',
        ]);
    });
}
```

ترتیب lockها باید در همه سرویس‌ها یکسان باشد تا احتمال deadlock کاهش یابد. اگر عملیات چند خزانه را لمس می‌کند، شناسه‌ها به ترتیب ثابت lock می‌شوند. deadlock ممکن است با وجود طراحی خوب رخ دهد؛ transaction باید retry محدود و آگاهانه داشته باشد، بدون آنکه operation key تازه بسازد.

## چرخه عمر Reservation

Reservation فقط active و deleted نیست. وضعیت‌های مفهومی شامل active، committed، released و expired بودند. commit یعنی اثر تجاری نهایی شده و مبلغ از reserved به spent منتقل می‌شود. release یعنی عملیات لغو یا رد شده و ظرفیت به available برمی‌گردد. expiry برای رزروی است که مدت مجاز آن گذشته، اما آزادسازی باید با اطمینان از نبود عملیات در حال commit انجام شود.

ویرایش مستقیم state بدون سرویس دامنه خطرناک است. هر transition هم ledger یا تغییر خزانه متناظر دارد و باید اتمیک باشد. برای مثال release دوباره نباید بودجه را دوبار آزاد کند. operation و unique constraint تضمین می‌کنند transition تکراری همان نتیجه قبلی را برگرداند.

من حذف فیزیکی reservation را انتخاب مناسبی نمی‌دانم، چون تاریخچه تصمیم از بین می‌رود. state نهایی، زمان و علت آزادسازی برای audit باقی می‌ماند. اگر حجم داده بالا رفت، archive راه بهتری از حذف شواهد مالی است.

## Policy نسخه‌دار؛ قانون امروز نباید گذشته را بازنویسی کند

مبلغ پاداش ممکن است با نوع مأموریت، کمپین یا زمان تغییر کند. اگر ledger فقط به جدول policy جاری join شود، ویرایش policy باعث می‌شود نتوان فهمید تصمیم قدیمی با چه قانونی گرفته شده است.

در زمان تصمیم، `policy_version` و داده‌های مؤثر یا snapshot محدود policy کنار RewardDecision ذخیره می‌شوند. هدف کپی کل تنظیمات نیست؛ باید حداقل اطلاعات لازم برای بازسازی دلیل مبلغ حفظ شود. policy منتشرشده immutable است و تغییر بعدی نسخه تازه می‌سازد.

این طراحی امکان پاسخ به اختلاف را فراهم می‌کند. اگر کاربر بپرسد چرا پاداش قدیمی با امروز فرق دارد، transaction به نسخه قانون خودش متصل است. همچنین rollout policy جدید قابل کنترل می‌شود و worker قدیمی ناخواسته rule تازه را وسط عملیات اعمال نمی‌کند.

## Idempotency Key از رویداد تجاری می‌آید

ساخت UUID در هر HTTP request idempotency ایجاد نمی‌کند. کلید باید هویت رویداد تجاری باشد؛ برای نمونه `mission-completion:{user_id}:{mission_id}:{cycle}`. ساختار واقعی باید privacy و امکان حدس را در نظر بگیرد، اما معنای آن ثابت است: تکمیل یک مأموریت مشخص در یک دوره مشخص.

کلید روی transaction و reservation unique است. retry controller، queue job یا webhook همان کلید را می‌فرستد. اگر operation قبلاً completed است، همان نتیجه بازگردانده می‌شود. اگر processing یا unknown باشد، سرویس آن را عملیات تازه تلقی نمی‌کند.

انتخاب granularity کلید مهم است. اگر مأموریت واقعاً چندبار قابل انجام است، حذف cycle پاداش‌های معتبر بعدی را مسدود می‌کند. اگر cycle از timestamp هر request ساخته شود، retry کلید متفاوت می‌گیرد. domain باید دقیقاً تعریف کند «یک بار» یعنی چه.

## مرز تراکنش و ارسال Job

گاهی پس از commit مالی باید notification یا پیام ارسال شود. اگر Job قبل از commit dispatch شود، worker ممکن است رکوردی را بخواند که هنوز commit نشده یا بعداً rollback می‌شود. Laravel امکان dispatch after commit را دارد و برای این موارد مفید است.

برعکس، قرار دادن تماس HTTP خارجی داخل transaction مالی lock را طولانی می‌کند. الگوی outbox راه بهتری است: در همان transaction یک رویداد outbox ثبت می‌شود و worker بعداً آن را ارسال می‌کند. outbox نیز idempotency و وضعیت تحویل خودش را دارد.

این معماری consistency فوری همه سیستم‌ها را وعده نمی‌دهد. ledger و reservation داخل دیتابیس اصلی اتمیک‌اند، اما notification eventually consistent است. رابط باید این تفاوت را بشناسد و شکست پیام را معادل شکست پاداش نمایش ندهد.

## چرخه برداشت وجه

برداشت حساس‌تر از پاداش نمایشی است و باید workflow صریح داشته باشد. وضعیت‌های مفهومی شامل requested، under_review، approved، rejected، processing، paid و failed هستند. transitionها مجوز، پیش‌شرط و actor مشخص دارند.

هنگام درخواست، مقدار قابل برداشت باید در transaction بررسی و hold یا reservation متناظر ساخته شود. اگر فقط balance بررسی شود ولی نگه داشته نشود، کاربر می‌تواند چند درخواست هم‌زمان ثبت کند. unique rule برای درخواست فعال و lock حساب جلوی مصرف چندباره ظرفیت را می‌گیرند.

تأیید مدیر به‌تنهایی نباید پرداخت خارجی را داخل همان request طولانی اجرا کند. یک operation پایدار ساخته می‌شود و worker با idempotency key پرداخت را انجام می‌دهد. timeout سرویس پرداخت به state نامشخص می‌رود و پیش از retry نیازمند استعلام است. پس از اثبات پرداخت، ledger نهایی و hold مصرف می‌شود.

رد درخواست hold را آزاد می‌کند، اما تاریخچه درخواست و actor باقی می‌ماند. ویرایش مستقیم status در دیتابیس مسیر پذیرفته‌شده نیست؛ command دامنه باید invariant مالی را همراه transition اجرا کند.

## مجوز و امنیت

کاربر نباید مبلغ پاداش یا حساب خزانه را در payload تعیین کند. ورودی فقط شناسه عملیات مجاز را ارائه می‌کند و سرور مبلغ را از policy نسخه‌دار محاسبه می‌کند. Policyهای Laravel مجوز دیدن یا تغییر درخواست برداشت را کنترل می‌کنند، ولی invariant مالی در سرویس دامنه نیز enforce می‌شود.

مقادیر مالی به‌صورت integer و currency/asset صریح ذخیره می‌شوند. ترکیب دارایی‌های متفاوت در یک balance بدون نوع، خطای دامنه است. mass assignment محدود می‌شود و model event جادویی برای عملیات اصلی مالی انتخاب خوبی نیست؛ جریان باید در service قابل دنبال‌کردن باشد.

لاگ‌ها operation key و transaction id را دارند، اما اطلاعات پرداخت و داده شخصی کامل را نمایش نمی‌دهند. دسترسی مدیر به workflow ثبت ممیزی می‌شود. rate limiting و احراز هویت جلوی retry مخرب را کامل نمی‌گیرند، ولی سطح حمله را کاهش می‌دهند؛ دفاع نهایی همان idempotency و invariant دیتابیس است.

## روش تست

تست مالی فقط بررسی status 200 نیست. invariantها باید مستقیم آزموده شوند:

- اجرای دوباره completion با یک operation key فقط یک reward می‌سازد.
- دو درخواست موازی بیشتر از available budget رزرو نمی‌کنند.
- release تکراری available را دوبار افزایش نمی‌دهد.
- commit فقط reservation active را مصرف می‌کند.
- تغییر policy جاری، مبلغ transaction گذشته را عوض نمی‌کند.
- کاربر نمی‌تواند مبلغ محاسبه‌شده سمت سرور را override کند.
- دو درخواست برداشت هم‌زمان ظرفیت یکسان را مصرف نمی‌کنند.
- شکست notification پس از commit، ledger را rollback نمی‌کند.

برای concurrency، دو connection دیتابیس و barrier لازم است تا هر دو عملیات تقریباً هم‌زمان به نقطه بحرانی برسند. اجرای sequential همان bug را آشکار نمی‌کند. تست Feature Laravel برای endpoint مفید است، اما تست service با دیتابیس واقعی نیز باید constraint و lock را پوشش دهد.

Property-based thinking حتی بدون ابزار خاص کمک می‌کند. بعد از هر دنباله reserve، release و commit باید رابطه خزانه برقرار باشد و هیچ مقدار منفی نشود. مجموع entryهای transaction دوطرفه باید invariant خودش را حفظ کند.

تست E2E با Playwright روی مسیر کاربر و مدیر تمرکز دارد: نمایش موجودی، ثبت درخواست، عدم امکان ثبت دوباره و نمایش وضعیت. اما Playwright جای تست race دیتابیس را نمی‌گیرد؛ هر سطح تست سؤال متفاوتی دارد.

## Failure modeهای مهم

1. **درخواست completion تکراری:** unique operation key نتیجه قبلی را برمی‌گرداند.
2. **deadlock دیتابیس:** transaction محدود با همان کلید retry می‌شود؛ عملیات تازه ساخته نمی‌شود.
3. **Job پس از commit دوبار اجرا می‌شود:** handler outbox idempotent است.
4. **رزرو فعال بدون ادامه می‌ماند:** sweeper پس از مهلت و بررسی state آن را آزاد یا برای review علامت می‌زند.
5. **پرداخت timeout می‌دهد:** درخواست به paid یا failed حدسی نمی‌رود؛ reconciliation لازم است.
6. **policy میان شروع و commit تغییر می‌کند:** RewardDecision به نسخه انتخاب‌شده متصل می‌ماند.
7. **projection موجودی خراب می‌شود:** ledger امکان محاسبه و reconciliation را فراهم می‌کند.

آخرین مورد دلیل دیگری است که ledger را منبع شواهد می‌دانم. projection برای سرعت مفید است، اما باید بتوان اختلاف آن با entryها را تشخیص داد. command دوره‌ای reconciliation حساب‌های ناسازگار را گزارش می‌کند و اصلاح خودکار بدون ثبت جبرانی انجام نمی‌شود.

## راه‌حل‌های ردشده

**افزایش مستقیم balance در controller** به دلیل نبود audit و race کنار گذاشته شد.

**یک جدول transaction با مقدار signed بدون منشأ و operation** برای گزارش ساده بود، اما انتقال میان خزانه و کاربر را خوب توضیح نمی‌داد.

**حذف رکورد هنگام rollback تجاری** تاریخچه را از بین می‌برد. entry یا transition جبرانی انتخاب شد.

**اعتماد به queue برای exactly-once** اشتباه بود. queue ممکن است Job را دست‌کم یک‌بار تحویل دهد؛ handler باید idempotent باشد.

**قفل application-level بدون constraint دیتابیس** در چند process قابل اتکا نبود. lock و unique index نزدیک منبع حقیقت قرار گرفتند.

## trade-off و محدودیت‌ها

Ledger جدول‌ها و کد بیشتری نسبت به balance ساده دارد. query گزارش نیز پیچیده‌تر می‌شود و تیم باید مفهوم operation، entry و reservation را درست بفهمد. برای یک امتیاز تزئینی بدون ارزش و بدون برداشت، این هزینه شاید ضروری نباشد. انتخاب باید متناسب با ریسک محصول باشد.

نگهداری balance projection نیازمند reconciliation است. محاسبه موجودی فقط از کل ledger در هر request می‌تواند کند باشد، ولی cache بدون کنترل هم خطر drift دارد. این پروژه projection تراکنشی همراه امکان بازسازی را ترجیح داد.

MySQL و PostgreSQL جزئیات lock و isolation متفاوت دارند. تکیه بر رفتار پیش‌فرض بدون تست روی موتور واقعی اشتباه است. ترتیب lock، index و طول transaction باید با query plan و بار واقعی بررسی شوند. مقاله حاضر ادعای عدد عملکرد ارائه نمی‌کند، چون benchmark معتبر محیط تولید برای انتشار ندارم.

## جمع‌بندی عملی

وقتی پاداش به بودجه واقعی و برداشت متصل است، موجودی فقط خروجی سیستم است، نه تمام حقیقت آن. Ledger دلیل تغییر، خزانه منشأ ارزش و reservation ظرفیت در حال مصرف را مشخص می‌کنند. Policy نسخه‌دار اجازه می‌دهد تصمیم گذشته با قانون امروز بازنویسی نشود و operation key تکرار request یا Job را به اثر مالی دوم تبدیل نکند.

تراکنش کوتاه، lock با ترتیب ثابت و unique constraint از raceهای دیتابیس محافظت می‌کنند. تماس خارجی باید بیرون مرز تراکنش و از طریق outbox/worker انجام شود. برای پرداخت نیز timeout به معنی شکست قطعی نیست و وضعیت نامشخص نیازمند reconciliation است.

این طراحی نسخه جهانی کیف پول نیست و برای هر محصول کوچک لازم نمی‌شود. اما اگر سیستم باید به پرسش «این پول چرا و چند بار جابه‌جا شد؟» پاسخ قابل اثبات بدهد، ثبت رویداد و مرز عملیات از یک ستون balance قابل اعتمادتر است.

شرح کوتاه محصول در [Case Study پروژه Mecoin](/projects/mecoin/) قرار دارد. [مقاله Importer پایدار و Idempotent](/posts/طراحی-importer-idempotent-postgresql/) نیز الگوی مشابه نتیجه نامشخص را در ارتباط با API خارجی بررسی می‌کند.
