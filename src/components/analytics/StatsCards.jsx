import React from 'react';
import { Users, Percent, DollarSign, Award, Clock, AlertTriangle } from 'lucide-react';

/**
 * StatsCards Component
 * Renders the 6 key performance indicators grid (KPI Summary section).
 * Integrates responsive grid limits and dark mode variables.
 *
 * @param {Object} props
 * @param {Object} props.stats - Calculated metrics object.
 */
export default function StatsCards({ stats }) {
  const {
    totalLeads = 0,
    conversionRate = 0,
    pipelineValue = 0,
    wonRevenue = 0,
    avgSalesCycle = 0,
    lostRate = 0,
  } = stats;

  const kpis = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
      description: '+12.4% vs last period',
      descriptionColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: Percent,
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30',
      description: 'Steady sales rate',
      descriptionColor: 'text-slate-500 dark:text-slate-400',
    },
    {
      title: 'Pipeline Value',
      value: `₹${pipelineValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      description: 'Active pipeline size',
      descriptionColor: 'text-slate-500 dark:text-slate-400',
    },
    {
      title: 'Won Revenue',
      value: `₹${wonRevenue.toLocaleString('en-IN')}`,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
      description: 'Closed deal value',
      descriptionColor: 'text-slate-500 dark:text-slate-400',
    },
    {
      title: 'Average Sales Cycle',
      value: `${avgSalesCycle} Days`,
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
      description: 'Creation to Won delay',
      descriptionColor: 'text-slate-500 dark:text-slate-400',
    },
    {
      title: 'Lost Rate',
      value: `${lostRate}%`,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
      description: '-3.1% vs last period',
      descriptionColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${kpi.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                {kpi.value}
              </h3>
              <p className={`mt-1 text-[11px] font-semibold ${kpi.descriptionColor}`}>
                {kpi.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
