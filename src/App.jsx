/**
 * App Component - Main router
 * Rural Sanitation Inspection and Improvement System
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';
import Unauthorized from './pages/public/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVillages from './pages/admin/ManageVillages';
import ViewInspections from './pages/admin/ViewInspections';
import ManageIssues from './pages/admin/ManageIssues';

// Inspector pages
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import AssignedVillages from './pages/inspector/AssignedVillages';
import CreateInspection from './pages/inspector/CreateInspection';
import MyInspections from './pages/inspector/MyInspections';

// Leader pages
import LeaderDashboard from './pages/leader/LeaderDashboard';
import ReportIssue from './pages/leader/ReportIssue';
import MyIssues from './pages/leader/MyIssues';
import VillageStatus from './pages/leader/VillageStatus';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="villages" element={<ManageVillages />} />
            <Route path="inspections" element={<ViewInspections />} />
            <Route path="issues" element={<ManageIssues />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Inspector routes */}
          <Route
            path="/inspector"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['inspector']}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<InspectorDashboard />} />
            <Route path="villages" element={<AssignedVillages />} />
            <Route path="inspections" element={<MyInspections />} />
            <Route path="inspections/create" element={<CreateInspection />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Community Leader routes */}
          <Route
            path="/leader"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['communityLeader']}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<LeaderDashboard />} />
            <Route path="issues" element={<MyIssues />} />
            <Route path="issues/report" element={<ReportIssue />} />
            <Route path="status" element={<VillageStatus />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
