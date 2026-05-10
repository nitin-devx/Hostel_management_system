import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { APP_STATUS } from '../constants/index.js';

const Application = sequelize.define(
  'Application',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'rooms', key: 'id' },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM(APP_STATUS.PENDING, APP_STATUS.APPROVED, APP_STATUS.REJECTED),
      defaultValue: APP_STATUS.PENDING,
      allowNull: false,
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'applications',
    timestamps: true,
    underscored: true,
  }
);

export default Application;