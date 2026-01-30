// src/pages/CustomerOrders.jsx
import React, { useState, useEffect } from 'react'; // React is used for JSX
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { isCustomerAuthenticated, getCustomerToken } from '../utils/auth'; // Removed unused customerLogout

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [statusFilter, setStatusFilter] = useState('all');
  const [receiptFilter, setReceiptFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        // Sort by most recent first
        const sortedOrders = (data.data || []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        setError(data.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        // Refresh orders list
        fetchOrders();
      } else {
        setError(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      setError('Network error. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  // ✅ Filter orders based on status and receipt filters
  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const receiptMatch = receiptFilter === 'all' || 
      (receiptFilter === 'verified' && order.receiptStatus === 'verified') || 
      (receiptFilter === 'not_verified' && order.receiptStatus !== 'verified');
    return statusMatch && receiptMatch;
  });

  // ✅ Check if order should have red border (admin notes + not delivered/cancelled)
  const hasAdminNotesAndActive = (order) => {
    return order.adminNotes && 
           order.status !== 'delivered' && 
           order.status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">My Orders</h1>
          <Link
            to="/shop"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* ✅ FILTER BUTTONS */}
        <div className="mb-6 space-y-4">
          {/* Status Filter Buttons */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Order Status</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Orders' },
                { value: 'pending_payment', label: 'Pending Payment' },
                { value: 'processing', label: 'Processing' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === filter.value
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt Filter Buttons - Updated to Verified/Not Verified */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Receipt Status</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'verified', label: 'Verified' },
                { value: 'not_verified', label: 'Not Verified' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setReceiptFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    receiptFilter === filter.value
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {filteredOrders.length === 0 ? (
          <div className="text-center bg-gray-900/60 rounded-2xl p-12 border border-gray-800">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              No orders match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setReceiptFilter('all');
              }}
              className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition mr-3"
            >
              Clear Filters
            </button>
            <Link
              to="/shop"
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            {/* ✅ VIEW MODE TOGGLE */}
            <div className="flex justify-end mb-6">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded ${viewMode === 'grid' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded ${viewMode === 'list' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  List
                </button>
              </div>
            </div>

            {/* ✅ FIXED MOBILE GRID - 2 COLUMNS ON MOBILE */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 gap-6" // ✅ ALWAYS 2 COLUMNS ON ALL SCREEN SIZES
                : "space-y-6"
            }>
              {filteredOrders.map(order => (
                <div 
                  key={order._id} 
                  className={`bg-gray-900/60 border rounded-xl overflow-hidden transition-all duration-300 ${
                    hasAdminNotesAndActive(order) 
                      ? 'border-red-500/50 shadow-lg shadow-red-500/10' 
                      : 'border-gray-800 hover:border-gold/50'
                  }`}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                          Order #{order._id.substring(order._id.length - 6)}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-1 rounded text-[10px] font-medium ${getStatusBadge(order.status)}`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-medium ${getReceiptStatusBadge(order.receiptStatus)}`}>
                          RECEIPT: {order.receiptStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Admin Notes Indicator */}
                    {hasAdminNotesAndActive(order) && (
                      <div className="mt-2 p-2 bg-red-900/20 border border-red-800 rounded-lg">
                        <p className="text-red-300 text-xs font-medium flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Admin message requires attention
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex gap-3">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="w-12 h-12 flex-shrink-0">
                          {item.productId?.images?.[0] ? (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center text-gray-600 text-xs">
                              ?
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs">
                          +{order.items.length - 2}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-sm">Total:</span>
                      <span className="font-bold text-white">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                      className="w-full py-2 text-gold hover:text-yellow-300 text-sm font-medium flex items-center justify-center gap-1 transition"
                    >
                      {expandedOrderId === order._id ? 'Show Less' : 'View Details'}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 transition-transform ${expandedOrderId === order._id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* ✅ EXPANDED DETAILS */}
                  {expandedOrderId === order._id && (
                    <div className="border-t border-gray-800 p-4 space-y-4">
                      {/* Full Order Items */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              {item.productId?.images?.[0] && (
                                <div className="w-16 h-16 flex-shrink-0">
                                  <img
                                    src={item.productId.images[0]}
                                    alt={item.productId.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-white text-sm truncate">{item.productId?.title}</h5>
                                <p className="text-gold text-xs">{item.productId?.brand}</p>
                                <p className="text-gray-400 text-xs">Color: {item.selectedColor}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-gray-300 text-xs">Qty: {item.quantity}</span>
                                  <span className="font-semibold text-white text-sm">{formatPrice(item.price)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Order Summary</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Subtotal</span>
                              <span className="text-white">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Shipping</span>
                              <span className="text-white">Free</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-gray-800 font-bold">
                              <span>Total</span>
                              <span className="text-white">{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.receipt && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Payment Receipt</h4>
                              <a
                                href={`${API_URL}/${order.receipt}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gold hover:text-yellow-300 text-xs font-medium"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Receipt
                              </a>
                            </div>
                          )}

                          {order.adminNotes && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Admin Notes</h4>
                              <p className="text-gray-300 text-xs bg-gray-800/30 p-2 rounded">
                                {order.adminNotes}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {order.status === 'pending_payment' && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="px-3 py-1.5 bg-red-900/30 text-red-300 rounded text-xs font-medium hover:bg-red-800 transition"
                              >
                                Cancel Order
                              </button>
                            )}
                            <Link
                              to={`/shop`}
                              className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition"
                            >
                              Reorder
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;