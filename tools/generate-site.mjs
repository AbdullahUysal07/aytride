import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultBlogPosts } from "../server/blog-posts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/public-catalog.json"), "utf8"));
const buildStamp = "20260925-mobile";
const buildDate = "2026-09-24";

const languages = {
  en: {
    homePath: "/",
    label: "EN",
    locale: "en_GB",
    navBook: "Book",
    navRoutes: "Routes",
    navBlog: "Blog",
    navWhatsapp: "WhatsApp",
    eyebrow: "Antalya Airport private transfer",
    h1: "Antalya Airport Private Transfer — Fixed Price, 24/7",
    lead: "Private transfers from Antalya Airport (AYT) to Lara, Belek, Side, Kemer, Alanya and Antalya hotels. Flight tracking, private vehicles and pay-on-arrival options.",
    trust: ["Fixed price", "Flight tracking", "Private vehicle", "24/7 WhatsApp", "Pay on arrival"],
    priceStep: "Step 1",
    bookStep: "Step 2",
    getPrice: "Get price",
    transferRequest: "Transfer request",
    oneWay: "One way",
    returnTrip: "Return",
    pickup: "Pickup",
    destination: "Destination",
    date: "Pickup date",
    time: "Pickup time",
    passengers: "Passengers",
    suitcases: "Suitcases",
    childSeats: "Child seats",
    seePrice: "See fixed price",
    vehicle: "Vehicle",
    flight: "Flight number",
    hotel: "Hotel or address",
    name: "Name",
    phone: "WhatsApp number",
    email: "Email optional",
    notes: "Notes",
    confirm: "Confirm booking",
    copy: "Copy details",
    returnUpsell: "Add return trip and save on the second ride",
    noPayment: "No online payment now. Your driver and exact pickup point are confirmed before the booking is final.",
    routesEyebrow: "Popular airport routes",
    routesTitle: "Fixed private transfer prices from Antalya Airport.",
    routesCopy: "Compare Standard Sedan and VIP Van prices for the routes visitors search before landing in Antalya.",
    articlesTitle: "Guides that answer booking questions before guests arrive.",
    viewBlog: "View blog",
    faqTitle: "Questions Antalya visitors ask before choosing a transfer.",
    footer: "Private Antalya transfers by WhatsApp. Pay on arrival after your ride.",
    routeGuide: "Route guide",
    selectRoute: "Select route",
    perVehicle: "Fixed total price per vehicle",
    paymentTitle: "Pay on arrival",
    confirmationTitle: "Booking request received",
    confirmationLead: "Your request was saved and WhatsApp was opened with the booking details. AYT Ride confirms the exact meeting point and final status before pickup.",
    confirmationRoute: "Route",
    confirmationVehicle: "Vehicle",
    confirmationPrice: "Price",
    homeTitle: "AYT Ride - Antalya Airport Private Transfer",
    homeDescription: "Book fixed-price private Antalya Airport transfers to Lara, Belek, Side, Kemer, Alanya and Antalya hotels. WhatsApp confirmation and pay on arrival."
  },
  de: {
    homePath: "/de/",
    label: "DE",
    locale: "de_DE",
    navBook: "Buchen",
    navRoutes: "Routen",
    navBlog: "Blog",
    navWhatsapp: "WhatsApp",
    eyebrow: "Privater Antalya Flughafentransfer",
    h1: "Antalya Flughafentransfer — Festpreis, 24/7",
    lead: "Private Transfers vom Flughafen Antalya (AYT) nach Lara, Belek, Side, Kemer, Alanya und zu Hotels in Antalya. Flugverfolgung, private Fahrzeuge und Zahlung bei Ankunft.",
    trust: ["Festpreis", "Flugverfolgung", "Privates Fahrzeug", "24/7 WhatsApp", "Zahlung bei Ankunft"],
    priceStep: "Schritt 1",
    bookStep: "Schritt 2",
    getPrice: "Preis ansehen",
    transferRequest: "Transferanfrage",
    oneWay: "Einfach",
    returnTrip: "Hin & zurück",
    pickup: "Abholung",
    destination: "Ziel",
    date: "Abholdatum",
    time: "Abholzeit",
    passengers: "Personen",
    suitcases: "Koffer",
    childSeats: "Kindersitze",
    seePrice: "Festpreis anzeigen",
    vehicle: "Fahrzeug",
    flight: "Flugnummer",
    hotel: "Hotel oder Adresse",
    name: "Name",
    phone: "WhatsApp Nummer",
    email: "E-Mail optional",
    notes: "Notizen",
    confirm: "Buchung bestätigen",
    copy: "Details kopieren",
    returnUpsell: "Rückfahrt hinzufügen und bei der zweiten Fahrt sparen",
    noPayment: "Keine Online-Zahlung. Fahrer und Treffpunkt werden vor der finalen Buchung bestätigt.",
    routesEyebrow: "Beliebte Flughafenrouten",
    routesTitle: "Feste Transferpreise ab Flughafen Antalya.",
    routesCopy: "Vergleichen Sie Sedan- und VIP-Van-Preise für die wichtigsten Antalya-Routen.",
    articlesTitle: "Hilfreiche Antalya Transfer-Ratgeber.",
    viewBlog: "Blog ansehen",
    faqTitle: "Fragen vor der Antalya Transferbuchung.",
    footer: "Private Antalya Transfers per WhatsApp. Zahlung bei Ankunft nach der Fahrt.",
    routeGuide: "Routeninfos",
    selectRoute: "Route wählen",
    perVehicle: "Fester Gesamtpreis pro Fahrzeug",
    paymentTitle: "Zahlung bei Ankunft",
    confirmationTitle: "Buchungsanfrage erhalten",
    confirmationLead: "Ihre Anfrage wurde gespeichert und WhatsApp mit den Buchungsdetails geöffnet. AYT Ride bestätigt Treffpunkt und finalen Status vor der Abholung.",
    confirmationRoute: "Route",
    confirmationVehicle: "Fahrzeug",
    confirmationPrice: "Preis",
    homeTitle: "AYT Ride - Antalya Flughafentransfer",
    homeDescription: "Privater Festpreis-Transfer vom Flughafen Antalya nach Lara, Belek, Side, Kemer, Alanya und zu Hotels. WhatsApp-Bestätigung und Zahlung bei Ankunft."
  },
  pl: {
    homePath: "/pl/",
    label: "PL",
    locale: "pl_PL",
    navBook: "Rezerwuj",
    navRoutes: "Trasy",
    navBlog: "Blog",
    navWhatsapp: "WhatsApp",
    eyebrow: "Prywatny transfer z lotniska Antalya",
    h1: "Transfer z lotniska Antalya — stała cena, 24/7",
    lead: "Prywatne transfery z lotniska Antalya (AYT) do Lara, Belek, Side, Kemer, Alanya i hoteli w Antalyi. Monitoring lotu, prywatne pojazdy i płatność po przyjeździe.",
    trust: ["Stała cena", "Monitoring lotu", "Prywatny pojazd", "WhatsApp 24/7", "Płatność po przyjeździe"],
    priceStep: "Krok 1",
    bookStep: "Krok 2",
    getPrice: "Sprawdź cenę",
    transferRequest: "Zapytanie o transfer",
    oneWay: "W jedną stronę",
    returnTrip: "Powrót",
    pickup: "Odbiór",
    destination: "Cel",
    date: "Data odbioru",
    time: "Godzina odbioru",
    passengers: "Pasażerowie",
    suitcases: "Walizki",
    childSeats: "Foteliki",
    seePrice: "Pokaż stałą cenę",
    vehicle: "Pojazd",
    flight: "Numer lotu",
    hotel: "Hotel lub adres",
    name: "Imię",
    phone: "Numer WhatsApp",
    email: "E-mail opcjonalnie",
    notes: "Notatki",
    confirm: "Potwierdź rezerwację",
    copy: "Kopiuj szczegóły",
    returnUpsell: "Dodaj powrót i oszczędź na drugim przejeździe",
    noPayment: "Brak płatności online. Kierowca i miejsce spotkania są potwierdzane przed finalną rezerwacją.",
    routesEyebrow: "Popularne trasy",
    routesTitle: "Stałe ceny transferów z lotniska Antalya.",
    routesCopy: "Porównaj ceny Sedan i VIP Van dla najczęściej wybieranych tras.",
    articlesTitle: "Poradniki, które pomagają przed przylotem.",
    viewBlog: "Zobacz blog",
    faqTitle: "Pytania przed wyborem transferu w Antalyi.",
    footer: "Prywatne transfery w Antalyi przez WhatsApp. Płatność po przyjeździe.",
    routeGuide: "Opis trasy",
    selectRoute: "Wybierz trasę",
    perVehicle: "Stała cena za cały pojazd",
    paymentTitle: "Płatność po przyjeździe",
    confirmationTitle: "Zapytanie otrzymane",
    confirmationLead: "Zapytanie zapisano i otwarto WhatsApp ze szczegółami. AYT Ride potwierdza miejsce spotkania i status przed odbiorem.",
    confirmationRoute: "Trasa",
    confirmationVehicle: "Pojazd",
    confirmationPrice: "Cena",
    homeTitle: "AYT Ride - Transfer z lotniska Antalya",
    homeDescription: "Prywatny transfer z lotniska Antalya do Lara, Belek, Side, Kemer, Alanya i hoteli. Stała cena, WhatsApp i płatność po przyjeździe."
  },
  ru: {
    homePath: "/ru/",
    label: "RU",
    locale: "ru_RU",
    navBook: "Бронь",
    navRoutes: "Маршруты",
    navBlog: "Блог",
    navWhatsapp: "WhatsApp",
    eyebrow: "Частный трансфер из аэропорта Анталья",
    h1: "Трансфер из аэропорта Анталья — фиксированная цена, 24/7",
    lead: "Частные трансферы из аэропорта Анталья (AYT) в Лару, Белек, Сиде, Кемер, Аланью и отели Антальи. Отслеживание рейса, частные автомобили и оплата после поездки.",
    trust: ["Фиксированная цена", "Отслеживание рейса", "Частный автомобиль", "WhatsApp 24/7", "Оплата после поездки"],
    priceStep: "Шаг 1",
    bookStep: "Шаг 2",
    getPrice: "Узнать цену",
    transferRequest: "Заявка на трансфер",
    oneWay: "В одну сторону",
    returnTrip: "Обратно",
    pickup: "Откуда",
    destination: "Куда",
    date: "Дата встречи",
    time: "Время",
    passengers: "Пассажиры",
    suitcases: "Чемоданы",
    childSeats: "Детские кресла",
    seePrice: "Показать цену",
    vehicle: "Автомобиль",
    flight: "Номер рейса",
    hotel: "Отель или адрес",
    name: "Имя",
    phone: "WhatsApp номер",
    email: "E-mail опционально",
    notes: "Примечания",
    confirm: "Подтвердить заявку",
    copy: "Копировать детали",
    returnUpsell: "Добавить обратный трансфер и сэкономить",
    noPayment: "Онлайн-оплаты нет. Водитель и точка встречи подтверждаются до финальной брони.",
    routesEyebrow: "Популярные маршруты",
    routesTitle: "Фиксированные цены из аэропорта Анталья.",
    routesCopy: "Сравните цены Sedan и VIP Van для популярных маршрутов.",
    articlesTitle: "Гиды по трансферам перед прилетом.",
    viewBlog: "Смотреть блог",
    faqTitle: "Вопросы перед выбором трансфера.",
    footer: "Частные трансферы в Анталье через WhatsApp. Оплата после поездки.",
    routeGuide: "Описание маршрута",
    selectRoute: "Выбрать маршрут",
    perVehicle: "Фиксированная цена за автомобиль",
    paymentTitle: "Оплата после поездки",
    confirmationTitle: "Заявка получена",
    confirmationLead: "Заявка сохранена, WhatsApp открыт с деталями. AYT Ride подтверждает место встречи и финальный статус до поездки.",
    confirmationRoute: "Маршрут",
    confirmationVehicle: "Автомобиль",
    confirmationPrice: "Цена",
    homeTitle: "AYT Ride - Трансфер из аэропорта Анталья",
    homeDescription: "Частный трансфер из аэропорта Анталья в Лару, Белек, Сиде, Кемер, Аланью и отели. Фиксированная цена, WhatsApp и оплата после поездки."
  },
  nl: {
    homePath: "/nl/",
    label: "NL",
    locale: "nl_NL",
    navBook: "Boeken",
    navRoutes: "Routes",
    navBlog: "Blog",
    navWhatsapp: "WhatsApp",
    eyebrow: "Prive transfer vanaf Antalya Airport",
    h1: "Antalya luchthaven transfer — vaste prijs, 24/7",
    lead: "Prive transfers vanaf Antalya Airport (AYT) naar Lara, Belek, Side, Kemer, Alanya en hotels in Antalya. Vluchttracking, prive voertuigen en betalen bij aankomst.",
    trust: ["Vaste prijs", "Vluchttracking", "Prive voertuig", "24/7 WhatsApp", "Betalen bij aankomst"],
    priceStep: "Stap 1",
    bookStep: "Stap 2",
    getPrice: "Bekijk prijs",
    transferRequest: "Transferaanvraag",
    oneWay: "Enkele reis",
    returnTrip: "Retour",
    pickup: "Ophaalpunt",
    destination: "Bestemming",
    date: "Ophaaldatum",
    time: "Ophaaltijd",
    passengers: "Passagiers",
    suitcases: "Koffers",
    childSeats: "Kinderzitjes",
    seePrice: "Toon vaste prijs",
    vehicle: "Voertuig",
    flight: "Vluchtnummer",
    hotel: "Hotel of adres",
    name: "Naam",
    phone: "WhatsApp nummer",
    email: "E-mail optioneel",
    notes: "Notities",
    confirm: "Boeking bevestigen",
    copy: "Details kopieren",
    returnUpsell: "Voeg retour toe en bespaar op de tweede rit",
    noPayment: "Geen online betaling. Chauffeur en ontmoetingspunt worden voor de definitieve boeking bevestigd.",
    routesEyebrow: "Populaire routes",
    routesTitle: "Vaste transferprijzen vanaf Antalya Airport.",
    routesCopy: "Vergelijk Sedan- en VIP Van-prijzen voor populaire routes.",
    articlesTitle: "Gidsen voor aankomst in Antalya.",
    viewBlog: "Bekijk blog",
    faqTitle: "Vragen voordat bezoekers een transfer kiezen.",
    footer: "Prive Antalya transfers via WhatsApp. Betalen na de rit.",
    routeGuide: "Routegids",
    selectRoute: "Selecteer route",
    perVehicle: "Vaste totaalprijs per voertuig",
    paymentTitle: "Betalen bij aankomst",
    confirmationTitle: "Boekingsaanvraag ontvangen",
    confirmationLead: "Uw aanvraag is opgeslagen en WhatsApp is geopend met de details. AYT Ride bevestigt het ontmoetingspunt en de status voor vertrek.",
    confirmationRoute: "Route",
    confirmationVehicle: "Voertuig",
    confirmationPrice: "Prijs",
    homeTitle: "AYT Ride - Antalya luchthaven transfer",
    homeDescription: "Prive transfer vanaf Antalya Airport naar Lara, Belek, Side, Kemer, Alanya en hotels. Vaste prijs, WhatsApp en betalen bij aankomst."
  }
};

