(function () {
  const storageKey = "aytRideSettings";

  const icons = {
    sedan: `
      <svg class="vehicle-icon" viewBox="0 0 240 112" fill="none" aria-hidden="true">
        <ellipse cx="121" cy="88" rx="88" ry="7" fill="#d8e2ee"/>
        <path d="M27 70c0-9 6-17 15-20l22-7 17-21c5-6 12-9 20-9h52c9 0 17 4 22 11l18 22 24 6c8 2 14 10 14 18v10H27V70Z" fill="#0b101a"/>
        <path d="M83 44l12-15c2-3 6-5 10-5h19v20H83Z" fill="#f8fbff"/>
        <path d="M130 24h20c5 0 9 2 12 6l11 14h-43V24Z" fill="#f8fbff"/>
        <path d="M82 53h96" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".18"/>
        <path d="M45 64h36" stroke="#ff7a1a" stroke-width="6" stroke-linecap="round"/>
        <path d="M178 62h24" stroke="#0b66c3" stroke-width="5" stroke-linecap="round"/>
        <circle cx="67" cy="79" r="18" fill="#05070b" stroke="#ffffff" stroke-width="6"/>
        <circle cx="67" cy="79" r="7" fill="#0b66c3"/>
        <circle cx="178" cy="79" r="18" fill="#05070b" stroke="#ffffff" stroke-width="6"/>
        <circle cx="178" cy="79" r="7" fill="#0b66c3"/>
        <path d="M36 57h10M210 62h11" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
    van: `
      <svg class="vehicle-icon" viewBox="0 0 240 112" fill="none" aria-hidden="true">
        <ellipse cx="122" cy="89" rx="95" ry="7" fill="#d8e2ee"/>
        <path d="M25 80V38c0-12 9-21 21-21h124c15 0 27 9 32 23l9 24h5c8 0 14 6 14 14v2H25Z" fill="#0b101a"/>
        <path d="M47 28h39v28H47V28Z" fill="#f8fbff"/>
        <path d="M94 28h42v28H94V28Z" fill="#f8fbff"/>
        <path d="M144 28h21c9 0 17 6 20 14l5 14h-46V28Z" fill="#f8fbff"/>
        <path d="M89 27v30M139 27v30" stroke="#0b101a" stroke-width="6"/>
        <path d="M36 64h136" stroke="#ff7a1a" stroke-width="6" stroke-linecap="round"/>
        <path d="M174 64h34" stroke="#0b66c3" stroke-width="6" stroke-linecap="round"/>
        <circle cx="68" cy="81" r="18" fill="#05070b" stroke="#ffffff" stroke-width="6"/>
        <circle cx="68" cy="81" r="7" fill="#0b66c3"/>
        <circle cx="184" cy="81" r="18" fill="#05070b" stroke="#ffffff" stroke-width="6"/>
        <circle cx="184" cy="81" r="7" fill="#0b66c3"/>
        <path d="M36 41h7M214 58h10" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
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

  function bookingMessage(settings, quote) {
    const els = bookingEls();
    const lines = [
      "AYT Ride booking request",
      "",
      `Trip: ${state.tripType === "return" ? "Return" : "One way"}`,
      `Route: ${readablePlace(els.pickup.value, els.pickupDetail.value)} to ${readablePlace(els.dropoff.value, els.dropoffDetail.value)}`,
      `Pickup: ${els.pickupDate.value || "Date not selected"} at ${els.pickupTime.value || "Time not selected"}`,
      state.tripType === "return" ? `Return: ${els.returnDate.value || "Date not selected"} at ${els.returnTime.value || "Time not selected"}` : "",
      `Vehicle: ${quote.vehicle.name}`,
      `Passengers: ${state.passengers}`,
      `Suitcases: ${state.luggage}`,
      `Child seats: ${state.childSeats}`,
      text(els.flightNumber.value) ? `Flight: ${text(els.flightNumber.value)}` : "",
      text(els.guestName.value) ? `Name: ${text(els.guestName.value)}` : "",
      text(els.guestPhone.value) ? `Guest WhatsApp: ${text(els.guestPhone.value)}` : "",
      text(els.guestEmail.value) ? `Guest email: ${text(els.guestEmail.value)}` : "",
      text(els.notes.value) ? `Notes: ${text(els.notes.value)}` : "",
      `Estimated guest price: ${money(quote.total)}`,
      "Payment: cash after ride",
      "",
      "Please confirm vehicle availability, pickup point and final price."
    ];
    return lines.filter(Boolean).join("\n");
  }

  function ownerSummary(settings, quote) {
    const publicMessage = bookingMessage(settings, quote);
    return `${publicMessage}\n\nOperator view\nVehicle cost to pay: ${money(quote.cost)}\nEstimated margin: ${money(quote.margin)}\nOperator: ${settings.business.operator}`;
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

    els.customRouteFields.classList.toggle("hidden", els.pickup.value !== "Other hotel or address" && els.dropoff.value !== "Other hotel or address");
    els.returnFields.classList.toggle("hidden", state.tripType !== "return");
    els.quoteTotal.textContent = sameRoute ? "Choose route" : money(quote.total);
    els.quoteNote.textContent = sameRoute ? "Pickup and drop-off should be different" : `${quote.vehicle.name} for ${state.passengers} passenger${state.passengers === 1 ? "" : "s"}`;
    els.capacityStatus.textContent = sameRoute ? "Route needed" : "Vehicle fits";
    els.topWhatsapp.href = waUrl(settings, "Hello AYT Ride, I want to book a private transfer.");

    document.querySelector("#mailSummary").value = summary;
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
      showToast("WhatsApp opened. The email copy will open in a new tab.");
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
