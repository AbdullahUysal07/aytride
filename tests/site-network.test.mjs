import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/public-catalog.json"), "utf8"));
const languages = ["en", "de", "pl", "ru", "nl"];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const routeFile = (route, language) => language === "en"
  ? `${route.slugs[language]}/index.html`
  : `${language}/${route.slugs[language]}/index.html`;
const routeUrl = (route, language) => `${catalog.baseUrl}/${routeFile(route, language).replace(/index\.html$/, "")}`;

function localFileFromUrl(rawUrl, sourceFile) {
  if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(rawUrl) || rawUrl.startsWith("#")) return null;
  const clean = rawUrl.split(/[?#]/)[0];
  if (!clean) return null;
  const relative = clean.startsWith("/")
    ? clean.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), clean));
  if (!relative || relative.endsWith("/")) return `${relative}index.html`;
  return path.posix.extname(relative) ? relative : `${relative}/index.html`;
}

test("every commercial route has complete localized SEO and booking wiring", () => {
  const sitemap = read("sitemap.xml");
  const commercialRoutes = catalog.routes.filter((route) => route.slugs?.en && route.available && !route.quoteOnly);
  assert.equal(commercialRoutes.length, 22);

  for (const route of commercialRoutes) {
    const routeLanguages = languages.filter((language) => route.slugs?.[language] && route.content?.[language]);
    if (route.id !== "oldtown") assert.deepEqual(routeLanguages, languages, `${route.id} is not available in all site languages`);
    for (const language of routeLanguages) {
      assert.ok(route.slugs?.[language], `${route.id} missing ${language} slug`);
      assert.ok(route.content?.[language], `${route.id} missing ${language} content`);
      const file = routeFile(route, language);
      assert.ok(fs.existsSync(path.join(root, file)), `${file} does not exist`);
      const html = read(file);
      assert.match(html, new RegExp(`<html lang="${language}"`), `${file} has wrong html lang`);
      assert.match(html, new RegExp(`<body[^>]+data-route-id="${route.id}"`), `${file} has wrong route id`);
      assert.match(html, new RegExp(`data-prefill-route="${route.id}"`), `${file} does not prefill its route`);
      assert.ok(html.includes(`<link rel="canonical" href="${routeUrl(route, language)}">`), `${file} canonical mismatch`);
      for (const alternateLanguage of routeLanguages) {
        assert.ok(html.includes(`hreflang="${alternateLanguage}`), `${file} missing ${alternateLanguage} hreflang`);
      }
      assert.match(html, /hreflang="x-default"/);
      assert.match(html, /class="promise-grid"/);
      assert.match(html, /<ol><li>/);
      assert.ok(sitemap.includes(`<loc>${routeUrl(route, language)}</loc>`), `${file} missing from sitemap`);
    }
  }
});

test("commercial intent hubs declare all language counterparts", () => {
  const groups = [
    ["antalya-airport-transfer-prices/index.html", "de/flughafen-antalya-transfer-preise/index.html", "pl/ceny-transferow-lotnisko-antalya/index.html", "ru/ceny-transfera-aeroport-antaliya/index.html", "nl/antalya-airport-transfer-prijzen/index.html"],
    ["antalya-airport-taxi-vs-private-transfer/index.html", "de/flughafen-antalya-taxi-oder-privattransfer/index.html", "pl/taksowka-czy-prywatny-transfer-antalya/index.html", "ru/taksi-ili-chastnyy-transfer-aeroport-antaliya/index.html", "nl/antalya-airport-taxi-of-prive-transfer/index.html"]
  ];
  for (const group of groups) {
    for (const file of group) {
      const html = read(file);
      for (const language of languages) assert.ok(html.includes(`hreflang="${language}"`), `${file} missing ${language} alternate`);
      assert.match(html, /hreflang="x-default"/);
      assert.match(html, /rel="icon"[^>]+\/favicon\.svg/);
      assert.match(html, /site\.css\?v=20260929-quote-layout-v3/);
      assert.match(html, /app\.js\?v=20260929-quote-layout-v3/);
    }
  }
});

test("home booking forms expose every available catalog destination without empty choices", () => {
  for (const file of ["index.html", "de/index.html", "pl/index.html", "ru/index.html", "nl/index.html"]) {
    const html = read(file);
    const options = Array.from(html.matchAll(/<option value="([^"]*)"/g), (match) => match[1]);
    assert.equal(options.includes(""), false, `${file} contains an empty booking option`);
    for (const route of catalog.routes.filter((item) => item.available)) {
      assert.ok(options.includes(route.origin), `${file} missing origin ${route.origin}`);
      assert.ok(options.includes(route.destination), `${file} missing destination ${route.destination}`);
    }
  }
});

test("sitemap URLs are unique and backed by generated files", () => {
  const urls = Array.from(read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, "sitemap contains duplicate URLs");
  for (const url of urls) {
    const pathname = new URL(url).pathname.replace(/^\//, "");
    const file = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    assert.ok(fs.existsSync(path.join(root, file)), `${url} has no generated file`);
  }
});

test("generated public HTML has no broken local href or src targets", () => {
  const ignoredDirectories = new Set([".git", "node_modules"]);
  function htmlFiles(directory = root) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (ignoredDirectories.has(entry.name)) return [];
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith(".html") ? [path.relative(root, full).replace(/\\/g, "/")] : [];
    });
  }

  for (const file of htmlFiles()) {
    const html = read(file);
    const targets = Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g), (match) => match[1]);
    for (const target of targets) {
      const localFile = localFileFromUrl(target, file);
      if (!localFile) continue;
      assert.ok(fs.existsSync(path.join(root, localFile)), `${file} links to missing ${target}`);
    }
  }
});
