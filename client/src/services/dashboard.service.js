// services/dashboard.service.js
import api from './api';

const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data.data;
};

export const dashboardService = { getDashboard };
