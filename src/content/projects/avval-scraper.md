---
title: "Avval Scraper و Importer"
seoTitle: "Crawler قابل Resume و Importer پایدار با Python"
description: "معماری یک crawler غیرهمگام برای داده‌های عمومی کسب‌وکارها با importer مستقل، PostgreSQL و workerهای هماهنگ."
category: "استخراج و ورود داده"
stack: ["Python", "PostgreSQL", "SQLAlchemy", "Alembic", "HTTPX"]
status: "production"
order: 4
featured: false
schemaType: "SoftwareSourceCode"
sourceNotes:
  [
    "مدل‌های SQLAlchemy و migrationهای Alembic",
    "claim اتمیک worker و streaming export",
  ]
---

## مسئله و هدف

Avval Scraper داده‌های عمومی کسب‌وکار را دریافت می‌کند و Importer مستقل آن‌ها را برای مقصد آماده می‌سازد. اجرای طولانی، خطای شبکه و هم‌زمانی crawler و importer سه محدودیت اصلی پروژه بودند.

## طراحی

دیتابیس داده دریافت‌شده برای Importer عملاً read-only است و state ارسال در فضای جدا نگهداری می‌شود. این جداسازی اجازه می‌دهد schema جمع‌آوری بدون دست‌کاری تاریخچه ورود تکامل پیدا کند. Workerها با تراکنش کوتاه و `FOR UPDATE SKIP LOCKED` یک کار را claim می‌کنند و عملیات شبکه بیرون از قفل طولانی انجام می‌شود.

checkpoint فقط شماره صفحه نیست؛ وضعیت رکورد و شناسه منبع نیز حفظ می‌شود تا ادامه اجرا و deduplication به ترتیب اتفاقی پاسخ وابسته نباشد. خروجی‌های بزرگ به‌شکل streaming تولید می‌شوند تا حافظه با اندازه مجموعه داده رشد خطی نداشته باشد.

## خطا و آزمون

خطاهای موقت شبکه retry محدود و backoff دارند؛ خطای قطعی داده به صف تکرار بی‌پایان بازنمی‌گردد. migration داده قدیمی و Alembic برای تغییرات schema استفاده می‌شوند. تست‌ها parser، claim هم‌زمان و انتقال وضعیت را بررسی می‌کنند.

## نتیجه

پروژه در استفاده عملی قرار گرفته و معماری آن برای توقف و ادامه طراحی شده است. درس مهم این بود که «دریافت شده» و «با موفقیت وارد شده» دو حقیقت متفاوت‌اند و نباید در یک پرچم یا جدول مبهم ادغام شوند.
