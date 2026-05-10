import 'dotenv/config';
import { sequelize } from '../models/index.js';
import { logger } from '../utils/logger.util.js';

const sync = async (force = false) => {
  try {
    logger.info('Syncing database models...');
    await sequelize.sync({ force, alter: !force });
    logger.success('Database synced successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database sync failed:', error.message);
    process.exit(1);
  }
};

// Pass --force flag to drop and recreate all tables
const force = process.argv.includes('--force');
sync(force);