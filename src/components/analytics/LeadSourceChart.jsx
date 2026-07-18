import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * LeadSourceChart Component
 * Renders a horizontal bar chart displaying leads count per origin channel, sorted descending.
 *
 * @param {Object} props
 * @param {Array} props.data - Formatted lead source counts data.
 */
export default function LeadSourceChart({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Leads by Acquisition Channel</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Efficiency breakdown of different acquisition channels.
        </p>
      </div>

      <div className="flex-1 h-56 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          {/* Use layout="vertical" for horizontal bar charts */}
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              formatter={(value) => [`${value} Leads`, 'Total Leads']}
            />
            <Bar
              dataKey="value"
              fill="#6366F1"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
