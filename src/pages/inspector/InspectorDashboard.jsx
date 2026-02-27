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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Inspector Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Member 3 – Inspection Management CRUD module (create, read, update, delete inspections).
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/inspections">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-700">All Inspections</h3>
            <p className="text-3xl font-bold text-primary-800 mt-1">{stats.inspections}</p>
            <p className="text-sm text-primary-600 mt-2">Go to inspections CRUD →</p>
          </div>
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="font-semibold text-gray-700">Completed inspections</h3>
          <p className="text-3xl font-bold text-secondary-600 mt-1">{stats.completed}</p>
          <p className="text-sm text-gray-500 mt-2">
            Based on inspection status in the inspection management module.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/inspections"
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg inline-block text-sm font-medium"
        >
          Open Inspection Management
        </Link>
        <Link
          to="/issues"
          className="bg-white border border-gray-200 hover:border-primary-400 text-gray-700 px-6 py-3 rounded-lg inline-block text-sm font-medium"
        >
          View Issues Linked to Inspections
        </Link>
      </div>
    </div>
  );
};

export default InspectorDashboard;
