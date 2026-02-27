import axios from 'axios';
import { STORAGE_KEYS, TOAST_MESSAGES, API_ENDPOINTS } from '../utils/constants.js';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          throw new Error(TOAST_MESSAGES.FORBIDDEN);
        case 404:
          // Not found
          throw new Error(TOAST_MESSAGES.NOT_FOUND);
        case 422:
          // Validation error
          throw new Error(data.message || 'Validation failed');
        case 429:
          // Rate limit exceeded
          throw new Error('Too many requests. Please try again later.');
        case 500:
          // Server error
          throw new Error(TOAST_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(data.message || TOAST_MESSAGES.SERVER_ERROR);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.message === 'Network Error') {
      throw new Error(TOAST_MESSAGES.NETWORK_ERROR);
    } else {
      throw new Error(TOAST_MESSAGES.SERVER_ERROR);
    }
  }
);

// Retry logic for failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.message === TOAST_MESSAGES.NETWORK_ERROR) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Generic API methods
export const apiRequest = {
  get: (url, config = {}) => retryRequest(() => api.get(url, config)),
  post: (url, data, config = {}) => retryRequest(() => api.post(url, data, config)),
  put: (url, data, config = {}) => retryRequest(() => api.put(url, data, config)),
  patch: (url, data, config = {}) => retryRequest(() => api.patch(url, data, config)),
  delete: (url, config = {}) => retryRequest(() => api.delete(url, config)),
};

// File upload method
export const uploadFile = async (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Multiple files upload
export const uploadFiles = async (url, files, onProgress) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`images`, file);
  });
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export default api;
export { API_ENDPOINTS };
