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
          // Initialize edit form with current data
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
        // Update local storage and state
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
            className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-gold/90 transition"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            {getInitials(customer?.fullName) || 'U'}
          </div>
          <h1 className="text-3xl font-bold text-white">My Account</h1>
          <p className="text-gray-400">Welcome back, {customer?.fullName?.split(' ')[0]}!</p>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            updateMessage.includes('successfully') 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-red-900/30 text-red-300'
          }`}>
            {updateMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Account Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditToggle}
                    className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold/90 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={editForm.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
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
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={editForm.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
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
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-2 text-sm">Address</label>
                      <textarea
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  {/* Business Details Section */}
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
                    
                    <div className="space-y-4">
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
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
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
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
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
                                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 mb-2 text-sm">Shop Address</label>
                                <textarea
                                  name="businessDetails.shopAddress"
                                  value={editForm.businessDetails.shopAddress}
                                  onChange={handleInputChange}
                                  rows="2"
                                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
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
                              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
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

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 bg-gold text-black py-2 rounded-lg font-medium hover:bg-gold/90 transition disabled:opacity-70"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-sm">Full Name</label>
                    <p className="text-white">{customer?.fullName}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Username</label>
                    <p className="text-white">{customer?.username}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Email</label>
                    <p className="text-white">{customer?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Mobile Number</label>
                    <p className="text-white">{customer?.mobileNumber}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Date of Birth</label>
                    <p className="text-white">
                      {customer?.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Country</label>
                    <p className="text-white">{customer?.country}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Province</label>
                    <p className="text-white">{customer?.province}</p>
                  </div>
                  {customer?.city && (
                    <div>
                      <label className="text-gray-500 text-sm">City</label>
                      <p className="text-white">{customer.city}</p>
                    </div>
                  )}
                  {customer?.address && (
                    <div>
                      <label className="text-gray-500 text-sm">Address</label>
                      <p className="text-white">{customer.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Business Details - Read Only View */}
            {!isEditing && customer?.businessDetails && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mt-6">
                <h2 className="text-xl font-bold text-white mb-6">Business Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-500 text-sm">Sells Watches</label>
                    <p className="text-white">{customer.businessDetails.sellsWatches ? 'Yes' : 'No'}</p>
                  </div>
                  
                  {customer.businessDetails.sellsWatches && (
                    <>
                      <div>
                        <label className="text-gray-500 text-sm">Has Watch Shop</label>
                        <p className="text-white">{customer.businessDetails.hasWatchShop ? 'Yes' : 'No'}</p>
                      </div>
                      
                      {customer.businessDetails.hasWatchShop && customer.businessDetails.shopName && (
                        <div>
                          <label className="text-gray-500 text-sm">Shop Name</label>
                          <p className="text-white">{customer.businessDetails.shopName}</p>
                        </div>
                      )}
                      
                      {customer.businessDetails.hasWatchShop && customer.businessDetails.shopAddress && (
                        <div>
                          <label className="text-gray-500 text-sm">Shop Address</label>
                          <p className="text-white">{customer.businessDetails.shopAddress}</p>
                        </div>
                      )}
                      
                      {customer.businessDetails.businessType && (
                        <div>
                          <label className="text-gray-500 text-sm">Business Type</label>
                          <p className="text-white">
                            {customer.businessDetails.businessType
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {!isEditing && (
              <>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition"
                >
                  My Orders
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-900/50 hover:bg-red-800 text-red-300 py-3 px-4 rounded-xl transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;