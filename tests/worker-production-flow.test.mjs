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
    this.prices = [];
    this.settings = [];
    this.blogs = [];
    this.analyticsEvents = [];
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
            this.rows.push({
              ...Object.fromEntries(insertColumns.map((column, index) => [column, values[index]])),
              status: "pending",
              confirmed_at: null,
              deleted_at: null,
              updated_at: null
            });
          }
          if (/update bookings\s+set status = 'confirmed'/i.test(sql)) {
            const row = this.rows.find((item) => item.reference === values[2] && !item.deleted_at);
            if (row) {
              row.status = "confirmed";
              row.confirmed_at = row.confirmed_at || values[0];
              row.updated_at = values[1];
            }
          }
          if (/update bookings\s+set status = 'pending'/i.test(sql)) {
            const row = this.rows.find((item) => item.reference === values[1] && !item.deleted_at);
            if (row) {
              row.status = "pending";
              row.confirmed_at = null;
              row.updated_at = values[0];
            }
          }
          if (/update bookings\s+set status = 'deleted'/i.test(sql)) {
            const row = this.rows.find((item) => item.reference === values[2]);
            if (row) {
              row.status = "deleted";
              row.deleted_at = values[0];
              row.updated_at = values[1];
            }
          }
          if (/insert into route_prices/i.test(sql)) {
            const [route_id, vehicle_id, price_eur, updated_at] = values;
            const existing = this.prices.find((item) => item.route_id === route_id && item.vehicle_id === vehicle_id);
            if (existing) {
              existing.price_eur = price_eur;
              existing.updated_at = updated_at;
            } else {
              this.prices.push({ route_id, vehicle_id, price_eur, updated_at });
            }
          }
          if (/insert into admin_settings/i.test(sql)) {
            const [key, value, updated_at] = values;
            const existing = this.settings.find((item) => item.key === key);
            if (existing) {
              existing.value = value;
              existing.updated_at = updated_at;
            } else {
              this.settings.push({ key, value, updated_at });
            }
          }
          if (/insert into blog_posts/i.test(sql)) {
            const [slug, kicker, title, description, body_json, meta_label, created_at, updated_at] = values;
            const existing = this.blogs.find((item) => item.slug === slug);
            if (existing) {
              existing.status = "published";
              existing.kicker = kicker;
              existing.title = title;
              existing.description = description;
              existing.body_json = body_json;
              existing.meta_label = meta_label;
              existing.updated_at = updated_at;
              existing.deleted_at = null;
            } else {
              this.blogs.push({ slug, status: "published", kicker, title, description, body_json, meta_label, created_at, updated_at, deleted_at: null });
            }
          }
          if (/insert into analytics_events/i.test(sql)) {
            const [event_type, visitor_id, path, source, medium, campaign, referrer_host, route_id, created_at] = values;
            this.analyticsEvents.push({ event_type, visitor_id, path, source, medium, campaign, referrer_host, route_id, created_at });
          }
          if (/update blog_posts\s+set status = 'deleted'/i.test(sql)) {
            const row = this.blogs.find((item) => item.slug === values[2]);
            if (row) {
              row.status = "deleted";
              row.deleted_at = values[0];
              row.updated_at = values[1];
            }
          }
          return { success: true };
        },
        all: async () => ({ results: this.resultsFor(sql) })
      }),
      all: async () => ({ results: this.resultsFor(sql) })
    };
  }

  resultsFor(sql) {
    if (/from route_prices/i.test(sql)) return [...this.prices];
    if (/from admin_settings/i.test(sql)) return [...this.settings];
    if (/from blog_posts/i.test(sql)) {
      if (/where deleted_at is null and status = 'published'/i.test(sql)) {
        return this.blogs.filter((row) => !row.deleted_at && row.status === "published");
      }
      return [...this.blogs];
    }
    if (/from analytics_events/i.test(sql)) return [...this.analyticsEvents];
    if (/where deleted_at is null/i.test(sql)) return this.sortedRows().filter((row) => !row.deleted_at);
    return this.sortedRows();
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
    ADMIN_EMAILS: "info@shramworld.com",
    ADMIN_PASSWORD_SALT: adminSalt,
    ADMIN_PASSWORD_SHA256: createHash("sha256").update(`${adminPassword}${adminSalt}`).digest("hex"),
    ADMIN_SESSION_SECRET: "launch-check-session-secret",
    ADMIN_DRIVER_RATE_TRY_PER_KM: "35",
    ADMIN_EUR_TRY_RATE: "45",
    AUTO_EUR_TRY_RATE: "false",
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

async function adminCookie(env) {
  const loginResponse = await worker.fetch(request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: "info@shramworld.com", password: "launch-check-password" })
  }), env);
  assert.equal(loginResponse.status, 200);
  const cookie = loginResponse.headers.get("set-cookie");
  assert.match(cookie, /ayt_admin=/);
  return cookie;
}

