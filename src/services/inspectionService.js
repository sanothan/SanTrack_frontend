import { apiRequest, uploadFiles, API_ENDPOINTS } from './api.js';

export const inspectionService = {
  // Get all inspections with pagination and filtering
  getAllInspections: async (params = {}) => {
    const { page = 1, limit = 10, facility, inspector, status, startDate, endDate } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (facility) queryParams.append('facility', facility);
    if (inspector) queryParams.append('inspector', inspector);
    if (status) queryParams.append('status', status);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const response = await apiRequest.get(`${API_ENDPOINTS.INSPECTIONS.LIST}?${queryParams}`);
    return response.data;
  },

  // Get inspection by ID
  getInspectionById: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.INSPECTIONS.GET(id));
    return response.data;
  },

  // Create new inspection
  createInspection: async (inspectionData) => {
    const response = await apiRequest.post(API_ENDPOINTS.INSPECTIONS.CREATE, inspectionData);
    return response.data;
  },

  // Update inspection
  updateInspection: async (id, inspectionData) => {
    const response = await apiRequest.put(API_ENDPOINTS.INSPECTIONS.UPDATE(id), inspectionData);
    return response.data;
  },

  // Delete inspection
  deleteInspection: async (id) => {
    const response = await apiRequest.delete(API_ENDPOINTS.INSPECTIONS.DELETE(id));
    return response.data;
  },

  // Get inspections for a specific facility
  getFacilityInspections: async (facilityId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiRequest.get(
      `${API_ENDPOINTS.INSPECTIONS.FACILITY_INSPECTIONS(facilityId)}?${queryParams}`
    );
    return response.data;
  },

  // Upload inspection images
  uploadInspectionImages: async (id, files, onProgress) => {
    const response = await uploadFiles(
      `${API_ENDPOINTS.INSPECTIONS.UPDATE(id)}/images`,
      files,
      onProgress
    );
    return response.data;
  },
};

export default inspectionService;
