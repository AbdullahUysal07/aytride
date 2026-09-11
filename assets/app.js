(function () {
  const storageKey = "aytRideSettings";

  const icons = {
    sedan: `
      <svg class="vehicle-icon" viewBox="0 0 240 112" fill="none" aria-hidden="true">
        <path d="M21 77c0-9 6-17 15-20l27-8 19-23c6-8 15-12 25-12h48c11 0 21 5 27 14l16 23 22 7c8 3 13 10 13 19v5H21v-5Z" fill="#050505"/>
        <path d="M79 48l15-18c3-4 8-6 13-6h16v24H79Z" fill="#fff"/>
        <path d="M132 24h19c6 0 11 3 15 8l11 16h-45V24Z" fill="#fff"/>
        <rect x="87" y="57" width="14" height="4" rx="2" fill="#fff"/>
        <circle cx="67" cy="82" r="20" fill="#050505"/>
        <circle cx="67" cy="82" r="14" fill="#fff"/>
        <circle cx="67" cy="82" r="8" fill="#050505"/>
        <circle cx="182" cy="82" r="20" fill="#050505"/>
        <circle cx="182" cy="82" r="14" fill="#fff"/>
        <circle cx="182" cy="82" r="8" fill="#050505"/>
      </svg>
    `,
    van: `
      <svg class="vehicle-icon" viewBox="0 0 240 112" fill="none" aria-hidden="true">
        <path d="M24 80V58c0-7 5-13 11-15l17-5 19-18c5-5 12-8 20-8h106c13 0 22 9 22 22v46H24Z" fill="#050505"/>
        <path d="M68 31c-5 0-10 2-14 6L42 49h37V31H68Z" fill="#fff"/>
        <rect x="88" y="28" width="100" height="27" rx="5" fill="#fff"/>
        <rect x="83" y="25" width="7" height="36" fill="#050505"/>
        <rect x="190" y="28" width="7" height="30" fill="#050505"/>
        <rect x="86" y="62" width="14" height="4" rx="2" fill="#fff"/>
        <circle cx="66" cy="82" r="20" fill="#050505"/>
        <circle cx="66" cy="82" r="14" fill="#fff"/>
        <circle cx="66" cy="82" r="8" fill="#050505"/>
        <circle cx="183" cy="82" r="20" fill="#050505"/>
        <circle cx="183" cy="82" r="14" fill="#fff"/>
        <circle cx="183" cy="82" r="8" fill="#050505"/>
      </svg>
    `
  };

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
      { id: "comfort", name: "Comfort Sedan", icon: "sedan", passengers: 3, luggage: 3, multiplier: 1, costMultiplier: 1 },
      { id: "vip", name: "VIP Van", icon: "van", passengers: 6, luggage: 6, multiplier: 1.32, costMultiplier: 1.2 }
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
    vehicle: "vip",
    passengers: 2,
    luggage: 2,
    childSeats: 0
  };

  function mergeSettings(saved) {
    if (!saved || !Array.isArray(saved.routes) || !Array.isArray(saved.vehicles)) return structuredClone(defaults);
    const vehicles = saved.vehicles.filter((vehicle) => ["comfort", "vip"].includes(vehicle.id));
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
    const returnLine = state.tripType === "return" ? `Return: ${formatDateTime(els.returnDate.value, els.returnTime.value)}` : "";
    const notes = text(els.notes.value) || "No extra notes";
    const reference = bookingReference(els);
    const lines = [
      "*AYT RIDE TRANSFER REQUEST*",
      `Reference: ${reference}`,
      "",
      "*Guest*",
      `Name: ${text(els.guestName.value) || "Not provided"}`,
      `WhatsApp: ${text(els.guestPhone.value) || "Not provided"}`,
      `Email: ${text(els.guestEmail.value) || "Not provided"}`,
      "",
      "*Journey*",
      `Type: ${tripLabel}`,
      `From: ${readablePlace(els.pickup.value, els.pickupDetail.value)}`,
      `To: ${readablePlace(els.dropoff.value, els.dropoffDetail.value)}`,
      `Pickup: ${formatDateTime(els.pickupDate.value, els.pickupTime.value)}`,
      returnLine,
      `Flight: ${text(els.flightNumber.value) || "Not provided"}`,
      "",
      "*Vehicle*",
      `Requested vehicle: ${quote.vehicle.name}`,
      `Passengers: ${state.passengers}`,
      `Suitcases: ${state.luggage}`,
      `Child seats: ${state.childSeats}`,
      "",
      "*Price & payment*",
      `Guest total: *${money(quote.total)}*`,
      "Payment: Cash after ride",
      "Online payment: Not required",
      "",
      "*Notes*",
      notes,
      "",
      "*Please confirm*",
      "1. Vehicle availability",
      "2. Exact meeting point",
      "3. Final price"
    ];
    return lines.filter(Boolean).join("\n");
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
      return `
        <button type="button" class="vehicle-card ${vehicle.id === state.vehicle ? "active" : ""}" data-vehicle="${vehicle.id}" aria-pressed="${vehicle.id === state.vehicle}" ${disabled ? "disabled" : ""}>
          ${icons[vehicle.icon] || icons.van}
          <strong>${vehicle.name}</strong>
          <small>${vehicle.passengers} passengers, ${vehicle.luggage} suitcases</small>
          <small>${disabled ? "Choose a larger vehicle" : "Private door-to-door ride"}</small>
          <span class="vehicle-price">${money(quote.total)}</span>
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

    document.querySelector("#bookingForm").addEventListener("input", () => updateBooking(settings));
    document.querySelector("#bookingForm").addEventListener("change", () => updateBooking(settings));
    document.querySelector("#bookingForm").addEventListener("submit", (event) => {
      const quote = calculate(settings);
      if (quote.same) {
        event.preventDefault();
        showToast("Please choose a different pickup and drop-off.");
        return;
      }
      const message = bookingMessage(settings, quote);
      updateBooking(settings);
      window.open(waUrl(settings, message), "_blank", "noopener");
      showToast("WhatsApp opened. Email request is being submitted.");
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
      const quote = calculate(settings, { pickup: route.from, dropoff: route.to, vehicle: "vip" });
      return `
        <button class="route-card" type="button" data-from="${route.from}" data-to="${route.to}">
          <strong>${route.to.replace(" / ", " + ")}</strong>
          <small>${route.km} km / ${route.min} min from AYT</small>
          <b>From ${money(quote.total)}</b>
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

    function render() {
      table.innerHTML = `
        <div class="admin-row header">
          <span>Route</span><span>Sell EUR</span><span>Cost EUR</span><span>KM</span><span>Min</span>
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
        showToast("Enter admin PIN.");
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
        showToast("Settings saved for all visitors.");
      } catch (error) {
        output.textContent = error instanceof Error ? error.message : String(error);
        showToast("Settings could not be saved.");
      }
    });

    document.querySelector("#exportAdmin").addEventListener("click", async () => {
      const data = JSON.stringify(settings, null, 2);
      output.textContent = data;
      try {
        await navigator.clipboard.writeText(data);
        showToast("Settings copied.");
      } catch {
        showToast("Settings shown below.");
      }
    });

    document.querySelector("#resetAdmin").addEventListener("click", async () => {
      settings = structuredClone(defaults);
      try {
        await saveSettings(settings, pin.value.trim());
        render();
        output.textContent = "Default prices restored for all visitors.";
      } catch (error) {
        render();
        output.textContent = error instanceof Error ? error.message : String(error);
        showToast("Default settings could not be saved.");
      }
    });
  }

  window.AYTRide = { defaults, readSettings, loadSettings, saveSettings, calculate };
  initBooking();
  initAdmin();
}());
