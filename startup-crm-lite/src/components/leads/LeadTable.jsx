import React from 'react';
// Import Pencil and Trash2 icons for action column elements
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';

/**
 * LeadTable Component
 * Responsive wrapper.
 * - Mobile: Forces cards layout even if viewMode is 'table'.
 * - Tablet: Shows card grid or table based on selected viewMode.
 * - Desktop: Renders table columns.
 */
export default function LeadTable({ leads = [], viewMode = 'table', onEdit, onDelete }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-sm">
        No sales leads match the current filters. Try adding a new lead!
      </div>
    );
  }

  // If viewMode is explicitly 'grid' (selected by toggle), render cards on all screen sizes
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // If viewMode is 'table', render:
  // 1. Mobile card stack (visible only on <768px)
  // 2. Desktop tabular view (visible only on >=768px)
  return (
    <div className="space-y-6">
      {/* 1. Mobile card fallback stack */}
      <div className="block md:hidden space-y-4">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 2. Tablet & Desktop tabular view */}
      <div className="hidden md:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-350">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-50">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300">
                    {lead.company}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a href={`mailto:${lead.email}`} className="hover:underline text-slate-700 dark:text-slate-350">
                      {lead.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300">
                    {lead.source}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(lead.createdAt || lead.dateAdded).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-2 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-350 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
