import { Router } from 'express';
import { getRewards } from '../controllers/rewards.controller.js';

const router = Router();
router.get('/', getRewards);

export default router;
