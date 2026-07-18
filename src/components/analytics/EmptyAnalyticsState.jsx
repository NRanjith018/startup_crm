import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';

/**
 * EmptyAnalyticsState Component
 * Display placeholder panel shown when the CRM leads database is completely empty.
 */
export default function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center shadow-sm min-h-[400px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <BarChart3 className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">No analytics available yet</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Add your first lead to start tracking sales pipelines and business metrics.
      </p>
      <div className="mt-6">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Lead
        </Link>
      </div>
    </div>
  );
}
