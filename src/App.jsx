/**
 * App Component - Main router
 * Rural Sanitation Inspection and Improvement System
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { AdminRoute, InspectorRoute, CommunityLeaderRoute } from './components/common/ProtectedRoute.jsx';

// Layout Components
import Layout from './layouts/Layout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

// Page Components
import Home from './pages/public/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VillagesPage from './pages/VillagesPage.jsx';
import FacilitiesPage from './pages/FacilitiesPage.jsx';
import InspectionsPage from './pages/InspectionsPage.jsx';
import IssuesPage from './pages/IssuesPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import InspectorDashboard from './pages/inspector/InspectorDashboard.jsx';
import LeaderDashboard from './pages/leader/LeaderDashboard.jsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: 'dark',
              },
              error: {
                duration: 5000,
                iconTheme: 'dark',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <SignupPage />
                </AuthLayout>
              }
            />
            
            {/* Protected Routes */}
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Role-specific dashboards */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/inspector/dashboard"
              element={
                <InspectorRoute>
                  <Layout>
                    <InspectorDashboard />
                  </Layout>
                </InspectorRoute>
              }
            />
            <Route
              path="/leader/dashboard"
              element={
                <CommunityLeaderRoute>
                  <Layout>
                    <LeaderDashboard />
                  </Layout>
                </CommunityLeaderRoute>
              }
            />
            
            {/* Admin Only Routes */}
            <Route path="/users" element={
              <AdminRoute>
                <Layout>
                  <UsersPage />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/villages" element={
              <AdminRoute>
                <Layout>
                  <VillagesPage />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/reports" element={
              <AdminRoute>
                <Layout>
                  <ReportsPage />
                </Layout>
              </AdminRoute>
            } />
            
            <Route path="/analytics" element={
              <AdminRoute>
                <Layout>
                  <AnalyticsPage />
                </Layout>
              </AdminRoute>
            } />
            
            {/* Admin/Inspector Routes */}
            <Route path="/facilities" element={
              <ProtectedRoute requiredRoles={['admin', 'inspector']}>
                <Layout>
                  <FacilitiesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/inspections" element={
              <InspectorRoute>
                <Layout>
                  <InspectionsPage />
                </Layout>
              </InspectorRoute>
            } />
            
            {/* Admin/Inspector/Community Leader Routes */}
            <Route path="/issues" element={
              <ProtectedRoute requiredRoles={['admin', 'inspector', 'community_leader']}>
                <Layout>
                  <IssuesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* User Profile Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
