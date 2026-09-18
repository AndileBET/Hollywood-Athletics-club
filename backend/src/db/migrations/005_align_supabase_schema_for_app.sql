create extension if not exists "pgcrypto";

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

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists member_since date,
  add column if not exists created_at timestamptz not null default now();

update public.profiles
set member_since = coalesce(member_since, current_date)
where member_since is null;

alter table public.profiles
  alter column member_since set default current_date;

alter table public.activities
  add column if not exists strava_activity_id bigint,
  add column if not exists name text,
  add column if not exists sport_type text default 'Run',
  add column if not exists activity_type text default 'Run',
  add column if not exists moving_time_seconds integer default 0,
  add column if not exists elapsed_time_seconds integer default 0,
  add column if not exists pace_seconds_per_km numeric(10, 2),
  add column if not exists total_elevation_gain numeric(10, 2) default 0,
  add column if not exists start_date timestamptz,
  add column if not exists points integer default 0,
  add column if not exists raw_payload jsonb,
  add column if not exists updated_at timestamptz not null default now();

update public.activities
set
  name = coalesce(name, activity_name, 'Manual Activity'),
  sport_type = coalesce(sport_type, 'Run'),
  activity_type = coalesce(activity_type, 'Run'),
  moving_time_seconds = coalesce(
    moving_time_seconds,
    case
      when duration is not null then greatest(extract(epoch from duration)::integer, 0)
      else 0
    end
  ),
  elapsed_time_seconds = coalesce(
    elapsed_time_seconds,
    case
      when duration is not null then greatest(extract(epoch from duration)::integer, 0)
      else 0
    end
  ),
  pace_seconds_per_km = coalesce(
    pace_seconds_per_km,
    case
      when pace ~ '^[0-9]+:[0-9]{1,2}(/km)?$'
        then
          (
            split_part(split_part(pace, '/', 1), ':', 1)::numeric * 60
            + split_part(split_part(pace, '/', 1), ':', 2)::numeric
          )
      else null
    end
  ),
  total_elevation_gain = coalesce(total_elevation_gain, elevation_metres, 0),
  start_date = coalesce(
    start_date,
    case
      when activity_date is not null then activity_date::timestamptz
      else null
    end
  ),
  points = coalesce(points, points_earned, 0),
  updated_at = coalesce(updated_at, now())
where
  name is null
  or sport_type is null
  or activity_type is null
  or moving_time_seconds is null
  or elapsed_time_seconds is null
  or pace_seconds_per_km is null
  or total_elevation_gain is null
  or start_date is null
  or points is null
  or updated_at is null;

create unique index if not exists activities_strava_activity_id_key
  on public.activities (strava_activity_id);

create index if not exists activities_user_start_date_idx
  on public.activities (user_id, start_date desc);

alter table public.achievements
  add column if not exists title text,
  add column if not exists tier text,
  add column if not exists rule_key text,
  add column if not exists created_at timestamptz not null default now();

update public.achievements
set
  title = coalesce(title, achievement_name),
  tier = coalesce(
    tier,
    case
      when reward_points >= 100 then 'Gold'
      when reward_points >= 50 then 'Silver'
      else 'Bronze'
    end
  ),
  created_at = coalesce(created_at, now())
where title is null or tier is null or created_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'achievements_tier_check'
      and conrelid = 'public.achievements'::regclass
  ) then
    alter table public.achievements
      add constraint achievements_tier_check
      check (tier in ('Gold', 'Silver', 'Bronze'));
  end if;
end $$;

create unique index if not exists achievements_rule_key_idx
  on public.achievements (rule_key);

insert into public.achievements (title, description, tier, rule_key, target_value, created_at)
values
  ('100 km Club', 'Logged more than 100 km this season.', 'Gold', 'distance_100km', 100, now()),
  ('Consistency Builder', 'Completed runs in three consecutive weeks.', 'Silver', 'three_week_streak', 3, now()),
  ('Hill Hunter', 'Climbed 1,000 m across recent sessions.', 'Bronze', 'elevation_1000m', 1000, now())
on conflict (rule_key) do update
set
  title = excluded.title,
  description = excluded.description,
  tier = excluded.tier,
  target_value = excluded.target_value;

alter table public.user_achievements
  add column if not exists progress numeric(5, 2),
  add column if not exists earned_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.user_achievements
set
  progress = coalesce(progress, current_value, 0),
  earned_at = coalesce(
    earned_at,
    case
      when status = 'earned' and earned_date is not null then earned_date::timestamptz
      else null
    end
  ),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where progress is null or created_at is null or updated_at is null or earned_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_achievements_user_achievement_key'
      and conrelid = 'public.user_achievements'::regclass
  ) then
    alter table public.user_achievements
      add constraint user_achievements_user_achievement_key
      unique (user_id, achievement_id);
  end if;
end $$;

create index if not exists user_achievements_user_id_idx
  on public.user_achievements (user_id);

insert into public.user_achievements (
  user_id,
  achievement_id,
  progress,
  earned_at,
  created_at,
  updated_at
)
select
  p.id,
  a.id,
  0,
  null,
  now(),
  now()
from public.profiles p
cross join public.achievements a
where not exists (
  select 1
  from public.user_achievements ua
  where ua.user_id = p.id
    and ua.achievement_id = a.id
);


insert into public.activities (
  user_id,
  name,
  sport_type,
  activity_type,
  distance_km,
  moving_time_seconds,
  elapsed_time_seconds,
  pace_seconds_per_km,
  total_elevation_gain,
  start_date,
  points,
  raw_payload
) values (
  'YOUR_PROFILE_UUID',
  'Morning Run',
  'Run',
  'Run',
  8.50,
  2700,
  2700,
  317.65,
  85,
  now() - interval '1 day',
  85,
  jsonb_build_object('source', 'supabase_manual_fallback')
);
