import React from 'react';

/**
 * PipelineOverview Component
 * Renders a visual horizontal stacked bar chart showing lead distribution across stages.
 *
 * @param {Object} props
 * @param {Array} props.leads - Array of lead objects to aggregate.
 */
export default function PipelineOverview({ leads = [] }) {
  // Define pipeline stages and styling
  const stages = [
    { key: 'New', label: 'New', color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    { key: 'Contacted', label: 'Contacted', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { key: 'In Progress', label: 'In Progress', color: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
    { key: 'Won', label: 'Won', color: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
    { key: 'Lost', label: 'Lost', color: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  ];

  const totalLeads = leads.length;

  // Aggregate counts of leads per status
  const stageCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentage and count for each status stage
  const stageData = stages.map((stage) => {
    const count = stageCounts[stage.key] || 0;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return { ...stage, count, percentage };
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Pipeline Overview</h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{totalLeads} Total Leads</span>
      </div>

      {/* Visual Segmented Progress Bar */}
      <div className="w-full flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
        {totalLeads === 0 ? (
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-full" />
        ) : (
          stageData.map((stage) => {
            if (stage.count === 0) return null;
            return (
              <div
                key={stage.key}
                className={`${stage.color} h-full transition-all duration-500`}
                style={{ width: `${stage.percentage}%` }}
                title={`${stage.label}: ${stage.count} (${stage.percentage}%)`}
              />
            );
          })
        )}
      </div>

      {/* Legended Details Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stageData.map((stage) => (
          <div key={stage.key} className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
              <span>{stage.label}</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-950 dark:text-slate-50">{stage.count}</span>
              <span className={`text-xs font-semibold ${stage.text}`}>
                {stage.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
