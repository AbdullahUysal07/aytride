import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import worker from "../server/worker.mjs";

const insertColumns = [
  "reference",
  "language",
  "route_id",
  "trip_type",
  "pickup",
  "dropoff",
  "pickup_date",
  "pickup_time",
  "return_date",
  "return_time",
  "flight_number",
  "hotel_address",
  "vehicle_id",
  "passengers",
  "luggage",
  "child_seats",
  "guest_name",
  "guest_phone",
  "guest_email",
  "notes",
  "public_total_eur",
  "quote_only",
  "private_vehicle_price_eur",
  "attribution_json",
  "created_at"
];

class FakeD1 {
  constructor() {
    this.rows = [];
  }

  prepare(sql) {
    return {
      bind: (...values) => ({
        first: async () => {
          if (/select reference from bookings/i.test(sql)) {
            return this.rows.find((row) => row.reference === values[0]) ? { reference: values[0] } : null;
          }
          return null;
        },
        run: async () => {
          if (/insert into bookings/i.test(sql)) {
            this.rows.push(Object.fromEntries(insertColumns.map((column, index) => [column, values[index]])));
          }
          return { success: true };
        },
        all: async () => ({ results: this.sortedRows() })
      }),
      all: async () => ({ results: this.sortedRows() })
    };
  }

  sortedRows() {
    return [...this.rows].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }
}

function request(path, options = {}) {
  return new Request(`https://aytride.com${path}`, {
    ...options,
    headers: {
      origin: "https://aytride.com",
      "content-type": "application/json",
      accept: "application/json",
      ...(options.headers || {})
    }
  });
}

function makeEnv(db) {
  const adminPassword = "launch-check-password";
  const adminSalt = "launch-check-salt";
  return {
    DB: db,
    ALLOWED_ORIGINS: "https://aytride.com,https://www.aytride.com,https://abdullahuysal07.github.io",
    BOOKING_EMAIL: "info@shramworld.com",
    MAIL_FROM: "AYT Ride <info@shramworld.com>",
    ADMIN_EMAILS: "admin@aytride.com",
    ADMIN_PASSWORD_SALT: adminSalt,
    ADMIN_PASSWORD_SHA256: createHash("sha256").update(`${adminPassword}${adminSalt}`).digest("hex"),
    ADMIN_SESSION_SECRET: "launch-check-session-secret",
    PRIVATE_PRICING_JSON: JSON.stringify({
      routes: {
        belek: {
          "standard-sedan": 32,
          "vip-van": 45
        }
      }
    })
  };
}

test("complete production booking flow persists AYT to Belek and appears in authenticated admin", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const payload = {
    reference: "AYT-LAUNCH-CHECK-BELEK-001",
    language: "en",
    routeId: "belek",
    tripType: "oneway",
    pickup: "Antalya Airport (AYT)",
    dropoff: "Belek / Kadriye",
    pickupDate: "2026-09-15",
    pickupTime: "23:30",
    returnDate: "",
    returnTime: "",
    flightNumber: "TK2420",
    hotelAddress: "Belek launch check hotel",
    vehicleId: "standard-sedan",
    passengers: 2,
    luggage: 2,
    childSeats: 1,
    guestName: "Launch Check Guest",
    guestPhone: "+905000000000",
    guestEmail: "guest@example.com",
    notes: "Night flight and child seat should not increase the fixed price.",
    publicTotalEur: 999,
    quoteOnly: false,
    attribution: { utm_source: "launch-check" }
  };

  const bookingResponse = await worker.fetch(request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  }), env);
  const bookingBody = await bookingResponse.json();

  assert.equal(bookingResponse.status, 201);
  assert.equal(bookingBody.ok, true);
  assert.equal(bookingBody.reference, payload.reference);
  assert.equal(bookingBody.publicTotalEur, 45);
  assert.equal(bookingBody.emailStatus, "skipped_not_configured");
  assert.equal(db.rows.length, 1);
  assert.equal(db.rows[0].public_total_eur, 45);
  assert.equal(db.rows[0].private_vehicle_price_eur, 32);
  assert.equal(db.rows[0].child_seats, 1);

  const unauthenticated = await worker.fetch(request("/api/admin/bookings", { method: "GET" }), env);
  assert.equal(unauthenticated.status, 401);

  const loginResponse = await worker.fetch(request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@aytride.com", password: "launch-check-password" })
  }), env);
  assert.equal(loginResponse.status, 200);
  const cookie = loginResponse.headers.get("set-cookie");
  assert.match(cookie, /ayt_admin=/);

  const adminResponse = await worker.fetch(request("/api/admin/bookings", {
    method: "GET",
    headers: { cookie }
  }), env);
  const adminBody = await adminResponse.json();

  assert.equal(adminResponse.status, 200);
  assert.equal(adminBody.bookings.length, 1);
  assert.equal(adminBody.bookings[0].reference, payload.reference);
  assert.equal(adminBody.bookings[0].routeId, "belek");
  assert.equal(adminBody.bookings[0].vehicleId, "standard-sedan");
  assert.equal(adminBody.bookings[0].publicTotalEur, 45);
  assert.equal(adminBody.bookings[0].privateVehiclePriceEur, 32);
});
