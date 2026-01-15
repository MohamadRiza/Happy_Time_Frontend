// src/pages/RegisterStep2.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Redirect if Step 1 data is missing
  useEffect(() => {
    const step1Data = sessionStorage.getItem('registerStep1');
    if (!step1Data) {
      navigate('/register');
    }
  }, [navigate]);

  const handleCheckboxChange = (field) => {
    setBusinessDetails((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
    setError('');
  };

  const handleInputChange = (e) => {
    setBusinessDetails((prev) => ({
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
        customerLogin(data.data.token, data.data.customer);
        sessionStorage.removeItem('registerStep1');
        navigate('/account');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gold radial accents */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 30%), 
                             radial-gradient(circle at 75% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 35%)`
        }}
      ></div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-gold/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gold mb-3 text-center tracking-wide">Business Details</h2>
          <p className="text-gray-400 text-center mb-7">
            Help us understand your relationship with watches (optional)
          </p>

          {error && <p className="text-red-400 mb-5 text-center text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Toggle: Do you sell watches? */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-black/20 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-medium">Do you sell watches?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={businessDetails.sellsWatches}
                  onChange={() => handleCheckboxChange('sellsWatches')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 flex items-center rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30"></div>
              </label>
            </div>

            {businessDetails.sellsWatches && (
              <>
                {/* Toggle: Do you have a watch shop? */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-black/20 rounded-xl border border-gray-800">
                  <span className="text-gray-300 font-medium">Do you have a watch shop?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={businessDetails.hasWatchShop}
                      onChange={() => handleCheckboxChange('hasWatchShop')}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 flex items-center rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30"></div>
                  </label>
                </div>

                {/* Shop Name & Address (if applicable) */}
                {businessDetails.hasWatchShop && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm font-medium">Shop Name</label>
                      <input
                        type="text"
                        name="shopName"
                        value={businessDetails.shopName}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                        placeholder="Happy Time Watch Shop"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm font-medium">Shop Address</label>
                      <textarea
                        name="shopAddress"
                        value={businessDetails.shopAddress}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                        placeholder="49A Keyzer Street, Colombo"
                      />
                    </div>
                  </div>
                )}

                {/* Business Type */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">Business Type</label>
                  <div className="relative">
                    <select
                      name="businessType"
                      value={businessDetails.businessType}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition cursor-pointer"
                    >
                      <option value="" className="bg-gray-900 text-gray-400">Select business type</option>
                      <option value="retail" className="bg-gray-900 text-white">Retail Store</option>
                      <option value="wholesale" className="bg-gray-900 text-white">Wholesale Dealer</option>
                      <option value="independent_watchmaker" className="bg-gray-900 text-white">Independent Watchmaker</option>
                      <option value="collector" className="bg-gray-900 text-white">Watch Collector</option>
                      <option value="other" className="bg-gray-900 text-white">Other</option>
                    </select>
                    {/* Custom arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3.5 rounded-lg font-medium transition duration-200 shadow-md"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold hover:bg-gold/90 text-black py-3.5 rounded-lg font-bold tracking-wide transition duration-200 shadow-lg shadow-gold/20 disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2;