async function adminSessionToken(env) {
  const response = await worker.fetch(request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: "info@shramworld.com", password: "launch-check-password" })
  }), env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.sessionToken, /^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/);
  return body.sessionToken;
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
    pickupDate: "2026-10-15",
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
  assert.equal(bookingBody.publicTotalEur, 40);
  assert.equal(bookingBody.emailStatus, "skipped_not_configured");
  assert.equal(db.rows.length, 1);
  assert.equal(db.rows[0].public_total_eur, 40);
  assert.equal(db.rows[0].private_vehicle_price_eur, 32);
  assert.equal(db.rows[0].child_seats, 1);

  const unauthenticated = await worker.fetch(request("/api/admin/bookings", { method: "GET" }), env);
  assert.equal(unauthenticated.status, 401);

  const cookie = await adminCookie(env);

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
  assert.equal(adminBody.bookings[0].publicTotalEur, 40);
  assert.equal(adminBody.bookings[0].privateVehiclePriceEur, 32);
  assert.equal(adminBody.bookings[0].status, "pending");
  assert.equal(adminBody.bookings[0].driverCostTry, 1155);
  assert.equal(adminBody.bookings[0].profitTry, 645);
  assert.equal(adminBody.bookings[0].attribution.utm_source, "launch-check");

  const sessionToken = await adminSessionToken(env);
  const tokenResponse = await worker.fetch(request("/api/admin/bookings", {
    method: "GET",
    headers: { authorization: `Bearer ${sessionToken}` }
  }), env);
  assert.equal(tokenResponse.status, 200);

  const confirmResponse = await worker.fetch(request(`/api/admin/bookings/${payload.reference}/confirm`, {
    method: "POST",
    headers: { cookie },
    body: "{}"
  }), env);
  assert.equal(confirmResponse.status, 200);

  const confirmedResponse = await worker.fetch(request("/api/admin/bookings", {
    method: "GET",
    headers: { cookie }
  }), env);
  const confirmedBody = await confirmedResponse.json();
  assert.equal(confirmedBody.bookings[0].status, "confirmed");
  assert.equal(confirmedBody.summary.total.count, 1);
  assert.equal(confirmedBody.summary.total.revenueEur, 40);
  assert.equal(confirmedBody.summary.total.driverCostTry, 1155);
  assert.equal(confirmedBody.summary.total.profitTry, 645);
});

test("consented analytics events appear in the protected seven-day summary", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const event = (eventType, visitorId, source) => worker.fetch(request("/api/analytics/events", {
    method: "POST",
    body: JSON.stringify({ eventType, visitorId, path: "/", source })
  }), env);

  assert.equal((await event("page_view", "visitor-a", "google")).status, 201);
  assert.equal((await event("booking_quote_started", "visitor-a", "google")).status, 201);
  assert.equal((await event("page_view", "visitor-b", "direct")).status, 201);
  assert.equal((await event("booking_confirmed", "visitor-a", "google")).status, 201);

  const cookie = await adminCookie(env);
  const response = await worker.fetch(request("/api/admin/analytics", { method: "GET", headers: { cookie } }), env);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.today.visitors, 2);
  assert.equal(body.today.pageViews, 2);
  assert.equal(body.week.quoteStarts, 1);
  assert.equal(body.week.bookings, 1);
  assert.equal(body.sources[0].source, "google");
});

test("admin can update public route prices and soft-delete bookings", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const cookie = await adminCookie(env);

  const priceResponse = await worker.fetch(request("/api/admin/prices", {
    method: "POST",
    headers: { cookie },
    body: JSON.stringify({ routeId: "belek", vehicleId: "standard-sedan", priceEur: 50 })
  }), env);
  assert.equal(priceResponse.status, 200);

  const catalogResponse = await worker.fetch(request("/api/public/catalog", { method: "GET" }), env);
  const catalogBody = await catalogResponse.json();
  assert.equal(catalogBody.routes.find((route) => route.id === "belek").prices["standard-sedan"], 50);

  const bookingResponse = await worker.fetch(request("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      reference: "AYT-PRICE-OVERRIDE-BELEK-001",
      language: "en",
      routeId: "belek",
      tripType: "oneway",
      pickup: "Antalya Airport (AYT)",
      dropoff: "Belek / Kadriye",
      pickupDate: "2026-10-15",
      pickupTime: "13:30",
      returnDate: "",
      returnTime: "",
      flightNumber: "TK2420",
      hotelAddress: "Belek hotel",
      vehicleId: "standard-sedan",
      passengers: 2,
      luggage: 2,
      childSeats: 0,
      guestName: "Price Override Guest",
      guestPhone: "+905000000001",
      guestEmail: "",
      notes: "",
      publicTotalEur: 45,
      quoteOnly: false,
      attribution: {}
    })
  }), env);
  const bookingBody = await bookingResponse.json();
  assert.equal(bookingResponse.status, 201);
  assert.equal(bookingBody.publicTotalEur, 50);

  const deleteResponse = await worker.fetch(request("/api/admin/bookings/AYT-PRICE-OVERRIDE-BELEK-001/delete", {
    method: "POST",
    headers: { cookie },
    body: "{}"
  }), env);
  assert.equal(deleteResponse.status, 200);

  const adminResponse = await worker.fetch(request("/api/admin/bookings", {
    method: "GET",
    headers: { cookie }
  }), env);
  const adminBody = await adminResponse.json();
  assert.equal(adminBody.bookings.length, 0);
});

