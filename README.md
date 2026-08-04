# وب‌سایت شخصی حسین مختاری

پورتفولیو و وبلاگ دوزبانه‌ی حسین مختاری روی دامنه‌ی `hosseinmokhtari.ir`.

- پایه‌ی فنی، وبلاگ، جست‌وجو، SEO و تم: AstroPaper
- ظاهر صفحه‌ی پورتفولیو: کامپوننت‌های اصلی DevPortfolio
- فارسی و راست‌چین با نسخه‌ی انگلیسی
- خروجی استاتیک مناسب cPanel

## اجرا

```bash
npm install
npm run dev
```

## ساخت خروجی

```bash
npm run build
```

خروجی نهایی در `dist/` ساخته می‌شود. راهنمای استقرار در
`docs/DEPLOY_CPANEL.md` قرار دارد.

## محتوا

- هویت و تنظیمات وبلاگ: `astro-paper.config.ts`
- متن پورتفولیو: `src/data/portfolio.ts`
- پروژه‌ها و Case Studyها: `src/data/projects.ts`
- نوشته‌ها: `src/content/portfolio-posts/`

جزئیات مجوز و منبع قالب‌ها در `NOTICE.md` ثبت شده است.
