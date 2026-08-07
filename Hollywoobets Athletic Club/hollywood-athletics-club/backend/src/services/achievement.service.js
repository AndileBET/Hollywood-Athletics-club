import { requireSupabase, requireUserId } from './supabase.service.js';

export async function listAchievements(userId) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data, error } = await supabase
    .from('user_achievements')
    .select('progress, achievements(id, title, description, tier)')
    .eq('user_id', userId);

  if (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }

  return data.map((row) => ({
    id: row.achievements.id,
    title: row.achievements.title,
    description: row.achievements.description,
    tier: row.achievements.tier,
    progress: row.progress,
  }));
}

function isMissingTableError(error) {
  return error?.code === '42P01';
}
