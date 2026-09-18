import { requireSupabase, requireUserId } from './supabase.service.js';
export async function getLeaderboard(userId) {
  const supabase = requireSupabase(); requireUserId(userId);
  const { data, error } = await supabase.from('leaderboard').select('*').order('rank', { ascending: true });
  if (error) { if (error.code === '42P01') return []; throw error; }
  return data.map((row) => ({ id: row.user_id, name: row.full_name, username: `@${String(row.email || '').split('@')[0] || 'member'}`, distanceKm: Number(row.total_distance_km || 0), runs: Number(row.activity_count || 0), avatar: row.avatar_url || null, rank: Number(row.rank), isCurrentUser: row.user_id === userId }));
}
