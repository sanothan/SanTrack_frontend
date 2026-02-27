import { apiRequest, API_ENDPOINTS } from './api.js';

export const issueService = {
  // Get all issues with pagination and filtering
  getIssues: async (params = {}) => {
    const { page = 1, limit = 10, status, facility, assignedTo, severity } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) queryParams.append('status', status);
    if (facility) queryParams.append('facility', facility);
    if (assignedTo) queryParams.append('assignedTo', assignedTo);
    if (severity) queryParams.append('severity', severity);
    
    const response = await apiRequest.get(`${API_ENDPOINTS.ISSUES.LIST}?${queryParams}`);
    return response.data;
  },

  // Get issue by ID
  getIssueById: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.ISSUES.GET(id));
    return response.data;
  },

  // Create new issue
  createIssue: async (issueData) => {
    const response = await apiRequest.post(API_ENDPOINTS.ISSUES.CREATE, issueData);
    return response.data;
  },

  // Update issue
  updateIssue: async (id, issueData) => {
    const response = await apiRequest.put(API_ENDPOINTS.ISSUES.UPDATE(id), issueData);
    return response.data;
  },

  // Delete issue
  deleteIssue: async (id) => {
    const response = await apiRequest.delete(API_ENDPOINTS.ISSUES.DELETE(id));
    return response.data;
  },

  // Resolve issue
  resolveIssue: async (id, resolutionData) => {
    const response = await apiRequest.patch(API_ENDPOINTS.ISSUES.RESOLVE(id), resolutionData);
    return response.data;
  },
};

export default issueService;
