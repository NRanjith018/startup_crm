import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

// Create Auth Context object
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages user credentials session state and requests profile REST parameters from server.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session on application startup
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
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
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data.token) {
        localStorage.setItem('crm-token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res;
      }
      throw new Error(res.message || 'Login failed.');
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
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  /**
   * updateProfile
   * Requests name/password modifications from the backend.
   */
  const updateProfile = async (data) => {
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
