import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/public-catalog.json"), "utf8"));
const routeLanguages = ["en", "de", "pl", "ru"];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function routePath(route, language) {
  const slug = route.slugs?.[language];
  return language === "en" ? `${slug}/index.html` : `${language}/${slug}/index.html`;
}

function listFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === ".git") return [];
    if (entry.isDirectory()) return listFiles(full);
    return [path.relative(root, full).replace(/\\/g, "/")];
  });
}

function jsonLdBlocks(html) {
  return Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))
    .map((match) => JSON.parse(match[1]));
}

test("route page schema prices match the public catalog", () => {
  const routes = catalog.routes.filter((route) => route.slugs?.en);
  for (const route of routes) {
    for (const language of routeLanguages) {
      const html = read(routePath(route, language));
      const graphs = jsonLdBlocks(html).flatMap((block) => block["@graph"] || [block]);
      const service = graphs.find((item) => item["@type"] === "Service");
      assert.ok(service, `${route.id} ${language} missing Service schema`);
      const schemaPrices = Object.fromEntries(service.offers.map((offer) => [offer.name, Number(offer.price)]));
      for (const vehicle of catalog.vehicles) {
        assert.equal(
          schemaPrices[`${vehicle.name} ${route.destination}`],
          route.prices[vehicle.id],
          `${route.id} ${language} ${vehicle.id} schema mismatch`
        );
      }
    }
  }
});

test("public pages do not contain old unsafe booking patterns", () => {
  const files = listFiles().filter((file) => {
    if (file.startsWith("server/") || file.startsWith("tests/")) return false;
    if (file === "DEPLOYMENT.md" || file === "SECURITY.md" || file === "wrangler.example.toml") return false;
    return file.endsWith(".html") || file.endsWith(".js") || file === "llms.txt";
  });

  const forbidden = [
    "costMultiplier",
    "operator_vehicle_cost_eur",
    "estimated_margin",
    "FormSubmit",
    "SearchAction",
    "Powered by SHRAMWORLD infrastructure",
    "10 years local experience",
    "10 years on Antalya routes"
  ];

  for (const file of files) {
    const body = read(file);
    for (const token of forbidden) {
      assert.equal(body.includes(token), false, `${file} includes forbidden token: ${token}`);
    }
  }
});

test("sitemap contains crawlable commercial URLs and excludes admin", () => {
  const sitemap = read("sitemap.xml");
  assert.equal(sitemap.includes("/admin/"), false);
  assert.ok(sitemap.includes("https://aytride.com/"));
  for (const route of catalog.routes.filter((item) => item.slugs?.en)) {
    for (const language of routeLanguages) {
      const urlPath = routePath(route, language).replace(/index\.html$/, "");
      assert.ok(sitemap.includes(`${catalog.baseUrl}/${urlPath}`), `${route.id} ${language} missing from sitemap`);
    }
  }
});
