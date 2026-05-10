import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const DB = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: Number(process.env.DB_PORT) || 5432,
  NAME: process.env.DB_NAME || 'hostel_db',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'postgres',
};

export const JWT = {
  SECRET: process.env.JWT_SECRET || 'fallback_dev_secret',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const APP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};