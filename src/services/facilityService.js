import { apiRequest, API_ENDPOINTS } from './api.js';

export const facilityService = {
  // Get all facilities with pagination and filtering
  getFacilities: async (params = {}) => {
    const { page = 1, limit = 10, village, type, condition } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (village) queryParams.append('village', village);
    if (type) queryParams.append('type', type);
    if (condition) queryParams.append('condition', condition);
    
    const response = await apiRequest.get(`${API_ENDPOINTS.FACILITIES.LIST}?${queryParams}`);
    return response.data;
  },

  // Get facility by ID
  getFacilityById: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.FACILITIES.GET(id));
    return response.data;
  },

  // Create new facility
  createFacility: async (facilityData) => {
    const response = await apiRequest.post(API_ENDPOINTS.FACILITIES.CREATE, facilityData);
    return response.data;
  },

  // Update facility
  updateFacility: async (id, facilityData) => {
    const response = await apiRequest.put(API_ENDPOINTS.FACILITIES.UPDATE(id), facilityData);
    return response.data;
  },

  // Delete facility
  deleteFacility: async (id) => {
    const response = await apiRequest.delete(API_ENDPOINTS.FACILITIES.DELETE(id));
    return response.data;
  },

  // Upload facility images
  uploadFacilityImages: async (id, files, onProgress) => {
    const response = await apiRequest.post(
      `${API_ENDPOINTS.FACILITIES.UPLOAD_IMAGES(id)}`,
      files,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  },
};

export default facilityService;
