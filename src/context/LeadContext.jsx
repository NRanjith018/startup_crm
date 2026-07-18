import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SAMPLE_LEADS } from '../data/sampleLeads';

/**
 * TypeScript-style shape definition of the Lead object
 * 
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier generated automatically (e.g. UUID)
 * @property {string} name - Name of the sales lead person
 * @property {string} company - Company organization name
 * @property {string} email - Contact email address
 * @property {string} phone - Contact phone number (optional)
 * @property {('New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost')} status - Current pipeline stage
 * @property {('Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other')} source - Origin channel of the lead
 * @property {string} createdAt - ISO string timestamp of lead creation
 * @property {number} value - Financial opportunity value of the lead
 */

// Initialize createContext for Leads
export const LeadContext = createContext(null);

/**
 * LeadProvider Component
 * Manages the global reactive leads list state and implements persistent syncs
 * with localStorage via the useLocalStorage hook.
 */
export function LeadProvider({ children }) {
  // Use custom storage hook to keep states persisted under 'startup-crm-leads' key
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', SAMPLE_LEADS);

  /**
   * Creates a new Lead and prepends it to the list state.
   * 
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData - Form parameters.
   */
  const addLead = (leadData) => {
    const newLead = {
      // Use crypto.randomUUID if available, else fallback to timestamp string
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...leadData,
      // Convert monetary value string to number
      value: leadData.value ? Number(leadData.value) : 0,
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  /**
   * Modifies an existing lead record by ID.
   * 
   * @param {string} id - Target identifier.
   * @param {Partial<Lead>} updatedData - Values to merge.
   */
  const updateLead = (id, updatedData) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { 
              ...lead, 
              ...updatedData, 
              value: updatedData.value !== undefined ? Number(updatedData.value) : lead.value 
            }
          : lead
      )
    );
  };

  /**
   * Deletes a lead record by ID.
   * 
   * @param {string} id - ID of the lead to delete.
   */
  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  /**
   * Queries a lead record details by ID.
   * 
   * @param {string} id - Search target identifier.
   * @returns {Lead | undefined}
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * useLeads Custom Hook
 * Provides components convenient access to the global LeadContext values.
 * Throws a descriptive console error if accessed outside a LeadProvider wrapper.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads hook must be executed inside a LeadProvider wrapping tree.');
  }
  return context;
}
