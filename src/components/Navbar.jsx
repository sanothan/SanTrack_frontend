/**
 * Navbar Component
 * Public navigation with role-based links
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'inspector': return '/inspector/dashboard';
      case 'communityLeader': return '/leader/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-secondary-300 hover:text-white">
              SanTrack
            </Link>
            <Link to="/" className="hover:text-secondary-300">Home</Link>
            <Link to="/about" className="hover:text-secondary-300">About</Link>
            <Link to="/contact" className="hover:text-secondary-300">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="hover:text-secondary-300">
                  Dashboard
                </Link>
                <span className="text-sm text-primary-200">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-secondary-600 hover:bg-secondary-500 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary-300">Login</Link>
                <Link
                  to="/register"
                  className="bg-secondary-600 hover:bg-secondary-500 px-4 py-2 rounded-lg transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
