// src/pages/ApplicationStatusCheck.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplicationStatusCheck = () => {
  const [formData, setFormData] = useState({
    applicationCode: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.applicationCode.trim() || !formData.email.trim()) {
      toast.error('Please enter both application code and email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/applications/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationCode: formData.applicationCode.trim(),
          email: formData.email.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setApplication(data.data);
        toast.success('Application found!');
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Status check error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-900/30 text-yellow-300',
      reviewing: 'bg-blue-900/30 text-blue-300',
      shortlisted: 'bg-green-900/30 text-green-300',
      rejected: 'bg-red-900/30 text-red-300',
      hired: 'bg-purple-900/30 text-purple-300'
    };
    return badges[status] || 'bg-gray-800 text-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Check Application Status</h1>
          <p className="text-gray-400">
            Enter your application code and email to check your application status
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          {!application ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-400 text-center">{error}</p>}
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Application Code *</label>
                <input
                  type="text"
                  name="applicationCode"
                  value={formData.applicationCode}
                  onChange={handleChange}
                  placeholder="HT-XXXXXX-XXXXXX"
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Format: HT-XXXXXXXX-XXXXXX (case insensitive)
                </p>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-gold/90 transition disabled:opacity-70"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Application Status</h2>
                <p className="text-gray-400">Application Code: {application.applicationCode}</p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-gray-400 text-sm">Applicant</span>
                    <p className="text-white font-medium">{application.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Position</span>
                    <p className="text-white font-medium">{application.positionTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Email</span>
                    <p className="text-white font-medium">{application.applicantEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-400">Submitted</span>
                      <p className="text-white">{formatDate(application.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Updated</span>
                      <p className="text-white">{formatDate(application.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setApplication(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Check Another Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusCheck;