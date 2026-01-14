// src/pages/AdminPages/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 10,
    total: 0
  });

  const [searchFilters, setSearchFilters] = useState({
    search: '',
    city: '',
    country: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCustomers = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const res = await fetch(`${API_URL}/api/admin/customers?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();

      if (data.success) {
        setCustomers(data.data.customers);
        setPagination(data.data.pagination);
        setSearchFilters(data.data.filters || { search: '', city: '', country: '' });
      } else {
        setError(data.message || 'Failed to load customers');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handlePageChange = (page) => fetchCustomers(page, searchFilters);
  const handleSearch = (e) => { e.preventDefault(); fetchCustomers(1, searchFilters); };
  const handleFilterChange = (f, v) => setSearchFilters(p => ({ ...p, [f]: v }));
  const handleResetFilters = () => {
    const reset = { search: '', city: '', country: '' };
    setSearchFilters(reset);
    fetchCustomers(1, reset);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

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
          Total {pagination.total} customers
        </span>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['search', 'city', 'country'].map((f) => (
            <input
              key={f}
              placeholder={f === 'search' ? 'Search name, email…' : f}
              value={searchFilters[f]}
              onChange={(e) => handleFilterChange(f, e.target.value)}
              className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
            />
          ))}
          <div className="flex gap-2">
            <button className="flex-1 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90">
              Search
            </button>
            <button type="button" onClick={handleResetFilters}
              className="flex-1 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
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
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : customers.map(c => (
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
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-1 rounded-lg text-sm
                ${pagination.page === i + 1
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
