import { Notification } from '../models/index.js';

export const createNotification = async (userId, message) => {
  return Notification.create({ userId, message });
};

export const getUserNotifications = async (userId) => {
  return Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

export const markAllRead = async (userId) => {
  await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
};

export const markOneRead = async (id, userId) => {
  const notif = await Notification.findOne({ where: { id, userId } });
  if (!notif) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  return notif.update({ isRead: true });
};

export const unreadCount = async (userId) => {
  return Notification.count({ where: { userId, isRead: false } });
};