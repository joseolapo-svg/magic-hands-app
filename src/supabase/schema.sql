-- ============================================================================
-- Magic Hands Miami — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

-- ─── Tables ─────────────────────────────────────────────────────────────────
create table if not exists public.partners (
  id            text primary key,
  business_name text not null,
  contact_name  text not null,
  email         text not null,
  phone         text not null,
  category      text not null,
  joined_at     date not null default current_date
);

create table if not exists public.referrals (
  id               text primary key,
  client_name      text not null,
  client_email     text not null,
  client_phone     text not null,
  vehicle_type     text not null,
  service_interest text not null,
  partner_id       text not null references public.partners (id) on delete cascade,
  partner_name     text not null,
  registered_at    date not null default current_date,
  status           text not null default 'Pending'
                     check (status in ('Pending', 'Contacted', 'Booked', 'Completed'))
);

create index if not exists referrals_partner_id_idx on public.referrals (partner_id);

-- Audit log of Terms & Conditions acceptances (one row each time a partner accepts).
create table if not exists public.partner_terms_acceptances (
  id            bigint generated always as identity primary key,
  partner_id    text not null references public.partners (id) on delete cascade,
  terms_version text not null,
  accepted      boolean not null default true,
  source        text,
  accepted_at   timestamptz not null default now()
);

create index if not exists partner_terms_acceptances_partner_id_idx
  on public.partner_terms_acceptances (partner_id);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- This is a public prototype: the anon key may read all rows and insert new
-- partners / referrals, but may NOT update or delete. Tighten these policies
-- (e.g. require auth) before handling real customer data in production.
alter table public.partners                 enable row level security;
alter table public.referrals                enable row level security;
alter table public.partner_terms_acceptances enable row level security;

create policy "partners_public_read"   on public.partners  for select using (true);
create policy "partners_public_insert" on public.partners  for insert with check (true);

create policy "referrals_public_read"   on public.referrals for select using (true);
create policy "referrals_public_insert" on public.referrals for insert with check (true);

create policy "terms_public_insert" on public.partner_terms_acceptances for insert with check (true);

-- ─── Seed data (optional — remove if starting empty) ────────────────────────
insert into public.partners (id, business_name, contact_name, email, phone, category, joined_at) values
  ('MH-MIAMIL-26', 'Miami Luxury Motors',    'Carlos Rodríguez', 'carlos@miamiluxurymotors.com', '+1 (305) 444-1122', 'luxury_dealer',  '2026-06-12'),
  ('MH-BAYMAR-26', 'Bayliner Marine Miami',  'Elena Fuentes',    'elena@baylinermarine.com',    '+1 (305) 555-9900', 'marina',         '2026-05-03'),
  ('MH-SUNRIS-26', 'Sunrise Auto Workshop',  'Jorge Mendoza',    'jorge@sunriseauto.com',       '+1 (786) 300-7812', 'auto_workshop',  '2026-07-20')
on conflict (id) do nothing;

insert into public.referrals (id, client_name, client_email, client_phone, vehicle_type, service_interest, partner_id, partner_name, registered_at, status) values
  ('REF-001', 'Carlos Menéndez', 'c.menendez@gmail.com', '+1 305 712 4490', '65ft Yacht',           'Full Detail',          'MH-BAYMAR-26', 'Bayliner Marine Miami', '2026-08-05', 'Completed'),
  ('REF-002', 'Sofia Restrepo',  's.restrepo@gmail.com', '+1 305 890 3312', 'Ferrari 488',          'Ceramic Coating',      'MH-MIAMIL-26', 'Miami Luxury Motors',   '2026-08-04', 'Completed'),
  ('REF-003', 'James Whitmore',  'jwhitmore@me.com',     '+1 786 220 6600', 'Bentley Bentayga',     'Interior Restoration', 'MH-MIAMIL-26', 'Miami Luxury Motors',   '2026-08-03', 'Booked'),
  ('REF-004', 'Andrea Vásquez',  'avasquez@outlook.com', '+1 305 441 8823', 'Lamborghini Huracán',  'Paint Correction',     'MH-SUNRIS-26', 'Sunrise Auto Workshop', '2026-08-02', 'Completed'),
  ('REF-005', 'Elena Ruiz',      'elenita.r@gmail.com',  '+1 786 550 4100', '40ft Sea Ray',         'Nano Coating',         'MH-BAYMAR-26', 'Bayliner Marine Miami', '2026-07-30', 'Pending')
on conflict (id) do nothing;
