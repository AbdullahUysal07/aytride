(() => {
  let analytics = {
    gtmId: "",
    ga4MeasurementId: "G-444H4RB03N",
    googleAdsId: "",
    googleAdsBookingLabel: ""
  };

  const catalog = {
    version: "2026-09-14",
    baseUrl: "https://aytride.com",
    apiBase: "https://ayt-ride-api.aytride.workers.dev",
    currency: "EUR",
    business: {
      brand: "AYT Ride",
      tagline: "Private Transfers in Antalya",
      bookingEmail: "info@shramworld.com",
      emailOptions: ["info@shramworld.com"],
      whatsapp: "16838502742",
      displayWhatsapp: "+1 683 850 2742",
      operatorDisplayName: ""
    },
    fees: {
      nightFeeEur: 0,
      childSeatFeeEur: 0,
      returnDiscount: 0.9
    },
    vehicles: [
      {
        id: "standard-sedan",
        name: "Standard Sedan",
        shortName: "Sedan",
        passengers: 3,
        luggage: 3,
        image: "/assets/comfort-sedan-egea.jpg",
        imageAlt: "White mid-segment sedan used as an Antalya airport transfer vehicle",
        description: "Mid-segment private sedan for couples and small families."
      },
      {
        id: "vip-van",
        name: "VIP Van",
        shortName: "VIP Van",
        passengers: 6,
        luggage: 6,
        image: "/assets/ayt-ride-transfer.jpg",
        imageAlt: "Black VIP van used for private Antalya airport transfers",
        description: "Spacious private van for families, groups and golf luggage."
      }
    ],
    routes: [
      {
        id: "lara",
        origin: "Antalya Airport (AYT)",
        destination: "Lara / Kundu",
        distanceKm: 14,
        durationMin: 20,
        available: true,
        prices: { "standard-sedan": 30, "vip-van": 40 },
        image: "/assets/routes/lara-kundu.jpg",
        imageAlt: "Lara Kundu beach and resort area near Antalya Airport",
        slugs: {
          en: "antalya-airport-to-lara-transfer",
          de: "flughafen-antalya-lara-transfer",
          pl: "transfer-lotnisko-antalya-lara",
          ru: "transfer-aeroport-antaliya-lara"
        }
      },
      {
        id: "belek",
        origin: "Antalya Airport (AYT)",
        destination: "Belek / Kadriye",
        distanceKm: 33,
        durationMin: 35,
        available: true,
        prices: { "standard-sedan": 45, "vip-van": 60 },
        image: "/assets/routes/belek-kadriye.jpg",
        imageAlt: "Belek Kadriye resort coastline near Antalya",
        slugs: {
          en: "antalya-airport-to-belek-transfer",
          de: "flughafen-antalya-belek-transfer",
          pl: "transfer-lotnisko-antalya-belek",
          ru: "transfer-aeroport-antaliya-belek"
        }
      },
      {
        id: "kemer",
        origin: "Antalya Airport (AYT)",
        destination: "Kemer",
        distanceKm: 58,
        durationMin: 65,
        available: true,
        prices: { "standard-sedan": 60, "vip-van": 80 },
        image: "/assets/routes/kemer.jpg",
        imageAlt: "Kemer beach hotels with Taurus mountains",
        slugs: {
          en: "antalya-airport-to-kemer-transfer",
          de: "flughafen-antalya-kemer-transfer",
          pl: "transfer-lotnisko-antalya-kemer",
          ru: "transfer-aeroport-antaliya-kemer"
        }
      },
      {
        id: "side",
        origin: "Antalya Airport (AYT)",
        destination: "Side / Manavgat",
        distanceKm: 65,
        durationMin: 60,
        available: true,
        prices: { "standard-sedan": 65, "vip-van": 90 },
        image: "/assets/routes/side-manavgat.jpg",
        imageAlt: "Side ancient temple and palm trees on the Antalya coast",
        slugs: {
          en: "antalya-airport-to-side-transfer",
          de: "flughafen-antalya-side-transfer",
          pl: "transfer-lotnisko-antalya-side",
          ru: "transfer-aeroport-antaliya-side"
        }
      },
      {
        id: "alanya",
        origin: "Antalya Airport (AYT)",
        destination: "Alanya",
        distanceKm: 125,
        durationMin: 120,
        available: true,
        prices: { "standard-sedan": 95, "vip-van": 130 },
        image: "/assets/routes/alanya.jpg",
        imageAlt: "Alanya harbor and castle coastline",
        slugs: {
          en: "antalya-airport-to-alanya-transfer",
          de: "flughafen-antalya-alanya-transfer",
          pl: "transfer-lotnisko-antalya-alanya",
          ru: "transfer-aeroport-antaliya-alanya"
        }
      },
      {
        id: "oldtown",
        origin: "Antalya Airport (AYT)",
        destination: "Kaleici / Old Town",
        distanceKm: 16,
        durationMin: 25,
        available: true,
        prices: { "standard-sedan": 35, "vip-van": 45 },
        image: "/assets/routes/kaleici-old-town.jpg",
        imageAlt: "Kaleici Old Town marina and Antalya historic harbor",
        slugs: {
          en: "antalya-airport-to-kaleici-transfer",
          de: "flughafen-antalya-kaleici-transfer",
          pl: "transfer-lotnisko-antalya-kaleici",
          ru: "transfer-aeroport-antaliya-kaleici"
        }
      },
      {
        id: "konyaalti",
        origin: "Antalya Airport (AYT)",
        destination: "Konyaalti",
        distanceKm: 25,
        durationMin: 35,
        available: true,
        prices: { "standard-sedan": 40, "vip-van": 55 }
      },
      {
        id: "custom",
        origin: "Antalya Airport (AYT)",
        destination: "Other hotel or address",
        distanceKm: null,
        durationMin: null,
        available: true,
        prices: {},
        quoteOnly: true
      }
    ]
  };

  Object.defineProperty(catalog, "analytics", {
    enumerable: true,
    configurable: true,
    get() {
      return analytics;
    },
    set(value) {
      const next = value && typeof value === "object" ? value : {};
      analytics = {
        ...next,
        ga4MeasurementId: next.ga4MeasurementId || analytics.ga4MeasurementId || "G-444H4RB03N"
      };
    }
  });

  window.AYTRideCatalog = catalog;
})();
