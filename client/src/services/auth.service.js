// services/auth.service.js
// Thin wrapper around the auth endpoints. Components/context should call
// these functions rather than using `api` directly, so the API surface
// stays consistent and easy to mock in tests.

import api from './api';

const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data.data; // { token, user }
};

const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data.data; // sanitized user object
};

export const authService = { login, logout, getProfile };
