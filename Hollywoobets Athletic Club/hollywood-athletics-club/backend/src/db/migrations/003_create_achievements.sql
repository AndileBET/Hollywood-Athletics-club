create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tier text not null check (tier in ('Gold', 'Silver', 'Bronze')),
  rule_key text unique,
  target_value numeric(10, 2),
  created_at timestamptz not null default now()
);
