import api from './api';

/**
 * register
 * Registers a new user account.
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

/**
 * login
 * Authenticates login credentials.
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * logout
 * Clears local token session cache.
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
};

/**
 * getProfile
 * Fetches authenticated session profile.
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * updateProfile
 * Updates profile properties.
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};
