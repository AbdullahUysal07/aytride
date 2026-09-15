create table if not exists admin_settings (
  key text primary key,
  value text not null,
  updated_at text not null
);

insert or ignore into admin_settings (key, value, updated_at)
values ('eur_try_rate_fallback', '45', '2026-09-15T00:00:00.000Z');
