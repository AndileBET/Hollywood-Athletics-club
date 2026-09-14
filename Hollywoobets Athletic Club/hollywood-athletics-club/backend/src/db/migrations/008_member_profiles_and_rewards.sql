do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'Club Number'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'member_number'
  ) then
    alter table public.profiles rename column "Club Number" to member_number;
  end if;
end $$;

create sequence if not exists public.club_member_number_seq start 1;

alter table public.profiles
  add column if not exists phone text,
  add column if not exists gender text,
  add column if not exists emergency_contact text,
  add column if not exists member_number text;

update public.profiles
set member_number = 'HB-' || lpad(nextval('public.club_member_number_seq')::text, 6, '0')
where member_number is null or btrim(member_number) = '';

select setval(
  'public.club_member_number_seq',
  greatest(
    coalesce(
      (
        select max(substring(member_number from '([0-9]+)$')::bigint)
        from public.profiles
        where member_number ~ '[0-9]+$'
      ),
      1
    ),
    1
  ),
  true
);

alter table public.profiles
  alter column member_number set default ('HB-' || lpad(nextval('public.club_member_number_seq')::text, 6, '0')),
  alter column member_number set not null;

create unique index if not exists profiles_member_number_key
  on public.profiles (member_number);
