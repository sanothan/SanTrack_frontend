import React from 'react';
import UserList from '../components/users/UserList.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const UsersPage = () => {
  const { canAccessUsers } = useAuth();

  if (!canAccessUsers) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-2 text-sm text-gray-500">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage system users, roles, and permissions.
        </p>
      </div>
      <UserList />
    </div>
  );
};

export default UsersPage;
