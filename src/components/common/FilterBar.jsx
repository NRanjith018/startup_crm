import React from 'react';
import { LEAD_STATUSES } from '../../constants/leads';

/**
 * FilterBar Component
 * Displays a scrollable horizontal row of status filter selectors,
 * indicating active state and dynamic counts for each category.
 * Pulls categories dynamically from centralized leads constants.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - Current active selection.
 * @param {Function} props.onFilterChange - Callback when filter category is clicked.
 * @param {Array} props.leads - Unified leads database list to count metrics from.
 */
function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  // Build filter options: 'All' + status values from constants
  const filterOptions = [
    { label: 'All', value: 'All' },
    ...LEAD_STATUSES.map((status) => ({ label: status, value: status })),
  ];

  // Helper counting function
  const getCount = (status) => {
    if (status === 'All') return leads.length;
    return leads.filter((lead) => lead.status === status).length;
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-1">
      <div className="flex items-center gap-2 min-w-max">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;
          const count = getCount(option.value);

          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-blue-700/60 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(FilterBar);
