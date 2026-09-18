import { getAthleteProfile, resolveUserId, upsertAthleteProfile } from '../services/supabase.service.js';
import { listActivities } from '../services/activity.service.js';
import { buildRewards } from '../services/rewards.service.js';
import { demoActivities } from '../services/demo-data.service.js';

export async function getProfile(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const athlete = await getAthleteProfile(userId);
    let activities = await listActivities(userId, 200);
    if (!activities || activities.length === 0) activities = demoActivities();
    const rewards = buildRewards(activities);
    res.json({ athlete, points: rewards.totalPoints });
  } catch (error) { next(error); }
}

export async function saveProfile(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const profile = await upsertAthleteProfile({ ...req.body, id: userId });
    res.json({ athlete: profile });
  } catch (error) { next(error); }
}
