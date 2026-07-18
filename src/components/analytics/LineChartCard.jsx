import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/**
 * LineChartCard Component
 * Displays monthly conversion rate trends (%) for the last 6 months.
 *
 * @param {Object} props
 * @param {Array} props.data - Monthly conversion percentages data.
 */
export default function LineChartCard({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-55/50 dark:text-slate-50">Conversion Rate Trends</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Monthly conversion rate percentage trajectory over the last 6 months.
        </p>
      </div>

      <div className="flex-1 h-56 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              formatter={(value) => [`${value}%`, 'Conversion Rate']}
            />
            <Line
              type="monotone"
              dataKey="Conversion Rate (%)"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
