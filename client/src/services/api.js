// services/api.js
// Single Axios instance used by every service in the app.
// - Request interceptor attaches the JWT automatically.
// - Response interceptor handles global 401 (expired/invalid token) by
//   clearing the session; the AuthContext listens for this via a custom
//   event so it can also update React state and redirect.

import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.findToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      tokenStorage.clearSession();
      // Notify the rest of the app (AuthContext) without creating a
      // circular import between api.js and AuthContext.jsx.
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
