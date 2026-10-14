import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import {
  DEMO_USER,
  DEMO_TOKEN,
  DEMO_CREDENTIALS,
  isDemoMode,
  activateDemoMode,
  clearDemoMode,
} from '../utils/demoMode';

// Create Auth Context object
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages user credentials session state and requests profile REST parameters from server.
 * Falls back to demo mode when backend is unavailable.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Restore user session on application startup
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        // Restore demo session directly without hitting backend
        if (token === DEMO_TOKEN) {
          setUser(DEMO_USER);
          setIsDemo(true);
          setIsLoading(false);
          return;
        }

        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
            setIsDemo(false);
          } else {
            // Invalidate session if backend rejects
            setToken(null);
            localStorage.removeItem('crm-token');
          }
        } catch (error) {
          console.error('Failed restoring user session:', error);
          setToken(null);
          localStorage.removeItem('crm-token');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, [token]);

  /**
   * login
   * Logs in a user using email and password, setting token and account payload on success.
   * Falls back to demo mode if credentials match demo credentials or backend is unreachable.
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Check for demo credentials first (works fully offline)
      if (
        email === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        activateDemoMode();
        setToken(DEMO_TOKEN);
        setUser(DEMO_USER);
        setIsDemo(true);
        return { success: true, demo: true };
      }

      const res = await authService.login(email, password);
      if (res.success && res.data.token) {
        localStorage.setItem('crm-token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsDemo(false);
        return res;
      }
      throw new Error(res.message || 'Login failed.');
    } catch (err) {
      // If backend is completely unreachable, offer demo mode hint
      const isNetworkError = !err.response && err.request;
      if (isNetworkError) {
        throw new Error(
          'Cannot reach server. Use demo@crmlite.com / demo1234 to explore offline.'
        );
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * register
   * Registers a new account and initializes active login session.
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      if (res.success && res.data.token) {
        localStorage.setItem('crm-token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsDemo(false);
        return res;
      }
      throw new Error(res.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * logout
   * Clears state and localStorage, then redirects to /login.
   */
  const logout = () => {
    authService.logout();
    clearDemoMode();
    setToken(null);
    setUser(null);
    setIsDemo(false);
    window.location.href = '/login';
  };

  /**
   * updateProfile
   * Requests name/password modifications from the backend.
   * In demo mode, updates local state only.
   */
  const updateProfile = async (data) => {
    if (isDemo) {
      const updated = { ...DEMO_USER, ...data };
      setUser(updated);
      return { success: true, data: updated };
    }
    try {
      const res = await authService.updateProfile(data);
      if (res.success) {
        setUser(res.data);
        return res;
      }
      throw new Error(res.message || 'Profile update failed.');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isDemo,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Custom Hook
 * Provides components convenient access to the global AuthContext state.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook must be executed inside an AuthProvider wrapping tree.');
  }
  return context;
}
