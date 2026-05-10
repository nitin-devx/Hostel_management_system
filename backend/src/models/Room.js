import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Room = sequelize.define(
  'Room',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { notEmpty: true },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    occupied: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    hostelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'hostels', key: 'id' },
      onDelete: 'CASCADE',
    },
    // Virtual — computed on read
    isAvailable: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.occupied < this.capacity;
      },
    },
  },
  {
    tableName: 'rooms',
    timestamps: true,
    underscored: true,
  }
);

export default Room;