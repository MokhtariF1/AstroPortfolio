import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const required = [
  "src/pages/index.astro",
  "src/pages/en/index.astro",
  "src/pages/projects/[slug].astro",
  "src/pages/posts/[...page].astro",
  "src/pages/rss.xml.ts",
  "src/pages/robots.txt.ts",
  "src/data/projects.ts",
  "public/.htaccess",
];
const errors = [];

for (const path of required) {
  try { await stat(join(root, path)); }
  catch { errors.push(`Missing required file: ${path}`); }
}

const forbiddenNames = /(^|\/)(\.env($|\.)|.*\.(session|db|sqlite|log|zip|rar|rp|pyrubi))$/i;
const secretPatterns = [
  /ghp_[A-Za-z0-9]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /(?:api[_-]?key|access[_-]?token|secret)\s*[:=]\s*["'][^"']{12,}["']/i,
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if ([".git", "node_modules", "dist", ".astro"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    const local = relative(root, absolute).replaceAll("\\", "/");
    if (entry.isDirectory()) await walk(absolute);
    else {
      if (forbiddenNames.test(local)) errors.push(`Forbidden runtime/secret-like file: ${local}`);
      if ([".ts", ".js", ".astro", ".md", ".json", ".yml", ".yaml"].includes(extname(entry.name))) {
        const content = await readFile(absolute, "utf8");
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) errors.push(`Possible credential in ${local} (${pattern.source})`);
        }
      }
    }
  }
}

await walk(root);

const projectsSource = await readFile(join(root, "src/data/projects.ts"), "utf8");
const projectSlugs = [...projectsSource.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map(match => match[1]);
const projectCount = projectSlugs.length;
if (projectCount < 12) errors.push(`Expected at least 12 portfolio projects, found ${projectCount}`);
if (new Set(projectSlugs).size !== projectSlugs.length) errors.push("Duplicate project slug detected");

const postDirectory = join(root, "src/content/portfolio-posts");
const postFiles = (await readdir(postDirectory)).filter(name => /\.(md|mdx)$/i.test(name) && !name.startsWith("_"));
if (postFiles.length < 1) errors.push("At least one published blog post is required");
for (const postFile of postFiles) {
  const content = await readFile(join(postDirectory, postFile), "utf8");
  for (const field of ["title", "description", "pubDatetime", "tags", "draft"]) {
    if (!new RegExp(`^${field}:`, "m").test(content)) errors.push(`Missing ${field} in ${postFile}`);
  }
}

if (errors.length) {
  console.error("Portfolio verification failed:\n- " + [...new Set(errors)].join("\n- "));
  process.exit(1);
}

console.log(`Portfolio verification passed (${projectCount} projects, ${postFiles.length} published post, no obvious credentials).`);
