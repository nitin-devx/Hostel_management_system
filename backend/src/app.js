import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { ENV } from './constants/index.js';

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));

// ── Logging ───────────────────────────────────────────────
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', env: ENV.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────
app.use('/hostel_management/api/v1', router);

// ── 404 + Global Error Handler ────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;