import { Sequelize } from 'sequelize';
import { DB, ENV } from '../constants/index.js';
import { logger } from '../utils/logger.util.js';

const sequelize = new Sequelize(DB.NAME, DB.USER, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: 'postgres',
  logging: ENV.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  dialectOptions: ENV.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export const connectDB = async () => {
  await sequelize.authenticate();
  logger.success(`PostgreSQL connected → ${DB.HOST}:${DB.PORT}/${DB.NAME}`);
};

export default sequelize;