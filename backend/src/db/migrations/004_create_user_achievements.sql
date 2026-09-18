create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  progress numeric(5, 2) not null default 0,
  earned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index if not exists user_achievements_user_id_idx
  on public.user_achievements (user_id);
