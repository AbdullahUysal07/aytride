import { publicCatalog } from "./public-catalog.mjs";
import { defaultBlogPosts } from "./blog-posts.mjs";
import { privateVehiclePrice, validateBookingPayload } from "./validation.mjs";

const SESSION_COOKIE = "ayt_admin";
const DEFAULT_EUR_TRY_RATE_API = "https://api.frankfurter.dev/v2/rate/eur/try";
const EXCHANGE_RATE_CACHE_MS = 6 * 60 * 60 * 1000;

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
        return json(await catalogForEnv(env), 200, cors);
      }

      const publicAffiliate = url.pathname.match(/^\/api\/public\/affiliates\/([^/]+)$/);
      if (publicAffiliate && request.method === "GET") {
        return await getPublicAffiliate(env, cors, decodeURIComponent(publicAffiliate[1]));
      }

      if (url.pathname === "/api/public/blog-posts" && request.method === "GET") {
        return await listPublicBlogPosts(env, cors);
      }

      const publicBlogPost = url.pathname.match(/^\/api\/public\/blog-posts\/([^/]+)$/);
      if (publicBlogPost && request.method === "GET") {
        return await getPublicBlogPost(env, cors, decodeURIComponent(publicBlogPost[1]));
      }

      if (url.pathname === "/api/health" && request.method === "GET") {
        return json(healthStatus(env), 200, cors);
      }

      if (url.pathname === "/api/analytics/events" && request.method === "POST") {
        return await createAnalyticsEvent(request, env, cors);
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

      if (url.pathname === "/api/admin/analytics" && request.method === "GET") {
        return await listAdminAnalytics(request, env, cors);
      }

      if (url.pathname === "/api/admin/affiliates" && request.method === "GET") {
        return await listAdminAffiliates(request, env, cors);
      }

      if (url.pathname === "/api/admin/affiliates" && request.method === "POST") {
        return await createAdminAffiliate(request, env, cors);
      }

      const affiliatePayment = url.pathname.match(/^\/api\/admin\/affiliates\/(\d+)\/payment$/);
      if (affiliatePayment && request.method === "POST") {
        return await createAdminAffiliatePayment(request, env, cors, Number(affiliatePayment[1]));
      }

      const affiliateStatus = url.pathname.match(/^\/api\/admin\/affiliates\/(\d+)\/status$/);
      if (affiliateStatus && request.method === "POST") {
        return await updateAdminAffiliateStatus(request, env, cors, Number(affiliateStatus[1]));
      }

      const affiliateDelete = url.pathname.match(/^\/api\/admin\/affiliates\/(\d+)\/delete$/);
      if (affiliateDelete && request.method === "POST") {
        return await deleteAdminAffiliate(request, env, cors, Number(affiliateDelete[1]));
      }

      const bookingAction = url.pathname.match(/^\/api\/admin\/bookings\/([^/]+)\/(confirm|pending|delete|restore)$/);
      if (bookingAction && request.method === "POST") {
        return await updateAdminBookingStatus(request, env, cors, decodeURIComponent(bookingAction[1]), bookingAction[2]);
      }

      if (url.pathname === "/api/admin/prices" && request.method === "GET") {
        return await listAdminPrices(request, env, cors);
      }

      if (url.pathname === "/api/admin/prices" && request.method === "POST") {
        return await updateAdminPrice(request, env, cors);
      }

      if (url.pathname === "/api/admin/settings" && request.method === "GET") {
        return await listAdminSettings(request, env, cors);
      }

      if (url.pathname === "/api/admin/settings" && request.method === "POST") {
        return await updateAdminSettings(request, env, cors);
      }

      if (url.pathname === "/api/admin/settings/refresh-rate" && request.method === "POST") {
        return await refreshAdminExchangeRate(request, env, cors);
      }

      if (url.pathname === "/api/admin/blog-posts" && request.method === "GET") {
        return await listAdminBlogPosts(request, env, cors);
      }

      if (url.pathname === "/api/admin/blog-posts" && request.method === "POST") {
        return await updateAdminBlogPost(request, env, cors);
      }

      const blogAction = url.pathname.match(/^\/api\/admin\/blog-posts\/([^/]+)\/delete$/);
      if (blogAction && request.method === "POST") {
        return await deleteAdminBlogPost(request, env, cors, decodeURIComponent(blogAction[1]));
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
    "access-control-allow-headers": "content-type,accept,authorization",
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

function healthStatus(env) {
  const adminConfigured = Boolean(
    env.ADMIN_EMAILS &&
    env.ADMIN_PASSWORD_SHA256 &&
    env.ADMIN_PASSWORD_SALT &&
    env.ADMIN_SESSION_SECRET
  );
  return {
    ok: true,
    version: publicCatalog.version,
    dbConfigured: Boolean(env.DB),
    emailConfigured: Boolean(env.RESEND_API_KEY && env.MAIL_FROM && (env.BOOKING_EMAIL || publicCatalog.business.bookingEmail)),
    adminConfigured
  };
}

async function readJson(request) {
  const text = await request.text();
  if (!text || text.length > 20000) throw new Error("Invalid request body.");
  return JSON.parse(text);
}

async function createBooking(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);

  const input = await readJson(request);
  const liveCatalog = await catalogForEnv(env);
  const result = validateBookingPayload(liveCatalog, input);
  if (!result.ok) return json({ error: "Validation failed", details: result.errors }, 400, cors);

  const privatePricing = parsePrivatePricing(env);
  const privatePrice = privateVehiclePrice(privatePricing, result.payload);
  const affiliate = result.payload.affiliateCode
    ? await findAffiliateByCode(env, result.payload.affiliateCode, true)
    : null;
  if (result.payload.affiliateCode && !affiliate) {
    return json({ error: "Partner code is not valid or active." }, 400, cors);
  }
  const attribution = {
    ...(result.payload.attribution || {}),
    ...(affiliate ? {
      affiliate_code: affiliate.code,
      affiliate_partner: affiliate.name,
      affiliate_commission_eur: Number(affiliate.commission_eur || 5)
    } : {})
  };
  const record = {
    ...result.payload,
    privateVehiclePriceEur: privatePrice,
    attributionJson: JSON.stringify(attribution),
    createdAt: new Date().toISOString()
  };

  const existing = await env.DB.prepare("select reference from bookings where reference = ?")
    .bind(record.reference)
    .first();

  if (existing) {
    return json({ ok: true, reference: record.reference, duplicate: true, emailStatus: "not_sent_duplicate" }, 200, cors);
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

  const emailStatus = await sendBookingEmails(env, record);

  return json({
    ok: true,
    reference: record.reference,
    publicTotalEur: record.publicTotalEur,
    affiliateCode: affiliate?.code || "",
    quoteOnly: record.quoteOnly,
    emailStatus
  }, 201, cors);
}

async function catalogForEnv(env) {
  const catalog = structuredCloneSafe(publicCatalog);
  if (!env.DB) return catalog;
  try {
    const rows = await env.DB.prepare("select route_id, vehicle_id, price_eur, updated_at from route_prices").all();
    (rows.results || []).forEach((row) => {
      const route = catalog.routes.find((item) => item.id === row.route_id);
      if (!route || !route.prices || row.price_eur == null) return;
      route.prices[row.vehicle_id] = Number(row.price_eur);
    });
  } catch (error) {
    console.warn("Price overrides are not available yet.", error);
  }
  return catalog;
}

async function listPublicBlogPosts(env, cors) {
  const posts = await blogPostsForEnv(env, false);
  return json({ posts }, 200, cors);
}

async function getPublicBlogPost(env, cors, slug) {
  const cleanSlugValue = cleanSlug(slug);
  if (!cleanSlugValue) return json({ error: "Blog post not found." }, 404, cors);
  const posts = await blogPostsForEnv(env, false);
  const post = posts.find((item) => item.slug === cleanSlugValue);
  if (!post) return json({ error: "Blog post not found." }, 404, cors);
  return json({ post }, 200, cors);
}

async function blogPostsForEnv(env, includeDeleted) {
  if (!env.DB) return defaultBlogPostRows();
  try {
    const where = includeDeleted ? "" : "where deleted_at is null and status = 'published'";
    const rows = await env.DB.prepare(`
      select slug, status, kicker, title, description, body_json, meta_label, created_at, updated_at, deleted_at
      from blog_posts
      ${where}
      order by updated_at desc
    `).all();
    const posts = (rows.results || []).map(blogPostFromRow).filter(Boolean);
    return posts;
  } catch (error) {
    console.warn("Blog posts are not available yet.", error);
  }
  return defaultBlogPostRows();
}

function defaultBlogPostRows() {
  return defaultBlogPosts.map((post) => ({
    ...post,
    status: "published",
    metaLabel: post.metaLabel || "AYT Ride guide",
    bodyText: bodyToText(post.body),
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    deletedAt: null
  }));
}

function blogPostFromRow(row) {
  if (!row || row.deleted_at) return null;
  let body = [];
  try {
    const parsed = JSON.parse(row.body_json || "[]");
    if (Array.isArray(parsed)) {
      body = parsed
        .filter((item) => Array.isArray(item) && item.length >= 2)
        .map((item) => [cleanText(item[0], 140), cleanText(item[1], 2400)])
        .filter(([heading, textValue]) => heading && textValue);
    }
  } catch {
    body = [];
  }
  if (!body.length) body = [["Transfer notes", cleanText(row.description, 700)]];
  return {
    slug: row.slug,
    status: row.status || "published",
    kicker: row.kicker,
    title: row.title,
    description: row.description,
    metaLabel: row.meta_label || "AYT Ride guide",
    body,
    bodyText: bodyToText(body),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || null
  };
}

function bodyToText(body) {
  return (body || []).map(([heading, textValue]) => `${heading}\n${textValue}`).join("\n\n");
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function parsePrivatePricing(env) {
  try {
    return JSON.parse(env.PRIVATE_PRICING_JSON || "{}");
  } catch {
    return {};
  }
}

async function sendBookingEmails(env, record) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return "skipped_not_configured";
  const ownerEmail = env.BOOKING_EMAIL || publicCatalog.business.bookingEmail;
  const subject = `AYT Ride booking ${record.reference}`;
  const ownerText = ownerEmailText(record);
  try {
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
    return "sent";
  } catch (error) {
    console.error("Booking was saved, but email delivery failed.", error);
    return "failed";
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
  return json({ ok: true, sessionToken: token }, 200, {
    ...cors,
    "set-cookie": `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400`
  });
}

function logoutAdmin(cors) {
  return json({ ok: true }, 200, {
    ...cors,
    "set-cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`
  });
}

async function listAdminBookings(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const rows = await env.DB.prepare(`
    select reference, language, route_id, trip_type, pickup, dropoff, pickup_date, pickup_time,
      return_date, return_time, flight_number, hotel_address, vehicle_id, passengers,
      luggage, child_seats, guest_name, guest_phone, guest_email, notes, public_total_eur,
      quote_only, private_vehicle_price_eur, attribution_json, status, confirmed_at, deleted_at, updated_at, created_at
    from bookings
    where deleted_at is null
    order by created_at desc
    limit 200
  `).all();

  const liveCatalog = await catalogForEnv(env);
  const settings = await adminFinanceSettings(env);
  const bookings = (rows.results || []).map((row) => adminBooking(row, liveCatalog, settings));

  return json({
    bookings,
    summary: adminSummary(bookings),
    settings
  }, 200, cors);
}

async function createAnalyticsEvent(request, env, cors) {
  if (!env.DB) return json({ error: "Analytics database is not configured." }, 503, cors);
  const body = await request.json();
  const eventType = String(body.eventType || "").trim();
  const allowedEvents = new Set(["page_view", "booking_quote_started", "booking_confirmed", "guide_booking_cta_clicked"]);
  if (!allowedEvents.has(eventType)) return json({ error: "Unsupported analytics event." }, 400, cors);

  const visitorId = cleanAnalyticsValue(body.visitorId, 80);
  const path = cleanAnalyticsPath(body.path);
  if (!visitorId || !path) return json({ error: "Analytics event is missing required fields." }, 400, cors);

  const now = new Date().toISOString();
  await env.DB.prepare(`
    insert into analytics_events (
      event_type, visitor_id, path, source, medium, campaign, referrer_host, route_id, created_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    eventType,
    visitorId,
    path,
    cleanAnalyticsValue(body.source, 80) || "direct",
    cleanAnalyticsValue(body.medium, 80),
    cleanAnalyticsValue(body.campaign, 120),
    cleanAnalyticsValue(body.referrerHost, 160),
    cleanAnalyticsValue(body.routeId, 80),
    now
  ).run();

  return json({ ok: true }, 201, cors);
}

async function listAdminAnalytics(request, env, cors) {
  if (!env.DB) return json({ error: "Analytics database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 6);
  since.setUTCHours(0, 0, 0, 0);
  const rows = await env.DB.prepare(`
    select event_type, visitor_id, path, source, medium, campaign, referrer_host, route_id, created_at
    from analytics_events
    where created_at >= ?
    order by created_at desc
    limit 10000
  `).bind(since.toISOString()).all();

  return json(analyticsSummary(rows.results || []), 200, cors);
}

async function getPublicAffiliate(env, cors, rawCode) {
  if (!env.DB) return json({ valid: false }, 200, cors);
  const partner = await findAffiliateByCode(env, rawCode, true);
  return json(partner
    ? { valid: true, code: partner.code, name: partner.name }
    : { valid: false }, 200, cors);
}

async function findAffiliateByCode(env, rawCode, activeOnly = false) {
  const code = normalizeAffiliateCode(rawCode);
  if (!code || !env.DB) return null;
  const statusClause = activeOnly ? " and status = 'active'" : "";
  return env.DB.prepare(`
    select id, code, name, contact_name, phone, email, commission_eur, status, created_at, updated_at
    from affiliate_partners
    where code = ?${statusClause}
  `).bind(code).first();
}

async function listAdminAffiliates(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const [partnersResult, bookingsResult, paymentsResult] = await Promise.all([
    env.DB.prepare(`
      select id, code, name, contact_name, phone, email, commission_eur, status, created_at, updated_at
      from affiliate_partners
      where status <> 'deleted'
      order by status asc, name asc
    `).all(),
    env.DB.prepare(`
      select reference, trip_type, attribution_json, confirmed_at
      from bookings
      where status = 'confirmed' and deleted_at is null
      order by confirmed_at desc
      limit 5000
    `).all(),
    env.DB.prepare(`
      select id, partner_id, amount_eur, note, paid_at, created_at
      from affiliate_payments
      order by paid_at desc, id desc
      limit 5000
    `).all()
  ]);

  const bookings = bookingsResult.results || [];
  const payments = paymentsResult.results || [];
  const partners = (partnersResult.results || []).map((partner) => affiliateAdminRecord(partner, bookings, payments));
  const totals = partners.reduce((sum, partner) => ({
    partners: sum.partners + 1,
    rides: sum.rides + partner.rides,
    earnedEur: sum.earnedEur + partner.earnedEur,
    paidEur: sum.paidEur + partner.paidEur,
    balanceEur: sum.balanceEur + partner.balanceEur
  }), { partners: 0, rides: 0, earnedEur: 0, paidEur: 0, balanceEur: 0 });

  return json({ partners, totals }, 200, cors);
}

async function createAdminAffiliate(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const body = await readJson(request);
  const name = cleanAffiliateText(body.name, 120);
  const code = normalizeAffiliateCode(body.code) || generateAffiliateCode(name);
  const contactName = cleanAffiliateText(body.contactName, 120);
  const phone = cleanAffiliateText(body.phone, 40);
  const email = cleanAffiliateText(body.email, 180).toLowerCase();
  const commissionEur = Number(body.commissionEur ?? 5);
  if (!name) return json({ error: "Partner name is required." }, 400, cors);
  if (!code || code.length < 3) return json({ error: "Partner code must contain at least 3 characters." }, 400, cors);
  if (!Number.isFinite(commissionEur) || commissionEur <= 0 || commissionEur > 1000) {
    return json({ error: "Commission must be between EUR 0 and EUR 1000." }, 400, cors);
  }

  const existing = await findAffiliateByCode(env, code);
  if (existing) return json({ error: "This partner code is already in use." }, 409, cors);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    insert into affiliate_partners (
      code, name, contact_name, phone, email, commission_eur, status, created_at, updated_at
    ) values (?, ?, ?, ?, ?, ?, 'active', ?, ?)
  `).bind(code, name, contactName, phone, email, commissionEur, now, now).run();
  if (!result?.success) return json({ error: "Partner could not be created." }, 500, cors);
  const partner = await findAffiliateByCode(env, code);
  return json({ ok: true, partner: affiliateAdminRecord(partner, [], []) }, 201, cors);
}

async function createAdminAffiliatePayment(request, env, cors, partnerId) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;
  const partner = await env.DB.prepare(`
    select id, code, name, contact_name, phone, email, commission_eur, status, created_at, updated_at
    from affiliate_partners where id = ?
  `).bind(partnerId).first();
  if (!partner) return json({ error: "Partner not found." }, 404, cors);
  const body = await readJson(request);
  const amountEur = Number(body.amountEur);
  if (!Number.isFinite(amountEur) || amountEur <= 0) return json({ error: "Payment amount must be positive." }, 400, cors);

  const snapshot = await affiliateSnapshot(env, partner);
  if (amountEur > snapshot.balanceEur + 0.001) {
    return json({ error: `Payment cannot exceed the EUR ${snapshot.balanceEur.toFixed(2)} balance.` }, 400, cors);
  }
  const now = new Date().toISOString();
  const paidAt = /^\d{4}-\d{2}-\d{2}$/.test(String(body.paidAt || ""))
    ? `${body.paidAt}T12:00:00.000Z`
    : now;
  const result = await env.DB.prepare(`
    insert into affiliate_payments (partner_id, amount_eur, note, paid_at, created_at)
    values (?, ?, ?, ?, ?)
  `).bind(partnerId, amountEur, cleanAffiliateText(body.note, 240), paidAt, now).run();
  if (!result?.success) return json({ error: "Payment could not be recorded." }, 500, cors);
  return json({ ok: true, partnerId, amountEur }, 201, cors);
}

async function updateAdminAffiliateStatus(request, env, cors, partnerId) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;
  const body = await readJson(request);
  const status = body.status === "inactive" ? "inactive" : "active";
  const result = await env.DB.prepare(`
    update affiliate_partners set status = ?, updated_at = ? where id = ?
  `).bind(status, new Date().toISOString(), partnerId).run();
  if (!result?.success) return json({ error: "Partner status could not be updated." }, 500, cors);
  return json({ ok: true, partnerId, status }, 200, cors);
}

async function deleteAdminAffiliate(request, env, cors, partnerId) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;
  const partner = await env.DB.prepare(`
    select id, code, name, contact_name, phone, email, commission_eur, status, created_at, updated_at
    from affiliate_partners where id = ?
  `).bind(partnerId).first();
  if (!partner || partner.status === "deleted") return json({ error: "Partner not found." }, 404, cors);
  const result = await env.DB.prepare(`
    update affiliate_partners set status = 'deleted', updated_at = ? where id = ?
  `).bind(new Date().toISOString(), partnerId).run();
  if (!result?.success) return json({ error: "Partner could not be deleted." }, 500, cors);
  return json({ ok: true, partnerId, status: "deleted" }, 200, cors);
}

