// src/pages/CustomerOrders.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { isCustomerAuthenticated, getCustomerToken, customerLogout } from '../utils/auth';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        setOrders(data.data || []);
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

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full mb-4"></div>
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

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {orders.length === 0 ? (
          <div className="text-center bg-gray-900/60 rounded-2xl p-12 border border-gray-800">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link
              to="/shop"
              className="bg-gold text-black px-8 py-3 rounded-xl font-semibold hover:bg-gold/90 transition"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div 
                key={order._id} 
                className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Order #{order._id.substring(order._id.length - 6)}
                      </h3>
                      <p className="text-gray-400">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      {order.updatedAt !== order.createdAt && (
                        <p className="text-gray-500 text-sm mt-1">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReceiptStatusBadge(order.receiptStatus)}`}>
                        RECEIPT: {order.receiptStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-800">
                  <h4 className="font-semibold text-lg mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {item.productId?.images?.[0] && (
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium text-white">{item.productId?.title}</h5>
                          <p className="text-gold text-sm">{item.productId?.brand}</p>
                          <p className="text-gray-400 text-sm">Color: {item.selectedColor}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-300 text-sm">Qty: {item.quantity}</span>
                            <span className="font-semibold text-white">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Amount */}
                    <div>
                      <h4 className="font-semibold mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-white">Free</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800 font-bold">
                          <span>Total</span>
                          <span className="text-white">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Receipt */}
                    <div className="space-y-4">
                      {order.receipt && (
                        <div>
                          <h4 className="font-semibold mb-2">Payment Receipt</h4>
                          <a
                            href={`${API_URL}/${order.receipt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gold hover:text-yellow-300 text-sm font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Receipt
                          </a>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {order.adminNotes && (
                        <div>
                          <h4 className="font-semibold mb-2">Admin Notes</h4>
                          <p className="text-gray-300 text-sm bg-gray-800/30 p-3 rounded-lg">
                            {order.adminNotes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {order.status === 'pending_payment' && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg text-sm font-medium hover:bg-red-800 transition"
                          >
                            Cancel Order
                          </button>
                        )}
                        <Link
                          to={`/shop`}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition"
                        >
                          Reorder
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;