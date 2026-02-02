// src/pages/CustomerAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCustomerToken, getCustomer, customerLogout, customerLogin } from '../utils/auth';
import Loading from '../components/Loading';
import CustomerDashboard from '../components/CustomerAccountSec/CustomerDashboard';
import ProfileSection from '../components/CustomerAccountSec/ProfileSection';
import SupportSection from '../components/CustomerAccountSec/SupportSection';

const CustomerAccount = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      const token = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Fetch profile
        const profileRes = await fetch(`${API_URL}/api/customers/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        
        if (!profileData.success) {
          throw new Error(profileData.message || 'Failed to load profile');
        }
        
        setCustomer(profileData.data);

        // Fetch orders
        const ordersRes = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        
        if (ordersData.success) {
          setOrders(ordersData.data || []);
        }
      } catch (err) {
        console.error('Profile/Orders fetch error:', err);
        setError('Unable to load account. Please login again.');
        customerLogout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, [navigate]);

  const handleProfileUpdate = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  const handleLogout = () => {
    customerLogout();
    navigate('/login');
  };

  if (loading) {
    return <Loading message="Loading your account..." size="large" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 bg-gradient-to-br from-red-500/10 to-red-900/10 rounded-full flex items-center justify-center border-2 border-red-500/20">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gold text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 text-sm sm:text-base w-full sm:w-auto"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-gray-900 text-white border border-gray-700"
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-base sm:text-lg lg:text-2xl font-bold text-black">
                  {customer?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">My Account</h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-400 truncate">
                  Welcome back, <span className="text-gold font-semibold">{customer?.fullName?.split(' ')[0]}</span>!
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition border border-gray-700 hover:border-gold text-sm sm:text-base"
              >
                My Orders
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none bg-red-900/40 hover:bg-red-900/60 text-red-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition border border-red-800/50 hover:border-red-600 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Dashboard & Profile */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            <CustomerDashboard orders={orders} customer={customer} />
            <ProfileSection customer={customer} onProfileUpdate={handleProfileUpdate} />
          </div>
          
          {/* Right Column - Support */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <SupportSection />
            
            {/* Quick Actions */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left p-3 bg-black/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 transition active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">Continue Shopping</span>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-left p-3 bg-black/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 transition active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">View Cart</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;