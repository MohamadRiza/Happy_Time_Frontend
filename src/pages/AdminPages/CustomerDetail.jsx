// src/pages/AdminPages/CustomerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCustomer(data.data);
      } else {
        setError(data.message || 'Customer not found');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleStatusToggle = async () => {
    if (!customer) return;
    
    if (!window.confirm(`Are you sure you want to ${customer.isActive ? 'deactivate' : 'activate'} this account?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isActive: !customer.isActive })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCustomer(prev => ({ ...prev, isActive: !prev.isActive }));
      } else {
        setError(data.message || 'Failed to update account status');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customer) return;
    
    if (!window.confirm(`Are you sure you want to delete ${customer.fullName}'s account? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        navigate('/admin/customers');
      } else {
        setError(data.message || 'Failed to delete customer');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage(`${label} copied!`);
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGenderDisplay = (gender) => {
    switch(gender) {
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'boy': return 'Boy';
      case 'girl': return 'Girl';
      default: return 'Unisex';
    }
  };

  const getBusinessTypeDisplay = (type) => {
    const types = {
      'retail': 'Retail Store',
      'wholesale': 'Wholesale Dealer',
      'independent_watchmaker': 'Independent Watchmaker',
      'collector': 'Watch Collector',
      'other': 'Other'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <AdminLayout title="Customer Details">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading customer details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Customer Details">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="text-red-400">{error}</div>
          <button
            onClick={() => navigate('/admin/customers')}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Customers
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <AdminLayout title="Customer Details">
      <div className="mb-6">
        <Link
          to="/admin/customers"
          className="flex items-center text-gold hover:text-yellow-300 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Customers
        </Link>
      </div>

      {/* Copy feedback tooltip */}
      {copyMessage && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeInOut">
          {copyMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Profile */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                customer.isActive ? 'bg-gold text-black' : 'bg-red-900/30 text-red-300'
              }`}>
                {customer.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{customer.fullName}</h2>
                <p className="text-gray-400">@{customer.username}</p>
                <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  customer.isActive 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-red-900/30 text-red-300'
                }`}>
                  {customer.isActive ? 'Active Account' : 'Inactive Account'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Full Name</span>
                    <span className="text-white">{customer.fullName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Username</span>
                    <span className="text-white">{customer.username}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Date of Birth</span>
                    <span className="text-white">{formatDate(customer.dob)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Email</span>
                    <button
                      onClick={() => handleCopy(customer.email || '', 'Email')}
                      className="text-white hover:text-gold underline decoration-dotted"
                      disabled={!customer.email}
                    >
                      {customer.email || 'Not provided'}
                    </button>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Mobile</span>
                    <button
                      onClick={() => handleCopy(customer.mobileNumber, 'Mobile')}
                      className="text-white hover:text-gold underline decoration-dotted"
                    >
                      {customer.mobileNumber}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Country</span>
                    <span className="text-white">{customer.country}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Province</span>
                    <span className="text-white">{customer.province}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">City</span>
                    <span className="text-white">{customer.city || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Address</span>
                    <span className="text-white">{customer.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          {customer.businessDetails?.sellsWatches && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Sells Watches</span>
                  <span className="text-white">Yes</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Has Watch Shop</span>
                  <span className="text-white">{customer.businessDetails.hasWatchShop ? 'Yes' : 'No'}</span>
                </div>
                {customer.businessDetails.hasWatchShop && (
                  <>
                    <div className="flex justify-between pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Shop Name</span>
                      <span className="text-white">{customer.businessDetails.shopName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-800">
                      <span className="text-gray-400">Shop Address</span>
                      <span className="text-white">{customer.businessDetails.shopAddress || 'N/A'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400">Business Type</span>
                  <span className="text-white">{getBusinessTypeDisplay(customer.businessDetails.businessType)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Account Active</span>
                <span className={`text-${customer.isActive ? 'green' : 'red'}-400`}>
                  {customer.isActive ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Email Verified</span>
                <span className={`text-${customer.isVerified ? 'green' : 'red'}-400`}>
                  {customer.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{formatDate(customer.createdAt)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">{formatDate(customer.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart & Actions */}
        <div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Cart Summary</h3>
            {customer.cart && customer.cart.length > 0 ? (
              <div className="space-y-3">
                <div className="text-white">Items in Cart: {customer.cart.length}</div>
                <div className="text-white">
                  Total Quantity: {customer.cart.reduce((total, item) => total + item.quantity, 0)}
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-400 text-sm mb-2">Recent Items:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {customer.cart.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-xs text-gray-300 p-2 bg-gray-800/50 rounded">
                        <div>{item.productId?.title || 'Product'}</div>
                        <div>Qty: {item.quantity} | {item.selectedColor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">No items in cart</div>
            )}
          </div>

          {/* Account Actions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleStatusToggle}
                disabled={actionLoading}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                  customer.isActive
                    ? 'bg-red-900/30 text-red-300 hover:bg-red-800 disabled:bg-red-900/50'
                    : 'bg-green-900/30 text-green-300 hover:bg-green-800 disabled:bg-green-900/50'
                }`}
              >
                {actionLoading ? 'Processing...' : 
                 customer.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
              
              <button 
                onClick={handleDeleteCustomer}
                disabled={actionLoading}
                className="w-full bg-red-900/30 text-red-300 hover:bg-red-800 disabled:bg-red-900/50 py-2 px-4 rounded-lg text-sm font-medium transition"
              >
                {actionLoading ? 'Processing...' : 'Delete Account'}
              </button>
              
              <button 
                onClick={() => window.location.href = `mailto:${customer.email}`}
                disabled={!customer.email}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:bg-gray-800 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;