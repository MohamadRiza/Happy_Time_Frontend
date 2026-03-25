import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerLogin } from '../utils/auth';
import { Helmet } from 'react-helmet';

// Helper: get country list with codes (sorted by name)
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
].sort((a, b) => a.name.localeCompare(b.name));

const RegisterStep1 = () => {
  const navigate = useNavigate();

  // Load saved data from sessionStorage if returning from Step2
  const savedData = sessionStorage.getItem('registerStep1');
  const initialData = savedData
    ? JSON.parse(savedData)
    : {
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
        customerType: 'retail',
      };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update sessionStorage whenever wholesale data changes (to preserve on back/refresh)
  useEffect(() => {
    if (formData.customerType === 'wholesale') {
      sessionStorage.setItem('registerStep1', JSON.stringify(formData));
    } else {
      // Clear session storage if switching to retail (no multi-step needed)
      sessionStorage.removeItem('registerStep1');
    }
  }, [formData]);

  // Real-time validation for each field
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length > 40) return 'Full name must be 40 characters or less';
        if (!/^[a-zA-Z\s\-']+$/.test(value.trim()))
          return 'Only letters, spaces, hyphens, and apostrophes allowed';
        return '';

      case 'dob':
        if (!value) return 'Date of birth is required';
        const dobDate = new Date(value);
        const today = new Date();
        if (dobDate > today) return 'Date of birth cannot be in the future';
        if (dobDate < new Date('1900-01-01')) return 'Please enter a valid date of birth';
        return '';

      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';

      case 'province':
        if (!value.trim()) return 'Province/State is required';
        return '';

      case 'mobileNumber':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^\d+$/.test(value)) return 'Only digits allowed';
        if (value.length < 9 || value.length > 10) return 'Must be 9–10 digits';
        return '';

      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'At least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return 'Only letters, numbers, and underscores allowed';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for mobile number (digits only, max 10)
    if (name === 'mobileNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData(prev => ({ ...prev, mobileNumber: limitedDigits }));
      return;
    }

    // Full name length limit
    if (name === 'fullName') {
      const limitedName = value.slice(0, 40);
      setFormData(prev => ({ ...prev, fullName: limitedName }));
      return;
    }

    // Auto-update country code when country changes
    if (name === 'country') {
      const selectedCountry = countryOptions.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        countryCode: selectedCountry?.code || '+94'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '', requirements: [] };

    let score = 0;
    const requirements = [];
    if (password.length >= 6) { score += 1; requirements.push('At least 6 characters'); }
    if (/[A-Z]/.test(password)) { score += 1; requirements.push('Uppercase letter'); }
    if (/[a-z]/.test(password)) { score += 1; requirements.push('Lowercase letter'); }
    if (/[0-9]/.test(password)) { score += 1; requirements.push('Number'); }
    if (/[^A-Za-z0-9]/.test(password)) { score += 1; requirements.push('Special character'); }

    let label = '', color = '';
    if (score < 2) { label = 'Weak'; color = 'text-red-400'; }
    else if (score < 4) { label = 'Fair'; color = 'text-yellow-400'; }
    else if (score < 5) { label = 'Good'; color = 'text-green-400'; }
    else { label = 'Strong'; color = 'text-emerald-400'; }

    return { score, label, color, requirements };
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Validation for all fields (used on submit)
  const validateAll = () => {
    const newErrors = {};
    const fieldsToValidate = [
      'fullName', 'dob', 'country', 'province', 'mobileNumber', 'username', 'password', 'confirmPassword'
    ];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRetailRegistration = async () => {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    const data = await res.json();
    if (data.success) {
      customerLogin(data.data.token, data.data.customer);
      navigate('/account');
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate all fields
    if (!validateAll()) {
      // Also mark all fields as touched to show errors
      const allTouched = {};
      Object.keys(formData).forEach(key => { allTouched[key] = true; });
      setTouched(allTouched);
      return;
    }

    if (!termsAccepted) {
      setSubmitError('You must accept the Terms & Conditions to create an account.');
      return;
    }

    setLoading(true);
    try {
      if (formData.customerType === 'retail') {
        await handleRetailRegistration();
      } else {
        // Data already saved to sessionStorage, just navigate
        navigate('/register/step2');
      }
    } catch (err) {
      setSubmitError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step indicator (shown only for wholesale)
  const showStepIndicator = formData.customerType === 'wholesale';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 py-8 md:py-12 relative overflow-hidden">
      <Helmet>
        <title>Create Account – Happy Time</title>
        <meta name="description" content="Register for a Happy Time customer account. Choose retail or wholesale and enjoy premium timepieces with easy order tracking." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://happytimeonline.com/register" />
        <meta property="og:title" content="Create Account – Happy Time" />
        <meta property="og:description" content="Register for a Happy Time customer account." />
        <meta property="og:url" content="https://happytimeonline.com/register" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Account – Happy Time" />
        <meta name="twitter:description" content="Register for a Happy Time customer account." />
        <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
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

          {/* Step indicator */}
          {showStepIndicator && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Step 1 of 2</span>
                <span className="text-xs text-gray-400">Personal Information</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gold h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          )}

          {submitError && (
            <p className="text-red-400 mb-5 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">
              {submitError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Type Selection */}
            <div className="bg-gray-800/30 p-4 md:p-5 rounded-xl">
              <h3 className="text-base md:text-lg font-semibold text-white mb-4">Account Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <label className="cursor-pointer">
                  <div className={`p-4 rounded-lg border-2 transition-all ${formData.customerType === 'retail'
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
                  <div className={`p-4 rounded-lg border-2 transition-all ${formData.customerType === 'wholesale'
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
                  onBlur={handleBlur}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.fullName && errors.fullName ? 'border-red-500' : 'border-gray-700'
                    }`}
                  placeholder="John Doe"
                  maxLength="40"
                  required
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
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
                  onBlur={handleBlur}
                  max={new Date().toISOString().split('T')[0]}
                  min="1900-01-01"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.dob && errors.dob ? 'border-red-500' : 'border-gray-700'
                    }`}
                  required
                />
                {touched.dob && errors.dob && (
                  <p className="text-red-400 text-xs mt-1">{errors.dob}</p>
                )}
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
                    onBlur={handleBlur}
                    className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-gold transition cursor-pointer ${touched.country && errors.country ? 'border-red-500' : 'border-gray-700'
                      }`}
                    required
                  >
                    {countryOptions.map(country => (
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
                {touched.country && errors.country && (
                  <p className="text-red-400 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Province/State *</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.province && errors.province ? 'border-red-500' : 'border-gray-700'
                    }`}
                  placeholder="Western Province"
                  required
                />
                {touched.province && errors.province && (
                  <p className="text-red-400 text-xs mt-1">{errors.province}</p>
                )}
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
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition"
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
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition"
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
                    className="w-1/3 bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
                  >
                    {countryOptions.map(country => (
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
                    onBlur={handleBlur}
                    className={`flex-1 bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.mobileNumber && errors.mobileNumber ? 'border-red-500' : 'border-gray-700'
                      }`}
                    placeholder="771234567"
                    maxLength="10"
                    required
                  />
                </div>
                {touched.mobileNumber && errors.mobileNumber ? (
                  <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">
                    Enter 9–10 digits (no spaces/special). Example: {formData.countryCode} 77 123 4567
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition"
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
                  onBlur={handleBlur}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.username && errors.username ? 'border-red-500' : 'border-gray-700'
                    }`}
                  placeholder="johndoe123"
                  required
                />
                {touched.username && errors.username && (
                  <p className="text-red-400 text-xs mt-1">{errors.username}</p>
                )}
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
                    onBlur={handleBlur}
                    className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.password && errors.password ? 'border-red-500' : 'border-gray-700'
                      }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}

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
                    {passwordStrength.score < 5 && (
                      <ul className="text-xs text-gray-400 mt-2 space-y-1">
                        {passwordStrength.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            {formData.password && (
                              req === 'At least 6 characters' && formData.password.length >= 6 ? '✓' :
                                req === 'Uppercase letter' && /[A-Z]/.test(formData.password) ? '✓' :
                                  req === 'Lowercase letter' && /[a-z]/.test(formData.password) ? '✓' :
                                    req === 'Number' && /[0-9]/.test(formData.password) ? '✓' :
                                      req === 'Special character' && /[^A-Za-z0-9]/.test(formData.password) ? '✓' : '○'
                            )} {req}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm font-medium">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && passwordsMatch && !errors.confirmPassword && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-gold bg-black/30 border-gray-700 rounded focus:ring-gold"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I accept the <Link to="/terms" className="text-gold hover:underline">Terms & Conditions</Link> and{' '}
                <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-lg font-bold tracking-wide hover:bg-gold/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                formData.customerType === 'retail' ? 'Create Account' : 'Continue to Business Details'
              )}
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