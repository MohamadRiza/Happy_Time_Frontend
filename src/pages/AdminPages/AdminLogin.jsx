// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAdmin } from '../../utils/auth';
import ScrollToTop from '../../components/ScrollToTop';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-950 px-4 relative overflow-hidden">
      <ScrollToTop />

      {/* Subtle geometric background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="w-full max-w-md">
        <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-gold/5 relative">
          {/* Decorative top accent bar */}
          <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-t-2xl"></div>

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png" // 🔴 Replace with your actual logo path
              alt="Happy Time Admin"
              className="h-12 md:h-14 object-contain"
            />
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Admin Portal
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto my-4 rounded-full"></div>
            <p className="text-gray-500 text-sm">
              Secure access for authorized personnel only
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <p className="text-red-400 text-center text-sm bg-red-500/10 py-2 px-4 rounded-lg border border-red-900/30">
                {error}
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-400 text-xs font-medium mb-1 ml-1">
                ADMIN USERNAME
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                required
                className="w-full px-4 py-3.5 bg-black/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-600 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-xs font-medium mb-1 ml-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3.5 bg-black/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder-gray-600 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gold transition"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-amber-700 text-black font-bold py-3.5 rounded-xl hover:from-gold/90 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-gold/20 disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : 'ACCESS ADMIN PANEL'}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <p className="text-center text-gray-600 text-xs">
              © {new Date().getFullYear()} Happy Time Pvt Ltd — Luxury Timepieces Since 2015
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;