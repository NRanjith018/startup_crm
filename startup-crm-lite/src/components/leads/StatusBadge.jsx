import React from 'react';

/**
 * StatusBadge Component
 * Renders a pill-shaped colored badge corresponding to the lead's status.
 *
 * @param {Object} props
 * @param {string} props.status - The lead's current sales pipeline stage.
 */
function StatusBadge({ status }) {
  // Styles conforming to Phase 6 status-specific specifications
  const statusStyles = {
    'New': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'Contacted': 'bg-blue-50 dark:bg-blue-950/20 text-blue-750 dark:text-blue-450 border-blue-200 dark:border-blue-900/30',
    'Meeting Scheduled': 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    'Proposal Sent': 'bg-purple-50 dark:bg-purple-950/20 text-purple-705/700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30',
    'Won': 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30',
    'Lost': 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        statusStyles[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
      }`}
    >
      {status}
    </span>
  );
}

export default React.memo(StatusBadge);
