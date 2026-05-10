import { Room, Hostel } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllRooms = async ({ available, hostelId } = {}) => {
  const where = {};
  if (hostelId) where.hostelId = hostelId;

  const rooms = await Room.findAll({
    where,
    include: [{ model: Hostel, as: 'hostel', attributes: ['id', 'hostelName'] }],
    order: [['hostelId', 'ASC'], ['roomNumber', 'ASC']],
  });

  if (available === 'true' || available === true) {
    return rooms.filter((r) => r.isAvailable);
  }
  return rooms;
};

export const getRoomById = async (id) => {
  const room = await Room.findByPk(id, {
    include: [{ model: Hostel, as: 'hostel' }],
  });
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  return room;
};

export const createRoom = async (data) => {
  const hostel = await Hostel.findByPk(data.hostelId);
  if (!hostel) {
    const err = new Error('Hostel not found');
    err.statusCode = 404;
    throw err;
  }
  return Room.create(data);
};

export const updateRoom = async (id, data) => {
  const room = await Room.findByPk(id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  return room.update(data);
};

export const deleteRoom = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  await room.destroy();
};