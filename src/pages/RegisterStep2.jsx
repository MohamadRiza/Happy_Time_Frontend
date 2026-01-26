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

  const validateStep2 = () => {
    if (businessDetails.sellsWatches) {
      if (!businessDetails.businessType) {
        setError('Business type is required');
        return false;
      }
      
      if (businessDetails.hasWatchShop) {
        if (!businessDetails.shopName.trim()) {
          setError('Shop name is required');
          return false;
        }
        if (!businessDetails.shopAddress.trim()) {
          setError('Shop address is required');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 py-8 md:py-12 relative overflow-hidden">
      {/* Subtle gold radial accents */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 30%), 
                             radial-gradient(circle at 75% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 35%)`
        }}
      ></div>

      <div className="relative w-full max-w-3xl">
        <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl shadow-gold/10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-2 tracking-wide">Business Details</h2>
            <p className="text-gray-400 text-sm md:text-base">
              Help us understand your relationship with watches
            </p>
            <p className="text-gray-500 text-xs mt-1">(Required for wholesale accounts)</p>
          </div>

          {error && <p className="text-red-400 mb-6 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle: Do you sell watches? */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-black/20 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300 font-medium text-sm md:text-base">Do you sell watches?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={businessDetails.sellsWatches}
                  onChange={() => handleCheckboxChange('sellsWatches')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>

            {businessDetails.sellsWatches && (
              <div className="space-y-6 animate-fadeIn">
                {/* Toggle: Do you have a watch shop? */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-black/20 rounded-xl border border-gray-800 hover:border-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-300 font-medium text-sm md:text-base">Do you have a watch shop?</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={businessDetails.hasWatchShop}
                      onChange={() => handleCheckboxChange('hasWatchShop')}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>

                {/* Shop Name & Address (if applicable) */}
                {businessDetails.hasWatchShop && (
                  <div className="space-y-5 bg-gray-800/20 p-5 rounded-xl border border-gray-800 animate-fadeIn">
                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                      </svg>
                      Shop Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Shop Name *</label>
                        <input
                          type="text"
                          name="shopName"
                          value={businessDetails.shopName}
                          onChange={handleInputChange}
                          className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                          placeholder="Happy Time Watch Shop"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Shop Address *</label>
                        <input
                          type="text"
                          name="shopAddress"
                          value={businessDetails.shopAddress}
                          onChange={handleInputChange}
                          className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                          placeholder="49A Keyzer Street, Colombo"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Type */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Business Type *
                  </label>
                  <div className="relative">
                    <select
                      name="businessType"
                      value={businessDetails.businessType}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition cursor-pointer"
                      required
                    >
                      <option value="" className="bg-gray-900 text-gray-400">Select your business type</option>
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
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition duration-200 shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold hover:bg-gold/90 text-black py-3 rounded-lg font-bold tracking-wide transition duration-200 shadow-lg shadow-gold/20 disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2;