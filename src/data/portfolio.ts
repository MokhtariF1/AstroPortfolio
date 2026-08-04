import { projects } from "./projects";

export type PortfolioLanguage = "fa" | "en";

const copy = {
  fa: {
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
      language: "EN",
    },
  },
  en: {
    name: "Hossein Mokhtari",
    title: "Backend, Python & AI Systems Developer",
    description:
      "The personal website of Hossein Mokhtari, a backend, Python, automation and AI developer with 3 years of experience.",
    greeting: "Hello! 👋",
    intro: "I'm",
    introSuffix: "",
    aboutTitle: "About Me",
    projectsTitle: "Projects",
    aboutMe:
      "For around three years, I have worked on backend development, automation tools, data processing, messaging bots and AI-powered products. I focus on systems that remain reliable, maintainable and extensible in real-world use.",
    nav: { about: "About", projects: "Projects", blog: "Blog", language: "فا" },
  },
} as const;

export function getPortfolioConfig(lang: PortfolioLanguage) {
  const text = copy[lang];
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
    projects: projects.map(project => ({
      slug: project.slug,
      name: project.title[lang],
      description: project.summary[lang],
      link: `${lang === "en" ? "/en" : ""}/projects/${project.slug}/`,
      skills: project.stack,
      featured: project.featured,
    })),
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
