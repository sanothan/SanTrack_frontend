import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicLayout from './layouts/PublicLayout';
import PublicHome from './pages/PublicHome';
import PublicAbout from './pages/PublicAbout';
import PublicContact from './pages/PublicContact';
import PublicReport from './pages/PublicReport';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import InspectorDashboard from './pages/InspectorDashboard';
import CommunityDashboard from './pages/CommunityDashboard';
import VillageManagement from './pages/VillageManagement';
import UserManagement from './pages/UserManagement';
import FacilityManagement from './pages/FacilityManagement';
import InspectionManagement from './pages/InspectionManagement';
import InspectionForm from './pages/InspectionForm';
import IssueTracking from './pages/IssueTracking';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/about" element={<PublicAbout />} />
            <Route path="/contact" element={<PublicContact />} />
            <Route path="/report" element={<PublicReport />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Route>
          </Route>

          {/* Main Dashboard Layout wrapper block */}
          <Route element={<DashboardLayout />}>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/villages" element={<VillageManagement />} />
              <Route path="/admin/facilities" element={<FacilityManagement />} />
              <Route path="/admin/inspections" element={<InspectionManagement />} />
              <Route path="/admin/issues" element={<IssueTracking />} />
            </Route>

            {/* Inspector Routes */}
            <Route element={<ProtectedRoute allowedRoles={['inspector']} />}>
              <Route path="/inspector" element={<InspectorDashboard />} />
              <Route path="/inspector/facilities" element={<FacilityManagement />} />
              <Route path="/inspector/inspections" element={<InspectionManagement />} />
              <Route path="/inspector/inspections/new" element={<InspectionForm />} />
              <Route path="/inspector/issues" element={<IssueTracking />} />
            </Route>

            {/* Community Routes */}
            <Route element={<ProtectedRoute allowedRoles={['community']} />}>
              <Route path="/community" element={<CommunityDashboard />} />
              <Route path="/community/facilities" element={<FacilityManagement />} />
              <Route path="/community/issues" element={<IssueTracking />} />
            </Route>

          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
