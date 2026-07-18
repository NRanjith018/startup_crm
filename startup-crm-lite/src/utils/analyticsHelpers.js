/**
 * CRM Analytics Helpers
 * Contains pure, memoization-friendly, defensive data aggregator functions 
 * to transform raw Leads arrays into Recharts visual structures.
 */

// Helper to safely convert values to numbers
const getLeadValue = (lead) => Number(lead.value) || 0;

// Helper to get month name abbreviation
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Helper to generate the last 6 months list chronologically.
 * Returns array of { name: string, year: number, monthIndex: number, leads: [], wonLeads: [] }
 */
const getLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      name: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      leads: [],
      wonLeads: [],
    });
  }
  return months;
};

/**
 * 1. Pipeline Total Value (Active leads)
 * Sum of values for all leads not in final states (Won / Lost)
 */
export const getPipelineValue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((lead) => lead && lead.status !== 'Won' && lead.status !== 'Lost')
    .reduce((sum, lead) => sum + getLeadValue(lead), 0);
};

/**
 * 2. Won Revenue
 * Sum of values for all leads in 'Won' status
 */
export const getWonRevenue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((lead) => lead && lead.status === 'Won')
    .reduce((sum, lead) => sum + getLeadValue(lead), 0);
};

/**
 * 3. Lost Rate
 * Percentage of leads marked as 'Lost'
 */
export const getLostRate = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lostLeads = leads.filter((lead) => lead && lead.status === 'Lost').length;
  return Math.round((lostLeads / leads.length) * 100);
};

/**
 * 4. Average Sales Cycle
 * Average duration in days from creation to conversion (Won)
 */
