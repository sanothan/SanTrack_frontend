import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { USER_ROLES } from '../utils/constants.js';
import {
  Home,
  Users,
  Building,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin, isInspector, isCommunityLeader } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'inspector', 'community_leader'],
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Villages',
      href: '/villages',
      icon: Building,
      roles: ['admin'],
    },
    {
      name: 'Facilities',
      href: '/facilities',
      icon: Building,
      roles: ['admin', 'inspector'],
    },
    {
      name: 'Inspections',
      href: '/inspections',
      icon: ClipboardCheck,
      roles: ['admin', 'inspector'],
    },
    {
      name: 'Issues',
      href: '/issues',
      icon: AlertTriangle,
      roles: ['admin', 'inspector', 'community_leader'],
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      roles: ['admin'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['admin'],
    },
  ];

  // Adjust dashboard link based on role so each user lands on their own module
  const navigation = baseNavigation.map((item) => {
    if (item.name !== 'Dashboard') return item;

    let href = '/leader/dashboard';
    if (isAdmin()) href = '/admin/dashboard';
    else if (isInspector()) href = '/inspector/dashboard';

    return { ...item, href };
  });

  const filteredNavigation = navigation.filter(item => {
    if (item.roles.includes('admin')) return isAdmin();
    if (item.roles.includes('inspector')) return isInspector();
    if (item.roles.includes('community_leader')) return isCommunityLeader();
    return false;
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">SanTrack</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="flex h-16 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">SanTrack</h1>
              <span className="ml-2 text-sm text-gray-500">Rural Sanitation System</span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
