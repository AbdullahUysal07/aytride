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