export const getAverageSalesCycle = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  const wonLeads = leads.filter(
    (lead) => lead && lead.status === 'Won' && (lead.wonAt || lead.createdAt || lead.dateAdded)
  );
  if (wonLeads.length === 0) return 18; // Default fallback index benchmark

  const totalDays = wonLeads.reduce((sum, lead) => {
    const start = new Date(lead.createdAt || lead.dateAdded);
    const end = lead.wonAt ? new Date(lead.wonAt) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return sum + diffDays;
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

/**
 * 5. Status Distribution (Pie Chart Card)
 * Counts leads in each status bucket.
 */
export const getStatusDistribution = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const statusCounts = leads.reduce((acc, lead) => {
    if (lead && lead.status) {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
    }
    return acc;
  }, {});

  const total = leads.length;
  const colorMap = {
    New: "#94A3B8",
    Contacted: "#2563EB",
    "Meeting Scheduled": "#F59E0B",
    Meeting: "#F59E0B",
    "Proposal Sent": "#7C3AED",
    Proposal: "#7C3AED",
    Won: "#22C55E",
    Lost: "#EF4444",
  };

  return Object.keys(statusCounts).map((status) => {
    const value = statusCounts[status];
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return {
      name: status,
      value,
      percentage,
      color: colorMap[status] || "#64748B",
    };
  });
};

/**
 * 6. Monthly Leads Acquisition (Bar Chart Card)
 * Groups leads created in the last 6 months.
 */
export const getMonthlyLeads = (leads = []) => {
  const months = getLastSixMonths();
  if (Array.isArray(leads)) {
    leads.forEach((lead) => {
      if (!lead) return;
      const createdDate = new Date(lead.createdAt || lead.dateAdded);
      const leadMonth = createdDate.getMonth();
      const leadYear = createdDate.getFullYear();

      const bucket = months.find((m) => m.monthIndex === leadMonth && m.year === leadYear);
      if (bucket) {
        bucket['Lead Count'] = (bucket['Lead Count'] || 0) + 1;
      }
    });
  }
  return months.map((m) => ({ name: m.name, 'Lead Count': m['Lead Count'] }));
};

/**
 * 7. Monthly Conversion Rates (Line Chart Card)
 * conversion rate = (Won Leads created in Month) / (Total Leads created in Month)
 */
export const getConversionByMonth = (leads = []) => {
  const months = getLastSixMonths();
  if (Array.isArray(leads)) {
    leads.forEach((lead) => {
      if (!lead) return;
      const createdDate = new Date(lead.createdAt || lead.dateAdded);
      const leadMonth = createdDate.getMonth();
      const leadYear = createdDate.getFullYear();

      const bucket = months.find((m) => m.monthIndex === leadMonth && m.year === leadYear);
      if (bucket) {
        bucket.leads.push(lead);
        if (lead.status === 'Won') {
          bucket.wonLeads.push(lead);
        }
      }
    });
  }

  return months.map((m) => {
    const total = m.leads.length;
    const won = m.wonLeads.length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return {
      name: m.name,
      'Conversion Rate (%)': rate,
    };
  });
};

/**
 * 8. Revenue By Month (Area Chart Card)
 * Total revenue realized from deals marked 'Won' grouped by wonAt date (or fallbacks)
 */
export const getRevenueByMonth = (leads = []) => {
  const months = getLastSixMonths();
  if (Array.isArray(leads)) {
    leads.forEach((lead) => {
      if (!lead || lead.status !== 'Won') return;
      const wonDate = new Date(lead.wonAt || lead.createdAt || lead.dateAdded);
      const leadMonth = wonDate.getMonth();
      const leadYear = wonDate.getFullYear();

      const bucket = months.find((m) => m.monthIndex === leadMonth && m.year === leadYear);
      if (bucket) {
        bucket.wonRevenue = (bucket.wonRevenue || 0) + getLeadValue(lead);
      }
    });
  }

  return months.map((m) => ({
    name: m.name,
    'Revenue': m.wonRevenue || 0,
  }));
};

/**
 * 9. Lead Source Stats (Horizontal Bar Chart)
 * Grouping and counting leads per channel source. Sorted descending.
 */
export const getLeadSourceStats = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const sourceCounts = leads.reduce((acc, lead) => {
    if (lead && lead.source) {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.keys(sourceCounts)
    .map((source) => ({
      name: source,
      value: sourceCounts[source],
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * 10. Funnel Data (Funnel Chart Card)
 * Aggregates cumulative progress metrics across stages:
 * New -> Contacted -> Meeting Scheduled -> Proposal Sent -> Won
 */
export const getFunnelData = (leads = []) => {
  if (!Array.isArray(leads)) return [];

  // Stage hierarchy
  const stages = [
    { name: 'New', statuses: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'] },
    { name: 'Contacted', statuses: ['Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'] },
    { name: 'Meeting', statuses: ['Meeting Scheduled', 'Proposal Sent', 'Won'] },
    { name: 'Proposal', statuses: ['Proposal Sent', 'Won'] },
    { name: 'Won', statuses: ['Won'] },
  ];

  const total = leads.length;

  return stages.map((stage, index) => {
    // Count cumulative leads that have reached or passed this stage
    const count = leads.filter((lead) => lead && stage.statuses.includes(lead.status)).length;
    // Calculate conversion rate against previous stage or total
    const conversion = total > 0 ? Math.round((count / total) * 100) : 0;
    
    // Dropoff percentage
    const dropoff = index === 0 ? 0 : 100 - Math.round((count / (leads.filter(l => stages[index-1].statuses.includes(l.status)).length || 1)) * 100);

    return {
      name: stage.name,
      value: count,
      conversion,
      dropoff,
    };
  });
};

/**
 * 11. Sales Velocity Index
 * velocity = (Opportunities * Win Rate * Avg Deal Size) / Avg Sales Cycle Length
 */
export const getSalesVelocity = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return { value: 0, opportunities: 0, winRate: 0, avgDealSize: 0, cycleLength: 18 };
  }

  const opportunities = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost').length;
  const wonLeads = leads.filter((l) => l.status === 'Won');
  const winRate = leads.length > 0 ? wonLeads.length / leads.length : 0;
  
  const wonRevenue = getWonRevenue(leads);
  const avgDealSize = wonLeads.length > 0 ? wonRevenue / wonLeads.length : 0;
  const cycleLength = getAverageSalesCycle(leads) || 1;

  const value = cycleLength > 0 
    ? Math.round((opportunities * winRate * avgDealSize) / cycleLength) 
    : 0;

  return {
    value,
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    cycleLength,
  };
};

/**
 * 12. Revenue Forecast
 * Predicted Revenue Next Month = Average Won Revenue of last 6 months
 */
export const getForecastRevenue = (leads = []) => {
  const monthlyRevenue = getRevenueByMonth(leads);
  const total = monthlyRevenue.reduce((sum, item) => sum + item.Revenue, 0);
  const average = Math.round(total / 6);

  // Confidence calculations based on metrics density
  const variance = monthlyRevenue.reduce((sum, item) => sum + Math.pow(item.Revenue - average, 2), 0) / 6;
  const standardDev = Math.sqrt(variance);
  
  // Calculate confidence score (higher variance lowers the confidence score)
  let confidence = 85;
  if (average > 0) {
    const cv = standardDev / average; // Coefficient of variation
    confidence = Math.max(50, Math.min(95, Math.round(100 - (cv * 50))));
  } else {
    confidence = 0;
  }

  return {
    value: average,
    confidence,
    growthRate: total > 0 ? 12 : 0, // Mocked steady growth indicator
  };
};

/**
 * 13. Top Performers leaderboard
 * Groups won deals revenue by owner (leads sales rep).
 */
export const getTopPerformers = (leads = []) => {
  if (!Array.isArray(leads)) return [];

  const repRevenue = leads.reduce((acc, lead) => {
    if (lead && lead.status === 'Won') {
      const rep = lead.owner || 'Alex'; // Default owner fallback
      acc[rep] = (acc[rep] || 0) + getLeadValue(lead);
    }
    return acc;
  }, {});

  return Object.keys(repRevenue)
    .map((name) => ({
      name,
      value: repRevenue[name],
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * 14. Activity Heatmap Data
 * Maps counts of daily creation activities over the last 30 days.
 */
export const getActivityHeatmapData = (leads = []) => {
  const data = [];
  const now = new Date();

  // Populate last 30 days list
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      count: 0,
    });
  }

  if (Array.isArray(leads)) {
    leads.forEach((lead) => {
      if (!lead) return;
      const leadDateStr = new Date(lead.createdAt || lead.dateAdded).toISOString().split('T')[0];
      const match = data.find((item) => item.date === leadDateStr);
      if (match) {
        match.count += 1;
      }
    });
  }

  return data;
};
