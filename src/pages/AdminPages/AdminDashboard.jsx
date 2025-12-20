// src/pages/AdminDashboard.jsx
import React from 'react';
import { logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gold">Happy Time Admin</h1>
          <p className="text-gray-500 text-sm">Dashboard</p>
        </div>
        <nav className="mt-8">
          {[
            { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
            { name: 'Products', icon: '⌚', path: '/admin/products' },
            { name: 'Vacancies', icon: '👥', path: '/admin/vacancies' },
            { name: 'Messages', icon: '✉️', path: '/admin/messages' },
            { name: 'Customers', icon: '👤', path: '/admin/customers' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-gold transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-gold transition-colors"
          >
            <span>Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Products', value: '24', icon: '⌚' },
              { title: 'Open Vacancies', value: '3', icon: '👥' },
              { title: 'New Messages', value: '7', icon: '✉️' },
              { title: 'Customers', value: '142', icon: '👤' },
            ].map((card, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="text-2xl mb-2">{card.icon}</div>
                <h3 className="text-gray-400 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold text-gold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>New product added: Rolex Submariner</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span>New vacancy posted: Watch Authenticator</span>
                <span className="text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;