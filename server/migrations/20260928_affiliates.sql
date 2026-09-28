create table if not exists affiliate_partners (
  id integer primary key autoincrement,
  code text not null unique,
  name text not null,
  contact_name text,
  phone text,
  email text,
  commission_eur real not null default 5,
  status text not null default 'active',
  created_at text not null,
  updated_at text not null
);

create index if not exists idx_affiliate_partners_status on affiliate_partners (status, name);

create table if not exists affiliate_payments (
  id integer primary key autoincrement,
  partner_id integer not null,
  amount_eur real not null,
  note text,
  paid_at text not null,
  created_at text not null,
  foreign key (partner_id) references affiliate_partners(id)
);

create index if not exists idx_affiliate_payments_partner on affiliate_payments (partner_id, paid_at desc);
