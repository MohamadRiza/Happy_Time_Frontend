// src/pages/AdminPages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken, isAuthenticated } from '../../utils/auth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    openVacancies: 0,
    newMessages: 0,
    customers: 0,
    pendingOrders: 0,      // ✅ NEW: Pending orders
    jobApplicants: 0       // ✅ NEW: Job applicants
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ AUTHENTICATION CHECK
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
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
      
      if (!productsData.success && productsData.message === 'Token is not valid') {
        navigate('/admin/login');
        return;
      }
      
      // Fetch vacancies count
      const vacanciesRes = await fetch(`${API_URL}/api/vacancies`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const vacanciesData = await vacanciesRes.json();
      
      // ✅ FETCH CUSTOMERS COUNT
      let customersCount = 0;
      try {
        const customersRes = await fetch(`${API_URL}/api/admin/customers?limit=1`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const customersData = await customersRes.json();
        
        if (customersData.success) {
          customersCount = customersData.data.pagination?.total || 0;
        }
      } catch (customersError) {
        console.warn('Customers API not available:', customersError);
      }

      // ✅ FETCH PENDING ORDERS COUNT
      let pendingOrdersCount = 0;
      try {
        const ordersRes = await fetch(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const ordersData = await ordersRes.json();
        
        if (ordersData.success) {
          pendingOrdersCount = ordersData.orders.filter(order => 
            order.status === 'pending_payment' || 
            order.status === 'processing' ||
            order.status === 'confirmed'
          ).length;
        }
      } catch (ordersError) {
        console.warn('Orders API not available:', ordersError);
      }

      // ✅ FETCH JOB APPLICANTS COUNT
      let jobApplicantsCount = 0;
      try {
        const applicationsRes = await fetch(`${API_URL}/api/admin/applications`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const applicationsData = await applicationsRes.json();
        
        if (applicationsData.success) {
          jobApplicantsCount = applicationsData.data.length || 0;
        }
      } catch (applicationsError) {
        console.warn('Applications API not available:', applicationsError);
      }

      // ✅ SAFE MESSAGES FETCH
      let newMessages = 0;
      try {
        const messagesRes = await fetch(`${API_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const messagesData = await messagesRes.json();
        
        if (messagesData.success) {
          const messagesArray = messagesData.messages || messagesData.data || [];
          newMessages = messagesArray.filter(m => m.status === 'unread').length;
        }
      } catch (messagesError) {
        console.warn('Messages API not available:', messagesError);
      }

      // Calculate stats
      const totalProducts = productsData.success ? (productsData.products || []).length : 0;
      const openVacancies = vacanciesData.success 
        ? (vacanciesData.data || []).filter(v => v.status === 'active').length 
        : 0;

      setStats({
        totalProducts,
        openVacancies,
        newMessages,
        customers: customersCount,
        pendingOrders: pendingOrdersCount,    // ✅ NEW STAT
        jobApplicants: jobApplicantsCount    // ✅ NEW STAT
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

      // ✅ Add recent orders
      if (pendingOrdersCount > 0) {
        try {
          const recentOrdersRes = await fetch(`${API_URL}/api/admin/orders?page=1&limit=2`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentOrdersData = await recentOrdersRes.json();
          
          if (recentOrdersData.success) {
            const recentOrders = (recentOrdersData.orders || [])
              .slice(0, 2)
              .map(order => ({
                type: 'order',
                message: `New order placed: #${order._id.substring(order._id.length - 6)}`,
                time: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown',
                icon: '📦',
                color: 'text-orange-400'
              }));
            activity.push(...recentOrders);
          }
        } catch (ordersError) {
          console.warn('Recent orders fetch failed:', ordersError);
        }
      }

      // ✅ Add recent job applicants
      if (jobApplicantsCount > 0) {
        try {
          const recentApplicationsRes = await fetch(`${API_URL}/api/admin/applications?page=1&limit=2`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentApplicationsData = await recentApplicationsRes.json();
          
          if (recentApplicationsData.success) {
            const recentApplications = (recentApplicationsData.data || [])
              .slice(0, 2)
              .map(application => ({
                type: 'application',
                message: `New job application: ${application.fullName}`,
                time: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown',
                icon: '📋',
                color: 'text-cyan-400'
              }));
            activity.push(...recentApplications);
          }
        } catch (applicationsError) {
          console.warn('Recent applications fetch failed:', applicationsError);
        }
      }

      // Add recent customers
      if (customersCount > 0) {
        try {
          const recentCustomersRes = await fetch(`${API_URL}/api/admin/customers?page=1&limit=2`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentCustomersData = await recentCustomersRes.json();
          
          if (recentCustomersData.success) {
            const recentCustomers = (recentCustomersData.data.customers || [])
              .slice(0, 2)
              .map(customer => ({
                type: 'customer',
                message: `New customer registered: ${customer.fullName}`,
                time: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown',
                icon: '👤',
                color: 'text-purple-400'
              }));
            activity.push(...recentCustomers);
          }
        } catch (customersError) {
          console.warn('Recent customers fetch failed:', customersError);
        }
      }

      // Add recent messages (if available)
      try {
        const messagesRes = await fetch(`${API_URL}/api/messages?limit=2`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const messagesData = await messagesRes.json();
        
        if (messagesData.success) {
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
      } catch (messagesError) {
        console.warn('Recent messages fetch failed:', messagesError);
      }

      // Sort by time (newest first) and limit to 8 items
      const sortedActivity = activity
        .sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return isNaN(dateB) ? -1 : isNaN(dateA) ? 1 : dateB - dateA;
        })
        .slice(0, 8);

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

  // ✅ Loading state
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
      {/* Stats Grid - Now 3 rows for better organization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[
          { 
            title: 'Total Products', 
            value: stats.totalProducts, 
            icon: '⌚', 
            color: 'text-gold',
            link: '/admin/products'
          },
          { 
            title: 'Open Vacancies', 
            value: stats.openVacancies, 
            icon: '👥', 
            color: 'text-blue-400',
            link: '/admin/vacancies'
          },
          { 
            title: 'Pending Orders',     // ✅ NEW CARD
            value: stats.pendingOrders, 
            icon: '📦', 
            color: 'text-orange-400',
            link: '/admin/orders'
          },
          { 
            title: 'Job Applicants',     // ✅ NEW CARD
            value: stats.jobApplicants, 
            icon: '📋', 
            color: 'text-cyan-400',
            link: '/admin/applicants'
          },
          { 
            title: 'Customers', 
            value: stats.customers, 
            icon: '👤', 
            color: 'text-purple-400',
            link: '/admin/customers'
          },
          { 
            title: 'New Messages', 
            value: stats.newMessages, 
            icon: '✉️', 
            color: 'text-emerald-400',
            link: '/admin/messages'
          }
        ].map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-gold transition-all duration-300 cursor-pointer group"
          >
            <div className={`text-3xl mb-3 ${card.color} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
            <div className="mt-2 w-full h-0.5 bg-gray-800 group-hover:bg-gold transition-colors"></div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <span className="text-xs text-gray-500">Latest updates</span>
        </div>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <Link
                key={idx}
                to={
                  activity.type === 'customer' ? `/admin/customers` :
                  activity.type === 'product' ? `/admin/products` :
                  activity.type === 'vacancy' ? `/admin/vacancies` :
                  activity.type === 'order' ? `/admin/orders` :           // ✅ NEW LINK
                  activity.type === 'application' ? `/admin/applications` :  // ✅ NEW LINK
                  '/admin/messages'
                }
                className="flex items-start pb-4 border-b border-gray-800/50 last:border-0 last:pb-0 hover:bg-gray-800/30 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-lg mr-3 ${activity.color.replace('text-', 'bg-').replace('-400', '-900/30').replace('-gold', '-gold/10')}`}>
                  <span className={activity.color}>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white hover:text-gold transition-colors">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
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