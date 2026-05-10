import jwt from 'jsonwebtoken';
import { JWT } from '../constants/index.js';

export const signToken = (payload) => {
  return jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT.SECRET);
};