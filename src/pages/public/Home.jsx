/**
 * Home Page - Landing page
 */

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
          Rural Sanitation Inspection & Improvement System
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Empowering communities to track, report, and improve sanitation standards across rural areas.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/login"
            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-secondary-600 hover:bg-secondary-500 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="font-semibold text-primary-800 mb-2">Community Leaders</h3>
          <p className="text-gray-600">Report sanitation issues and track improvements in your village.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-semibold text-primary-800 mb-2">Inspectors</h3>
          <p className="text-gray-600">Conduct inspections and maintain quality standards.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="font-semibold text-primary-800 mb-2">Administrators</h3>
          <p className="text-gray-600">Manage users, villages, and oversee the entire system.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
