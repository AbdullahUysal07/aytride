import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { calculatePublicQuote, validateBookingPayload } from "../server/validation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/public-catalog.json"), "utf8"));

function basePayload(overrides = {}) {
  return {
    reference: "AYT-20260913-1130-LARA",
    language: "en",
    routeId: "lara",
    tripType: "oneway",
    pickup: "Antalya Airport (AYT)",
    dropoff: "Lara / Kundu",
    pickupDate: "2026-09-13",
    pickupTime: "11:30",
    vehicleId: "standard-sedan",
    passengers: 2,
    luggage: 2,
    childSeats: 0,
    guestName: "Test Guest",
    guestPhone: "+491700000000",
    guestEmail: "guest@example.com",
    notes: "Baby seat request will be tested separately.",
    ...overrides
  };
}

test("calculates fixed sedan price from the public catalog", () => {
  const result = validateBookingPayload(catalog, basePayload(), { today: "2026-09-12" });
  assert.equal(result.ok, true);
  assert.equal(result.payload.publicTotalEur, 30);
  assert.equal(result.payload.quoteOnly, false);
});

test("applies return discount without trusting client totals", () => {
  const result = validateBookingPayload(catalog, basePayload({
    reference: "AYT-20260913-1130-LARA-RETURN",
    tripType: "return",
    returnDate: "2026-09-20",
    returnTime: "10:00",
    publicTotalEur: 1
  }), { today: "2026-09-12" });
  assert.equal(result.ok, true);
  assert.equal(result.payload.publicTotalEur, 54);
});

test("adds child seat and night fees server-side", () => {
  const quote = calculatePublicQuote(catalog, basePayload({
    pickupTime: "23:30",
    childSeats: 1
  }));
  assert.equal(quote.total, 45);
});

test("rejects sedan requests that exceed vehicle capacity", () => {
  const result = validateBookingPayload(catalog, basePayload({
    passengers: 4,
    vehicleId: "standard-sedan"
  }), { today: "2026-09-12" });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /passenger/i);
});

test("custom route is accepted as quote-only", () => {
  const result = validateBookingPayload(catalog, basePayload({
    reference: "AYT-20260913-1130-CUSTOM",
    routeId: "custom",
    pickup: "Antalya Airport (AYT)",
    dropoff: "Other hotel or address",
    vehicleId: "vip-van"
  }), { today: "2026-09-12" });
  assert.equal(result.ok, true);
  assert.equal(result.payload.quoteOnly, true);
  assert.equal(result.payload.publicTotalEur, null);
});

test("rejects past pickup dates", () => {
  const result = validateBookingPayload(catalog, basePayload({
    pickupDate: "2026-09-10"
  }), { today: "2026-09-12" });
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /date/i);
});
