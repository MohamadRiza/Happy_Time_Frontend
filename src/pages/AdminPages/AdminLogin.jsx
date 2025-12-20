// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAdmin } from '../../utils/auth';
import ScrollToTop from '../../components/ScrollToTop';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const res = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <ScrollToTop />

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <img
            src="/logo.png" // 🔴 replace with your Happy Time logo path
            alt="Happy Time Logo"
            className="h-14 object-contain"
          />
        </div>

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gold tracking-wide">
            Happy Time Admin
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto my-3 rounded-full" />
          <p className="text-gray-400 text-sm">
            Secure access to store management
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            required
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:border-gold placeholder-gray-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            required
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:border-gold placeholder-gray-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} Happy Time Pvt Ltd
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
