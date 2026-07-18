import { useState } from 'react';

/**
 * useLocalStorage Custom Hook
 * Provides an identical signature to useState while persisting state reactively inside localStorage.
 * Handles exceptions and parses objects/arrays cleanly.
 *
 * @template T
 * @param {string} key - Storage key.
 * @param {T} initialValue - Fallback initial state.
 * @returns {[T, (value: T | ((val: T) => T)) => void]}
 */
export default function useLocalStorage(key, initialValue) {
  // Initialize state defensively by checking local storage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`useLocalStorage: Failed parsing storage key "${key}". Falling back.`, error);
    }
    return initialValue;
  });

  // Returns a closure-safe functional state updater update function
  const setValue = (value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(`useLocalStorage: Failed writing storage key "${key}".`, error);
    }
  };

  return [storedValue, setValue];
}
