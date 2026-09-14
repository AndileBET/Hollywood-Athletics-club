import { requireSupabase, requireUserId } from './supabase.service.js';

export async function getLeaderboard(userId) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.user_id,
    name: row.full_name,
    username: row.member_number || `@${String(row.email || '').split('@')[0]}`,
    memberNumber: row.member_number || '',
    avatar: row.avatar_url || null,
    distanceKm: Number(row.total_distance_km || 0),
    runs: Number(row.activity_count || 0),
    points: Number(row.total_points || 0),
    stars: Number(row.total_distance_km || 0),
    rank: Number(row.rank || 0),
    isCurrentUser: row.user_id === userId,
  }));
}
