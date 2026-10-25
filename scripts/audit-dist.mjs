import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const blogEnabled = !/\bblog:\s*false\b/.test(
  await readFile(join(root, "astro-paper.config.ts"), "utf8")
);
const htmlFiles = [];
const sitemapFiles = [];
const errors = [];
const pages = [];
const titleOwners = new Map();
const descriptionOwners = new Map();
const inboundLinks = new Map();

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (extname(entry.name) === ".html") htmlFiles.push(absolute);
    else if (/^sitemap.*\.xml$/i.test(entry.name)) sitemapFiles.push(absolute);
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const addOwner = (map, value, owner, label) => {
  if (!value) return;
  if (map.has(value)) errors.push(`${owner}: duplicate ${label} also used by ${map.get(value)}`);
  else map.set(value, owner);
};

const findPeople = value => {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(findPeople);
  return [
    ...(value["@type"] === "Person" ? [value] : []),
    ...Object.values(value).flatMap(findPeople),
  ];
};

await walk(dist);

if (!blogEnabled) {
  for (const path of ["posts", "tags", "archives", "search", "rss.xml"]) {
    if (await exists(join(dist, path))) errors.push(`Disabled blog output exists: ${path}`);
  }
}

for (const file of htmlFiles) {
  const local = relative(dist, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1] ?? "";
  const noindex = robots.toLowerCase().includes("noindex");

  if (!/<html[^>]+lang="fa-IR"[^>]+dir="rtl"|<html[^>]+dir="rtl"[^>]+lang="fa-IR"/i.test(html)) errors.push(`${local}: html must use fa-IR and rtl`);
  if (!title) errors.push(`${local}: missing title`);
  if (!description) errors.push(`${local}: missing meta description`);
  if (!/<h1(?:\s|>)/i.test(html)) errors.push(`${local}: missing H1`);
  if (!canonical?.startsWith("https://hosseinmokhtari.ir/")) errors.push(`${local}: invalid canonical URL`);
  if (canonical?.includes("www.")) errors.push(`${local}: canonical contains www`);
  if (!noindex && canonical && canonical !== "https://hosseinmokhtari.ir/" && !canonical.endsWith("/")) errors.push(`${local}: indexable canonical must have trailing slash`);
  if (!/<meta\s+property="og:title"\s+content="[^"]+"/i.test(html)) errors.push(`${local}: missing Open Graph title`);
  if (!/<meta\s+property="og:image:alt"\s+content="[^"]+"/i.test(html)) errors.push(`${local}: missing Open Graph image alt`);
  if (/\/en(?:\/|&quot;|"|')|hreflang=["']en/i.test(html)) errors.push(`${local}: English route or hreflang leaked into output`);

  addOwner(titleOwners, title, local, "title");
  addOwner(descriptionOwners, description, local, "description");

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      for (const person of findPeople(data)) {
        if (person.name === "حسین مختاری" && person["@id"] !== "https://hosseinmokhtari.ir/about/#person") {
          errors.push(`${local}: inconsistent Person @id`);
        }
      }
    } catch {
      errors.push(`${local}: invalid JSON-LD`);
    }
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (!/\balt="[^"]+"/i.test(attributes)) errors.push(`${local}: content image missing non-empty alt`);
    if (!/\bwidth="\d+"/i.test(attributes) || !/\bheight="\d+"/i.test(attributes)) errors.push(`${local}: image missing explicit dimensions`);
  }

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (/^(?:mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const url = new URL(href, "https://hosseinmokhtari.ir/");
    if (url.origin !== "https://hosseinmokhtari.ir") continue;
    const pathname = decodeURIComponent(url.pathname);
    inboundLinks.set(pathname, (inboundLinks.get(pathname) ?? 0) + 1);
    const cleanPath = pathname.replace(/^\/+/, "");
    const candidates = pathname.endsWith("/")
      ? [join(dist, cleanPath, "index.html")]
      : extname(pathname)
        ? [join(dist, cleanPath)]
        : [join(dist, cleanPath), join(dist, cleanPath, "index.html")];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) errors.push(`${local}: broken internal link ${href}`);
  }

  pages.push({ local, canonical, noindex });
}

const sitemapURLs = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, "utf8");
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapURLs.add(match[1]);
}

for (const page of pages) {
  if (!page.canonical) continue;
  if (page.noindex && sitemapURLs.has(page.canonical)) errors.push(`${page.local}: noindex URL exists in sitemap`);
  if (!page.noindex && !sitemapURLs.has(page.canonical)) errors.push(`${page.local}: indexable URL missing from sitemap`);
  if (!page.noindex && page.canonical !== "https://hosseinmokhtari.ir/") {
    const pathname = decodeURIComponent(new URL(page.canonical).pathname);
    if (!inboundLinks.has(pathname)) errors.push(`${page.local}: indexable page has no internal inbound link`);
  }
}

const minimumPages = blogEnabled ? 25 : 20;
if (htmlFiles.length < minimumPages) errors.push(`Expected at least ${minimumPages} generated HTML pages, found ${htmlFiles.length}`);

if (errors.length) {
  console.error("Built-site audit failed:\n- " + [...new Set(errors)].join("\n- "));
  process.exit(1);
}

console.log(`Built-site audit passed (${htmlFiles.length} HTML pages, canonical metadata, schemas, images, sitemap and links checked).`);
