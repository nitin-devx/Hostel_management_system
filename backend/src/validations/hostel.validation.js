import { body, param } from 'express-validator';

// ── Hostel ────────────────────────────────────────────────
export const createHostelValidation = [
  body('hostelName').trim().notEmpty().withMessage('Hostel name is required'),
  body('totalRooms').isInt({ min: 0 }).withMessage('totalRooms must be a non-negative integer'),
  body('description').optional().isString(),
];

export const updateHostelValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid hostel ID required'),
  body('hostelName').optional().trim().notEmpty().withMessage('Hostel name cannot be empty'),
  body('totalRooms').optional().isInt({ min: 0 }).withMessage('totalRooms must be a non-negative integer'),
];

// ── Room ──────────────────────────────────────────────────
export const createRoomValidation = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('hostelId').isInt({ min: 1 }).withMessage('Valid hostel ID required'),
];

export const updateRoomValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid room ID required'),
  body('roomNumber').optional().trim().notEmpty(),
  body('capacity').optional().isInt({ min: 1 }),
  body('occupied').optional().isInt({ min: 0 }),
];

// ── Application ───────────────────────────────────────────
export const applyRoomValidation = [
  body('roomId').isInt({ min: 1 }).withMessage('Valid room ID required'),
];

export const updateApplicationValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid application ID required'),
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('remarks').optional().isString(),
];