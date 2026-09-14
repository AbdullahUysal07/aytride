(function () {
  const catalog = window.AYTRideCatalog;
  if (!catalog) return;

  const attributionKey = "aytRideAttribution";
  const confirmationKey = "aytRideLastConfirmation";
  const consentKey = "aytRideConsent";

  const state = {
    tripType: "oneway",
    vehicleId: catalog.vehicles[0]?.id || "",
    passengers: 2,
    luggage: 2,
    childSeats: 0,
    quoted: false,
    submitting: false,
    quoteStarted: false
  };

  async function loadLiveCatalog() {
    if (!catalog.apiBase) return;
    try {
      const response = await fetch(`${catalog.apiBase}/api/public/catalog`, {
        headers: { accept: "application/json" }
      });
      if (!response.ok) return;
      const live = await response.json();
      if (Array.isArray(live.routes) && Array.isArray(live.vehicles)) {
        Object.assign(catalog, live);
        if (!catalog.vehicles.some((item) => item.id === state.vehicleId)) {
          state.vehicleId = catalog.vehicles[0]?.id || "";
        }
      }
    } catch {
      // Static catalog is still usable if the live Worker is unavailable.
    }
  }

  const copy = {
    en: {
      routeNeeded: "Choose a pickup and destination.",
      sameRoute: "Pickup and destination must be different.",
      fixed: "Fixed total price per vehicle",
      quoteOnly: "Request exact quote",
      vehicleFits: "Vehicle fits",
      largerVehicle: "Choose a larger vehicle",
      whatsappOpened: "WhatsApp opened. The request was also saved.",
      whatsappOnly: "WhatsApp opened. Booking record and email need the production API connection.",
      serverMissing: "Booking record was not saved because the production booking API is not connected yet. Send the WhatsApp request to book now.",
      required: "Please complete the required fields.",
      copied: "Booking details copied.",
      copyFailed: "Copy failed.",
      returnAdded: "Return trip added.",
      analyticsConsent: "Allow analytics cookies to improve ads and booking performance?",
      accept: "Accept",
      essential: "Essential only",
      whatsappRequired: "WhatsApp confirmation required",
      customConfirmed: "Custom routes are confirmed by WhatsApp before booking.",
      selectRoute: "Select route",
      routeGuide: "Route guide"
    },
    de: {
      routeNeeded: "Abholort und Ziel wählen.",
      sameRoute: "Abholort und Ziel müssen unterschiedlich sein.",
      fixed: "Fester Gesamtpreis pro Fahrzeug",
      quoteOnly: "Genauen Preis anfragen",
      vehicleFits: "Fahrzeug passt",
      largerVehicle: "Größeres Fahrzeug wählen",
      whatsappOpened: "WhatsApp wurde geöffnet. Die Anfrage wurde gespeichert.",
      whatsappOnly: "WhatsApp wurde geöffnet. Speicherung braucht die Produktions-API.",
      serverMissing: "Der Buchungsserver ist noch nicht aktiv. Senden Sie die WhatsApp-Anfrage.",
      required: "Bitte Pflichtfelder ausfüllen.",
      copied: "Buchungsdetails kopiert.",
      copyFailed: "Kopieren fehlgeschlagen.",
      returnAdded: "Rückfahrt hinzugefügt.",
      analyticsConsent: "Analyse-Cookies erlauben, um Anzeigen und Buchungen zu verbessern?",
      accept: "Akzeptieren",
      essential: "Nur notwendige",
      whatsappRequired: "WhatsApp-Bestätigung erforderlich",
      customConfirmed: "Individuelle Routen werden vor der Buchung per WhatsApp bestätigt.",
      selectRoute: "Route wählen",
      routeGuide: "Routeninfos"
    },
    pl: {
      routeNeeded: "Wybierz miejsce odbioru i cel.",
      sameRoute: "Odbiór i cel muszą być różne.",
      fixed: "Stała cena za cały pojazd",
      quoteOnly: "Zapytaj o dokładną cenę",
      vehicleFits: "Pojazd pasuje",
      largerVehicle: "Wybierz większy pojazd",
      whatsappOpened: "WhatsApp otwarty. Zapytanie zostało zapisane.",
      whatsappOnly: "WhatsApp otwarty. Zapis wymaga API produkcyjnego.",
      serverMissing: "Serwer rezerwacji nie jest jeszcze aktywny. Wyślij zapytanie WhatsApp.",
      required: "Uzupełnij wymagane pola.",
      copied: "Szczegóły skopiowane.",
      copyFailed: "Kopiowanie nieudane.",
      returnAdded: "Dodano transfer powrotny.",
      analyticsConsent: "Zezwolić na cookies analityczne dla reklam i rezerwacji?",
      accept: "Akceptuję",
      essential: "Tylko niezbędne",
      whatsappRequired: "Wymagane potwierdzenie WhatsApp",
      customConfirmed: "Niestandardowe trasy są potwierdzane przez WhatsApp przed rezerwacją.",
      selectRoute: "Wybierz trasę",
      routeGuide: "Opis trasy"
    },
    ru: {
      routeNeeded: "Выберите место встречи и пункт назначения.",
      sameRoute: "Место встречи и пункт назначения должны отличаться.",
      fixed: "Фиксированная цена за автомобиль",
      quoteOnly: "Запросить точную цену",
      vehicleFits: "Автомобиль подходит",
      largerVehicle: "Выберите автомобиль больше",
      whatsappOpened: "WhatsApp открыт. Заявка сохранена.",
      whatsappOnly: "WhatsApp открыт. Сохранение требует production API.",
      serverMissing: "Сервер бронирования еще не активен. Отправьте заявку в WhatsApp.",
      required: "Заполните обязательные поля.",
      copied: "Детали скопированы.",
      copyFailed: "Не удалось скопировать.",
      returnAdded: "Обратный трансфер добавлен.",
      analyticsConsent: "Разрешить аналитические cookies для улучшения рекламы и бронирований?",
      accept: "Разрешить",
      essential: "Только необходимые",
      whatsappRequired: "Требуется подтверждение WhatsApp",
      customConfirmed: "Индивидуальные маршруты подтверждаются в WhatsApp до бронирования.",
      selectRoute: "Выбрать маршрут",
      routeGuide: "Описание маршрута"
    },
    nl: {
      routeNeeded: "Kies ophaalpunt en bestemming.",
      sameRoute: "Ophaalpunt en bestemming moeten verschillen.",
      fixed: "Vaste totaalprijs per voertuig",
      quoteOnly: "Exacte prijs aanvragen",
      vehicleFits: "Voertuig past",
      largerVehicle: "Kies een groter voertuig",
      whatsappOpened: "WhatsApp geopend. De aanvraag is opgeslagen.",
      whatsappOnly: "WhatsApp geopend. Opslaan vereist de productie-API.",
      serverMissing: "De boekingsserver is nog niet actief. Stuur de WhatsApp-aanvraag.",
      required: "Vul de verplichte velden in.",
      copied: "Boekingsdetails gekopieerd.",
      copyFailed: "Kopiëren mislukt.",
      returnAdded: "Retourrit toegevoegd.",
      analyticsConsent: "Analytics-cookies toestaan om advertenties en boekingen te verbeteren?",
      accept: "Accepteren",
      essential: "Alleen noodzakelijk",
      whatsappRequired: "WhatsApp bevestiging vereist",
      customConfirmed: "Aangepaste routes worden voor boeking via WhatsApp bevestigd.",
      selectRoute: "Selecteer route",
      routeGuide: "Routegids"
    }
  };

  function lang() {
    return document.documentElement.lang || "en";
  }

  function t(key) {
    return (copy[lang()] || copy.en)[key] || copy.en[key] || key;
  }

  function money(value) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: catalog.currency,
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function text(value) {
    return String(value || "").trim();
  }

  function normalizePhone(value) {
    return text(value).replace(/[^\d+]/g, "");
  }

  function todayIso() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function isNight(time) {
    if (!time) return false;
    const hour = Number(time.split(":")[0]);
    return hour >= 23 || hour < 6;
  }

  function getRouteById(routeId) {
    return catalog.routes.find((route) => route.id === routeId);
  }

  function getRouteByPlaces(origin, destination) {
    return catalog.routes.find((route) => {
      return (route.origin === origin && route.destination === destination) ||
        (route.origin === destination && route.destination === origin);
    });
  }

  function places() {
    return Array.from(new Set(catalog.routes.flatMap((route) => [route.origin, route.destination])));
  }

  function vehicle(vehicleId = state.vehicleId) {
    return catalog.vehicles.find((item) => item.id === vehicleId) || catalog.vehicles[0];
  }

  function els() {
    return {
      form: document.querySelector("#bookingForm"),
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
      hotelAddress: document.querySelector("#hotelAddress"),
      guestName: document.querySelector("#guestName"),
      guestPhone: document.querySelector("#guestPhone"),
      guestEmail: document.querySelector("#guestEmail"),
      notes: document.querySelector("#notes"),
      bookStep: document.querySelector("#bookStep"),
      quotePanel: document.querySelector("#quotePanel"),
      quoteTotal: document.querySelector("#quoteTotal"),
      quoteMeta: document.querySelector("#quoteMeta"),
      quoteNote: document.querySelector("#quoteNote"),
      vehicleGrid: document.querySelector("#vehicleGrid"),
      routeGrid: document.querySelector("#routeGrid"),
      status: document.querySelector("#bookingStatus"),
      capacityStatus: document.querySelector("#capacityStatus"),
      topWhatsapp: document.querySelector("#topWhatsapp"),
      stickyWhatsapp: document.querySelector("#stickyWhatsapp"),
      returnUpsell: document.querySelector("#returnUpsell"),
      confirmBooking: document.querySelector("#confirmBooking"),
      copyRequest: document.querySelector("#copyRequest")
    };
  }

  function selectedRoute() {
    const e = els();
    if (!e.pickup || !e.dropoff) return null;
    return getRouteByPlaces(e.pickup.value, e.dropoff.value);
  }

  function calculate(input = {}) {
    const route = input.route || selectedRoute();
    const selectedVehicle = vehicle(input.vehicleId);
    if (!route || route.quoteOnly || !route.prices[selectedVehicle.id]) {
      return { route, vehicle: selectedVehicle, quoteOnly: true, total: null };
    }
    const base = Number(route.prices[selectedVehicle.id]);
    const ways = state.tripType === "return" ? 2 : 1;
    const discount = state.tripType === "return" ? Number(catalog.fees.returnDiscount || 1) : 1;
    const seatFee = state.childSeats * Number(catalog.fees.childSeatFeeEur || 0);
    const nightFee = (isNight(els().pickupTime?.value) ? Number(catalog.fees.nightFeeEur || 0) : 0) +
      (state.tripType === "return" && isNight(els().returnTime?.value) ? Number(catalog.fees.nightFeeEur || 0) : 0);
    return {
      route,
      vehicle: selectedVehicle,
      quoteOnly: false,
      total: Math.round((base * ways * discount) + seatFee + nightFee)
    };
  }

  function readablePlace(place, detail) {
    return place === "Other hotel or address" && text(detail) ? text(detail) : place;
  }

  function routeText() {
    const e = els();
    return `${readablePlace(e.pickup.value, e.pickupDetail.value)} -> ${readablePlace(e.dropoff.value, e.dropoffDetail.value)}`;
  }

  function formatDate(value) {
    if (!value) return "not selected";
    try {
      return new Intl.DateTimeFormat(lang() === "en" ? "en-GB" : lang(), {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(`${value}T00:00:00`));
    } catch {
      return value;
    }
  }

  function formatDateTime(date, time) {
    return `${formatDate(date)} ${time || ""}`.trim();
  }

  function bookingRef() {
    const e = els();
    const date = (e.pickupDate.value || todayIso()).replace(/\D/g, "");
    const time = (e.pickupTime.value || "0000").replace(/\D/g, "");
    const routeCode = (selectedRoute()?.id || "custom").toUpperCase();
    return `AYT-${date}-${time}-${routeCode}`;
  }

  function bookingMessage(reference, quote) {
    const e = els();
    const tripLabel = state.tripType === "return" ? "Return transfer" : "One-way transfer";
    const priceLine = quote.quoteOnly ? "Exact quote requested" : `EUR ${Number(quote.total || 0).toFixed(0)} TOTAL / per vehicle`;
    return [
      "*AYT RIDE | NEW TRANSFER REQUEST*",
      `Reference: ${reference}`,
      "",
      "*Guest details*",
      `- Name: ${text(e.guestName.value) || "Not provided"}`,
      `- WhatsApp: ${normalizePhone(e.guestPhone.value) || "Not provided"}`,
      e.guestEmail.value ? `- Email: ${text(e.guestEmail.value)}` : "- Email: Not provided",
      "",
      "*Route details*",
      `- Trip: ${tripLabel}`,
      `- From: ${readablePlace(e.pickup.value, e.pickupDetail.value)}`,
      `- To: ${readablePlace(e.dropoff.value, e.dropoffDetail.value)}`,
      `- Pickup: ${formatDateTime(e.pickupDate.value, e.pickupTime.value)}`,
      state.tripType === "return" ? `- Return: ${formatDateTime(e.returnDate.value, e.returnTime.value)}` : "",
      `- Flight: ${text(e.flightNumber.value) || "Not provided"}`,
      e.hotelAddress.value ? `- Hotel/address: ${text(e.hotelAddress.value)}` : "",
      "",
      "*Vehicle details*",
      `- Vehicle: ${quote.vehicle.name}`,
      `- Passengers: ${state.passengers}`,
      `- Suitcases: ${state.luggage}`,
      `- Child seats: ${state.childSeats}`,
      "",
      "*Price and payment*",
      `- Price: ${priceLine}`,
      "- Payment: Pay on arrival / cash to driver",
      "- Online payment: Not required",
      "",
      "*Notes*",
      text(e.notes.value) || "No extra notes",
      "",
      "Please confirm vehicle availability, exact meeting point and final booking status."
    ].filter(Boolean).join("\n");
  }

  function ownerReadableSummary(reference, quote) {
    const e = els();
    return [
      `AYT Ride booking request ${reference}`,
      `Route: ${routeText()}`,
      `Pickup: ${formatDateTime(e.pickupDate.value, e.pickupTime.value)}`,
      state.tripType === "return" ? `Return: ${formatDateTime(e.returnDate.value, e.returnTime.value)}` : "",
      `Vehicle: ${quote.vehicle.name}`,
      `Passengers: ${state.passengers}`,
      `Suitcases: ${state.luggage}`,
      `Child seats: ${state.childSeats}`,
      `Guest: ${text(e.guestName.value)}`,
      `Phone: ${normalizePhone(e.guestPhone.value)}`,
      `Email: ${text(e.guestEmail.value) || "Not provided"}`,
      `Price: ${quote.quoteOnly ? t("quoteOnly") : money(quote.total)}`,
      "Payment: Pay on arrival",
      `Notes: ${text(e.notes.value) || "No extra notes"}`
    ].filter(Boolean).join("\n");
  }

  function whatsappUrl(message) {
    const number = String(catalog.business.whatsapp || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function setStatus(message, tone = "info") {
    const e = els();
    if (!e.status) return;
    e.status.textContent = message;
    e.status.dataset.tone = tone;
  }

  function fillSelect(select, selected) {
    if (!select) return;
    select.innerHTML = places().map((place) => {
      return `<option value="${place.replace(/"/g, "&quot;")}"${place === selected ? " selected" : ""}>${place}</option>`;
    }).join("");
  }

  function setCounter(key, value) {
    const limits = { passengers: [1, 6], luggage: [0, 6], childSeats: [0, 3] };
    const [min, max] = limits[key];
    state[key] = Math.max(min, Math.min(max, Number(value)));
    const valueEl = document.querySelector(`#${key}Value`);
    if (valueEl) valueEl.textContent = state[key];
    document.querySelectorAll(`[data-counter="${key}"]`).forEach((button) => {
      const next = state[key] + Number(button.dataset.delta);
      button.disabled = next < min || next > max;
    });
    update();
  }

  function routeSelectionDefaults() {
    const route = getRouteById(document.body.dataset.routeId);
    return {
      pickup: route?.origin || "Antalya Airport (AYT)",
      dropoff: route?.destination || "Lara / Kundu"
    };
  }

  function validateStepOne() {
    const e = els();
    if (!e.pickup.value || !e.dropoff.value || !e.pickupDate.value) return t("required");
    if (e.pickup.value === e.dropoff.value) return t("sameRoute");
    if (e.pickupDate.value < todayIso()) return t("required");
    return "";
  }

  function validateBooking() {
    const e = els();
    const stepOne = validateStepOne();
    if (stepOne) return stepOne;
    if (!text(e.guestName.value) || !normalizePhone(e.guestPhone.value)) return t("required");
    if (state.tripType === "return" && (!e.returnDate.value || !e.returnTime.value)) return t("required");
    const selectedVehicle = vehicle();
    if (state.passengers > selectedVehicle.passengers || state.luggage > selectedVehicle.luggage) {
      return t("largerVehicle");
    }
    return "";
  }

  function bookingPayload(reference, quote) {
    const e = els();
    return {
      reference,
      language: lang(),
      routeId: quote.route?.id || "custom",
      tripType: state.tripType,
      pickup: readablePlace(e.pickup.value, e.pickupDetail.value),
      dropoff: readablePlace(e.dropoff.value, e.dropoffDetail.value),
      pickupDate: e.pickupDate.value,
      pickupTime: e.pickupTime.value,
      returnDate: state.tripType === "return" ? e.returnDate.value : "",
      returnTime: state.tripType === "return" ? e.returnTime.value : "",
      flightNumber: text(e.flightNumber.value),
      hotelAddress: text(e.hotelAddress.value),
      vehicleId: quote.vehicle.id,
      passengers: state.passengers,
      luggage: state.luggage,
      childSeats: state.childSeats,
      guestName: text(e.guestName.value),
      guestPhone: normalizePhone(e.guestPhone.value),
      guestEmail: text(e.guestEmail.value),
      notes: text(e.notes.value),
      publicTotalEur: quote.total,
      quoteOnly: quote.quoteOnly,
      attribution: readAttribution()
    };
  }

  async function submitBooking(payload) {
    const base = catalog.apiBase || "";
    const endpoint = `${base}/api/bookings`;
    if ((location.hostname === "127.0.0.1" || location.hostname === "localhost") && !catalog.apiBase) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return { ok: true, reference: payload.reference, developmentOnly: true };
    }
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || "Booking API unavailable");
    }
    return response.json();
  }

  function aytEvent(name, params = {}) {
    window.dataLayer = window.dataLayer || [];
    const safeParams = { ...params };
    delete safeParams.internalPrice;
    window.dataLayer.push({ event: name, ...safeParams });
    if (window.gtag) window.gtag("event", name, safeParams);
  }

  function readAttribution() {
    try {
      return JSON.parse(localStorage.getItem(attributionKey) || "{}");
    } catch {
      return {};
    }
  }

  function preserveAttribution() {
    const params = new URLSearchParams(location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
    const current = readAttribution();
    let changed = false;
    keys.forEach((key) => {
      if (params.has(key)) {
        current[key] = params.get(key);
        changed = true;
      }
    });
    if (changed) localStorage.setItem(attributionKey, JSON.stringify(current));
  }

  function renderVehicles() {
    const e = els();
    if (!e.vehicleGrid) return;
    const available = catalog.vehicles.filter((item) => item.passengers >= state.passengers && item.luggage >= state.luggage);
    if (!available.some((item) => item.id === state.vehicleId)) state.vehicleId = available[0]?.id || catalog.vehicles[0].id;
    e.vehicleGrid.innerHTML = catalog.vehicles.map((item) => {
      const q = calculate({ vehicleId: item.id });
      const disabled = item.passengers < state.passengers || item.luggage < state.luggage;
      const price = q.quoteOnly ? t("quoteOnly") : `${money(q.total)} TOTAL`;
      return `
        <button type="button" class="vehicle-card ${item.id === state.vehicleId ? "active" : ""}" data-vehicle="${item.id}" aria-pressed="${item.id === state.vehicleId}" ${disabled ? "disabled" : ""}>
          <span class="vehicle-media"><img src="${item.image}" alt="${item.imageAlt}" loading="lazy"></span>
          <span class="vehicle-card-body">
            <strong>${item.name}</strong>
            <small>${item.passengers} passengers, ${item.luggage} suitcases</small>
            <small>${disabled ? t("largerVehicle") : item.description}</small>
            <span class="vehicle-price">${price}</span>
          </span>
        </button>
      `;
    }).join("");
  }

  function renderRoutes() {
    const e = els();
    if (!e.routeGrid) return;
    e.routeGrid.innerHTML = catalog.routes.filter((route) => route.available && !route.quoteOnly).slice(0, 6).map((route) => {
      const sedan = route.prices["standard-sedan"];
      const vip = route.prices["vip-van"];
      const routeSlug = route.slugs?.[lang()] || route.slugs?.en || "";
      const guidePath = routeSlug ? (lang() === "en" ? `/${routeSlug}/` : `/${lang()}/${routeSlug}/`) : "";
      const routeImage = route.image ? `
            <span class="route-thumb">
              <img src="${escapeHtml(route.image)}" alt="${escapeHtml(route.imageAlt || `${route.destination} transfer route`)}" loading="lazy">
            </span>` : "";
      return `
        <article class="route-card">
          <button type="button" data-route="${route.id}" aria-label="Select ${route.destination}">
            ${routeImage}
            <span class="route-card-top">
              <span class="route-code">AYT</span>
              <span class="route-price">From ${money(sedan)}</span>
            </span>
            <strong>${route.destination}</strong>
            <span class="route-fares">
              <span><small>Standard Sedan</small><b>${money(sedan)}</b></span>
              <span><small>VIP Van</small><b>${money(vip)}</b></span>
            </span>
            <span class="route-stats">
              <small>${route.distanceKm} km</small>
              <small>${route.durationMin} min</small>
              <small>${t("fixed")}</small>
            </span>
            <span class="route-card-action">${t("selectRoute")}</span>
          </button>
          ${guidePath ? `<a href="${guidePath}">${t("routeGuide")}</a>` : ""}
        </article>
      `;
    }).join("");
  }

  function update() {
    const e = els();
    if (!e.form) return;
    const route = selectedRoute();
    const q = calculate();
    const custom = !route || route.quoteOnly;

    renderVehicles();
    if (e.customRouteFields) e.customRouteFields.classList.toggle("hidden", !custom);
    if (e.returnFields) e.returnFields.classList.toggle("hidden", state.tripType !== "return");
    if (e.quotePanel) e.quotePanel.classList.toggle("hidden", !state.quoted);
    if (e.bookStep) e.bookStep.classList.toggle("hidden", !state.quoted);
    if (e.returnUpsell) e.returnUpsell.classList.toggle("hidden", state.tripType === "return" || !state.quoted || q.quoteOnly);
    if (e.capacityStatus) e.capacityStatus.textContent = q.quoteOnly ? t("quoteOnly") : t("vehicleFits");
    if (e.quoteTotal) e.quoteTotal.textContent = q.quoteOnly ? t("quoteOnly") : `${money(q.total)} TOTAL`;
    if (e.quoteMeta) e.quoteMeta.textContent = q.quoteOnly ? t("whatsappRequired") : `${q.vehicle.name} / per vehicle`;
    if (e.quoteNote) e.quoteNote.textContent = q.quoteOnly ? t("customConfirmed") : t("fixed");
    const topMessage = "Hello AYT Ride, I want to book a private transfer in Antalya.";
    if (e.topWhatsapp) e.topWhatsapp.href = whatsappUrl(topMessage);
    if (e.stickyWhatsapp) e.stickyWhatsapp.href = whatsappUrl(topMessage);
  }

  function initTripButtons() {
    document.querySelectorAll("[data-trip]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tripType = button.dataset.trip;
        document.querySelectorAll("[data-trip]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        if (state.tripType === "return") aytEvent("return_trip_added", { language: lang(), route: selectedRoute()?.id });
        update();
      });
    });
  }

  function initBooking() {
    const e = els();
    if (!e.form) return;
    preserveAttribution();
    const routeDefaults = routeSelectionDefaults();
    fillSelect(e.pickup, routeDefaults.pickup);
    fillSelect(e.dropoff, routeDefaults.dropoff);
    e.pickupDate.min = todayIso();
    e.pickupDate.value = e.pickupDate.value || todayIso();
    e.pickupTime.value = e.pickupTime.value || "11:30";
    if (e.returnDate) e.returnDate.min = todayIso();

    initTripButtons();
    renderRoutes();

    document.querySelectorAll("[data-counter]").forEach((button) => {
      button.addEventListener("click", () => setCounter(button.dataset.counter, state[button.dataset.counter] + Number(button.dataset.delta)));
    });

    document.querySelector("#swapRoute")?.addEventListener("click", () => {
      const pickup = e.pickup.value;
      e.pickup.value = e.dropoff.value;
      e.dropoff.value = pickup;
      update();
    });

    e.form.addEventListener("input", () => {
      if (!state.quoteStarted) {
        state.quoteStarted = true;
        aytEvent("quote_started", { language: lang(), route: selectedRoute()?.id || "custom" });
      }
      update();
    });
    e.form.addEventListener("change", update);

    document.querySelector("#seeFixedPrice")?.addEventListener("click", () => {
      const error = validateStepOne();
      if (error) {
        showToast(error);
        return;
      }
      state.quoted = true;
      const q = calculate();
      aytEvent("quote_generated", {
        language: lang(),
        route: q.route?.id || "custom",
        trip_type: state.tripType,
        vehicle: q.vehicle.id,
        booking_value_eur: q.total || undefined
      });
      aytEvent("booking_started", { language: lang(), route: q.route?.id || "custom" });
      update();
      e.bookStep?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    e.returnUpsell?.addEventListener("click", () => {
      const returnButton = document.querySelector("[data-trip='return']");
      returnButton?.click();
      showToast(t("returnAdded"));
    });

    e.vehicleGrid?.addEventListener("click", (event) => {
      const card = event.target.closest("[data-vehicle]");
      if (!card || card.disabled) return;
      state.vehicleId = card.dataset.vehicle;
      update();
    });

    e.routeGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-route]");
      if (!button) return;
      const route = getRouteById(button.dataset.route);
      if (!route) return;
      e.pickup.value = route.origin;
      e.dropoff.value = route.destination;
      state.quoted = false;
      aytEvent("view_route", { language: lang(), route: route.id });
      update();
      document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    e.copyRequest?.addEventListener("click", async () => {
      const q = calculate();
      try {
        await navigator.clipboard.writeText(ownerReadableSummary(bookingRef(), q));
        showToast(t("copied"));
      } catch {
        showToast(t("copyFailed"));
      }
    });

    e.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state.submitting) return;
      const error = validateBooking();
      if (error) {
        showToast(error);
        return;
      }
      state.submitting = true;
      e.confirmBooking.disabled = true;
      const q = calculate();
      const reference = bookingRef();
      const payload = bookingPayload(reference, q);
      aytEvent("booking_submitted", {
        language: lang(),
        route: payload.routeId,
        trip_type: payload.tripType,
        vehicle: payload.vehicleId,
        booking_value_eur: payload.publicTotalEur || undefined
      });
      try {
        const saved = await submitBooking(payload);
        const finalReference = saved.reference || reference;
        const message = bookingMessage(finalReference, q);
        const persisted = Boolean(saved.ok && !saved.developmentOnly);
        sessionStorage.setItem(confirmationKey, JSON.stringify({ ...payload, reference: finalReference, persisted }));
        window.open(whatsappUrl(message), "_blank", "noopener");
        aytEvent("whatsapp_clicked", { language: lang(), route: payload.routeId, trip_type: payload.tripType, vehicle: payload.vehicleId });
        showToast(t("whatsappOpened"));
        location.href = `/booking-confirmation/?ref=${encodeURIComponent(finalReference)}`;
      } catch {
        const message = bookingMessage(reference, q);
        window.open(whatsappUrl(message), "_blank", "noopener");
        aytEvent("whatsapp_clicked", { language: lang(), route: payload.routeId, trip_type: payload.tripType, vehicle: payload.vehicleId });
        setStatus(t("serverMissing"), "warning");
        showToast(t("whatsappOnly"));
        state.submitting = false;
        e.confirmBooking.disabled = false;
      }
    });

    ["passengers", "luggage", "childSeats"].forEach((key) => setCounter(key, state[key]));
    const pageRoute = document.body.dataset.routeId;
    if (pageRoute) aytEvent("view_route", { language: lang(), route: pageRoute });
    update();
  }

  function initConfirmation() {
    const page = document.querySelector("#confirmationPage");
    if (!page) return;
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(confirmationKey) || "null");
    } catch {
      saved = null;
    }
    const reference = saved?.reference || ref || "AYT";
    page.querySelector("[data-confirmation-ref]").textContent = reference;
    if (saved) {
      page.querySelector("[data-confirmation-route]").textContent = `${saved.pickup} -> ${saved.dropoff}`;
      page.querySelector("[data-confirmation-vehicle]").textContent = vehicle(saved.vehicleId).name;
      page.querySelector("[data-confirmation-price]").textContent = saved.quoteOnly ? t("quoteOnly") : money(saved.publicTotalEur);
    }
    if (saved?.persisted) {
      aytEvent("booking_confirmed", {
        language: saved.language,
        route: saved.routeId,
        trip_type: saved.tripType,
        vehicle: saved.vehicleId,
        booking_value_eur: saved.publicTotalEur || undefined
      });
    }
  }

  async function adminRequest(path, options = {}) {
    const response = await fetch(`${catalog.apiBase || ""}${path}`, {
      credentials: "include",
      headers: { "content-type": "application/json", accept: "application/json", ...(options.headers || {}) },
      ...options
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  const adminState = {
    priceRoutes: [],
    priceVehicles: []
  };

  function formatAdminDate(value) {
    try {
      return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
    } catch {
      return value || "";
    }
  }

  function moneyTry(value) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function plainEur(value) {
    return `€${Number(value || 0).toFixed(0)}`;
  }

  function statusLabel(status) {
    if (status === "confirmed") return "Doğrulandı";
    if (status === "deleted") return "Silindi";
    return "Bekliyor";
  }

  function statusClass(status) {
    if (status === "confirmed") return "confirmed";
    if (status === "deleted") return "deleted";
    return "pending";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderAdminStats(summary, settings) {
    const target = document.querySelector("#adminStats");
    if (!target) return;
    const periods = [
      ["Bugün", summary?.today],
      ["Bu hafta", summary?.week],
      ["Bu ay", summary?.month],
      ["Toplam doğrulanan", summary?.total]
    ];
    target.innerHTML = `
      <article class="kpi-card">
        <small>Bekleyen</small>
        <strong>${Number(summary?.pendingCount || 0)}</strong>
        <span>Henüz ciroya alınmadı</span>
      </article>
      ${periods.map(([label, item]) => `
        <article class="kpi-card">
          <small>${label}</small>
          <strong>${moneyTry(item?.profitTry || 0)}</strong>
          <span>${Number(item?.count || 0)} yolculuk • Ciro ${plainEur(item?.revenueEur || 0)} • Şoför ${moneyTry(item?.driverCostTry || 0)}</span>
        </article>
      `).join("")}
      <article class="kpi-card muted">
        <small>Hesap ayarı</small>
        <strong>${Number(settings?.driverRateTryPerKm || 35)} TL/km</strong>
        <span>EUR kuru: ${Number(settings?.eurTryRate || 45)} TL</span>
      </article>
    `;
  }

  function renderAdminBookings(bookings) {
    const list = document.querySelector("#adminBookings");
    const count = document.querySelector("#bookingCount");
    if (!list || !count) return;
    count.textContent = `${bookings.length} kayıt`;
    if (!bookings.length) {
      list.innerHTML = "<div class=\"booking-empty\"><strong>Henüz rezervasyon yok.</strong><p>Backend aktif olduğunda tüm cihazlardan gelen kayıtlar burada görünecek.</p></div>";
      return;
    }
    list.innerHTML = bookings.map((item) => `
      <article class="booking-item" data-status="${escapeHtml(item.status || "pending")}">
        <div class="booking-item-head">
          <div>
            <strong>${escapeHtml(item.guestName)}</strong>
            <small>${escapeHtml(item.reference)} • ${escapeHtml(formatAdminDate(item.createdAt))}</small>
          </div>
          <div class="booking-head-actions">
            <span class="status-badge ${statusClass(item.status)}">${statusLabel(item.status)}</span>
            <span class="booking-price">${item.quoteOnly ? "Teklif" : money(item.publicTotalEur)}</span>
          </div>
        </div>
        <div class="booking-item-grid">
          <p><b>Rota</b>${escapeHtml(item.pickup)} -> ${escapeHtml(item.dropoff)}</p>
          <p><b>Alış</b>${escapeHtml(formatDateTime(item.pickupDate, item.pickupTime))}</p>
          <p><b>Araç</b>${escapeHtml(vehicle(item.vehicleId).name)}</p>
          <p><b>Telefon</b>${escapeHtml(item.guestPhone)}</p>
          <p><b>E-posta</b>${escapeHtml(item.guestEmail || "-")}</p>
          <p><b>Mesafe</b>${Number(item.distanceKm || 0)} km • ${Number(item.ways || 1)} yön</p>
          <p><b>Satış</b>${item.quoteOnly ? "Teklif bekliyor" : `${money(item.publicTotalEur)} / ${moneyTry(item.revenueTry)}`}</p>
          <p><b>Şoföre verilecek</b>${item.driverCostTry == null ? "Mesafe yok" : `${moneyTry(item.driverCostTry)} (${Number(item.driverRateTryPerKm || 35)} TL/km)`}</p>
          <p><b>Tahmini kâr</b><span class="${Number(item.profitTry || 0) >= 0 ? "profit-positive" : "profit-negative"}">${item.profitTry == null ? "-" : moneyTry(item.profitTry)}</span></p>
        </div>
        <p class="booking-note"><b>Not:</b> ${escapeHtml(item.notes || "-")}</p>
        ${item.confirmedAt ? `<p class="booking-note"><b>Doğrulama:</b> ${escapeHtml(formatAdminDate(item.confirmedAt))}</p>` : ""}
        <div class="booking-actions">
          ${item.status === "confirmed"
            ? `<button class="admin-btn soft" type="button" data-booking-action="pending" data-reference="${escapeHtml(item.reference)}">Beklemeye al</button>`
            : `<button class="admin-btn success" type="button" data-booking-action="confirm" data-reference="${escapeHtml(item.reference)}">Doğrula ve ciroya ekle</button>`}
          <button class="admin-btn danger" type="button" data-booking-action="delete" data-reference="${escapeHtml(item.reference)}">Sil</button>
        </div>
      </article>
    `).join("");
  }

  function renderAdminPrices(data) {
    adminState.priceRoutes = data.routes || [];
    adminState.priceVehicles = data.vehicles || [];
    const routeSelect = document.querySelector("#priceRoute");
    const vehicleSelect = document.querySelector("#priceVehicle");
    const priceInput = document.querySelector("#priceEur");
    const list = document.querySelector("#priceList");
    if (!routeSelect || !vehicleSelect || !priceInput || !list) return;

    const selectedRouteId = routeSelect.value || adminState.priceRoutes[0]?.id || "";
    const selectedVehicleId = vehicleSelect.value || adminState.priceVehicles[0]?.id || "";
    routeSelect.innerHTML = adminState.priceRoutes.map((route) => `<option value="${escapeHtml(route.id)}"${route.id === selectedRouteId ? " selected" : ""}>${escapeHtml(route.label)}</option>`).join("");
    vehicleSelect.innerHTML = adminState.priceVehicles.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === selectedVehicleId ? " selected" : ""}>${escapeHtml(item.name)}</option>`).join("");

    const selectedRoute = adminState.priceRoutes.find((route) => route.id === routeSelect.value);
    priceInput.value = selectedRoute?.prices?.[vehicleSelect.value] ?? "";

    list.innerHTML = adminState.priceRoutes.map((route) => `
      <article class="price-row">
        <div>
          <strong>${escapeHtml(route.label)}</strong>
          <small>${Number(route.distanceKm || 0)} km • ${Number(route.durationMin || 0)} dk</small>
        </div>
        ${adminState.priceVehicles.map((item) => `
          <button type="button" data-price-route="${escapeHtml(route.id)}" data-price-vehicle="${escapeHtml(item.id)}">
            <small>${escapeHtml(item.shortName || item.name)}</small>
            <b>${plainEur(route.prices?.[item.id] || 0)}</b>
          </button>
        `).join("")}
      </article>
    `).join("");
  }

  async function reloadAdminDashboard() {
    const [bookingsData, pricesData] = await Promise.all([
      adminRequest("/api/admin/bookings"),
      adminRequest("/api/admin/prices")
    ]);
    renderAdminStats(bookingsData.summary || {}, bookingsData.settings || {});
    renderAdminBookings(bookingsData.bookings || []);
    renderAdminPrices(pricesData || {});
  }

  function initAdmin() {
    const root = document.querySelector("#adminApp");
    if (!root) return;
    const login = document.querySelector("#adminLogin");
    const panel = document.querySelector("#adminPanel");
    const output = document.querySelector("#adminOutput");

    async function loadBookings() {
      output.textContent = "Panel verileri yükleniyor...";
      await reloadAdminDashboard();
      output.textContent = "Rezervasyonlar güncellendi.";
    }

    login.addEventListener("submit", async (event) => {
      event.preventDefault();
      output.textContent = "";
      const email = text(document.querySelector("#adminEmail").value);
      const password = document.querySelector("#adminPassword").value;
      try {
        await adminRequest("/api/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        login.classList.add("hidden");
        panel.classList.remove("hidden");
        await loadBookings();
      } catch {
        output.textContent = "Giriş yapılamadı. Production backend ve admin şifresi kurulmadan panel açılmaz.";
      }
    });

    document.querySelector("#refreshBookings")?.addEventListener("click", () => {
      loadBookings().catch((error) => {
        output.textContent = error.message || "Rezervasyonlar alınamadı.";
      });
    });

    document.querySelector("#adminBookings")?.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-booking-action]");
      if (!button) return;
      const action = button.dataset.bookingAction;
      const reference = button.dataset.reference;
      if (action === "delete" && !window.confirm(`${reference} rezervasyonu panelden silinsin mi?`)) return;
      button.disabled = true;
      output.textContent = "Rezervasyon güncelleniyor...";
      try {
        await adminRequest(`/api/admin/bookings/${encodeURIComponent(reference)}/${action}`, {
          method: "POST",
          body: "{}"
        });
        await loadBookings();
      } catch (error) {
        output.textContent = error.message || "Rezervasyon güncellenemedi.";
      } finally {
        button.disabled = false;
      }
    });

    document.querySelector("#priceRoute")?.addEventListener("change", () => renderAdminPrices({
      routes: adminState.priceRoutes,
      vehicles: adminState.priceVehicles
    }));

    document.querySelector("#priceVehicle")?.addEventListener("change", () => renderAdminPrices({
      routes: adminState.priceRoutes,
      vehicles: adminState.priceVehicles
    }));

    document.querySelector("#priceList")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-price-route]");
      if (!button) return;
      const routeSelect = document.querySelector("#priceRoute");
      const vehicleSelect = document.querySelector("#priceVehicle");
      if (routeSelect) routeSelect.value = button.dataset.priceRoute;
      if (vehicleSelect) vehicleSelect.value = button.dataset.priceVehicle;
      renderAdminPrices({ routes: adminState.priceRoutes, vehicles: adminState.priceVehicles });
      document.querySelector("#priceEur")?.focus();
    });

    document.querySelector("#priceEditor")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const routeId = document.querySelector("#priceRoute")?.value || "";
      const vehicleId = document.querySelector("#priceVehicle")?.value || "";
      const priceEur = document.querySelector("#priceEur")?.value || "";
      output.textContent = "Fiyat kaydediliyor...";
      try {
        await adminRequest("/api/admin/prices", {
          method: "POST",
          body: JSON.stringify({ routeId, vehicleId, priceEur })
        });
        await reloadAdminDashboard();
        output.textContent = "Fiyat kaydedildi. Public katalog da güncellendi.";
      } catch (error) {
        output.textContent = error.message || "Fiyat kaydedilemedi.";
      }
    });

    document.querySelector("#logoutAdmin")?.addEventListener("click", async () => {
      try {
        await adminRequest("/api/admin/logout", { method: "POST", body: "{}" });
      } catch {
        // Session may already be gone.
      }
      panel.classList.add("hidden");
      login.classList.remove("hidden");
      output.textContent = "Oturum kapatıldı.";
    });
  }

  function initConsent() {
    const ids = catalog.analytics || {};
    if (!ids.gtmId && !ids.ga4MeasurementId && !ids.googleAdsId) return;
    const saved = localStorage.getItem(consentKey);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
    if (saved === "accepted") {
      loadMarketingTags();
      return;
    }
    if (saved === "essential") return;
    const banner = document.createElement("div");
    banner.className = "consent-bar";
    banner.innerHTML = `<p>${t("analyticsConsent")}</p><button type="button" data-consent="accepted">${t("accept")}</button><button type="button" data-consent="essential">${t("essential")}</button>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      localStorage.setItem(consentKey, button.dataset.consent);
      if (button.dataset.consent === "accepted") loadMarketingTags();
      banner.remove();
    });
    document.body.appendChild(banner);
  }

  function loadMarketingTags() {
    const ids = catalog.analytics || {};
    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
    const tagId = ids.gtmId || ids.ga4MeasurementId || ids.googleAdsId;
    if (!tagId || document.querySelector("[data-ayt-tag]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.aytTag = "true";
    script.src = ids.gtmId
      ? `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtmId)}`
      : `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
    document.head.appendChild(script);
    if (!ids.gtmId && window.gtag) {
      window.gtag("js", new Date());
      if (ids.ga4MeasurementId) window.gtag("config", ids.ga4MeasurementId);
      if (ids.googleAdsId) window.gtag("config", ids.googleAdsId);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadLiveCatalog();
    initConsent();
    initBooking();
    initConfirmation();
    initAdmin();
  });

  window.AYTRide = { catalog, calculate, getRouteById, getRouteByPlaces };
}());
