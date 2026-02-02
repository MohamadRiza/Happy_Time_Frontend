// src/components/CustomerAccountSec/CustomerDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = ({ orders, customer }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending_payment').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const processingOrders = orders.filter(o => ['processing', 'confirmed', 'shipped'].includes(o.status)).length;

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm sm:text-base lg:text-xl">Dashboard Overview</span>
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-black/30 rounded-xl p-3 sm:p-4 text-center border border-gray-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold">{totalOrders}</div>
          <div className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Total Orders</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 sm:p-4 text-center border border-gray-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400">{pendingOrders}</div>
          <div className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Pending</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 sm:p-4 text-center border border-gray-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400">{processingOrders}</div>
          <div className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Processing</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 sm:p-4 text-center border border-gray-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">{deliveredOrders}</div>
          <div className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Delivered</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-4 sm:mt-5 lg:mt-6">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3">Recent Orders</h3>
        
        {orders.length === 0 ? (
          <div className="text-center py-6 sm:py-8 px-4">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-400 text-sm sm:text-base mb-4">You haven't placed any orders yet</p>
            <Link 
              to="/shop" 
              className="inline-block bg-gold text-black px-5 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-gold/90 transition text-sm sm:text-base active:scale-[0.98]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {orders.slice(0, 3).map(order => (
                <Link 
                  key={order._id} 
                  to="/orders"
                  className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-800 hover:border-gray-700 bg-black/20 hover:bg-gray-800/30 rounded-lg transition active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-medium text-white text-sm sm:text-base truncate">
                      Order #{order._id.substring(order._id.length - 6)}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-gold text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      LKR {order.totalAmount.toLocaleString()}
                    </div>
                    <div className={`text-xs capitalize px-2 py-0.5 rounded-full inline-block mt-1 ${
                      order.status === 'delivered' 
                        ? 'bg-green-500/20 text-green-300' 
                        : order.status === 'pending_payment'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {orders.length > 3 && (
              <Link 
                to="/orders" 
                className="block mt-3 sm:mt-4 text-gold hover:text-yellow-300 text-sm font-medium text-center py-2 hover:underline"
              >
                View All Orders →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;