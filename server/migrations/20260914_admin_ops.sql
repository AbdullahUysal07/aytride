alter table bookings add column status text not null default 'pending';
alter table bookings add column confirmed_at text;
alter table bookings add column deleted_at text;
alter table bookings add column updated_at text;

create index if not exists idx_bookings_status on bookings (status, confirmed_at desc);

create table if not exists route_prices (
  route_id text not null,
  vehicle_id text not null,
  price_eur integer not null,
  updated_at text not null,
  primary key (route_id, vehicle_id)
);
