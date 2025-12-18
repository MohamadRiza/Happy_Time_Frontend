// src/components/TrustSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TrustSection = () => {
  return (
    <section className="py-20 px-4 bg-black soft">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The <span className="text-gold">Happy Time</span> Promise
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Excellence, authenticity, and service — guaranteed.
          </p>
        </div>

        {/* Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 25+ Years Expertise */}
          <div className="bg-black border border-gray-800 rounded-xl p-8 text-center hover:border-gold transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <span className="text-gold text-2xl font-bold">25+</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Years of Expertise</h3>
            <p className="text-gray-400">
              Backed by over 25 years of horological knowledge and trusted by collectors across Sri Lanka.
            </p>
          </div>

          {/* Card 2: International Warranty */}
          <div className="bg-black border border-gray-800 rounded-xl p-8 text-center hover:border-gold transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">2-Year Warranty</h3>
            <p className="text-gray-400">
              Every timepiece comes with a 2-year international manufacturer warranty and authenticity certificate.
            </p>
          </div>

          {/* Card 3: Wholesale & Retail */}
          <div className="bg-black border border-gray-800 rounded-xl p-8 text-center hover:border-gold transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Wholesale & Retail</h3>
            <p className="text-gray-400">
              We serve both individual collectors and retail partners. Bulk inquiries welcome.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-4 text-gold hover:text-white font-medium"
            >
              Contact for Wholesale →
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Your Trusted Partner in Luxury Timekeeping
          </h3>
          <p className="text-gray-400 mb-6">
            From purchase to after-sales service, we stand by every watch we sell.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;