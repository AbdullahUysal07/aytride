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
