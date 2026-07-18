import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance using the VITE_API_URL environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor: Attach JWT Bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Catch authentication expiry (401) and network failures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // If 401 Unauthorized, clear storage tokens and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('crm-token');
        // Prevent infinite redirect loops if already on auth routes
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register' && path !== '/landing') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Network failure (server is down or connection lost)
      toast.error('Cannot connect to server. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
