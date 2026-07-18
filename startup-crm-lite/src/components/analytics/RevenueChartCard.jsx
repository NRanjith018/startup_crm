import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * RevenueChartCard Component
 * Displays monthly realized won deals revenue using an AreaChart.
 *
 * @param {Object} props
 * @param {Array} props.data - Monthly realized revenue data array.
 */
export default function RevenueChartCard({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-55/50 dark:text-slate-50">Realized Revenue Analytics</h3>
        <p className="text-xs text-slate-400 dark:text-slate-55/500 dark:text-slate-500 font-semibold mt-1">
          Monthly realized revenue from Closed Won sales opportunities.
        </p>
      </div>

      <div className="flex-1 h-56 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue Realized']}
            />
            <Area
              type="monotone"
              dataKey="Revenue"
              stroke="#22C55E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
