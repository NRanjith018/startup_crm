import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

// Import child components
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Analytics Page Component
 * Connects useAnalytics hook metrics computations and aggregates
 * cards in a responsive grid.
 */
export default function Analytics() {
  const {
    leads,
    filteredLeads,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
    stats,
    chartsData,
  } = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state on mount or range changes to showcase the skeleton transitions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [timeRange, customRange.start, customRange.end]);

  // Completely empty CRM database state
  if (leads.length === 0) {
    return <EmptyAnalyticsState />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Analytics Dashboard</h1>
          <p className="mt-1 text-sm font-semibold text-slate-400 dark:text-slate-500">
            Track sales performance, growth forecasts, and pipeline drop-offs.
          </p>
        </div>
      </div>

      {/* Date filters control panel */}
      <AnalyticsFilters
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredLeads.length === 0 ? (
        // Filter result empty state
        <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm min-h-[300px]">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">No leads found in this period</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your date range filters to view analytical trends.</p>
            <button
              onClick={() => setTimeRange('30d')}
              className="mt-2 inline-flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-350 cursor-pointer"
            >
              Reset to 30 Days
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs Row */}
          <StatsCards stats={stats} />

          {/* Core Pipeline Section: Doughnut Status & Sales Funnel charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PieChartCard
              data={chartsData.statusDistribution}
              totalLeads={stats.totalLeads}
            />
            <FunnelChartCard data={chartsData.funnelData} />
          </div>

          {/* Volume Trends Section: Acquisition Counts & Conversion Lines */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChartCard data={chartsData.monthlyLeads} />
            <LineChartCard data={chartsData.monthlyConversion} />
          </div>

          {/* Channels Section: Monthly Won Revenue & Leads Source */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueChartCard data={chartsData.monthlyRevenue} />
            <LeadSourceChart data={chartsData.leadSources} />
          </div>

          {/* Activities Section: Heatmaps & Top Sales Performers */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityHeatmap data={chartsData.heatmap} />
            <TopPerformersCard data={chartsData.topPerformers} />
          </div>

          {/* Forecasts & Daily Velocity Metrics section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ForecastCard data={chartsData.forecast} />
            <SalesVelocityCard data={chartsData.salesVelocity} />
          </div>
        </div>
      )}
    </div>
  );
}