async function affiliateSnapshot(env, partner) {
  const [bookingsResult, paymentsResult] = await Promise.all([
    env.DB.prepare(`
      select reference, trip_type, attribution_json, confirmed_at
      from bookings where status = 'confirmed' and deleted_at is null
    `).all(),
    env.DB.prepare(`
      select id, partner_id, amount_eur, note, paid_at, created_at
      from affiliate_payments where partner_id = ? order by paid_at desc, id desc
    `).bind(partner.id).all()
  ]);
  return affiliateAdminRecord(partner, bookingsResult.results || [], paymentsResult.results || []);
}

function affiliateAdminRecord(partner, bookingRows, paymentRows) {
  const code = normalizeAffiliateCode(partner.code);
  const linkedBookings = bookingRows.filter((row) => normalizeAffiliateCode(parseAttribution(row.attribution_json).affiliate_code) === code);
  const rides = linkedBookings.reduce((total, row) => total + (row.trip_type === "return" ? 2 : 1), 0);
  const earnedEur = linkedBookings.reduce((total, row) => {
    const attribution = parseAttribution(row.attribution_json);
    const commission = Number(attribution.affiliate_commission_eur ?? partner.commission_eur ?? 5);
    return total + commission * (row.trip_type === "return" ? 2 : 1);
  }, 0);
  const payments = paymentRows
    .filter((row) => Number(row.partner_id) === Number(partner.id))
    .map((row) => ({
      id: row.id,
      amountEur: Number(row.amount_eur || 0),
      note: row.note || "",
      paidAt: row.paid_at,
      createdAt: row.created_at
    }));
  const paidEur = payments.reduce((total, payment) => total + payment.amountEur, 0);
  return {
    id: Number(partner.id),
    code,
    name: partner.name,
    contactName: partner.contact_name || "",
    phone: partner.phone || "",
    email: partner.email || "",
    commissionEur: Number(partner.commission_eur || 5),
    status: partner.status || "active",
    createdAt: partner.created_at,
    updatedAt: partner.updated_at,
    rides,
    bookings: linkedBookings.length,
    earnedEur,
    paidEur,
    balanceEur: Math.max(0, earnedEur - paidEur),
    payments
  };
}

function normalizeAffiliateCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32);
}

function cleanAffiliateText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function generateAffiliateCode(name) {
  const base = String(name || "PARTNER")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 16) || "PARTNER";
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${base}-${suffix}`;
}

async function updateAdminBookingStatus(request, env, cors, reference, action) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const now = new Date().toISOString();
  let result;
  if (action === "confirm") {
    result = await env.DB.prepare(`
      update bookings
      set status = 'confirmed',
          confirmed_at = coalesce(confirmed_at, ?),
          updated_at = ?
      where reference = ? and deleted_at is null
    `).bind(now, now, reference).run();
  } else if (action === "pending") {
    result = await env.DB.prepare(`
      update bookings
      set status = 'pending',
          confirmed_at = null,
          updated_at = ?
      where reference = ? and deleted_at is null
    `).bind(now, reference).run();
  } else if (action === "delete") {
    result = await env.DB.prepare(`
      update bookings
      set status = 'deleted',
          deleted_at = ?,
          updated_at = ?
      where reference = ?
    `).bind(now, now, reference).run();
  } else {
    result = await env.DB.prepare(`
      update bookings
      set status = 'pending',
          deleted_at = null,
          updated_at = ?
      where reference = ? and deleted_at is not null
    `).bind(now, reference).run();
  }

  if (!result?.success) return json({ error: "Booking could not be updated." }, 500, cors);
  return json({ ok: true, reference, action }, 200, cors);
}

async function listAdminPrices(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const liveCatalog = await catalogForEnv(env);
  return json({
    vehicles: liveCatalog.vehicles.map((item) => ({
      id: item.id,
      name: item.name,
      shortName: item.shortName
    })),
    routes: liveCatalog.routes.filter((route) => route.available && !route.quoteOnly).map((route) => ({
      id: route.id,
      label: route.destination,
      origin: route.origin,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      prices: route.prices || {}
    }))
  }, 200, cors);
}

async function updateAdminPrice(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const body = await readJson(request);
  const routeId = cleanAdminId(body.routeId);
  const vehicleId = cleanAdminId(body.vehicleId);
  const priceEur = Math.round(Number(body.priceEur));

  const route = publicCatalog.routes.find((item) => item.id === routeId && item.available && !item.quoteOnly);
  const vehicle = publicCatalog.vehicles.find((item) => item.id === vehicleId);
  if (!route || !vehicle) return json({ error: "Route or vehicle is not available." }, 400, cors);
  if (!Number.isFinite(priceEur) || priceEur < 1 || priceEur > 1000) {
    return json({ error: "Price must be between 1 and 1000 EUR." }, 400, cors);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(`
    insert into route_prices (route_id, vehicle_id, price_eur, updated_at)
    values (?, ?, ?, ?)
    on conflict(route_id, vehicle_id) do update set
      price_eur = excluded.price_eur,
      updated_at = excluded.updated_at
  `).bind(routeId, vehicleId, priceEur, now).run();

  return json({ ok: true, routeId, vehicleId, priceEur, updatedAt: now }, 200, cors);
}

async function listAdminSettings(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  return json({ settings: await adminFinanceSettings(env) }, 200, cors);
}

async function updateAdminSettings(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const body = await readJson(request);
  const settings = normalizeFinanceSettings(body);
  const now = new Date().toISOString();

  await writeAdminSetting(env, "driver_rate_try_per_km", settings.driverRateTryPerKm, now);
  await writeAdminSetting(env, "eur_try_rate_fallback", settings.eurTryRateFallback, now);

  return json({ ok: true, settings: await adminFinanceSettings(env) }, 200, cors);
}

async function refreshAdminExchangeRate(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  return json({ ok: true, settings: await adminFinanceSettings(env, { forceRefresh: true }) }, 200, cors);
}

async function writeAdminSetting(env, key, value, updatedAt) {
  await env.DB.prepare(`
    insert into admin_settings (key, value, updated_at)
    values (?, ?, ?)
    on conflict(key) do update set
      value = excluded.value,
      updated_at = excluded.updated_at
  `).bind(key, String(value), updatedAt).run();
}

async function listAdminBlogPosts(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  return json({ posts: await blogPostsForEnv(env, true) }, 200, cors);
}

async function updateAdminBlogPost(request, env, cors) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const body = await readJson(request);
  const post = normalizeBlogPostInput(body);
  if (!post.slug || !post.title || !post.description || !post.body.length) {
    return json({ error: "Blog slug, title, description and body are required." }, 400, cors);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(`
    insert into blog_posts (slug, status, kicker, title, description, body_json, meta_label, created_at, updated_at, deleted_at)
    values (?, 'published', ?, ?, ?, ?, ?, ?, ?, null)
    on conflict(slug) do update set
      status = 'published',
      kicker = excluded.kicker,
      title = excluded.title,
      description = excluded.description,
      body_json = excluded.body_json,
      meta_label = excluded.meta_label,
      updated_at = excluded.updated_at,
      deleted_at = null
  `).bind(
    post.slug,
    post.kicker,
    post.title,
    post.description,
    JSON.stringify(post.body),
    post.metaLabel,
    now,
    now
  ).run();

  return json({ ok: true, post: (await blogPostsForEnv(env, true)).find((item) => item.slug === post.slug) }, 200, cors);
}

async function deleteAdminBlogPost(request, env, cors, slug) {
  if (!env.DB) return json({ error: "Booking database is not configured." }, 503, cors);
  const session = await requireAdmin(request, env, cors);
  if (session instanceof Response) return session;

  const cleanSlugValue = cleanSlug(slug);
  if (!cleanSlugValue) return json({ error: "Invalid blog slug." }, 400, cors);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    update blog_posts
    set status = 'deleted',
        deleted_at = ?,
        updated_at = ?
    where slug = ?
  `).bind(now, now, cleanSlugValue).run();

  if (!result?.success) return json({ error: "Blog post could not be deleted." }, 500, cors);
  return json({ ok: true, slug: cleanSlugValue }, 200, cors);
}

