import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';
import { sequelize } from './models/index.js';
import { logger } from './utils/logger.util.js';
import { ENV } from './constants/index.js';

const PORT = ENV.PORT || 5000;

const startServer = async () => {
  try {
    // Connect & sync models (alter:true = non-destructive)
    await connectDB();
    await sequelize.sync({ alter: true });
    logger.success('Database models synced');

    app.listen(PORT, () => {
      logger.success(`🚀 Server → http://localhost:${PORT}  [${ENV.NODE_ENV}]`);
      logger.info('API base: hostel_management/api/v1');
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();