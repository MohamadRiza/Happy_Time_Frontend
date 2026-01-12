// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout
} from '../utils/auth';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCart = async () => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setCartItems(data.cart || []);
      } else {
        setError(data.message || 'Failed to load cart');
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

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;

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
      }
    } catch {
      setError('Failed to update quantity');
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
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {
      setError('Failed to remove item');
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
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {
      setError('Failed to clear cart');
    }
  };

  const total = cartItems.reduce(
    (sum, i) => sum + (i.productId?.price || 0) * i.quantity,
    0
  );

  const formatPrice = (p) =>
    p == null ? 'Contact for Price' : `LKR ${p.toLocaleString()}`;

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {cartItems.length === 0 ? (
          <div className="text-center bg-gray-900/60 rounded-2xl p-10">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold mb-2">Cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Add items to your cart to see them here.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gold text-black px-8 py-3 rounded-xl font-semibold"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={item._id}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.productId?.images?.[0]}
                      alt={item.productId?.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">{item.productId?.title}</h3>
                      <p className="text-gold text-sm">{item.productId?.brand}</p>
                      <p className="text-gray-400 text-sm">
                        {item.selectedColor}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-9 h-9 bg-gray-800 rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="w-12 h-9 flex items-center justify-center border-y border-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-9 h-9 bg-gray-800 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-semibold">
                          {formatPrice(item.productId?.price)}
                        </span>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="ml-auto text-red-400 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-gray-800 rounded-lg"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 bg-gray-800 rounded-lg"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-800 pt-3 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => alert('Checkout coming soon')}
                className="mt-6 w-full bg-gold text-black py-3 rounded-xl font-bold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
