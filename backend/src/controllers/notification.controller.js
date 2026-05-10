import * as notifService from '../services/notification.service.js';
import { sendSuccess } from '../utils/response.util.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await notifService.getUserNotifications(req.user.id);
    const unread = await notifService.unreadCount(req.user.id);
    sendSuccess(res, { data: { notifications, unread } });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await notifService.markAllRead(req.user.id);
    sendSuccess(res, { message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

export const markOneRead = async (req, res, next) => {
  try {
    const notif = await notifService.markOneRead(req.params.id, req.user.id);
    sendSuccess(res, { data: { notification: notif } });
  } catch (err) {
    next(err);
  }
};