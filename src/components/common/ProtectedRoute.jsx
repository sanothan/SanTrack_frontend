import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants.js';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requireAuth = true,
  fallbackPath = '/login',
  unauthorizedPath = '/unauthorized'
}) => {
  const { isAuthenticated, user, hasAnyRole, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated and authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role permissions if roles are specified
  if (requiredRoles.length > 0 && isAuthenticated) {
    const hasRequiredRole = hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      return <Navigate to={unauthorizedPath} replace />;
    }
  }

  // If all checks pass, render the children
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (requiredRoles) => {
  return (Component) => {
    return (props) => (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific role protection components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const InspectorRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={[USER_ROLES.INSPECTOR, USER_ROLES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const CommunityLeaderRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={[USER_ROLES.COMMUNITY_LEADER, USER_ROLES.INSPECTOR, USER_ROLES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute requireAuth={true}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
