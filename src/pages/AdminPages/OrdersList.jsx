// src/pages/AdminPages/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';
import Loading from '../../components/Loading';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [receiptStatusFilter, setReceiptStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [editStatus, setEditStatus] = useState('');
  const [editReceiptStatus, setEditReceiptStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${API_URL}/${imagePath}`;
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to load orders');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const submitOrderUpdates = async () => {
    const updates = {};
    if (editStatus !== selectedOrder.status) updates.status = editStatus;
    if (editReceiptStatus !== selectedOrder.receiptStatus) updates.receiptStatus = editReceiptStatus;
    if (editAdminNotes !== (selectedOrder.adminNotes || '')) updates.adminNotes = editAdminNotes;

    if (Object.keys(updates).length === 0) {
      setSelectedOrder(null);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updates)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === selectedOrder._id ? { ...order, ...updates } : order
          )
        );
        setSelectedOrder(prev => ({ ...prev, ...updates }));
        setSelectedOrder(null);
      } else {
        setError(data.message || 'Failed to update order');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending_payment: 'bg-yellow-900/30 text-yellow-300',
      processing: 'bg-blue-900/30 text-blue-300',
      confirmed: 'bg-green-900/30 text-green-300',
      shipped: 'bg-purple-900/30 text-purple-300',
      delivered: 'bg-emerald-900/30 text-emerald-300',
      cancelled: 'bg-red-900/30 text-red-300'
    };
    return badges[status] || 'bg-gray-800 text-gray-300';
  };

  const getReceiptStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-900/30 text-yellow-300',
      verified: 'bg-green-900/30 text-green-300',
      rejected: 'bg-red-900/30 text-red-300'
    };
    return badges[status] || 'bg-gray-800 text-gray-300';
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesReceipt = receiptStatusFilter === 'all' || order.receiptStatus === receiptStatusFilter;
    
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      order._id.toLowerCase().includes(searchLower) ||
      (order.customer?.fullName || '').toLowerCase().includes(searchLower) ||
      (order.customer?.email || '').toLowerCase().includes(searchLower) ||
      (order.customer?.username || '').toLowerCase().includes(searchLower) ||
      order.totalAmount.toString().includes(searchLower);

    return matchesStatus && matchesReceipt && matchesSearch;
  });

  const totalOrders = orders.length;
  const pendingPayment = orders.filter(o => o.status === 'pending_payment').length;
  const confirmed = orders.filter(o => o.status === 'confirmed').length;
  const shipped = orders.filter(o => o.status === 'shipped').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const cancelled = orders.filter(o => o.status === 'cancelled').length;

  const receiptsPending = orders.filter(o => o.receiptStatus === 'pending').length;
  const receiptsVerified = orders.filter(o => o.receiptStatus === 'verified').length;
  const receiptsRejected = orders.filter(o => o.receiptStatus === 'rejected').length;

  if (loading) {
    return (
      <AdminLayout title="Manage Orders">
        <Loading message='Loading Orders...' />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Orders">
      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-gold/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Total Orders</div>
          <div className="text-2xl font-bold text-white">{totalOrders}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-300">{pendingPayment}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-green-500/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Orders Confirmed</div>
          <div className="text-2xl font-bold text-green-300">{confirmed}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-purple-500/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Shipped</div>
          <div className="text-2xl font-bold text-purple-300">{shipped}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Delivered</div>
          <div className="text-2xl font-bold text-emerald-300">{delivered}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-red-500/50 transition-colors">
          <div className="text-gray-400 text-sm font-medium">Cancelled</div>
          <div className="text-2xl font-bold text-red-300">{cancelled}</div>
        </div>
      </div>

      {/* RECEIPT STATUS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-gray-400 text-sm">Receipts Verification Pending</div>
              <div className="text-lg font-bold text-yellow-300">{receiptsPending}</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="text-gray-400 text-sm">Receipts Verified</div>
              <div className="text-lg font-bold text-green-300">{receiptsVerified}</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <div className="text-gray-400 text-sm">Receipts Rejected</div>
              <div className="text-lg font-bold text-red-300">{receiptsRejected}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">All Orders</h2>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, order #, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-gold w-full sm:w-64"            
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={receiptStatusFilter}
            onChange={(e) => setReceiptStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="all">All Receipts</option>
            <option value="pending">Receipt Pending</option>
            <option value="verified">Receipt Verified</option>
            <option value="rejected">Receipt Rejected</option>
          </select>
          
          <div className="text-gray-400 whitespace-nowrap">
            Showing: {filteredOrders.length} orders
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-500">No orders match your search and filters</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Order</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Customer</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Items</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">#{order._id.substring(order._id.length - 6)}</div>
                      <div className="text-gray-400 text-sm">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{order.customer?.fullName}</div>
                      <div className="text-gray-400 text-sm">@{order.customer?.username}</div>
                      <div className="text-gray-500 text-xs">{order.customer?.email}</div>
                      {order.customer?.mobileNumber && (
                        <div className="text-gray-400 text-xs mt-1">
                          📱 {order.customer.mobileNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">{order.items.length} items</div>
                      <div className="text-gray-400 text-sm">
                        {order.items[0]?.productId?._id ? (
                          <Link 
                            to={`/shop/${order.items[0].productId._id}`}
                            className="hover:text-gold transition-colors"
                          >
                            {order.items[0]?.productId?.title}
                          </Link>
                        ) : (
                          order.items[0]?.productId?.title || 'Product'
                        )}
                        {order.items.length > 1 && ` +${order.items.length - 1}`}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white font-semibold">{formatPrice(order.totalAmount)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getReceiptStatusBadge(order.receiptStatus)}`}>
                          {order.receiptStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setEditStatus(order.status);
                          setEditReceiptStatus(order.receiptStatus);
                          setEditAdminNotes(order.adminNotes || '');
                        }}
                        className="text-gold hover:text-yellow-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 👑 ENHANCED ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 overflow-y-auto max-h-[92vh]">
              {/* Header Banner */}
              <div className="mb-6 p-5 rounded-xl border border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Order #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                    </h2>
                    <p className="text-gray-400 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedOrder.status === 'delivered' ? 'bg-emerald-900/40 text-emerald-300' :
                      selectedOrder.status === 'shipped' ? 'bg-purple-900/40 text-purple-300' :
                      selectedOrder.status === 'confirmed' ? 'bg-green-900/40 text-green-300' :
                      selectedOrder.status === 'cancelled' ? 'bg-red-900/40 text-red-300' :
                      'bg-yellow-900/40 text-yellow-300'
                    }`}>
                      {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedOrder.receiptStatus === 'verified' ? 'bg-green-900/40 text-green-300' :
                      selectedOrder.receiptStatus === 'rejected' ? 'bg-red-900/40 text-red-300' :
                      'bg-yellow-900/40 text-yellow-300'
                    }`}>
                      {selectedOrder.receiptStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Full Name', value: selectedOrder.customer?.fullName },
                        { label: 'Username', value: `@${selectedOrder.customer?.username}` },
                        { label: 'Email', value: selectedOrder.customer?.email },
                        { label: 'Mobile', value: selectedOrder.customer?.mobileNumber },
                        { label: 'Profile Address', value: selectedOrder.customer?.address || 'Not provided' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                          <span className="text-gray-400 min-w-[140px]">{item.label}</span>
                          <span className="text-white max-w-[260px] break-words text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Delivery Address
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Street Address', value: selectedOrder.deliveryAddress?.address || 'Not provided' },
                        { label: 'City', value: selectedOrder.deliveryAddress?.city || 'Not provided' },
                        { label: 'Province/State', value: selectedOrder.deliveryAddress?.province || 'Not provided' },
                        { label: 'Country', value: selectedOrder.deliveryAddress?.country || 'Sri Lanka' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                          <span className="text-gray-400 min-w-[140px]">{item.label}</span>
                          <span className="text-white max-w-[260px] break-words text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-3 italic">
                      Provided during checkout
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-4 p-3 bg-gray-800/40 rounded-lg">
                          {item.productId?.images?.[0] && (
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                src={getImageUrl(item.productId.images[0])}
                                alt={item.productId.title}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/shop/${item.productId?._id}`}
                              className="font-medium text-white hover:text-gold transition-colors block truncate"
                            >
                              {item.productId?.title}
                            </Link>
                            <p className="text-gray-400 text-sm truncate">{item.productId?.brand}</p>
                            <p className="text-gray-400 text-sm font-bold underline">Color: {item.selectedColor}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-300">Qty: {item.quantity}</span>
                              <span className="font-semibold text-white">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-white">Free</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-700 font-bold text-lg">
                        <span>Total</span>
                        <span className="text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Receipt */}
                  {selectedOrder.receipt && (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Payment Receipt
                      </h3>
                      <a
                        href={`${API_URL}/${selectedOrder.receipt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold hover:text-yellow-300 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Receipt
                      </a>
                    </div>
                  )}

                  {/* Order Management */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gold mb-4">Order Management</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Order Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                          disabled={submitting}
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Receipt Status</label>
                        <select
                          value={editReceiptStatus}
                          onChange={(e) => setEditReceiptStatus(e.target.value)}
                          className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                          disabled={submitting}
                        >
                          <option value="pending">Pending Verification</option>
                          <option value="verified">Verified ✓</option>
                          <option value="rejected">Rejected ✗</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Admin Notes</label>
                        <textarea
                          value={editAdminNotes}
                          onChange={(e) => setEditAdminNotes(e.target.value)}
                          rows="3"
                          className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition resize-none"
                          placeholder="Add notes for the customer..."
                          disabled={submitting}
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitOrderUpdates}
                          disabled={submitting}
                          className={`flex-1 py-2.5 rounded-lg font-bold transition shadow-lg ${
                            submitting
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gold hover:bg-gold/90 text-black shadow-gold/20'
                          }`}
                        >
                          {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Submit Changes'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersList;