import { listActivities } from '../services/activity.service.js';
import { listAchievements } from '../services/achievement.service.js';
import { buildDashboardStats } from '../services/stats.service.js';
import { getAthleteProfile, resolveUserId } from '../services/supabase.service.js';
import { hasStravaConnection } from '../services/strava.service.js';

export async function getDashboard(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const athlete = await getAthleteProfile(userId);
    const [activities, achievements, stravaConnected] = await Promise.all([
      safeRead(() => listActivities(userId), []),
      safeRead(() => listAchievements(userId), []),
      safeRead(() => hasStravaConnection(userId), false),
    ]);

    res.json({
      athlete: {
        ...athlete,
        stravaConnected,
      },
      activities,
      achievements,
      dashboardStats: buildDashboardStats(activities),
    });
  } catch (error) {
    next(error);
  }
}

async function safeRead(readFn, fallbackValue) {
  try {
    return await readFn();
  } catch (error) {
    if (isOptionalDataError(error)) {
      return fallbackValue;
    }

    throw error;
  }
}

function isOptionalDataError(error) {
  return error?.code === '42P01' || error?.statusCode === 503;
}
