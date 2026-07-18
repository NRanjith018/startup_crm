import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { List, Grid, Plus } from 'lucide-react';

import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../context/LeadContext';

/**
 * Leads Page Component
 * Oversees CRM Lead CRUD operations, search criteria inputs, view rendering,
 * and incorporates FilterBar + SearchBar alongside custom EmptyState.
 */
export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Search and status filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Trigger modal overlay for a new lead creation
  const handleAddLeadClick = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  // Trigger modal overlay for updating an existing lead
  const handleEditLeadClick = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  // Close form modal and cleanup selectedLead state
  const handleCloseModal = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(false);
  }, []);

  // Form submission handler managing Create & Update CRUD paths via context
  const handleFormSubmit = useCallback((data) => {
    if (selectedLead) {
      updateLead(selectedLead.id, data);
      toast.success('Lead updated successfully!');
    } else {
      addLead(data);
      toast.success('New lead created successfully!');
    }
    handleCloseModal();
  }, [selectedLead, updateLead, addLead, handleCloseModal]);

  // Context DELETE CRUD operation handler
  const handleDeleteLead = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      deleteLead(id);
      toast.error('Lead has been deleted successfully.');
    }
  }, [deleteLead]);

  // Clear all filters and search queries back to default values
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
    setSourceFilter('All');
    toast.success('Filters cleared successfully.');
  }, []);

  // Memoized derived state variable: filteredLeads calculation
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
      .filter((lead) => sourceFilter === 'All' || lead.source === sourceFilter)
      .filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, activeFilter, sourceFilter, searchQuery]);

  // Check if any filter is active currently
  const isFilterActive = searchQuery !== '' || activeFilter !== 'All' || sourceFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* Header bar and action triggers */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-55/50 dark:text-slate-50">Leads</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, update, and manage your sales pipeline leads records.
          </p>
        </div>
        <button
          onClick={handleAddLeadClick}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer min-h-[44px]"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Lead
        </button>
      </div>

      {/* Control panel: SearchBar and filters */}
      <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Debounced Search Input Component */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Secondary Filtering Controls (Source Dropdown & Layout switch) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Source dropdown selector */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <option value="All" className="dark:bg-slate-900">All Sources</option>
              <option value="Website" className="dark:bg-slate-900">Website</option>
              <option value="Referral" className="dark:bg-slate-900">Referral</option>
              <option value="LinkedIn" className="dark:bg-slate-900">LinkedIn</option>
              <option value="Cold Call" className="dark:bg-slate-900">Cold Call</option>
              <option value="Email Campaign" className="dark:bg-slate-900">Email Campaign</option>
              <option value="Other" className="dark:bg-slate-900">Other</option>
            </select>

            {/* Layout Switch Toggle */}
            <div className="hidden md:flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-955/950 dark:bg-slate-950">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Table View"
              >
                <List className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Grid/Card View"
              >
                <Grid className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Status FilterBar Row component */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            leads={leads}
          />
        </div>
      </div>

      {/* Main Leads Data or EmptyState layout view */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          isFilterActive={isFilterActive}
          onClearFilters={handleClearFilters}
          totalLeadsCount={leads.length}
        />
      ) : (
        <LeadTable
          leads={filteredLeads}
          viewMode={viewMode}
          onEdit={handleEditLeadClick}
          onDelete={handleDeleteLead}
        />
      )}

      {/* Edit/Create Form Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/70 p-0 md:p-4 backdrop-blur-xs">
          <div className="w-full h-full md:h-auto md:max-w-lg md:rounded-xl border-none md:border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl animate-in fade-in zoom-in duration-200 overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
              {selectedLead ? 'Edit Sales Lead' : 'Add New Lead'}
            </h3>
            <LeadForm
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
