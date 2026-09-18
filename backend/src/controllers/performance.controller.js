import { listActivities } from '../services/activity.service.js';
import { buildPerformanceStats } from '../services/stats.service.js';
import { resolveUserId } from '../services/supabase.service.js';
import { demoActivities } from '../services/demo-data.service.js';

export async function getPerformance(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const result = await safeRead(() => listActivities(userId), []);
    const activities = result.length ? result : demoActivities();
    res.json({ activities, ...buildPerformanceStats(activities) });
  } catch (error) { next(error); }
}

async function safeRead(readFn, fallbackValue) {
  try { return await readFn(); } catch (error) { if (error?.code === '42P01' || error?.statusCode === 503) return fallbackValue; throw error; }
}
