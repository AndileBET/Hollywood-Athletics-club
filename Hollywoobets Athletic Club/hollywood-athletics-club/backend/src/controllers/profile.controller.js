import {
  getAthleteProfile,
  resolveUserId,
  upsertAthleteProfile,
} from '../services/supabase.service.js';

export async function getProfile(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const athlete = await getAthleteProfile(userId);

    res.json({
      athlete,
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
    const profile = await upsertAthleteProfile({
      ...req.body,
      id: req.body.id || userId,
    });

    res.json({
      athlete: profile,
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
