---
title: "IranTejarat Scraper"
seoTitle: "Crawler قابل ادامه آگهی با Python و مسیر بازبینی"
description: "مطالعه موردی crawler و importer آگهی با snapshot، نگاشت شهر و دسته، retry کنترل‌شده و وضعیت needs_review."
category: "استخراج داده"
stack: ["Python", "HTTPX", "SQLAlchemy", "Selectolax", "Pytest"]
status: "active"
order: 5
featured: false
schemaType: "SoftwareSourceCode"
sourceNotes: ["CLIهای crawler و importer", "مدل snapshot و وضعیت needs_review"]
relatedPosts:
  - title: "ساخت Crawler قابل Resume در Python"
    href: "/posts/resumable-python-crawler/"
---

## زمینه و محدودیت

این پروژه آگهی‌های عمومی را از صفحاتی با ساختار نه‌چندان پایدار استخراج می‌کند. تکرار دانلود صفحات، تغییر markup و اختلاف میان شهر یا دسته منبع با داده مقصد می‌توانست هزینه اجرا و خطای داده ایجاد کند.

## راه‌حل

Crawler و Importer دو CLI مستقل دارند. آخرین snapshot موفق حفظ می‌شود تا خطای اجرای بعدی داده سالم را از بین نبرد. parser با Selectolax از لایه درخواست HTTP جداست؛ بنابراین fixtureهای ذخیره‌شده بدون شبکه قابل آزمون‌اند.

نگاشت شهر و دسته یک مرحله صریح است. وقتی تطبیق مطمئن نیست، رکورد به `needs_review` می‌رود و سیستم به‌جای حدس‌زدن، نیاز به تصمیم انسانی را ثبت می‌کند. نرخ درخواست، timeout و retry قابل تنظیم‌اند و checkpoint اجازه می‌دهد اجرای متوقف‌شده از نقطه امن ادامه یابد.

## آزمون و وضعیت

تست‌های Pytest روی parsing، نرمال‌سازی و transition وضعیت تمرکز دارند. حالت legacy و نسخه جدید محتوا جدا نگه داشته شده تا مهاجرت تدریجی ممکن باشد. پروژه فعال است؛ محدودیت طبیعی آن وابستگی parser به تغییرات منبع است، بنابراین fixture و هشدار کاهش نرخ استخراج برای نگهداری آن ضروری‌اند.

## درس آموخته‌شده

در استخراج داده، حفظ آخرین شواهد سالم مهم‌تر از بازنویسی فوری آن‌هاست. وضعیت بازبینی نیز شکست نیست؛ راهی است برای جلوگیری از تبدیل عدم قطعیت به داده نادرست.
