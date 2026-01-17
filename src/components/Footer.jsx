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
    { name: 'ADMIN', path: '/admin/login' },
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

      {/* Mobile: solid black (no image) — already covered by bg-black on <footer> */}

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
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-gold">📍</span>
                <span>49A Keyzer Street, Pettah, Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold">📞</span>
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold">📞</span>
                <span>+94 71 987 6543</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold">✉️</span>
                <a href="mailto:info@happytime.lk" className="hover:text-gold transition-colors">
                  info@happytime.lk
                </a>
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
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                <span>Winsor – Wrist Watch</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                <span>Orix – Wrist Watch</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                <span>Arial – Wall Clock</span>
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
                { platform: 'TikTok', url: 'https://tiktok.com/@happytime', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M16 3a5.7 5.7 0 0 0 4 4v3.2 a8.9 8.9 0 0 1-4-1.1V16a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v3.2a2 2 0 1 0 2.1 2V3h2z" />
                  </svg>
                )},
                { platform: 'Facebook', url: 'https://facebook.com/happytime', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H16l-.5 3h-2.8v7A10 10 0 0 0 22 12z" />
                  </svg>
                )},
                { platform: 'LinkedIn', url: 'https://linkedin.com/company/happytime', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 21h4V9H3v12zm7 0h4v-6.2c0-3.3 4-3.6 4 0V21h4v-7.5c0-6-6.5-5.8-8-2.8V9h-4v12z" />
                  </svg>
                )},
                { platform: 'Instagram', url: 'https://instagram.com/happytime', icon: (
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
                  href={url.trim()}
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

        {/* Bottom Divider */}
        <div className="border-t border-gray-800/70 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-white font-medium">Happy Time Pvt Ltd</span>. All Rights Reserved.
          </p>

          <p className="mt-2 text-gray-600 text-sm max-w-2xl mx-auto">
            Trusted luxury watch retailer in Pettah, Colombo since 1996.
          </p>

          <div className="mt-4">
            <p className="text-gray-600 text-sm">
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