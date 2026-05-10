import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorizeAdmin, adminController.getDashboard);
router.get('/students', authenticate, authorizeAdmin, adminController.getStudents);
router.delete('/students/:id', authenticate, authorizeAdmin, adminController.deleteStudent);

export default router;