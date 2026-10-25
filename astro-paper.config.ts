import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://hosseinmokhtari.ir/",
    title: "حسین مختاری",
    description: "وب‌سایت شخصی حسین مختاری؛ برنامه‌نویس بک‌اند، Python، اتوماسیون و سیستم‌های هوش مصنوعی.",
    author: "حسین مختاری",
    profile: "https://hosseinmokhtari.ir",
    ogImage: "og.svg",
    lang: "fa",
    timezone: "Asia/Tehran",
    dir: "rtl",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    blog: false,
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/MokhtariF1", linkTitle: "گیت‌هاب حسین مختاری" },
    { name: "telegram", url: "https://t.me/Ho3einMokhtari", linkTitle: "تلگرام حسین مختاری" },
    { name: "mail", url: "mailto:hosseinmokhtari5555@gmail.com", linkTitle: "ایمیل به حسین مختاری" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
