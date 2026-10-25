import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const required = [
  "src/pages/index.astro",
  "src/pages/projects/[slug].astro",
  "src/blog/pages/posts/[...page].astro",
  "src/blog/pages/rss.xml.ts",
  "src/pages/robots.txt.ts",
  "src/content/projects",
  "docs/SEO_STRATEGY.md",
  "public/.htaccess",
];
const errors = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

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

const projectDirectory = join(root, "src/content/projects");
const projectFiles = (await readdir(projectDirectory)).filter(name => /\.mdx?$/i.test(name) && !name.startsWith("_"));
const projectSlugs = projectFiles.map(name => name.replace(/\.mdx?$/i, ""));
const projectCount = projectSlugs.length;
if (projectCount !== 17) errors.push(`Expected 17 portfolio projects, found ${projectCount}`);
if (new Set(projectSlugs).size !== projectSlugs.length) errors.push("Duplicate project slug detected");
const projectTitles = new Set();
const projectDescriptions = new Set();
for (const projectFile of projectFiles) {
  const content = await readFile(join(projectDirectory, projectFile), "utf8");
  for (const field of ["title", "seoTitle", "description", "category", "stack", "status", "order"]) {
    if (!new RegExp(`^${field}:`, "m").test(content)) errors.push(`Missing ${field} in ${projectFile}`);
  }
  const title = content.match(/^seoTitle:\s*["'](.+?)["']\s*$/m)?.[1];
  const description = content.match(/^description:\s*["'](.+?)["']\s*$/m)?.[1];
  if (title && projectTitles.has(title)) errors.push(`Duplicate project SEO title: ${title}`);
  if (description && projectDescriptions.has(description)) errors.push(`Duplicate project description in ${projectFile}`);
  if (title) projectTitles.add(title);
  if (description) projectDescriptions.add(description);
}

const postDirectory = join(root, "src/content/portfolio-posts");
const postFiles = (await readdir(postDirectory)).filter(name => /\.(md|mdx)$/i.test(name) && !name.startsWith("_"));
if (postFiles.length < 1) errors.push("At least one published blog post is required");
for (const postFile of postFiles) {
  const content = await readFile(join(postDirectory, postFile), "utf8");
  for (const field of ["title", "description", "pubDatetime", "tags", "draft"]) {
    if (!new RegExp(`^${field}:`, "m").test(content)) errors.push(`Missing ${field} in ${postFile}`);
  }
}

const plannedDrafts = [
  "persian-ai-assistant-state-machine.md",
  "resumable-python-crawler.md",
  "idempotent-postgresql-importer.md",
  "laravel-ledger-budget-reservation.md",
];
for (const draftFile of plannedDrafts) {
  const path = join(postDirectory, draftFile);
  const content = await readFile(path, "utf8");
  if (!/^draft:\s*false\s*$/m.test(content)) errors.push(`${draftFile} must be published`);
  const body = content.split("---").slice(2).join("---");
  const wordCount = body.split(/\s+/u).filter(Boolean).length;
  if (wordCount < 2200 || wordCount > 3200) {
    errors.push(`${draftFile} has ${wordCount} words; expected 2200-3200`);
  }
  for (const image of content.matchAll(/(?:ogImage:\s*["']|src=["'])(\/images\/articles\/[^"']+)/g)) {
    if (!(await exists(join(root, "public", image[1].replace(/^\//, ""))))) {
      errors.push(`${draftFile} references missing image ${image[1]}`);
    }
  }
}

if (errors.length) {
  console.error("Portfolio verification failed:\n- " + [...new Set(errors)].join("\n- "));
  process.exit(1);
}

console.log(`Portfolio verification passed (${projectCount} projects, ${postFiles.length} published post files, no obvious credentials).`);
