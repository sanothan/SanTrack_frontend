/**
 * Unauthorized Page - Access denied
 */

import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="text-xl text-gray-600 mt-4">You do not have permission to access this page.</p>
      <Link to="/" className="mt-6 text-primary-600 hover:underline">Go to Home</Link>
    </div>
  );
};

export default Unauthorized;
