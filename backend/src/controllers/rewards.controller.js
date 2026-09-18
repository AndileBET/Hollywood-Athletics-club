import { listActivities } from '../services/activity.service.js';
import { buildRewards } from '../services/rewards.service.js';
import { resolveUserId } from '../services/supabase.service.js';
import { demoActivities } from '../services/demo-data.service.js';
export async function getRewards(req, res, next) { try { const userId = await resolveUserId(req); const result = await listActivities(userId); const activities = result.length ? result : demoActivities(); res.json(buildRewards(activities)); } catch (error) { next(error); } }
