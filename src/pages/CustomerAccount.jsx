// src/pages/CustomerAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerToken, getCustomer, customerLogout, customerLogin } from '../utils/auth';

const CustomerAccount = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: '',
    address: '',
    businessDetails: {
      sellsWatches: false,
      hasWatchShop: false,
      shopName: '',
      shopAddress: '',
      businessType: ''
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/customers/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setCustomer(data.data);
          setEditForm({
            fullName: data.data.fullName || '',
            email: data.data.email || '',
            mobileNumber: data.data.mobileNumber || '',
            city: data.data.city || '',
            address: data.data.address || '',
            businessDetails: data.data.businessDetails || {
              sellsWatches: false,
              hasWatchShop: false,
              shopName: '',
              shopAddress: '',
              businessType: ''
            }
          });
        } else {
          throw new Error(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Unable to load profile. Please login again.');
        customerLogout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    customerLogout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('businessDetails.')) {
      const field = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        businessDetails: {
          ...prev.businessDetails,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setUpdateMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage('');

    try {
      const token = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const updateData = {
        fullName: editForm.fullName,
        email: editForm.email,
        mobileNumber: editForm.mobileNumber,
        city: editForm.city,
        address: editForm.address,
        businessDetails: editForm.businessDetails
      };

      const res = await fetch(`${API_URL}/api/customers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();
      
      if (data.success) {
        const updatedCustomer = { ...customer, ...data.data };
        setCustomer(updatedCustomer);
        customerLogin(token, updatedCustomer);
        setUpdateMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setUpdateMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setUpdateMessage('Network error. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
          <p className="text-gray-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-gold/90 transition shadow-lg"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Header with Profile & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gold text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-gold/20">
              {getInitials(customer?.fullName) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="text-gray-400">Welcome back, {customer?.fullName?.split(' ')[0]}!</p>
            </div>
          </div>

          {/* Action Buttons - Integrated into header */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-800/70 backdrop-blur border border-gray-700 hover:border-gold text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-800"
            >
              My Orders
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-900/30 backdrop-blur border border-red-800/50 hover:border-red-700 text-red-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-900/40"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div className={`mb-8 p-4 rounded-xl backdrop-blur ${
            updateMessage.includes('successfully') 
              ? 'bg-green-900/20 border border-green-800/50 text-green-300' 
              : 'bg-red-900/20 border border-red-800/50 text-red-300'
          }`}>
            {updateMessage}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8">
            {/* Edit Toggle */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Account Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="bg-gold text-black px-5 py-2 rounded-xl text-sm font-medium hover:bg-gold/90 transition shadow-md"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-gray-700 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={editForm.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 mb-2 text-sm">Address</label>
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="mt-8 pt-8 border-t border-gray-800/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Business Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-400">Do you sell watches?</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="businessDetails.sellsWatches"
                          checked={editForm.businessDetails.sellsWatches}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>

                    {editForm.businessDetails.sellsWatches && (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-gray-400">Do you have a watch shop?</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="businessDetails.hasWatchShop"
                              checked={editForm.businessDetails.hasWatchShop}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                          </label>
                        </div>

                        {editForm.businessDetails.hasWatchShop && (
                          <>
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">Shop Name</label>
                              <input
                                type="text"
                                name="businessDetails.shopName"
                                value={editForm.businessDetails.shopName}
                                onChange={handleInputChange}
                                className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">Shop Address</label>
                              <textarea
                                name="businessDetails.shopAddress"
                                value={editForm.businessDetails.shopAddress}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">Business Type</label>
                          <select
                            name="businessDetails.businessType"
                            value={editForm.businessDetails.businessType}
                            onChange={handleInputChange}
                            className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition shadow-lg shadow-gold/20 disabled:opacity-70"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-500 text-sm">Full Name</label>
                  <p className="text-white text-lg">{customer?.fullName}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Username</label>
                  <p className="text-white text-lg">{customer?.username}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Email</label>
                  <p className="text-white text-lg">{customer?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Mobile Number</label>
                  <p className="text-white text-lg">{customer?.mobileNumber}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Date of Birth</label>
                  <p className="text-white text-lg">
                    {customer?.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Country</label>
                  <p className="text-white text-lg">{customer?.country}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm">Province</label>
                  <p className="text-white text-lg">{customer?.province}</p>
                </div>
                {customer?.city && (
                  <div>
                    <label className="text-gray-500 text-sm">City</label>
                    <p className="text-white text-lg">{customer.city}</p>
                  </div>
                )}
                {customer?.address && (
                  <div className="md:col-span-2">
                    <label className="text-gray-500 text-sm">Address</label>
                    <p className="text-white text-lg">{customer.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Business Details - Read Only View */}
        {!isEditing && customer?.businessDetails && (
          <div className="bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden shadow-xl mt-8">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Business Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sells Watches</span>
                  <span className="text-white">{customer.businessDetails.sellsWatches ? 'Yes' : 'No'}</span>
                </div>
                
                {customer.businessDetails.sellsWatches && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Has Watch Shop</span>
                      <span className="text-white">{customer.businessDetails.hasWatchShop ? 'Yes' : 'No'}</span>
                    </div>
                    
                    {customer.businessDetails.hasWatchShop && customer.businessDetails.shopName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shop Name</span>
                        <span className="text-white">{customer.businessDetails.shopName}</span>
                      </div>
                    )}
                    
                    {customer.businessDetails.hasWatchShop && customer.businessDetails.shopAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shop Address</span>
                        <span className="text-white">{customer.businessDetails.shopAddress}</span>
                      </div>
                    )}
                    
                    {customer.businessDetails.businessType && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Business Type</span>
                        <span className="text-white">
                          {customer.businessDetails.businessType
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAccount;