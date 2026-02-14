// src/pages/RegisterStep1.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerLogin } from '../utils/auth';
import { Helmet } from 'react-helmet';

const RegisterStep1 = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    country: 'Sri Lanka',
    countryCode: '+94',
    province: '',
    city: '',
    address: '',
    mobileNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    customerType: 'retail'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ SYNCED COUNTRY LIST - Only allowed countries with their codes
  const countryOptions = [
    { code: '+94', name: 'Sri Lanka' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+973', name: 'Bahrain' },
    { code: '+20', name: 'Egypt' },
    { code: '+98', name: 'Iran' },
    { code: '+964', name: 'Iraq' },
    { code: '+962', name: 'Jordan' },
    { code: '+965', name: 'Kuwait' },
    { code: '+961', name: 'Lebanon' },
    { code: '+968', name: 'Oman' },
    { code: '+970', name: 'Palestine' },
    { code: '+974', name: 'Qatar' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+963', name: 'Syria' },
    { code: '+90', name: 'Turkey' },
    { code: '+967', name: 'Yemen' },
    { code: '+91', name: 'India' },
    { code: '+960', name: 'Maldives' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+92', name: 'Pakistan' },
    { code: '+977', name: 'Nepal' },
    { code: '+995', name: 'Georgia' },
    { code: '+374', name: 'Armenia' },
    { code: '+994', name: 'Azerbaijan' }
    // Note: Removed countries not in your allowed list
    // Myanmar (+95), Bhutan (+975), Afghanistan (+93), Kazakhstan (+7), Turkmenistan (+993), Uzbekistan (+998) 
    // can be added if you have their country codes
  ];

  // Sort by country name
  const countryCodes = countryOptions.sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'mobileNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData(prev => ({ ...prev, mobileNumber: limitedDigits }));
    } else if (name === 'fullName') {
      const limitedName = value.slice(0, 40);
      setFormData(prev => ({ ...prev, fullName: limitedName }));
    } else if (name === 'country') {
      // ✅ Auto-update country code when country changes
      const selectedCountry = countryOptions.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        countryCode: selectedCountry?.code || '+94'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setError('');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 2) return { score, label: 'Weak', color: 'text-red-400' };
    if (score < 4) return { score, label: 'Fair', color: 'text-yellow-400' };
    if (score < 5) return { score, label: 'Good', color: 'text-green-400' };
    return { score, label: 'Strong', color: 'text-emerald-400' };
  };

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.fullName.trim().length > 40) {
      setError('Full name must be 40 characters or less');
      return false;
    }
    if (!/^[a-zA-Z\s\-']+$/.test(formData.fullName.trim())) {
      setError('Full name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
      return false;
    }
    const dob = new Date(formData.dob);
    const today = new Date();
    if (dob > today) {
      setError('Date of birth cannot be in the future');
      return false;
    }
    if (dob < new Date('1900-01-01')) {
      setError('Please enter a valid date of birth');
      return false;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return false;
    }
    if (!formData.province.trim()) {
      setError('Province is required');
      return false;
    }
    if (!formData.mobileNumber.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (formData.mobileNumber.length < 9 || formData.mobileNumber.length > 10) {
      setError('Mobile number must be 9-10 digits');
      return false;
    }
    if (!/^\d+$/.test(formData.mobileNumber)) {
      setError('Mobile number can only contain digits');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRetailRegistration = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const registerData = {
        fullName: formData.fullName,
        dob: formData.dob,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        address: formData.address,
        mobileNumber: `${formData.countryCode}${formData.mobileNumber}`,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        businessDetails: {
          sellsWatches: false,
          hasWatchShop: false,
          shopName: '',
          shopAddress: '',
          businessType: 'retail'
        }
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
        navigate('/account');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Retail registration error:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    
    if (formData.customerType === 'retail') {
      await handleRetailRegistration();
    } else {
      sessionStorage.setItem('registerStep1', JSON.stringify(formData));
      navigate('/register/step2');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 py-8 md:py-12 relative overflow-hidden">
      
            <Helmet>
        <title>Create Account – Happy Time</title>
        <meta name="description" content="Register for a Happy Time customer account. Choose retail or wholesale and enjoy premium timepieces with easy order tracking." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/register" />

        {/* Open Graph */}
        <meta property="og:title" content="Create Account – Happy Time" />
        <meta property="og:description" content="Register for a Happy Time customer account." />
        <meta property="og:url" content="https://yourdomain.com/register" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourdomain.com/images/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Account – Happy Time" />
        <meta name="twitter:description" content="Register for a Happy Time customer account." />
        <meta name="twitter:image" content="https://yourdomain.com/images/og-image.jpg" />
      </Helmet>

      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.2) 0%, transparent 25%), 
                             radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.15) 0%, transparent 30%)`
        }}
      ></div>

      <div className="relative w-full max-w-4xl">
        <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl shadow-gold/10">
          <h2 className="text-2xl md:text-3xl font-bold text-gold mb-2 text-center tracking-wide">Create Account</h2>
          <p className="text-gray-400 text-center mb-6 text-sm">Join us to explore premium timepieces</p>
          
          {error && <p className="text-red-400 mb-5 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Type Selection */}
            <div className="bg-gray-800/30 p-4 md:p-5 rounded-xl">
              <h3 className="text-base md:text-lg font-semibold text-white mb-4">Account Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <label className="cursor-pointer">
                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    formData.customerType === 'retail' 
                      ? 'border-gold bg-gold/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="customerType"
                        value="retail"
                        checked={formData.customerType === 'retail'}
                        onChange={handleChange}
                        className="w-4 h-4 text-gold"
                      />
                      <div>
                        <div className="font-medium text-white">Retail Customer</div>
                        <div className="text-gray-400 text-sm">Shop for personal use</div>
                      </div>
                    </div>
                  </div>
                </label>
                
                <label className="cursor-pointer">
                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    formData.customerType === 'wholesale' 
                      ? 'border-gold bg-gold/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="customerType"
                        value="wholesale"
                        checked={formData.customerType === 'wholesale'}
                        onChange={handleChange}
                        className="w-4 h-4 text-gold"
                      />
                      <div>
                        <div className="font-medium text-white">Wholesale Customer</div>
                        <div className="text-gray-400 text-sm">Business/Reseller account</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Personal Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="John Doe"
                  maxLength="40"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Max 40 characters (letters, spaces, hyphens, apostrophes only)
                </p>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Location Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Country *</label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition cursor-pointer"
                    required
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.name} className="bg-gray-900 text-white">
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Province/State *</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="Western Province"
                  required
                />
              </div>
            </div>

            {/* Optional Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">City (Optional)</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="Colombo"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            {/* Contact Info with Country Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Mobile Number *</label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-1/3 bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent appearance-none"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code} className="bg-gray-900 text-white">
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                    placeholder="771234567"
                    maxLength="10"
                    required
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Enter 9-10 digits (no spaces or special characters)
                </p>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="johndoe123"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Letters, numbers, and underscores only (min 3 characters)
                </p>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={`font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score < 2 ? 'w-1/4 bg-red-500' :
                          passwordStrength.score < 4 ? 'w-2/4 bg-yellow-500' :
                          passwordStrength.score < 5 ? 'w-3/4 bg-green-500' : 'w-full bg-emerald-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password - Full Width */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm font-medium">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold transition"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-lg font-bold tracking-wide hover:bg-gold/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 
               formData.customerType === 'retail' ? 'Create Account' : 'Continue to Business Details'}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold font-medium hover:underline transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1;