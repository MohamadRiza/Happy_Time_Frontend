// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  // ✅ Updated Locations with Google Maps links
  const locations = [
    {
      name: 'Colombo – Head Office',
      address: '49A Keyzer Street, Pettah, Colombo, Sri Lanka',
      mapUrl: 'https://www.google.com/maps?ll=6.9369,79.851087&z=16&t=m&hl=en-US&gl=US&mapclient=embed&cid=7268797266332012530'
    },
    {
      name: 'Dubai – UAE Branch',
      address: 'Business Bay, Dubai, United Arab Emirates',
      mapUrl: 'https://www.google.com/maps?ll=25.269188,55.297272&z=16&t=m&hl=en&gl=LK&mapclient=embed&q=25%C2%B016%2709.1%22N+55%C2%B017%2759.5%22E+25.269194,+55.299861@25.2691944,55.29986109999999'
    },
    {
      name: 'Kandy (KCC) – Winsor Brand',
      address: 'Level 3, Kandy City Center, Kandy, Sri Lanka',
      mapUrl: 'https://maps.app.goo.gl/ZHh8w9NojuM97WHm9'
    }
  ];

  const socialClass =
    'w-11 h-11 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-gold hover:border-gold hover:bg-black/30 transition-all duration-300 group';

  return (
    <footer className="relative bg-black text-gray-400 pt-16 pb-8 px-4 overflow-hidden">
      {/* Desktop+ background image with overlay */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/watchFTR.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/90"></div>
      </div>

      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-14">
          
          {/* Column 1: Brand & Contact */}
          <div>
            <img
              src="/Logo_ORG.png"
              alt="Happy Time"
              className="h-14 mb-5"
            />
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-gray-500">
              Sri Lanka’s premier luxury watch destination since 1996.
            </p>
            <div className="space-y-4 text-sm">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-gold hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Our Main Branches</p>
                  {locations.map((loc, idx) => (
                    <a
                      key={idx}
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-gold transition-colors mt-1 first:mt-0"
                    >
                      {loc.name}
                    </a>
                  ))}
                </div>
              </div>

              
              {/* Phone */}
              <div className='space-y-4 text-sm'>
                {/* ✅ ADDED: Brand logo next to Contact Us heading */}
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src="/Logo_ORG.png" 
                    alt="Happy Time" 
                    className="h-5 w-auto opacity-90" 
                  />
                  <Link to="/about" className="text-white font-medium hover:text-gold transition-colors ">Contact Us</Link>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gold hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.74 21 3 14.26 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <a href="tel:+94755775565" className="block hover:text-gold transition-colors">+94 75 577 5565</a>
                    <a href="tel:+94757575565" className="block hover:text-gold transition-colors mt-1">+94 75 757 5565</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="text-gold hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:happytime143b@gmail.com" className="hover:text-gold transition-colors">
                    happytime143b@gmail.com
                  </a>
                </div>
              </div>
          </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide mb-5 pb-2 border-b border-gray-800/60">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="inline-block py-1 text-sm text-gray-400 hover:text-gold transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Brands */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide mb-5 pb-2 border-b border-gray-800/60">
              Our Brands
            </h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-2 h-2 bg-gold rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Winsor</p>
                    <p className="text-gray-400 text-sm">Premium wrist watches for discerning collectors</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-2 h-2 bg-gold rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Orix</p>
                    <p className="text-gray-400 text-sm">Elegant timepieces blending tradition and innovation</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-2 h-2 bg-gold rounded-full"></div>
                  <div>
                    <p className="font-medium text-white">Arial</p>
                    <p className="text-gray-400 text-sm">Luxury wall clocks for home and office</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide mb-5 pb-2 border-b border-gray-800/60">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {[
                { platform: 'TikTok', url: 'https://www.tiktok.com/@happytime_pvtltd?_r=1&_t=ZS-93nVkM8WbJY', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M16 3a5.7 5.7 0 0 0 4 4v3.2 a8.9 8.9 0 0 1-4-1.1V16a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v3.2a2 2 0 1 0 2.1 2V3h2z" />
                  </svg>
                )},
                { platform: 'Facebook', url: 'https://facebook.com/happy-time-time-pvt-ltd', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H16l-.5 3h-2.8v7A10 10 0 0 0 22 12z" />
                  </svg>
                )},
                { platform: 'Youtube', url: 'https://youtube.com/@happytimepvt077?si=zN4VfnTDUnbyFRLG', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.507 3.545 12 3.545 12 3.545s-7.507 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.869.505 9.376.505 9.376.505s7.507 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )},
                { platform: 'Instagram', url: 'https://www.instagram.com/happy_time_pvt_ltd?igsh=MXdkcHV2bnFpenBjMw%3D%3D&utm_source=qr', icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="17.5" cy="6.5" r="0.9" />
                  </svg>
                )}
              ].map(({ platform, url, icon }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className={socialClass}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Dividerr */}
        <div className="border-t border-gray-800/70 pt-8 pb-11 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-white font-medium"><Link to="/admin/login">Happy Time Pvt Ltd</Link></span>. All Rights Reserved.
          </p> 

          <p className="mt-2 text-gray-400 text-sm max-w-2xl mx-auto">
            A trusted luxury watch retailer and wholesaler in Sri Lanka and the UAE since 1996. TESting
          </p>

          <div className="mt-4">
            <p className="text-gray-400 text-sm">
              Developed with precision by{' '}
              <a
                href="https://www.nexasoft.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gold hover:text-white font-medium transition"
              >
                Nexasoft
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;