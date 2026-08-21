-- Run this once in the Supabase SQL editor for this project
-- (Dashboard → SQL Editor → New query → paste → Run).

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  address text not null,
  city text not null,
  state text not null default 'OK',
  zip text not null,
  price numeric not null,
  down_payment numeric not null,
  monthly_payment numeric not null,
  term_years integer,
  beds integer,
  baths numeric,
  sqft integer,
  lot_size text,
  year_built integer,
  description text,
  category text not null default 'available'
    check (category in ('available', 'coming_soon', 'sold')),
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table properties enable row level security;

drop policy if exists "Public can read properties" on properties;
create policy "Public can read properties"
  on properties for select
  using (true);

-- No insert/update/delete policy — all writes go through the admin-only
-- server code, which uses the Supabase secret key and bypasses RLS.

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view property photos" on storage.objects;
create policy "Public can view property photos"
  on storage.objects for select
  using (bucket_id = 'property-photos');
