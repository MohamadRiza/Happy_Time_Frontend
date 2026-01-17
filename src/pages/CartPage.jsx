// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout,
  getCustomer
} from '../utils/auth';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  // Bank account info
  const bankInfo = {
    accountNumber: '1234567890',
    accountName: 'Happy Time PVT LTD',
    bankName: 'Commercial Bank'
  };
  
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

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload JPG, PNG, or PDF files only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!receiptFile) {
      setError('Please upload a bank transfer receipt');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const token = getCustomerToken();
      const formData = new FormData();
      
      // Prepare items array
      const items = cartItems.map(item => ({
        productId: item.productId._id,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.productId.price
      }));
      
      formData.append('items', JSON.stringify(items));
      formData.append('totalAmount', total.toString());
      formData.append('receipt', receiptFile);

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Order placed successfully! Our team will verify your payment receipt and confirm your order.');
        setCartItems([]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
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
        {success && <p className="text-green-400 mb-4">{success}</p>}

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

            {/* SUMMARY & PAYMENT */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
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

              {/* BANK TRANSFER DETAILS */}
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">Bank Transfer Instructions</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Please transfer LKR {total.toLocaleString()} to our bank account:
                </p>
                <div className="text-xs bg-black/30 p-2 rounded mb-3">
                  <div className="font-medium">Account Details:</div>
                  <div>Account Number: {bankInfo.accountNumber}</div>
                  <div>Account Name: {bankInfo.accountName}</div>
                  <div>Bank: {bankInfo.bankName}</div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Upload Receipt *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                  />
                  {receiptPreview && (
                    <div className="mt-2">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="max-h-32 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview('');
                        }}
                        className="text-red-400 text-xs mt-1"
                      >
                        Remove Receipt
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  isProcessing
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gold text-black hover:bg-gold/90'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              
              <p className="text-gray-500 text-xs mt-3 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;