create extension if not exists "pgcrypto";

create table if not exists companies (
  id text primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists productive_units (
  id text primary key,
  company_id text not null references companies(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (company_id, name)
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'user', 'developer')),
  company_id text references companies(id) on delete set null,
  productive_unit_id text references productive_units(id) on delete set null,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table if not exists badges (
  id text primary key,
  name text not null unique,
  description text not null,
  category text not null,
  icon_name text not null,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists badge_legend_settings (
  id uuid primary key default gen_random_uuid(),
  bronze text not null,
  silver text not null,
  gold text not null,
  loss_1 text not null,
  loss_2 text not null,
  updated_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  badge_id text not null references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  awarded_by uuid references users(id) on delete set null,
  tone text not null check (tone in ('bronze', 'silver', 'gold', 'loss_1', 'loss_2'))
);

create table if not exists badge_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  badge_id text not null references badges(id) on delete cascade,
  proof_url text,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  feedback text
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  message text not null,
  sent_at timestamptz not null default now(),
  read boolean not null default false
);

create table if not exists import_sources (
  id text primary key,
  name text not null unique,
  description text,
  company_column text not null,
  productive_unit_column text not null,
  user_column text not null,
  badge_column text not null,
  tone_column text not null default 'marcacao',
  award_column text not null default 'premio',
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists import_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text references import_sources(id) on delete set null,
  source_name text not null,
  imported_by uuid references users(id) on delete set null,
  imported_at timestamptz not null default now(),
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  matched_columns jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb
);

create table if not exists import_run_rows (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references import_runs(id) on delete cascade,
  row_number integer not null,
  raw_payload jsonb not null,
  normalized_payload jsonb,
  status text not null check (status in ('valid', 'invalid', 'imported')),
  reason text
);

insert into badge_legend_settings (bronze, silver, gold, loss_1, loss_2)
select
  'Bronze: 1 selo no mês',
  'Prata: 2 selos no mês',
  'Ouro: 3 selos ou mais no mês',
  'Vermelho: perda de 1 selo',
  'Vermelho intenso: perda de 2 selos'
where not exists (select 1 from badge_legend_settings);
