(function () {
  const catalog = window.AYTRideCatalog;
  if (!catalog) return;

  const attributionKey = "aytRideAttribution";
  const analyticsVisitorKey = "aytRideAnalyticsVisitor";
  const adminSessionKey = "aytRideAdminSession";
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
    const trackedEvent = {
      quote_started: "booking_quote_started",
      booking_confirmed: "booking_confirmed",
      guide_booking_cta_clicked: "guide_booking_cta_clicked"
    }[name];
    if (trackedEvent) recordAnalyticsEvent(trackedEvent, safeParams.route_id || safeParams.route);
  }

  function analyticsVisitorId() {
    let visitorId = localStorage.getItem(analyticsVisitorKey);
    if (!visitorId) {
      visitorId = typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(analyticsVisitorKey, visitorId);
    }
    return visitorId;
  }

  function recordAnalyticsEvent(eventType, routeId = "") {
    if (localStorage.getItem(consentKey) !== "accepted") return;
    const attribution = readAttribution();
    const body = JSON.stringify({
      eventType,
      visitorId: analyticsVisitorId(),
      path: location.pathname,
      source: attribution.source || attribution.utm_source || "direct",
      medium: attribution.utm_medium || "",
      campaign: attribution.utm_campaign || "",
      referrerHost: attribution.referrerHost || "",
      routeId: routeId || ""
    });
    fetch(`${catalog.apiBase || ""}/api/analytics/events`, {
      method: "POST",
      credentials: "omit",
      keepalive: true,
      headers: { "content-type": "application/json", accept: "application/json" },
      body
    }).catch(() => {
      // Analytics must never interrupt the reservation flow.
    });
  }

  function initGuideBookingCta() {
    const guides = {
      "/blog/antalya-airport-to-alanya-distance-transfer-time/": { href: "/antalya-airport-to-alanya-transfer/#booking", route: "alanya", label: "Check Alanya transfer price" },
      "/blog/antalya-airport-to-side-distance-transfer-time/": { href: "/antalya-airport-to-side-transfer/#booking", route: "side", label: "Check Side transfer price" },
      "/blog/antalya-airport-to-kemer-distance-transfer-time/": { href: "/antalya-airport-to-kemer-transfer/#booking", route: "kemer", label: "Check Kemer transfer price" },
      "/blog/antalya-airport-to-lara-kundu-transfer-time/": { href: "/antalya-airport-to-lara-transfer/#booking", route: "lara", label: "Check Lara and Kundu transfer price" },
      "/blog/belek-golf-transfer/": { href: "/antalya-airport-to-belek-transfer/#booking", route: "belek", label: "Check Belek transfer price" },
      "/de/ratgeber/flughafen-antalya-alanya-entfernung-fahrzeit/": { href: "/de/flughafen-antalya-alanya-transfer/#booking", route: "alanya", label: "Alanya Transferpreis ansehen" },
      "/de/ratgeber/flughafen-antalya-side-entfernung-fahrzeit/": { href: "/de/flughafen-antalya-side-transfer/#booking", route: "side", label: "Side Transferpreis ansehen" },
      "/de/ratgeber/flughafen-antalya-belek-entfernung-fahrzeit/": { href: "/de/flughafen-antalya-belek-transfer/#booking", route: "belek", label: "Belek Transferpreis ansehen" },
      "/de/ratgeber/flughafen-antalya-kemer-entfernung-fahrzeit/": { href: "/de/flughafen-antalya-kemer-transfer/#booking", route: "kemer", label: "Kemer Transferpreis ansehen" },
      "/de/ratgeber/flughafen-antalya-lara-kundu-transferzeit/": { href: "/de/flughafen-antalya-lara-transfer/#booking", route: "lara", label: "Lara und Kundu Transferpreis ansehen" }
    };
    const guide = guides[location.pathname];
    const article = document.querySelector("article.article");
    if (!guide || !article || article.querySelector("[data-guide-booking-cta]")) return;
    const cta = document.createElement("aside");
    cta.className = "article-booking-cta";
    cta.dataset.guideBookingCta = "true";
    cta.innerHTML = `<p>Fixed vehicle price, WhatsApp confirmation and payment on arrival.</p><a class="primary-btn" href="${guide.href}">${guide.label}</a>`;
    const firstParagraph = article.querySelector("p:not(.mini-label)");
    if (firstParagraph) firstParagraph.insertAdjacentElement("afterend", cta);
    else article.prepend(cta);
    cta.querySelector("a")?.addEventListener("click", () => aytEvent("guide_booking_cta_clicked", {
      guide_path: location.pathname,
      route_id: guide.route
    }));
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
    if (!current.landingPage) {
      current.landingPage = `${location.pathname}${location.search}`.slice(0, 500);
      changed = true;
    }
    if (!current.referrerHost && document.referrer) {
      try {
        current.referrerHost = new URL(document.referrer).hostname.slice(0, 180);
        changed = true;
      } catch {
        // Invalid referrer values are not recorded.
      }
    }
    if (!current.source) {
      if (current.gclid || current.gbraid || current.wbraid) current.source = "Google Ads";
      else if (current.utm_source) current.source = current.utm_source;
      else if (current.referrerHost) current.source = current.referrerHost;
      else current.source = "Direct";
      changed = true;
    }
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

  async function publicRequest(path) {
    if (!catalog.apiBase) throw new Error("Public API is not configured.");
    const response = await fetch(`${catalog.apiBase}${path}`, {
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  function blogCard(post) {
    return `
      <a class="post-card" href="/blog/article/?slug=${encodeURIComponent(post.slug)}">
        <span class="post-kicker">${escapeHtml(post.kicker)}</span>
        <strong>${escapeHtml(post.title)}</strong>
        <small>${escapeHtml(post.description)}</small>
        <span class="post-meta">${escapeHtml(post.metaLabel || "AYT Ride guide")}</span>
      </a>
    `;
  }

  async function initBlogLists() {
    const homePreview = document.querySelector("#homeBlogPreview");
    const blogGrid = document.querySelector("#blogPostGrid");
    if (!homePreview && !blogGrid) return;
    try {
      const data = await publicRequest("/api/public/blog-posts");
      const posts = data.posts || [];
      if (!posts.length) return;
      if (homePreview) homePreview.innerHTML = posts.slice(0, 3).map(blogCard).join("");
      if (blogGrid) blogGrid.innerHTML = posts.map(blogCard).join("");
    } catch {
      // Static blog cards remain visible if the live API cannot be reached.
    }
  }

  async function initBlogArticle() {
    const article = document.querySelector("[data-blog-article]");
    if (!article) return;
    const slug = new URLSearchParams(location.search).get("slug") || "";
    if (!slug) {
      article.innerHTML = "<p class=\"mini-label\">Travel guide</p><h1>Article not found</h1><p>Please choose a guide from the blog page.</p>";
      return;
    }
    try {
      const data = await publicRequest(`/api/public/blog-posts/${encodeURIComponent(slug)}`);
      const post = data.post;
      document.title = `${post.title} - AYT Ride`;
      document.querySelector("meta[name='description']")?.setAttribute("content", post.description);
      article.innerHTML = `
        <p class="mini-label">${escapeHtml(post.kicker)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.description)}</p>
        ${(post.body || []).map(([heading, body]) => `<h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p>`).join("")}
        <h2>Book with route details</h2>
        <p>Use the AYT Ride booking form to choose the route, vehicle, date, passenger count and luggage count. The request opens on WhatsApp with a clear booking summary.</p>
        <p><a class="primary-btn" href="/#booking">Check transfer price</a></p>
      `;
    } catch {
      article.innerHTML = "<p class=\"mini-label\">Travel guide</p><h1>Article not found</h1><p>This blog article could not be loaded from the live backend.</p>";
    }
  }

  async function adminRequest(path, options = {}) {
    if (!catalog.apiBase) throw new Error("API_MISSING");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const sessionToken = sessionStorage.getItem(adminSessionKey);
      const response = await fetch(`${catalog.apiBase}${path}`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          ...(sessionToken ? { authorization: `Bearer ${sessionToken}` } : {}),
          ...(options.headers || {})
        },
        ...options,
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(payload.error || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return payload;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("API_TIMEOUT");
      if (error instanceof TypeError) throw new Error("API_NETWORK");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  const adminState = {
    priceRoutes: [],
    priceVehicles: [],
    blogPosts: []
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

  function exchangeSourceLabel(source) {
    if (source === "auto-live") return "otomatik canlı kur";
    if (source === "auto-cache") return "otomatik kayıtlı kur";
    if (source === "auto-stale") return "otomatik eski kayıtlı kur";
    return "yedek kur";
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
        <span>EUR kuru: ${Number(settings?.eurTryRate || 45)} TL • ${exchangeSourceLabel(settings?.eurTryRateSource)}</span>
      </article>
    `;
  }

  function istanbulDay(value) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date(value));
    const get = (type) => parts.find((part) => part.type === type)?.value || "";
    return `${get("year")}-${get("month")}-${get("day")}`;
  }

  function renderAdminAnalytics(data, bookings = []) {
    const stats = document.querySelector("#analyticsStats");
    const days = document.querySelector("#analyticsDays");
    const sources = document.querySelector("#analyticsSources");
    const note = document.querySelector("#analyticsNote");
    if (!stats || !days || !sources || !note) return;
    const today = data?.today || {};
    const week = data?.week || {};
    // D1 is authoritative for saved booking requests. Consent-based browser events are not.
    const siteBookings = bookings.filter((item) => item.createdAt && item.status !== "deleted");
    const bookingCounts = new Map();
    siteBookings.forEach((item) => {
      const day = istanbulDay(item.createdAt);
      bookingCounts.set(day, (bookingCounts.get(day) || 0) + 1);
    });
    const dayKeys = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - index));
      return istanbulDay(date);
    });
    const currentDay = dayKeys[6];
    const weekBookings = dayKeys.reduce((sum, day) => sum + (bookingCounts.get(day) || 0), 0);
    const analyticsDays = new Map((data?.days || []).map((item) => [item.date, item]));
    stats.innerHTML = [
      ["Bugün ziyaretçi*", today.visitors, "Analitik izni veren, kayıt altına alınmış ziyaretçiler"],
      ["Bugün görüntüleme*", today.pageViews, "Analitik izni veren ziyaretçilerin görüntülemeleri"],
      ["7 günde ziyaretçi*", week.visitors, "Analitik izni veren tekil ziyaretçiler"],
      ["Teklif başlangıcı*", week.quoteStarts, "Analitik izni veren ziyaretçiler"],
      ["D1 rezervasyon talebi", weekBookings, "Son 7 gün • bekleyen ve doğrulanan kayıtlar"],
      ["Bugün D1 rezervasyon", bookingCounts.get(currentDay) || 0, "Türkiye saatine göre"],
    ].map(([label, value, description]) => `
      <article class="kpi-card"><small>${escapeHtml(label)}</small><strong>${Number(value || 0)}</strong><span>${escapeHtml(description)}</span></article>
    `).join("");
    days.innerHTML = dayKeys.map((day) => {
      const item = analyticsDays.get(day) || {};
      return `<div class="analytics-day">
        <strong>${escapeHtml(day)}</strong>
        <span>${Number(item.visitors || 0)} ziyaretçi*</span>
        <span>${Number(item.pageViews || 0)} görüntüleme*</span>
        <span>${Number(item.quoteStarts || 0)} teklif*</span>
        <span>${Number(bookingCounts.get(day) || 0)} D1 rezervasyon</span>
      </div>`;
    }).join("");
    sources.innerHTML = (data?.sources || []).map((item) => `
      <div class="analytics-source"><strong>${escapeHtml(item.source || "direct")}</strong><span>${Number(item.pageViews || 0)} görüntüleme*</span></div>
    `).join("") || "<p class=\"admin-note\">Kaynak verisi, analitik izni veren ziyaretçiler geldikçe görünür.</p>";
    note.textContent = "D1 rezervasyonları doğrudan veritabanından alınır; WhatsApp üzerinden elle alınan ve D1'e kaydedilmeyen talepler dahil değildir. * Ziyaret, görüntüleme ve teklif sayıları yalnızca analitik izni veren ziyaretçileri kapsar; önceki kayıp veriler geri getirilemez. Bu özet GA4 raporu değildir.";
  }

  function renderAdminSettings(settings) {
    const driverRateInput = document.querySelector("#driverRateTryPerKm");
    const eurRateInput = document.querySelector("#eurTryRate");
    const status = document.querySelector("#exchangeRateStatus");
    if (driverRateInput) driverRateInput.value = settings?.driverRateTryPerKm ?? 35;
    if (eurRateInput) eurRateInput.value = settings?.eurTryRateFallback ?? settings?.eurTryRate ?? 45;
    if (status) {
      const fetched = settings?.eurTryRateFetchedAt ? `Son yenileme: ${formatAdminDate(settings.eurTryRateFetchedAt)}` : "Henüz canlı kur kaydı yok";
      const rateDate = settings?.eurTryRateDate ? `Kur tarihi: ${settings.eurTryRateDate}` : "";
      status.innerHTML = `
        <strong>Kullanılan EUR/TRY: ${Number(settings?.eurTryRate || 45)} TL (${exchangeSourceLabel(settings?.eurTryRateSource)})</strong>
        <small>${escapeHtml([settings?.exchangeRateProvider || "Frankfurter", rateDate, fetched].filter(Boolean).join(" • "))}</small>
      `;
    }
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
          <p><b>Kaynak</b>${escapeHtml(item.attribution?.source || item.attribution?.utm_source || item.attribution?.referrerHost || "Kaynak kaydı yok")}</p>
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

  function renderAdminBlogs(posts) {
    adminState.blogPosts = posts || [];
    const list = document.querySelector("#adminBlogPosts");
    if (!list) return;
    if (!adminState.blogPosts.length) {
      list.innerHTML = "<div class=\"booking-empty\"><strong>Henüz blog yazısı yok.</strong><p>İlk yazıyı yukarıdaki formdan ekleyebilirsin.</p></div>";
      return;
    }
    list.innerHTML = adminState.blogPosts.map((post) => `
      <article class="admin-blog-item">
        <div>
          <strong>${escapeHtml(post.title)}</strong>
          <small>${escapeHtml(post.slug)} • ${escapeHtml(post.kicker)} • ${escapeHtml(post.metaLabel || "AYT Ride guide")}</small>
          <small>${escapeHtml(post.description)}</small>
        </div>
        <div class="admin-blog-actions">
          <a class="admin-btn soft" href="/blog/article/?slug=${encodeURIComponent(post.slug)}" target="_blank" rel="noopener">Aç</a>
          <button class="admin-btn soft" type="button" data-blog-action="edit" data-slug="${escapeHtml(post.slug)}">Düzenle</button>
          <button class="admin-btn danger" type="button" data-blog-action="delete" data-slug="${escapeHtml(post.slug)}">Sil</button>
        </div>
      </article>
    `).join("");
  }

  function fillBlogEditor(post = {}) {
    const fields = {
      blogSlug: post.slug || "",
      blogKicker: post.kicker || "",
      blogTitle: post.title || "",
      blogDescription: post.description || "",
      blogMetaLabel: post.metaLabel || "",
      blogBody: post.bodyText || ""
    };
    Object.entries(fields).forEach(([id, value]) => {
      const field = document.querySelector(`#${id}`);
      if (field) field.value = value;
    });
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
    const [bookingsData, pricesData, blogData, analyticsData] = await Promise.all([
      adminRequest("/api/admin/bookings"),
      adminRequest("/api/admin/prices"),
      adminRequest("/api/admin/blog-posts"),
      adminRequest("/api/admin/analytics")
    ]);
    renderAdminStats(bookingsData.summary || {}, bookingsData.settings || {});
    renderAdminSettings(bookingsData.settings || {});
    renderAdminBookings(bookingsData.bookings || []);
    renderAdminPrices(pricesData || {});
    renderAdminBlogs(blogData.posts || []);
    renderAdminAnalytics(analyticsData || {}, bookingsData.bookings || []);
  }

  function initAdmin() {
    const root = document.querySelector("#adminApp");
    if (!root) return;
    const login = document.querySelector("#adminLogin");
    const panel = document.querySelector("#adminPanel");
    const output = document.querySelector("#adminOutput");
    const submitButton = login.querySelector('button[type="submit"]');
    window.AYTRideAdminReady = true;

    function loginErrorMessage(error) {
      const message = String(error?.message || "");
      if (error?.status === 401 || message.includes("Invalid login")) return "E-posta veya şifre hatalı. Cloudflare Worker'daki admin hesabı ve şifre özetinin doğru tanımlandığını kontrol edin.";
      if (error?.status === 503 || message.includes("not configured")) return "Sunucuda yönetici girişi yapılandırılmamış olabilir. Aşağıdaki Sunucu durumunu kontrol et bağlantısından adminConfigured değerine bakın.";
      if (message === "API_TIMEOUT") return "Sunucu 12 saniye içinde yanıt vermedi. Bağlantıyı ve Cloudflare Worker'ın çalıştığını kontrol edin.";
      if (message === "API_NETWORK") return "Sunucuya bağlanılamıyor. Cloudflare Worker adresi, internet bağlantısı veya CORS ayarı kontrol edilmeli.";
      if (message === "API_MISSING") return "API adresi eksik. Site katalog ayarını kontrol edin.";
      return `Giriş başarısız: ${message.slice(0, 160) || "Bilinmeyen hata"}`;
    }

    async function loadBookings() {
      output.textContent = "Panel verileri yükleniyor...";
      await reloadAdminDashboard();
      output.textContent = "Rezervasyonlar güncellendi.";
    }

    login.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitButton.disabled) return;
      submitButton.disabled = true;
      submitButton.textContent = "Giriş kontrol ediliyor...";
      output.textContent = "Cloudflare sunucusuna bağlanılıyor...";
      const email = text(document.querySelector("#adminEmail").value);
      const password = document.querySelector("#adminPassword").value;
      try {
        const data = await adminRequest("/api/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        if (!data.sessionToken) throw new Error("Sunucu oturum anahtarı döndürmedi.");
        sessionStorage.setItem(adminSessionKey, data.sessionToken);
        login.classList.add("hidden");
        panel.classList.remove("hidden");
        try {
          await loadBookings();
        } catch (error) {
          output.textContent = "Giriş başarılı, ancak panel verileri alınamadı: " + loginErrorMessage(error);
        }
      } catch (error) {
        output.textContent = loginErrorMessage(error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Giriş yap";
      }
    });

    document.querySelector("#refreshAnalytics")?.addEventListener("click", () => {
      loadBookings().catch((error) => { output.textContent = error.message || "İstatistikler yenilenemedi."; });
    });

    root.querySelector(".admin-sidebar")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-admin-scroll]");
      const target = button && document.getElementById(button.dataset.adminScroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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

    document.querySelector("#settingsEditor")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const driverRateTryPerKm = document.querySelector("#driverRateTryPerKm")?.value || "";
      const eurTryRateFallback = document.querySelector("#eurTryRate")?.value || "";
      output.textContent = "Maliyet ayarları kaydediliyor...";
      try {
        await adminRequest("/api/admin/settings", {
          method: "POST",
          body: JSON.stringify({ driverRateTryPerKm, eurTryRateFallback })
        });
        await reloadAdminDashboard();
        output.textContent = "Maliyet ayarları kaydedildi.";
      } catch (error) {
        output.textContent = error.message || "Maliyet ayarları kaydedilemedi.";
      }
    });

    document.querySelector("#refreshExchangeRate")?.addEventListener("click", async () => {
      output.textContent = "EUR kuru yenileniyor...";
      try {
        const data = await adminRequest("/api/admin/settings/refresh-rate", {
          method: "POST",
          body: "{}"
        });
        renderAdminSettings(data.settings || {});
        await reloadAdminDashboard();
        output.textContent = "EUR kuru otomatik servisten yenilendi.";
      } catch (error) {
        output.textContent = error.message || "EUR kuru yenilenemedi; yedek kur kullanılacak.";
      }
    });

    document.querySelector("#blogEditor")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        slug: document.querySelector("#blogSlug")?.value || "",
        kicker: document.querySelector("#blogKicker")?.value || "",
        title: document.querySelector("#blogTitle")?.value || "",
        description: document.querySelector("#blogDescription")?.value || "",
        metaLabel: document.querySelector("#blogMetaLabel")?.value || "",
        bodyText: document.querySelector("#blogBody")?.value || ""
      };
      output.textContent = "Blog yazısı kaydediliyor...";
      try {
        await adminRequest("/api/admin/blog-posts", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await reloadAdminDashboard();
        output.textContent = "Blog yazısı kaydedildi.";
      } catch (error) {
        output.textContent = error.message || "Blog yazısı kaydedilemedi.";
      }
    });

    document.querySelector("#clearBlogEditor")?.addEventListener("click", () => {
      fillBlogEditor();
      document.querySelector("#blogSlug")?.focus();
    });

    document.querySelector("#adminBlogPosts")?.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-blog-action]");
      if (!button) return;
      const action = button.dataset.blogAction;
      const slug = button.dataset.slug;
      const post = adminState.blogPosts.find((item) => item.slug === slug);
      if (action === "edit" && post) {
        fillBlogEditor(post);
        document.querySelector("#blogTitle")?.focus();
        output.textContent = `${slug} düzenleme formuna alındı.`;
        return;
      }
      if (action !== "delete") return;
      if (!window.confirm(`${slug} blog yazısı silinsin mi?`)) return;
      button.disabled = true;
      output.textContent = "Blog yazısı siliniyor...";
      try {
        await adminRequest(`/api/admin/blog-posts/${encodeURIComponent(slug)}/delete`, {
          method: "POST",
          body: "{}"
        });
        await reloadAdminDashboard();
        output.textContent = "Blog yazısı silindi.";
      } catch (error) {
        output.textContent = error.message || "Blog yazısı silinemedi.";
      } finally {
        button.disabled = false;
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
      sessionStorage.removeItem(adminSessionKey);
      output.textContent = "Oturum kapatıldı.";
    });

    if (sessionStorage.getItem(adminSessionKey)) {
      login.classList.add("hidden");
      panel.classList.remove("hidden");
      loadBookings().catch(() => {
        sessionStorage.removeItem(adminSessionKey);
        panel.classList.add("hidden");
        login.classList.remove("hidden");
        output.textContent = "Oturum süresi doldu. Lütfen yeniden giriş yapın.";
      });
    }
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
      if (!document.querySelector("#adminApp")) recordAnalyticsEvent("page_view");
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
      if (button.dataset.consent === "accepted") {
        loadMarketingTags();
        if (!document.querySelector("#adminApp")) recordAnalyticsEvent("page_view");
      }
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

  document.addEventListener("DOMContentLoaded", () => {
    // Never hold the booking form or route cards hostage to a slow Worker API.
    // The bundled catalog is a complete, immediately usable fallback on mobile.
    // Admin login must work even when marketing/storage initialization fails.
    initAdmin();
    try { initConsent(); } catch (error) { console.warn("Analytics initialization skipped", error); }
    initGuideBookingCta();
    initBooking();
    initConfirmation();
    initBlogLists();
    initBlogArticle();

    // Refresh prices and destinations only after the live catalog arrives.
    loadLiveCatalog().then(() => {
      const e = els();
      if (!e.form) return;
      const pickup = e.pickup?.value;
      const dropoff = e.dropoff?.value;
      fillSelect(e.pickup, pickup);
      fillSelect(e.dropoff, dropoff);
      renderRoutes();
      update();
    }).catch(() => {
      // Static pricing and the initialized form remain available.
    });
  });

  window.AYTRide = { catalog, calculate, getRouteById, getRouteByPlaces };
}());
