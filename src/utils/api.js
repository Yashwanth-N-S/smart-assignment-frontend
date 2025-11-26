import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Debug logging
console.log('API Base URL:', API_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message, error.config?.url);
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - check your connection';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - check if backend is running';
    }
    return Promise.reject(error);
  }
);

export default api;