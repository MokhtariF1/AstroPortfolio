# راهبرد SEO وب‌سایت حسین مختاری

تاریخ تحقیق و تدوین: ۱۴۰۵/۰۵/۱۳ (2026-08-04)

## هدف و معیار واقع‌بینانه

هدف اصلی، تثبیت دامنه `hosseinmokhtari.ir` به‌عنوان مرجع هویت حرفه‌ای حسین مختاری و افزایش شانس دیده‌شدن برای این سه جست‌وجو است:

1. حسین مختاری
2. Hossein Mokhtari
3. حسین مختاری برنامه‌نویس

هیچ اقدام معتبر SEO رتبه اول را تضمین نمی‌کند. معیار موفقیت مرحله اول این است که صفحات درست crawl و index شوند، گوگل هویت سایت و نویسنده را یک entity منسجم تشخیص دهد و Impression/Position عبارت‌های نام در Search Console به‌مرور قابل مشاهده شود.

## منابع رسمی مبنای تصمیم‌ها

- [راهنمای محتوای people-first گوگل](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): محتوا برای انسان، مبتنی بر تجربه و دارای هدف روشن نوشته می‌شود.
- [Search Essentials فنی](https://developers.google.com/search/docs/fundamentals/get-started-developers): صفحات باید قابل خزش، دارای پاسخ HTTP درست و محتوای indexable باشند.
- [سیاست‌های Spam](https://developers.google.com/search/docs/essentials/spam-policies): تکرار مصنوعی عبارت، متن مخفی، scaled content و ادعاهای فریبنده ممنوع‌اند.
- [Title link](https://developers.google.com/search/docs/appearance/title-link) و [Snippet](https://developers.google.com/search/docs/appearance/snippet): عنوان و توضیح هر صفحه دقیق و منحصربه‌فرد است؛ گوگل ممکن است snippet دیگری از متن بسازد.
- [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): هر صفحه indexable canonical مطلق و self-referencing دارد.
- [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)، [Article](https://developers.google.com/search/docs/appearance/structured-data/article) و [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb): Schema فقط بازتاب محتوای قابل مشاهده است.
- [Image SEO](https://developers.google.com/search/docs/appearance/google-images): تصاویر محتوایی در HTML، با alt، نام توصیفی و ابعاد مشخص ارائه می‌شوند.

طول ثابت مقاله عامل رتبه‌بندی نیست. بازه ۲۲۰۰ تا ۳۲۰۰ واژه در این پروژه یک معیار تحریریه برای پوشش کامل موضوع است، نه روش دست‌کاری رتبه.

## نتیجه بررسی فضای رقابت

بررسی دستی نتایج عمومی در تاریخ سند نشان داد نام فارسی با افراد غیرمرتبط و صفحه‌های عمومی مشترک است. عبارت «حسین مختاری برنامه‌نویس» رقیب تخصصی مستقیم کمتری نسبت به نام تنها دارد. نام لاتین بسیار مبهم‌تر است و پروفایل‌های هم‌نام فراوانی در شبکه‌های حرفه‌ای دیده می‌شوند.

نتیجه عملی این تحلیل:

- صفحه اصلی باید مرجع واضح «حسین مختاری» باشد.
- صفحه درباره من باید تخصص، سابقه واقعی و نام لاتین را به هویت واحد متصل کند.
- GitHub، دامنه و byline مقاله‌ها باید نام یکسان داشته باشند.
- برای نام لاتین، تکرار عبارت کافی نیست؛ اتصال دامنه، GitHub، پروژه‌های واقعی و `sameAs` اهمیت بیشتری دارد.
- مقالات برای مسئله فنی رتبه می‌گیرند و به‌طور طبیعی اعتبار نویسنده را تقویت می‌کنند؛ نام در تیترهای نامرتبط تکرار نمی‌شود.

نتایج جست‌وجو به مکان، زمان و شخصی‌سازی وابسته‌اند. این بخش باید هر سه ماه با داده Search Console و یک بررسی بدون شخصی‌سازی به‌روز شود.

## نگاشت عبارت و صفحه

| صفحه | هدف اصلی | هدف فرعی | قاعده محتوا |
| --- | --- | --- | --- |
| `/` | حسین مختاری | Hossein Mokhtari | H1 «من حسین مختاری هستم»، معرفی کوتاه تخصص و یک اشاره طبیعی به نام لاتین |
| `/about/` | حسین مختاری برنامه‌نویس | برنامه‌نویس Python و بک‌اند | معرفی مفصل تجربه سه‌ساله، روش کار، AI مسئولانه و پروژه‌ها |
| `/projects/mecoin/` | طراحی Ledger در Laravel | رزرو بودجه و idempotency | Case Study مبتنی بر کد، بدون آمار اثبات‌نشده |
| `/projects/mikham-ai-agent/` | دستیار هوشمند فارسی | State Machine در FastAPI | اتصال به مقاله ستون و شواهد معماری |
| `/projects/mikham-data-platform/` | data pipeline با Python | crawler و importer پایدار | صفحه مرکزی پروژه‌های داده |
| مقالات | نیاز فنی جست‌وجوگر | فناوری و failure mode | تجربه دست‌اول، کد پاک‌سازی‌شده، trade-off و تست |

صفحه‌ای جدا و ضعیف فقط برای شکل‌های مختلف نام ساخته نمی‌شود؛ این کار احتمال cannibalization و محتوای کم‌ارزش را بالا می‌برد.

## معماری indexability

### Index و Follow

- خانه و درباره من
- فهرست وبلاگ و مقاله‌های منتشرشده
- هر ۱۷ Case Study پروژه

### Noindex و Follow

- جست‌وجو و 404
- آرشیو تا قبل از پنج مقاله منتشرشده
- صفحه مرکزی برچسب‌ها
- برچسب دارای کمتر از سه مقاله مفید

URLهای noindex و مسیرهای انگلیسی در sitemap نیستند. canonicalها از `https://hosseinmokhtari.ir/`، بدون `www` و با trailing slash ساخته می‌شوند. مسیرهای قدیمی `/en/*` در Apache و میزبان‌های دارای `_redirects` با 301 به مسیر فارسی منتقل می‌شوند.

## Entity و Schema

شناسه ثابت شخص در همه صفحات:

```text
https://hosseinmokhtari.ir/about/#person
```

- خانه: `WebSite` و `Person`
- درباره من: `ProfilePage` با `mainEntity: Person`
- مقاله: `BlogPosting` و `BreadcrumbList`
- پروژه: `SoftwareSourceCode` یا `CreativeWork` و `BreadcrumbList`

`alternateName` برابر `Hossein Mokhtari` و `sameAs` شامل GitHub و Telegram است. تا دریافت عکس واقعی، `Person.image` تعریف نمی‌شود. `dateModified` فقط با ویرایش واقعی frontmatter تغییر می‌کند و از زمان build ساخته نمی‌شود.

## خوشه محتوایی و تقویم اولیه

هر چهار مقاله کامل ولی draft هستند. ترتیب پیشنهادی پس از بازبینی انسانی:

| هفته | مقاله | Case Study اصلی |
| --- | --- | --- |
| ۱ | طراحی State Machine برای دستیار هوشمند فارسی | AI Business Agent و Ingestion API |
| ۲ | ساخت Crawler قابل Resume در Python | Avval و IranTejarat Scraper |
| ۳ | طراحی Importer پایدار و Idempotent با PostgreSQL | Mikham Data Platform |
| ۴ | طراحی Ledger و رزرو بودجه در Laravel | Mecoin |

انتشار خودکار بر اساس تاریخ فعال نشده است. بعد از تأیید حسین، فقط `draft` مقاله همان هفته به `false` تغییر می‌کند و تاریخ واقعی انتشار ثبت می‌شود. مقاله بعدی حداقل هفت روز بعد منتشر خواهد شد.

هر مقاله باید این کنترل کیفی را پاس کند:

- مسئله و محدودیت واقعی از کد پروژه آمده باشد.
- snippet شامل secret، endpoint خصوصی یا داده کاربر نباشد.
- راه‌حل ردشده، failure mode، تست و trade-off داشته باشد.
- حداقل یک لینک به Case Study و یک لینک به محتوای مکمل داشته باشد.
- ادعای عملکرد فقط در صورت وجود benchmark قابل بازتولید منتشر شود.
- دیاگرام و کاور دارای alt، caption، ابعاد و نام فایل توصیفی باشند.
- بازبینی انسانی لحن، صحت و امکان انتشار جزئیات را تأیید کند.

## لینک‌سازی داخلی

- خانه به همه پروژه‌ها، درباره من و وبلاگ لینک واقعی `<a href>` دارد.
- هر مقاله به Case Studyهای منبع لینک دارد.
- پس از انتشار مقاله دوم، مقاله‌های مرتبط در متن یا بخش «مطالب مرتبط» به هم لینک می‌شوند.
- صفحه پروژه مرتبط پس از انتشار مقاله باید یک لینک زمینه‌دار به مقاله دریافت کند.
- anchor text توصیفی است؛ از تکرار یکسان و مصنوعی عبارت هدف استفاده نمی‌شود.

## سیگنال‌های بیرونی موردنیاز

این موارد خارج از کد سایت و بر عهده حسین هستند:

1. نام نمایشی GitHub: `Hossein Mokhtari`
2. Bio: توضیح کوتاه و واقعی درباره Backend، Python، Automation و AI
3. Website: `https://hosseinmokhtari.ir`
4. حذف ایمیل یا توضیح قدیمی/نامرتبط
5. پین‌کردن مخزن Portfolio و پروژه‌های عمومی معتبر
6. استفاده از همین نام و دامنه در پروفایل‌های حرفه‌ای واقعی، بدون ساخت لینک انبوه یا مصنوعی

## راه‌اندازی پس از استقرار

1. بررسی 301 از HTTP و `www` به HTTPS بدون `www`.
2. ثبت property دامنه در Google Search Console.
3. ثبت `https://hosseinmokhtari.ir/sitemap-index.xml`.
4. URL Inspection خانه، درباره من و سه پروژه شاخص و درخواست index.
5. تست Schema صفحه درباره من، یک پروژه و یک مقاله منتشرشده در Rich Results Test و Schema Markup Validator.
6. بررسی Coverage، Crawl Stats و HTTPS بعد از چند روز.
7. ثبت baseline از Impression، Query، Page و Average Position؛ تصمیم بعدی بر اساس داده واقعی، نه جست‌وجوی دستی روزانه.

## چرخه اندازه‌گیری ۳۰/۶۰/۹۰ روزه

- روز ۳۰: ایندکس‌شدن URLهای canonical، نبود duplicate/noindex اشتباه و queryهای نام.
- روز ۶۰: نرخ کلیک titleها، queryهای long-tail پروژه‌ها و صفحات دارای impression بدون click.
- روز ۹۰: به‌روزرسانی title/description فقط با اتکا به query واقعی، تکمیل لینک‌های داخلی و انتخاب مقاله بعدی.

Backlink خریداری‌شده، انتشار انبوه محتوای مشابه، keyword stuffing و تغییر مداوم تاریخ مقاله در این راهبرد جایگاهی ندارند.