function cleanAdminId(value) {
  return String(value || "").replace(/[^a-z0-9-]/gi, "").slice(0, 80);
}

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeFinanceSettings(input) {
  const driverRateTryPerKm = Number(input.driverRateTryPerKm);
  const eurTryRateFallback = Number(input.eurTryRateFallback ?? input.eurTryRate);
  if (!Number.isFinite(driverRateTryPerKm) || driverRateTryPerKm < 1 || driverRateTryPerKm > 500) {
    throw new Error("Driver rate must be between 1 and 500 TL per km.");
  }
  if (!Number.isFinite(eurTryRateFallback) || eurTryRateFallback < 1 || eurTryRateFallback > 500) {
    throw new Error("Fallback EUR/TRY rate must be between 1 and 500.");
  }
  return {
    driverRateTryPerKm: roundMoney(driverRateTryPerKm),
    eurTryRateFallback: roundMoney(eurTryRateFallback)
  };
}

function normalizeBlogPostInput(input) {
  const body = bodyFromText(input.bodyText || input.body || "");
  return {
    slug: cleanSlug(input.slug || input.title),
    kicker: cleanText(input.kicker || "Travel guide", 80),
    title: cleanText(input.title, 140),
    description: cleanText(input.description, 320),
    metaLabel: cleanText(input.metaLabel || "AYT Ride guide", 80),
    body
  };
}

