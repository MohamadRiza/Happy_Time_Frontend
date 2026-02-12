// src/pages/AboutPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const branches = [
  {
    id: 1,
    name: 'Colombo – Head Office Sri Lanka',
    address: 'No 49A, Keyzer Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 76 300 9123',
    image: './inside.jpg',
    mapLink: 'https://www.google.com/maps?q=Happy+Time+(Pvt)+Ltd,+Pettah,+Colombo&output=embed',
  },
  {
    id: 2,
    name: 'Online Branch - Pettah 143',
    address: 'No 143, 2nd Cross Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 75 757 5565',
    image: './143_OnlineBranch.jpeg',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.608471754673!2d79.84937707499664!3d6.937308993062671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTQuMyJOIDc5wrA1MScwNy4wIkU!5e0!3m2!1sen!2slk!4v1767424589827!5m2!1sen!2slk',
  },
  {
    id: 3,
    name: '84 Branch - Wholesale',
    address: 'No 84, 2nd Cross Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 75 577 5565',
    image: './2nd_CS_86.jpeg',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.6176388086064!2d79.84965107499666!3d6.936218993063737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTAuNCJOIDc5wrA1MScwOC4wIkU!5e0!3m2!1sen!2slk!4v1767424754590!5m2!1sen!2slk',
  },
  {
    id: 4,
    name: 'Kandy Branch',
    address: 'No 57, Yatinuwara Lane (Alimudukkuwa), Kandy, Sri Lanka',
    phone: '+94 77 345 2456',
    image: 'interior.jpg',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3957.5350371179384!2d80.633076075!3d7.2936209927139055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTcnMzcuMCJOIDgwwrAzOCcwOC4zIkU!5e0!3m2!1sen!2slk!4v1767424839096!5m2!1sen!2slk',
  },
  {
    id: 5,
    name: 'Kandy City Center Branch (KCC) - Winsor (Retail)',
    address: 'Level 3, Kandy City Center, No 01, Kandy, Sri Lanka',
    phone: '+94 77 977 9666',
    image: '/KCC.webp',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5477352274393!2d80.63232717026546!3d7.292184497679624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662be0e19fad%3A0xfc32bb846bc0d50a!2sKandy%20City%20Centre%2C%20Kandy!5e0!3m2!1sen!2slk!4v1767424917683!5m2!1sen!2slk',
  },
  {
    id: 6,
    name: 'Dubai – UAE Branch',
    address: 'No. 102, Al-Buteen (Opposite of Dubai Wholesale Plaza), Murshid Bazar, Deira, Dubai, UAE',
    phone: '+971 58 667 7143',
    image: './DubaiBranch1.jpeg',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3608.041541217658!2d55.29727207538427!3d25.269187977664714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE2JzA5LjEiTiA1NcKwMTcnNTkuNSJF!5e0!3m2!1sen!2slk!4v1767425006177!5m2!1sen!2slk',
  },
];

const AboutPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      
      {/* HERO */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <img
          src="/watchFTR.jpg"
          alt="Happy Time Luxury Watches"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-wide bg-gradient-to-t from-white/40 via-gold to-gold/50 text-transparent bg-clip-text">
            Our Legacy
          </h1>
          <p className="max-w-2xl text-gray-300 text-lg md:text-xl">
            Precision • Trust • Timeless Craftsmanship
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

        {/* INTRODUCTION */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sri Lanka's Trusted <span className="text-gold">Watch Destination</span>
              </h2>
              <div className="w-16 h-1 bg-gold mb-6" />
              <p className="text-gray-300 mb-6 leading-relaxed">
                Happy Time Pvt Ltd is a growing watch distribution and retail company serving 
                customers across <span className="text-gold font-semibold">Sri Lanka and abroad</span>, 
                including the UAE. Over the years, we have built our business through dedication, 
                hard work, and strong customer relationships.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                We supply watches for both wholesale and retail markets and proudly manage our own 
                brands - <span className="text-gold">Winsor and Orix</span> for wrist watches, and 
                <span className="text-gold"> Arial</span> for wall clocks. Our goal is to offer 
                timepieces that combine good design, quality, and affordable pricing.
              </p>
              <p className="text-gray-400 leading-relaxed">
                At Happy Time, we believe business is not only about selling products - it is about 
                building trust, creating long-term partnerships, and delivering value every single day.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-gray-800 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-gold/5 transition-opacity duration-300 group-hover:from-gold/20 group-hover:to-gold/10" />
              <img
                src="/DubaiBranch1.jpeg"
                alt="Happy Time Boutique"
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="bg-gold/10 p-3 rounded-xl mr-4 group-hover:bg-gold/20 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gold">Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                At Happy Time, our vision is simple - to become a trusted name in every home when 
                it comes to watches. We want our brand to represent reliability, style, and value, 
                not just in Sri Lanka but internationally as well. We believe time is important in 
                everyone's life, and we want to be part of those everyday moments.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="bg-gold/10 p-3 rounded-xl mr-4 group-hover:bg-gold/20 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gold">Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-base mb-4">
                Our mission is to provide quality watches at the right price while building strong 
                and honest relationships with our customers, dealers, and partners.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                We focus on: supplying stylish and durable watches, supporting both wholesale and 
                retail customers, growing our own brands like Winsor, Orix, and Arial, and expanding 
                step by step into new markets. We are committed to service, trust, and long-term success.
              </p>
            </div>
          </div>
        </section>

        {/* OUR BRANDS */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gold">
            Our Exclusive Brands
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Winsor */}
            <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group hover:scale-105">
              <div className="flex justify-center mb-6 h-32 items-center">
                <img
                  src="/winsor.png"
                  alt="Winsor Logo"
                  className="h-24 w-auto object-contain filter rounded-lg transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = 'WINSOR';
                    span.className = 'text-white text-3xl font-bold tracking-wider';
                    e.target.parentNode.appendChild(span);
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">Winsor</h3>
                <h4 className="text-gold font-semibold mb-4 text-sm">Classic Wrist Watches</h4>
                <div className="w-12 h-0.5 bg-gold/30 mx-auto mb-4"></div>
                <p className="text-gray-300 leading-relaxed text-sm text-justify">
                  Winsor embodies timeless elegance and traditional craftsmanship. 
                  Inspired by vintage horology, each piece combines heritage design 
                  elements with modern functionality for the discerning collector who 
                  appreciates classic sophistication.
                </p>
              </div>
            </div>

            {/* Orix */}
            <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group hover:scale-105">
              <div className="flex justify-center mb-6 h-32 items-center">
                <img
                  src="/OrixBrand.webp"
                  alt="Orix Logo"
                  className="h-24 w-auto object-contain filter rounded-lg transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = 'ORIX';
                    span.className = 'text-white text-3xl font-bold tracking-wider';
                    e.target.parentNode.appendChild(span);
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">Orix</h3>
                <h4 className="text-gold font-semibold mb-4 text-sm">Precision Wrist Watches</h4>
                <div className="w-12 h-0.5 bg-gold/30 mx-auto mb-4"></div>
                <p className="text-gray-300 leading-relaxed text-sm text-justify">
                  Orix represents the perfect fusion of precision engineering 
                  and contemporary design. Each timepiece is crafted for the modern 
                  professional who demands accuracy, reliability, and sophisticated style 
                  in their everyday life.
                </p>
              </div>
            </div>

            {/* Arial */}
            <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group hover:scale-105">
              <div className="flex justify-center mb-6 h-32 items-center">
                <img
                  src="/ArielBrand.webp"
                  alt="Arial Logo"
                  className="h-24 w-auto object-contain filter rounded-lg transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = 'ARIAL';
                    span.className = 'text-white text-3xl font-bold tracking-wider';
                    e.target.parentNode.appendChild(span);
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">Arial</h3>
                <h4 className="text-gold font-semibold mb-4 text-sm">Wall Clocks</h4>
                <div className="w-12 h-0.5 bg-gold/30 mx-auto mb-4"></div>
                <p className="text-gray-300 leading-relaxed text-sm text-justify">
                  Arial brings elegance and precision to your living spaces with our 
                  premium wall clock collection. Combining functional design with 
                  artistic craftsmanship, each piece serves as both a timekeeper and 
                  a statement of style for your home or office.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BRANCHES */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Visit Our Locations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch);
                  setMapLoaded(false);
                }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 group text-left"
              >
                <div className="h-48 overflow-hidden">
                  {branch.image ? (
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-gray-600 text-4xl">🏢</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gold mb-3 group-hover:text-yellow-300 transition-colors">
                    {branch.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <div className="text-gold mr-2 mt-0.5 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-400">{branch.address}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-gold mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-500">{branch.phone}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-gold text-sm font-medium flex items-center justify-center">
                    View on Map
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* MODAL FOR MAP */}
        {selectedBranch && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
              <button
                onClick={() => setSelectedBranch(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gold text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Close map"
              >
                ×
              </button>
              <h3 className="text-xl md:text-2xl font-bold text-gold mb-4 text-center">
                {selectedBranch.name}
              </h3>
              <div className="w-full h-[70vh] md:h-[60vh] relative rounded-xl overflow-hidden border border-gray-800">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                    <div className="text-white flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent mb-2"></div>
                      <span>Loading map...</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={selectedBranch.mapLink}
                  width="100%"
                  height="100%"
                  className="relative z-10"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                  title={selectedBranch.name}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="text-center">
          <Link
            to="/contact"
            className="inline-block bg-gold text-black font-bold px-12 py-4 rounded-xl hover:bg-gold/90 transition-all duration-300 text-lg"
          >
            Book Your Appointment
          </Link>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;