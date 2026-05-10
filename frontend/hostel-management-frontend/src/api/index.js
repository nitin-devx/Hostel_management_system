import api from './axios.js';

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Hostels ───────────────────────────────────────────────
export const hostelApi = {
  getAll: () => api.get('/hostels'),
  getOne: (id) => api.get(`/hostels/${id}`),
  create: (data) => api.post('/hostels', data),
  update: (id, data) => api.put(`/hostels/${id}`, data),
  delete: (id) => api.delete(`/hostels/${id}`),
};

// ── Rooms ─────────────────────────────────────────────────
export const roomApi = {
  getAll: (params) => api.get('/rooms', { params }),
  getOne: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// ── Applications ──────────────────────────────────────────
export const applicationApi = {
  apply: (roomId) => api.post('/applications', { roomId }),
  getMine: () => api.get('/applications/my'),
  getAll: (params) => api.get('/applications', { params }),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
};

// ── Notifications ──────────────────────────────────────────
export const notificationApi = {
  getMine: () => api.get('/notifications'),
  markAllRead: () => api.patch('/notifications/read-all'),
  markOneRead: (id) => api.patch(`/notifications/${id}/read`),
};

// ── Admin ─────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: () => api.get('/admin/students'),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
};
