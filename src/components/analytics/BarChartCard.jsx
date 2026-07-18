import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * BarChartCard Component
 * Displays monthly lead acquisition counts for the last 6 months.
 *
 * @param {Object} props
 * @param {Array} props.data - Monthly lead acquisition data array.
 */
export default function BarChartCard({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Lead Generation Trends</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Monthly volume of newly created leads over the last 6 months.
        </p>
      </div>

      <div className="flex-1 h-56 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              formatter={(value) => [`${value} Leads`, 'Leads Created']}
            />
            <Bar
              dataKey="Lead Count"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
