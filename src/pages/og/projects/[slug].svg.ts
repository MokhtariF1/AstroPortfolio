import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const getStaticPaths = (async () => {
  const projects = await getCollection("projects");
  return projects.map(project => ({
    params: { slug: project.id },
    props: { title: project.data.title, category: project.data.category },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const title = escapeXml(String(props.title));
  const category = escapeXml(String(props.category));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${title}">
  <rect width="1200" height="630" fill="#07152f"/>
  <path d="M0 150H1200M0 315H1200M0 480H1200M180 0V630M430 0V630M680 0V630M930 0V630" stroke="#17366f" stroke-width="2"/>
  <text x="1080" y="180" text-anchor="end" direction="rtl" font-family="Tahoma,Arial,sans-serif" font-size="30" fill="#60a5fa">${category}</text>
  <text x="1080" y="295" text-anchor="end" direction="rtl" font-family="Tahoma,Arial,sans-serif" font-size="58" font-weight="700" fill="#fff">${title}</text>
  <text x="1080" y="430" text-anchor="end" direction="rtl" font-family="Tahoma,Arial,sans-serif" font-size="28" fill="#cbd5e1">مطالعه موردی پروژه • حسین مختاری</text>
  <circle cx="105" cy="525" r="28" fill="#2563eb"/><path d="M145 525h250" stroke="#60a5fa" stroke-width="8"/>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
