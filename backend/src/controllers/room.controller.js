import * as roomService from '../services/room.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const getAll = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms(req.query);
    sendSuccess(res, { data: { rooms } });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    sendSuccess(res, { data: { room } });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    sendCreated(res, { message: 'Room created', data: { room } });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    sendSuccess(res, { message: 'Room updated', data: { room } });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    sendSuccess(res, { message: 'Room deleted' });
  } catch (err) {
    next(err);
  }
};