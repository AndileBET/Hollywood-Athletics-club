import { Router } from 'express';
import { getStravaAuthUrl, handleStravaCallback } from '../controllers/auth.controller.js';

const router = Router();

router.get('/strava/url', getStravaAuthUrl);
router.get('/strava/callback', handleStravaCallback);

export default router;
