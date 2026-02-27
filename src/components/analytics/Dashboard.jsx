import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { analyticsService } from '../../services/analyticsService.js';
import { issueService } from '../../services/issueService.js';
import { inspectionService } from '../../services/inspectionService.js';
import { USER_ROLES } from '../../utils/constants.js';
import {
  Users,
  Building,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Activity,
  Eye,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const { user, isAdmin, isInspector, isCommunityLeader } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d

  // Fetch dashboard analytics
  const {
    data: dashboardData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery(
    ['dashboard-analytics', timeRange],
    () => analyticsService.getDashboard(timeRange),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch recent issues
  const {
    data: recentIssuesData,
    isLoading: issuesLoading,
  } = useQuery(
    'recent-issues',
    () => issueService.getIssues({ limit: 5, status: 'pending,in_progress' }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Fetch recent inspections
  const {
    data: recentInspectionsData,
    isLoading: inspectionsLoading,
  } = useQuery(
    'recent-inspections',
    () => inspectionService.getAllInspections({ limit: 5 }),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const { summary, charts, recentActivity } = dashboardData || {};
  const { issues: recentIssues } = recentIssuesData || {};
  const { data: recentInspections } = recentInspectionsData || {};

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const getRoleBasedView = () => {
    if (isAdmin()) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Summary Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Villages</dt>
                    <dd className="text-lg font-medium text-gray-900">{summary?.totalVillages || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">+12% from last month</div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Facilities</dt>
                    <dd className="text-lg font-medium text-gray-900">{summary?.totalFacilities || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">+8% from last month</div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClipboardCheck className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Inspections</dt>
                    <dd className="text-lg font-medium text-gray-900">{summary?.totalInspections || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">+15% from last month</div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Issues</dt>
                    <dd className="text-lg font-medium text-gray-900">{summary?.activeIssues || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-red-600">-5% from last month</div>
            </div>
          </div>
        </div>
      );
    }

    if (isInspector()) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Inspector Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{summary?.myInspections || 0}</div>
                  <div className="text-sm text-gray-500">Inspections This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{summary?.avgScore || 0}</div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </div>
            </div>

            {/* Recent Inspections */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Inspections</h3>
                <button
                  onClick={() => navigate('/inspections')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentInspections?.slice(0, 3).map((inspection) => (
                  <div key={inspection._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{inspection.facility?.name}</div>
                      <div className="text-sm text-gray-500">{new Date(inspection.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">Score: {inspection.score}/10</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/inspections/new')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  New Inspection
                </button>
                <button
                  onClick={() => navigate('/issues/new')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Issue
                </button>
                <button
                  onClick={() => navigate('/facilities')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <Building className="h-5 w-5 mr-2" />
                  View Facilities
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isCommunityLeader()) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Village Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Village Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{summary?.villageFacilities || 0}</div>
                  <div className="text-sm text-gray-500">Total Facilities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{summary?.villageIssues || 0}</div>
                  <div className="text-sm text-gray-500">Reported Issues</div>
                </div>
              </div>
            </div>

            {/* Recent Issues */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Issues</h3>
                <button
                  onClick={() => navigate('/issues')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentIssues?.slice(0, 3).map((issue) => (
                  <div key={issue._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{issue.title}</div>
                        <div className="text-sm text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/issues/new')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Issue
                </button>
                <button
                  onClick={() => navigate('/facilities')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Building className="h-5 w-5 mr-2" />
                  View Facilities
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">Error loading dashboard: {analyticsError.message}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back, {user?.name}! Here's what's happening in your area.
          </p>
        </div>
      </div>

      {/* Role-based Dashboard View */}
      {getRoleBasedView()}

      {/* Charts Section - Admin Only */}
      {isAdmin() && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inspections Over Time */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inspections Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts?.inspectionsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Facility Conditions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Conditions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts?.facilityConditions || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(charts?.facilityConditions || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity - All Roles */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Issues */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Recent Issues</h4>
              <button
                onClick={() => navigate('/issues')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentIssues?.map((issue) => (
                <div key={issue._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{issue.title}</div>
                    <div className="text-sm text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inspections */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Recent Inspections</h4>
              <button
                onClick={() => navigate('/inspections')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentInspections?.map((inspection) => (
                <div key={inspection._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{inspection.facility?.name}</div>
                    <div className="text-sm text-gray-500">{new Date(inspection.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">Score: {inspection.score}/10</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
