const MAX_TEXT = 500;

export function cleanText(value, max = MAX_TEXT) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function normalizePhone(value) {
  return cleanText(value, 40).replace(/[^\d+]/g, "");
}

export function findRoute(catalog, routeId, pickup, dropoff) {
  const byId = catalog.routes.find((route) => route.id === routeId);
  if (byId) return byId;
  return catalog.routes.find((route) => {
    return (route.origin === pickup && route.destination === dropoff) ||
      (route.origin === dropoff && route.destination === pickup);
  }) || null;
}

export function findVehicle(catalog, vehicleId) {
  return catalog.vehicles.find((vehicle) => vehicle.id === vehicleId) || null;
}

export function isNightTransfer(time) {
  if (!/^\d{2}:\d{2}$/.test(String(time || ""))) return false;
  const hour = Number(time.slice(0, 2));
  return hour >= 23 || hour < 6;
}

export function calculatePublicQuote(catalog, payload) {
  const route = findRoute(catalog, payload.routeId, payload.pickup, payload.dropoff);
  const vehicle = findVehicle(catalog, payload.vehicleId);
  if (!route || !vehicle || route.quoteOnly || !route.prices?.[vehicle.id]) {
    return { route, vehicle, quoteOnly: true, total: null };
  }

  const base = Number(route.prices[vehicle.id]);
  const ways = payload.tripType === "return" ? 2 : 1;
  const discount = payload.tripType === "return" ? Number(catalog.fees.returnDiscount || 1) : 1;
  const childSeats = Number(payload.childSeats || 0);
  const seatFee = childSeats * Number(catalog.fees.childSeatFeeEur || 0);
  const nightFee = (isNightTransfer(payload.pickupTime) ? Number(catalog.fees.nightFeeEur || 0) : 0) +
    (payload.tripType === "return" && isNightTransfer(payload.returnTime) ? Number(catalog.fees.nightFeeEur || 0) : 0);

  return {
    route,
    vehicle,
    quoteOnly: false,
    total: Math.round((base * ways * discount) + seatFee + nightFee)
  };
}

export function privateVehiclePrice(privatePricing, payload) {
  if (!privatePricing || payload.quoteOnly) return null;
  const routePrice = privatePricing.routes?.[payload.routeId]?.[payload.vehicleId];
  const vehiclePrice = privatePricing.vehicles?.[payload.vehicleId]?.[payload.routeId];
  const base = routePrice ?? vehiclePrice;
  if (base == null || Number.isNaN(Number(base))) return null;
  const ways = payload.tripType === "return" ? 2 : 1;
  return Math.round(Number(base) * ways);
}

export function sanitizeBookingPayload(input) {
  return {
    reference: cleanText(input.reference, 80),
    language: cleanText(input.language || "en", 8),
    routeId: cleanText(input.routeId, 80),
    tripType: input.tripType === "return" ? "return" : "oneway",
    pickup: cleanText(input.pickup, 180),
    dropoff: cleanText(input.dropoff, 180),
    pickupDate: cleanText(input.pickupDate, 20),
    pickupTime: cleanText(input.pickupTime, 8),
    returnDate: cleanText(input.returnDate, 20),
    returnTime: cleanText(input.returnTime, 8),
    flightNumber: cleanText(input.flightNumber, 40),
    hotelAddress: cleanText(input.hotelAddress, 220),
    vehicleId: cleanText(input.vehicleId, 80),
    passengers: Number(input.passengers || 0),
    luggage: Number(input.luggage || 0),
    childSeats: Number(input.childSeats || 0),
    guestName: cleanText(input.guestName, 120),
    guestPhone: normalizePhone(input.guestPhone),
    guestEmail: cleanText(input.guestEmail, 180).toLowerCase(),
    notes: cleanText(input.notes, 600),
    attribution: input.attribution && typeof input.attribution === "object" ? input.attribution : {}
  };
}

export function validateBookingPayload(catalog, input, options = {}) {
  const today = options.today || new Date().toISOString().slice(0, 10);
  const payload = sanitizeBookingPayload(input);
  const errors = [];

  if (!payload.reference) errors.push("Booking reference is required.");
  if (!payload.pickup || !payload.dropoff || payload.pickup === payload.dropoff) errors.push("Pickup and drop-off are required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.pickupDate) || payload.pickupDate < today) errors.push("Pickup date must be today or later.");
  if (!/^\d{2}:\d{2}$/.test(payload.pickupTime)) errors.push("Pickup time is required.");
  if (payload.tripType === "return") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.returnDate) || payload.returnDate < payload.pickupDate) errors.push("Return date must be after pickup date.");
    if (!/^\d{2}:\d{2}$/.test(payload.returnTime)) errors.push("Return time is required.");
  }
  if (!payload.guestName) errors.push("Guest name is required.");
  if (!payload.guestPhone || payload.guestPhone.replace(/\D/g, "").length < 8) errors.push("Valid WhatsApp number is required.");
  if (payload.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.guestEmail)) errors.push("Email address is invalid.");
  if (!Number.isInteger(payload.passengers) || payload.passengers < 1 || payload.passengers > 6) errors.push("Passenger count is invalid.");
  if (!Number.isInteger(payload.luggage) || payload.luggage < 0 || payload.luggage > 6) errors.push("Suitcase count is invalid.");
  if (!Number.isInteger(payload.childSeats) || payload.childSeats < 0 || payload.childSeats > 3) errors.push("Child seat count is invalid.");

  const quote = calculatePublicQuote(catalog, payload);
  if (!quote.route) errors.push("Route is not available.");
  if (!quote.vehicle) errors.push("Vehicle is not available.");
  if (quote.vehicle && payload.passengers > quote.vehicle.passengers) errors.push("Selected vehicle does not fit passenger count.");
  if (quote.vehicle && payload.luggage > quote.vehicle.luggage) errors.push("Selected vehicle does not fit luggage count.");

  return {
    ok: errors.length === 0,
    errors,
    payload: {
      ...payload,
      routeId: quote.route?.id || payload.routeId || "custom",
      vehicleId: quote.vehicle?.id || payload.vehicleId,
      publicTotalEur: quote.total,
      quoteOnly: quote.quoteOnly
    },
    quote
  };
}
