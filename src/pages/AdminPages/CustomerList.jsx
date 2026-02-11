// src/pages/AdminPages/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const [searchFilters, setSearchFilters] = useState({
    search: '',
    city: '',
    country: 'all',
    businessAccount: 'all',
    accountStatus: 'all' // 'all', 'active', 'deactivated'
  });
  const [availableCountries, setAvailableCountries] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingVerification, setUpdatingVerification] = useState(null);

  // 👇 Customer detail modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [localCopyMessage, setLocalCopyMessage] = useState({ id: null, message: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Format date to 12-hour with AM/PM
  const formatDateTime = (date) => {
    if (!date) return 'Never logged in';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Less than an hour ago';
    if (diffHrs === 1) return '1 hour ago';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffHrs < 48) return 'Yesterday';
    return `${Math.floor(diffHrs / 24)} days ago`;
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/api/admin/customers?limit=1000`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        const allCustomers = data.data?.customers || data.customers || [];
        setCustomers(allCustomers);
        const countries = [...new Set(allCustomers.map(c => c.country).filter(Boolean).sort())];
        setAvailableCountries(countries);
        applyFilters(allCustomers, searchFilters);
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (customerList, filters) => {
    let result = [...customerList];

    // Search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(c =>
        c.fullName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.username?.toLowerCase().includes(term) ||
        c.mobileNumber?.includes(term)
      );
    }

    // City
    if (filters.city) {
      const term = filters.city.toLowerCase();
      result = result.filter(c => c.city?.toLowerCase().includes(term));
    }

    // Country
    if (filters.country !== 'all') {
      result = result.filter(c => c.country === filters.country);
    }

    // Business Account
    if (filters.businessAccount === 'yes') {
      result = result.filter(c => c.businessDetails?.sellsWatches === true);
    } else if (filters.businessAccount === 'no') {
      result = result.filter(c => !c.businessDetails?.sellsWatches);
    }

    // Account Status
    if (filters.accountStatus === 'active') {
      result = result.filter(c => c.isActive === true);
    } else if (filters.accountStatus === 'deactivated') {
      result = result.filter(c => c.isActive === false);
    }

    setFilteredCustomers(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters(customers, searchFilters);
  }, [searchFilters, customers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSearch = (e) => e.preventDefault();
  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };
  const handleResetFilters = () => {
    setSearchFilters({
      search: '',
      city: '',
      country: 'all',
      businessAccount: 'all',
      accountStatus: 'all'
    });
  };

  const toggleEmailVerified = async (customerId, currentStatus) => {
    setUpdatingVerification(customerId);
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${customerId}/email-verified`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev =>
          prev.map(c => c._id === customerId ? { ...c, isVerified: !currentStatus } : c)
        );
        setSuccessMessage(`Email ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      } else {
        setError(data.message || 'Failed to update email status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUpdatingVerification(null);
    }
  };

  const openCustomerDetail = async (customerId) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCustomer(data.data);
      } else {
        setDetailError(data.message || 'Customer not found');
      }
    } catch (err) {
      setDetailError('Network error');
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeCustomerDetail = () => {
    setSelectedCustomer(null);
    setDetailError('');
    setLocalCopyMessage({ id: null, message: '' });
  };

  const handleStatusToggle = async () => {
    if (!selectedCustomer) return;
    if (!window.confirm(`Are you sure you want to ${selectedCustomer.isActive ? 'deactivate' : 'activate'} this account?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${selectedCustomer._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isActive: !selectedCustomer.isActive })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCustomer(prev => ({ ...prev, isActive: !prev.isActive }));
        setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, isActive: !c.isActive } : c));
      } else {
        setDetailError(data.message || 'Failed to update account status');
      }
    } catch (err) {
      setDetailError('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedCustomer.fullName}'s account? This action cannot be undone.`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/customers/${selectedCustomer._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev => prev.filter(c => c._id !== selectedCustomer._id));
        closeCustomerDetail();
        setSuccessMessage('Customer deleted successfully');
      } else {
        setDetailError(data.message || 'Failed to delete customer');
      }
    } catch (err) {
      setDetailError('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopy = (text, label, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setLocalCopyMessage({ id, message: `${label} copied!` });
      setTimeout(() => setLocalCopyMessage({ id: null, message: '' }), 2000);
    });
  };

  const getBusinessTypeDisplay = (type) => {
    const types = {
      retail: 'Retail Store',
      wholesale: 'Wholesale Dealer',
      independent_watchmaker: 'Independent Watchmaker',
      collector: 'Watch Collector',
      other: 'Other'
    };
    return types[type] || type;
  };

  const isBusinessAccount = (customer) => customer.businessDetails?.sellsWatches === true;

  // Calculate stats
  const totalDeactivated = customers.filter(c => !c.isActive).length;
  const stats = {
    total: filteredCustomers.length,
    business: filteredCustomers.filter(c => isBusinessAccount(c)).length,
    verified: filteredCustomers.filter(c => c.isVerified).length,
    active: filteredCustomers.filter(c => c.isActive).length,
    deactivated: totalDeactivated
  };

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  if (loading) {
    return (
      <AdminLayout title="Customer Management">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="animate-spin h-16 w-16 rounded-full border-4 border-gray-800 border-t-gold"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gold/20"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-400 font-medium">Loading customers...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer Management">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-900/90 border border-green-700 text-green-100 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Customer Management</h2>
          <p className="text-gray-400">Manage and monitor all customer accounts</p>
        </div>
        {/* ❌ No "Create Customer" button */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gold/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Business Accounts</p>
              <p className="text-3xl font-bold text-white">{stats.business}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Verified Emails</p>
              <p className="text-3xl font-bold text-white">{stats.verified}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Accounts</p>
              <p className="text-3xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Deactivated Accounts</p>
              <p className="text-3xl font-bold text-white">{stats.deactivated}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-white font-semibold">Filter Customers</h3>
        </div>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search by name, email..."
              value={searchFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              placeholder="Filter by city..."
              value={searchFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            />
          </div>
          <select
            value={searchFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Countries</option>
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select
            value={searchFilters.businessAccount}
            onChange={(e) => handleFilterChange('businessAccount', e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Account Types</option>
            <option value="yes">Business Accounts</option>
            <option value="no">Personal Accounts</option>
          </select>
          {/* 👇 NEW: Account Status Filter */}
          <select
            value={searchFilters.accountStatus}
            onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition-all hover:shadow-lg hover:shadow-gold/20 py-2.5"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all py-2.5"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/60 border-b border-gray-800 backdrop-blur-sm">
              <tr className="text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="px-6 py-4 text-left font-semibold">Contact</th>
                <th className="px-6 py-4 text-left font-semibold">Location</th>
                <th className="px-6 py-4 text-left font-semibold">Last Login</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-center font-semibold">Verified</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-800/50 p-6 rounded-full">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium mb-1">No customers found</p>
                        <p className="text-gray-600 text-sm">Try adjusting your filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : currentCustomers.map((c, idx) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-800/40 transition-colors group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-transform group-hover:scale-110
                        ${c.isActive ? 'bg-gradient-to-br from-gold to-amber-600 text-black' : 'bg-gradient-to-br from-red-900 to-red-800 text-red-200'}`}>
                        {c.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        {c.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{c.fullName}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1">@{c.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {c.mobileNumber || 'N/A'}
                      </p>
                      {c.email && (
                        <p className="text-gray-400 text-xs flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {c.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white font-medium">{c.city || 'N/A'}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1">{c.country}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white font-medium">{formatDateTime(c.lastLogin)}</p>
                      <p className="text-gray-400 text-xs">{getTimeAgo(c.lastLogin)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      isBusinessAccount(c)
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-gray-800/80 text-gray-300 border border-gray-700'
                    }`}>
                      {isBusinessAccount(c) ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Business
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleEmailVerified(c._id, c.isVerified)}
                        disabled={updatingVerification === c._id}
                        className={`relative group/btn w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          c.isVerified
                            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                        } ${updatingVerification === c._id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        title={c.isVerified ? 'Email verified - Click to unverify' : 'Email not verified - Click to verify'}
                      >
                        {updatingVerification === c._id ? (
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : c.isVerified ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        {!updatingVerification && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {c.isVerified ? 'Unverify' : 'Verify'}
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openCustomerDetail(c._id)}
                        className="inline-flex items-center gap-1.5 text-gold hover:text-gold/80 font-medium transition-colors group/link"
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        c.isActive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-gray-400 text-sm">
            Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => {
              if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-gold text-black shadow-lg shadow-gold/20'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (i === currentPage - 3 || i === currentPage + 1) {
                return <span key={i} className="px-2 text-gray-600">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 👇 CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={closeCustomerDetail}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {detailLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
                <p className="mt-4 text-gray-400">Loading customer profile...</p>
              </div>
            ) : detailError ? (
              <div className="p-8 text-center text-red-400">{detailError}</div>
            ) : selectedCustomer && (
              <div className="p-6 overflow-y-auto max-h-[92vh]">
                {/* Header Banner */}
                <div className={`mb-6 p-5 rounded-xl border ${
                  selectedCustomer.isActive 
                    ? 'bg-gradient-to-r from-gold/10 to-amber-900/20 border-gold/30' 
                    : 'bg-gradient-to-r from-red-900/20 to-gray-900 border-red-700/30'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                      selectedCustomer.isActive ? 'bg-gold text-black' : 'bg-red-900/50 text-red-200'
                    }`}>
                      {selectedCustomer.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedCustomer.fullName}</h2>
                      <p className="text-gray-300 mt-1">@{selectedCustomer.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedCustomer.isActive 
                            ? 'bg-green-900/40 text-green-300' 
                            : 'bg-red-900/40 text-red-300'
                        }`}>
                          {selectedCustomer.isActive ? 'Active Account' : 'Inactive Account'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedCustomer.isVerified 
                            ? 'bg-blue-900/40 text-blue-300' 
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {selectedCustomer.isVerified ? 'Email Verified' : 'Email Not Verified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Info Sections */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Full Name', value: selectedCustomer.fullName },
                          { label: 'Username', value: selectedCustomer.username },
                          { label: 'Date of Birth', value: new Date(selectedCustomer.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                          { label: 'Email', value: selectedCustomer.email || 'Not provided', copyable: true, field: 'email' },
                          { label: 'Mobile', value: selectedCustomer.mobileNumber, copyable: true, field: 'mobile' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                            <span className="text-gray-400 min-w-[120px]">{item.label}</span>
                            {item.copyable ? (
                              <div className="relative">
                                <button
                                  onClick={() => handleCopy(item.value, item.label, item.field)}
                                  className="text-white hover:text-gold text-right underline decoration-dotted underline-offset-2 max-w-[280px] break-words text-sm"
                                  disabled={!item.value}
                                >
                                  {item.value}
                                </button>
                                {localCopyMessage.id === item.field && (
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {localCopyMessage.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-white max-w-[280px] break-words text-sm">{item.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Country', value: selectedCustomer.country },
                          { label: 'Province', value: selectedCustomer.province },
                          { label: 'City', value: selectedCustomer.city || 'N/A' },
                          { label: 'Address', value: selectedCustomer.address || 'Not provided' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                            <span className="text-gray-400 min-w-[120px]">{item.label}</span>
                            <span className="text-white max-w-[280px] break-words text-sm">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Info (if exists) */}
                    {selectedCustomer.businessDetails?.sellsWatches && (
                      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Business Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between pb-2 border-b border-gray-700/50">
                            <span className="text-gray-400">Sells Watches</span>
                            <span className="text-white">Yes</span>
                          </div>
                          <div className="flex justify-between pb-2 border-b border-gray-700/50">
                            <span className="text-gray-400">Has Watch Shop</span>
                            <span className="text-white">{selectedCustomer.businessDetails.hasWatchShop ? 'Yes' : 'No'}</span>
                          </div>
                          {selectedCustomer.businessDetails.hasWatchShop && (
                            <>
                              <div className="flex justify-between pb-2 border-b border-gray-700/50">
                                <span className="text-gray-400">Shop Name</span>
                                <span className="text-white max-w-[280px] break-words">{selectedCustomer.businessDetails.shopName || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between pb-2 border-b border-gray-700/50">
                                <span className="text-gray-400">Shop Address</span>
                                <span className="text-white max-w-[280px] break-words">{selectedCustomer.businessDetails.shopAddress || 'N/A'}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Business Type</span>
                            <span className="text-white">{getBusinessTypeDisplay(selectedCustomer.businessDetails.businessType)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Account Status */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Account Status
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Account Active', value: selectedCustomer.isActive ? 'Yes' : 'No', color: selectedCustomer.isActive ? 'text-green-400' : 'text-red-400' },
                          { label: 'Email Verified', value: selectedCustomer.isVerified ? 'Yes' : 'No', color: selectedCustomer.isVerified ? 'text-green-400' : 'text-red-400' },
                          { label: 'Member Since', value: new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                          { 
                            label: 'Last Login', 
                            value: (
                              <div>
                                <div>{formatDateTime(selectedCustomer.lastLogin)}</div>
                                <div className="text-gray-400 text-xs">{getTimeAgo(selectedCustomer.lastLogin)}</div>
                              </div>
                            )
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                            <span className="text-gray-400">{item.label}</span>
                            <span className={`font-medium ${item.color || 'text-white'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Cart & Actions */}
                  <div className="space-y-6">
                    {/* Cart Summary */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Cart Summary
                      </h3>
                      {selectedCustomer.cart && selectedCustomer.cart.length > 0 ? (
                        <div className="space-y-4">
                          <div className="text-white">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Items:</span>
                              <span>{selectedCustomer.cart.length}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-400">Total Quantity:</span>
                              <span>{selectedCustomer.cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-gray-400 text-sm mb-2">Recent Items:</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {selectedCustomer.cart.slice(0, 5).map((item, index) => (
                                <div key={index} className="text-xs text-gray-300 p-2 bg-gray-800/40 rounded">
                                  <div className="font-medium truncate">{item.productId?.title || 'Unknown Product'}</div>
                                  <div className="text-gray-400">Qty: {item.quantity} • {item.selectedColor || 'N/A'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No items in cart</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4">Account Actions</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={handleStatusToggle}
                          disabled={actionLoading}
                          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                            selectedCustomer.isActive
                              ? 'bg-red-900/40 text-red-300 hover:bg-red-800/60'
                              : 'bg-green-900/40 text-green-300 hover:bg-green-800/60'
                          } disabled:opacity-50`}
                        >
                          {actionLoading ? 'Processing...' : 
                           selectedCustomer.isActive ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                        
                        <button 
                          onClick={handleDeleteCustomer}
                          disabled={actionLoading}
                          className="w-full bg-red-900/40 text-red-300 hover:bg-red-800/60 disabled:opacity-50 py-2.5 px-4 rounded-lg text-sm font-medium transition"
                        >
                          {actionLoading ? 'Processing...' : 'Delete Account'}
                        </button>
                        
                        <button 
                          onClick={() => window.location.href = `mailto:${selectedCustomer.email}`}
                          disabled={!selectedCustomer.email}
                          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition disabled:bg-gray-800 disabled:opacity-50"
                        >
                          Send Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 1000px; } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </AdminLayout>
  );
};

export default CustomerList;