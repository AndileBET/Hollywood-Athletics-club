import { listActivities } from '../services/activity.service.js';
import { buildRewards } from '../services/rewards.service.js';
import { resolveUserId } from '../services/supabase.service.js';

export async function getRewards(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const activities = await listActivities(userId);
    res.json(buildRewards(activities));
  } catch (error) {
    next(error);
  }
}
