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
    {
      title: 'User Management (Member 1)',
      subtitle: 'Create, read, update, delete users',
      value: stats.users,
      link: '/users',
      color: 'bg-primary-500',
      icon: '👥',
    },
    {
      title: 'Villages & Facilities (Member 2)',
      subtitle: 'Manage locations and sanitation facilities',
      value: stats.villages,
      link: '/villages',
      color: 'bg-secondary-500',
      icon: '🏘️',
    },
    {
      title: 'Inspections (Member 3)',
      subtitle: 'Core inspection records and scores',
      value: stats.inspections,
      link: '/inspections',
      color: 'bg-blue-500',
      icon: '🔍',
    },
    {
      title: 'Issues & Improvements (Member 4)',
      subtitle: 'Track pending and resolved sanitation issues',
      value: stats.issues,
      link: '/issues',
      color: 'bg-amber-500',
      icon: '📋',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          System owner view. Each card below corresponds to a full CRUD module owned by a team
          member for viva.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-2xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{card.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              <p className="text-3xl font-bold text-primary-800 mt-3">{card.value}</p>
              <p className="text-sm text-primary-600 mt-2">Open module →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
