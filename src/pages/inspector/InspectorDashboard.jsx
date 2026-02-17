/**
 * Inspector Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const InspectorDashboard = () => {
  const [stats, setStats] = useState({ inspections: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/inspections?limit=100');
        const data = res.data.data || [];
        setStats({
          inspections: data.length,
          completed: data.filter((i) => i.status === 'Completed').length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inspector Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/inspector/inspections">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-600">My Inspections</h3>
            <p className="text-3xl font-bold text-primary-800 mt-1">{stats.inspections}</p>
          </div>
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="font-semibold text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-secondary-600 mt-1">{stats.completed}</p>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/inspector/inspections/create" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg inline-block">
          Create New Inspection
        </Link>
      </div>
    </div>
  );
};

export default InspectorDashboard;
