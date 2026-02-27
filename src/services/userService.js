import { apiRequest, API_ENDPOINTS } from './api.js';

export const userService = {
  // Get all users with pagination and filtering
  getUsers: async (params = {}) => {
    const { page = 1, limit = 10, role, village, isActive, search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (role) queryParams.append('role', role);
    if (village) queryParams.append('village', village);
    if (isActive !== undefined) queryParams.append('isActive', isActive.toString());
    if (search) queryParams.append('search', search);
    
    const response = await apiRequest.get(`${API_ENDPOINTS.USERS.LIST}?${queryParams}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiRequest.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    const response = await apiRequest.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiRequest.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await apiRequest.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiRequest.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    const response = await apiRequest.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
    return response.data;
  },
};

export default userService;
