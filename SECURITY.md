# Security policy

## Portfolio repository

این مخزن فقط سورس وب‌سایت و محتوای عمومی را نگهداری می‌کند. فایل‌های پروژه‌های
معرفی‌شده، داده‌ی مشتری، session پیام‌رسان، دیتابیس، log و فایل `.env` نباید به
این مخزن کپی شوند.

اسکریپت `npm run verify` نام فایل‌های runtime و چند الگوی رایج Credential را پیش
از Build بررسی می‌کند. این بررسی جایگزین Secret Scanner سمت GitHub نیست.

## Known external-project risks

در بررسی محلی پروژه‌ها، مواردی مثل token هاردکدشده، `.env` دنبال‌شده توسط Git،
session و دیتابیس runtime مشاهده شد. این مخزن به آن repositoryها لینک مستقیم
نمی‌دهد. پیش از عمومی‌کردن هرکدام باید Credentialها revoke، تاریخچه پاک‌سازی و
Secret Scan کامل اجرا شود.

## Reporting

گزارش امنیتی درباره‌ی خود سایت را به `hosseinmokhtari5555@gmail.com` ارسال کنید.
