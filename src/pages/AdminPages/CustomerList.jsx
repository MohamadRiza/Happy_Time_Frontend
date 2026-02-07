import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]); // Full list
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const [searchFilters, setSearchFilters] = useState({
    search: '',
    city: '',
    country: 'all',
    businessAccount: 'all'
  });

  const [availableCountries, setAvailableCountries] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Fetch up to 1000 customers to enable full frontend filtering
      const res = await fetch(`${API_URL}/api/admin/customers?limit=1000`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();

      if (data.success) {
        const allCustomers = data.data?.customers || data.customers || [];
        setCustomers(allCustomers);

        // ✅ Extract unique, sorted countries
        const countries = [...new Set(
          allCustomers
            .map(c => c.country)
            .filter(Boolean)
            .sort()
        )];
        setAvailableCountries(countries);

        applyFilters(allCustomers, searchFilters);
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (customerList, filters) => {
    let result = [...customerList];

    // Search by name, email, username
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(c =>
        c.fullName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.username?.toLowerCase().includes(term)
      );
    }

    // City filter
    if (filters.city) {
      const term = filters.city.toLowerCase();
      result = result.filter(c => c.city?.toLowerCase().includes(term));
    }

    // Country filter
    if (filters.country !== 'all') {
      result = result.filter(c => c.country === filters.country);
    }

    // Business Account filter
    if (filters.businessAccount === 'yes') {
      result = result.filter(c => c.businessDetails?.sellsWatches === true);
    } else if (filters.businessAccount === 'no') {
      result = result.filter(c => !c.businessDetails?.sellsWatches);
    }

    setFilteredCustomers(result);
    setCurrentPage(1); // Reset to first page on filter change
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters(customers, searchFilters);
  }, [searchFilters, customers]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    const reset = { search: '', city: '', country: 'all', businessAccount: 'all' };
    setSearchFilters(reset);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const isBusinessAccount = (customer) => {
    return customer.businessDetails?.sellsWatches === true;
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  if (loading) {
    return (
      <AdminLayout title="Customer Management">
        <div className="flex flex-col items-center py-16">
          <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading customers...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Customers</h2>
        <span className="text-gray-400 text-sm">
          Total {filteredCustomers.length} customers
        </span>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <input
            placeholder="Search name, email…"
            value={searchFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
          />
          
          {/* City */}
          <input
            placeholder="City"
            value={searchFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
          />
          
          {/* ✅ Country Dropdown (only available countries) */}
          <select
            value={searchFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gold outline-none appearance-none"
          >
            <option value="all">All Countries</option>
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          
          {/* Business Account */}
          <select
            value={searchFilters.businessAccount}
            onChange={(e) => handleFilterChange('businessAccount', e.target.value)}
            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gold outline-none appearance-none"
          >
            <option value="all">All Accounts</option>
            <option value="yes">Business Account</option>
            <option value="no">Personal Account</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90">
              Search
            </button>
            <button 
              type="button" 
              onClick={handleResetFilters}
              className="flex-1 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-black border-b border-gray-800 z-10">
              <tr className="text-gray-400 uppercase text-xs">
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Account</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : currentCustomers.map(c => (
                <tr key={c._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${c.isActive ? 'bg-gold text-black' : 'bg-red-900/40 text-red-300'}`}>
                        {c.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{c.fullName}</p>
                        <p className="text-gray-400 text-xs">@{c.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{c.mobileNumber || 'N/A'}</p>
                    <p className="text-gray-400 text-xs">{c.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{c.city || 'N/A'}</p>
                    <p className="text-gray-400 text-xs">{c.country}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-xs">Joined</p>
                    <p className="text-white">{formatDate(c.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isBusinessAccount(c)
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      {isBusinessAccount(c) ? 'Business' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Link to={`/admin/customers/${c._id}`} className="text-gold hover:underline">
                        View
                      </Link>
                      <span className={`text-xs ${c.isActive ? 'text-green-400' : 'text-red-400'}`}>
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
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded-lg text-sm
                ${currentPage === i + 1
                  ? 'bg-gold text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default CustomerList;