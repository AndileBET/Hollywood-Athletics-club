import { env } from '../config/env.js';
import {
  exchangeStravaCode,
  getStravaAuthorizationUrl,
  saveStravaTokens,
} from '../services/strava.service.js';

export function getStravaAuthUrl(req, res, next) {
  try {
    const userId = req.query.userId || env.defaultUserId;

    if (!userId) {
      res.status(400).json({
        error: 'Provide userId as a query parameter or set DEFAULT_USER_ID in .env.',
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
