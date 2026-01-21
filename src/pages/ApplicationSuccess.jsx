// src/pages/ApplicationSuccess.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const ApplicationSuccess = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get application code from location state
  const applicationCode = location.state?.applicationCode || '';
  const applicantEmail = location.state?.applicantEmail || '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(applicationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToStatusCheck = () => {
    navigate('/application-status');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-3xl font-bold text-gold mb-6">Application Submitted Successfully!</h2>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Application Code</h3>
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 mb-4 inline-block">
            <code className="text-lg font-mono text-gold">{applicationCode}</code>
          </div>
          <p className="text-gray-400 mb-4 text-sm">
            Save this code! You'll need it to check your application status.
          </p>
          <button
            onClick={copyToClipboard}
            className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Thank you for your interest in Happy Time. Our HR team will review your application and contact you soon.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goToStatusCheck}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Check Application Status
          </button>
          <button
            onClick={() => navigate('/careers')}
            className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-gold/90 transition"
          >
            Back to Careers
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess;