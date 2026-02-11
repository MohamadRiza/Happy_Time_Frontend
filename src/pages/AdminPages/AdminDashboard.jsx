// src/pages/AdminPages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken, isAuthenticated } from '../../utils/auth';
import Loading from '../../components/Loading';

// ✅ Professional SVG Icons
const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const VacancyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ApplicationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CustomerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// ✅ Inventory Alert Icon
const InventoryAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// ✅ Activity Icons
const ActivityIcons = {
  product: ProductIcon,
  vacancy: VacancyIcon,
  order: OrderIcon,
  application: ApplicationIcon,
  customer: CustomerIcon,
  message: MessageIcon
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    openVacancies: 0,
    newMessages: 0,
    customers: 0,
    pendingOrders: 0,
    jobApplicants: 0,
    outOfStockItems: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // ✅ Fetch inventory alerts
  const fetchInventoryAlerts = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/admin/inventory/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        return {
          outOfStockItems: data.summary.totalOutOfStock,
          lowStockItems: data.summary.totalLowStock
        };
      }
    } catch (err) {
      console.warn('Failed to fetch inventory alerts:', err);
    }
    return { outOfStockItems: 0, lowStockItems: 0 };
  };

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
      
      // Fetch customers count
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

      // Fetch pending orders count
      let pendingOrdersCount = 0;
      try {
        const ordersRes = await fetch(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          pendingOrdersCount = ordersData.orders.filter(order => 
            ['pending_payment', 'processing', 'confirmed'].includes(order.status)
          ).length;
        }
      } catch (ordersError) {
        console.warn('Orders API not available:', ordersError);
      }

      // Fetch job applicants count
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

      // Fetch messages count
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

      // ✅ Fetch inventory alerts
      const inventoryAlerts = await fetchInventoryAlerts();

      const totalProducts = productsData.success ? (productsData.products || []).length : 0;
      const openVacancies = vacanciesData.success 
        ? (vacanciesData.data || []).filter(v => v.status === 'active').length 
        : 0;

      setStats({
        totalProducts,
        openVacancies,
        newMessages,
        customers: customersCount,
        pendingOrders: pendingOrdersCount,
        jobApplicants: jobApplicantsCount,
        outOfStockItems: inventoryAlerts.outOfStockItems,
        lowStockItems: inventoryAlerts.lowStockItems
      });

      // Build recent activity
      const activity = [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Add recent products (last 7 days)
      if (productsData.success && productsData.products) {
        const recentProducts = (productsData.products || [])
          .filter(p => new Date(p.createdAt) > sevenDaysAgo)
          .slice(0, 2)
          .map(product => ({
            type: 'product',
            message: `New product added: ${product.title}`,
            time: product.createdAt,
            icon: ProductIcon
          }));
        activity.push(...recentProducts);
      }

      // Add recent vacancies (last 7 days)
      if (vacanciesData.success && vacanciesData.data) {
        const recentVacancies = (vacanciesData.data || [])
          .filter(v => v.status === 'active' && new Date(v.createdAt) > sevenDaysAgo)
          .slice(0, 2)
          .map(vacancy => ({
            type: 'vacancy',
            message: `New vacancy posted: ${vacancy.title}`,
            time: vacancy.createdAt,
            icon: VacancyIcon
          }));
        activity.push(...recentVacancies);
      }

      // Add recent orders (last 7 days)
      if (pendingOrdersCount > 0) {
        try {
          const recentOrdersRes = await fetch(`${API_URL}/api/admin/orders?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentOrdersData = await recentOrdersRes.json();
          if (recentOrdersData.success) {
            const recentOrders = (recentOrdersData.orders || [])
              .filter(o => new Date(o.createdAt) > sevenDaysAgo)
              .slice(0, 2)
              .map(order => ({
                type: 'order',
                message: `New order placed: #${order._id.substring(order._id.length - 6)}`,
                time: order.createdAt,
                icon: OrderIcon
              }));
            activity.push(...recentOrders);
          }
        } catch (ordersError) {
          console.warn('Recent orders fetch failed:', ordersError);
        }
      }

      // Add recent job applicants (last 7 days)
      if (jobApplicantsCount > 0) {
        try {
          const recentApplicationsRes = await fetch(`${API_URL}/api/admin/applications?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentApplicationsData = await recentApplicationsRes.json();
          if (recentApplicationsData.success) {
            const recentApplications = (recentApplicationsData.data || [])
              .filter(a => new Date(a.createdAt) > sevenDaysAgo)
              .slice(0, 2)
              .map(application => ({
                type: 'application',
                message: `New job application: ${application.fullName}`,
                time: application.createdAt,
                icon: ApplicationIcon
              }));
            activity.push(...recentApplications);
          }
        } catch (applicationsError) {
          console.warn('Recent applications fetch failed:', applicationsError);
        }
      }

      // Add recent customers (last 7 days)
      if (customersCount > 0) {
        try {
          const recentCustomersRes = await fetch(`${API_URL}/api/admin/customers?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const recentCustomersData = await recentCustomersRes.json();
          if (recentCustomersData.success) {
            const recentCustomers = (recentCustomersData.data.customers || [])
              .filter(c => new Date(c.createdAt) > sevenDaysAgo)
              .slice(0, 2)
              .map(customer => ({
                type: 'customer',
                message: `New customer registered: ${customer.fullName}`,
                time: customer.createdAt,
                icon: CustomerIcon
              }));
            activity.push(...recentCustomers);
          }
        } catch (customersError) {
          console.warn('Recent customers fetch failed:', customersError);
        }
      }

      // Add recent messages (last 7 days)
      try {
        const messagesRes = await fetch(`${API_URL}/api/messages?limit=5`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const messagesData = await messagesRes.json();
        if (messagesData.success) {
          const messagesArray = messagesData.messages || messagesData.data || [];
          const recentMessages = messagesArray
            .filter(m => new Date(m.createdAt) > sevenDaysAgo)
            .slice(0, 2)
            .map(message => ({
              type: 'message',
              message: `New message from: ${message.name || 'Customer'}`,
              time: message.createdAt,
              icon: MessageIcon
            }));
          activity.push(...recentMessages);
        }
      } catch (messagesError) {
        console.warn('Recent messages fetch failed:', messagesError);
      }

      // Sort by time (newest first), limit to 5
      const sortedActivity = activity
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

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
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && stats.totalProducts === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loading message="Loading Dashboard..." />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[
          { title: 'Total Products', value: stats.totalProducts, icon: ProductIcon, color: 'text-gold', link: '/admin/products' },
          { title: 'Open Vacancies', value: stats.openVacancies, icon: VacancyIcon, color: 'text-blue-400', link: '/admin/vacancies' },
          { title: 'Pending Orders', value: stats.pendingOrders, icon: OrderIcon, color: 'text-orange-400', link: '/admin/orders' },
          { title: 'Job Applicants', value: stats.jobApplicants, icon: ApplicationIcon, color: 'text-cyan-400', link: '/admin/applications' },
          { title: 'Customers', value: stats.customers, icon: CustomerIcon, color: 'text-purple-400', link: '/admin/customers' },
          { title: 'New Messages', value: stats.newMessages, icon: MessageIcon, color: 'text-emerald-400', link: '/admin/messages' }
        ].map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-gold transition-all duration-300 cursor-pointer group"
          >
            <div className={`mb-3 ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
            <div className="mt-2 w-full h-0.5 bg-gray-800 group-hover:bg-gold transition-colors"></div>
          </Link>
        ))}
        
        {/* ✅ Inventory Alert Cards */}
        {(stats.outOfStockItems > 0 || stats.lowStockItems > 0) && (
          <>
            {stats.outOfStockItems > 0 && (
              <Link
                to="/admin/inventory"
                className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-red-500 transition-all duration-300 cursor-pointer group"
              >
                <div className="mb-3 text-red-400 group-hover:scale-110 transition-transform">
                  <InventoryAlertIcon />
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Out of Stock</h3>
                <p className="text-2xl font-bold text-white">{stats.outOfStockItems.toLocaleString()}</p>
                <div className="mt-2 w-full h-0.5 bg-red-800/50 group-hover:bg-red-500 transition-colors"></div>
              </Link>
            )}
            
            {stats.lowStockItems > 0 && (
              <Link
                to="/admin/inventory"
                className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-orange-500 transition-all duration-300 cursor-pointer group"
              >
                <div className="mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                  <InventoryAlertIcon />
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Low Stock</h3>
                <p className="text-2xl font-bold text-white">{stats.lowStockItems.toLocaleString()}</p>
                <div className="mt-2 w-full h-0.5 bg-orange-800/50 group-hover:bg-orange-500 transition-colors"></div>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <span className="text-xs text-gray-500">Last 7 days</span>
        </div>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => {
              const IconComponent = activity.icon;
              return (
                <Link
                  key={idx}
                  to={
                    activity.type === 'customer' ? `/admin/customers` :
                    activity.type === 'product' ? `/admin/products` :
                    activity.type === 'vacancy' ? `/admin/vacancies` :
                    activity.type === 'order' ? `/admin/orders` :
                    activity.type === 'application' ? `/admin/applications` :
                    '/admin/messages'
                  }
                  className="flex items-start pb-4 border-b border-gray-800/50 last:border-0 last:pb-0 hover:bg-gray-800/30 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg mr-3 bg-gray-800/50">
                    <IconComponent className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white hover:text-gold transition-colors">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(activity.time).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity in the last 7 days
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;