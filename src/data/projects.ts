export type LocalizedText = { fa: string; en: string };

export type Project = {
  slug: string;
  title: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  architecture: { fa: string[]; en: string[] };
  stack: string[];
  featured?: boolean;
  status: "production" | "active" | "completed" | "prototype";
};

export const projects: Project[] = [
  {
    slug: "mecoin",
    title: { fa: "Mecoin؛ اقتصاد مأموریت‌محور", en: "Mecoin Mission Economy" },
    category: { fa: "محصول فول‌استک", en: "Full-stack product" },
    summary: {
      fa: "یک PWA مأموریت‌محور با کیف پول، پاداش، کمپین، رتبه‌بندی و جریان کنترل‌شده‌ی برداشت وجه.",
      en: "A mission-driven PWA with wallets, rewards, campaigns, leaderboards and controlled withdrawal workflows.",
    },
    challenge: {
      fa: "صدور اعتبار نقدی باید فقط از بودجه‌ی واقعی کمپین انجام می‌شد و عملیات هم‌زمان نمی‌توانست باعث پرداخت یا رزرو تکراری شود.",
      en: "Cash issuance had to remain backed by campaign budgets while concurrent operations could not create duplicate reservations or payouts.",
    },
    solution: {
      fa: "اقتصاد سیستم با policy version، خزانه، ledger و budget reservation طراحی شد و برداشت‌ها از چرخه‌ی بررسی دستی عبور می‌کنند.",
      en: "The economy uses versioned policies, treasuries, a ledger and budget reservations, while withdrawals follow a manual review lifecycle.",
    },
    architecture: {
      fa: ["Laravel 12 API و احراز هویت Sanctum", "Vue 3 PWA با Pinia و Vue Router", "سرویس‌های مجزای اقتصاد، مأموریت، ویدئو و برداشت", "تست هم‌زمانی، امنیت، Feature و Playwright E2E"],
      en: ["Laravel 12 API with Sanctum authentication", "Vue 3 PWA with Pinia and Vue Router", "Dedicated economy, mission, video and withdrawal services", "Concurrency, security, feature and Playwright E2E tests"],
    },
    stack: ["Laravel 12", "PHP 8.3", "Vue 3", "MySQL", "Docker", "Playwright"],
    featured: true,
    status: "active",
  },
  {
    slug: "mikham-ai-agent",
    title: { fa: "دستیار هوشمند ثبت کسب‌وکار", en: "AI Business Registration Agent" },
    category: { fa: "هوش مصنوعی و بک‌اند", en: "AI and backend" },
    summary: {
      fa: "دستیار مکالمه‌ای فارسی برای جمع‌آوری، تکمیل و ثبت کنترل‌شده‌ی اطلاعات کسب‌وکار در میخوام.",
      en: "A Persian conversational agent that collects, enriches and safely submits business listings to Mikham.",
    },
    challenge: {
      fa: "گفت‌وگوی طبیعی باید به داده‌ی ساخت‌یافته تبدیل می‌شد، بدون اینکه اطلاعات ناقص یا حدسی مستقیماً وارد سامانه شود.",
      en: "Natural conversation had to become structured data without allowing incomplete or speculative information into production.",
    },
    solution: {
      fa: "یک state machine نسخه‌دار، Listing Draft، اعتبارسنجی فیلدها و لایه‌ی تأیید صریح پیش از فراخوانی Importer پیاده‌سازی شد.",
      en: "A versioned state machine, listing draft, field validation and explicit confirmation gate were implemented before importer submission.",
    },
    architecture: {
      fa: ["FastAPI و Pydantic برای قراردادهای Type-safe", "حافظه‌ی اتمیک هر Session و mutationهای نسخه‌دار", "حل دسته‌بندی و شهر با API مقصد", "Idempotency Key و پذیرش موفقیت فقط با شناسه‌ی معتبر"],
      en: ["FastAPI and Pydantic type-safe contracts", "Atomic per-session memory and versioned mutations", "Destination-aware category and city resolution", "Idempotency keys and strict success verification"],
    },
    stack: ["Python", "FastAPI", "Pydantic", "OpenAI API", "HTTPX", "Laravel"],
    featured: true,
    status: "active",
  },
  {
    slug: "mikham-data-platform",
    title: { fa: "پلتفرم دریافت و ورود داده‌ی میخوام", en: "Mikham Data Acquisition Platform" },
    category: { fa: "Data Pipeline", en: "Data pipeline" },
    summary: {
      fa: "مجموعه‌ای از crawlerها و importerهای پایدار برای جمع‌آوری، نرمال‌سازی و ورود داده‌ی کسب‌وکارها.",
      en: "A suite of resilient crawlers and importers for collecting, normalizing and ingesting business data.",
    },
    challenge: {
      fa: "حجم زیاد داده، توقف‌های شبکه، تغییر ساختار منابع و نتیجه‌ی نامشخص درخواست‌های ثبت، نیازمند جریان قابل ادامه و قابل مشاهده بود.",
      en: "Large datasets, network interruptions, changing sources and ambiguous submission outcomes required an observable, resumable pipeline.",
    },
    solution: {
      fa: "دریافت و ورود داده از هم جدا شد؛ state پایدار، deduplication، صف، dry-run و وضعیت‌های بازبینی و نتیجه‌ی نامشخص اضافه شدند.",
      en: "Acquisition and ingestion were separated with durable state, deduplication, queues, dry runs and review/unknown-outcome states.",
    },
    architecture: {
      fa: ["Crawlerهای Async و قابل Resume", "Importerهای Idempotent با payload ثابت", "PostgreSQL و قفل SKIP LOCKED برای Workerها", "ابزارهای doctor، status، validation و export"],
      en: ["Async resumable crawlers", "Idempotent importers with frozen payloads", "PostgreSQL SKIP LOCKED worker coordination", "Doctor, status, validation and export tooling"],
    },
    stack: ["Python", "SQLAlchemy", "PostgreSQL", "FastAPI", "Playwright", "Docker"],
    featured: true,
    status: "production",
  },
  {
    slug: "avval-scraper",
    title: { fa: "Avval Scraper و Importer", en: "Avval Scraper and Importer" },
    category: { fa: "استخراج داده", en: "Data extraction" },
    summary: { fa: "اسکرپر غیرهمگام و قابل ادامه برای داده‌های عمومی کسب‌وکارها با importer مستقل و پایدار.", en: "An asynchronous resumable public-business-data scraper with an independent, durable importer." },
    challenge: { fa: "Crawler و importer باید هم‌زمان کار می‌کردند، بدون قفل طولانی دیتابیس یا ثبت تکراری آگهی.", en: "Crawler and importer needed to work concurrently without long database locks or duplicate listings." },
    solution: { fa: "دیتابیس مبدأ read-only، state جداگانه‌ی importer و claim اتمیک Workerها طراحی شد.", en: "A read-only source database, separate importer state and atomic worker claims were designed." },
    architecture: { fa: ["SQLAlchemy 2 Async", "PostgreSQL و Alembic", "FOR UPDATE SKIP LOCKED", "خروجی streaming و migration داده‌های قدیمی"], en: ["SQLAlchemy 2 async", "PostgreSQL and Alembic", "FOR UPDATE SKIP LOCKED", "Streaming export and legacy data migration"] },
    stack: ["Python", "PostgreSQL", "SQLAlchemy", "Alembic", "HTTPX"], status: "production",
  },
  {
    slug: "iran-tejarat-scraper",
    title: { fa: "IranTejarat Scraper", en: "IranTejarat Scraper" },
    category: { fa: "استخراج داده", en: "Data extraction" },
    summary: { fa: "Crawler قابل Resume و importer آگهی با نگاشت دسته و شهر و مسیر بازبینی داده‌های ناسازگار.", en: "A resumable listing crawler and importer with category/city mapping and review flows for conflicting data." },
    challenge: { fa: "بازیابی چندباره صفحات و اختلاف دسته یا شهر می‌توانست هزینه و خطای داده ایجاد کند.", en: "Repeated page fetches and category or city conflicts could create unnecessary cost and data errors." },
    solution: { fa: "Snapshot موفق حفظ می‌شود و تعارض جدی به‌جای ثبت خودکار وارد وضعیت needs_review می‌شود.", en: "Successful snapshots are retained and serious conflicts move to needs_review instead of automatic submission." },
    architecture: { fa: ["CLI مستقل crawler و importer", "SQLite مرکزی با مسیر ارتقا", "Retry و نرخ درخواست قابل تنظیم", "حالت محتوای legacy و V2"], en: ["Independent crawler and importer CLIs", "Central SQLite database with upgrades", "Configurable retries and request rate", "Legacy and V2 content modes"] },
    stack: ["Python", "HTTPX", "SQLAlchemy", "Selectolax", "Pytest"], status: "active",
  },
  {
    slug: "google-maps-scraper",
    title: { fa: "Google Maps Data Stack", en: "Google Maps Data Stack" },
    category: { fa: "اتوماسیون داده", en: "Data automation" },
    summary: { fa: "پشته‌ی Scraper، importer، API مرکزی و برنامه‌ی دسکتاپ برای پردازش داده‌های مکانی.", en: "A scraper, importer, central API and desktop client stack for processing location data." },
    challenge: { fa: "اجزای scraping، ذخیره‌سازی، درخواست و ورود داده باید مستقل اما قابل هماهنگی باقی می‌ماندند.", en: "Scraping, storage, requesting and ingestion components needed to remain independent yet coordinated." },
    solution: { fa: "Entrypointهای تمیز و سرویس‌های مستقل با API مرکزی، PostgreSQL و استقرار Docker ایجاد شد.", en: "Clean entrypoints and separate services were connected through a central API, PostgreSQL and Docker deployment." },
    architecture: { fa: ["Playwright scraper", "FastAPI requester/status service", "PostgreSQL و Alembic", "Desktop client با Flet"], en: ["Playwright scraper", "FastAPI requester/status service", "PostgreSQL and Alembic", "Flet desktop client"] },
    stack: ["Python", "Playwright", "FastAPI", "PostgreSQL", "Docker", "Flet"], status: "active",
  },
  {
    slug: "mikham-rubika-bot",
    title: { fa: "ربات روبیکای میخوام", en: "Mikham Rubika Bot" },
    category: { fa: "ربات و اتوماسیون", en: "Bot and automation" },
    summary: { fa: "رابط روبیکا برای احراز هویت، مشاهده آگهی‌ها، خدمات و استفاده از دستیار ثبت کسب‌وکار.", en: "A Rubika interface for authentication, listings, services and the AI business-registration assistant." },
    challenge: { fa: "چند جریان مکالمه و احراز هویت نباید state یکدیگر را آلوده می‌کردند.", en: "Multiple conversational and authentication flows had to avoid leaking state into each other." },
    solution: { fa: "Handlerهای دامنه‌ای، stateهای مجزا و سرویس API مرکزی برای ارتباط با سامانه طراحی شد.", en: "Domain handlers, isolated states and a central API service were introduced." },
    architecture: { fa: ["Rubpy BotClient", "Handlerهای مستقل", "SQLAlchemy Async", "اتصال به Custom Ad API"], en: ["Rubpy BotClient", "Independent handlers", "Async SQLAlchemy", "Custom Ad API integration"] },
    stack: ["Python", "Rubpy", "SQLAlchemy", "SQLite", "REST API"], status: "active",
  },
  {
    slug: "mikham-marketing",
    title: { fa: "سامانه‌ی بازاریابی و Attribution میخوام", en: "Mikham Marketing and Attribution" },
    category: { fa: "ماژول Laravel", en: "Laravel module" },
    summary: { fa: "ماژول QR، ثبت کلیک، امتیازدهی، پاداش، گزارش مدیریتی و پیامک پس از انتشار آگهی.", en: "A QR, click attribution, rating, reward, admin reporting and post-publish SMS module." },
    challenge: { fa: "نسبت‌دادن مراجعه و پاداش به کمپین باید قابل گزارش و قابل کنترل باشد.", en: "Visits and rewards needed controlled, reportable attribution to campaigns." },
    solution: { fa: "مدل‌های attribution، click، review، reward rule و jobهای پیامک از رابط عمومی و مدیریت جدا شدند.", en: "Attribution, click, review and reward-rule models were separated from public/admin interfaces and SMS jobs." },
    architecture: { fa: ["Laravel models و migrations", "پنل مدیریت اختصاصی", "Job غیرهمگام پیامک", "QR links و گزارش Attribution"], en: ["Laravel models and migrations", "Dedicated admin panel", "Asynchronous SMS job", "QR links and attribution reports"] },
    stack: ["Laravel", "PHP", "Livewire", "Blade", "Queue"], status: "completed",
  },
  {
    slug: "mikham-mobile-pwa",
    title: { fa: "Mikham Mobile PWA", en: "Mikham Mobile PWA" },
    category: { fa: "وب موبایل", en: "Mobile web" },
    summary: { fa: "پوسته‌ی موبایل‌اول و قابل نصب برای سایت میخوام با مسیر انتشار TWA اندروید.", en: "A mobile-first installable shell for Mikham with an Android TWA release path." },
    challenge: { fa: "تجربه‌ی وب باید بدون بازنویسی کامل اپلیکیشن روی موبایل نصب‌پذیر می‌شد.", en: "The web experience needed to become installable without a full native rewrite." },
    solution: { fa: "Manifest، service worker، بسته‌ی انتشار و تنظیمات TWA در یک خروجی استاتیک فراهم شد.", en: "A manifest, service worker, release package and TWA configuration were provided as a static output." },
    architecture: { fa: ["Mobile-first shell", "Service worker و manifest", "Static packaging", "Android Digital Asset Links"], en: ["Mobile-first shell", "Service worker and manifest", "Static packaging", "Android Digital Asset Links"] },
    stack: ["JavaScript", "PWA", "Service Worker", "TWA"], status: "completed",
  },
  {
    slug: "mikham-ingestion-api",
    title: { fa: "Mikham Ingestion API", en: "Mikham Ingestion API" },
    category: { fa: "یکپارچه‌سازی و مهاجرت داده", en: "Integration and migration" },
    summary: { fa: "قراردادها و ابزارهای انتقال آگهی میان سامانه‌های WordPress و Laravel با کنترل اعتبار داده و رسانه.", en: "Contracts and tools for moving listings between WordPress and Laravel with data and media validation." },
    challenge: { fa: "ساختار آگهی، taxonomy، شهر، رسانه و شناسه‌های خارجی در دو سامانه یکسان نبود و مهاجرت باید قابل ادامه باقی می‌ماند.", en: "Listing fields, taxonomies, cities, media and external identifiers differed across systems while migration had to remain resumable." },
    solution: { fa: "قراردادهای صفحه‌بندی‌شده‌ی خواندن، payload ساخت‌یافته‌ی ثبت و mapping پایدار شناسه‌ها از هم تفکیک شدند.", en: "Paginated read contracts, structured creation payloads and durable identifier mapping were separated." },
    architecture: { fa: ["WordPress REST extraction contract", "Laravel Custom Ad contract", "Resume و mapping state", "اعتبارسنجی شهر، مختصات و رسانه"], en: ["WordPress REST extraction contract", "Laravel custom-ad contract", "Resume and mapping state", "City, coordinate and media validation"] },
    stack: ["Python", "PHP", "WordPress REST API", "Laravel", "SQLite"], status: "active",
  },
  {
    slug: "mikham-ceo-profile",
    title: { fa: "وب‌سایت پروفایل مدیر میخوام", en: "Mikham CEO Profile Website" },
    category: { fa: "وب‌سایت استاتیک", en: "Static website" },
    summary: { fa: "وب‌سایت پروفایل فارسی با خروجی کاملاً استاتیک، محتوای داده‌محور و انیمیشن‌های دسترس‌پذیر.", en: "A Persian profile website with fully static export, data-driven content and accessible motion." },
    challenge: { fa: "ظاهر پویا باید بدون Node.js server روی DirectAdmin منتشر می‌شد و برای کاربران حساس به حرکت نیز مناسب می‌ماند.", en: "A motion-rich experience had to deploy without a Node.js server and remain usable for motion-sensitive visitors." },
    solution: { fa: "Next.js Static Export با محتوای جدا از UI و غیرفعال‌سازی smooth scroll و parallax در reduced-motion استفاده شد.", en: "Next.js static export separates content from UI and disables smooth scrolling and parallax under reduced-motion preferences." },
    architecture: { fa: ["Next.js App Router و Static Export", "داده‌های TypeScript مستقل از Component", "GSAP و Framer Motion", "خروجی آماده‌ی DirectAdmin"], en: ["Next.js App Router and static export", "TypeScript data separated from components", "GSAP and Framer Motion", "DirectAdmin-ready output"] },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"], status: "completed",
  },
  {
    slug: "telepress",
    title: { fa: "Telepress", en: "Telepress" },
    category: { fa: "اتوماسیون محتوا", en: "Content automation" },
    summary: { fa: "انتقال پایدار پست و رسانه از کانال‌های تلگرام به وردپرس با صف و Worker مستقل.", en: "Reliable post and media transfer from Telegram channels to WordPress with a queue and separate worker." },
    challenge: { fa: "قطع شبکه یا خطای وردپرس نباید باعث گم‌شدن یا انتشار چندباره محتوا می‌شد.", en: "Network or WordPress failures could not be allowed to lose or duplicate content." },
    solution: { fa: "صف ماندگار، worker انتشار، نگاشت رسانه و فیلتر محتوا از listener تلگرام جدا شد.", en: "A persistent queue, publishing worker, media mapping and content filtering were separated from the Telegram listener." },
    architecture: { fa: ["Telethon listener", "SQLite و SQLAlchemy", "Persistent queue", "WordPress media publishing"], en: ["Telethon listener", "SQLite and SQLAlchemy", "Persistent queue", "WordPress media publishing"] },
    stack: ["Python", "Telethon", "WordPress API", "SQLAlchemy", "SQLite"], status: "active",
  },
  {
    slug: "tele-rubi-sender",
    title: { fa: "TeleRubiSender", en: "TeleRubiSender" },
    category: { fa: "اتوماسیون پیام‌رسان", en: "Messaging automation" },
    summary: { fa: "انتقال پیام‌های متنی و رسانه‌ای از تلگرام به روبیکا با پنل مدیریتی، فیلتر و نگاشت Reply.", en: "Telegram-to-Rubika text and media delivery with administration, filtering and reply mapping." },
    challenge: { fa: "قالب‌بندی، Reply و انواع رسانه باید میان دو پیام‌رسان متفاوت حفظ می‌شد.", en: "Formatting, replies and media types needed to survive across two different messaging platforms." },
    solution: { fa: "سرویس‌های مجزای پیام‌رسان، نگاشت شناسه، فیلتر محتوا و ذخیره‌ی state طراحی شد.", en: "Separate messaging services, ID mapping, content filters and durable state were implemented." },
    architecture: { fa: ["Telegram و Rubika adapters", "Async database", "Admin bot", "Subscription and wallet modules"], en: ["Telegram and Rubika adapters", "Async database", "Admin bot", "Subscription and wallet modules"] },
    stack: ["Python", "Telethon", "Pyrubi", "SQLAlchemy", "Alembic"], status: "active",
  },
  {
    slug: "simple-ads-bot",
    title: { fa: "Simple Ads Bot", en: "Simple Ads Bot" },
    category: { fa: "ربات تلگرام", en: "Telegram bot" },
    summary: { fa: "ربات ثبت، بررسی و انتشار آگهی‌های تک‌رسانه‌ای و آلبومی با draft مستقل هر مدیر.", en: "A single-media and album listing moderation bot with independent drafts per administrator." },
    challenge: { fa: "آلبوم، تأیید هم‌زمان مدیران و فایل‌های پایدار نیازمند state دقیق بود.", en: "Albums, concurrent moderator decisions and durable media required precise state handling." },
    solution: { fa: "Draft دیتابیسی، migration اجباری و تصمیم اولین تأیید یا رد معتبر پیاده‌سازی شد.", en: "Database-backed drafts, mandatory migrations and first-valid-decision semantics were implemented." },
    architecture: { fa: ["Telethon handlers", "SQLAlchemy models", "Alembic migrations", "Docker و storage پایدار"], en: ["Telethon handlers", "SQLAlchemy models", "Alembic migrations", "Docker and persistent storage"] },
    stack: ["Python", "Telethon", "SQLAlchemy", "Alembic", "Docker"], status: "production",
  },
  {
    slug: "chapyar",
    title: { fa: "ChapYar؛ کارخانه محصولات چاپی", en: "ChapYar Printable Product Factory" },
    category: { fa: "اتوماسیون فایل", en: "File automation" },
    summary: { fa: "تبدیل تصاویر خام به بسته‌ی کامل محصول چاپی شامل PDF، preview، راهنما و ZIP نهایی.", en: "Turns raw artwork into complete printable-product packages with PDFs, previews, instructions and archives." },
    challenge: { fa: "ابعاد چاپ، برش، چند قالب کاغذ و خروجی فروش باید در یک pipeline تکرارپذیر تولید می‌شد.", en: "Print dimensions, cutting, multiple paper formats and sales output needed a repeatable pipeline." },
    solution: { fa: "مراحل پردازش تصویر، صفحه‌بندی PDF و بسته‌بندی خروجی از هم جدا شدند.", en: "Image processing, PDF layout and output packaging were split into independent stages." },
    architecture: { fa: ["Config-driven pipeline", "High-resolution image processing", "A4 و US Letter PDF", "Automated preview and ZIP packaging"], en: ["Config-driven pipeline", "High-resolution image processing", "A4 and US Letter PDF", "Automated preview and ZIP packaging"] },
    stack: ["Python", "Pillow", "ReportLab", "Pytest"], status: "completed",
  },
  {
    slug: "rubika-uploader-bot",
    title: { fa: "Rubika Uploader Bot", en: "Rubika Uploader Bot" },
    category: { fa: "ذخیره و توزیع فایل", en: "File delivery" },
    summary: { fa: "ربات ذخیره و ارائه‌ی فایل با کنترل عضویت اختیاری و PostgreSQL.", en: "A file storage and delivery bot with optional membership checks and PostgreSQL." },
    challenge: { fa: "ارجاع فایل‌ها باید پس از Restart و با کنترل دسترسی قابل بازیابی باقی می‌ماند.", en: "File references had to survive restarts while remaining access-controlled." },
    solution: { fa: "شناسه‌های پیام در دیتابیس نگهداری و schema با Alembic مدیریت شد.", en: "Message identifiers are persisted in a database with Alembic-managed schema changes." },
    architecture: { fa: ["Rubpy bot", "Async PostgreSQL", "Alembic", "Membership gates"], en: ["Rubpy bot", "Async PostgreSQL", "Alembic", "Membership gates"] },
    stack: ["Python", "Rubpy", "PostgreSQL", "SQLAlchemy", "Alembic"], status: "completed",
  },
  {
    slug: "zivana-agent",
    title: { fa: "Zivana Agent", en: "Zivana Agent" },
    category: { fa: "RAG و هوش مصنوعی", en: "RAG and AI" },
    summary: { fa: "Backend عامل هوشمند برای پاسخ‌گویی مبتنی بر داده‌ی اختصاصی هر کسب‌وکار.", en: "An AI-agent backend for business-specific, context-grounded responses." },
    challenge: { fa: "هر کسب‌وکار باید context و prompt مستقل خود را بدون ترکیب داده‌ها داشته باشد.", en: "Each business needed isolated context and prompts without cross-business data mixing." },
    solution: { fa: "index مستقل برای هر شناسه کسب‌وکار و endpointهای index، upload و chat ایجاد شد.", en: "Per-business indexes and index, upload and chat endpoints were introduced." },
    architecture: { fa: ["FastAPI", "FAISS vector index", "Business-scoped data providers", "OpenRouter LLM wrapper"], en: ["FastAPI", "FAISS vector index", "Business-scoped data providers", "OpenRouter LLM wrapper"] },
    stack: ["Python", "FastAPI", "FAISS", "LangChain", "OpenRouter"], status: "prototype",
  },
];

export const getProject = (slug: string) => projects.find(project => project.slug === slug);
export const featuredProjects = projects.filter(project => project.featured);
