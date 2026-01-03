// src/pages/AdminPages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken, isAuthenticated } from '../../utils/auth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    openVacancies: 0,
    newMessages: 0,
    customers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate(); // ✅ Add navigate

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ ADD AUTHENTICATION CHECK
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    // Only fetch if authenticated (extra safety check)
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Fetch products count
      const productsRes = await fetch(`${API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const productsData = await productsRes.json();
      
      // Check if auth failed
      if (!productsData.success && productsData.message === 'Token is not valid') {
        navigate('/admin/login');
        return;
      }
      
      // Fetch vacancies count
      const vacanciesRes = await fetch(`${API_URL}/api/vacancies`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const vacanciesData = await vacanciesRes.json();
      
      // ✅ SAFE MESSAGES FETCH - Handles missing endpoint
      let newMessages = 0;
      let messagesData = { success: false, messages: [] };
      
      try {
        const messagesRes = await fetch(`${API_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        messagesData = await messagesRes.json();
        
        // ✅ Handle both possible response structures
        if (messagesData.success) {
          const messagesArray = messagesData.messages || messagesData.data || [];
          newMessages = messagesArray.filter(m => m.status === 'unread').length;
        }
      } catch (messagesError) {
        console.warn('Messages API not available:', messagesError);
        // Keep newMessages = 0 if API fails
      }

      // Calculate other stats
      const totalProducts = productsData.success ? (productsData.products || []).length : 0;
      const openVacancies = vacanciesData.success 
        ? (vacanciesData.data || []).filter(v => v.status === 'active').length 
        : 0;
      const customers = 0;

      setStats({
        totalProducts,
        openVacancies,
        newMessages,
        customers
      });

      // Build recent activity
      const activity = [];
      
      // Add recent products
      if (productsData.success && productsData.products) {
        const recentProducts = (productsData.products || [])
          .slice(0, 2)
          .map(product => ({
            type: 'product',
            message: `New product added: ${product.title}`,
            time: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown',
            icon: '⌚',
            color: 'text-gold'
          }));
        activity.push(...recentProducts);
      }

      // Add recent vacancies
      if (vacanciesData.success && vacanciesData.data) {
        const recentVacancies = (vacanciesData.data || [])
          .filter(v => v.status === 'active')
          .slice(0, 2)
          .map(vacancy => ({
            type: 'vacancy',
            message: `New vacancy posted: ${vacancy.title}`,
            time: vacancy.createdAt ? new Date(vacancy.createdAt).toLocaleDateString() : 'Unknown',
            icon: '👥',
            color: 'text-blue-400'
          }));
        activity.push(...recentVacancies);
      }

      // ✅ Add recent messages (if available)
      if (messagesData.success && (messagesData.messages || messagesData.data)) {
        const messagesArray = messagesData.messages || messagesData.data || [];
        const recentMessages = messagesArray
          .slice(0, 2)
          .map(message => ({
            type: 'message',
            message: `New message from: ${message.name || 'Customer'}`,
            time: message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Unknown',
            icon: '✉️',
            color: 'text-emerald-400'
          }));
        activity.push(...recentMessages);
      }

      // Sort by time (newest first) and limit to 4 items
      const sortedActivity = activity
        .sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return isNaN(dateB) ? -1 : isNaN(dateA) ? 1 : dateB - dateA;
        })
        .slice(0, 4);

      setRecentActivity(sortedActivity);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Loading state while checking auth
  if (loading && stats.totalProducts === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Total Products', 
            value: stats.totalProducts, 
            icon: '⌚', 
            color: 'text-gold' 
          },
          { 
            title: 'Open Vacancies', 
            value: stats.openVacancies, 
            icon: '👥', 
            color: 'text-blue-400' 
          },
          { 
            title: 'New Messages', 
            value: stats.newMessages, 
            icon: '✉️', 
            color: 'text-emerald-400' 
          },
          { 
            title: 'Customers', 
            value: stats.customers, 
            icon: '👤', 
            color: 'text-purple-400',
            subtitle: 'Coming soon'
          }
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`text-3xl mb-3 ${card.color}`}>{card.icon}</div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            {card.subtitle && (
              <p className="text-gray-500 text-xs mb-1">{card.subtitle}</p>
            )}
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                className="flex items-start pb-4 border-b border-gray-800/50 last:border-0 last:pb-0"
              >
                <div className={`p-2 rounded-lg mr-3 ${activity.color.replace('text-', 'bg-').replace('-400', '-900/30').replace('-gold', '-gold/10')}`}>
                  <span className={activity.color}>{activity.icon}</span>
                </div>
                <div>
                  <p className="text-white">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;