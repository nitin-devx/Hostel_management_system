import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signToken } from '../config/jwt.js';
import { BCRYPT_ROUNDS, ROLES } from '../constants/index.js';

export const registerUser = async ({ name, email, password, role = ROLES.STUDENT }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ name, email, password: hash, role });
  return sanitize(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: sanitize(user) };
};

export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

// Strip password from output
const sanitize = (user) => {
  const { password, ...safe } = user.toJSON();
  return safe;
};