const routeLanguages = ["en", "de", "pl", "ru"];
const commercialRoutes = catalog.routes.filter((route) => route.slugs?.en);
const visibleRoutes = catalog.routes.filter((route) => route.available && !route.quoteOnly);

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.trimStart(), "utf8");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  return `€${Number(value).toFixed(0)}`;
}

function heroTitleMarkup(title) {
  const [main, sub] = String(title).split("—").map((part) => part.trim());
  if (!sub) return escapeHtml(title);
  return `<span class="hero-title-main">${escapeHtml(main)}</span><span class="hero-title-sub">${escapeHtml(sub)}</span>`;
}

function routePath(route, language) {
  const slug = route.slugs?.[language];
  if (!slug) return null;
  return language === "en" ? `/${slug}/` : `/${language}/${slug}/`;
}

function altHomeTags(currentLang) {
  return Object.entries(languages).map(([code, item]) => {
    const regional = code === "en" ? "en-GB" : `${code}-${code.toUpperCase()}`;
    return `<link rel="alternate" hreflang="${code}" href="${catalog.baseUrl}${item.homePath}">
  <link rel="alternate" hreflang="${regional}" href="${catalog.baseUrl}${item.homePath}">`;
  }).join("\n  ") + `\n  <link rel="alternate" hreflang="x-default" href="${catalog.baseUrl}/">`;
}

