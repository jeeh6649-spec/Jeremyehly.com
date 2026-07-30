import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const contentRoot = dirname(fileURLToPath(import.meta.url));
const jsonFiles = [];
const failures = [];
let assetReferences = 0;

function collectJson(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectJson(path);
    if (entry.isFile() && entry.name.endsWith(".json")) jsonFiles.push(path);
  }
}

function collectAssetReferences(value, references = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetReferences(item, references));
    return references;
  }

  if (!value || typeof value !== "object") return references;

  for (const [key, child] of Object.entries(value)) {
    if (["src", "thumbnail", "poster"].includes(key) && typeof child === "string") {
      references.push(child);
    } else {
      collectAssetReferences(child, references);
    }
  }

  return references;
}

function requirePath(reference) {
  const target = join(contentRoot, reference);
  if (!existsSync(target) || (statSync(target).isFile() && statSync(target).size === 0)) {
    failures.push(`site-content.json -> ${reference}`);
  }
}

collectJson(contentRoot);

for (const jsonFile of jsonFiles) {
  let data;
  try {
    data = JSON.parse(readFileSync(jsonFile, "utf8"));
  } catch (error) {
    failures.push(`${relative(contentRoot, jsonFile)} -> invalid JSON: ${error.message}`);
    continue;
  }

  for (const reference of collectAssetReferences(data)) {
    assetReferences += 1;
    const target = join(dirname(jsonFile), reference);
    if (!existsSync(target) || statSync(target).size === 0) {
      failures.push(`${relative(contentRoot, jsonFile)} -> ${reference}`);
    }
  }
}

const registry = JSON.parse(readFileSync(join(contentRoot, "site-content.json"), "utf8"));
if (registry.shared.brandTokens) requirePath(registry.shared.brandTokens);
if (registry.shared.brandManifest) requirePath(registry.shared.brandManifest);
requirePath(registry.shared.editorialGuide);
requirePath(registry.shared.headshot);
requirePath(registry.shared.headshotThumbnail);

for (const collection of Object.values(registry.collections)) {
  requirePath(collection.catalog);
  requirePath(collection.contentRoot);
  if (collection.mediaQueue) requirePath(collection.mediaQueue);
  if (collection.evaluationQuotes) requirePath(collection.evaluationQuotes);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      jsonFiles: jsonFiles.length,
      assetReferences,
      sections: registry.navigation.length,
      failures: 0
    },
    null,
    2
  )
);
