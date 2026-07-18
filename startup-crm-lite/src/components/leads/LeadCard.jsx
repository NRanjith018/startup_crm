import React from 'react';
// Import Lucide icons for detailed meta actions on lead cards
import { Pencil, Trash2, Mail, Phone, Globe } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * LeadCard Component
 * Displays a single sales lead details inside a clean responsive card wrapper.
 * Includes inline edit and delete action triggers.
 *
 * @param {Object} props
 * @param {Object} props.lead - The lead object details.
 * @param {Function} props.onEdit - Callback triggered when edit (pencil) is clicked.
 * @param {Function} props.onDelete - Callback triggered when delete (trash) is clicked.
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between h-full">
      <div>
        {/* Header: Name, Company, Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50 text-base tracking-tight">{lead.name}</h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lead.company}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Lead details links and source */}
        <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-350">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <a href={`mailto:${lead.email}`} className="hover:underline hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              {lead.email}
            </a>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <a href={`tel:${lead.phone}`} className="hover:underline hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                {lead.phone}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.source}</span></span>
          </div>
        </div>
      </div>

      {/* Action triggers footbar */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
        <button
          onClick={() => onEdit(lead)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-55/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          title="Edit Lead"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-red-655/600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
          title="Delete Lead"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
