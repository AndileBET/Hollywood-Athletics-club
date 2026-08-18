import { Router } from 'express';

import {
  getStravaAuthUrl,
  handleStravaCallback,
} from '../controllers/auth.controller.js';

import {
  requireAuth,
} from '../middleware/auth.middleware.js';

const router = Router();

/*
 * User must be logged into Hollywood Athletics
 * before they can connect a Strava account.
 */
router.get(
  '/strava/url',
  requireAuth,
  getStravaAuthUrl
);

/*
 * Do NOT put requireAuth here.
 *
 * Strava redirects the browser to this URL after
 * authorization, so this callback is handled separately.
 */
router.get(
  '/strava/callback',
  handleStravaCallback
);

export default router;