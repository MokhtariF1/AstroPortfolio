import type { UIStrings } from "../types";

export default {
  nav: { home: "خانه", posts: "وبلاگ", tags: "برچسب‌ها", about: "درباره من", archives: "آرشیو", search: "جست‌وجو" },
  post: {
    publishedAt: "منتشرشده در", updatedAt: "به‌روزرسانی", sharePostIntro: "اشتراک‌گذاری:",
    sharePostOn: "اشتراک‌گذاری در {{platform}}", sharePostViaEmail: "اشتراک‌گذاری با ایمیل",
    tagLabel: "برچسب‌ها", backToTop: "بازگشت به بالا", goBack: "بازگشت", editPage: "ویرایش صفحه",
    previousPost: "نوشته قبلی", nextPost: "نوشته بعدی",
  },
  pagination: { prev: "قبلی", next: "بعدی", page: "صفحه" },
  home: { socialLinks: "راه‌های ارتباطی", featured: "نوشته‌های منتخب", recentPosts: "نوشته‌های تازه", allPosts: "همه نوشته‌ها" },
  footer: { copyright: "حق نشر", allRightsReserved: "تمام حقوق محفوظ است." },
  pages: {
    tagTitle: "برچسب", tagDesc: "نوشته‌های دارای این برچسب",
    tagsTitle: "برچسب‌ها", tagsDesc: "همه برچسب‌های استفاده‌شده در نوشته‌ها.",
    postsTitle: "وبلاگ", postsDesc: "یادداشت‌های فنی حسین مختاری درباره بک‌اند، داده، اتوماسیون و هوش مصنوعی.",
    archivesTitle: "آرشیو", archivesDesc: "آرشیو زمانی نوشته‌ها.",
    searchTitle: "جست‌وجو", searchDesc: "در نوشته‌های وبلاگ جست‌وجو کنید.",
  },
  a11y: {
    skipToContent: "رفتن به محتوای اصلی", openMenu: "بازکردن منو", closeMenu: "بستن منو",
    toggleTheme: "تغییر پوسته", searchPlaceholder: "جست‌وجوی نوشته‌ها...", noResults: "نتیجه‌ای پیدا نشد",
    goToPreviousPage: "رفتن به صفحه قبلی", goToNextPage: "رفتن به صفحه بعدی",
  },
  notFound: { title: "صفحه پیدا نشد", message: "صفحه موردنظر پیدا نشد.", goHome: "بازگشت به خانه" },
} satisfies UIStrings;
