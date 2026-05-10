import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Hostel = sequelize.define(
  'Hostel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostelName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    totalRooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'hostels',
    timestamps: true,
    underscored: true,
  }
);

export default Hostel;