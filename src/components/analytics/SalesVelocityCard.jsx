import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

/**
 * SalesVelocityCard Component
 * Displays the rate at which revenue is generated daily.
 *
 * @param {Object} props
 * @param {Object} props.data - Velocity calculation metrics.
 */
export default function SalesVelocityCard({ data }) {
  const {
    value = 0,
    opportunities = 0,
    winRate = 0,
    avgDealSize = 0,
    cycleLength = 18,
  } = data || {};

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px]">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Sales Velocity</h3>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
            <Zap className="h-4.5 w-4.5 fill-current" />
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-2">
          Daily rate of revenue velocity flowing through the pipeline.
        </p>
      </div>

      <div className="my-4">
        <h4 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          ₹{value.toLocaleString('en-IN')}<span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/day</span>
        </h4>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+8.4% vs last month</span>
        </div>
      </div>

      {/* Formula inputs details grid */}
      <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Opps</div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{opportunities}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Win %</div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{winRate}%</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Size</div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-50">₹{Math.round(avgDealSize / 1000)}k</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Cycle</div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{cycleLength}d</div>
        </div>
      </div>
    </div>
  );
}
