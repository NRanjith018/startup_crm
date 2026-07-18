import React from 'react';
import { CalendarDays, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * ForecastCard Component
 * Displays revenue forecast estimates for the upcoming month.
 *
 * @param {Object} props
 * @param {Object} props.data - Forecast metrics.
 */
export default function ForecastCard({ data }) {
  const { value = 0, confidence = 85, growthRate = 12 } = data || {};

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px]">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-55/50 dark:text-slate-50">Revenue Forecast</h3>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
            <CalendarDays className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2">
          Predicted next-month closed won sales revenue estimation.
        </p>
      </div>

      <div className="my-4">
        <h4 className="text-3xl font-extrabold text-slate-900 dark:text-slate-55/50 dark:text-slate-50 tracking-tight">
          ₹{value.toLocaleString('en-IN')}
        </h4>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Expected +{growthRate}% monthly growth trend</span>
        </div>
      </div>

      {/* Confidence metric indicator */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Forecasting Confidence Score</span>
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-50">{confidence}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
