(function () {
  const storageKey = "aytRideSettings";
  const reservationsKey = "aytRideReservations";
  const formsubmitApiKeyStorage = "aytRideFormsubmitApiKey";

  const defaults = {
    business: {
      whatsapp: "16838502742",
      email: "info@shramworld.com",
      brand: "AYT Ride",
      operator: "SHRAMWORLD"
    },
    fees: {
      night: 10,
      childSeat: 5,
      returnDiscount: 0.9
    },
    vehicles: [
      {
        id: "comfort",
        name: "Standard Sedan",
        image: "/assets/comfort-sedan-egea.jpg",
        imageAlt: "White mid-segment comfort sedan for Antalya airport transfer",
        passengers: 3,
        luggage: 3,
        multiplier: 1,
        costMultiplier: 1
      },
      {
        id: "vip",
        name: "VIP Van",
        image: "/assets/ayt-ride-transfer.jpg",
        imageAlt: "Black VIP van for private Antalya airport transfer",
        passengers: 6,
        luggage: 6,
        multiplier: 1.32,
        costMultiplier: 1.2
      }
    ],
    routes: [
      { id: "lara", from: "Antalya Airport (AYT)", to: "Lara / Kundu", km: 14, min: 20, price: 30, cost: 20 },
      { id: "oldtown", from: "Antalya Airport (AYT)", to: "Kaleici / Old Town", km: 16, min: 25, price: 32, cost: 22 },
      { id: "center", from: "Antalya Airport (AYT)", to: "Antalya City Center", km: 15, min: 24, price: 32, cost: 22 },
      { id: "konyaalti", from: "Antalya Airport (AYT)", to: "Konyaalti", km: 25, min: 35, price: 38, cost: 26 },
      { id: "belek", from: "Antalya Airport (AYT)", to: "Belek", km: 33, min: 35, price: 45, cost: 31 },
      { id: "kadriye", from: "Antalya Airport (AYT)", to: "Kadriye / Golf Resorts", km: 30, min: 32, price: 45, cost: 31 },
      { id: "kemer", from: "Antalya Airport (AYT)", to: "Kemer", km: 58, min: 65, price: 58, cost: 41 },
      { id: "side", from: "Antalya Airport (AYT)", to: "Side", km: 65, min: 60, price: 65, cost: 46 },
      { id: "manavgat", from: "Antalya Airport (AYT)", to: "Manavgat", km: 70, min: 65, price: 70, cost: 50 },
      { id: "alanya", from: "Antalya Airport (AYT)", to: "Alanya", km: 125, min: 120, price: 95, cost: 68 },
      { id: "kas", from: "Antalya Airport (AYT)", to: "Kas / Kalkan", km: 200, min: 190, price: 165, cost: 120 },
      { id: "other", from: "Antalya Airport (AYT)", to: "Other hotel or address", km: 35, min: 45, price: 48, cost: 34 }
    ]
  };

  const state = {
    tripType: "oneway",
    vehicle: "comfort",
    passengers: 2,
    luggage: 2,
    childSeats: 0
  };

  function mergeSettings(saved) {
    if (!saved || !Array.isArray(saved.routes) || !Array.isArray(saved.vehicles)) return structuredClone(defaults);
    const defaultVehicles = new Map(defaults.vehicles.map((vehicle) => [vehicle.id, vehicle]));
    const vehicles = saved.vehicles
      .filter((vehicle) => ["comfort", "vip"].includes(vehicle.id))
      .map((vehicle) => {
        const base = defaultVehicles.get(vehicle.id);
        return {
          ...base,
          passengers: Number(vehicle.passengers ?? base.passengers),
          luggage: Number(vehicle.luggage ?? base.luggage),
          multiplier: Number(vehicle.multiplier ?? base.multiplier),
          costMultiplier: Number(vehicle.costMultiplier ?? base.costMultiplier)
        };
      });
    return {
      ...structuredClone(defaults),
      ...saved,
      business: { ...defaults.business, ...(saved.business || {}) },
      fees: { ...defaults.fees, ...(saved.fees || {}) },
      vehicles: vehicles.length ? vehicles : structuredClone(defaults.vehicles)
    };
  }

  function readSettings() {
    try {
      return mergeSettings(JSON.parse(localStorage.getItem(storageKey) || "null"));
    } catch {
      return structuredClone(defaults);
    }
  }

  async function loadSettings() {
    try {
      const response = await fetch("/api/settings", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error("Settings API unavailable");
      const saved = await response.json();
      const settings = mergeSettings(saved);
      localStorage.setItem(storageKey, JSON.stringify(settings));
      return settings;
    } catch {
      return readSettings();
    }
  }

  async function saveSettings(settings, pin) {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-pin": pin || ""
      },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error(await response.text());
  }

  function money(value) {
    return `EUR ${Math.round(value)}`;
  }

  function roundToFive(value) {
    return Math.ceil(value / 5) * 5;
  }

  function isNight(time) {
    if (!time) return false;
    const hour = Number(String(time).split(":")[0]);
    return hour >= 23 || hour < 6;
  }

  function routeKey(from, to) {
    return `${from}|${to}`;
  }

  function getPlaces(settings) {
    return Array.from(new Set(settings.routes.flatMap((route) => [route.from, route.to]).concat(["Other hotel or address"])));
  }

  function getRoute(settings, from, to) {
    const direct = settings.routes.find((route) => routeKey(route.from, route.to) === routeKey(from, to));
    if (direct) return direct;
    const reverse = settings.routes.find((route) => routeKey(route.to, route.from) === routeKey(from, to));
    if (reverse) return reverse;
    return settings.routes.find((route) => route.id === "other") || { from, to, km: 35, min: 45, price: 48, cost: 34 };
  }

  function calculate(settings, input = {}) {
    const pickup = input.pickup || document.querySelector("#pickup")?.value || "Antalya Airport (AYT)";
    const dropoff = input.dropoff || document.querySelector("#dropoff")?.value || "Lara / Kundu";
    const tripType = input.tripType || state.tripType;
    const vehicle = settings.vehicles.find((item) => item.id === (input.vehicle || state.vehicle)) || settings.vehicles[1];
    const childSeats = Number(input.childSeats ?? state.childSeats);
    const pickupTime = input.pickupTime || document.querySelector("#pickupTime")?.value || "";
    const returnTime = input.returnTime || document.querySelector("#returnTime")?.value || "";

    if (pickup === dropoff) {
      return { total: 0, cost: 0, margin: 0, route: { km: 0, min: 0 }, vehicle, tripType, same: true };
    }

    const route = getRoute(settings, pickup, dropoff);
    const ways = tripType === "return" ? 2 : 1;
    const returnDiscount = tripType === "return" ? Number(settings.fees.returnDiscount || 1) : 1;
    const nightFee = (isNight(pickupTime) ? Number(settings.fees.night || 0) : 0) + (tripType === "return" && isNight(returnTime) ? Number(settings.fees.night || 0) : 0);
    const childSeatFee = childSeats * Number(settings.fees.childSeat || 0);
    const total = roundToFive((route.price * vehicle.multiplier * ways * returnDiscount) + nightFee + childSeatFee);
    const cost = roundToFive((route.cost * vehicle.costMultiplier * ways) + childSeatFee);
    return { total, cost, margin: total - cost, route, vehicle, tripType, same: false };
  }

  function text(value) {
    return String(value || "").trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatAdminDate(value) {
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch {
      return value || "";
    }
  }

  function readablePlace(place, detail) {
    return place === "Other hotel or address" && text(detail) ? text(detail) : place;
  }

  function formatDate(value) {
    if (!value) return "Date not selected";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(`${value}T00:00:00`));
    } catch {
      return value;
    }
  }

  function formatDateTime(date, time) {
    return `${formatDate(date)} at ${time || "Time not selected"}`;
  }

  function requestRoute(els) {
    return `${readablePlace(els.pickup.value, els.pickupDetail.value)} -> ${readablePlace(els.dropoff.value, els.dropoffDetail.value)}`;
  }

  function bookingReference(els) {
    const date = (els.pickupDate.value || "nodate").replace(/\D/g, "") || "nodate";
    const time = (els.pickupTime.value || "notime").replace(/\D/g, "") || "notime";
    const routeCode = `${els.pickup.value}-${els.dropoff.value}`.replace(/[^a-z0-9]+/gi, "").slice(0, 8).toUpperCase() || "TRANSFER";
    return `AYT-${date}-${time}-${routeCode}`;
  }

  function setField(id, value) {
    const field = document.querySelector(`#${id}`);
    if (field) field.value = value ?? "";
  }

  function bookingMessage(settings, quote) {
    const els = bookingEls();
    const tripLabel = state.tripType === "return" ? "Return transfer" : "One-way transfer";
    const returnLine = state.tripType === "return" ? `🔁 Return: ${formatDateTime(els.returnDate.value, els.returnTime.value)}` : "";
    const notes = text(els.notes.value) || "No extra notes";
    const reference = bookingReference(els);
    const lines = [
      "🚘 *AYT RIDE | NEW TRANSFER REQUEST*",
      `🧾 Reference: ${reference}`,
      "",
      "👤 *Guest details*",
      `Name: ${text(els.guestName.value) || "Not provided"}`,
      `📱 WhatsApp: ${text(els.guestPhone.value) || "Not provided"}`,
      `✉️ Email: ${text(els.guestEmail.value) || "Not provided"}`,
      "",
      "🛣️ *Trip details*",
      `↔️ Type: ${tripLabel}`,
      `📍 Pickup: ${readablePlace(els.pickup.value, els.pickupDetail.value)}`,
      `🏁 Drop-off: ${readablePlace(els.dropoff.value, els.dropoffDetail.value)}`,
      `🗓️ Pickup time: ${formatDateTime(els.pickupDate.value, els.pickupTime.value)}`,
      returnLine,
      `✈️ Flight: ${text(els.flightNumber.value) || "Not provided"}`,
      "",
      "🚗 *Vehicle & luggage*",
      `Requested vehicle: ${quote.vehicle.name}`,
      `👥 Passengers: ${state.passengers}`,
      `🧳 Suitcases: ${state.luggage}`,
      `👶 Child seats: ${state.childSeats}`,
      "",
      "💶 *Price & payment*",
      `Estimated guest total: *${money(quote.total)}*`,
      "🤝 Payment: Cash after ride",
      "🔒 Online payment: Not required",
      "",
      "📝 *Guest notes*",
      notes,
      "",
      "📌 *Please confirm*",
      "✅ Vehicle availability",
      "📍 Exact meeting point",
      "💶 Final price"
    ];
    return lines.filter(Boolean).join("\n");
  }

  function readReservations() {
    try {
      const saved = JSON.parse(localStorage.getItem(reservationsKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function bookingRecord(settings, quote) {
    const els = bookingEls();
    const reference = bookingReference(els);
    return {
      reference,
      createdAt: new Date().toISOString(),
      status: "WhatsApp ve e-posta denendi",
      guestName: text(els.guestName.value) || "Not provided",
      guestPhone: text(els.guestPhone.value) || "Not provided",
      guestEmail: text(els.guestEmail.value) || "Not provided",
      tripType: state.tripType === "return" ? "Return transfer" : "One-way transfer",
      route: requestRoute(els),
      pickupDateTime: formatDateTime(els.pickupDate.value, els.pickupTime.value),
      returnDateTime: state.tripType === "return" ? formatDateTime(els.returnDate.value, els.returnTime.value) : "",
      flightNumber: text(els.flightNumber.value) || "Not provided",
      vehicle: quote.vehicle.name,
      passengers: state.passengers,
      suitcases: state.luggage,
      childSeats: state.childSeats,
      total: quote.total,
      cost: quote.cost,
      margin: quote.margin,
      notes: text(els.notes.value) || "No extra notes",
      operator: settings.business.operator
    };
  }

  function saveReservation(record) {
    const saved = readReservations().filter((item) => item.reference !== record.reference);
    saved.unshift(record);
    return writeReservations(saved);
  }

  function writeReservations(records) {
    localStorage.setItem(reservationsKey, JSON.stringify(records.slice(0, 150)));
    window.dispatchEvent(new CustomEvent("ayt-reservations-updated"));
    return records;
  }

  function mergeReservations(records) {
    const combined = [...records, ...readReservations()];
    const seen = new Set();
    const unique = combined.filter((record) => {
      const key = record.reference || `${record.guestPhone}-${record.createdAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return writeReservations(unique);
  }

  function formSubmitRecord(entry) {
    const data = entry.form_data || entry.formData || entry.data || {};
    if (!Object.keys(data).length) return null;
    const submitted = entry.submitted_at?.date || entry.submitted_at || entry.created_at || new Date().toISOString();
    const createdAt = new Date(String(submitted).replace(" ", "T"));
    return {
      reference: text(data.booking_reference) || `MAIL-${Date.now()}`,
      createdAt: Number.isNaN(createdAt.getTime()) ? new Date().toISOString() : createdAt.toISOString(),
      status: "Mail arşivinden alındı",
      guestName: text(data.name) || "Not provided",
      guestPhone: text(data.phone) || "Not provided",
      guestEmail: text(data.email) || "Not provided",
      tripType: text(data.trip_type) || "Transfer",
      route: text(data.route) || "Route not provided",
      pickupDateTime: text(data.pickup_datetime) || "Date not provided",
      returnDateTime: text(data.return_datetime),
      flightNumber: text(data.flight_number) || "Not provided",
      vehicle: text(data.selected_vehicle) || "Vehicle not provided",
      passengers: numberValue(data.passenger_count),
      suitcases: numberValue(data.suitcase_count),
      childSeats: numberValue(data.child_seat_count),
      total: numberValue(data.estimated_total_eur),
      cost: numberValue(data.operator_vehicle_cost_eur),
      margin: numberValue(data.estimated_margin_eur),
      notes: text(data.notes) || "No extra notes",
      operator: "SHRAMWORLD"
    };
  }

  function ownerSummary(settings, quote) {
    const publicMessage = bookingMessage(settings, quote);
    const els = bookingEls();
    return [
      publicMessage,
      "",
      "OPERATOR VIEW",
      `Booking reference: ${bookingReference(els)}`,
      `Vehicle cost to pay: ${money(quote.cost)}`,
      `Estimated margin: ${money(quote.margin)}`,
      `Route distance: ${quote.route.km} km`,
      `Estimated duration: ${quote.route.min} min`,
      `Operator: ${settings.business.operator}`
    ].join("\n");
  }

  function customerConfirmation(settings, quote) {
    const els = bookingEls();
    const name = text(els.guestName.value);
    const reference = bookingReference(els);
    return [
      `Hello${name ? ` ${name}` : ""},`,
      "",
      "Thank you for your AYT Ride transfer request. We received your details and will confirm availability, exact pickup point and final price by WhatsApp.",
      "",
      `Reference: ${reference}`,
      `Route: ${requestRoute(els)}`,
      `Pickup: ${formatDateTime(els.pickupDate.value, els.pickupTime.value)}`,
      `Vehicle: ${quote.vehicle.name}`,
      `Estimated total: ${money(quote.total)}`,
      "Payment: Cash after the ride",
      "",
      "Your booking is not final until our operator confirms it by WhatsApp.",
      `${settings.business.brand} / ${settings.business.operator}`
    ].join("\n");
  }

  function waUrl(settings, message) {
    const number = String(settings.business.whatsapp || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function bookingEls() {
    return {
      pickup: document.querySelector("#pickup"),
      dropoff: document.querySelector("#dropoff"),
      pickupDetail: document.querySelector("#pickupDetail"),
      dropoffDetail: document.querySelector("#dropoffDetail"),
      customRouteFields: document.querySelector("#customRouteFields"),
      pickupDate: document.querySelector("#pickupDate"),
      pickupTime: document.querySelector("#pickupTime"),
      returnDate: document.querySelector("#returnDate"),
      returnTime: document.querySelector("#returnTime"),
      returnFields: document.querySelector("#returnFields"),
      flightNumber: document.querySelector("#flightNumber"),
      guestName: document.querySelector("#guestName"),
      guestPhone: document.querySelector("#guestPhone"),
      guestEmail: document.querySelector("#guestEmail"),
      notes: document.querySelector("#notes"),
      vehicleGrid: document.querySelector("#vehicleGrid"),
      routeGrid: document.querySelector("#routeGrid"),
      quoteTotal: document.querySelector("#quoteTotal"),
      quoteNote: document.querySelector("#quoteNote"),
      capacityStatus: document.querySelector("#capacityStatus"),
      topWhatsapp: document.querySelector("#topWhatsapp")
    };
  }

  function fillSelect(select, places, selected) {
    select.innerHTML = places.map((place) => `<option value="${place.replace(/"/g, "&quot;")}"${place === selected ? " selected" : ""}>${place}</option>`).join("");
  }

  function setCounter(settings, key, value) {
    const limits = { passengers: [1, 6], luggage: [0, 6], childSeats: [0, 3] };
    const [min, max] = limits[key];
    state[key] = Math.max(min, Math.min(max, value));
    const valueEl = document.querySelector(`#${key}Value`);
    if (valueEl) valueEl.textContent = state[key];
    document.querySelectorAll(`[data-counter="${key}"]`).forEach((button) => {
      const next = state[key] + Number(button.dataset.delta);
      button.disabled = next < min || next > max;
    });
    updateBooking(settings);
  }

  function renderVehicles(settings) {
    const els = bookingEls();
    if (!els.vehicleGrid) return;
    const available = settings.vehicles.filter((vehicle) => vehicle.passengers >= state.passengers && vehicle.luggage >= state.luggage);
    if (!available.some((vehicle) => vehicle.id === state.vehicle)) {
      state.vehicle = available[0]?.id || settings.vehicles[0].id;
    }

    els.vehicleGrid.innerHTML = settings.vehicles.map((vehicle) => {
      const quote = calculate(settings, { vehicle: vehicle.id });
      const disabled = vehicle.passengers < state.passengers || vehicle.luggage < state.luggage;
      const image = vehicle.image || defaults.vehicles.find((item) => item.id === vehicle.id)?.image || "/assets/ayt-ride-transfer.jpg";
      const imageAlt = vehicle.imageAlt || `${vehicle.name} private transfer vehicle`;
      return `
        <button type="button" class="vehicle-card ${vehicle.id === state.vehicle ? "active" : ""}" data-vehicle="${vehicle.id}" aria-pressed="${vehicle.id === state.vehicle}" ${disabled ? "disabled" : ""}>
          <span class="vehicle-media">
            <img src="${image}" alt="${imageAlt}" loading="lazy">
          </span>
          <span class="vehicle-card-body">
            <strong>${vehicle.name}</strong>
            <small>${vehicle.passengers} passengers, ${vehicle.luggage} suitcases</small>
            <small>${disabled ? "Choose a larger vehicle" : "Private door-to-door ride"}</small>
            <span class="vehicle-price">${money(quote.total)}</span>
          </span>
        </button>
      `;
    }).join("");
  }

  function updateBooking(settings) {
    const els = bookingEls();
    if (!els.pickup) return;
    renderVehicles(settings);

    const quote = calculate(settings);
    const message = bookingMessage(settings, quote);
    const summary = ownerSummary(settings, quote);
    const sameRoute = quote.same;
    const routeText = requestRoute(els);
    const tripLabel = state.tripType === "return" ? "Return transfer" : "One-way transfer";
    const reference = bookingReference(els);

    els.customRouteFields.classList.toggle("hidden", els.pickup.value !== "Other hotel or address" && els.dropoff.value !== "Other hotel or address");
    els.returnFields.classList.toggle("hidden", state.tripType !== "return");
    els.quoteTotal.textContent = sameRoute ? "Choose route" : money(quote.total);
    els.quoteNote.textContent = sameRoute ? "Pickup and drop-off should be different" : `${quote.vehicle.name} for ${state.passengers} passenger${state.passengers === 1 ? "" : "s"}`;
    els.capacityStatus.textContent = sameRoute ? "Route needed" : "Vehicle fits";
    els.topWhatsapp.href = waUrl(settings, "Hello AYT Ride, I would like to book a private transfer in Antalya.");

    setField("formSubject", `AYT Ride ${reference} - ${routeText} - ${money(quote.total)}`);
    setField("formReplyTo", text(els.guestEmail.value));
    setField("formAutoresponse", customerConfirmation(settings, quote));
    setField("mailReference", reference);
    setField("mailTripType", tripLabel);
    setField("mailRoute", routeText);
    setField("mailPickupDateTime", formatDateTime(els.pickupDate.value, els.pickupTime.value));
    setField("mailReturnDateTime", state.tripType === "return" ? formatDateTime(els.returnDate.value, els.returnTime.value) : "");
    setField("mailVehicle", quote.vehicle.name);
    setField("mailPassengers", String(state.passengers));
    setField("mailSuitcases", String(state.luggage));
    setField("mailChildSeats", String(state.childSeats));
    setField("mailKm", String(quote.route.km || ""));
    setField("mailMin", String(quote.route.min || ""));
    document.querySelector("#mailSummary").value = summary;
    document.querySelector("#mailMessage").value = summary;
    document.querySelector("#mailWhatsapp").value = message;
    document.querySelector("#mailTotal").value = String(quote.total);
    document.querySelector("#mailCost").value = String(quote.cost);
    document.querySelector("#mailMargin").value = String(quote.margin);
    document.querySelector("#formNext").value = `${location.origin}${location.pathname}?request=sent`;
  }

  async function initBooking() {
    const settings = await loadSettings();
    const els = bookingEls();
    if (!els.pickup) return;

    const places = getPlaces(settings);
    fillSelect(els.pickup, places, "Antalya Airport (AYT)");
    fillSelect(els.dropoff, places, "Lara / Kundu");

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    els.pickupDate.min = localDate;
    els.returnDate.min = localDate;
    els.pickupDate.value = localDate;
    els.pickupTime.value = "11:30";

    document.querySelectorAll("[data-trip]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tripType = button.dataset.trip;
        document.querySelectorAll("[data-trip]").forEach((item) => {
          item.classList.toggle("active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
        updateBooking(settings);
      });
    });

    document.querySelectorAll("[data-counter]").forEach((button) => {
      button.addEventListener("click", () => setCounter(settings, button.dataset.counter, state[button.dataset.counter] + Number(button.dataset.delta)));
    });

    document.querySelector("#swapRoute").addEventListener("click", () => {
      const pickup = els.pickup.value;
      els.pickup.value = els.dropoff.value;
      els.dropoff.value = pickup;
      updateBooking(settings);
    });

    const bookingForm = document.querySelector("#bookingForm");
    const mailSink = document.querySelector("iframe[name='mailSink']");
    let mailSubmitStarted = false;

    if (mailSink) {
      mailSink.addEventListener("load", () => {
        if (!mailSubmitStarted) return;
        mailSubmitStarted = false;
        showToast("Email request submitted to AYT Ride.");
      });
    }

    bookingForm.addEventListener("input", () => updateBooking(settings));
    bookingForm.addEventListener("change", () => updateBooking(settings));
    bookingForm.addEventListener("submit", (event) => {
      updateBooking(settings);
      const quote = calculate(settings);
      if (quote.same) {
        event.preventDefault();
        showToast("Please choose a different pickup and drop-off.");
        return;
      }
      const message = bookingMessage(settings, quote);
      saveReservation(bookingRecord(settings, quote));
      mailSubmitStarted = true;
      window.open(waUrl(settings, message), "_blank", "noopener");
      showToast("WhatsApp opened. Email copy is being submitted.");
    });

    els.vehicleGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-vehicle]");
      if (!card || card.disabled) return;
      state.vehicle = card.dataset.vehicle;
      updateBooking(settings);
    });

    document.querySelector("#copyRequest").addEventListener("click", async () => {
      const quote = calculate(settings);
      try {
        await navigator.clipboard.writeText(ownerSummary(settings, quote));
        showToast("Booking details copied.");
      } catch {
        showToast("Copy failed. Use the WhatsApp message instead.");
      }
    });

    els.routeGrid.innerHTML = settings.routes.filter((route) => route.from === "Antalya Airport (AYT)").map((route) => {
      const sedanQuote = calculate(settings, { pickup: route.from, dropoff: route.to, vehicle: "comfort" });
      const vipQuote = calculate(settings, { pickup: route.from, dropoff: route.to, vehicle: "vip" });
      const destination = route.to.replace(" / ", " + ");
      return `
        <button class="route-card" type="button" data-from="${route.from}" data-to="${route.to}" aria-label="Select ${destination} transfer from ${money(sedanQuote.total)}">
          <span class="route-card-top">
            <span class="route-code">AYT</span>
            <span class="route-price">From ${money(sedanQuote.total)}</span>
          </span>
          <strong>${destination}</strong>
          <span class="route-fares">
            <span><small>Standard Sedan</small><b>${money(sedanQuote.total)}</b></span>
            <span><small>VIP Van</small><b>${money(vipQuote.total)}</b></span>
          </span>
          <span class="route-stats">
            <small>${route.km} km</small>
            <small>${route.min} min</small>
            <small>Private ride</small>
          </span>
          <span class="route-card-action">Select route &rarr;</span>
        </button>
      `;
    }).join("");

    els.routeGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-from]");
      if (!card) return;
      els.pickup.value = card.dataset.from;
      els.dropoff.value = card.dataset.to;
      updateBooking(settings);
      document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    ["passengers", "luggage", "childSeats"].forEach((key) => setCounter(settings, key, state[key]));
    updateBooking(settings);
  }

  async function initAdmin() {
    const adminRoot = document.querySelector("#adminApp");
    if (!adminRoot) return;
    let settings = await loadSettings();
    const pin = document.querySelector("#adminPin");
    const login = document.querySelector("#adminLogin");
    const panel = document.querySelector("#adminPanel");
    const table = document.querySelector("#adminTable");
    const output = document.querySelector("#adminOutput");
    const bookings = document.querySelector("#adminBookings");
    const bookingCount = document.querySelector("#bookingCount");
    const formsubmitApiKey = document.querySelector("#formsubmitApiKey");
    const fetchFormsubmitBookings = document.querySelector("#fetchFormsubmitBookings");
    const requestFormsubmitKey = document.querySelector("#requestFormsubmitKey");
    if (formsubmitApiKey) {
      formsubmitApiKey.value = localStorage.getItem(formsubmitApiKeyStorage) || "";
    }

    function reservationText(record) {
      return [
        `Referans: ${record.reference}`,
        `Tarih: ${formatAdminDate(record.createdAt)}`,
        `Misafir: ${record.guestName}`,
        `WhatsApp: ${record.guestPhone}`,
        `E-posta: ${record.guestEmail}`,
        `Rota: ${record.route}`,
        `Alış: ${record.pickupDateTime}`,
        record.returnDateTime ? `Dönüş: ${record.returnDateTime}` : "",
        `Uçuş: ${record.flightNumber}`,
        `Araç: ${record.vehicle}`,
        `Yolcu: ${record.passengers}`,
        `Valiz: ${record.suitcases}`,
        `Çocuk koltuğu: ${record.childSeats}`,
        `Müşteri fiyatı: ${money(record.total)}`,
        `Araç maliyeti: ${money(record.cost)}`,
        `Tahmini kâr: ${money(record.margin)}`,
        `Not: ${record.notes}`
      ].filter(Boolean).join("\n");
    }

    function renderReservations() {
      const records = readReservations();
      bookingCount.textContent = `${records.length} kayıt`;
      if (!records.length) {
        bookings.innerHTML = `
          <div class="booking-empty">
            <strong>Henüz rezervasyon kaydı yok.</strong>
            <p>Bu tarayıcıdan gönderilen talepler burada listelenecek.</p>
          </div>
        `;
        return;
      }
      bookings.innerHTML = records.map((record) => `
        <article class="booking-item">
          <div class="booking-item-head">
            <div>
              <strong>${escapeHtml(record.guestName)}</strong>
              <small>${escapeHtml(record.reference)} • ${escapeHtml(formatAdminDate(record.createdAt))}</small>
            </div>
            <span>${escapeHtml(money(record.total))}</span>
          </div>
          <div class="booking-item-grid">
            <p><b>Rota</b>${escapeHtml(record.route)}</p>
            <p><b>Alış</b>${escapeHtml(record.pickupDateTime)}</p>
            <p><b>Araç</b>${escapeHtml(record.vehicle)}</p>
            <p><b>Telefon</b>${escapeHtml(record.guestPhone)}</p>
            <p><b>Maliyet</b>${escapeHtml(money(record.cost))}</p>
            <p><b>Tahmini kâr</b>${escapeHtml(money(record.margin))}</p>
          </div>
          <p class="booking-note"><b>Not:</b> ${escapeHtml(record.notes)}</p>
          <p class="booking-note"><b>Durum:</b> ${escapeHtml(record.status || "Kayıt oluşturuldu")}</p>
        </article>
      `).join("");
    }

    function render() {
      renderReservations();
      table.innerHTML = `
        <div class="admin-row header">
          <span>Rota</span><span>Satış EUR</span><span>Maliyet EUR</span><span>KM</span><span>Dk</span>
        </div>
        ${settings.routes.map((route, index) => `
          <div class="admin-row">
            <input data-route="${index}" data-field="to" value="${route.to}">
            <input data-route="${index}" data-field="price" type="number" min="0" value="${route.price}">
            <input data-route="${index}" data-field="cost" type="number" min="0" value="${route.cost}">
            <input data-route="${index}" data-field="km" type="number" min="0" value="${route.km}">
            <input data-route="${index}" data-field="min" type="number" min="0" value="${route.min}">
          </div>
        `).join("")}
      `;
      document.querySelector("#businessWhatsapp").value = settings.business.whatsapp;
      document.querySelector("#businessEmail").value = settings.business.email;
      document.querySelector("#nightFee").value = settings.fees.night;
      document.querySelector("#childSeatFee").value = settings.fees.childSeat;
    }

    login.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!pin.value.trim()) {
        showToast("Admin PIN gir.");
        return;
      }
      login.classList.add("hidden");
      panel.classList.remove("hidden");
      render();
    });

    panel.addEventListener("input", (event) => {
      const target = event.target;
      if (target.dataset.route) {
        const route = settings.routes[Number(target.dataset.route)];
        const field = target.dataset.field;
        route[field] = ["price", "cost", "km", "min"].includes(field) ? Number(target.value) : target.value;
      }
      settings.business.whatsapp = document.querySelector("#businessWhatsapp").value.replace(/\D/g, "");
      settings.business.email = document.querySelector("#businessEmail").value.trim();
      settings.fees.night = Number(document.querySelector("#nightFee").value);
      settings.fees.childSeat = Number(document.querySelector("#childSeatFee").value);
    });

    document.querySelector("#saveAdmin").addEventListener("click", async () => {
      try {
        await saveSettings(settings, pin.value.trim());
        output.textContent = JSON.stringify(settings, null, 2);
        showToast("Ayarlar kaydedildi.");
      } catch (error) {
        output.textContent = error instanceof Error ? error.message : String(error);
        showToast("Ayarlar kaydedilemedi.");
      }
    });

    document.querySelector("#exportAdmin").addEventListener("click", async () => {
      const data = JSON.stringify(settings, null, 2);
      output.textContent = data;
      try {
        await navigator.clipboard.writeText(data);
        showToast("Ayarlar kopyalandı.");
      } catch {
        showToast("Ayarlar aşağıda gösterildi.");
      }
    });

    document.querySelector("#exportBookings").addEventListener("click", async () => {
      const records = readReservations();
      const data = records.map(reservationText).join("\n\n---\n\n") || "Henüz rezervasyon kaydı yok.";
      output.textContent = data;
      try {
        await navigator.clipboard.writeText(data);
        showToast("Rezervasyonlar kopyalandı.");
      } catch {
        showToast("Rezervasyonlar aşağıda gösterildi.");
      }
    });

    requestFormsubmitKey.addEventListener("click", () => {
      const email = settings.business.email || defaults.business.email;
      window.open(`https://formsubmit.co/api/get-apikey/${encodeURIComponent(email)}`, "_blank", "noopener");
      showToast("FormSubmit API anahtarı e-postana gönderilecek.");
    });

    fetchFormsubmitBookings.addEventListener("click", async () => {
      const key = formsubmitApiKey.value.trim();
      if (!key) {
        showToast("Önce FormSubmit API anahtarını gir.");
        return;
      }
      localStorage.setItem(formsubmitApiKeyStorage, key);
      output.textContent = "Mail arşivi çekiliyor...";
      try {
        const response = await fetch(`https://formsubmit.co/api/get-submissions/${encodeURIComponent(key)}`, {
          headers: { accept: "application/json" }
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const records = (data.submissions || []).map(formSubmitRecord).filter(Boolean);
        mergeReservations(records);
        output.textContent = `${records.length} mail kaydı içe aktarıldı.`;
        showToast(`${records.length} mail kaydı içe aktarıldı.`);
      } catch (error) {
        output.textContent = error instanceof Error ? error.message : String(error);
        showToast("Mail arşivi çekilemedi.");
      }
    });

    document.querySelector("#clearBookings").addEventListener("click", () => {
      localStorage.removeItem(reservationsKey);
      renderReservations();
      output.textContent = "Rezervasyon listesi temizlendi.";
      showToast("Rezervasyon listesi temizlendi.");
    });

    document.querySelector("#resetAdmin").addEventListener("click", async () => {
      settings = structuredClone(defaults);
      try {
        await saveSettings(settings, pin.value.trim());
        render();
        output.textContent = "Varsayılan fiyatlar geri yüklendi.";
      } catch (error) {
        render();
        output.textContent = error instanceof Error ? error.message : String(error);
        showToast("Varsayılan ayarlar kaydedilemedi.");
      }
    });

    window.addEventListener("ayt-reservations-updated", renderReservations);
  }

  window.AYTRide = { defaults, readSettings, loadSettings, saveSettings, calculate, readReservations };
  initBooking();
  initAdmin();
}());
