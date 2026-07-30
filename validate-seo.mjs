import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const ignoredDirectories = new Set([".git", "_site", "node_modules", "vendor"]);
const errors = [];
const warnings = [];

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolutePath));
    else if (entry.name === "index.html") files.push(absolutePath);
  }
  return files;
}

function frontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    return "";
  }
  return match[1];
}

function field(yaml, key) {
  const match = yaml.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
}

const pages = walk(root).sort();
const seenTitles = new Map();

for (const absolutePath of pages) {
  const file = path.relative(root, absolutePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const yaml = frontmatter(source, file);
  const required = ["layout", "title", "seo_title", "description", "social_image", "social_image_alt"];

  for (const key of required) {
    if (!field(yaml, key)) errors.push(`${file}: missing ${key}`);
  }

  const seoTitle = field(yaml, "seo_title");
  const fullTitle = seoTitle.includes("Jeremy Ehly") ? seoTitle : `${seoTitle} | Jeremy Ehly`;
  const description = field(yaml, "description");
  const socialImage = field(yaml, "social_image");

  if (fullTitle.length > 65) warnings.push(`${file}: search title is ${fullTitle.length} characters`);
  if (description.length < 110 || description.length > 170) {
    warnings.push(`${file}: description is ${description.length} characters; target 110-170`);
  }

  if (seenTitles.has(fullTitle)) {
    errors.push(`${file}: duplicates the search title used by ${seenTitles.get(fullTitle)}`);
  } else {
    seenTitles.set(fullTitle, file);
  }

  if (socialImage && !socialImage.startsWith("/")) {
    errors.push(`${file}: social_image must start with /`);
  } else if (socialImage) {
    const imagePath = path.join(root, socialImage.slice(1));
    if (!fs.existsSync(imagePath)) errors.push(`${file}: social image does not exist: ${socialImage}`);
  }

  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  const h1Count = (body.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (/href=["'][^"']*index\.html/.test(body)) errors.push(`${file}: contains an index.html link`);
}

const config = fs.readFileSync(path.join(root, "_config.yml"), "utf8");
if (!/^url:\s*["']https:\/\/[^"']+["']/m.test(config)) {
  errors.push("_config.yml: url must be the final HTTPS production origin");
}

const layout = fs.readFileSync(path.join(root, "_layouts/default.html"), "utf8");
if (!layout.includes("{% include seo.html %}")) errors.push("default layout does not include seo.html");
for (const file of ["robots.txt", "sitemap.xml", "SEO-GUIDE.md"]) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length) {
  console.error(`\nSEO validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.length} published pages${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
