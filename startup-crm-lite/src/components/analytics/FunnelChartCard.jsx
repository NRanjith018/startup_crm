import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, Cell, Tooltip } from 'recharts';

/**
 * FunnelChartCard Component
 * Displays sales conversion rates and drop-offs between pipeline stages.
 *
 * @param {Object} props
 * @param {Array} props.data - Funnel stage counts and percentages data.
 */
export default function FunnelChartCard({ data = [] }) {
  // Colors descending along the funnel stages
  const colors = ['#2563EB', '#3B82F6', '#6366F1', '#8B5CF6', '#22C55E'];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[420px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Sales Conversion Funnel</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Cumulative conversion rate and drop-off percentage by stage.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6 mt-4">
        {/* Recharts Funnel representation */}
        <div className="w-full h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                formatter={(value, name, props) => [
                  `${value} Leads (${props.payload.conversion}%)`,
                  props.payload.name,
                ]}
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
                labelKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index] || '#64748B'} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed funnel conversion rates and dropoffs listing */}
        <div className="w-full space-y-3 px-1">
          {data.map((stage, idx) => (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[idx] || '#64748B' }}
                  />
                  <span>{stage.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-50">
                  {stage.value} <span className="text-slate-400 dark:text-slate-500 font-normal">({stage.conversion}%)</span>
                </span>
              </div>
              
              {/* Progress visual indicator */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stage.conversion}%`,
                    backgroundColor: colors[idx] || '#64748B',
                  }}
                />
              </div>

              {/* Show dropoff text if not first stage */}
              {idx > 0 && (
                <div className="text-[10px] text-right font-medium text-red-500">
                  ↓ {stage.dropoff}% Drop-off
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
