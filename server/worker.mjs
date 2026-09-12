import { publicCatalog } from "./public-catalog.mjs";
import { privateVehiclePrice, validateBookingPayload } from "./validation.mjs";

const SESSION_COOKIE = "ayt_admin";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const cors = corsHeaders(env, origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/public/catalog" && request.method === "GET") {
        return json(publicCatalog, 200, cors);
      }

      if (url.pathname === "/api/bookings" && request.method === "POST") {
        return await createBooking(request, env, cors);
      }

      if (url.pathname === "/api/admin/login" && request.method === "POST") {
        return await loginAdmin(request, env, cors);
      }

      if (url.pathname === "/api/admin/logout" && request.method === "POST") {
        return logoutAdmin(cors);
      }

      if (url.pathname === "/api/admin/bookings" && request.method === "GET") {
        return await listAdminBookings(request, env, cors);
      }

      return json({ error: "Not found" }, 404, cors);
    } catch (error) {
      return json({ error: error.message || "Unexpected server error" }, 500, cors);
    }
  }
};

function corsHeaders(env, origin) {
  const allowed = String(env.ALLOWED_ORIGINS || "https://aytride.com,https://www.aytride.com,https://abdullahuysal07.github.io")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,accept",
    "vary": "Origin"
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

async function readJson(request) {
  const text = await request.text();
  if (!text || text.length > 20000) throw new Error("Invalid request body.");
  return JSON.parse(text);
}

async function createBooking(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);

  const input = await readJson(request);
  const result = validateBookingPayload(publicCatalog, input);
  if (!result.ok) return json({ error: "Validation failed", details: result.errors }, 400, cors);

  const privatePricing = parsePrivatePricing(env);
  const privatePrice = privateVehiclePrice(privatePricing, result.payload);
  const record = {
    ...result.payload,
    privateVehiclePriceEur: privatePrice,
    attributionJson: JSON.stringify(result.payload.attribution || {}),
    createdAt: new Date().toISOString()
  };

  const existing = await env.DB.prepare("select reference from bookings where reference = ?")
    .bind(record.reference)
    .first();

  if (existing) {
    return json({ ok: true, reference: record.reference, duplicate: true }, 200, cors);
  }

  await env.DB.prepare(`
    insert into bookings (
      reference, language, route_id, trip_type, pickup, dropoff, pickup_date, pickup_time,
      return_date, return_time, flight_number, hotel_address, vehicle_id, passengers,
      luggage, child_seats, guest_name, guest_phone, guest_email, notes, public_total_eur,
      quote_only, private_vehicle_price_eur, attribution_json, created_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    record.reference,
    record.language,
    record.routeId,
    record.tripType,
    record.pickup,
    record.dropoff,
    record.pickupDate,
    record.pickupTime,
    record.returnDate,
    record.returnTime,
    record.flightNumber,
    record.hotelAddress,
    record.vehicleId,
    record.passengers,
    record.luggage,
    record.childSeats,
    record.guestName,
    record.guestPhone,
    record.guestEmail,
    record.notes,
    record.publicTotalEur,
    record.quoteOnly ? 1 : 0,
    record.privateVehiclePriceEur,
    record.attributionJson,
    record.createdAt
  ).run();

  await sendBookingEmails(env, record);

  return json({
    ok: true,
    reference: record.reference,
    publicTotalEur: record.publicTotalEur,
    quoteOnly: record.quoteOnly
  }, 201, cors);
}

function parsePrivatePricing(env) {
  try {
    return JSON.parse(env.PRIVATE_PRICING_JSON || "{}");
  } catch {
    return {};
  }
}

async function sendBookingEmails(env, record) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return;
  const ownerEmail = env.BOOKING_EMAIL || publicCatalog.business.bookingEmail;
  const subject = `AYT Ride booking ${record.reference}`;
  const ownerText = ownerEmailText(record);
  await sendEmail(env, {
    to: ownerEmail,
    subject,
    text: ownerText,
    html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(ownerText)}</pre>`
  });

  if (record.guestEmail) {
    const guestText = guestEmailText(record);
    await sendEmail(env, {
      to: record.guestEmail,
      subject: `AYT Ride received your transfer request ${record.reference}`,
      text: guestText,
      html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(guestText)}</pre>`
    });
  }
}

async function sendEmail(env, message) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [message.to],
      reply_to: publicCatalog.business.bookingEmail,
      subject: message.subject,
      text: message.text,
      html: message.html
    })
  });
  if (!response.ok) throw new Error(`Email provider rejected request: ${await response.text()}`);
}

function ownerEmailText(record) {
  return [
    "AYT RIDE | NEW TRANSFER REQUEST",
    "",
    `Reference: ${record.reference}`,
    `Created: ${record.createdAt}`,
    "",
    "Guest",
    `Name: ${record.guestName}`,
    `WhatsApp: ${record.guestPhone}`,
    `Email: ${record.guestEmail || "-"}`,
    "",
    "Transfer",
    `Trip: ${record.tripType}`,
    `Route: ${record.pickup} -> ${record.dropoff}`,
    `Pickup: ${record.pickupDate} ${record.pickupTime}`,
    record.tripType === "return" ? `Return: ${record.returnDate} ${record.returnTime}` : "",
    `Flight: ${record.flightNumber || "-"}`,
    `Hotel/address: ${record.hotelAddress || "-"}`,
    `Vehicle: ${vehicleName(record.vehicleId)}`,
    `Passengers: ${record.passengers}`,
    `Suitcases: ${record.luggage}`,
    `Child seats: ${record.childSeats}`,
    "",
    "Pricing",
    `Guest price: ${record.quoteOnly ? "Exact quote required" : `EUR ${record.publicTotalEur}`}`,
    `Private vehicle cost: ${record.privateVehiclePriceEur == null ? "Not configured in backend" : `EUR ${record.privateVehiclePriceEur}`}`,
    "Payment: Pay on arrival / cash to driver",
    "",
    `Notes: ${record.notes || "-"}`
  ].filter(Boolean).join("\n");
}

function guestEmailText(record) {
  return [
    `Hello ${record.guestName},`,
    "",
    "We received your AYT Ride transfer request.",
    "",
    `Reference: ${record.reference}`,
    `Route: ${record.pickup} -> ${record.dropoff}`,
    `Pickup: ${record.pickupDate} ${record.pickupTime}`,
    `Vehicle: ${vehicleName(record.vehicleId)}`,
    `Estimated guest price: ${record.quoteOnly ? "Exact quote required" : `EUR ${record.publicTotalEur}`}`,
    "",
    "Your booking is not final until AYT Ride confirms vehicle availability and the exact meeting point on WhatsApp.",
    "Payment is made after the ride unless another arrangement is confirmed."
  ].join("\n");
}

function vehicleName(vehicleId) {
  return publicCatalog.vehicles.find((vehicle) => vehicle.id === vehicleId)?.name || vehicleId;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loginAdmin(request, env, cors) {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const emails = String(env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!emails.includes(email)) return json({ error: "Invalid login" }, 401, cors);
  if (!env.ADMIN_PASSWORD_SHA256 || !env.ADMIN_PASSWORD_SALT || !env.ADMIN_SESSION_SECRET) {
    return json({ error: "Admin authentication is not configured." }, 503, cors);
  }

  const actual = await sha256Hex(`${password}${env.ADMIN_PASSWORD_SALT}`);
  if (actual !== env.ADMIN_PASSWORD_SHA256) return json({ error: "Invalid login" }, 401, cors);

  const token = await signSession({ email, exp: Math.floor(Date.now() / 1000) + 86400 }, env.ADMIN_SESSION_SECRET);
  return json({ ok: true }, 200, {
    ...cors,
    "set-cookie": `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
  });
}

