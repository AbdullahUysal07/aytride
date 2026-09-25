// One-time, content-preserving cache refresh for the analytics repair.
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const version = "20260925-analyticsfix";
const skip = new Set([".git", ".github", "node_modules", "dist", "coverage"]);
let changed = 0;
function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      visit(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const old = fs.readFileSync(file, "utf8");
    const next = old.replace(/\\/assets\\/app\\.js\\?v=[^"'<>\\s]+/g, `/assets/app.js?v=${version}`);
    if (next !== old) {
      fs.writeFileSync(file, next, "utf8");
      changed++;
    }
  }
}
visit(root);
console.log(`Refreshed app script references in ${changed} HTML files.`);
