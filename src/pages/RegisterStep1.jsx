// src/pages/RegisterStep1.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterStep1 = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    country: 'Sri Lanka',
    province: '',
    city: '',
    address: '',
    mobileNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
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
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    // Store step 1 data in session storage
    sessionStorage.setItem('registerStep1', JSON.stringify(formData));
    navigate('/register/step2');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gold mb-6 text-center">Create Account</h2>
        
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              required
            >
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="India">India</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Province/State *</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="Western Province"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">City (Optional)</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="Colombo"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Address (Optional)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="+94 77 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="johndoe123"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Continue to Business Details'}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStep1;