function bodyFromText(value) {
  const blocks = String(value || "")
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 8);

  return blocks.map((block) => {
    const lines = block.split(/\n+/).map((line) => cleanText(line, 2400)).filter(Boolean);
    if (lines.length <= 1) return ["Transfer details", lines[0] || ""];
    return [cleanText(lines[0], 140), cleanText(lines.slice(1).join(" "), 2400)];
  }).filter(([heading, textValue]) => heading && textValue);
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

async function requireAdmin(request, env, cors) {
  const session = await readSession(request, env.ADMIN_SESSION_SECRET);
  if (!session) return json({ error: "Unauthorized" }, 401, cors);
  return session;
}

async function adminFinanceSettings(env, options = {}) {
  const envDriverRateTryPerKm = Number(env.ADMIN_DRIVER_RATE_TRY_PER_KM || 35);
  const envEurTryRate = Number(env.ADMIN_EUR_TRY_RATE || 45);
  const settings = {
    driverRateTryPerKm: positiveNumber(envDriverRateTryPerKm, 35),
    eurTryRate: positiveNumber(envEurTryRate, 45),
    eurTryRateFallback: positiveNumber(envEurTryRate, 45),
    eurTryRateSource: "fallback",
    eurTryRateDate: null,
    eurTryRateFetchedAt: null,
    eurTryRateAutoEnabled: autoExchangeRateEnabled(env),
    exchangeRateProvider: "Frankfurter"
  };
  if (!env.DB) return settings;
  try {
    const stored = await readAdminSettingsMap(env);
    settings.driverRateTryPerKm = positiveNumber(stored.driver_rate_try_per_km, settings.driverRateTryPerKm);
    settings.eurTryRateFallback = positiveNumber(
      stored.eur_try_rate_fallback ?? stored.eur_try_rate,
      settings.eurTryRateFallback
    );
    settings.eurTryRate = settings.eurTryRateFallback;

    if (!settings.eurTryRateAutoEnabled) return settings;

    const cached = {
      rate: positiveNumber(stored.eur_try_rate_auto, 0),
      fetchedAt: stored.eur_try_rate_auto_fetched_at || "",
      date: stored.eur_try_rate_auto_date || ""
    };
    if (!options.forceRefresh && cached.rate && isFreshIso(cached.fetchedAt, EXCHANGE_RATE_CACHE_MS)) {
      return {
        ...settings,
        eurTryRate: cached.rate,
        eurTryRateSource: "auto-cache",
        eurTryRateDate: cached.date,
        eurTryRateFetchedAt: cached.fetchedAt
      };
    }

    try {
      const liveRate = await fetchEurTryRate(env);
      await persistExchangeRate(env, liveRate);
      return {
        ...settings,
        eurTryRate: liveRate.rate,
        eurTryRateSource: "auto-live",
        eurTryRateDate: liveRate.date,
        eurTryRateFetchedAt: liveRate.fetchedAt,
        exchangeRateProvider: liveRate.provider
      };
    } catch (rateError) {
      console.warn("Automatic EUR/TRY rate is not available.", rateError);
      if (cached.rate) {
        return {
          ...settings,
          eurTryRate: cached.rate,
          eurTryRateSource: "auto-stale",
          eurTryRateDate: cached.date,
          eurTryRateFetchedAt: cached.fetchedAt
        };
      }
    }
  } catch (error) {
    console.warn("Admin settings are not available yet.", error);
  }
  return settings;
}

async function readAdminSettingsMap(env) {
  const rows = await env.DB.prepare("select key, value from admin_settings").all();
  return Object.fromEntries((rows.results || []).map((row) => [row.key, row.value]));
}

function autoExchangeRateEnabled(env) {
  return String(env.AUTO_EUR_TRY_RATE ?? "true").toLowerCase() !== "false";
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function isFreshIso(value, maxAgeMs) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) && Date.now() - time < maxAgeMs;
}

async function fetchEurTryRate(env) {
  const url = String(env.EUR_TRY_RATE_API_URL || DEFAULT_EUR_TRY_RATE_API);
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    cf: { cacheTtl: 3600, cacheEverything: true }
  });
  if (!response.ok) throw new Error(`Exchange rate provider rejected request: ${response.status}`);
  const data = await response.json();
  const rate = positiveNumber(data.rate ?? data.rates?.TRY ?? data.rates?.try, 0);
  if (!rate) throw new Error("Exchange rate provider did not return EUR/TRY.");
  return {
    rate: roundMoney(rate),
    date: cleanText(data.date || new Date().toISOString().slice(0, 10), 20),
    fetchedAt: new Date().toISOString(),
    provider: "Frankfurter"
  };
}

async function persistExchangeRate(env, liveRate) {
  await writeAdminSetting(env, "eur_try_rate_auto", liveRate.rate, liveRate.fetchedAt);
  await writeAdminSetting(env, "eur_try_rate_auto_date", liveRate.date, liveRate.fetchedAt);
  await writeAdminSetting(env, "eur_try_rate_auto_fetched_at", liveRate.fetchedAt, liveRate.fetchedAt);
  await writeAdminSetting(env, "eur_try_rate_provider", liveRate.provider, liveRate.fetchedAt);
}

