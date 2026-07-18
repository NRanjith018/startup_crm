import { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import * as helpers from '../utils/analyticsHelpers';

/**
 * useAnalytics Custom Hook
 * Handles date filtering logic (7 days, 30 days, 90 days, Year-to-Date, Custom range)
 * and exposes memoized metrics computations.
 */
export function useAnalytics() {
  const { leads = [] } = useLeads();
  
  // Date filtering state options: '7d' | '30d' | '90d' | 'ytd' | 'custom'
  const [timeRange, setTimeRange] = useState('30d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Filter raw leads based on time boundaries
  const filteredLeads = useMemo(() => {
    const now = new Date();
    
    return leads.filter((lead) => {
      if (!lead) return false;
      const leadDate = new Date(lead.createdAt || lead.dateAdded);
      
      switch (timeRange) {
        case '7d': {
          const limit = new Date();
          limit.setDate(now.getDate() - 7);
          return leadDate >= limit;
        }
        case '30d': {
          const limit = new Date();
          limit.setDate(now.getDate() - 30);
          return leadDate >= limit;
        }
        case '90d': {
          const limit = new Date();
          limit.setDate(now.getDate() - 90);
          return leadDate >= limit;
        }
        case 'ytd': {
          const limit = new Date(now.getFullYear(), 0, 1);
          return leadDate >= limit;
        }
        case 'custom': {
          if (!customRange.start) return true;
          const start = new Date(customRange.start);
          const end = customRange.end ? new Date(customRange.end) : new Date();
          // Ensure end of day is captured
          end.setHours(23, 59, 59, 999);
          return leadDate >= start && leadDate <= end;
        }
        default:
          return true;
      }
    });
  }, [leads, timeRange, customRange]);

  // Memoized computations of analytical metrics
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const wonLeadsCount = filteredLeads.filter(l => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeadsCount / totalLeads) * 100) : 0;

    return {
      totalLeads,
      conversionRate,
      pipelineValue: helpers.getPipelineValue(filteredLeads),
      wonRevenue: helpers.getWonRevenue(filteredLeads),
      avgSalesCycle: helpers.getAverageSalesCycle(filteredLeads),
      lostRate: helpers.getLostRate(filteredLeads),
    };
  }, [filteredLeads]);

  const chartsData = useMemo(() => {
    return {
      statusDistribution: helpers.getStatusDistribution(filteredLeads),
      monthlyLeads: helpers.getMonthlyLeads(filteredLeads),
      monthlyConversion: helpers.getConversionByMonth(filteredLeads),
      monthlyRevenue: helpers.getRevenueByMonth(filteredLeads),
      leadSources: helpers.getLeadSourceStats(filteredLeads),
      funnelData: helpers.getFunnelData(filteredLeads),
      salesVelocity: helpers.getSalesVelocity(filteredLeads),
      forecast: helpers.getForecastRevenue(filteredLeads),
      topPerformers: helpers.getTopPerformers(filteredLeads),
      heatmap: helpers.getActivityHeatmapData(filteredLeads),
    };
  }, [filteredLeads]);

  return {
    leads,
    filteredLeads,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
    stats,
    chartsData,
  };
}
export default useAnalytics;
