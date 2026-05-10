import * as adminService from '../services/admin.service.js';
import { sendSuccess } from '../utils/response.util.js';

export const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, { data: { stats } });
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await adminService.getAllStudents();
    sendSuccess(res, { data: { students } });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await adminService.deleteStudent(req.params.id);
    sendSuccess(res, { message: 'Student removed' });
  } catch (err) {
    next(err);
  }
};