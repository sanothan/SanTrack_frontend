/**
 * Admin Dashboard
 * Overview statistics and quick links
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, villages: 0, inspections: 0, issues: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, villagesRes, inspectionsRes, issuesRes] = await Promise.all([
          axiosInstance.get('/users?limit=1'),
          axiosInstance.get('/villages?limit=1'),
          axiosInstance.get('/inspections?limit=1'),
          axiosInstance.get('/issues?limit=1'),
        ]);
        setStats({
          users: usersRes.data.pagination?.total || 0,
          villages: villagesRes.data.pagination?.total || 0,
          inspections: inspectionsRes.data.pagination?.total || 0,
          issues: issuesRes.data.pagination?.total || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Users', value: stats.users, link: '/admin/users', color: 'bg-primary-500', icon: '👥' },
    { title: 'Villages', value: stats.villages, link: '/admin/villages', color: 'bg-secondary-500', icon: '🏘️' },
    { title: 'Inspections', value: stats.inspections, link: '/admin/inspections', color: 'bg-blue-500', icon: '🔍' },
    { title: 'Issues', value: stats.issues, link: '/admin/issues', color: 'bg-amber-500', icon: '📋' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-2xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-600">{card.title}</h3>
              <p className="text-3xl font-bold text-primary-800 mt-1">{card.value}</p>
              <p className="text-sm text-primary-600 mt-2">View all →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
