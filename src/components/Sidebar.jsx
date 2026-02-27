/**
 * Sidebar Component
 * Role-based navigation menu
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/villages', label: 'Manage Villages', icon: '🏘️' },
    { to: '/admin/inspections', label: 'View Inspections', icon: '🔍' },
    { to: '/admin/issues', label: 'Manage Issues', icon: '📋' },
  ];

  const inspectorLinks = [
    { to: '/inspector/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/inspector/villages', label: 'Assigned Villages', icon: '🏘️' },
    { to: '/inspector/inspections/create', label: 'Create Inspection', icon: '➕' },
    { to: '/inspector/inspections', label: 'My Inspections', icon: '📋' },
  ];

  const leaderLinks = [
    { to: '/leader/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/leader/issues/report', label: 'Report Issue', icon: '➕' },
    { to: '/leader/issues', label: 'My Issues', icon: '📋' },
    { to: '/leader/status', label: 'Village Status', icon: '📍' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin': return adminLinks;
      case 'inspector': return inspectorLinks;
      case 'communityLeader': return leaderLinks;
      default: return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary-700 text-white shadow-xl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-secondary-300">SanTrack</h2>
        <p className="text-sm text-primary-200 mt-1">{user?.name}</p>
        <p className="text-xs text-primary-300 capitalize">{user?.role}</p>
      </div>
      <nav className="mt-4">
        {getLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition ${
                isActive ? 'bg-primary-600 border-l-4 border-secondary-500' : 'hover:bg-primary-600'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-secondary-600 hover:bg-secondary-500 rounded-lg transition text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
