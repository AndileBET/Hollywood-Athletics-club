create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists community_messages_created_at_idx on public.community_messages(created_at desc);
grant select, insert on public.community_messages to authenticated;
grant select, insert on public.community_messages to service_role;
