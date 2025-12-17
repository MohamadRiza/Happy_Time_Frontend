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

  const socialClass =
    'w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-gold hover:border-gold hover:bg-black/40 hover:scale-110 transition-all duration-300';

  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Column 1: Brand Info */}
          <div>
            <img
              src="/logo.png"
              alt="Happy Time"
              className="h-10 mb-4"
            />

            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Sri Lanka’s premier luxury watch destination since 2014.
            </p>

            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex gap-2">
                <span>📍</span>
                <span>2nd Cross Street No 73, Pettah, Colombo, Sri Lanka</span>
              </div>
              <div>📞 +94 77 123 4567</div>
              <div>📞 +94 71 987 6543</div>
              <div>✉️ info@happytime.lk</div>
            </div>
          </div>

          {/* Column 2: Quick Links (CENTERED) */}
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold tracking-wide mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Empty (Future Use) */}
          <div />

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4">

              {/* TikTok */}
              <a
                href="https://tiktok.com/@happytime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={socialClass}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M16 3a5.7 5.7 0 0 0 4 4v3.2a8.9 8.9 0 0 1-4-1.1V16a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v3.2a2 2 0 1 0 2.1 2V3h2z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/happytime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialClass}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H16l-.5 3h-2.8v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/happytime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialClass}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 21h4V9H3v12zm7 0h4v-6.2c0-3.3 4-3.6 4 0V21h4v-7.5c0-6-6.5-5.8-8-2.8V9h-4v12z" />
                </svg>
              </a>

              {/* Instagram (OFFICIAL ICON) */}
              <a
                href="https://instagram.com/happytime"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialClass}
              >
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
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-white">Happy Time Pvt Ltd</span>. All Rights Reserved.
          </p>

          <p className="mt-2 text-gray-500">
            Trusted luxury watch retailer in Pettah, Colombo since 2014.
          </p>

          <div className="mt-3">
            Developed by{' '}
            <a
              href="https://www.nexasoft.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-white underline transition"
            >
              Nexasoft
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
