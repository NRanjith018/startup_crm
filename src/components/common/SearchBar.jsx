import React, { useState, useEffect } from 'react';
// Import magnifying glass and cancel icons
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * Renders a high-performance debounced search input field with Lucide icons.
 *
 * @param {Object} props
 * @param {string} props.value - Active search query value.
 * @param {Function} props.onChange - Search value update callback.
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync internal field state with prop updates
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounces typing inputs for 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  // Clear handler trigger
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-grow max-w-md">
      {/* Left Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4.5 w-4.5 text-slate-400" aria-hidden="true" />
      </div>

      {/* Styled text input */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-800 pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors shadow-sm"
        placeholder="Search by name, company, or email..."
        aria-label="Search leads"
      />

      {/* Right clear icon (shown only when text is typed) */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Clear search input"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
