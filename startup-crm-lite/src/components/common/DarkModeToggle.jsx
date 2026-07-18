import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * DarkModeToggle Component
 * Displays a styled theme switcher.
 * Adapts contextually:
 * - Mobile/Desktop: text labels + animated pill track toggle slider.
 * - Tablet dock (md) / Collapsed sidebar: Sun/Moon icon only centered.
 *
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Indicates if parent sidebar is shrunk on desktop.
 */
export default function DarkModeToggle({ isCollapsed = false }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex w-full items-center justify-between md:justify-center ${
        isCollapsed ? 'lg:justify-center' : 'lg:justify-between'
      } px-3 md:px-2 lg:px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer focus:outline-none min-h-[44px] min-w-[44px]`}
      aria-label="Toggle visual theme"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Icon + Label descriptor */}
      <div className="flex items-center gap-3 md:gap-0 lg:gap-3">
        {isDarkMode ? (
          <Moon className="h-4.5 w-4.5 text-blue-400 transition-transform duration-300 rotate-12 flex-shrink-0" />
        ) : (
          <Sun className="h-4.5 w-4.5 text-amber-500 transition-transform duration-300 rotate-0 flex-shrink-0" />
        )}
        {/* Dynamic class to prevent CSS class specificity collisions */}
        <span className={`md:hidden ${isCollapsed ? '' : 'lg:inline'} whitespace-nowrap`}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      {/* Animated toggle slider pill (hidden on tablet/collapsed sidebar, visible on mobile & expanded desktop) */}
      <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 items-center p-0.5 md:hidden ${
        isCollapsed ? '' : 'lg:flex'
      } flex-shrink-0 ${
        isDarkMode ? 'bg-blue-600' : 'bg-slate-200'
      }`}>
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isDarkMode ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
