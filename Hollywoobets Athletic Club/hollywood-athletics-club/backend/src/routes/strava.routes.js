import { Router } from 'express';
import { getActivities, syncActivities } from '../controllers/strava.controller.js';

const router = Router();

router.get('/activities', getActivities);
router.post('/sync', syncActivities);

export default router;