function altRouteTags(route) {
  return routeLanguages.map((code) => {
    const regional = code === "en" ? "en-GB" : `${code}-${code.toUpperCase()}`;
    const href = `${catalog.baseUrl}${routePath(route, code)}`;
    return `<link rel="alternate" hreflang="${code}" href="${href}">
  <link rel="alternate" hreflang="${regional}" href="${href}">`;
  }).join("\n  ") + `\n  <link rel="alternate" hreflang="x-default" href="${catalog.baseUrl}${routePath(route, "en")}">`;
}

function favicon() {
  return "/favicon.svg";
}

function confidenceBand(language) {
  const content = {
    en: { kicker: "Book with confidence", title: "Clear transfer details before your driver is confirmed.", items: ["WhatsApp confirmation", "Fixed vehicle price", "Pay on arrival"] },
    de: { kicker: "Mit Vertrauen buchen", title: "Klare Transferdetails vor der Fahrerbestätigung.", items: ["WhatsApp-Bestätigung", "Fester Fahrzeugpreis", "Zahlung bei Ankunft"] },
    pl: { kicker: "Rezerwuj bez obaw", title: "Jasne szczegóły transferu przed potwierdzeniem kierowcy.", items: ["Potwierdzenie WhatsApp", "Stała cena za pojazd", "Płatność po przyjeździe"] },
    ru: { kicker: "Бронируйте уверенно", title: "Понятные детали трансфера до подтверждения водителя.", items: ["Подтверждение в WhatsApp", "Фиксированная цена за автомобиль", "Оплата по прибытии"] },
    nl: { kicker: "Boek met vertrouwen", title: "Duidelijke transferdetails voordat de chauffeur is bevestigd.", items: ["WhatsApp-bevestiging", "Vaste voertuigprijs", "Betalen bij aankomst"] }
  };
  const item = content[language] || content.en;
  return `<section class="guest-confidence" aria-label="${escapeHtml(item.kicker)}">
      <div class="shell confidence-grid">
        <div class="confidence-stars" aria-label="Five star service"><span class="star-row" aria-hidden="true">★★★★★</span><small>+8,500 users</small></div>
        <div><p class="mini-label">${escapeHtml(item.kicker)}</p><h2>${escapeHtml(item.title)}</h2></div>
        <ul class="confidence-list">${item.items.map((label) => `<li>${escapeHtml(label)}</li>`).join("")}</ul>
      </div>
    </section>`;
}

function destinationAreas(route, language) {
  const areas = {
    lara: ["Lara", "Kundu", "Lara Beach", "Aksu hotel zone"],
    belek: ["Belek", "Kadriye", "The Land of Legends area", "Belek golf resorts"],
    kemer: ["Beldibi", "Göynük", "Kemer centre", "Kiriş", "Çamyuva", "Tekirova"],
    side: ["Side", "Evrenseki", "Kumköy", "Çolaklı", "Manavgat", "Titreyengöl"],
    alanya: ["Okurcalar", "Avsallar", "Türkler", "Konaklı", "Alanya centre", "Mahmutlar"]
  };
  const copy = {
    en: { title: "Popular hotel and resort areas", text: "Choose the exact hotel or accommodation in the booking form so the pickup and route can be confirmed accurately." },
    de: { title: "Beliebte Hotel- und Urlaubsgebiete", text: "Geben Sie im Buchungsformular das genaue Hotel oder die Unterkunft an, damit Abholung und Route korrekt bestätigt werden können." },
    pl: { title: "Popularne hotele i regiony wypoczynkowe", text: "Podaj w formularzu dokładny hotel lub miejsce zakwaterowania, aby potwierdzić odbiór i trasę." },
    ru: { title: "Популярные отельные и курортные районы", text: "Укажите в форме точный отель или адрес проживания, чтобы правильно подтвердить маршрут и встречу." }
  };
  const item = copy[language] || copy.en;
  return `<h2>${item.title}</h2><p>${item.text}</p><div class="area-links">${(areas[route.id] || []).map((area) => `<span>${escapeHtml(area)}</span>`).join("")}</div>`;
}

