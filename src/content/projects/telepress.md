---
title: "Telepress"
seoTitle: "انتقال پایدار محتوای Telegram به WordPress"
description: "ابزار انتقال پست و رسانه از کانال‌های تلگرام به WordPress با صف پایدار، worker مستقل و ثبت وضعیت انتشار."
category: "اتوماسیون انتشار محتوا"
stack: ["Python", "Telethon", "WordPress API", "SQLAlchemy", "SQLite"]
status: "active"
order: 12
featured: false
schemaType: "SoftwareSourceCode"
sourceNotes: ["listener تلگرام و صف پردازش", "worker رسانه و WordPress API"]
---

## زمینه

Telepress پیام‌ها و رسانه‌های منتخب کانال تلگرام را به محتوای WordPress تبدیل می‌کند. رویداد تلگرام لحظه‌ای است، اما دانلود رسانه و API وردپرس می‌توانند کند یا موقتاً ناموفق باشند؛ بنابراین اجرای همه مراحل داخل listener قابل اعتماد نبود.

## معماری

Listener با Telethon فقط رویداد را دریافت، نرمال و در صف پایدار ثبت می‌کند. Worker مستقل رسانه را دانلود، متن را تبدیل و درخواست WordPress را اجرا می‌کند. شناسه کانال و پیام کلید طبیعی deduplication است و شناسه پست مقصد پس از موفقیت ذخیره می‌شود.

وضعیت‌های queued، processing، retryable، failed و published نتیجه را شفاف می‌کنند. اگر آپلود رسانه موفق و ساخت پست ناموفق باشد، رکورد مرحله انجام‌شده را حفظ می‌کند تا اجرای بعدی کار غیرضروری را تکرار نکند.

## امنیت و آزمون

اطلاعات نشست Telegram و اعتبار WordPress از مخزن جدا هستند. HTML تولیدی sanitize می‌شود و نوع/اندازه رسانه پیش از انتقال کنترل می‌گردد. تست‌ها تبدیل متن، deduplication و transition وضعیت را پوشش می‌دهند.

## وضعیت

پروژه فعال است. جداسازی ingestion از delivery مهم‌ترین تصمیم آن بود؛ listener سریع می‌ماند و شکست مقصد باعث از دست‌رفتن رویداد منبع نمی‌شود.
