create or replace view public.leaderboard
with (security_invoker = true)
as
select
  p.id as user_id,
  p.full_name,
  p.email,
  p.avatar_url,
  p.member_number,
  count(a.id)::bigint as activity_count,
  coalesce(sum(a.distance_km), 0)::numeric(12, 2) as total_distance_km,
  coalesce(sum(a.points), 0)::bigint as total_points,
  dense_rank() over (
    order by
      coalesce(sum(a.distance_km), 0) desc,
      count(a.id) desc,
      p.created_at asc
  )::integer as rank
from public.profiles p
left join public.activities a
  on a.user_id = p.id
group by
  p.id,
  p.full_name,
  p.email,
  p.avatar_url,
  p.member_number,
  p.created_at;

grant select on public.leaderboard to authenticated;
grant select on public.leaderboard to service_role;

comment on view public.leaderboard is
  'Live club rankings calculated from profiles and existing synced Strava activities; no activity data is duplicated.';
