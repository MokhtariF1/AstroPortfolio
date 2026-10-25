# وب‌سایت شخصی حسین مختاری

پورتفولیوی شخصی حسین مختاری روی دامنه‌ی `hosseinmokhtari.ir`.
بلاگ فعلاً با گزینهٔ `features.blog: false` غیرفعال است و محتوا نگه‌داری می‌شود.

- پایه‌ی فنی، وبلاگ، جست‌وجو، SEO و تم: AstroPaper
- ظاهر صفحه‌ی پورتفولیو: کامپوننت‌های اصلی DevPortfolio
- فارسی و راست‌چین
- خروجی استاتیک با استقرار روی Nginx

## اجرا

```bash
npm ci
npm run dev
```

## ساخت خروجی

```bash
npm run build
```

Node نسخهٔ 22.12 یا بالاتر لازم است. خروجی نهایی در `dist/` ساخته می‌شود.
راهنمای استقرار و HTTPS سرور در [docs/DEPLOY_SERVER.md](docs/DEPLOY_SERVER.md)
قرار دارد؛ راهنمای cPanel نیز در `docs/DEPLOY_CPANEL.md` نگه‌داری شده است.

## محتوا

- هویت و تنظیمات وبلاگ: `astro-paper.config.ts`
- متن پورتفولیو: `src/data/portfolio.ts`
- پروژه‌ها و Case Studyها: `src/content/projects/`
- نوشته‌ها: `src/content/portfolio-posts/`

جزئیات مجوز و منبع قالب‌ها در `NOTICE.md` ثبت شده است.
