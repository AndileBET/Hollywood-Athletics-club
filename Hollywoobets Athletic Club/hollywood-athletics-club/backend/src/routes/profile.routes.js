import { Router } from 'express';
import { getProfile, saveProfile } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', getProfile);
router.patch('/', saveProfile);

export default router;
