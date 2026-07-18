import React from 'react';

/**
 * RecentLeads Component
 * Lists the last 5 added sales leads in a responsive tables format.
 *
 * @param {Object} props
 * @param {Array} props.leads - Array of lead objects to slice and display.
 */
export default function RecentLeads({ leads = [] }) {
  // Sort leads by dateAdded descending and limit to 5 records
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded))
    .slice(0, 5);

  // Styling rules for badges matching design system semantic colors
  const badgeClasses = {
    'New': 'bg-blue-50 dark:bg-blue-950/20 text-blue-750 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
    'Contacted': 'bg-amber-55/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    'In Progress': 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30',
    'Won': 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30',
    'Lost': 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30',
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex-1 transition-colors duration-200">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-50">Recent Leads</h3>
      </div>
      <div className="overflow-x-auto">
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No leads found. Use Quick Actions to add your first sales lead.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-705/700 dark:text-slate-350">
              <tr>
                <th className="px-6 py-3">Lead Name</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-50">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300">
                    {lead.company}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        badgeClasses[lead.status] || 'bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(lead.createdAt || lead.dateAdded).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