function routeVisual(route) {
  if (!route.image) return "";
  const alt = route.imageAlt || `${route.destination} private transfer route`;
  return `<figure class="route-visual-card">
            <img src="${escapeHtml(route.image)}" alt="${escapeHtml(alt)}" loading="eager" fetchpriority="high">
            <figcaption>
              <span>${escapeHtml(route.origin)}</span>
              <strong>${escapeHtml(route.destination)}</strong>
              <small>${route.distanceKm} km / ${route.durationMin} min</small>
            </figcaption>
          </figure>`;
}

function header(language) {
  const l = languages[language];
  return `
  <header class="topbar">
    <div class="shell nav">
      <a class="brand" href="${l.homePath}" aria-label="AYT Ride home">
        <span class="brand-mark" aria-hidden="true">AYT</span>
        <span>
          <strong>AYT Ride</strong>
          <small>${catalog.business.tagline}</small>
        </span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="${l.homePath}#booking">${l.navBook}</a>
        <a href="${language === "de" ? "/de/ratgeber/" : "/blog/"}">${language === "de" ? "Ratgeber" : l.navBlog}</a>
        <a href="${l.homePath}#routes">${l.navRoutes}</a>
        <span class="language-switch" aria-label="Language options">
          ${Object.entries(languages).map(([code, item]) => `<a class="${code === language ? "active" : ""}" href="${item.homePath}" aria-label="${code.toUpperCase()}">${item.label}</a>`).join("")}
        </span>
        <a class="nav-cta" id="topWhatsapp" target="_blank" rel="noopener">${l.navWhatsapp}</a>
      </nav>
    </div>
  </header>`;
}

function footer(language) {
  const l = languages[language];
  return `
  <footer class="footer">
    <div class="shell footer-grid">
      <div>
        <strong>AYT Ride</strong>
        <p>${l.footer}</p>
      </div>
      <div>
        <a href="mailto:${catalog.business.bookingEmail}">${catalog.business.bookingEmail}</a>
        <a href="https://wa.me/${catalog.business.whatsapp}" target="_blank" rel="noopener">WhatsApp ${catalog.business.displayWhatsapp}</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy/">Privacy</a>
        <a href="/terms/">Terms</a>
      </div>
    </div>
  </footer>`;
}

function counter(id, label, value) {
  return `
    <div class="counter">
      <span>${label}</span>
      <div>
        <button type="button" data-counter="${id}" data-delta="-1" aria-label="Decrease ${id}">-</button>
        <b id="${id}Value">${value}</b>
        <button type="button" data-counter="${id}" data-delta="1" aria-label="Increase ${id}">+</button>
      </div>
    </div>`;
}

function bookingForm(language, routeId = "") {
  const l = languages[language];
  const route = catalog.routes.find((item) => item.id === routeId);
  const places = [...new Set(catalog.routes.flatMap((item) => [item.origin, item.destination]))];
  const options = (selected) => places.map((place) => `<option value="${escapeHtml(place)}"${place === selected ? " selected" : ""}>${escapeHtml(place)}</option>`).join("");
  return `
    <section class="booking-card" id="booking" aria-labelledby="bookingTitle">
      <div class="booking-card-head">
        <div>
          <p class="mini-label">${l.getPrice}</p>
          <h2 id="bookingTitle">${l.transferRequest}</h2>
        </div>
        <span class="live-pill" id="capacityStatus">Vehicle fits</span>
      </div>

      <form id="bookingForm" novalidate data-prefill-route="${routeId}">
        <div class="booking-step" id="quoteStep">
          <span class="step-badge">${l.priceStep}</span>
          <div class="segment-control" role="group" aria-label="Trip type">
            <button type="button" class="segment active" data-trip="oneway" aria-pressed="true">${l.oneWay}</button>
            <button type="button" class="segment" data-trip="return" aria-pressed="false">${l.returnTrip}</button>
          </div>
          <div class="route-fields">
            <label>
              <span>${l.pickup}</span>
              <select id="pickup" name="pickup" required>${options(route?.origin || "Antalya Airport (AYT)")}</select>
            </label>
            <button class="swap-btn" type="button" id="swapRoute" aria-label="Swap pickup and destination" title="Swap route">↔</button>
            <label>
              <span>${l.destination}</span>
              <select id="dropoff" name="dropoff" required>${options(route?.destination || "Lara / Kundu")}</select>
            </label>
          </div>
          <div class="custom-route hidden" id="customRouteFields">
            <label>
              <span>${l.pickup}</span>
              <input id="pickupDetail" name="pickup_detail" placeholder="Hotel, villa or address">
            </label>
            <label>
              <span>${l.destination}</span>
              <input id="dropoffDetail" name="dropoff_detail" placeholder="Hotel, villa or address">
            </label>
          </div>
          <div class="form-grid two">
            <label>
              <span>${l.date}</span>
              <input id="pickupDate" name="pickup_date" type="date" required>
            </label>
            <label>
              <span>${l.passengers}</span>
              <div class="counter compact-counter">
                <div>
                  <button type="button" data-counter="passengers" data-delta="-1" aria-label="Decrease passengers">-</button>
                  <b id="passengersValue">2</b>
                  <button type="button" data-counter="passengers" data-delta="1" aria-label="Increase passengers">+</button>
                </div>
              </div>
            </label>
          </div>
          <button class="primary-btn price-btn" type="button" id="seeFixedPrice">
            <span>${l.seePrice}</span>
            <strong id="quoteTotalPreview">→</strong>
          </button>
        </div>

        <div class="quote-panel hidden" id="quotePanel" aria-live="polite">
          <span>${l.perVehicle}</span>
          <strong id="quoteTotal">€30 TOTAL</strong>
          <small id="quoteMeta">Standard Sedan / per vehicle</small>
          <button class="upsell-btn hidden" type="button" id="returnUpsell">${l.returnUpsell}</button>
        </div>

        <div class="booking-step hidden" id="bookStep">
          <span class="step-badge">${l.bookStep}</span>
          <div class="vehicle-grid" id="vehicleGrid" aria-label="${l.vehicle}"></div>
          <div class="form-grid three">
            <label>
              <span>${l.time}</span>
              <input id="pickupTime" name="pickup_time" type="time" required>
            </label>
            <label>
              <span>${l.flight}</span>
              <input id="flightNumber" name="flight_number" placeholder="TK2420">
            </label>
            <label>
              <span>${l.hotel}</span>
              <input id="hotelAddress" name="hotel_address" placeholder="Hotel, villa or address">
            </label>
          </div>
          <div class="form-grid two hidden" id="returnFields">
            <label>
              <span>${l.returnTrip} date</span>
              <input id="returnDate" name="return_date" type="date">
            </label>
            <label>
              <span>${l.returnTrip} time</span>
              <input id="returnTime" name="return_time" type="time">
            </label>
          </div>
          <div class="counter-row" aria-label="Passenger details">
            ${counter("luggage", l.suitcases, 2)}
            ${counter("childSeats", l.childSeats, 0)}
          </div>
          <div class="form-grid two">
            <label>
              <span>${l.name}</span>
              <input id="guestName" name="name" autocomplete="name" placeholder="${l.name}" required>
            </label>
            <label>
              <span>${l.phone}</span>
              <input id="guestPhone" name="phone" autocomplete="tel" placeholder="+49 170 0000000" required>
            </label>
          </div>
          <label>
            <span>${l.email}</span>
            <input id="guestEmail" name="email" autocomplete="email" type="email" placeholder="you@example.com">
          </label>
          <label>
            <span>${l.notes}</span>
            <textarea id="notes" name="notes" placeholder="Baby seat, golf bags, hotel block, pickup sign name..."></textarea>
          </label>
          <div class="quote-box">
            <div>
              <span>${l.perVehicle}</span>
              <strong id="quoteNote">Fixed total price per vehicle</strong>
              <small>${l.noPayment}</small>
            </div>
            <div>
              <span>${l.paymentTitle}</span>
              <strong>Cash</strong>
              <small>${l.noPayment}</small>
            </div>
          </div>
          <div class="actions">
            <button class="primary-btn reserve-btn" type="submit" id="confirmBooking">
              <span class="reserve-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M7 5h10a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3H8.4l-4 2.5v-13A3 3 0 0 1 7 5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8 12 2.3 2.3L16.5 9" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              <span class="reserve-copy">
                <strong>${l.confirm}</strong>
                <small>WhatsApp + booking record</small>
              </span>
              <span class="reserve-arrow" aria-hidden="true">→</span>
            </button>
            <button class="secondary-btn" type="button" id="copyRequest">${l.copy}</button>
          </div>
          <p class="form-note">${l.noPayment}</p>
          <p class="booking-status" id="bookingStatus" role="status"></p>
        </div>
      </form>
    </section>`;
}

