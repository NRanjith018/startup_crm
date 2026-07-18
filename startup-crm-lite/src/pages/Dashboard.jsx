import React from 'react';
import toast from 'react-hot-toast';
// Import standard Lucide React icons for stats card visuals
import { Users, CheckCircle2, XCircle, Percent } from 'lucide-react';

import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard Page Component
 * Assembles stats indicators, dynamic pipeline visual segments, activities logs,
 * and quick actions panel into a unified responsive dashboard view.
 */
export default function Dashboard() {
  // Integrate the global contexts hooks
  const { leads } = useLeads();
  const { user } = useAuth();

  // Aggregate stats dynamically from local sample array
  const totalLeads = leads.length;
  const wonLeads = leads.filter((lead) => lead.status === 'Won').length;
  const lostLeads = leads.filter((lead) => lead.status === 'Lost').length;
  
  // Math formulation for conversion rates (Won / Total)
  const conversionRate = totalLeads > 0 
    ? ((wonLeads / totalLeads) * 100).toFixed(1) 
    : '0.0';

  // Modal display simulation on user interaction
  const handleAddLeadClick = () => {
    toast.success('Add Lead clicked! Please navigate to the Leads page to add a new lead.');
  };

  // Mock export handler
  const handleExportClick = () => {
    toast.success('CRM Leads database successfully exported as CSV!');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Good morning, {user?.name || 'User'}!</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Here is your sales pipeline status overview for today.
        </p>
      </div>

      {/* Responsive Metrics Grid - 1 Col Mobile, 2 Col Tablet, 4 Col Desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change="+14.2%"
          color="blue"
        />
        <StatsCard
          title="Won Leads"
          value={wonLeads}
          icon={CheckCircle2}
          change="+8.3%"
          color="green"
        />
        <StatsCard
          title="Lost Leads"
          value={lostLeads}
          icon={XCircle}
          change="-4.5%"
          color="red"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={Percent}
          change="+2.4%"
          color="amber"
        />
      </div>

      {/* Main Grid: Visual Analytics & Recent Lists left, Sidebar Quick Actions right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Section: Pipeline Overview and Recent Leads list */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>

        {/* Right Side Section: Sidebar Quick Actions panel */}
        <div className="space-y-6">
          <QuickActions 
            onAddLeadClick={handleAddLeadClick}
            onExportClick={handleExportClick}
          />
        </div>
      </div>
    </div>
  );
}
