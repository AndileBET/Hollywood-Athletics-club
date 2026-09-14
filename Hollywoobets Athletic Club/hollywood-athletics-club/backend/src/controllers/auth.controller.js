import { env } from '../config/env.js';
import {
  exchangeStravaCode,
  getStravaAuthorizationUrl,
  saveStravaTokens,
} from '../services/strava.service.js';

export function getStravaAuthUrl(req, res, next) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'You must be logged in before connecting Strava.',
      });
      return;
    }

    res.json({
      url: getStravaAuthorizationUrl(userId),
    });
  } catch (error) {
    next(error);
  }
}
export async function handleStravaCallback(req, res, next) {
  try {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      res.status(400).json({
        error: 'Strava callback requires code and state.',
      });
      return;
    }

    const tokenPayload = await exchangeStravaCode(code);
    await saveStravaTokens(userId, tokenPayload);

    res.redirect(`${env.clientUrl}?strava=connected`);
  } catch (error) {
    next(error);
  }
}
