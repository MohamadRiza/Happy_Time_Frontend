// src/components/MobileChatButton.jsx
import React, { useState } from 'react';

const MobileChatButton = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatToggle = () => {
    if (!isChatOpen) {
      setIsLoading(true);
      setIsChatOpen(true);
    } else {
      setIsChatOpen(false);
      setIsLoading(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Button - Only show on mobile when chat is closed */}
      {!isChatOpen && (
        <button
          onClick={handleChatToggle}
          className="lg:hidden fixed bottom-32 right-4 z-50 bg-gold hover:bg-gold/90 text-black rounded-full p-4 shadow-2xl shadow-gold/30 transition-all duration-300 transform hover:scale-110 active:scale-95 group opacity-90"
          aria-label="Open chat"
        >
          {/* Chat Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Optional: Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}

          {/* Pulse Animation Ring */}
          <span className="absolute inset-0 rounded-full bg-gold opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
        </button>
      )}

      {/* Chat Overlay Modal - Only show on mobile when open */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-slideUp">
          {/* Background Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleChatToggle}
          ></div>

          {/* Chat Container */}
          <div className="absolute inset-x-0 bottom-0 h-[calc(100vh-80px)] bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Header with Close Button */}
            <div className="bg-gold text-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Chat with us</h3>
                  <p className="text-xs text-black/70">We're online now</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleChatToggle}
                className="w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Content Area */}
            <div className="relative w-full h-[calc(100%-64px)] bg-gray-900">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                  {/* Animated Logo or Spinner */}
                  <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                    
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gold/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Loading Text */}
                  <p className="mt-4 text-gold font-semibold animate-pulse">
                    Loading chat...
                  </p>
                  
                  {/* Optional: Loading dots animation */}
                  <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}

              {/* Tawk.to Chat Iframe */}
              <iframe
                src="https://tawk.to/chat/697887dc47b101197ca6e840/1jfvd5dhq"
                className={`w-full h-full border-0 transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                title="Tawk.to Chat"
                allow="microphone; camera"
                onLoad={handleIframeLoad}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom bounce animation for loading dots */
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </>
  );
};

export default MobileChatButton;