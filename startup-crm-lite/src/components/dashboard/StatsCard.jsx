import React from 'react';

/**
 * StatsCard Component
 * Displays a single key performance metric, with an icon, value, and change percentage.
 * Wrapped in React.memo to minimize unnecessary re-renders.
 *
 * @param {Object} props
 * @param {string} props.title - The label for the stat.
 * @param {string|number} props.value - The main statistical number.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {string} props.change - Percentage change comparison text (e.g. "+12.5%").
 * @param {string} props.color - semantic keyword matching colorMap ('blue', 'green', 'amber', 'red').
 */
function StatsCard({ title, value, icon: Icon, change, color }) {
  // Determine positive or negative change color based on string prefix
  const isPositive = change.startsWith('+');

  // Semantic styling mappings for visual indicators
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
      border: 'border-green-100 dark:border-green-900/30',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/30',
    },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-lg ${style.bg}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{value}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs last month</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StatsCard);
