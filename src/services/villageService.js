import { apiRequest, API_ENDPOINTS } from './api.js';

export const villageService = {
  // Get all villages with pagination and filtering
  getVillages: async (params = {}) => {
    const { page = 1, limit = 10, name, district, state } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (name) queryParams.append('name', name);
    if (district) queryParams.append('district', district);
    if (state) queryParams.append('state', state);
    
    const response = await apiRequest.get(`${API_ENDPOINTS.VILLAGES.LIST}?${queryParams}`);
    return response.data;
  },

  // Get village by ID
  getVillageById: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.VILLAGES.GET(id));
    return response.data;
  },

  // Create new village
  createVillage: async (villageData) => {
    const response = await apiRequest.post(API_ENDPOINTS.VILLAGES.CREATE, villageData);
    return response.data;
  },

  // Update village
  updateVillage: async (id, villageData) => {
    const response = await apiRequest.put(API_ENDPOINTS.VILLAGES.UPDATE(id), villageData);
    return response.data;
  },

  // Delete village
  deleteVillage: async (id) => {
    const response = await apiRequest.delete(API_ENDPOINTS.VILLAGES.DELETE(id));
    return response.data;
  },

  // Get village statistics
  getVillageStats: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.VILLAGES.STATS(id));
    return response.data;
  },
};

export default villageService;
