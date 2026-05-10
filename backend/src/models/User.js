import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ROLES } from '../constants/index.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 150] },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(ROLES.STUDENT, ROLES.ADMIN),
      defaultValue: ROLES.STUDENT,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;