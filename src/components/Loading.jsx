// src/components/Loading.jsx
import React from 'react';

const Loading = ({ message = "Loading...", size = "default" }) => {
  // Size classes
  const sizeClasses = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Watch-themed Loading Animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer watch bezel */}
        <div className="absolute inset-0 rounded-full border-4 border-gold/30"></div>
        
        {/* Inner watch face */}
        <div className="absolute inset-2 rounded-full bg-black/80 border-2 border-gray-700"></div>
        
        {/* Watch hands - rotating animation */}
        <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-gold transform -translate-x-1/2 -translate-y-1/2 origin-top animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2 origin-top animate-spin"></div>
        
        {/* Watch markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/60 rounded-full"
            style={{
              top: '10%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-40%)`
            }}
          ></div>
        ))}
        
        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gold rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Loading message */}
      <p className="text-gray-400 text-lg mt-6 font-medium">{message}</p>
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Loading;