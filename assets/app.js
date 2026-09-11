(function () {
  const storageKey = "aytRideSettings";

  const icons = {
    sedan: '<svg class="vehicle-icon" viewBox="0 0 220 100" fill="none" aria-hidden="true"><path d="M27 67h166c4 0 7-3 7-7v-5c0-5-4-9-9-9h-15l-13-22c-3-5-8-8-14-8H78c-7 0-13 3-17 9L48 46H35c-9 0-16 7-16 16v5h8Z" fill="#0b66c3" stroke="#064b93" stroke-width="3" stroke-linejoin="round"/><path d="M70 43l12-19c2-3 5-5 9-5h48c4 0 8 2 10 6l11 18H70Z" fill="#cfeaff" stroke="#064b93" stroke-width="3" stroke-linejoin="round"/><path d="M119 20v22M83 43h75" stroke="#064b93" stroke-width="3"/><path d="M43 51h27M162 51h19" stroke="#ff7a1a" stroke-width="4" stroke-linecap="round"/><path d="M46 68h128" stroke="#ffb36e" stroke-width="3" stroke-linecap="round"/><circle cx="62" cy="70" r="15" fill="#111827" stroke="#fff" stroke-width="4"/><circle cx="62" cy="70" r="6" fill="#94a3b8"/><circle cx="163" cy="70" r="15" fill="#111827" stroke="#fff" stroke-width="4"/><circle cx="163" cy="70" r="6" fill="#94a3b8"/><path d="M30 55h10M188 55h8" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>',
    van: '<svg class="vehicle-icon" viewBox="0 0 220 100" fill="none" aria-hidden="true"><path d="M22 68V27c0-6 5-11 11-11h107c11 0 20 6 25 16l13 25h13c5 0 9 4 9 9v2H22Z" fill="#064b93" stroke="#04396f" stroke-width="3" stroke-linejoin="round"/><path d="M40 24h45v33H40zM90 24h42v33H90zM137 25h7c6 0 11 3 14 9l10 23h-31V25Z" fill="#cfeaff" stroke="#0b66c3" stroke-width="3" stroke-linejoin="round"/><path d="M87 24v33M135 24v33" stroke="#0b66c3" stroke-width="3"/><path d="M27 61h157" stroke="#ff7a1a" stroke-width="5" stroke-linecap="round"/><path d="M28 68h156" stroke="#ffb36e" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="71" r="15" fill="#111827" stroke="#fff" stroke-width="4"/><circle cx="60" cy="71" r="6" fill="#94a3b8"/><circle cx="166" cy="71" r="15" fill="#111827" stroke="#fff" stroke-width="4"/><circle cx="166" cy="71" r="6" fill="#94a3b8"/><path d="M30 42h8M190 52h7" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>'
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
