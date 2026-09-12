import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "assets/app.js"), "utf8");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const generator = fs.readFileSync(path.join(root, "tools/generate-site.mjs"), "utf8");

test("localStorage is not used as a production booking database", () => {
  assert.equal(/localStorage\.(?:getItem|setItem|removeItem)\([^)]*booking/i.test(app), false);
  assert.equal(/localStorage\.(?:getItem|setItem|removeItem)\([^)]*confirmation/i.test(app), false);
});

test("booking confirmation conversion requires a persisted backend booking", () => {
  assert.match(app, /const persisted = Boolean\(saved\.ok && !saved\.developmentOnly\)/);
  assert.match(app, /sessionStorage\.setItem\(confirmationKey, JSON\.stringify\(\{ \.\.\.payload, reference: finalReference, persisted \}\)\)/);
  assert.match(app, /if \(saved\?\.persisted\) \{\s*aytEvent\("booking_confirmed"/);
});

test("mobile pages do not render the fixed booking bar", () => {
  assert.equal(home.includes("mobile-book-bar"), false);
  assert.equal(generator.includes("<div class=\"mobile-book-bar\""), false);
});

test("whatsapp booking message avoids emojis that can render as question marks", () => {
  const bookingMessage = app.slice(app.indexOf("function bookingMessage"), app.indexOf("function ownerReadableSummary"));
  assert.equal(/[^\x00-\x7F]/.test(bookingMessage), false);
  assert.match(bookingMessage, /\*Guest details\*/);
  assert.match(bookingMessage, /\*Route details\*/);
  assert.match(bookingMessage, /\*Price and payment\*/);
});
