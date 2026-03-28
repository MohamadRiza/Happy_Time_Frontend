// src/components/GuestPrompt.jsx
import React, { useState, useEffect, useRef } from 'react';

const GuestPrompt = ({ children }) => {
  const [showOffer, setShowOffer] = useState(false);
  const [countdown, setCountdown] = useState(5); // seconds before auto-dismiss
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // Replace with your actual auth check
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const seen = sessionStorage.getItem('offerSeen');
    if (!isLoggedIn && !seen) {
      setShowOffer(true);
      sessionStorage.setItem('offerSeen', 'true');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!showOffer) return;

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto dismiss after 5 seconds
    timerRef.current = setTimeout(() => {
      setShowOffer(false);
    }, 5000);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [showOffer]);

  const handleClose = () => {
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    setShowOffer(false);
  };

  return (
    <>
      {children}

      {showOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-lg w-full mx-4 animate-fadeInScale">

            {/* Close button with countdown ring */}
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 z-10 bg-white text-black rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-gray-200 transition font-bold text-lg"
              aria-label="Close offer"
            >
              {/* SVG countdown ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset={100 - (countdown / 5) * 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="relative z-10 text-xs font-bold">{countdown}</span>
            </button>

            {/* Offer Image */}
            <img
              src="/Offer.webp"
              alt="Special Offer - Happy Time Watches"
              className="w-full rounded-2xl shadow-2xl"
            />

            {/* Progress bar at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-white"
                style={{
                  width: `${(countdown / 5) * 100}%`,
                  transition: 'width 1s linear',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestPrompt;