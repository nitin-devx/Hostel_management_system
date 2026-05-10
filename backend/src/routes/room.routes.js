import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createRoomValidation, updateRoomValidation } from '../validations/hostel.validation.js';

const router = Router();

// ?available=true&hostelId=1
router.get('/', authenticate, roomController.getAll);
router.get('/:id', authenticate, roomController.getOne);

// Admin only
router.post('/', authenticate, authorizeAdmin, createRoomValidation, validate, roomController.create);
router.put('/:id', authenticate, authorizeAdmin, updateRoomValidation, validate, roomController.update);
router.delete('/:id', authenticate, authorizeAdmin, roomController.remove);

export default router;