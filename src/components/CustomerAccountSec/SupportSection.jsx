// src/components/CustomerAccountSec/SupportSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SupportSection = () => {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5v2m6.5-.5l-.5.5m-6-6l-.5-.5m3.5 9.5H15m0-12H9m6 12h2m-2-4h2" />
        </svg>
        <span className="text-sm sm:text-base lg:text-xl">Need Help?</span>
      </h2>
      
      <div className="space-y-2 sm:space-y-3">
        {/* Email Contact */}
        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
          <div className="p-2 bg-gold/10 rounded-md flex-shrink-0">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-gray-400 text-xs sm:text-sm">Email</div>
            <a 
              href="mailto:happy@itteam.com" 
              className="text-gold hover:text-yellow-300 text-sm sm:text-base break-all transition"
            >
              happy@itteam.com
            </a>
          </div>
        </div>
        
        {/* Phone Contact */}
        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
          <div className="p-2 bg-gold/10 rounded-md flex-shrink-0">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-gray-400 text-xs sm:text-sm">Phone</div>
            <a 
              href="tel:+94112441800" 
              className="text-gold hover:text-yellow-300 text-sm sm:text-base transition"
            >
              +94 11 244 1800
            </a>
          </div>
        </div>
        
        {/* Contact Support Button */}
        <Link
          to="/contact"
          className="block w-full text-center bg-gold hover:bg-gold/90 text-black py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base active:scale-[0.98]"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default SupportSection;