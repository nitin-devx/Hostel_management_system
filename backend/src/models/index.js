import sequelize from '../config/database.js';
import User from './User.js';
import Hostel from './Hostel.js';
import Room from './Room.js';
import Application from './Application.js';
import Notification from './Notification.js';

// ── Hostel ↔ Room ──────────────────────────────────────────
Hostel.hasMany(Room, { foreignKey: 'hostelId', as: 'rooms', onDelete: 'CASCADE' });
Room.belongsTo(Hostel, { foreignKey: 'hostelId', as: 'hostel' });

// ── User ↔ Application ────────────────────────────────────
User.hasMany(Application, { foreignKey: 'studentId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// ── Room ↔ Application ────────────────────────────────────
Room.hasMany(Application, { foreignKey: 'roomId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// ── User ↔ Notification ───────────────────────────────────
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Hostel, Room, Application, Notification };