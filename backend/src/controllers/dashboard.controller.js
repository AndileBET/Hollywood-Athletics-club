import { listActivities } from '../services/activity.service.js';
import { buildDashboardStats } from '../services/stats.service.js';
import { getAthleteProfile, resolveUserId } from '../services/supabase.service.js';
import { buildRewards } from '../services/rewards.service.js';
import { hasStravaConnection } from '../services/strava.service.js';
import { demoActivities } from '../services/demo-data.service.js';

export async function getDashboard(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const athlete = await getAthleteProfile(userId);
    const [activityResult, stravaResult] = await Promise.all([
      safeRead(() => listActivities(userId), []),
      safeRead(() => hasStravaConnection(userId), false),
    ]);
    const activities = activityResult.length ? activityResult : demoActivities();
    const rewards = buildRewards(activities);
    res.json({ athlete: { ...athlete, stravaConnected: stravaResult }, activities, dashboardStats: buildDashboardStats(activities), rewards });
  } catch (error) { next(error); }
}

async function safeRead(readFn, fallbackValue) {
  try { return await readFn(); } catch (error) {
    if (error?.code === '42P01' || error?.statusCode === 503) return fallbackValue;
    throw error;
  }
}
