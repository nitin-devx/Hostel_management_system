import { Router } from 'express';
import authRoutes from './auth.routes.js';
import hostelRoutes from './hostel.routes.js';
import roomRoutes from './room.routes.js';
import applicationRoutes from './application.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hostels', hostelRoutes);
router.use('/rooms', roomRoutes);
router.use('/applications', applicationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;