function logoutAdmin(cors) {
  return json({ ok: true }, 200, {
    ...cors,
    "set-cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  });
}

async function listAdminBookings(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await readSession(request, env.ADMIN_SESSION_SECRET);
  if (!session) return json({ error: "Unauthorized" }, 401, cors);

  const rows = await env.DB.prepare(`
    select reference, language, route_id, trip_type, pickup, dropoff, pickup_date, pickup_time,
      return_date, return_time, flight_number, hotel_address, vehicle_id, passengers,
      luggage, child_seats, guest_name, guest_phone, guest_email, notes, public_total_eur,
      quote_only, private_vehicle_price_eur, created_at
    from bookings
    order by created_at desc
    limit 200
  `).all();

  return json({
    bookings: (rows.results || []).map((row) => ({
      reference: row.reference,
      language: row.language,
      routeId: row.route_id,
      tripType: row.trip_type,
      pickup: row.pickup,
      dropoff: row.dropoff,
      pickupDate: row.pickup_date,
      pickupTime: row.pickup_time,
      returnDate: row.return_date,
      returnTime: row.return_time,
      flightNumber: row.flight_number,
      hotelAddress: row.hotel_address,
      vehicleId: row.vehicle_id,
      passengers: row.passengers,
      luggage: row.luggage,
      childSeats: row.child_seats,
      guestName: row.guest_name,
      guestPhone: row.guest_phone,
      guestEmail: row.guest_email,
      notes: row.notes,
      publicTotalEur: row.public_total_eur,
      quoteOnly: Boolean(row.quote_only),
      privateVehiclePriceEur: row.private_vehicle_price_eur,
      createdAt: row.created_at
    }))
  }, 200, cors);
}

async function readSession(request, secret) {
  if (!secret) return null;
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = await sha256Hex(`${payload}.${secret}`);
  if (signature !== expected) return null;
  try {
    const data = JSON.parse(base64UrlDecode(payload));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

async function signSession(data, secret) {
  const payload = base64UrlEncode(JSON.stringify(data));
  const signature = await sha256Hex(`${payload}.${secret}`);
  return `${payload}.${signature}`;
}

async function sha256Hex(value) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64UrlEncode(value) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return atob(padded);
}
