const copy = {
  name: "حسین مختاری",
  title: "برنامه‌نویس بک‌اند، Python و سیستم‌های هوش مصنوعی",
  description:
    "وب‌سایت شخصی حسین مختاری؛ برنامه‌نویس بک‌اند، Python، اتوماسیون و سیستم‌های هوش مصنوعی با ۳ سال تجربه.",
  greeting: "سلام! 👋",
  intro: "من",
  introSuffix: "هستم",
  aboutTitle: "درباره من",
  projectsTitle: "پروژه‌ها",
  aboutMe:
    "حدود ۳ سال است روی توسعه بک‌اند، ابزارهای اتوماسیون، پردازش داده، ربات‌های پیام‌رسان و محصولات مبتنی بر هوش مصنوعی کار می‌کنم. تمرکزم روی ساخت سیستم‌هایی است که در شرایط واقعی پایدار، قابل نگهداری و قابل توسعه باشند.",
  nav: {
    about: "درباره من",
    projects: "پروژه‌ها",
    blog: "وبلاگ",
  },
} as const;

export function getPortfolioConfig() {
  const text = copy;
  return {
    ...text,
    accentColor: "#1d4ed8",
    skills: [
      "Python",
      "FastAPI",
      "Laravel",
      "PostgreSQL",
      "Docker",
      "Playwright",
      "AI Agents",
      "Automation",
    ],
    social: {
      email: "hosseinmokhtari5555@gmail.com",
      linkedin: "",
      twitter: "",
      github: "https://github.com/MokhtariF1",
      telegram: "https://t.me/Ho3einMokhtari",
    },
    experience: [] as Array<{
      company: string;
      title: string;
      dateRange: string;
      bullets: string[];
    }>,
    education: [] as Array<{
      school: string;
      degree: string;
      dateRange: string;
      achievements: string[];
    }>,
  };
}
