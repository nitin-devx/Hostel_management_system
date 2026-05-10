import { Router } from 'express';
import * as appController from '../controllers/application.controller.js';
import { authenticate, authorizeAdmin, authorizeStudent } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { applyRoomValidation, updateApplicationValidation } from '../validations/hostel.validation.js';

const router = Router();

// Student routes
router.post('/', authenticate, authorizeStudent, applyRoomValidation, validate, appController.apply);
router.get('/my', authenticate, authorizeStudent, appController.getMyApplications);

// Admin routes
router.get('/', authenticate, authorizeAdmin, appController.getAll);
router.patch('/:id/status', authenticate, authorizeAdmin, updateApplicationValidation, validate, appController.updateStatus);

export default router;