import * as appService from '../services/application.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const apply = async (req, res, next) => {
  try {
    const application = await appService.applyForRoom(req.user.id, req.body.roomId);
    sendCreated(res, { message: 'Application submitted successfully', data: { application } });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await appService.getStudentApplications(req.user.id);
    sendSuccess(res, { data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const applications = await appService.getAllApplications(req.query);
    sendSuccess(res, { data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const application = await appService.updateApplicationStatus(req.params.id, req.body);
    sendSuccess(res, { message: `Application ${req.body.status}`, data: { application } });
  } catch (err) {
    next(err);
  }
};