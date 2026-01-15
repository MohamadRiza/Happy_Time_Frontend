// src/pages/AdminPages/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken, logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Username update state
  const [usernameForm, setUsernameForm] = useState({
    currentPassword: '',
    newUsername: ''
  });
  
  // Password update state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch current admin details
  const fetchAdminDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCurrentAdmin(data.data);
      } else {
        setError(data.message || 'Failed to load admin details');
      }
    } catch (err) {
      console.error('Fetch admin error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  // Handle username update
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usernameForm.currentPassword || !usernameForm.newUsername) {
      setError('All fields are required');
      return;
    }

    if (usernameForm.newUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/profile/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          currentPassword: usernameForm.currentPassword,
          newUsername: usernameForm.newUsername
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Username updated successfully!');
        setUsernameForm({ currentPassword: '', newUsername: '' });
        // Update local admin data
        setCurrentAdmin(prev => ({ ...prev, username: usernameForm.newUsername }));
      } else {
        setError(data.message || 'Failed to update username');
      }
    } catch (err) {
      console.error('Update username error:', err);
      setError('Network error. Please try again.');
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        // Force re-login for security
        setTimeout(() => {
          logout();
          navigate('/admin/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Update password error:', err);
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Settings">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading admin settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>

        {error && <p className="text-red-400 mb-6">{error}</p>}
        {success && <p className="text-green-400 mb-6">{success}</p>}

        {/* Current Admin Info */}
        {currentAdmin && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Current Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Username</span>
                <span className="text-white">{currentAdmin.username}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Role</span>
                <span className="text-white capitalize">{currentAdmin.role}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">
                  {new Date(currentAdmin.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-800">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {new Date(currentAdmin.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Update Username Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Update Username</h3>
          <p className="text-gray-400 text-sm mb-6">
            Change your admin username. You'll need to provide your current password for security.
          </p>
          
          <form onSubmit={handleUsernameUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Current Password *</label>
              <input
                type="password"
                value={usernameForm.currentPassword}
                onChange={(e) => setUsernameForm({...usernameForm, currentPassword: e.target.value})}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                placeholder="Enter your current password"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm">New Username *</label>
              <input
                type="text"
                value={usernameForm.newUsername}
                onChange={(e) => setUsernameForm({...usernameForm, newUsername: e.target.value})}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                placeholder="Enter new username"
              />
            </div>
            
            <button
              type="submit"
              className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition"
            >
              Update Username
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Update Password</h3>
          <p className="text-gray-400 text-sm mb-6">
            Change your admin password. For security, you'll be logged out after changing your password.
          </p>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Current Password *</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                placeholder="Enter your current password"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm">New Password *</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Confirm New Password *</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                placeholder="Confirm new password"
              />
            </div>
            
            <button
              type="submit"
              className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;