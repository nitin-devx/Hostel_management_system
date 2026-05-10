import * as hostelService from '../services/hostel.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const getAll = async (req, res, next) => {
  try {
    const hostels = await hostelService.getAllHostels();
    sendSuccess(res, { data: { hostels } });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const hostel = await hostelService.getHostelById(req.params.id);
    sendSuccess(res, { data: { hostel } });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const hostel = await hostelService.createHostel(req.body);
    sendCreated(res, { message: 'Hostel created', data: { hostel } });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const hostel = await hostelService.updateHostel(req.params.id, req.body);
    sendSuccess(res, { message: 'Hostel updated', data: { hostel } });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await hostelService.deleteHostel(req.params.id);
    sendSuccess(res, { message: 'Hostel deleted' });
  } catch (err) {
    next(err);
  }
};