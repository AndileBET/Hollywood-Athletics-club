import { Router } from 'express';
import { getMarketplace } from '../controllers/marketplace.controller.js';

const router = Router();
router.get('/', getMarketplace);

export default router;
