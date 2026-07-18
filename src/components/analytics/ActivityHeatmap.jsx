import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * ActivityHeatmap Component
 * Displays a GitHub-style grid map showing daily lead creation density.
 *
 * @param {Object} props
 * @param {Array} props.data - List of daily counts: [{ date: '2026-06-15', count: 3 }]
 */
export default function ActivityHeatmap({ data = [] }) {
  // Map count value to green gradient density classes (includes dark mode support)
  const getDensityClass = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400';
    if (count === 1) return 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400 hover:opacity-90';
    if (count === 2) return 'bg-green-300 dark:bg-green-900/40 text-green-900 dark:text-green-350 hover:opacity-90';
    if (count === 3) return 'bg-green-500 text-white hover:opacity-90';
    return 'bg-green-700 text-white hover:opacity-90'; // count >= 4
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px]">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Leads Creation Velocity</h3>
          <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
            <Calendar className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2">
          Daily volume density of leads added over the last 30 days.
        </p>
      </div>

      {/* Grid of tiles */}
      <div className="my-auto py-2">
        <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
          {data.map((day) => {
            const dateObj = new Date(day.date);
            const readableDate = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const text = `${readableDate}: ${day.count} lead${day.count === 1 ? '' : 's'} created`;

            return (
              <div
                key={day.date}
                className={`h-6 w-6 rounded-md transition-colors cursor-pointer flex items-center justify-center text-[10px] font-bold ${getDensityClass(
                  day.count
                )}`}
                title={text}
                aria-label={text}
              >
                {day.count > 0 && day.count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend guides */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
        <span>30 Days Ago</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <span className="h-3.5 w-3.5 rounded bg-slate-100 dark:bg-slate-800" title="0 leads" />
          <span className="h-3.5 w-3.5 rounded bg-green-100 dark:bg-green-950/20" title="1 lead" />
          <span className="h-3.5 w-3.5 rounded bg-green-300 dark:bg-green-900/40" title="2 leads" />
          <span className="h-3.5 w-3.5 rounded bg-green-500" title="3 leads" />
          <span className="h-3.5 w-3.5 rounded bg-green-700" title="4+ leads" />
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}
