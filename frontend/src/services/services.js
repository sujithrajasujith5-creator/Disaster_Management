import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAdmins: () => api.get('/auth/admins'),
};

export const incidentAPI = {
  getDashboard: () => api.get('/incidents/dashboard'),
  getMyReports: () => api.get('/incidents/my'),
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (formData) =>
    api.post('/incidents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/incidents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/incidents/${id}`),
  updateStatus: (id, data) => api.put(`/incidents/${id}/status`, data),
  getStatistics: () => api.get('/incidents/admin/statistics'),
};

export const helpRequestAPI = {
  create: (data) => api.post('/help-requests', data),
  getMy: () => api.get('/help-requests/my'),
  getAll: (params) => api.get('/help-requests', { params }),
  update: (id, data) => api.put(`/help-requests/${id}`, data),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  sendEmergency: (data) => api.post('/notifications/emergency', data),
  getHistory: () => api.get('/notifications/history'),
};

export const commentAPI = {
  getAll: (incidentId) => api.get(`/incidents/${incidentId}/comments`),
  create: (incidentId, data) => api.post(`/incidents/${incidentId}/comments`, data),
  delete: (incidentId, id) => api.delete(`/incidents/${incidentId}/comments/${id}`),
};
