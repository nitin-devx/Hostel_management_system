import sequelize from '../config/database.js';
import { Application, Room, User, Hostel } from '../models/index.js';
import { APP_STATUS } from '../constants/index.js';
import { createNotification } from './notification.service.js';

// Student applies for a room
export const applyForRoom = async (studentId, roomId) => {
  return sequelize.transaction(async (t) => {
    // Block duplicate active application
    const existing = await Application.findOne({
      where: { studentId, status: [APP_STATUS.PENDING, APP_STATUS.APPROVED] },
      transaction: t,
    });
    if (existing) {
      const err = new Error('You already have a pending or approved application');
      err.statusCode = 409;
      throw err;
    }

    // Check room availability
    const room = await Room.findByPk(roomId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!room) {
      const err = new Error('Room not found');
      err.statusCode = 404;
      throw err;
    }
    if (!room.isAvailable) {
      const err = new Error('Room is fully occupied');
      err.statusCode = 409;
      throw err;
    }

    const app = await Application.create({ studentId, roomId, status: APP_STATUS.PENDING }, { transaction: t });

    await createNotification(studentId, `Your application for room ${room.roomNumber} has been submitted and is pending review.`);

    return app;
  });
};

// Admin updates application status
export const updateApplicationStatus = async (appId, { status, remarks }) => {
  return sequelize.transaction(async (t) => {
    const app = await Application.findByPk(appId, {
      
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!app) {
      const err = new Error('Application not found');
      err.statusCode = 404;
      throw err;
    }
    await app.reload({
      include: [
        { model: Room, as: 'room' },
        { model: User, as: 'student' },
      ],
      transaction: t,
    });

    if (app.status !== APP_STATUS.PENDING) {
      const err = new Error('Only pending applications can be updated');
      err.statusCode = 409;
      throw err;
    }

    // If approving — check seat count again then increment
    if (status === APP_STATUS.APPROVED) {
      const room = await Room.findByPk(app.roomId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!room.isAvailable) {
        const err = new Error('Room is fully occupied — cannot approve');
        err.statusCode = 409;
        throw err;
      }
      await room.increment('occupied', { by: 1, transaction: t });
    }

    await app.update({ status, remarks: remarks || null }, { transaction: t });

    const msg =
      status === APP_STATUS.APPROVED
        ? `🎉 Congratulations! Your application for room ${app.room.roomNumber} has been APPROVED.`
        : `Your application for room ${app.room.roomNumber} has been REJECTED. ${remarks ? `Reason: ${remarks}` : ''}`;

    await createNotification(app.studentId, msg);

    return app.reload({ transaction: t });
  });
};

// Get all applications (admin)
export const getAllApplications = async ({ status } = {}) => {
  const where = {};
  if (status) where.status = status;

  return Application.findAll({
    where,
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
      { model: Room, as: 'room', include: [{ model: Hostel, as: 'hostel', attributes: ['hostelName'] }] },
    ],
    order: [['createdAt', 'DESC']],
  });
};

// Get applications for a student
export const getStudentApplications = async (studentId) => {
  return Application.findAll({
    where: { studentId },
    include: [
      { model: Room, as: 'room', include: [{ model: Hostel, as: 'hostel', attributes: ['hostelName'] }] },
    ],
    order: [['createdAt', 'DESC']],
  });
};