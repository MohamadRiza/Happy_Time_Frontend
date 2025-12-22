// src/pages/AdminDashboard.jsx
import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Products', value: '24', icon: '⌚', color: 'text-gold' },
          { title: 'Open Vacancies', value: '3', icon: '👥', color: 'text-blue-400' },
          { title: 'New Messages', value: '7', icon: '✉️', color: 'text-emerald-400' },
          { title: 'Customers', value: '142', icon: '👤', color: 'text-purple-400' },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`text-3xl mb-3 ${card.color}`}>{card.icon}</div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <span className="text-xs text-gray-500">Last 7 days</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-start pb-4 border-b border-gray-800/50 last:border-0 last:pb-0">
            <div className="bg-gold/10 p-2 rounded-lg mr-3">
              <span className="text-gold">⌚</span>
            </div>
            <div>
              <p className="text-white">
                New product added: <span className="font-medium">Rolex Submariner</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start pb-4 border-b border-gray-800/50 last:border-0 last:pb-0">
            <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
              <span className="text-blue-400">👥</span>
            </div>
            <div>
              <p className="text-white">
                New vacancy posted: <span className="font-medium">Watch Authenticator</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;