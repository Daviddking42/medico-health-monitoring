import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) =>
    apiClient.post('/auth/register', data),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  getProfile: () =>
    apiClient.get('/auth/profile')
};

export const patientAPI = {
  createProfile: (data) =>
    apiClient.post('/patient/profile', data),
  getProfile: () =>
    apiClient.get('/patient/profile'),
  updateProfile: (data) =>
    apiClient.put('/patient/profile', data)
};

export const deviceAPI = {
  registerDevice: (deviceId, deviceName) =>
    apiClient.post('/devices/register', { deviceId, deviceName }),
  getDevices: () =>
    apiClient.get('/devices'),
  recordData: (data) =>
    apiClient.post('/devices/data', data),
  getDeviceData: (deviceId, startDate, endDate) =>
    apiClient.get(`/devices/${deviceId}/data`, { params: { startDate, endDate } })
};

export const alertAPI = {
  getAlerts: (limit = 50) =>
    apiClient.get('/alerts', { params: { limit } }),
  markAsViewed: (alertId) =>
    apiClient.put(`/alerts/${alertId}/viewed`),
  createAlertRule: (data) =>
    apiClient.post('/alerts/rules', data),
  getAlertRules: () =>
    apiClient.get('/alerts/rules')
};

export default apiClient;
