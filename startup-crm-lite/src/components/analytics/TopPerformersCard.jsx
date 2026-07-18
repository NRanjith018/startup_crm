import React from 'react';
import { Trophy, Award, User } from 'lucide-react';

/**
 * TopPerformersCard Component
 * Displays ranking list of top performing sales reps (owners) by Won Revenue.
 *
 * @param {Object} props
 * @param {Array} props.data - Reps ranking values array.
 */
export default function TopPerformersCard({ data = [] }) {
  // Take only top 5 performers
  const topReps = data.slice(0, 5);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'; // Gold
      case 1:
        return 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';  // Silver
      case 2:
        return 'text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30'; // Bronze
      default:
        return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px]">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Top Sales Reps</h3>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
            <Trophy className="h-4.5 w-4.5 fill-current" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
        {topReps.length === 0 ? (
          <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-10 font-medium">
            No closed deals revenue registered yet.
          </div>
        ) : (
          topReps.map((rep, idx) => (
            <div
              key={rep.name}
              className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Ranking Medal/Number */}
                <div className={`h-7 w-7 flex items-center justify-center rounded-lg border text-xs font-bold ${getMedalColor(idx)}`}>
                  {idx < 3 ? <Award className="h-4 w-4" /> : idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rep.name}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-950 dark:text-slate-55/50 dark:text-slate-50">
                ₹{rep.value.toLocaleString('en-IN')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
