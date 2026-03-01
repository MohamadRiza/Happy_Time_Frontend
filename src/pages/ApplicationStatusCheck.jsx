// src/pages/ApplicationStatusCheck.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

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
      pending: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50',
      reviewing: 'bg-blue-900/30 text-blue-300 border border-blue-800/50',
      shortlisted: 'bg-green-900/30 text-green-300 border border-green-800/50',
      rejected: 'bg-red-900/30 text-red-300 border border-red-800/50',
      hired: 'bg-purple-900/30 text-purple-300 border border-purple-800/50'
    };
    return badges[status] || 'bg-gray-800 text-gray-300 border border-gray-700';
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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
      case 'reviewing':
        return "Your application is currently under review. Our HR team will contact you soon if shortlisted. Thank you for your interest in Happy Time!";
      
      case 'shortlisted':
        return "Congratulations! Your application has been shortlisted. Our HR team will contact you shortly with interview details. Best of luck!";
      
      case 'hired':
        return "🎉 Congratulations! You've been selected for the position. If you haven't received a call or email from our HR team within 3 business days, please contact us at careers@happytime.lk with your application code.";
      
      case 'rejected':
        return "We sincerely appreciate your interest in Happy Time. After careful consideration, we regret to inform you that your application was not successful this time. We encourage you to apply for future opportunities.";
      
      default:
        return "Your application is being processed. Thank you for your patience.";
    }
  };

  return ( 
    <div className="relative min-h-screen text-white overflow-hidden">
      
      <Helmet>
  <title>Check Application Status – Happy Time</title>
  <meta name="description" content="Track your job application status with Happy Time. Enter your application code and email to see if you've been shortlisted, hired, or receive updates." />
  <meta name="keywords" content="job application status, Happy Time careers, track application, hiring status" />
  <link rel="canonical" href="https://happytimeonline.com/application-status" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://happytimeonline.com/application-status" />
  <meta property="og:title" content="Check Application Status – Happy Time" />
  <meta property="og:description" content="Track your job application status with Happy Time. Enter your application code and email to see updates." />
  <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Check Application Status – Happy Time" />
  <meta name="twitter:description" content="Track your job application status with Happy Time." />
  <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
</Helmet>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-700/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme='dark'/>
      
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Track Your <span className="text-gold">Application</span>
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full mb-3"></div>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Enter your details below to check the status of your job application with Happy Time Pvt Ltd.
          </p>
        </div>

        <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 shadow-xl">
          {!application ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-red-900/20 text-red-400 px-3 py-2 rounded-lg border border-red-800/50 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Application Code *</label>
                <input
                  type="text"
                  name="applicationCode"
                  value={formData.applicationCode}
                  onChange={handleChange}
                  placeholder="HT-XXXXXX-XXXXXX"
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  Found in your application confirmation email
                </p>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-black px-6 py-3 rounded-xl font-bold text-base tracking-wide hover:bg-gold/90 transition-all duration-300 shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </span>
                ) : 'Check Application Status'}
              </button>
              <button
                  onClick={() => navigate('/careers')}
                  className="flex-1 inline-flex items-center justify-center bg-gray-800 text-gold hover:bg-gray-700 text-sm font-medium border border-gray-700 rounded-lg py-2 hover:border-gold/60 transition px-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 0l-7 7 7 7" />
                  </svg>
                  Back to Careers
                </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Application Status</h2>
                <p className="text-gray-400 text-sm">
                  Application Code: <span className="font-mono bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/30">{application.applicationCode}</span>
                </p>
              </div>
              
              {/* Status Message */}
              <div className={`bg-gray-800/40 border rounded-xl p-5 ${
                application.status === 'hired' ? 'border-green-500/30' :
                application.status === 'shortlisted' ? 'border-green-500/30' :
                application.status === 'rejected' ? 'border-red-500/30' :
                'border-gold/20'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${
                    application.status === 'hired' ? 'bg-green-400' :
                    application.status === 'shortlisted' ? 'bg-green-400' :
                    application.status === 'rejected' ? 'bg-red-400' :
                    application.status === 'reviewing' ? 'bg-blue-400' :
                    'bg-gold'
                  }`}></div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {getStatusMessage(application.status)}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-gray-800/40 border border-gray-800/50 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Applicant</span>
                    <p className="text-white font-medium text-base">{application.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Position Applied</span>
                    <p className="text-white font-medium text-base">{application.positionTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Email</span>
                    <p className="text-white text-sm">{application.applicantEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Current Status</span>
                    <div className="mt-1">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusBadge(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-800/50 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Submitted On</span>
                      <p className="text-white font-medium">{formatDate(application.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Last Updated</span>
                      <p className="text-white font-medium">{formatDate(application.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={() => setApplication(null)}
                  className="flex-1 inline-flex items-center justify-center text-gold hover:text-yellow-300 text-sm font-medium border border-gray-700 rounded-lg py-2 hover:border-gold/60 hover:bg-gold/10 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Check Another Application
                </button>
                <button
                  onClick={() => navigate('/careers')}
                  className="flex-1 inline-flex items-center justify-center bg-gray-800 text-gold hover:bg-gray-700 text-sm font-medium border border-gray-700 rounded-lg py-2 hover:border-gold/60 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 0l-7 7 7 7" />
                  </svg>
                  Back to Careers
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Need help? Contact our HR team at <a href="mailto:careers@happytime.lk" className="text-gold hover:underline">careers@happytime.lk</a></p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusCheck;