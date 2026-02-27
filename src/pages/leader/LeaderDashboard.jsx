/**
 * Leader Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const LeaderDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/issues?limit=100');
        const data = res.data.data || [];
        setStats({
          total: data.length,
          pending: data.filter((i) => i.status === 'Pending').length,
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
        <h2 className="text-2xl font-bold text-gray-800">Community Leader Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Member 4 – Issue & Improvement Tracking CRUD module (create, track, update, resolve issues).
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/issues">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-700">All Issues</h3>
            <p className="text-3xl font-bold text-primary-800 mt-1">{stats.total}</p>
            <p className="text-sm text-primary-600 mt-2">Go to issues CRUD →</p>
          </div>
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="font-semibold text-gray-700">Pending issues</h3>
          <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          <p className="text-sm text-gray-500 mt-2">
            Use the issues module to update status to In Progress or Resolved.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/issues"
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg inline-block text-sm font-medium"
        >
          Open Issue Management
        </Link>
        <Link
          to="/leader/issues/report"
          className="bg-white border border-gray-200 hover:border-primary-400 text-gray-700 px-6 py-3 rounded-lg inline-block text-sm font-medium"
        >
          Report New Issue
        </Link>
      </div>
    </div>
  );
};

export default LeaderDashboard;
