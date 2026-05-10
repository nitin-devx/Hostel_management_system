export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const APP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Student
  STUDENT_DASHBOARD: '/dashboard',
  HOSTELS: '/hostels',
  ROOMS: '/rooms',
  MY_APPLICATIONS: '/my-applications',
  NOTIFICATIONS: '/notifications',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOSTELS: '/admin/hostels',
  ADMIN_ROOMS: '/admin/rooms',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_STUDENTS: '/admin/students',
};