function homeSchema(language) {
  const l = languages[language];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${catalog.baseUrl}/#website`,
        name: "AYT Ride",
        url: catalog.baseUrl,
        inLanguage: Object.keys(languages)
      },
      {
        "@type": "Service",
        "@id": `${catalog.baseUrl}/#service`,
        name: language === "de" ? "Antalya Flughafentransfer" : "Antalya Airport private transfer",
        url: `${catalog.baseUrl}${l.homePath}`,
        serviceType: "Private airport transfer",
        areaServed: ["Antalya Airport", "Lara", "Belek", "Side", "Kemer", "Alanya"],
        provider: {
          "@type": "Organization",
          name: "AYT Ride",
          url: catalog.baseUrl,
          email: catalog.business.bookingEmail,
          telephone: `+${catalog.business.whatsapp}`
        },
        offers: visibleRoutes.slice(0, 5).map((route) => ({
          "@type": "Offer",
          name: `${route.origin} to ${route.destination}`,
          priceCurrency: catalog.currency,
          price: route.prices["standard-sedan"],
          availability: "https://schema.org/InStock"
        }))
      }
    ]
  }, null, 2);
}

function homePage(language) {
  const l = languages[language];
  const canonical = `${catalog.baseUrl}${l.homePath}`;
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(l.homeTitle)}</title>
  <meta name="description" content="${escapeHtml(l.homeDescription)}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${escapeHtml(l.homeTitle)}">
  <meta property="og:description" content="${escapeHtml(l.homeDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${l.locale}">
  <meta property="og:image" content="${catalog.baseUrl}/assets/ayt-ride-transfer.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${canonical}">
  ${altHomeTags(language)}
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
  <script type="application/ld+json">${homeSchema(language)}</script>
