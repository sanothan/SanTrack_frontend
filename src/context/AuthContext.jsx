/**
 * Auth Context
 * Provides authentication state and methods globally
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../services/api.js';
import { STORAGE_KEYS, TOAST_MESSAGES } from '../utils/constants.js';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
          payload: user,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        dispatch({
          type: AUTH_ACTIONS.LOGOUT,
        });
      }
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { data } = response; // { success, data: { user fields + token } }
      const authUser = data.data;

      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authUser.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authUser));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: authUser,
          token: authUser.token,
        },
      });
      
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      return authUser;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      toast.error(error.message || TOAST_MESSAGES.LOGIN_ERROR);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    dispatch({
      type: AUTH_ACTIONS.LOGOUT,
    });
    
    toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
  };

  // Register function (public signup)
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      const { data } = response; // { success, data: { user fields + token } }
      const createdUser = data.data;

      // Persist session immediately after signup
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, createdUser.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(createdUser));

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: createdUser,
          token: createdUser.token,
        },
      });
      // Also mark as logged in
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: createdUser,
          token: createdUser.token,
        },
      });
      
      toast.success(TOAST_MESSAGES.REGISTER_SUCCESS);
      return createdUser;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message,
      });
      toast.error(error.message || TOAST_MESSAGES.REGISTER_ERROR);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await apiRequest.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      const { data } = response; // { success, data: updatedUser }
      const updatedUser = data.data;
      
      // Update stored user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });
      
      toast.success(TOAST_MESSAGES.SAVE_SUCCESS);
      return updatedUser;
    } catch (error) {
      toast.error(error.message || TOAST_MESSAGES.SAVE_ERROR);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({
      type: AUTH_ACTIONS.CLEAR_ERROR,
    });
  };

  // Role-based helper functions
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  const isAdmin = () => hasRole('admin');
  const isInspector = () => hasRole('inspector');
  const isCommunityLeader = () => hasRole('community_leader');

  const canAccessUsers = () => isAdmin();
  const canAccessVillages = () => isAdmin();
  const canAccessFacilities = () => isAdmin() || isInspector();
  const canAccessInspections = () => isAdmin() || isInspector();
  const canAccessIssues = () => isAdmin() || isInspector() || isCommunityLeader();
  const canAccessReports = () => isAdmin();
  const canAccessAnalytics = () => isAdmin();

  const value = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    clearError,
    // Role helpers
    hasRole,
    hasAnyRole,
    isAdmin,
    isInspector,
    isCommunityLeader,
    canAccessUsers,
    canAccessVillages,
    canAccessFacilities,
    canAccessInspections,
    canAccessIssues,
    canAccessReports,
    canAccessAnalytics,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
