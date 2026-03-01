// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerLogin } from '../utils/auth';
import ScrollToTop from '../components/ScrollToTop';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For toggle
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/customers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        customerLogin(data.data.token, data.data.customer);
        navigate('/account');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Optional subtle background pattern or texture */}
            <Helmet>
        <title>Customer Login – Happy Time</title>
        <meta name="description" content="Login to your Happy Time customer account to manage orders, track shipments, and access your profile." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://happytimeonline.com/login" />

        {/* Open Graph */}
        <meta property="og:title" content="Customer Login – Happy Time" />
        <meta property="og:description" content="Login to your Happy Time customer account." />
        <meta property="og:url" content="https://happytimeonline.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Login – Happy Time" />
        <meta name="twitter:description" content="Login to your Happy Time customer account." />
        <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
      </Helmet>
      <ScrollToTop />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 20%), 
                             radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 25%)`
        }}
      ></div>

      <div className="relative w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-gold/10">
          <h2 className="text-2xl font-bold text-gold mb-6 text-center tracking-wide">Customer Login</h2>

          {error && <p className="text-red-400 mb-4 text-center text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 mb-2 text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-lg font-bold tracking-wide hover:bg-gold/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold font-medium hover:underline transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;