function adminBooking(row, catalog, settings) {
  const route = catalog.routes.find((item) => item.id === row.route_id);
  const distanceKm = Number(route?.distanceKm || 0);
  const ways = row.trip_type === "return" ? 2 : 1;
  const attribution = parseAttribution(row.attribution_json);
  const revenueEur = row.quote_only ? 0 : Number(row.public_total_eur || 0);
  const revenueTry = Math.round(revenueEur * settings.eurTryRate);
  const driverCostTry = distanceKm ? Math.round(distanceKm * ways * settings.driverRateTryPerKm) : null;
  const affiliateCommissionEur = attribution.affiliate_code
    ? roundMoney(Number(attribution.affiliate_commission_eur || 5) * ways)
    : 0;
  const affiliateCommissionTry = Math.round(affiliateCommissionEur * settings.eurTryRate);
  const totalCostTry = driverCostTry == null ? null : driverCostTry + affiliateCommissionTry;
  const profitTry = totalCostTry == null ? null : revenueTry - totalCostTry;

  return {
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
    attribution,
    status: row.status || "pending",
    confirmedAt: row.confirmed_at,
    deletedAt: row.deleted_at,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
    distanceKm,
    ways,
    driverRateTryPerKm: settings.driverRateTryPerKm,
    driverCostTry,
    affiliateCommissionEur,
    affiliateCommissionTry,
    totalCostTry,
    revenueTry,
    profitTry
  };
}

