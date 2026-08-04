import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const htmlFiles = [];
const errors = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (extname(entry.name) === ".html") htmlFiles.push(absolute);
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

await walk(dist);

for (const file of htmlFiles) {
  const local = relative(dist, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const requiredPatterns = [
    [/<html[^>]+lang="[^"]+"/i, "html lang"],
    [/<title>[^<]+<\/title>/i, "title"],
    [/<meta\s+name="description"\s+content="[^"]+"/i, "meta description"],
    [/<link\s+rel="canonical"\s+href="https:\/\/hosseinmokhtari\.ir\/[^"]*"/i, "canonical URL"],
    [/<meta\s+property="og:title"\s+content="[^"]+"/i, "Open Graph title"],
  ];
  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(html)) errors.push(`${local}: missing ${label}`);
  }

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(`${local}: invalid JSON-LD`);
    }
  }

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) continue;
    const pathname = decodeURIComponent(new URL(href, "https://hosseinmokhtari.ir/").pathname);
    const cleanPath = pathname.replace(/^\/+/, "");
    const candidates = pathname.endsWith("/")
      ? [join(dist, cleanPath, "index.html")]
      : extname(pathname)
        ? [join(dist, cleanPath)]
        : [join(dist, cleanPath), join(dist, cleanPath, "index.html")];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      errors.push(`${local}: broken internal link ${href}`);
    }
  }
}

if (htmlFiles.length < 40) errors.push(`Expected at least 40 generated HTML pages, found ${htmlFiles.length}`);

if (errors.length) {
  console.error("Built-site audit failed:\n- " + [...new Set(errors)].join("\n- "));
  process.exit(1);
}

console.log(`Built-site audit passed (${htmlFiles.length} HTML pages, metadata, JSON-LD, and internal links checked).`);
