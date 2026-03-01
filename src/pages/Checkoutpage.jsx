// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout
} from '../utils/auth';
import Loading from '../components/Loading';
import { Helmet } from 'react-helmet';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Payment state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  // ✅ Country list as per requirement
  const allowedCountries = [
    'Sri Lanka',
    'United Arab Emirates',
    'Bahrain',
    'Egypt',
    'Iran',
    'Iraq',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Oman',
    'Palestine',
    'Qatar',
    'Saudi Arabia',
    'Syria',
    'Turkey',
    'Yemen',
    'India',
    'Maldives',
    'Bangladesh',
    'Pakistan',
    'Nepal',
    'Bhutan',
    'Myanmar',
    'Afghanistan',
    'Kazakhstan',
    'Turkmenistan',
    'Uzbekistan',
    'Azerbaijan',
    'Georgia',
    'Armenia'
  ];

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    province: '',
    country: 'Sri Lanka' // Default to Sri Lanka
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Confirmation state
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

  // ✅ Refs for scroll targets
  const receiptInputRef = useRef(null);
  const addressCheckboxRef = useRef(null);
  const receiptCheckboxRef = useRef(null);
  const termsCheckboxRef = useRef(null);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    const { selectedItems, cartItems: items } = location.state || {};
    if (!selectedItems || !items || items.length === 0) {
      toast.error('No items selected for checkout');
      navigate('/cart');
      return;
    }
    
    setCartItems(items);
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const token = getCustomerToken();
      const customerRes = await fetch(`${API_URL}/api/customers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customerData = await customerRes.json();
      if (customerData.success) {
        setCustomerInfo(customerData.data);
        // Ensure country is in allowed list
        const savedCountry = customerData.data.country;
        const countryToUse = allowedCountries.includes(savedCountry) ? savedCountry : 'Sri Lanka';
        setDeliveryAddress({
          address: customerData.data.address || '',
          city: customerData.data.city || '',
          province: customerData.data.province || '',
          country: countryToUse
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer information');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

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
      setReceiptConfirmed(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveAddress = () => {
    if (!deliveryAddress.address.trim() || !deliveryAddress.city.trim() || !deliveryAddress.province.trim()) {
      toast.error('Please fill in all address fields');
      return;
    }
    setIsEditingAddress(false);
    setAddressConfirmed(false);
    toast.success('Delivery address updated');
  };

  const cancelAddressEdit = () => {
    if (customerInfo) {
      const savedCountry = customerInfo.country;
      const countryToUse = allowedCountries.includes(savedCountry) ? savedCountry : 'Sri Lanka';
      setDeliveryAddress({
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        province: customerInfo.province || '',
        country: countryToUse
      });
    }
    setIsEditingAddress(false);
  };

  // ✅ Enhanced validation with scroll-to-error
  const validateOrder = () => {
    // Reset blinking classes
    document.querySelectorAll('.blink-error').forEach(el => {
      el.classList.remove('blink-error');
    });

    if (!receiptFile) {
      toast.error('Please upload a bank transfer receipt');
      if (receiptInputRef.current) {
        receiptInputRef.current.classList.add('blink-error');
        receiptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    if (!addressConfirmed) {
      toast.error('Please confirm your delivery address is correct');
      if (addressCheckboxRef.current) {
        addressCheckboxRef.current.classList.add('blink-error');
        addressCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    if (!receiptConfirmed) {
      toast.error('Please confirm your payment receipt is correct');
      if (receiptCheckboxRef.current) {
        receiptCheckboxRef.current.classList.add('blink-error');
        receiptCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    if (!termsAccepted) {
      toast.error('Please accept our Terms and Conditions');
      if (termsCheckboxRef.current) {
        termsCheckboxRef.current.classList.add('blink-error');
        termsCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    const hasSufficientStock = cartItems.every(item => {
      const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
      return maxAvailable === Infinity || item.quantity <= maxAvailable;
    });
    
    if (!hasSufficientStock) {
      toast.error('Some items are out of stock. Please update your cart.');
      return false;
    }
    
    // ✅ Validate country is in allowed list
    if (!allowedCountries.includes(deliveryAddress.country)) {
      toast.error('Selected country is not supported for delivery');
      return false;
    }
    
    return true;
  };

  const placeOrder = async () => {
    if (!validateOrder()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const token = getCustomerToken();
      const formData = new FormData();
      
      const items = cartItems.map(item => ({
        productId: item.productId._id,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.productId.price
      }));
      
      formData.append('items', JSON.stringify(items));
      formData.append('totalAmount', total.toString());
      formData.append('receipt', receiptFile);
      formData.append('deliveryAddress', JSON.stringify(deliveryAddress));
      
      const selectedItemIds = location.state?.selectedItems || [];
      formData.append('cartItemIds', JSON.stringify(selectedItemIds));
      
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Order placed successfully!', { autoClose: 3000 });
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
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
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const formatPrice = (p) =>
    p == null ? 'Contact' : `LKR ${p.toLocaleString()}`;

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

  if (loading) {
    return <Loading message="Loading checkout..." size="large" />;
  }

  return (
    <div className="bg-black text-white min-h-screen pb-24 md:pb-8">

      <Helmet>
        <title>Checkout – Happy Time</title>
        <meta name="description" content="Complete your purchase securely at Happy Time. Review your order, upload payment receipt, and place your order." />
        <meta name="robots" content="noindex, nofollow" /> {/* user-specific page, not for indexing */}
        <link rel="canonical" href="https://happytimeonline.com/checkout" />

        {/* Open Graph (optional but good for consistency) */}
        <meta property="og:title" content="Checkout – Happy Time" />
        <meta property="og:description" content="Complete your purchase securely at Happy Time." />
        <meta property="og:url" content="https://happytimeonline.com/checkout" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Checkout – Happy Time" />
        <meta name="twitter:description" content="Complete your purchase securely at Happy Time." />
        <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
      </Helmet>

      <ScrollToTop />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="mr-3 text-gray-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Order Items ({cartItems.length})</h2>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                    <img
                      src={item.productId?.images?.[0]}
                      alt={item.productId?.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate mb-1">
                        {item.productId?.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">
                        {item.selectedColor} × {item.quantity}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-gold">
                        {formatPrice(item.productId?.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Address
                </h2>
                {!isEditingAddress && (
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="text-gold hover:text-gold/80 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {!isEditingAddress ? (
                <div className="text-sm text-gray-300 bg-black/20 p-3 sm:p-4 rounded-lg">
                  {formatAddress(deliveryAddress)}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={deliveryAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={deliveryAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    placeholder="Province/State *"
                    value={deliveryAddress.province}
                    onChange={(e) => handleAddressChange('province', e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  {/* ✅ Country Dropdown */}
                  <select
                    value={deliveryAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
                  >
                    {allowedCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={saveAddress}
                      className="flex-1 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelAddressEdit}
                      className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bank Transfer
              </h2>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-sm text-gray-300 mb-3">
                  Please transfer <span className="font-bold text-gold text-base">LKR {total.toLocaleString()}</span> to:
                </p>
                <div className="text-xs sm:text-sm bg-black/30 p-3 rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="font-medium">{bankInfo.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Name:</span>
                    <span className="font-medium">{bankInfo.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank:</span>
                    <span className="font-medium">{bankInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Branch:</span>
                    <span className="font-medium">{bankInfo.branch}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Payment Receipt *
                </label>
                {/* ✅ Add ref to receipt input */}
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleReceiptChange}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 file:transition"
                />
                {receiptPreview && (
                  <div className="mt-3">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="max-h-40 object-contain rounded-lg w-full bg-black/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptFile(null);
                        setReceiptPreview('');
                        setReceiptConfirmed(false);
                      }}
                      className="text-red-400 text-sm mt-2 hover:text-red-300 transition"
                    >
                      Remove Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation Checkboxes */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Order Confirmation
              </h2>
              <div className="space-y-4">
                {/* ✅ Add ref to address checkbox */}
                <label 
                  ref={addressCheckboxRef}
                  className="flex items-start cursor-pointer blink-target"
                >
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
                {/* ✅ Add ref to receipt checkbox */}
                <label 
                  ref={receiptCheckboxRef}
                  className="flex items-start cursor-pointer blink-target"
                >
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
                {/* ✅ Add ref to terms checkbox */}
                <label 
                  ref={termsCheckboxRef}
                  className="flex items-start cursor-pointer blink-target"
                >
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
          </div>

          {/* Desktop Order Summary Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-800 font-bold text-base">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={placeOrder}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-xl font-bold transition ${
                  isProcessing
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-gold text-black hover:bg-gold/90 shadow-lg hover:shadow-gold/20'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              <p className="text-gray-500 text-xs mt-3 text-center">
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-3 z-50">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">Total Amount</p>
            <p className="text-base font-bold text-gold truncate">{formatPrice(total)}</p>
          </div>
          <button
            onClick={placeOrder}
            disabled={isProcessing}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              isProcessing
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gold text-black hover:bg-gold/90 shadow-lg shadow-gold/20'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* ✅ Blink Animation CSS */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          50% { box-shadow: 0 0 0 4px rgba(212, 175, 55, 0); }
        }
        .blink-error {
          animation: blink 1.5s ease-in-out 2;
          position: relative;
        }
        .blink-target input {
          transition: all 0.2s ease;
        }
        .blink-target.blink-error input {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;