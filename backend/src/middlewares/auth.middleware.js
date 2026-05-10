import { verifyToken } from '../config/jwt.js';
import { User } from '../models/index.js';
import { sendError } from '../utils/response.util.js';
import { HTTP_STATUS, ROLES } from '../constants/index.js';

/**
 * Verifies Bearer token and attaches req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, { message: 'Access token required', statusCode: HTTP_STATUS.UNAUTHORIZED });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return sendError(res, { message: 'User not found', statusCode: HTTP_STATUS.UNAUTHORIZED });
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, { message: 'Invalid or expired token', statusCode: HTTP_STATUS.UNAUTHORIZED });
  }
};

/**
 * Restricts access to admin role only
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return sendError(res, { message: 'Admin access required', statusCode: HTTP_STATUS.FORBIDDEN });
  }
  next();
};

/**
 * Restricts access to student role only
 */
export const authorizeStudent = (req, res, next) => {
  if (req.user?.role !== ROLES.STUDENT) {
    return sendError(res, { message: 'Student access required', statusCode: HTTP_STATUS.FORBIDDEN });
  }
  next();
};