test("admin can update driver cost settings used by revenue calculations", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const bookingResponse = await worker.fetch(request("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      reference: "AYT-DRIVER-RATE-BELEK-001",
      language: "en",
      routeId: "belek",
      tripType: "oneway",
      pickup: "Antalya Airport (AYT)",
      dropoff: "Belek / Kadriye",
      pickupDate: "2026-10-15",
      pickupTime: "13:30",
      returnDate: "",
      returnTime: "",
      flightNumber: "TK2420",
      hotelAddress: "Belek hotel",
      vehicleId: "standard-sedan",
      passengers: 2,
      luggage: 2,
      childSeats: 0,
      guestName: "Driver Rate Guest",
      guestPhone: "+905000000002",
      guestEmail: "",
      notes: "",
      publicTotalEur: 45,
      quoteOnly: false,
      attribution: {}
    })
  }), env);
  assert.equal(bookingResponse.status, 201);

  const cookie = await adminCookie(env);
  const settingsResponse = await worker.fetch(request("/api/admin/settings", {
    method: "POST",
    headers: { cookie },
    body: JSON.stringify({ driverRateTryPerKm: 40, eurTryRate: 45 })
  }), env);
  assert.equal(settingsResponse.status, 200);

  const adminResponse = await worker.fetch(request("/api/admin/bookings", {
    method: "GET",
    headers: { cookie }
  }), env);
  const adminBody = await adminResponse.json();
  assert.equal(adminBody.settings.driverRateTryPerKm, 40);
  assert.equal(adminBody.bookings[0].driverCostTry, 1320);
  assert.equal(adminBody.bookings[0].profitTry, 480);
});

test("admin can refresh automatic EUR TRY rate and reuse the cached value", async () => {
  const db = new FakeD1();
  const env = {
    ...makeEnv(db),
    AUTO_EUR_TRY_RATE: "true",
    EUR_TRY_RATE_API_URL: "https://rates.example.test/eur-try"
  };
  const cookie = await adminCookie(env);
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url) => {
    if (String(url) === env.EUR_TRY_RATE_API_URL) {
      calls += 1;
      return new Response(JSON.stringify({ date: "2026-09-15", rate: 56.25 }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return originalFetch(url);
  };

  try {
    const refreshResponse = await worker.fetch(request("/api/admin/settings/refresh-rate", {
      method: "POST",
      headers: { cookie },
      body: "{}"
    }), env);
    const refreshBody = await refreshResponse.json();
    assert.equal(refreshResponse.status, 200);
    assert.equal(refreshBody.settings.eurTryRate, 56.25);
    assert.equal(refreshBody.settings.eurTryRateSource, "auto-live");
    assert.equal(refreshBody.settings.eurTryRateDate, "2026-09-15");
    assert.equal(calls, 1);

    const settingsResponse = await worker.fetch(request("/api/admin/settings", {
      method: "GET",
      headers: { cookie }
    }), env);
    const settingsBody = await settingsResponse.json();
    assert.equal(settingsResponse.status, 200);
    assert.equal(settingsBody.settings.eurTryRate, 56.25);
    assert.equal(settingsBody.settings.eurTryRateSource, "auto-cache");
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("admin can create, publish and delete blog posts backed by D1", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const cookie = await adminCookie(env);
  const slug = "antalya-transfer-test-post";

  const saveResponse = await worker.fetch(request("/api/admin/blog-posts", {
    method: "POST",
    headers: { cookie },
    body: JSON.stringify({
      slug,
      kicker: "Test guide",
      title: "Antalya transfer test post",
      description: "A test guide created from the admin panel.",
      metaLabel: "Test guide",
      bodyText: "Test section\nThis post proves blog content is stored in D1."
    })
  }), env);
  assert.equal(saveResponse.status, 200);

  const publicListResponse = await worker.fetch(request("/api/public/blog-posts", { method: "GET" }), env);
  const publicList = await publicListResponse.json();
  assert.equal(publicList.posts.some((post) => post.slug === slug), true);

  const detailResponse = await worker.fetch(request(`/api/public/blog-posts/${slug}`, { method: "GET" }), env);
  const detail = await detailResponse.json();
  assert.equal(detail.post.title, "Antalya transfer test post");
  assert.equal(detail.post.body[0][0], "Test section");

  const deleteResponse = await worker.fetch(request(`/api/admin/blog-posts/${slug}/delete`, {
    method: "POST",
    headers: { cookie },
    body: "{}"
  }), env);
  assert.equal(deleteResponse.status, 200);

  const afterDeleteResponse = await worker.fetch(request("/api/public/blog-posts", { method: "GET" }), env);
  const afterDelete = await afterDeleteResponse.json();
  assert.equal(afterDelete.posts.some((post) => post.slug === slug), false);
});
