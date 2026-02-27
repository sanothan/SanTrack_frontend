/**
 * 404 Not Found Page
 */

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link to="/" className="mt-6 text-primary-600 hover:underline">Go to Home</Link>
    </div>
  );
};

export default NotFound;
