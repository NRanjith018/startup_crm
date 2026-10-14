import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as leadService from '../services/leadService';
import { useAuth } from './AuthContext';
import { SAMPLE_LEADS } from '../data/sampleLeads';

// Initialize createContext for Leads
export const LeadContext = createContext(null);

/**
 * LeadProvider Component
 * Manages the global leads array, query page stats, and loading triggers
 * by sending requests to the backend leadService.
 * Falls back to in-memory sample data when in demo/offline mode.
 */
export function LeadProvider({ children }) {
  const { isAuthenticated, isDemo } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  /**
   * fetchLeads
   * Queries leads from server using filter parameters.
   * In demo mode, returns sample data immediately.
   */
  const fetchLeads = async (params = {}) => {
    if (isDemo) {
      setLeads(SAMPLE_LEADS);
      setPagination({
        total: SAMPLE_LEADS.length,
        page: 1,
        limit: 1000,
        pages: 1,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pull all leads in one query for client-side search/filter page view mode matching
      const queryParams = { limit: 1000, ...params };
      const res = await leadService.getLeads(queryParams);
      
      if (res.success) {
        setLeads(res.data);
        setPagination(
          res.pagination || {
            total: res.data.length,
            page: 1,
            limit: 1000,
            pages: 1,
          }
        );
      }
    } catch (err) {
      console.error('Failed to load leads from database:', err);
      // Fallback to sample data if backend fails mid-session
      toast.error('Could not load leads from server. Showing demo data.');
      setLeads(SAMPLE_LEADS);
      setPagination({ total: SAMPLE_LEADS.length, page: 1, limit: 1000, pages: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync load list whenever user registers or logs in successfully
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [isAuthenticated, isDemo]);

  /**
   * addLead
   * Registers a new lead on backend database.
   * In demo mode, adds to local state only.
   */
  const addLead = async (leadData) => {
    if (isDemo) {
      const newLead = {
        ...leadData,
        id: `demo-${Date.now()}`,
        _id: `demo-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLeads((prev) => [newLead, ...prev]);
      toast.success('Lead created! (Demo mode — not saved to database)');
      return newLead;
    }

    try {
      const res = await leadService.createLead(leadData);
      if (res.success) {
        setLeads((prev) => [res.data, ...prev]);
        toast.success('Lead created successfully!');
        fetchLeads(); // Sync page counts
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create lead.';
      toast.error(msg);
      throw err;
    }
  };

  /**
   * updateLead
   * Updates lead parameters on backend database.
   * In demo mode, updates local state only.
   */
  const updateLead = async (id, leadData) => {
    if (isDemo) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id || l._id === id ? { ...l, ...leadData } : l))
      );
      toast.success('Lead updated! (Demo mode — not saved to database)');
      return { ...leadData, id };
    }

    try {
      const res = await leadService.updateLead(id, leadData);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id || l._id === id ? res.data : l))
        );
        toast.success('Lead updated successfully!');
        fetchLeads(); // Sync in background
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update lead.';
      toast.error(msg);
      throw err;
    }
  };

  /**
   * deleteLead
   * Permanently deletes lead from database.
   * In demo mode, removes from local state only.
   */
  const deleteLead = async (id) => {
    if (isDemo) {
      setLeads((prev) => prev.filter((l) => l.id !== id && l._id !== id));
      toast.success('Lead deleted! (Demo mode — not saved to database)');
      return;
    }

    try {
      const res = await leadService.deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id && l._id !== id));
        toast.success('Lead deleted successfully!');
        fetchLeads(); // Sync metrics
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete lead.';
      toast.error(msg);
    }
  };

  /**
   * getLeadById
   * Checks local array to get single lead parameters.
   */
  const getLeadById = (id) => {
    return leads.find((l) => l.id === id || l._id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

/**
 * useLeads Custom Hook
 * Provides components convenient access to the global LeadContext values.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads hook must be executed inside a LeadProvider wrapping tree.');
  }
  return context;
}