function parseAttribution(value) {
  try {
    const attribution = JSON.parse(value || "{}");
    return attribution && typeof attribution === "object" && !Array.isArray(attribution) ? attribution : {};
  } catch {
    return {};
  }
}

function cleanAnalyticsValue(value, maxLength) {
  return String(value || "")
    .replace(/[\r\n\t]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanAnalyticsPath(value) {
  const path = cleanAnalyticsValue(value, 180);
  return path.startsWith("/") && !path.includes("?") && !path.includes("#") ? path : "";
}

function analyticsSummary(events) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return dateKey(date);
  });
  const daily = new Map(days.map((day) => [day, { date: day, visitors: new Set(), pageViews: 0, quoteStarts: 0, bookings: 0 }]));
  const sources = new Map();
  const allVisitors = new Set();

  for (const event of events) {
    const day = dateKey(new Date(event.created_at));
    const item = daily.get(day);
    if (!item) continue;
    if (event.visitor_id) {
      item.visitors.add(event.visitor_id);
      allVisitors.add(event.visitor_id);
    }
    if (event.event_type === "page_view") {
      item.pageViews += 1;
      const label = event.source || event.referrer_host || "direct";
      sources.set(label, (sources.get(label) || 0) + 1);
    }
    if (event.event_type === "booking_quote_started") item.quoteStarts += 1;
    if (event.event_type === "booking_confirmed") item.bookings += 1;
  }

  const daysOut = days.map((day) => {
    const item = daily.get(day);
    return {
      date: day,
      visitors: item.visitors.size,
      pageViews: item.pageViews,
      quoteStarts: item.quoteStarts,
      bookings: item.bookings
    };
  });
  const today = daysOut.at(-1) || { visitors: 0, pageViews: 0, quoteStarts: 0, bookings: 0 };
  return {
    collectedFrom: events.length ? daysOut.find((item) => item.pageViews || item.quoteStarts || item.bookings)?.date || null : null,
    today,
    week: {
      visitors: allVisitors.size,
      pageViews: daysOut.reduce((total, item) => total + item.pageViews, 0),
      quoteStarts: daysOut.reduce((total, item) => total + item.quoteStarts, 0),
      bookings: daysOut.reduce((total, item) => total + item.bookings, 0)
    },
    days: daysOut,
    sources: [...sources.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([source, pageViews]) => ({ source, pageViews }))
  };
}

function adminSummary(bookings) {
  const confirmed = bookings.filter((item) => item.status === "confirmed" && item.confirmedAt);
  const now = new Date();
  const today = dateKey(now);
  const weekStart = startOfWeek(now);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return {
    pendingCount: bookings.filter((item) => item.status !== "confirmed").length,
    confirmedCount: confirmed.length,
    today: sumPeriod(confirmed, (item) => dateKey(new Date(item.confirmedAt)) === today),
    week: sumPeriod(confirmed, (item) => new Date(item.confirmedAt) >= weekStart),
    month: sumPeriod(confirmed, (item) => new Date(item.confirmedAt) >= monthStart),
    total: sumPeriod(confirmed, () => true)
  };
}

function sumPeriod(bookings, filter) {
  return bookings.filter(filter).reduce((total, item) => ({
    count: total.count + 1,
    revenueEur: total.revenueEur + Number(item.publicTotalEur || 0),
    revenueTry: total.revenueTry + Number(item.revenueTry || 0),
    driverCostTry: total.driverCostTry + Number(item.driverCostTry || 0),
    affiliateCommissionEur: total.affiliateCommissionEur + Number(item.affiliateCommissionEur || 0),
    affiliateCommissionTry: total.affiliateCommissionTry + Number(item.affiliateCommissionTry || 0),
    totalCostTry: total.totalCostTry + Number(item.totalCostTry || 0),
    profitTry: total.profitTry + Number(item.profitTry || 0)
  }), {
    count: 0,
    revenueEur: 0,
    revenueTry: 0,
    driverCostTry: 0,
    affiliateCommissionEur: 0,
    affiliateCommissionTry: 0,
    totalCostTry: 0,
    profitTry: 0
  });
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = base.getUTCDay() || 7;
  base.setUTCDate(base.getUTCDate() - day + 1);
  return base;
}

async function readSession(request, secret) {
  if (!secret) return null;
  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const cookie = request.headers.get("cookie") || "";
  const cookieToken = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  const token = bearerToken || cookieToken;
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
