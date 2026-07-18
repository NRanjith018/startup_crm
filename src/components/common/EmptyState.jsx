import React from 'react';
// Import icons from Lucide for representing empty lists
import { FolderOpen, SearchX } from 'lucide-react';

/**
 * EmptyState Component
 * Displays instructions and clear actions when datasets have zero results.
 *
 * @param {Object} props
 * @param {boolean} props.isFilterActive - True if search query or status filter is set.
 * @param {Function} props.onClearFilters - Resets all active search and filter controls.
 * @param {number} props.totalLeadsCount - Total count of leads in database.
 */
export default function EmptyState({ isFilterActive, onClearFilters, totalLeadsCount }) {
  const isTotallyEmpty = totalLeadsCount === 0;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 border-dashed bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
      {/* Visual icon representation */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500">
        {isTotallyEmpty ? (
          <FolderOpen className="h-6 w-6" />
        ) : (
          <SearchX className="h-6 w-6" />
        )}
      </div>

      {/* Main warning text header */}
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {isTotallyEmpty ? 'No leads added yet' : 'No leads found'}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isTotallyEmpty
          ? 'Get started by creating your first sales lead to begin tracking your pipeline.'
          : 'Your search and status filters did not return any records. Try adjusting your settings.'}
      </p>

      {/* Reset button shown only when searches or filters cleared the view */}
      {!isTotallyEmpty && isFilterActive && (
        <div className="mt-6">
          <button
            onClick={onClearFilters}
            className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-350 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}
