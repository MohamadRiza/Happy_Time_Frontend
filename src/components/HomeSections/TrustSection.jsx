// src/components/TrustSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TrustSection = () => {
  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Subtle ambient gold glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            The <span className="text-gold">Happy Time</span> Promise
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Excellence, authenticity, and service — guaranteed.
          </p>
        </div>

        {/* Trust Cards - 3D Floating Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 25+ Years Expertise */}
          <div className="group bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center 
                          hover:border-gold transition-all duration-500 transform hover:-translate-y-2
                          shadow-xl hover:shadow-gold/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6 relative">
              <span className="text-gold text-2xl font-bold">25+</span>
              {/* Inner shadow for depth */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]"></div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
              Years of Expertise
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Backed by over 25 years of horological knowledge and trusted by collectors across Sri Lanka.
            </p>
          </div>

          {/* Card 2: 7-Day Easy Returns */}
          <div className="group bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center 
                          hover:border-gold transition-all duration-500 transform hover:-translate-y-2
                          shadow-xl hover:shadow-gold/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]"></div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
              7-Day Easy Returns
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Not satisfied? Return any timepiece within 7 days for a full refund — no questions asked.
            </p>
          </div>

          {/* Card 3: Wholesale & Retail */}
          <div className="group bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center 
                          hover:border-gold transition-all duration-500 transform hover:-translate-y-2
                          shadow-xl hover:shadow-gold/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]"></div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
              Wholesale & Retail
            </h3>
            <p className="text-gray-400 leading-relaxed">
              We serve both individual collectors and retail partners. Bulk inquiries welcome.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-4 text-gold hover:text-white font-medium group-hover:gap-1 transition-all flex items-center"
            >
              Contact for Wholesale
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Your Trusted Partner in Luxury Timekeeping
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            From purchase to after-sales service, we stand by every watch we sell.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;