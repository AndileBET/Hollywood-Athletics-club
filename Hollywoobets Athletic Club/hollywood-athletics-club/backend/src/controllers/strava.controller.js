import { listActivities, upsertActivities } from '../services/activity.service.js';
import {
  getValidStravaAccessToken,
  listStravaActivities,
} from '../services/strava.service.js';
import { resolveUserId } from '../services/supabase.service.js';

export async function getActivities(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const activities = await listActivities(userId);

    res.json({ activities });
  } catch (error) {
    next(error);
  }
}

export async function syncActivities(req, res, next) {
  try {
    const userId = await resolveUserId(req);

    const accessToken = await getValidStravaAccessToken(userId);

    if (!accessToken) {
      res.status(409).json({
        error: 'No Strava token found for this user. Connect Strava first.',
      });
      return;
    }

    const stravaActivities = await listStravaActivities(accessToken, req.body || {});
    const activities = await upsertActivities(userId, stravaActivities);

    res.json({
      imported: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
}
