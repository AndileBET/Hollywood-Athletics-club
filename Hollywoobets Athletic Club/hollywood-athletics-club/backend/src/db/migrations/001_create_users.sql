create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  member_since date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.strava_connections (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  strava_athlete_id bigint unique,
  strava_access_token text not null,
  strava_refresh_token text not null,
  strava_token_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists strava_connections_athlete_id_idx
  on public.strava_connections (strava_athlete_id);