</head>
<body class="home-page">
${header(language)}
  <main>
    <section class="hero">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${l.eyebrow}</p>
          <h1 class="hero-title">${heroTitleMarkup(l.h1)}</h1>
          <p class="lead">${l.lead}</p>
          <div class="trust-strip" aria-label="Service highlights">
            ${l.trust.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <div class="hero-proof" aria-label="Why guests choose AYT Ride">
            <article><span>€</span><strong>${l.trust[0]}</strong><small>${l.perVehicle}</small></article>
            <article><span>24/7</span><strong>${l.trust[3]}</strong><small>Fast confirmation before pickup</small></article>
            <article><span>PAY</span><strong>${l.paymentTitle}</strong><small>No online checkout</small></article>
          </div>
        </div>
        ${bookingForm(language)}
      </div>
    </section>

    <section class="routes-section" id="routes">
      <div class="shell">
        <div class="section-head route-head">
          <div>
            <p class="mini-label">${l.routesEyebrow}</p>
            <h2>${l.routesTitle}</h2>
          </div>
          <p class="section-copy">${l.routesCopy}</p>
        </div>
        <div class="route-toolbar">
          <span>Antalya Airport (AYT)</span>
          <span>Standard Sedan + VIP Van</span>
          <span>${l.perVehicle}</span>
        </div>
        <div class="route-grid" id="routeGrid">${staticRouteCards(language)}</div>
      </div>
    </section>

    <section class="visual-band">
      <div class="shell image-grid">
        <picture class="hero-image">
          <source srcset="/assets/ayt-ride-transfer.webp" type="image/webp">
          <img src="/assets/ayt-ride-transfer.jpg" alt="Private van waiting near Antalya coast and airport route">
        </picture>
        <div class="promise-grid">
          <article><span class="icon-dot">WA</span><h3>WhatsApp first</h3><p>Every request opens a structured WhatsApp message so the transfer team sees route, flight, vehicle and guest details immediately.</p></article>
          <article><span class="icon-dot">FLT</span><h3>Flight-aware pickup</h3><p>Flight number and arrival time are sent with the request before the pickup plan is confirmed.</p></article>
          <article><span class="icon-dot">PAY</span><h3>Clear pay-on-arrival</h3><p>No online card form is needed for the first version. Guests complete the ride first, then pay the driver.</p></article>
          <article><span class="icon-dot">€</span><h3>Route-based prices</h3><p>Covered routes show the total vehicle price before the booking step.</p></article>
        </div>
      </div>
    </section>
    ${confidenceBand(language)}

    <section class="blog-preview">
      <div class="shell">
        <div class="section-head compact">
          <div><p class="mini-label">Travel guides</p><h2>${l.articlesTitle}</h2></div>
          <a class="section-link" href="/blog/">${l.viewBlog}</a>
        </div>
        <div class="post-grid" id="homeBlogPreview">
          ${defaultBlogPosts.slice(0, 3).map((post) => blogCard(post)).join("")}
        </div>
      </div>
    </section>
  </main>
${footer(language)}
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function staticRouteCards(language) {
  return catalog.routes.filter((route) => route.available && !route.quoteOnly).slice(0, 6).map((route) => {
    const sedan = route.prices["standard-sedan"];
    const vip = route.prices["vip-van"];
    const slug = route.slugs?.[language] || route.slugs?.en;
    const guide = slug ? (language === "en" ? `/${slug}/` : `/${language}/${slug}/`) : "";
    return `<article class="route-card">
      <button type="button" data-route="${route.id}" aria-label="Select ${escapeHtml(route.destination)}">
        <span class="route-thumb"><img src="${escapeHtml(route.image || "/assets/ayt-ride-transfer.jpg")}" alt="${escapeHtml(route.imageAlt || route.destination)}" loading="lazy"></span>
        <span class="route-card-top"><span class="route-code">AYT</span><span class="route-price">From €${sedan}</span></span>
        <strong>${escapeHtml(route.destination)}</strong>
        <span class="route-fares"><span><small>Standard Sedan</small><b>€${sedan}</b></span><span><small>VIP Van</small><b>€${vip}</b></span></span>
        <span class="route-stats"><small>${route.distanceKm} km</small><small>${route.durationMin} min</small></span>
        <span class="route-card-action">${escapeHtml(languages[language].selectRoute)}</span>
      </button>
      ${guide ? `<a href="${guide}">${escapeHtml(languages[language].routeGuide)}</a>` : ""}
    </article>`;
  }).join("");
}

function routeSchema(route, language) {
  const page = route.content[language];
  const url = `${catalog.baseUrl}${routePath(route, language)}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AYT Ride", item: catalog.baseUrl },
          { "@type": "ListItem", position: 2, name: page.h1, item: url }
        ]
      },
      {
        "@type": "Service",
        name: page.h1,
        url,
        serviceType: "Private airport transfer",
        provider: {
          "@type": "Organization",
          name: "AYT Ride",
          url: catalog.baseUrl,
          email: catalog.business.bookingEmail,
          telephone: `+${catalog.business.whatsapp}`
        },
        areaServed: [route.origin, route.destination],
        offers: Object.entries(route.prices).map(([vehicleId, price]) => ({
          "@type": "Offer",
          name: `${catalog.vehicles.find((item) => item.id === vehicleId)?.name || vehicleId} ${route.destination}`,
          priceCurrency: catalog.currency,
          price,
          availability: "https://schema.org/InStock"
        }))
      }
    ]
  }, null, 2);
}

function adjacentRoutes(route, language) {
  return commercialRoutes
    .filter((item) => item.id !== route.id)
    .slice(0, 4)
    .map((item) => `<a href="${routePath(item, language)}">${escapeHtml(item.content[language].h1)}</a>`)
    .join("");
}

function routeArticleCopy(language) {
  const content = {
    en: {
      pickupH: "Airport pickup and meeting point",
      pickupP: "After the request is sent, AYT Ride confirms the exact meeting point by WhatsApp. Add the flight number so the pickup can be planned around the arrival time.",
      localH: "Route-specific notes",
      capacityH: "Vehicle and luggage capacity",
      capacityP: "Standard Sedan fits up to 3 passengers and 3 suitcases. VIP Van fits up to 6 passengers and 6 suitcases, and is the better option for golf bags or larger families.",
      paymentH: "Child seats, return trips and payment",
      paymentP: "Child seats can be requested in the booking form. Return transfers can be added before booking. Payment is made after the ride unless another arrangement is confirmed.",
      changesH: "Changes and cancellation",
      changesP: "Send changes by WhatsApp as early as possible. AYT Ride confirms whether the vehicle and pickup time can be adjusted.",
      faqH: "FAQ",
      nearbyH: "Nearby useful routes"
    },
    de: {
      pickupH: "Abholung am Flughafen und Treffpunkt",
      pickupP: "Nach dem Absenden der Anfrage bestätigt AYT Ride den genauen Treffpunkt per WhatsApp. Die Flugnummer hilft, die Abholung zur Ankunftszeit zu planen.",
      localH: "Hinweise zur Route",
      capacityH: "Fahrzeug und Gepäck",
      capacityP: "Standard Sedan passt für bis zu 3 Personen und 3 Koffer. VIP Van passt für bis zu 6 Personen und 6 Koffer und ist besser für Golfgepäck oder Familien.",
      paymentH: "Kindersitze, Rückfahrt und Zahlung",
      paymentP: "Kindersitze können im Formular angefragt werden. Rückfahrten lassen sich vor der Buchung hinzufügen. Die Zahlung erfolgt nach der Fahrt, sofern nichts anderes bestätigt wurde.",
      changesH: "Änderungen und Stornierung",
      changesP: "Senden Sie Änderungen möglichst früh per WhatsApp. AYT Ride bestätigt, ob Fahrzeug und Abholzeit angepasst werden können.",
      faqH: "FAQ",
      nearbyH: "Weitere passende Routen"
    },
    pl: {
      pickupH: "Odbiór z lotniska i miejsce spotkania",
      pickupP: "Po wysłaniu zapytania AYT Ride potwierdza dokładne miejsce spotkania przez WhatsApp. Numer lotu pomaga zaplanować odbiór po przylocie.",
      localH: "Informacje o trasie",
      capacityH: "Pojazd i bagaż",
      capacityP: "Standard Sedan mieści do 3 pasażerów i 3 walizek. VIP Van mieści do 6 pasażerów i 6 walizek, dlatego lepiej pasuje dla rodzin, grup i bagażu golfowego.",
      paymentH: "Foteliki, transfer powrotny i płatność",
      paymentP: "Foteliki można zaznaczyć w formularzu. Transfer powrotny można dodać przed rezerwacją. Płatność odbywa się po przejeździe, chyba że ustalono inaczej.",
      changesH: "Zmiany i anulowanie",
      changesP: "Zmiany wyślij przez WhatsApp jak najwcześniej. AYT Ride potwierdzi, czy pojazd i godzina odbioru mogą zostać zmienione.",
      faqH: "FAQ",
      nearbyH: "Podobne trasy"
    },
    ru: {
      pickupH: "Встреча в аэропорту и точка посадки",
      pickupP: "После отправки заявки AYT Ride подтверждает точное место встречи в WhatsApp. Номер рейса помогает спланировать встречу по времени прилета.",
      localH: "Особенности маршрута",
      capacityH: "Автомобиль и багаж",
      capacityP: "Standard Sedan подходит до 3 пассажиров и 3 чемоданов. VIP Van подходит до 6 пассажиров и 6 чемоданов, а также удобнее для семей, групп и гольф-багажа.",
      paymentH: "Детские кресла, обратный трансфер и оплата",
      paymentP: "Детские кресла можно указать в форме. Обратный трансфер можно добавить до заявки. Оплата производится после поездки, если не подтверждено другое.",
      changesH: "Изменения и отмена",
      changesP: "Отправляйте изменения в WhatsApp как можно раньше. AYT Ride подтвердит, можно ли изменить автомобиль и время встречи.",
      faqH: "FAQ",
      nearbyH: "Другие полезные маршруты"
    }
  };
  return content[language] || content.en;
}

function routePage(route, language) {
  const l = languages[language];
  const page = route.content[language];
  const article = routeArticleCopy(language);
  const url = `${catalog.baseUrl}${routePath(route, language)}`;
  const sedan = route.prices["standard-sedan"];
  const vip = route.prices["vip-van"];
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${l.locale}">
  <meta property="og:image" content="${catalog.baseUrl}${route.image || "/assets/ayt-ride-transfer.jpg"}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${url}">
  ${altRouteTags(route)}
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
  <script type="application/ld+json">${routeSchema(route, language)}</script>
</head>
<body data-route-id="${route.id}">
${header(language)}
  <main>
    <section class="page-hero route-hero">
      <div class="shell route-hero-grid">
        <div class="route-hero-copy">
          <p class="eyebrow">${l.eyebrow}</p>
          <h1>${escapeHtml(page.h1)}</h1>
          <p>${escapeHtml(page.intro)}</p>
          ${routeVisual(route)}
          <div class="route-price-band">
            <span><small>Standard Sedan</small><strong>${money(sedan)} TOTAL</strong></span>
            <span><small>VIP Van</small><strong>${money(vip)} TOTAL</strong></span>
            <span><small>Route</small><strong>${route.distanceKm} km / ${route.durationMin} min</strong></span>
          </div>
        </div>
        ${bookingForm(language, route.id)}
      </div>
    </section>
    <section class="article-wrap">
      <article class="article route-article">
        <h2>${article.pickupH}</h2>
        <p>${article.pickupP}</p>
        <h2>${article.localH}</h2>
        <p>${escapeHtml(page.local)}</p>
        ${destinationAreas(route, language)}
        <h2>${article.capacityH}</h2>
        <p>${article.capacityP}</p>
        <h2>${article.paymentH}</h2>
        <p>${article.paymentP}</p>
        <h2>${article.changesH}</h2>
        <p>${article.changesP}</p>
        <h2>${article.faqH}</h2>
        <div class="faq-grid single">
          ${page.faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}
        </div>
        <h2>${article.nearbyH}</h2>
        <div class="adjacent-links">${adjacentRoutes(route, language)}</div>
      </article>
    </section>
  </main>
${footer(language)}
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function confirmationPage(language = "en") {
  const l = languages[language];
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${l.confirmationTitle} - AYT Ride</title>
  <meta name="description" content="${l.confirmationLead}">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="${catalog.baseUrl}/booking-confirmation/">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
</head>
<body>
${header(language)}
  <main class="page-hero">
    <section class="shell confirmation" id="confirmationPage">
      <div class="confirmation-kicker"><span aria-hidden="true">✓</span><b>Request saved</b></div>
      <p class="eyebrow">AYT Ride</p>
      <h1>${l.confirmationTitle}</h1>
      <p class="confirmation-lead">Your request is with AYT Ride. We confirm vehicle availability, the exact meeting point and final pickup status before your journey.</p>
      <div class="confirmation-grid">
        <article><span>Reference</span><strong data-confirmation-ref>AYT</strong></article>
        <article><span>${l.confirmationRoute}</span><strong data-confirmation-route>-</strong></article>
        <article><span>${l.confirmationVehicle}</span><strong data-confirmation-vehicle>-</strong></article>
        <article><span>${l.confirmationPrice}</span><strong data-confirmation-price>-</strong></article>
      </div>
      <div class="confirmation-actions">
        <a class="primary-btn" data-confirmation-whatsapp target="_blank" rel="noopener">Open WhatsApp</a>
        <a class="secondary-btn" href="/#booking">Make another booking</a>
      </div>
      <p class="confirmation-help">WhatsApp did not open automatically? Use the button above to continue with your request.</p>
    </section>
  </main>
${footer(language)}
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function legalPage(slug, title, paragraphs) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - AYT Ride</title>
  <meta name="description" content="${paragraphs[0]}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${catalog.baseUrl}/${slug}/">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
</head>
<body>
${header("en")}
  <main class="article-wrap">
    <article class="article">
      <p class="mini-label">AYT Ride</p>
      <h1>${title}</h1>
      ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </article>
  </main>
${footer("en")}
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

const blogPosts = defaultBlogPosts;

function blogCard(post) {
  return `<a class="post-card" href="/blog/article/?slug=${encodeURIComponent(post.slug)}"><span class="post-kicker">${escapeHtml(post.kicker)}</span><strong>${escapeHtml(post.title)}</strong><small>${escapeHtml(post.description)}</small><span class="post-meta">${escapeHtml(post.metaLabel || "AYT Ride guide")}</span></a>`;
}

function blogIndexPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Antalya Transfer Blog - AYT Ride</title>
  <meta name="description" content="Useful Antalya Airport transfer guides for Lara, Belek, Kemer, Side, Alanya, private vehicles and pay-on-arrival bookings.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${catalog.baseUrl}/blog/">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
</head>
<body>
${header("en")}
  <main>
    <section class="page-hero">
      <div class="shell">
        <p class="eyebrow">Travel guides</p>
        <h1>Useful Antalya transfer articles for search traffic.</h1>
        <p>Practical pages that answer booking questions before visitors choose an airport transfer in Antalya.</p>
      </div>
    </section>
    <section class="article-wrap">
      <div class="shell post-grid" id="blogPostGrid">
        ${blogPosts.map((post) => blogCard(post)).join("")}
      </div>
    </section>
  </main>
${footer("en")}
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function blogArticlePage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Antalya Transfer Article - AYT Ride</title>
  <meta name="description" content="AYT Ride Antalya Airport transfer article.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${catalog.baseUrl}/blog/article/">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
</head>
<body>
${header("en")}
  <main class="article-wrap">
    <article class="article" data-blog-article>
      <p class="mini-label">Travel guide</p>
      <h1>Loading transfer article...</h1>
      <p>Please wait while the live blog content loads.</p>
    </article>
  </main>
${footer("en")}
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function blogPostPage(post) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${post.title} - AYT Ride</title>
  <meta name="description" content="${post.description}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${post.title} - AYT Ride">
  <meta property="og:description" content="${post.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${catalog.baseUrl}/blog/${post.slug}/">
  <link rel="canonical" href="${catalog.baseUrl}/blog/${post.slug}/">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    dateModified: "2026-09-12",
    author: { "@type": "Organization", name: "AYT Ride" },
    publisher: { "@type": "Organization", name: "AYT Ride" },
    mainEntityOfPage: `${catalog.baseUrl}/blog/${post.slug}/`
  }, null, 2)}</script>
</head>
<body>
${header("en")}
  <main class="article-wrap">
    <article class="article">
      <p class="mini-label">${post.kicker}</p>
      <h1>${post.title}</h1>
      <p>${post.description}</p>
      ${post.body.map(([heading, body]) => `<h2>${heading}</h2><p>${body}</p>`).join("")}
      <h2>Book with route details</h2>
      <p>Use the AYT Ride booking form to choose the route, vehicle, date, passenger count and luggage count. The request opens on WhatsApp with a clear booking summary.</p>
      <p><a class="primary-btn" href="/#booking">Check transfer price</a></p>
    </article>
  </main>
${footer("en")}
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`;
}

function sitemap() {
  const urls = [
    "/",
    ...Object.values(languages).filter((item) => item.homePath !== "/").map((item) => item.homePath),
    ...commercialRoutes.flatMap((route) => routeLanguages.map((language) => routePath(route, language))),
    "/blog/",
    ...blogPosts.map((post) => `/blog/${post.slug}/`),
    "/blog/antalya-airport-to-alanya-distance-transfer-time/",
    "/blog/antalya-airport-to-side-distance-transfer-time/",
    "/blog/antalya-airport-to-kemer-distance-transfer-time/",
    "/blog/antalya-airport-to-lara-kundu-transfer-time/",
    "/de/ratgeber/",
    "/de/ratgeber/flughafen-antalya-alanya-entfernung-fahrzeit/",
    "/de/ratgeber/flughafen-antalya-side-entfernung-fahrzeit/",
    "/de/ratgeber/flughafen-antalya-belek-entfernung-fahrzeit/",
    "/de/ratgeber/flughafen-antalya-kemer-entfernung-fahrzeit/",
    "/de/ratgeber/flughafen-antalya-lara-kundu-transferzeit/",
    "/hotel-transfer-partners/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/cancellation/",
    "/transfer-service-conditions/"
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${catalog.baseUrl}${url}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${url.includes("blog") || url.includes("transfer") ? "monthly" : "weekly"}</changefreq>
    <priority>${url === "/" ? "1.0" : url.includes("transfer") ? "0.9" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>`;
}

write("assets/catalog.js", `window.AYTRideCatalog = ${JSON.stringify(catalog, null, 2)};\n`);
write("server/public-catalog.mjs", `export const publicCatalog = ${JSON.stringify(catalog, null, 2)};\n`);

Object.keys(languages).forEach((language) => {
  const file = languages[language].homePath === "/" ? "index.html" : `${language}/index.html`;
  write(file, homePage(language));
});

commercialRoutes.forEach((route) => {
  routeLanguages.forEach((language) => {
    const p = routePath(route, language).replace(/^\//, "");
    write(`${p}index.html`, routePage(route, language));
  });
});

write("booking-confirmation/index.html", confirmationPage("en"));
write("blog/index.html", blogIndexPage());
write("blog/article/index.html", blogArticlePage());
blogPosts.forEach((post) => write(`blog/${post.slug}/index.html`, blogPostPage(post)));
write("about/index.html", legalPage("about", "About AYT Ride", [
  "AYT Ride is a private Antalya transfer booking brand focused on airport, hotel and resort routes.",
  "The public website shows fixed total prices for covered routes and sends booking requests to the transfer team for confirmation.",
  "Legal operator, license and official transport company information can be displayed here when verified business details are supplied."
]));
write("contact/index.html", legalPage("contact", "Contact AYT Ride", [
  "For bookings and route questions, contact AYT Ride by WhatsApp or email.",
  `WhatsApp: ${catalog.business.displayWhatsapp}. Email: ${catalog.business.bookingEmail}.`,
  "For airport pickups, include flight number, hotel or address, passenger count, luggage count and child seat requests."
]));
write("privacy/index.html", legalPage("privacy", "Privacy Policy", [
  "AYT Ride collects booking details only to respond to transfer requests, confirm routes and manage customer communication.",
  "Marketing and analytics tags are disabled until consent is given. Booking records should be stored in the production backend, not in public browser storage.",
  "Do not send payment card details through the booking form or WhatsApp."
]));
write("terms/index.html", legalPage("terms", "Terms", [
  "AYT Ride displays transfer request prices for covered Antalya routes and confirms booking status by WhatsApp.",
  "A booking is not final until vehicle availability, pickup point and route details are confirmed by the transfer team.",
  "Payment is collected after the ride unless a different payment arrangement is confirmed in writing."
]));
write("cancellation/index.html", legalPage("cancellation", "Cancellation and Changes", [
  "Guests should request cancellations or changes by WhatsApp as early as possible.",
  "Flight delays, hotel changes and updated pickup times can usually be reviewed before dispatch, subject to vehicle availability.",
  "The transfer team confirms whether a change can be accepted before the booking is treated as updated."
]));
write("transfer-service-conditions/index.html", legalPage("transfer-service-conditions", "Transfer Service Conditions", [
  "Passengers must provide accurate flight, pickup, destination, passenger and luggage information before confirmation.",
  "Child seats, golf bags, extra luggage and special meeting instructions should be added to the request notes.",
  "AYT Ride does not ask for online card payment in the first phase; payment is handled after the ride unless confirmed otherwise."
]));
write("hotel-transfer-partners/index.html", legalPage("hotel-transfer-partners", "Antalya hotel and travel partners", [
  "AYT Ride works with hotels, villas, travel planners and tourism businesses that need a clear private-transfer booking path for guests arriving at Antalya Airport.",
  "A partner enquiry can cover airport pickup guidance, route pages for a resort area, guest WhatsApp confirmation and a booking link that opens the relevant transfer form.",
  `To discuss a guest transfer or partnership enquiry, contact AYT Ride by WhatsApp at ${catalog.business.displayWhatsapp} or email ${catalog.business.bookingEmail}.`
]));

write("404.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page not found - AYT Ride</title>
  <meta name="robots" content="noindex,follow">
  <link rel="icon" type="image/svg+xml" href="${favicon()}">
  <link rel="stylesheet" href="/assets/site.css?v=${buildStamp}">
  <script src="/assets/catalog.js?v=${buildStamp}"></script>
</head>
<body>
${header("en")}
  <main class="page-hero"><section class="shell"><p class="eyebrow">404</p><h1>Page not found.</h1><p>The transfer page may have moved. Start from the booking form or choose a route.</p><a class="primary-btn" href="/#booking">Book a ride</a></section></main>
${footer("en")}
  <script src="/assets/app.js?v=${buildStamp}"></script>
</body>
</html>`);

write("sitemap.xml", sitemap());
write("robots.txt", `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${catalog.baseUrl}/sitemap.xml
`);
write("llms.txt", `# AYT Ride

AYT Ride is a private Antalya airport transfer booking website.

- Website: ${catalog.baseUrl}
- WhatsApp: ${catalog.business.displayWhatsapp}
- Email: ${catalog.business.bookingEmail}
- Main routes: Lara / Kundu, Belek / Kadriye, Kemer, Side / Manavgat, Alanya
- Payment promise: pay on arrival after the ride unless otherwise confirmed
- Vehicle options: Standard Sedan and VIP Van

Public pages must not expose operator costs, margin calculations, private credentials or admin-only settings.
`);
