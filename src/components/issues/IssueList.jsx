import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issueService } from '../../services/issueService.js';
import { ISSUE_STATUS, ISSUE_SEVERITY, PAGINATION } from '../../utils/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react';

const IssueList = () => {
  const { canAccessIssues, user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    status: '',
    severity: '',
    facility: '',
    assignedTo: '',
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Fetch issues with React Query
  const {
    data: issuesData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['issues', filters],
    () => issueService.getIssues(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Update issue status mutation
  const updateIssueMutation = useMutation(
    ({ id, data }) => issueService.updateIssue(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('issues');
        toast.success('Issue updated successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  // Resolve issue mutation
  const resolveIssueMutation = useMutation(
    ({ id, resolutionNotes }) => issueService.resolveIssue(id, { resolutionNotes }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('issues');
        toast.success('Issue resolved successfully');
        setShowAssignModal(false);
        setSelectedIssue(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : PAGINATION.DEFAULT_PAGE,
    }));
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const handleStatusFilter = (status) => {
    handleFilterChange('status', status);
  };

  const handleSeverityFilter = (severity) => {
    handleFilterChange('severity', severity);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage);
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await updateIssueMutation.mutateAsync({
        id: issueId,
        data: { status: newStatus },
      });
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  const handleAssignIssue = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const handleResolveIssue = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const confirmResolveIssue = async (resolutionNotes) => {
    try {
      await resolveIssueMutation.mutateAsync({
        id: selectedIssue._id,
        resolutionNotes,
      });
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case ISSUE_STATUS.PENDING:
        return 'bg-gray-100 text-gray-800';
      case ISSUE_STATUS.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case ISSUE_STATUS.RESOLVED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case ISSUE_SEVERITY.LOW:
        return 'bg-gray-100 text-gray-800';
      case ISSUE_SEVERITY.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case ISSUE_SEVERITY.HIGH:
        return 'bg-orange-100 text-orange-800';
      case ISSUE_SEVERITY.CRITICAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ISSUE_STATUS.PENDING:
        return <Clock className="h-4 w-4" />;
      case ISSUE_STATUS.IN_PROGRESS:
        return <AlertTriangle className="h-4 w-4" />;
      case ISSUE_STATUS.RESOLVED:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case ISSUE_SEVERITY.CRITICAL:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case ISSUE_SEVERITY.HIGH:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case ISSUE_SEVERITY.MEDIUM:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!canAccessIssues) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have permission to access issue management.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">Error loading issues: {error.message}</div>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { data: issues, pagination } = issuesData || {};

  // Group issues by status for Kanban view
  const issuesByStatus = {
    [ISSUE_STATUS.PENDING]: issues?.filter(issue => issue.status === ISSUE_STATUS.PENDING) || [],
    [ISSUE_STATUS.IN_PROGRESS]: issues?.filter(issue => issue.status === ISSUE_STATUS.IN_PROGRESS) || [],
    [ISSUE_STATUS.RESOLVED]: issues?.filter(issue => issue.status === ISSUE_STATUS.RESOLVED) || [],
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Issues
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage community-reported issues.
          </p>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mt-4 sm:mt-0 sm:flex-none space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search issues..."
            onChange={handleSearch}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Status</option>
          <option value={ISSUE_STATUS.PENDING}>Pending</option>
          <option value={ISSUE_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={ISSUE_STATUS.RESOLVED}>Resolved</option>
        </select>

        {/* Severity Filter */}
        <select
          value={filters.severity}
          onChange={(e) => handleSeverityFilter(e.target.value)}
          className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Severities</option>
          <option value={ISSUE_SEVERITY.LOW}>Low</option>
          <option value={ISSUE_SEVERITY.MEDIUM}>Medium</option>
          <option value={ISSUE_SEVERITY.HIGH}>High</option>
          <option value={ISSUE_SEVERITY.CRITICAL}>Critical</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              viewMode === 'kanban'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kanban
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Issue
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Severity
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Assigned To
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Created
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {issues?.map((issue) => (
                      <tr key={issue._id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div>
                            <div className="font-medium text-gray-900">{issue.title}</div>
                            <div className="text-gray-500 text-sm mt-1">{issue.description}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityBadgeClass(issue.severity)}`}>
                            {getSeverityIcon(issue.severity)}
                            <span className="ml-1">{issue.severity.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(issue.status)}`}>
                            {getStatusIcon(issue.status)}
                            <span className="ml-1">{issue.status.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {issue.assignedTo?.name || 'Unassigned'}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {/* Navigate to issue details */}}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAssignIssue(issue)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(issue._id, ISSUE_STATUS.RESOLVED)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(issuesByStatus).map(([status, statusIssues]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {status.replace('_', ' ').toUpperCase()}
                </h3>
                <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {statusIssues.length}
                </span>
              </div>
              <div className="space-y-3">
                {statusIssues.map((issue) => (
                  <div key={issue._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{issue.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{issue.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityBadgeClass(issue.severity)}`}>
                            {getSeverityIcon(issue.severity)}
                            <span className="ml-1">{issue.severity.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleAssignIssue(issue)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(issue._id, ISSUE_STATUS.RESOLVED)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Assign/Resolve Modal */}
      {showAssignModal && selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedIssue.status === ISSUE_STATUS.RESOLVED ? 'Resolve Issue' : 'Assign Issue'}
              </h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedIssue(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Issue Title
                </label>
                <div className="mt-1 text-sm text-gray-900">{selectedIssue.title}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1 text-sm text-gray-900">{selectedIssue.description}</div>
              </div>

              {selectedIssue.status !== ISSUE_STATUS.RESOLVED && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign To
                  </label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Select user...</option>
                    {/* In a real implementation, you would fetch users here */}
                  </select>
                </div>
              )}

              {selectedIssue.status === ISSUE_STATUS.RESOLVED && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter resolution notes..."
                    onChange={(e) => {
                      setSelectedIssue(prev => ({ ...prev, resolutionNotes: e.target.value }));
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedIssue(null);
                }}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedIssue.status === ISSUE_STATUS.RESOLVED) {
                    confirmResolveIssue(selectedIssue.resolutionNotes);
                  } else {
                    // Handle assignment logic here
                    toast.success('Issue assigned successfully');
                    setShowAssignModal(false);
                    setSelectedIssue(null);
                  }
                }}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {selectedIssue.status === ISSUE_STATUS.RESOLVED ? 'Resolve' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueList;
