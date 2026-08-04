---
title: "ساخت Scraper قابل Resume و Importer Idempotent"
description: "چگونه دریافت داده را از ورود داده جدا کنیم تا توقف شبکه یا اجرای دوباره باعث از دست رفتن پیشرفت نشود."
pubDatetime: 2026-08-17
author: "حسین مختاری"
tags: ["Python", "Scraping", "Data Pipeline"]
featured: false
draft: true
---

این مقاله بر اساس تجربه‌ی ساخت Avval Scraper و IranTejarat Scraper تکمیل خواهد شد.

## چرا Resume مهم است؟

Crawler طولانی نباید با یک خطای شبکه از ابتدا شروع شود. برای این کار نتیجه‌ی هر
مرحله و دلیل شکست باید به‌صورت پایدار ثبت شود.

## جداسازی مسئولیت‌ها

Crawler داده‌ی منبع را دریافت و نرمال می‌کند. Importer با قرارداد و state مستقل،
داده‌ی آماده را به مقصد می‌فرستد. این جداسازی تست، retry و مشاهده‌ی خطا را ساده‌تر
می‌کند.
