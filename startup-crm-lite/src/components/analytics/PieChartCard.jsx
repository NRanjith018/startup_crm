import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

/**
 * Custom active shape renderer for the Doughnut chart.
 * Draws an expanded sector with a larger outer radius for hover highlights.
 */
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

/**
 * PieChartCard Component
 * Displays lead status distribution in a premium Doughnut chart.
 *
 * @param {Object} props
 * @param {Array} props.data - Status distribution data array.
 * @param {number} props.totalLeads - Total lead records count.
 */
export default function PieChartCard({ data = [], totalLeads = 0 }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[420px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Lead Status Distribution</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Share of leads across current pipeline stages.
        </p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
        {/* Doughnut Chart container */}
        <div className="relative h-56 w-56 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Absolute Center Label Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-none">
              {totalLeads}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Total Leads
            </span>
          </div>
        </div>

        {/* Custom Legend Section */}
        <div className="flex-1 w-full max-h-56 overflow-y-auto space-y-2.5 px-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs text-slate-650 dark:text-slate-400 font-semibold hover:bg-slate-55 dark:hover:bg-slate-800/60 p-1.5 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate max-w-[100px]" title={item.name}>
                  {item.name}
                </span>
              </div>
              <span className="text-slate-900 dark:text-slate-50 font-bold">
                {item.value} <span className="text-slate-400 dark:text-slate-500 font-normal">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
