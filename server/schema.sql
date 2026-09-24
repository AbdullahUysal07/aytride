create table if not exists bookings (
  id integer primary key autoincrement,
  reference text not null unique,
  language text not null,
  route_id text not null,
  trip_type text not null,
  pickup text not null,
  dropoff text not null,
  pickup_date text not null,
  pickup_time text not null,
  return_date text,
  return_time text,
  flight_number text,
  hotel_address text,
  vehicle_id text not null,
  passengers integer not null,
  luggage integer not null,
  child_seats integer not null,
  guest_name text not null,
  guest_phone text not null,
  guest_email text,
  notes text,
  public_total_eur integer,
  quote_only integer not null default 0,
  private_vehicle_price_eur integer,
  attribution_json text,
  status text not null default 'pending',
  confirmed_at text,
  deleted_at text,
  updated_at text,
  created_at text not null
);

create index if not exists idx_bookings_created_at on bookings (created_at desc);
create index if not exists idx_bookings_route_id on bookings (route_id);
create index if not exists idx_bookings_guest_phone on bookings (guest_phone);
create index if not exists idx_bookings_status on bookings (status, confirmed_at desc);

create table if not exists route_prices (
  route_id text not null,
  vehicle_id text not null,
  price_eur integer not null,
  updated_at text not null,
  primary key (route_id, vehicle_id)
);

create table if not exists admin_settings (
  key text primary key,
  value text not null,
  updated_at text not null
);

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

create table if not exists analytics_events (
  id integer primary key autoincrement,
  event_type text not null,
  visitor_id text not null,
  path text not null,
  source text,
  medium text,
  campaign text,
  referrer_host text,
  route_id text,
  created_at text not null
);

create index if not exists idx_analytics_events_created_at on analytics_events (created_at desc);
create index if not exists idx_analytics_events_visitor on analytics_events (visitor_id, created_at desc);
create index if not exists idx_analytics_events_source on analytics_events (source, created_at desc);
