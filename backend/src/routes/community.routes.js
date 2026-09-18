import { Router } from 'express';
import { createMessage, getMessages } from '../controllers/community.controller.js';
const router = Router(); router.get('/messages', getMessages); router.post('/messages', createMessage); export default router;
