import { APP_STATUS } from '../constants/index.js';

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const getStatusBadgeClass = (status) => {
  const map = {
    [APP_STATUS.PENDING]:  'badge-pending',
    [APP_STATUS.APPROVED]: 'badge-approved',
    [APP_STATUS.REJECTED]: 'badge-rejected',
  };
  return map[status] || 'badge';
};

export const getAvailabilityBadge = (occupied, capacity) => {
  return occupied < capacity ? 'badge-available' : 'badge-full';
};

export const getAvailabilityLabel = (occupied, capacity) => {
  if (occupied >= capacity) return 'Full';
  const free = capacity - occupied;
  return `${free} seat${free > 1 ? 's' : ''} free`;
};

export const extractError = (err) =>
  err?.response?.data?.message || err?.message || 'An error occurred';