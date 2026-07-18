import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context object
export const AuthContext = createContext(null);

// Default mock user matching the student report details
const MOCK_USER = {
  name: 'Bhojanapu Devaraj',
  email: 'devaraj.b@mits.ac.in',
  company: 'MITS Lead Management',
  registerNo: '25695A0514',
};

/**
 * AuthProvider Component
 * Manages the logged-in user state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('crm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('crm_user');
    }
  }, [user]);

  /**
   * Log in user using email and password.
   * Logs in default mock user for demonstration.
   */
  const login = (email, password) => {
    // If logging in, seed the default user
    setUser({
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    });
    return true;
  };

  /**
   * Registers a new user account.
   */
  const register = (userData) => {
    setUser({
      name: userData.name,
      email: userData.email,
      company: userData.company || 'Enterprise CRM',
      registerNo: userData.registerNo || 'N/A',
    });
    return true;
  };

  /**
   * Logs out the current user session.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Updates current user profile details.
   */
  const updateProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
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
