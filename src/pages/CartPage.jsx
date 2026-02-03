// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout
} from '../utils/auth';
import Loading from '../components/Loading';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCart = async () => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      const token = getCustomerToken();
      const cartRes = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartData = await cartRes.json();

      if (cartData.success) {
        const items = cartData.cart || [];
        setCartItems(items);
        // Auto-select all in-stock items
        const inStockIds = items
          .filter(item => getMaxAvailableQuantity(item.productId._id, item.selectedColor) > 0)
          .map(item => item._id);
        setSelectedItems(new Set(inStockIds));
      } else {
        setError(cartData.message || 'Failed to load cart');
      }
    } catch (err) {
      console.error(err);
      customerLogout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const getMaxAvailableQuantity = (productId, selectedColor) => {
    const item = cartItems.find(item =>
      item.productId._id === productId && item.selectedColor === selectedColor
    );
    
    if (!item || !item.productId) return 0;
    
    const colorEntry = item.productId.colors?.find(color =>
      color.name === selectedColor
    );
    
    if (colorEntry?.quantity == null) return Infinity;
    return colorEntry.quantity;
  };

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;

    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;

    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
    
    if (maxAvailable !== Infinity && qty > maxAvailable) {
      toast.error(`Only ${maxAvailable} units available for this color`);
      return;
    }

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: qty })
      });
      const data = await res.json();

      if (data.success) {
        setCartItems(data.cart);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        toast.success('Quantity updated');
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Remove this item?')) return;

    try {
      const token = getCustomerToken();
      await fetch(`${API_URL}/api/cart/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems(items => items.filter(i => i._id !== id));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear your cart?')) return;

    try {
      const token = getCustomerToken();
      await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems([]);
      setSelectedItems(new Set());
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const toggleSelectItem = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
    if (maxAvailable === 0) {
      toast.error('Cannot select out of stock items');
      return;
    }
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const inStockItems = cartItems.filter(item =>
      getMaxAvailableQuantity(item.productId._id, item.selectedColor) > 0
    );
    if (selectedItems.size === inStockItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(inStockItems.map(item => item._id)));
    }
  };

  const proceedToCheckout = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item');
      return;
    }
    
    // Validate selected items stock
    const selectedCartItems = cartItems.filter(item => selectedItems.has(item._id));
    for (const item of selectedCartItems) {
      const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
      if (maxAvailable !== Infinity && item.quantity > maxAvailable) {
        toast.error(`Insufficient stock for ${item.productId.title}`);
        return;
      }
    }
    
    // Navigate to checkout with selected items
    navigate('/checkout', {
      state: {
        selectedItems: Array.from(selectedItems),
        cartItems: selectedCartItems
      }
    });
  };

  const selectedTotal = cartItems
    .filter(item => selectedItems.has(item._id))
    .reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  const formatPrice = (p) =>
    p == null ? 'Contact' : `LKR ${p.toLocaleString()}`;

  const formatAvailableQuantity = (productId, selectedColor) => {
    const maxQty = getMaxAvailableQuantity(productId, selectedColor);
    if (maxQty === Infinity) return 'In Stock';
    if (maxQty === 0) return 'Out of Stock';
    return `${maxQty} left`;
  };

  if (loading) {
    return <Loading message="Loading your cart..." size="large" />;
  }

  const inStockCount = cartItems.filter(item =>
    getMaxAvailableQuantity(item.productId._id, item.selectedColor) > 0
  ).length;

  return (
    <div className="bg-black text-white min-h-screen pb-32 md:pb-8">
      <ScrollToTop />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <span className="text-sm text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        {cartItems.length === 0 ? (
          <div className="text-center bg-gray-900/60 rounded-2xl p-8 sm:p-10">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Cart is empty</h2>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Add items to your cart to see them here.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gold text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gold/90 transition text-sm sm:text-base"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.size === inStockCount && inStockCount > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold focus:ring-2"
                />
                <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium">
                  Select All ({inStockCount})
                </span>
              </label>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map(item => {
                const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
                const isOutOfStock = maxAvailable === 0;
                const canIncrease = maxAvailable === Infinity || item.quantity < maxAvailable;
                const isSelected = selectedItems.has(item._id);
                
                return (
                  <div
                    key={item._id}
                    className={`bg-gray-900/60 border rounded-xl p-3 sm:p-4 transition-all ${
                      isSelected ? 'border-gold/50' :
                      isOutOfStock ? 'border-red-500/30' : 'border-gray-800'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Checkbox */}
                      <div className="flex items-start pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item._id)}
                          disabled={isOutOfStock}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      {/* Product Image */}
                      <img
                        src={item.productId?.images?.[0]}
                        alt={item.productId?.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base mb-0.5 truncate">
                          {item.productId?.title}
                        </h3>
                        <p className="text-gold text-xs mb-1">{item.productId?.brand}</p>
                        <p className="text-gray-400 text-xs mb-1">
                          Color: {item.selectedColor}
                        </p>
                        
                        {/* Stock Status */}
                        <p className={`text-xs mb-2 ${
                          isOutOfStock ? 'text-red-400 font-medium' : 'text-gray-500'
                        }`}>
                          {formatAvailableQuantity(item.productId._id, item.selectedColor)}
                        </p>
                        
                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center bg-black/30 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg ${
                                item.quantity <= 1
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : 'text-white hover:bg-gray-800'
                              } rounded-l-lg transition`}
                            >
                              −
                            </button>
                            <span className="w-8 sm:w-10 h-7 sm:h-8 flex items-center justify-center font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={!canIncrease || isOutOfStock}
                              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg ${
                                !canIncrease || isOutOfStock
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : 'text-white hover:bg-gray-800'
                              } rounded-r-lg transition`}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm sm:text-base block">
                              {formatPrice(item.productId?.price)}
                            </span>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-400 hover:text-red-300 text-xs font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* Out of Stock Warning */}
                        {isOutOfStock && (
                          <div className="mt-2 p-2 bg-red-900/20 border border-red-800 rounded-lg">
                            <p className="text-red-400 text-xs flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Out of stock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-3 pt-4 border-t border-gray-800/50">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition text-sm"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition text-sm"
              >
                My Orders
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3 safe-area-bottom z-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">
                Total ({selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'})
              </p>
              <p className="text-lg font-bold text-gold">
                {formatPrice(selectedTotal)}
              </p>
            </div>
            <button
              onClick={proceedToCheckout}
              disabled={selectedItems.size === 0}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                selectedItems.size === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gold text-black hover:bg-gold/90'
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Checkout Section */}
      {cartItems.length > 0 && (
        <div className="hidden md:block max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Selected Items: {selectedItems.size}
                </p>
                <p className="text-2xl font-bold text-gold">
                  Total: {formatPrice(selectedTotal)}
                </p>
              </div>
              <button
                onClick={proceedToCheckout}
                disabled={selectedItems.size === 0}
                className={`px-10 py-4 rounded-xl font-bold text-lg transition ${
                  selectedItems.size === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gold text-black hover:bg-gold/90 shadow-lg hover:shadow-gold/20'
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;