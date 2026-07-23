create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  strava_activity_id bigint not null unique,
  name text not null,
  sport_type text not null default 'Run',
  activity_type text not null default 'Run',
  distance_km numeric(10, 2) not null default 0,
  moving_time_seconds integer not null default 0,
  elapsed_time_seconds integer not null default 0,
  pace_seconds_per_km numeric(10, 2),
  total_elevation_gain numeric(10, 2) not null default 0,
  start_date timestamptz,
  points integer not null default 0,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_user_start_date_idx
  on public.activities (user_id, start_date desc);
