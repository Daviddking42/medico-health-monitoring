import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual hosted backend URL or local tunnel URL
const API_URL = 'https://medico-health-monitoring-backend-ojo7qnwh5.vercel.app/api'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const deviceAPI = {
  getDevices: () => api.get('/devices'),
  registerDevice: (deviceId, deviceName) => api.post('/devices/register', { deviceId, deviceName }),
};

export const alertAPI = {
  getAlerts: () => api.get('/alerts'),
  markAsViewed: (id) => api.put(`/alerts/${id}/view`),
};

export const doctorAPI = {
  getPatients: () => api.get('/doctor/patients'),
  getPatientVitals: (patientId) => api.get(`/doctor/patients/${patientId}/vitals`),
};

export const relativeAPI = {
  getPatients: () => api.get('/relative/patients'),
  getPatientVitals: (patientId) => api.get(`/relative/patients/${patientId}/vitals`),
  linkPatient: (patientName) => api.post('/relative/link', { patientName }),
};

export default api;
