// src/components/AdminLayout.jsx
import React from 'react';
import { logout } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Products', icon: '⌚', path: '/admin/products' },
    { name: 'Vacancies', icon: '👥', path: '/admin/vacancies' },
    { name: 'Messages', icon: '✉️', path: '/admin/messages' },
    { name: 'Customers', icon: '👤', path: '/admin/customers' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-gold tracking-wide">Happy Time Admin</h1>
          <p className="text-gray-600 text-xs mt-1">Luxury Watch Management</p>
        </div>
        <nav className="flex-1 mt-6 px-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
                location.pathname === item.path
                  ? 'bg-gray-800 text-gold border-l-2 border-gold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gold'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
        <div className="py-4"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-gold transition-all duration-200 group"
          >
            <span className="mr-2">Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;