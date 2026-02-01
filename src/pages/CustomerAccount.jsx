// src/pages/CustomerAccount.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomerToken,
  getCustomer,
  customerLogout,
  customerLogin,
} from "../utils/auth";
import Loading from "../components/Loading";

const CustomerAccount = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    address: "",
    businessDetails: {
      sellsWatches: false,
      hasWatchShop: false,
      shopName: "",
      shopAddress: "",
      businessType: "",
    },
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  const linktocontact = () => {
    navigate("/contact");
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/customers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCustomer(data.data);
          setEditForm({
            fullName: data.data.fullName || "",
            email: data.data.email || "",
            mobileNumber: data.data.mobileNumber || "",
            city: data.data.city || "",
            address: data.data.address || "",
            businessDetails: data.data.businessDetails || {
              sellsWatches: false,
              hasWatchShop: false,
              shopName: "",
              shopAddress: "",
              businessType: "",
            },
          });
        } else {
          throw new Error(data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load profile. Please login again.");
        customerLogout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    customerLogout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("businessDetails.")) {
      const field = name.split(".")[1];
      setEditForm((prev) => ({
        ...prev,
        businessDetails: {
          ...prev.businessDetails,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setUpdateMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage("");
    try {
      const token = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const updateData = {
        fullName: editForm.fullName,
        email: editForm.email,
        mobileNumber: editForm.mobileNumber,
        city: editForm.city,
        address: editForm.address,
        businessDetails: editForm.businessDetails,
      };
      const res = await fetch(`${API_URL}/api/customers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (data.success) {
        const updatedCustomer = { ...customer, ...data.data };
        setCustomer(updatedCustomer);
        customerLogin(token, updatedCustomer);
        setUpdateMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setUpdateMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setUpdateMessage("Network error. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading message="Loading your account..." size="large" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/10 to-red-900/10 rounded-full flex items-center justify-center border-2 border-red-500/20">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Session Expired
          </h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gold text-black px-8 py-3 rounded-xl font-semibold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Hero Header Section */}
        <div className="mb-12">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Professional Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-700">
                    <span className="text-2xl sm:text-3xl font-bold text-black">
                      {getInitials(customer?.fullName) || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gold">
                      My Account
                    </h1>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Welcome back,{" "}
                    <span className="text-gold font-semibold">
                      {customer?.fullName?.split(" ")[0]}
                    </span>
                    ! ✨
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Manage your profile and preferences
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl font-medium transition-all border border-gray-700 hover:border-gold"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>My Orders</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-900/40 hover:bg-red-900/60 text-red-300 px-5 py-3 rounded-xl font-medium transition-all border border-red-800/50 hover:border-red-600"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div
            className={`mb-8 p-5 rounded-2xl backdrop-blur-xl border-2 shadow-lg ${
              updateMessage.includes("successfully")
                ? "bg-green-900/20 border-green-500/30 text-green-300"
                : "bg-red-900/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {updateMessage.includes("successfully") ? (
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span className="font-medium">{updateMessage}</span>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Card Header */}
          <div className="bg-gray-800/50 px-6 sm:px-8 py-6 border-b border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Personal Information
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Your account details and preferences
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-gold/20"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-red-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="Enter your full name"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-red-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="your.email@example.com"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={editForm.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="+94 71 234 5678"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 mb-2 text-sm font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition resize-none"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="pt-8 border-t border-gray-800/50">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                      <svg
                        className="w-6 h-6 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Business Information
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Tell us about your watch business
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-black/20 rounded-xl p-5 border border-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <label className="text-gray-300 font-medium">
                            Do you sell watches?
                          </label>
                        </div>
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
                    </div>

                    {editForm.businessDetails.sellsWatches && (
                      <div className="space-y-6">
                        <div className="bg-black/20 rounded-xl p-5 border border-gray-800/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-gold"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <label className="text-gray-300 font-medium">
                                Do you have a watch shop?
                              </label>
                            </div>
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
                        </div>

                        {editForm.businessDetails.hasWatchShop && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm font-medium">
                                Shop Name
                              </label>
                              <input
                                type="text"
                                name="businessDetails.shopName"
                                value={editForm.businessDetails.shopName}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition"
                                placeholder="Your shop name"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-gray-400 mb-2 text-sm font-medium">
                                Shop Address
                              </label>
                              <textarea
                                name="businessDetails.shopAddress"
                                value={editForm.businessDetails.shopAddress}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold transition resize-none"
                                placeholder="Shop location and address"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-400 mb-2 text-sm font-medium">
                            Business Type
                          </label>
                          <div className="relative">
                            <select
                              name="businessDetails.businessType"
                              value={editForm.businessDetails.businessType}
                              onChange={handleInputChange}
                              className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-gold transition appearance-none"
                            >
                              <option value="" className="bg-gray-900">
                                Select business type
                              </option>
                              <option value="retail" className="bg-gray-900">
                                Retail Store
                              </option>
                              <option value="wholesale" className="bg-gray-900">
                                Wholesale Dealer
                              </option>
                              <option
                                value="independent_watchmaker"
                                className="bg-gray-900"
                              >
                                Independent Watchmaker
                              </option>
                              <option value="collector" className="bg-gray-900">
                                Watch Collector
                              </option>
                              <option value="other" className="bg-gray-900">
                                Other
                              </option>
                            </select>
                            <svg
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 bg-gold hover:bg-gold/90 text-black py-4 rounded-xl font-bold transition-all shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving Changes...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-all border border-gray-700 hover:border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Full Name",
                      value: customer?.fullName,
                      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                    },
                    {
                      label: "Username",
                      value: customer?.username,
                      icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Email",
                      value: customer?.email || "Not provided",
                      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    },
                    {
                      label: "Mobile Number",
                      value: customer?.mobileNumber,
                      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                    },
                    {
                      label: "Date of Birth",
                      value: customer?.dob
                        ? new Date(customer.dob).toLocaleDateString()
                        : "N/A",
                      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                    },
                    {
                      label: "Country",
                      value: customer?.country,
                      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Province",
                      value: customer?.province,
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                    },
                  ].map((field, index) => (
                    <div
                      key={index}
                      className="bg-black/20 rounded-xl p-5 border border-gray-800/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={field.icon}
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <label className="text-gray-500 text-sm font-medium block mb-1">
                            {field.label}
                          </label>
                          <p className="text-white text-lg font-medium">
                            {field.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {customer?.city && (
                    <div className="bg-black/20 rounded-xl p-5 border border-gray-800/50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg">
                          <svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <label className="text-gray-500 text-sm font-medium block mb-1">
                            City
                          </label>
                          <p className="text-white text-lg font-medium">
                            {customer.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {customer?.address && (
                    <div className="md:col-span-2 bg-black/20 rounded-xl p-5 border border-gray-800/50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <label className="text-gray-500 text-sm font-medium block mb-1">
                            Address
                          </label>
                          <p className="text-white text-lg font-medium leading-relaxed">
                            {customer.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Business Details - Read Only View */}
        {!isEditing && customer?.businessDetails && (
          <div className="mt-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-gray-800/50 px-6 sm:px-8 py-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Business Information
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Your business profile and details
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="space-y-4">
                {[
                  {
                    label: "Sells Watches",
                    value: customer.businessDetails.sellsWatches ? "Yes" : "No",
                    highlight: customer.businessDetails.sellsWatches,
                  },
                  customer.businessDetails.sellsWatches && {
                    label: "Has Watch Shop",
                    value: customer.businessDetails.hasWatchShop ? "Yes" : "No",
                    highlight: customer.businessDetails.hasWatchShop,
                  },
                  customer.businessDetails.hasWatchShop &&
                    customer.businessDetails.shopName && {
                      label: "Shop Name",
                      value: customer.businessDetails.shopName,
                    },
                  customer.businessDetails.hasWatchShop &&
                    customer.businessDetails.shopAddress && {
                      label: "Shop Address",
                      value: customer.businessDetails.shopAddress,
                    },
                  customer.businessDetails.businessType && {
                    label: "Business Type",
                    value: customer.businessDetails.businessType
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" "),
                  },
                ]
                  .filter(Boolean)
                  .map((field, index) => (
                    <div
                      key={index}
                      className="bg-black/20 rounded-xl p-5 border border-gray-800/50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">
                          {field.highlight && (
                            <span className="w-2 h-2 bg-gold rounded-full mr-2 inline-block"></span>
                          )}
                          {field.label}
                        </span>
                        <span
                          className={`font-semibold ${field.highlight ? "text-gold" : "text-white"}`}
                        >
                          {field.value}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support / Help Card */}
      <div className="mt-8 mb-8 max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gray-800/60 px-6 py-3 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-gold">🙂</span>
            Need Help?
          </h2>
          <p className="text-gray-400 text-xs">
            Get in touch with our support team
          </p>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 bg-black/30 border border-gray-800/50 rounded-lg px-4 py-3">
            <div className="p-2 bg-gold/10 rounded-md flex-shrink-0">
              <svg
                className="w-4 h-4 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <a
                href="mailto:happy@itteam.com"
                className="text-gold text-sm font-medium hover:text-gold/80 transition"
              >
                happy@itteam.com
              </a>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 bg-black/30 border border-gray-800/50 rounded-lg px-4 py-3">
            <div className="p-2 bg-gold/10 rounded-md flex-shrink-0">
              <svg
                className="w-4 h-4 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Mobile</p>
              <a
                href="tel:0123456789"
                className="text-gold text-sm font-medium hover:text-gold/80 transition"
              >
                0123456789
              </a>
            </div>
          </div>
          <button
                  onClick={linktocontact}
                  className="bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-gold/20"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Contact Support
                  </div>
                </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
