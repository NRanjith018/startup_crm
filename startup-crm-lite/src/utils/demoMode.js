/**
 * demoMode.js
 * Utilities for demo/offline mode — bypasses backend when unavailable.
 */

export const DEMO_USER = {
  _id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@crmlite.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const DEMO_TOKEN = 'demo-token-crmlite-static';

export const DEMO_CREDENTIALS = {
  email: 'demo@crmlite.com',
  password: 'demo1234',
};

/** Check if current session is a demo session */
export const isDemoMode = () =>
  localStorage.getItem('crm-token') === DEMO_TOKEN;

/** Activate demo session in localStorage */
export const activateDemoMode = () => {
  localStorage.setItem('crm-token', DEMO_TOKEN);
};

/** Clear demo session */
export const clearDemoMode = () => {
  localStorage.removeItem('crm-token');
};
