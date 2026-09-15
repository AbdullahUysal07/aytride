create table if not exists admin_settings (
  key text primary key,
  value text not null,
  updated_at text not null
);

insert or ignore into admin_settings (key, value, updated_at)
values
  ('driver_rate_try_per_km', '35', '2026-09-14T00:00:00.000Z'),
  ('eur_try_rate', '45', '2026-09-14T00:00:00.000Z'),
  ('eur_try_rate_fallback', '45', '2026-09-14T00:00:00.000Z');

create table if not exists blog_posts (
  slug text primary key,
  status text not null default 'published',
  kicker text not null,
  title text not null,
  description text not null,
  body_json text not null,
  meta_label text,
  created_at text not null,
  updated_at text not null,
  deleted_at text
);

create index if not exists idx_blog_posts_status on blog_posts (status, updated_at desc);

insert or ignore into blog_posts (slug, status, kicker, title, description, body_json, meta_label, created_at, updated_at, deleted_at)
values
  (
    'antalya-airport-transfer-guide',
    'published',
    'Airport guide',
    'Antalya Airport transfer guide for first-time visitors',
    'How to plan an Antalya Airport private transfer, pickup time, flight number, luggage, hotel details and pay-on-arrival expectations.',
    '[["What to prepare before landing","Keep your flight number, hotel name, hotel block and WhatsApp number ready before requesting a transfer. These details help the operator confirm the meeting point clearly."],["Why a private transfer helps","A private vehicle is useful when you travel with family, luggage or a late arrival. The route and vehicle choice are agreed before pickup."],["Payment after the ride","AYT Ride does not ask for online card payment in the first booking flow. The passenger completes the ride first, then pays the driver unless a different arrangement is confirmed."]]',
    'AYT guide',
    '2026-09-12T00:00:00.000Z',
    '2026-09-12T00:00:00.000Z',
    null
  ),
  (
    'private-transfer-vs-taxi-antalya',
    'published',
    'Private transfer',
    'Private transfer vs taxi in Antalya',
    'Compare Antalya private transfers and taxi rides for airport pickup, fixed pricing, luggage planning, family travel and WhatsApp confirmation.',
    '[["When fixed pricing matters","A listed route price lets the guest see the total vehicle price before sending the request. This is easier for airport arrivals, families and visitors who do not want to negotiate at the terminal."],["Vehicle and luggage planning","Sedan works for small groups. VIP Van gives more cabin and suitcase space for larger families, golf bags and resort transfers."],["WhatsApp confirmation","The prepared WhatsApp request includes route, flight number, passengers, luggage and notes so the team can confirm availability and pickup details quickly."]]',
    'Trust guide',
    '2026-09-12T00:00:00.000Z',
    '2026-09-12T00:00:00.000Z',
    null
  ),
  (
    'belek-golf-transfer',
    'published',
    'Golf transfer',
    'Belek golf transfer checklist',
    'Plan a Belek or Kadriye golf transfer from Antalya Airport with golf bags, resort gates, luggage space, child seats and return transfer timing.',
    '[["Add golf luggage early","Golf bags can change the best vehicle choice. Add them in the notes so the transfer team can confirm whether a VIP Van is the right fit."],["Hotel and resort gate details","Belek resorts may have several entrances and security gates. The exact hotel block or lobby name helps the driver confirm the cleanest pickup point."],["Return transfer timing","For return airport transfers, allow enough time for hotel checkout, traffic and airport procedures. AYT Ride confirms the pickup time before the booking is final."]]',
    'Belek guide',
    '2026-09-12T00:00:00.000Z',
    '2026-09-12T00:00:00.000Z',
    null
  );
