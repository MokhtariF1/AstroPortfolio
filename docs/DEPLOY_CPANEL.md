# استقرار روی cPanel ایران

این سایت خروجی کاملاً استاتیک دارد و روی هاست به Node.js، PHP یا دیتابیس نیاز
ندارد.

## انتشار اولیه

1. در سیستم توسعه `npm install` و سپس `npm run build` را اجرا کنید.
2. از پوشه‌ی فعلی دامنه در cPanel یک نسخه پشتیبان بگیرید. برای دامنه اصلی این
   مسیر معمولاً `public_html` است؛ برای دامنه افزوده، مسیر Document Root همان
   دامنه را از بخش Domains بخوانید.
3. محتوای داخل `dist/` را در Document Root آپلود کنید؛ خود پوشه‌ی `dist` را
   آپلود نکنید. پس از استخراج، `index.html` باید مستقیماً در همان مسیر باشد.
4. نمایش فایل‌های مخفی را در File Manager فعال و مطمئن شوید `.htaccess` نیز
   منتقل شده است.
5. SSL دامنه را در cPanel فعال کنید.
6. این آدرس‌ها را بررسی کنید:
   - `https://hosseinmokhtari.ir/`
   - `https://hosseinmokhtari.ir/about/`
   - `https://hosseinmokhtari.ir/posts/`
   - `https://hosseinmokhtari.ir/projects/mecoin/`
   - `https://hosseinmokhtari.ir/robots.txt`
   - `https://hosseinmokhtari.ir/sitemap-index.xml`

## اتصال دامنه

- رکورد `A` دامنه‌ی اصلی به IP هاست اشاره کند.
- `www` با `CNAME` به دامنه‌ی اصلی متصل شود.
- نسخه‌ی canonical سایت بدون `www` است و `.htaccess` نسخه‌ی `www` را با 301
  منتقل می‌کند.
- تا پیش از تأیید SSL، Redirect اجباری HTTPS را فعال نکنید.

## Deploy خودکار

Workflow فعلی GitHub Actions خروجی `cpanel-dist` تولید می‌کند. پس از مشخص‌شدن
اینکه SSH هاست فعال است یا فقط FTP در دسترس است، مرحله‌ی انتشار اضافه می‌شود:

- انتخاب اول: SFTP/rsync با SSH key محدود به مسیر سایت
- جایگزین: FTPS با حساب جداگانه و دسترسی محدود به `public_html`

Credentialها فقط در GitHub Actions Secrets قرار می‌گیرند و نباید داخل فایل‌های
پروژه نوشته شوند.

## Rollback

در اولین انتشار، فایل‌های قبلی پاک نشوند؛ ابتدا در یک پوشه‌ی تاریخ‌دار Backup
شوند. برای انتشارهای خودکار آینده، یک نسخه‌ی ZIP از Artifact هر Build نگهداری
می‌شود تا بازگردانی فقط با جایگزینی خروجی قبلی انجام شود.
