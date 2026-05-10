import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Runs after express-validator chains; returns 400 if any errors exist.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      message: 'Validation failed',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};