// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout,
  getCustomer
} from '../utils/auth';
import Loading from '../components/Loading';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    province: '',
    country: ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Bank account info
  const bankInfo = {
    accountNumber: '1234567890',
    accountName: 'Happy Time PVT LTD',
    bankName: 'Commercial Bank',
    branch: 'Colombo 01'
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
      
      // Fetch cart
      const cartRes = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartData = await cartRes.json();

      // Fetch customer info
      const customerRes = await fetch(`${API_URL}/api/customers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customerData = await customerRes.json();

      if (cartData.success) {
        setCartItems(cartData.cart || []);
      } else {
        setError(cartData.message || 'Failed to load cart');
      }

      if (customerData.success) {
        setCustomerInfo(customerData.data);
        // Initialize delivery address with customer's saved address
        setDeliveryAddress({
          address: customerData.data.address || '',
          city: customerData.data.city || '',
          province: customerData.data.province || '',
          country: customerData.data.country || 'Sri Lanka'
        });
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

  // ✅ NEW: Get maximum available quantity for a product/color
  const getMaxAvailableQuantity = (productId, selectedColor) => {
    const item = cartItems.find(item => 
      item.productId._id === productId && item.selectedColor === selectedColor
    );
    
    if (!item || !item.productId) return 0;
    
    // Find the color in product's colors array
    const colorEntry = item.productId.colors?.find(color => 
      color.name === selectedColor
    );
    
    // If quantity is null or undefined, assume unlimited stock
    if (colorEntry?.quantity == null) return Infinity;
    
    // Return available quantity
    return colorEntry.quantity;
  };

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;

    // ✅ VALIDATE QUANTITY AGAINST AVAILABLE STOCK
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
        // ✅ Success toast
        toast.success('Quantity updated successfully!');
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
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // ✅ Success toast
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
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // ✅ Success toast
      toast.success('Cart cleared successfully');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload JPG, PNG, or PDF files only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setReceiptConfirmed(false); // Reset confirmation when new file uploaded
    }
  };

  const validateConfirmation = () => {
    if (!addressConfirmed) {
      toast.error('Please confirm your delivery address is correct');
      return false;
    }
    if (!receiptConfirmed) {
      toast.error('Please confirm your payment receipt is correct');
      return false;
    }
    if (!termsAccepted) {
      toast.error('Please accept our Terms and Conditions');
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // ✅ FINAL STOCK VALIDATION BEFORE ORDERING
    for (const item of cartItems) {
      const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
      if (maxAvailable !== Infinity && item.quantity > maxAvailable) {
        toast.error(`Insufficient stock for ${item.productId.title} - ${item.selectedColor}. Only ${maxAvailable} available.`);
        return;
      }
    }

    if (!receiptFile) {
      toast.error('Please upload a bank transfer receipt');
      return;
    }

    if (!showConfirmation) {
      // Show confirmation modal first
      setShowConfirmation(true);
      return;
    }

    // Validate confirmation checkboxes
    if (!validateConfirmation()) {
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
      
      // ✅ Add delivery address to order
      formData.append('deliveryAddress', JSON.stringify(deliveryAddress));

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
        
        // ✅ Success toast
        toast.success('Order placed successfully!', {
          autoClose: 3000
        });
        
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      toast.error('Network error. Please try again.');
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

  const formatAddress = (addressObj) => {
    if (!addressObj) return 'Address not provided';
    const { address, city, province, country } = addressObj;
    const parts = [];
    if (address) parts.push(address);
    if (city) parts.push(city);
    if (province) parts.push(province);
    if (country) parts.push(country);
    return parts.join(', ') || 'Address not provided';
  };

  // ✅ Handle address field changes
  const handleAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ Save edited address
  const saveAddress = () => {
    // Basic validation
    if (!deliveryAddress.address.trim() || !deliveryAddress.city.trim() || !deliveryAddress.province.trim()) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    setIsEditingAddress(false);
    toast.success('Delivery address updated successfully!');
  };

  // ✅ Cancel address editing
  const cancelAddressEdit = () => {
    // Restore original customer address
    if (customerInfo) {
      setDeliveryAddress({
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        province: customerInfo.province || '',
        country: customerInfo.country || 'Sri Lanka'
      });
    }
    setIsEditingAddress(false);
  };

  // ✅ NEW: Format available quantity display
  const formatAvailableQuantity = (productId, selectedColor) => {
    const maxQty = getMaxAvailableQuantity(productId, selectedColor);
    if (maxQty === Infinity) return 'In Stock';
    if (maxQty === 0) return 'Out of Stock';
    return `${maxQty} in stock`;
  };

  if (loading) {
    return (
      <Loading message="Loading your cart..." size="large" />
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Cart</h1>
          <div className="text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

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
              className="bg-gold text-black px-8 py-3 rounded-xl font-semibold hover:bg-gold/90 transition"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => {
                const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
                const isOutOfStock = maxAvailable === 0;
                const canIncrease = maxAvailable === Infinity || item.quantity < maxAvailable;
                
                return (
                  <div
                    key={item._id}
                    className={`bg-gray-900/60 border ${
                      isOutOfStock ? 'border-red-500/50' : 'border-gray-800'
                    } rounded-2xl p-5 transition-all hover:border-gold/50`}
                  >
                    <div className="flex gap-5">
                      <img
                        src={item.productId?.images?.[0]}
                        alt={item.productId?.title}
                        className="w-28 h-28 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.productId?.title}</h3>
                        <p className="text-gold text-sm mb-1">{item.productId?.brand}</p>
                        <p className="text-gray-400 text-sm mb-2">
                          Color: {item.selectedColor}
                        </p>
                        
                        {/* ✅ SHOW AVAILABLE QUANTITY */}
                        <p className={`text-xs mb-3 ${
                          isOutOfStock ? 'text-red-400 font-medium' : 'text-gray-500'
                        }`}>
                          {formatAvailableQuantity(item.productId._id, item.selectedColor)}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center bg-black/30 rounded-xl p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className={`w-10 h-10 flex items-center justify-center ${
                                item.quantity <= 1 
                                  ? 'text-gray-600 cursor-not-allowed' 
                                  : 'text-white hover:bg-gray-800'
                              } rounded-l-xl transition`}
                            >
                              −
                            </button>
                            <span className="w-12 h-10 flex items-center justify-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              disabled={!canIncrease || isOutOfStock}
                              className={`w-10 h-10 flex items-center justify-center ${
                                !canIncrease || isOutOfStock
                                  ? 'text-gray-600 cursor-not-allowed' 
                                  : 'text-white hover:bg-gray-800'
                              } rounded-r-xl transition`}
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg">
                              {formatPrice(item.productId?.price)}
                            </span>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* ✅ OUT OF STOCK WARNING */}
                        {isOutOfStock && (
                          <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                            <p className="text-red-400 text-sm flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              This item is out of stock. Please remove it to proceed.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-800/50">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition"
                >
                  My Orders
                </button>
              </div>
            </div>

            {/* SUMMARY & PAYMENT */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-6 text-center">Order Summary</h2>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-800 font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="mb-6 p-4 bg-purple-900/20 border border-purple-800 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-purple-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h4>
                  {!showConfirmation && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-purple-400 hover:text-purple-300 text-xs font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {!isEditingAddress ? (
                  <div className="text-sm text-gray-300 mb-3 bg-black/20 p-3 rounded-lg">
                    {formatAddress(deliveryAddress)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={deliveryAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      placeholder="Province/State"
                      value={deliveryAddress.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={deliveryAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={saveAddress}
                        className="flex-1 bg-gold text-black py-2 rounded-lg text-sm font-medium hover:bg-gold/90 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelAddressEdit}
                        className="flex-1 bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {!showConfirmation && !isEditingAddress && (
                  <p className="text-xs text-gray-500">
                    Please ensure your delivery address is correct before placing the order.
                  </p>
                )}
              </div>

              {/* BANK TRANSFER DETAILS */}
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
                <h4 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bank Transfer Instructions
                </h4>
                <p className="text-sm text-gray-300 mb-4">
                  Please transfer <span className="font-bold text-gold">LKR {total.toLocaleString()}</span> to our bank account:
                </p>
                <div className="text-xs bg-black/30 p-3 rounded-lg mb-4">
                  <div className="font-medium mb-1">Account Details:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-gray-400">Account Number:</span></div>
                    <div>{bankInfo.accountNumber}</div>
                    <div><span className="text-gray-400">Account Name:</span></div>
                    <div>{bankInfo.accountName}</div>
                    <div><span className="text-gray-400">Bank:</span></div>
                    <div>{bankInfo.bankName}</div>
                    <div><span className="text-gray-400">Branch:</span></div>
                    <div>{bankInfo.branch}</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2 font-medium">Upload Receipt *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 file:transition"
                  />
                  {receiptPreview && (
                    <div className="mt-3">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="max-h-40 object-contain rounded-lg w-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview('');
                        }}
                        className="text-red-400 text-sm mt-2 hover:text-red-300 transition"
                      >
                        Remove Receipt
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CONFIRMATION CHECKBOXES (Only shown when placing order) */}
              {showConfirmation && (
                <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Confirmation
                  </h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addressConfirmed}
                        onChange={(e) => setAddressConfirmed(e.target.checked)}
                        className="mt-1 mr-3 w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold focus:ring-2"
                      />
                      <span className="text-sm">
                        I confirm that my delivery address is correct and complete.
                      </span>
                    </label>
                    
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={receiptConfirmed}
                        onChange={(e) => setReceiptConfirmed(e.target.checked)}
                        className="mt-1 mr-3 w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold focus:ring-2"
                      />
                      <span className="text-sm">
                        I confirm that the payment receipt shows the correct amount and transaction details.
                      </span>
                    </label>
                    
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-3 w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold focus:ring-2"
                      />
                      <span className="text-sm">
                        I agree to the <a href="/terms" target="_blank" className="text-gold hover:underline font-medium">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-gold hover:underline font-medium">Privacy Policy</a>.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                  isProcessing
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gold text-black hover:bg-gold/90 shadow-lg hover:shadow-gold/20'
                }`}
              >
                {showConfirmation 
                  ? (isProcessing ? 'Confirming Order...' : 'Confirm Order') 
                  : 'Place Order'}
              </button>
              
              <p className="text-gray-500 text-xs mt-4 text-center">
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