import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import icons from Lucide to enhance visually descriptive actions
import { Plus, ArrowRight, Download } from 'lucide-react';

/**
 * QuickActions Component
 * Standard layout card containing rapid navigation triggers and action callbacks.
 *
 * @param {Object} props
 * @param {Function} props.onExportClick - Callback triggered when data export is executed.
 */
export default function QuickActions({ onExportClick }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-55/50 dark:text-slate-50 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {/* Navigate directly to Leads page to add a lead */}
        <button
          onClick={() => navigate('/leads')}
          className="flex w-full items-center justify-between rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Lead
          </span>
          <ArrowRight className="h-4 w-4 text-blue-200" />
        </button>

        {/* Link to navigate to the full Leads list view page */}
        <Link
          to="/leads"
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <span className="flex items-center gap-2">
            View All Leads
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </Link>

        {/* Trigger button for lead CSV/data export actions */}
        <button
          onClick={onExportClick}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Leads Data
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
