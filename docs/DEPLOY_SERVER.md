# استقرار روی سرور شخصی

دامنه: https://hosseinmokhtari.ir — اتصال SSH: `pejvak-new`.
سایت استاتیک است و با Nginx اجرا می‌شود؛ روی سرور به اجرای Node یا Docker نیاز ندارد.

## ساخت و انتشار

با Node نسخهٔ 22.12 یا بالاتر:

```powershell
npm ci --no-audit --no-fund
npm run build
tar -czf "$env:TEMP/astroportfolio-dist.tar.gz" -C dist .
scp "$env:TEMP/astroportfolio-dist.tar.gz" pejvak-new:/tmp/astroportfolio-dist.tar.gz
scp deploy/release.sh pejvak-new:/tmp/hosseinmokhtari-release.sh
ssh pejvak-new 'sh /tmp/hosseinmokhtari-release.sh /tmp/astroportfolio-dist.tar.gz'
```

مسیر انتشارها `/var/www/hosseinmokhtari.ir/releases/` است.
لینک `current` به نسخهٔ فعال اشاره می‌کند و هنگام انتشار به‌صورت اتمیک تغییر می‌کند.
انتشار جدید به reload کردن Nginx نیاز ندارد. مسیر نسخهٔ قبل در
`/var/www/hosseinmokhtari.ir/previous-release` ذخیره می‌شود.

برای بازگشت به نسخهٔ قبل، روی سرور:

```sh
base=/var/www/hosseinmokhtari.ir
previous=$(cat "$base/previous-release")
test -s "$previous/index.html"
ln -s "$previous" "$base/current.rollback"
mv -Tf "$base/current.rollback" "$base/current"
```

## بلاگ

فعلاً `features.blog` در `astro-paper.config.ts` برابر `false` است.
نوشته‌ها حذف نشده‌اند. فایل‌های مسیر بلاگ در `src/blog/pages/` نگه‌داری می‌شوند
و تنها هنگام فعال‌بودن این گزینه به Astro اضافه می‌شوند.
برای انتشار بلاگ، مقدار را `true` کنید و دوباره build و deploy بگیرید.
لینک‌های منو، مقاله‌های مرتبط و RSS نیز با همین گزینه فعال می‌شوند.
بررسی خروجی، نبود مسیرهای بلاگ و سالم‌بودن لینک‌های داخلی را کنترل می‌کند.

## Nginx و HTTPS

- تنظیم نهایی: `deploy/nginx.conf`؛ روی سرور در
  `/etc/nginx/sites-available/hosseinmokhtari.ir.conf` نصب شده است.
- تنظیم موقت برای صدور اولیهٔ گواهی: `deploy/nginx-http.conf`.
- گواهی دامنه و www در `/etc/letsencrypt/live/hosseinmokhtari.ir/` قرار دارد.
- `certbot.timer` تمدید را زمان‌بندی می‌کند و hook اختصاصی پس از تمدید، Nginx را reload می‌کند.
- HTTP و www به دامنهٔ اصلی HTTPS هدایت می‌شوند.
- رکوردهای دامنه و www در Cloudflare باید به همین سرور اشاره کنند.
- برای ارتباط امن Cloudflare با سرور، SSL/TLS را روی **Full (strict)** قرار دهید.

### محدودیت ارتباط ACME هنگام استقرار اولیه

در ۲۵ اکتبر ۲۰۲۶، اتصال مستقیم این سرور به API مربوط به Let’s Encrypt
پس از برقراری TLS پاسخ نمی‌داد. گواهی با تونل موقت از سیستم توسعه صادر شد.
تمدید بدون دخالت به رفع این مشکل ارتباطی روی سرور نیاز دارد؛ صرف فعال‌بودن timer
تضمین موفقیت تمدید نیست. تا رفع مشکل، برای تمدید دستی می‌توان از همین روش استفاده کرد.

در یک ترمینال محلی:

```powershell
node deploy/acme-proxy.mjs
```

در ترمینال دوم:

```powershell
ssh -o ExitOnForwardFailure=yes -N -R 127.0.0.1:18090:127.0.0.1:18091 pejvak-new
```

در ترمینال سوم، تست تمدید فقط برای این دامنه:

```powershell
ssh pejvak-new 'HTTPS_PROXY=http://127.0.0.1:18090 certbot renew --cert-name hosseinmokhtari.ir --dry-run --run-deploy-hooks --no-random-sleep-on-renew'
```

برای تمدید واقعی هنگام نزدیک‌شدن انقضا، `--dry-run --run-deploy-hooks` را حذف کنید.
پس از پایان، هر دو فرایند محلی را متوقف کنید. این relay فقط به API تولید و
آزمایشی Let’s Encrypt اجازهٔ اتصال می‌دهد و فقط روی loopback گوش می‌کند.
هیچ کلید خصوصی از سرور خارج نمی‌شود.

## نتیجهٔ استقرار در ۲۵ اکتبر ۲۰۲۶

- نسخهٔ فعال: `/var/www/hosseinmokhtari.ir/releases/20261025T140024Z`.
- گواهی اصلی تا `2027-01-23` اعتبار دارد؛ HTTPS مستقیم سرور و از مسیر Cloudflare بررسی شد.
- هر ۱۹ صفحهٔ عمومی شامل خانه، درباره و ۱۷ پروژه پاسخ ۲۰۰ دادند.
- ۹ مسیر مربوط به بلاگ و فایل‌های پنهان پاسخ ۴۰۴ دادند؛ هر سه ریدایرکت HTTP/www نیز تأیید شدند.
- build، بررسی Astro، ESLint و بررسی metadata، sitemap و لینک‌های خروجی موفق بودند.
- build با بلاگ فعال نیز موفق بود؛ پس از آزمایش، گزینه به `false` بازگردانده شد
  و خروجی نهایی دوباره بدون بلاگ ساخته شد.
- آزمایش تمدید گواهی و hook مربوط به reload از طریق تونل موفق بود.
- سرور Ubuntu 24.04 و Nginx فعال دارد؛ هنگام بررسی حدود ۸۹ گیگابایت فضای آزاد داشت.
- دو سرویس `behtarino-enricher.service` و `pejvak-certificate.service` از قبل failed بودند.
  این‌ها مربوط به سایت شخصی نیستند و در این استقرار تغییر نکردند.

برای تکرار تست عمومی سایت در وضعیت فعلیِ بدون بلاگ:

```sh
node deploy/check-live.mjs
```

راهنمای رسمی Certbot:
https://eff-certbot.readthedocs.io/en/stable/using.html#webroot

## بررسی

```sh
nginx -t
systemctl status nginx certbot.timer --no-pager
certbot certificates --cert-name hosseinmokhtari.ir
```

لاگ‌های این سایت در `/var/log/nginx/hosseinmokhtari-access.log` و
`/var/log/nginx/hosseinmokhtari-error.log` قرار دارند.
