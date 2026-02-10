// src/components/CustomerAccountSec/ProfileSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerToken, customerLogout, customerLogin } from '../../utils/auth';

const ProfileSection = ({ customer, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: customer?.fullName || '',
    email: customer?.email || '',
    mobileNumber: customer?.mobileNumber || '',
    city: customer?.city || '',
    address: customer?.address || '',
    businessDetails: customer?.businessDetails || {
      sellsWatches: false,
      hasWatchShop: false,
      shopName: '',
      shopAddress: '',
      businessType: ''
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
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
        onProfileUpdate(updatedCustomer);
        customerLogin(token, updatedCustomer);
        toast.success('Profile updated successfully! 🎉', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile', {
          position: 'top-right',
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Network error. Please check your connection and try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isEditing) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm sm:text-base lg:text-xl">Edit Profile</span>
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-white p-1.5 rounded flex-shrink-0 active:scale-95"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-gray-400 mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={editForm.mobileNumber}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={editForm.city}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
              />
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-gray-400 mb-1 sm:mb-1.5 text-xs sm:text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={editForm.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold resize-none text-sm sm:text-base"
            />
          </div>

          {/* Business Details */}
          <div className="pt-3 sm:pt-4 border-t border-gray-800">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">Business Information</h3>
            
            <div className="flex items-center justify-between py-2 sm:py-2.5 px-3 bg-black/20 rounded-lg mb-2 sm:mb-3">
              <span className="text-gray-300 text-xs sm:text-sm lg:text-base">Do you sell watches?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="businessDetails.sellsWatches"
                  checked={editForm.businessDetails.sellsWatches}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>

            {editForm.businessDetails.sellsWatches && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between py-2 sm:py-2.5 px-3 bg-black/20 rounded-lg">
                  <span className="text-gray-300 text-xs sm:text-sm lg:text-base">Do you have a watch shop?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="businessDetails.hasWatchShop"
                      checked={editForm.businessDetails.hasWatchShop}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>

                {editForm.businessDetails.hasWatchShop && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs sm:text-sm">Shop Name</label>
                      <input
                        type="text"
                        name="businessDetails.shopName"
                        value={editForm.businessDetails.shopName}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 text-xs sm:text-sm">Shop Address</label>
                      <textarea
                        name="businessDetails.shopAddress"
                        value={editForm.businessDetails.shopAddress}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold resize-none text-sm sm:text-base"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 mb-1 text-xs sm:text-sm">Business Type</label>
                  <select
                    name="businessDetails.businessType"
                    value={editForm.businessDetails.businessType}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 focus:border-gold rounded-lg px-3 py-2 sm:py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
                  >
                    <option value="">Select business type</option>
                    <option value="retail">Retail Store</option>
                    <option value="wholesale">Wholesale Dealer</option>
                    <option value="independent_watchmaker">Independent Watchmaker</option>
                    <option value="collector">Watch Collector</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="submit"
              disabled={updateLoading}
              className="flex-1 bg-gold hover:bg-gold/90 text-black py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {updateLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={updateLoading}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition text-sm sm:text-base disabled:opacity-50 active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm sm:text-base lg:text-xl">My Profile</span>
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-gold hover:text-yellow-300 text-xs sm:text-sm font-medium flex items-center gap-1 flex-shrink-0 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-base sm:text-lg font-bold text-black">{getInitials(customer?.fullName)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white text-sm sm:text-base truncate">{customer?.fullName}</div>
            <div className="text-gray-400 text-xs sm:text-sm truncate">@{customer?.username}</div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Email</div>
            <div className="text-white text-sm sm:text-base truncate">{customer?.email || 'Not provided'}</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Mobile</div>
            <div className="text-white text-sm sm:text-base">{customer?.mobileNumber || 'Not provided'}</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Date of Birth</div>
            <div className="text-white text-sm sm:text-base">
              {customer?.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Location</div>
            <div className="text-white text-sm sm:text-base truncate">{customer?.city}, {customer?.country}</div>
          </div>
        </div>

        {/* Address */}
        {customer?.address && (
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-gray-400 text-xs sm:text-sm mb-1">Address</div>
            <div className="text-white text-sm sm:text-base whitespace-pre-line">{customer.address}</div>
          </div>
        )}

        {/* Business Details */}
        {customer?.businessDetails && (
          <div className="pt-3 border-t border-gray-800">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">Business Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Sells Watches</div>
                <div className="text-white text-sm sm:text-base">{customer.businessDetails.sellsWatches ? 'Yes' : 'No'}</div>
              </div>
              {customer.businessDetails.sellsWatches && (
                <>
                  <div className="p-3 bg-black/30 rounded-lg">
                    <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Has Watch Shop</div>
                    <div className="text-white text-sm sm:text-base">{customer.businessDetails.hasWatchShop ? 'Yes' : 'No'}</div>
                  </div>
                  {customer.businessDetails.hasWatchShop && customer.businessDetails.shopName && (
                    <div className="p-3 bg-black/30 rounded-lg">
                      <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Shop Name</div>
                      <div className="text-white text-sm sm:text-base">{customer.businessDetails.shopName}</div>
                    </div>
                  )}
                  {customer.businessDetails.hasWatchShop && customer.businessDetails.shopAddress && (
                    <div className="p-3 bg-black/30 rounded-lg sm:col-span-2">
                      <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Shop Address</div>
                      <div className="text-white text-sm sm:text-base whitespace-pre-line">{customer.businessDetails.shopAddress}</div>
                    </div>
                  )}
                  {customer.businessDetails.businessType && (
                    <div className="p-3 bg-black/30 rounded-lg">
                      <div className="text-gray-400 text-xs sm:text-sm mb-0.5">Business Type</div>
                      <div className="text-white text-sm sm:text-base">
                        {customer.businessDetails.businessType
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;