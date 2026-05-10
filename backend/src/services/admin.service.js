import { User, Hostel, Room, Application } from '../models/index.js';
import { ROLES, APP_STATUS } from '../constants/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export const getDashboardStats = async () => {
  const [totalStudents, totalHostels, totalRooms, pendingApps, approvedApps, rejectedApps] = await Promise.all([
    User.count({ where: { role: ROLES.STUDENT } }),
    Hostel.count(),
    Room.count(),
    Application.count({ where: { status: APP_STATUS.PENDING } }),
    Application.count({ where: { status: APP_STATUS.APPROVED } }),
    Application.count({ where: { status: APP_STATUS.REJECTED } }),
  ]);

  // Occupancy
  const rooms = await Room.findAll({ attributes: ['capacity', 'occupied'] });
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = rooms.reduce((s, r) => s + r.occupied, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return {
    totalStudents,
    totalHostels,
    totalRooms,
    applications: { pending: pendingApps, approved: approvedApps, rejected: rejectedApps },
    occupancy: { total: totalCapacity, occupied: totalOccupied, available: totalCapacity - totalOccupied, rate: occupancyRate },
  };
};

export const getAllStudents = async () => {
  return User.findAll({
    where: { role: ROLES.STUDENT },
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
};

export const deleteStudent = async (id) => {
  const user = await User.findOne({ where: { id, role: ROLES.STUDENT } });
  if (!user) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  await user.destroy();
};