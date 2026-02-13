// src/components/GuestPrompt.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthType } from '../utils/auth';

const GuestPrompt = ({ children, featureName = "premium features" }) => {
  const authType = getAuthType();
  const [showPrompt, setShowPrompt] = useState(true); // controls overlay visibility

  // Only show prompt for guest users AND if not dismissed
  if (authType !== 'guest' || !showPrompt) {
    return <>{children}</>;
  }

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <>
      {children}

      {/* Guest Prompt Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-md transform transition-all duration-300 animate-fade-in-up">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Continue with Happy Time</h3>
                  <p className="text-gray-400 text-sm">Unlock exclusive benefits</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            <div className="text-center mb-6">
              <div className="inline-block mb-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping-slow"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Access {featureName}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sign in or create an account to unlock premium features, 
                track your orders, and enjoy personalized service.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-gold/20 hover:shadow-gold/30 flex items-center justify-center gap-2"
                onClick={handleDismiss}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Account
              </Link>

              <Link
                to="/register"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
                onClick={handleDismiss}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create New Account
              </Link>

              <button
                onClick={handleDismiss}
                className="w-full bg-transparent hover:bg-gray-800/50 text-gray-400 font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                Continue as Guest
              </button>
            </div>

            {/* Benefits List */}
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <h5 className="text-gray-400 text-xs uppercase tracking-wider mb-3 text-center">Premium Benefits</h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Order Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Wishlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Exclusive Offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Faster Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>
    </>
  );
};

export default GuestPrompt;