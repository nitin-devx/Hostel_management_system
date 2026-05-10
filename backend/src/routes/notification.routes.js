import { Router } from 'express';
import * as notifController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, notifController.getMyNotifications);
router.patch('/read-all', authenticate, notifController.markAllRead);
router.patch('/:id/read', authenticate, notifController.markOneRead);

export default router;