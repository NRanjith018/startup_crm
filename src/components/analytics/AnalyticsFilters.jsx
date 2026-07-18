import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * AnalyticsFilters Component
 * Renders date range selections (7d, 30d, 90d, YTD, Custom)
 * and displays start/end inputs if Custom Range is active.
 *
 * @param {Object} props
 * @param {string} props.timeRange - Active filter value.
 * @param {Function} props.setTimeRange - Filter selector update callback.
 * @param {Object} props.customRange - Start and End dates for custom range.
 * @param {Function} props.setCustomRange - Range values update callback.
 */
export default function AnalyticsFilters({ timeRange, setTimeRange, customRange, setCustomRange }) {
  const options = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'This Year', value: 'ytd' },
    { label: 'Custom', value: 'custom' },
  ];

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
      {/* Selection Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {options.map((opt) => {
          const isActive = timeRange === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Custom range datepicker widgets */}
      {timeRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Calendar className="absolute left-2.5 h-4 w-4 text-slate-400" />
            <input
              type="date"
              name="start"
              value={customRange.start}
              onChange={handleCustomDateChange}
              className="rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Start date"
            />
          </div>
          <span className="text-xs text-slate-400 font-semibold">to</span>
          <div className="relative flex items-center">
            <Calendar className="absolute left-2.5 h-4 w-4 text-slate-400" />
            <input
              type="date"
              name="end"
              value={customRange.end}
              onChange={handleCustomDateChange}
              className="rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="End date"
            />
          </div>
        </div>
      )}
    </div>
  );
}
