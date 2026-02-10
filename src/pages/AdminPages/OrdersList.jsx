// src/pages/AdminPages/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [receiptStatusFilter, setReceiptStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW: Search state
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const updateOrderStatus = async (orderId, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
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
            order._id === orderId ? { ...order, ...updates } : order
          )
        );
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, ...updates });
        }
      } else {
        setError(data.message || 'Failed to update order');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
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

  // ✅ Enhanced filtering with search
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesReceipt = receiptStatusFilter === 'all' || order.receiptStatus === receiptStatusFilter;
    
    // ✅ Search across multiple fields
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      order._id.toLowerCase().includes(searchLower) ||
      (order.customer?.fullName || '').toLowerCase().includes(searchLower) ||
      (order.customer?.email || '').toLowerCase().includes(searchLower) ||
      (order.customer?.username || '').toLowerCase().includes(searchLower) ||
      order.totalAmount.toString().includes(searchLower);

    return matchesStatus && matchesReceipt && matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout title="Manage Orders">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Orders">
      {/* ✅ SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">All Orders</h2>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* ✅ Search Input */}
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
            Total: {filteredOrders.length} orders
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
                        onClick={() => setSelectedOrder(order)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Full Name</span>
                    <span className="text-white">{selectedOrder.customer?.fullName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Username</span>
                    <span className="text-white">@{selectedOrder.customer?.username}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white">{selectedOrder.customer?.email}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Mobile</span>
                    <span className="text-white">{selectedOrder.customer?.mobileNumber}</span>
                  </div>
                  {/* ✅ CUSTOMER'S SAVED ADDRESS */}
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Profile Address</span>
                    <span className="text-white">
                      {selectedOrder.customer?.address || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ DELIVERY ADDRESS SECTION */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Delivery Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Street Address</span>
                    <span className="text-white">
                      {selectedOrder.deliveryAddress?.address || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">City</span>
                    <span className="text-white">
                      {selectedOrder.deliveryAddress?.city || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Province/State</span>
                    <span className="text-white">
                      {selectedOrder.deliveryAddress?.province || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Country</span>
                    <span className="text-white">
                      {selectedOrder.deliveryAddress?.country || 'Sri Lanka'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  This is the delivery address provided during checkout
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      {item.productId?.images?.[0] && (
                        <div className="w-16 h-16">
                          <img
                            src={getImageUrl(item.productId.images[0])}
                            alt={item.productId.title}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link 
                          to={`/shop/${item.productId?._id}`}
                          className="font-medium text-white hover:text-gold transition-colors"
                        >
                          {item.productId?.title}
                        </Link>
                        <p className="text-gray-400 text-sm">{item.productId?.brand}</p>
                        <p className="text-gray-400 text-sm">Color: {item.selectedColor}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-semibold">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700 font-bold">
                    <span>Total</span>
                    <span className="text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Receipt */}
              {selectedOrder.receipt && (
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Payment Receipt</h4>
                  <a
                    href={`${API_URL}/${selectedOrder.receipt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-yellow-300"
                  >
                    View Receipt
                  </a>
                </div>
              )}

              {/* Status Management */}
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Order Management</h4>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2 text-sm">Order Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, { status: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 mb-2 text-sm">Receipt Status</label>
                  <select
                    value={selectedOrder.receiptStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, { receiptStatus: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="verified">Verified ✓</option>
                    <option value="rejected">Rejected ✗</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Admin Notes</label>
                  <textarea
                    value={selectedOrder.adminNotes || ''}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, { adminNotes: e.target.value })}
                    rows="3"
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="Add notes for the customer..."
                  />
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