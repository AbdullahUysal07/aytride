import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/public-catalog.json"), "utf8"));

const languagePrefixes = {
  en: "",
  de: "de",
  pl: "pl",
  ru: "ru"
};

let changed = 0;

for (const route of catalog.routes || []) {
  const sedanPrice = Number(route?.prices?.["standard-sedan"]);
  if (!Number.isFinite(sedanPrice)) continue;

  for (const [language, prefix] of Object.entries(languagePrefixes)) {
    const slug = route?.slugs?.[language];
    if (!slug) continue;

    const filePath = path.join(root, prefix, slug, "index.html");
    if (!fs.existsSync(filePath)) continue;

    const source = fs.readFileSync(filePath, "utf8");
    const expected = `<strong id="quoteTotal">€${sedanPrice} TOTAL</strong>`;
    const updated = source.replace(
      /<strong id="quoteTotal">[^<]*<\/strong>/,
      expected
    );

    if (updated !== source) {
      fs.writeFileSync(filePath, updated);
      changed += 1;
      console.log(`Updated ${path.relative(root, filePath)} -> €${sedanPrice} TOTAL`);
    }
  }
}

console.log(`Static route quote cleanup complete. Files changed: ${changed}`);
