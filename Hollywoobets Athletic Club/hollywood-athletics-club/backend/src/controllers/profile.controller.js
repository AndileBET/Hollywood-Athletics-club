import {
  getAthleteProfile,
  resolveUserId,
  updateAthleteProfile,
} from '../services/supabase.service.js';
import { listActivities } from '../services/activity.service.js';
import { calculateTotalPoints } from '../services/points.service.js';

export async function getProfile(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const [athlete, activities] = await Promise.all([
      getAthleteProfile(userId),
      listActivities(userId),
    ]);

    res.json({
      athlete,
      points: calculateTotalPoints(activities),
    });
  } catch (error) {
    console.error('Profile endpoint failed', {
      path: req.originalUrl,
      query: req.query,
      hasDefaultUserId: Boolean(process.env.DEFAULT_USER_ID),
      message: error.message,
      code: error.code || null,
      details: error.details || null,
      hint: error.hint || null,
    });
    next(error);
  }
}

export async function saveProfile(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const profile = await updateAthleteProfile(userId, req.body);
    const activities = await listActivities(userId);

    res.json({
      athlete: profile,
      points: calculateTotalPoints(activities),
    });
  } catch (error) {
    console.error('Profile save failed', {
      path: req.originalUrl,
      query: req.query,
      hasDefaultUserId: Boolean(process.env.DEFAULT_USER_ID),
      message: error.message,
      code: error.code || null,
      details: error.details || null,
      hint: error.hint || null,
    });
    next(error);
  }
}
