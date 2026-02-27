import { apiRequest, API_ENDPOINTS } from './api.js';

export const analyticsService = {
  // Get dashboard analytics
  getDashboard: async (timeRange = '30d') => {
    const response = await apiRequest.get(`${API_ENDPOINTS.ANALYTICS.DASHBOARD}?timeRange=${timeRange}`);
    return response.data;
  },

  // Get village-level analytics
  getVillages: async () => {
    const response = await apiRequest.get(API_ENDPOINTS.ANALYTICS.VILLAGES);
    return response.data;
  },
};

export default analyticsService;
