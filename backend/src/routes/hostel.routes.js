import { Router } from 'express';
import * as hostelController from '../controllers/hostel.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createHostelValidation, updateHostelValidation } from '../validations/hostel.validation.js';

const router = Router();

// Public (authenticated users can view)
router.get('/', authenticate, hostelController.getAll);
router.get('/:id', authenticate, hostelController.getOne);

// Admin only
router.post('/', authenticate, authorizeAdmin, createHostelValidation, validate, hostelController.create);
router.put('/:id', authenticate, authorizeAdmin, updateHostelValidation, validate, hostelController.update);
router.delete('/:id', authenticate, authorizeAdmin, hostelController.remove);

export default router;