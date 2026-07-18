import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create Theme Context object
export const ThemeContext = createContext(null);

/**
 * ThemeProvider Component
 * Manages the light and dark state. Syncs selection state in local storage,
 * and handles adding/removing class tags from root html element.
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('crm_dark_mode', false);

  // Sync state changes with the DOM layout class tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles the active theme mode boolean state.
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Lets sub-nodes query isDarkMode state and toggle actions.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme hook must be executed inside a ThemeProvider wrapping tree.');
  }
  return context;
}
