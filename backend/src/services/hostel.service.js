import { Hostel, Room } from '../models/index.js';

export const getAllHostels = async () => {
  return Hostel.findAll({
    include: [{ model: Room, as: 'rooms', attributes: ['id', 'roomNumber', 'capacity', 'occupied'] }],
    order: [['createdAt', 'DESC']],
  });
};

export const getHostelById = async (id) => {
  const hostel = await Hostel.findByPk(id, {
    include: [{ model: Room, as: 'rooms' }],
  });
  if (!hostel) {
    const err = new Error('Hostel not found');
    err.statusCode = 404;
    throw err;
  }
  return hostel;
};

export const createHostel = async (data) => {
  return Hostel.create(data);
};

export const updateHostel = async (id, data) => {
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    const err = new Error('Hostel not found');
    err.statusCode = 404;
    throw err;
  }
  return hostel.update(data);
};

export const deleteHostel = async (id) => {
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    const err = new Error('Hostel not found');
    err.statusCode = 404;
    throw err;
  }
  await hostel.destroy();
};