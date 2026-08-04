# بازبینی محتوای عمومی پیش از انتشار

Case Studyها و مقاله‌ها از روی ساختار کد، مدل‌ها، routeها، تست‌ها و README پروژه‌های محلی نوشته شده‌اند. با این حال مالک پروژه باید قبل از انتشار عمومی، نام، وضعیت و امکان اشاره به هر تصمیم را تأیید کند.

## وضعیت ۱۷ Case Study

| گروه | پروژه‌ها | مورد تأیید انسانی |
| --- | --- | --- |
| اقتصاد و محصول | Mecoin | نام عمومی، وضعیت active، امکان اشاره به ledger، بودجه و برداشت |
| AI و داده میخوام | AI Agent، Data Platform، Ingestion API، Zivana | مرز اطلاعات عمومی، وضعیت فعلی و نام سرویس‌ها |
| Crawler | Avval، IranTejarat، Google Maps | مجازبودن نام عمومی منابع و درست‌بودن وضعیت production/active |
| ربات‌های میخوام | Rubika Bot، Marketing، Mobile PWA | نام محصول، نقش حسین و وضعیت انتشار |
| انتقال محتوا | Telepress، TeleRubiSender، Simple Ads Bot | امکان ذکر Telegram، Rubika و WordPress و وضعیت استفاده |
| ابزارها | ChapYar، Rubika Uploader | نام عمومی، کامل‌بودن و stack نهایی |
| وب‌سایت | Mikham CEO Profile | نام عمومی پروژه، نقش و امکان اشاره به فناوری‌ها |

## چهار مقاله draft

- [ ] State Machine: transitionها، revision، confirmation و idempotency با نسخه واقعی کد تطابق دارند.
- [ ] Crawler: snapshot، lease، retry و جداسازی importer با پروژه‌های Avval/IranTejarat تطابق دارند.
- [ ] Importer: Frozen Payload، `SKIP LOCKED` و unknown outcome جزئیات محرمانه مقصد را آشکار نمی‌کنند.
- [ ] Ledger: مدل خزانه، reservation، policy و برداشت با Mecoin تطابق دارد.
- [ ] snippetها برای انتشار عمومی یک بار دستی بررسی شده‌اند.
- [ ] تاریخ انتشار به روز واقعی انتشار تغییر کرده است.
- [ ] فقط مقاله هفته جاری از `draft: true` به `draft: false` تغییر کرده است.

## اطلاعاتی که عمداً منتشر نشده‌اند

- endpoint خصوصی، token، session و credential
- نام و اطلاعات مشتری یا کاربر
- شماره تلفن، شناسه فردی و داده واقعی آگهی‌ها
- repository خصوصی و مسیرهای runtime
- آمار درآمد، کاربر، سرعت یا درصد بهبود بدون سند قابل بازتولید
- تصویر شخصی placeholder یا ساخته‌شده

## اطلاعات مفید برای نسخه بعدی

- عکس واقعی حسین برای ProfilePage و Open Graph
- screenshot پاک‌سازی‌شده از پروژه‌های شاخص
- بازه زمانی تقریبی هر پروژه
- نقش دقیق در پروژه‌هایی که همکار دیگری داشته‌اند
- benchmark یا نتیجه اندازه‌گیری‌شده با روش و تاریخ مشخص
- سابقه تحصیلی یا کاری در صورت تمایل به انتشار

پس از هر تأیید، فقط همان تغییر محتوایی در commit جدا ثبت می‌شود تا تاریخچه بازبینی قابل پیگیری باشد.
