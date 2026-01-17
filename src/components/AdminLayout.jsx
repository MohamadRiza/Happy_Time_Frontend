// src/components/AdminLayout.jsx
import React from 'react';
import { logout } from '../utils/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// SVG Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ProductsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
  </svg>
);

const CustomersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0z" />
    <path fillRule="evenodd" d="M12.636 11.892a1 1 0 01.264.708v1.75a1 1 0 01-1 1H3a1 1 0 01-1-1v-1.75a1 1 0 01.264-.708l2.44-2.88A9.97 9.97 0 0110 3c1.94 0 3.79.66 5.36 1.892l2.44 2.88zM15 12a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 000 2h1.465a1 1 0 01.93.57l1.07 2.139a1 1 0 001.465.465l2.139-1.07a1 1 0 01.93.57L11.5 9H16a1 1 0 000-2H9.5a1 1 0 01-.93-.57l-1.07-2.139a1 1 0 00-1.465-.465L4.4 5.57A1 1 0 013.465 5H3z" />
    <path d="M14 13a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const MessagesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
  </svg>
);

const VacanciesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
);

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Updated nav order: Dashboard → Products → Customers → Orders → Messages → HR → Settings
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { name: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
    { name: 'Customers', icon: <CustomersIcon />, path: '/admin/customers' },
    { name: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' }, // ✅ Now with proper SVG
    { name: 'Messages', icon: <MessagesIcon />, path: '/admin/messages' },
    { name: 'Vacancies', icon: <VacanciesIcon />, path: '/admin/vacancies' },
    { name: 'Applications', icon: <ApplicationsIcon />, path: '/admin/applications' },
    { name: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo & Brand Header */}
        <div className="p-5 border-b border-gray-800/60">
          <div className="flex items-center space-x-3">
            <div className="bg-gold/10 p-2 rounded-lg">
              <img
                src="/logo.png"
                alt="Happy Time"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Happy Time</h1>
              <p className="text-xs text-gray-500 mt-0.5">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-gray-800 text-gold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gold'
              }`}
            >
              <span className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="py-4"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800/60 p-4 flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-gold transition-all duration-200 group"
          >
            <span className="text-sm font-medium">Logout</span>
            <LogoutIcon />
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;