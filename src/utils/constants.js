// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  INSPECTOR: 'inspector',
  COMMUNITY_LEADER: 'community_leader',
};

// Facility types
export const FACILITY_TYPES = {
  TOILET: 'toilet',
  WELL: 'well',
  WATER_TANK: 'water_tank',
  HAND_PUMP: 'hand_pump',
};

export const FACILITY_TYPE_LABELS = {
  [FACILITY_TYPES.TOILET]: 'Toilet',
  [FACILITY_TYPES.WELL]: 'Well',
  [FACILITY_TYPES.WATER_TANK]: 'Water Tank',
  [FACILITY_TYPES.HAND_PUMP]: 'Hand Pump',
};

// Facility conditions
export const FACILITY_CONDITIONS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  CRITICAL: 'critical',
};

export const FACILITY_CONDITION_LABELS = {
  [FACILITY_CONDITIONS.EXCELLENT]: 'Excellent',
  [FACILITY_CONDITIONS.GOOD]: 'Good',
  [FACILITY_CONDITIONS.FAIR]: 'Fair',
  [FACILITY_CONDITIONS.POOR]: 'Poor',
  [FACILITY_CONDITIONS.CRITICAL]: 'Critical',
};

export const FACILITY_CONDITION_COLORS = {
  [FACILITY_CONDITIONS.EXCELLENT]: 'bg-green-100 text-green-800',
  [FACILITY_CONDITIONS.GOOD]: 'bg-blue-100 text-blue-800',
  [FACILITY_CONDITIONS.FAIR]: 'bg-yellow-100 text-yellow-800',
  [FACILITY_CONDITIONS.POOR]: 'bg-orange-100 text-orange-800',
  [FACILITY_CONDITIONS.CRITICAL]: 'bg-red-100 text-red-800',
};

// Inspection status
export const INSPECTION_STATUS = {
  GOOD: 'good',
  NEEDS_ATTENTION: 'needs_attention',
  CRITICAL: 'critical',
};

export const INSPECTION_STATUS_LABELS = {
  [INSPECTION_STATUS.GOOD]: 'Good',
  [INSPECTION_STATUS.NEEDS_ATTENTION]: 'Needs Attention',
  [INSPECTION_STATUS.CRITICAL]: 'Critical',
};

export const INSPECTION_STATUS_COLORS = {
  [INSPECTION_STATUS.GOOD]: 'bg-green-100 text-green-800',
  [INSPECTION_STATUS.NEEDS_ATTENTION]: 'bg-yellow-100 text-yellow-800',
  [INSPECTION_STATUS.CRITICAL]: 'bg-red-100 text-red-800',
};

// Issue status
export const ISSUE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
};

export const ISSUE_STATUS_LABELS = {
  [ISSUE_STATUS.PENDING]: 'Pending',
  [ISSUE_STATUS.IN_PROGRESS]: 'In Progress',
  [ISSUE_STATUS.RESOLVED]: 'Resolved',
};

export const ISSUE_STATUS_COLORS = {
  [ISSUE_STATUS.PENDING]: 'bg-gray-100 text-gray-800',
  [ISSUE_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ISSUE_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
};

// Issue severity
export const ISSUE_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const ISSUE_SEVERITY_LABELS = {
  [ISSUE_SEVERITY.LOW]: 'Low',
  [ISSUE_SEVERITY.MEDIUM]: 'Medium',
  [ISSUE_SEVERITY.HIGH]: 'High',
  [ISSUE_SEVERITY.CRITICAL]: 'Critical',
};

export const ISSUE_SEVERITY_COLORS = {
  [ISSUE_SEVERITY.LOW]: 'bg-gray-100 text-gray-800',
  [ISSUE_SEVERITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [ISSUE_SEVERITY.HIGH]: 'bg-orange-100 text-orange-800',
  [ISSUE_SEVERITY.CRITICAL]: 'bg-red-100 text-red-800',
};

// Report types
export const REPORT_TYPES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
};

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.MONTHLY]: 'Monthly',
  [REPORT_TYPES.QUARTERLY]: 'Quarterly',
  [REPORT_TYPES.YEARLY]: 'Yearly',
  [REPORT_TYPES.CUSTOM]: 'Custom',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    PROFILE: '/users/profile/me',
    UPDATE_PROFILE: '/users/profile/me',
  },
  VILLAGES: {
    LIST: '/villages',
    CREATE: '/villages',
    GET: (id) => `/villages/${id}`,
    UPDATE: (id) => `/villages/${id}`,
    DELETE: (id) => `/villages/${id}`,
    STATS: (id) => `/villages/${id}/stats`,
  },
  FACILITIES: {
    LIST: '/facilities',
    CREATE: '/facilities',
    GET: (id) => `/facilities/${id}`,
    UPDATE: (id) => `/facilities/${id}`,
    DELETE: (id) => `/facilities/${id}`,
    UPLOAD_IMAGES: (id) => `/facilities/${id}/images`,
  },
  INSPECTIONS: {
    LIST: '/inspections',
    CREATE: '/inspections',
    GET: (id) => `/inspections/${id}`,
    UPDATE: (id) => `/inspections/${id}`,
    DELETE: (id) => `/inspections/${id}`,
    FACILITY_INSPECTIONS: (facilityId) => `/facilities/${facilityId}/inspections`,
  },
  ISSUES: {
    LIST: '/issues',
    CREATE: '/issues',
    GET: (id) => `/issues/${id}`,
    UPDATE: (id) => `/issues/${id}`,
    DELETE: (id) => `/issues/${id}`,
    RESOLVE: (id) => `/issues/${id}/resolve`,
  },
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id) => `/reports/${id}`,
    UPDATE: (id) => `/reports/${id}`,
    DELETE: (id) => `/reports/${id}`,
    DOWNLOAD: (id) => `/reports/${id}/download`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    VILLAGES: '/analytics/villages',
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'santrack_token',
  USER_DATA: 'santrack_user',
  THEME: 'santrack_theme',
  LANGUAGE: 'santrack_language',
};

// Toast messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'Logout successful',
  SAVE_SUCCESS: 'Saved successfully',
  SAVE_ERROR: 'Failed to save. Please try again.',
  DELETE_SUCCESS: 'Deleted successfully',
  DELETE_ERROR: 'Failed to delete. Please try again.',
  UPLOAD_SUCCESS: 'Files uploaded successfully',
  UPLOAD_ERROR: 'Failed to upload files. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Navigation items
export const NAVIGATION_ITEMS = {
  DASHBOARD: '/dashboard',
  USERS: '/users',
  VILLAGES: '/villages',
  FACILITIES: '/facilities',
  INSPECTIONS: '/inspections',
  ISSUES: '/issues',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#6366f1',
  GRAY: '#6b7280',
};
