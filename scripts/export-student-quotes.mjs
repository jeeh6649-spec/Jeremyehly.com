import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "_data", "student_evaluation_quotes.json");
const outputPath = join(root, "teaching", "evaluations", "all-course-quotes.md");
const data = JSON.parse(readFileSync(sourcePath, "utf8"));
const featured = new Set(data.featuredQuoteIds);

const lines = [
  "# Student Evaluation Quotes | All Courses",
  "",
  `Updated ${data.updated}.`,
  "",
  data.editorialPolicy,
  ""
];

for (const course of data.courses) {
  lines.push(`## ${course.title}`, "");
  lines.push(`Source evaluations: ${course.sourceEvaluations.join(" + ")}.`, "");

  for (const quote of course.quotes) {
    const marker = featured.has(quote.id) ? " | Featured site-wide" : "";
    lines.push(`### ${quote.term}${marker}`, "");
    lines.push(`> \"${quote.text}\"`, "");
    lines.push(`Themes: ${quote.themes.join(" + ")} | ID: \`${quote.id}\``, "");
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
