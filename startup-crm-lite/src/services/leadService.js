import api from './api';

/**
 * getLeads
 * Fetches matching leads list based on search/status/pagination filters.
 */
export const getLeads = async (params) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * createLead
 * Creates a new lead record.
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * updateLead
 * Completely modifies an existing lead.
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * updateLeadStatus
 * Patches only the status value of a lead.
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * deleteLead
 * Removes a lead permanently.
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * getLeadStats
 * Aggregates summary statistics.
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * getMonthlyStats
 * Retrieves chronological monthly aggregates.
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};
