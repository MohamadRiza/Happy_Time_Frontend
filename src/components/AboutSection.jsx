import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Image with Gold Glow */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 gold-glow">
          {/* Soft gold aura */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gold/20 via-transparent to-gold/20 pointer-events-none"></div>

          <img
            src="./interior.jpg"
            alt="Happy Time Boutique - Luxury Watch Store in Colombo"
            className="w-full h-auto object-cover relative z-10"
            onError={(e) => {
              e.target.src = '/images/fallback-about.jpg';
            }}
          />

          {/* Gold accent bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gold z-20"></div>
        </div>

        {/* Text Content */}
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Crafted for <span className="text-gold">Connoisseurs</span>
          </h2>

          <div className="w-16 h-1 bg-gold mb-6"></div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Since <span className="text-gold font-semibold">1996</span>, 
            <span className="font-semibold"> Happy Time Pvt Ltd</span> has been Sri Lanka’s most trusted destination 
            for luxury timepieces. Located in the heart of Pettah, Colombo, we offer an exclusive collection of 
            Rolex, Patek Philippe, Audemars Piguet, and more — all authenticated, serviced, and presented with 
            white-glove care.
          </p>

          <p className="text-gray-400 mb-8">
            With nearly three decades of horological expertise, we don’t just sell watches — we share passion, 
            heritage, and timeless value.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center text-gold font-medium hover:text-white transition-colors"
          >
            <span>Discover Our Story</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="mt-8 flex items-center">
            <div className="bg-gold text-black font-bold px-4 py-2 rounded">
              25+ Years
            </div>
            <span className="ml-4 text-gray-400">
              Serving Sri Lankan Watch Enthusiasts
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
