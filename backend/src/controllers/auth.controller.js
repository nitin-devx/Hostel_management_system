import * as authService from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    sendCreated(res, { message: 'Registration successful', data: { user } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    sendSuccess(res, { message: 'Login successful', data: result });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, { data: { user } });
  } catch (err) {
    next(err);
  }
};