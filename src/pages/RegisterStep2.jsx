// src/pages/RegisterStep2.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerLogin } from '../utils/auth';

const RegisterStep2 = () => {
  const [businessDetails, setBusinessDetails] = useState({
    sellsWatches: false,
    hasWatchShop: false,
    shopName: '',
    shopAddress: '',
    businessType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if step 1 data exists
  useEffect(() => {
    const step1Data = sessionStorage.getItem('registerStep1');
    if (!step1Data) {
      navigate('/register');
    }
  }, [navigate]);

  const handleCheckboxChange = (field) => {
    setBusinessDetails(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    setBusinessDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const step1Data = JSON.parse(sessionStorage.getItem('registerStep1'));
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // ✅ FIXED: Was "step1RowData", now "step1Data"
      const registerData = {
        ...step1Data,
        businessDetails
      };

      const res = await fetch(`${API_URL}/api/customers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();
      
      if (data.success) {
        // Login automatically after registration
        customerLogin(data.data.token, data.data.customer);
        sessionStorage.removeItem('registerStep1');
        navigate('/account');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gold mb-6 text-center">Business Details</h2>
        <p className="text-gray-400 text-center mb-6">
          Help us understand your relationship with watches (optional)
        </p>
        
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-gray-400">Do you sell watches?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessDetails.sellsWatches}
                onChange={() => handleCheckboxChange('sellsWatches')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>

          {businessDetails.sellsWatches && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-gray-400">Do you have a watch shop?</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessDetails.hasWatchShop}
                    onChange={() => handleCheckboxChange('hasWatchShop')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>

              {businessDetails.hasWatchShop && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={businessDetails.shopName}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      placeholder="Happy Time Watch Shop"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Shop Address</label>
                    <textarea
                      name="shopAddress"
                      value={businessDetails.shopAddress}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      placeholder="49A Keyzer Street, Colombo"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-400 mb-2 text-sm">Business Type</label>
                <select
                  name="businessType"
                  value={businessDetails.businessType}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail Store</option>
                  <option value="wholesale">Wholesale Dealer</option>
                  <option value="independent_watchmaker">Independent Watchmaker</option>
                  <option value="collector">Watch Collector</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStep2;