// src/components/TopInfoBar.jsx
import React from "react";

const TopInfoBar = () => {
  return (
    <div className="bg-black text-gold text-xs py-2 px-4 hidden sm:flex items-center overflow-hidden">
      
      {/* Moving Contact Info */}
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        <span>📍 2nd Cross Street No 123, Pettah, Colombo, Sri Lanka</span>
        <span>📞 +94 77 123 4567</span>
        <span>📞 +94 71 234 5678</span>
        <span>✉️ info@happytime.lk</span>
      </div>

      {/* Social Icons */}
      <div className="ml-auto flex items-center space-x-4">
        
        {/* TikTok */}
        <a
          href="https://tiktok.com/@happytime"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition duration-300"
          aria-label="TikTok"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12.75 2h3.18c.24 1.5 1.02 2.88 2.22 3.96a7.7 7.7 0 0 0 3.85 1.74v3.22a11 11 0 0 1-3.85-.74v6.7a6.44 6.44 0 1 1-6.44-6.44c.3 0 .6.02.89.07v3.36a3.22 3.22 0 1 0 2.33 3.09V2z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/happytime"
          className="hover:text-white transition duration-300"
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 5.99 4.388 10.94 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.014 1.806-4.68 4.533-4.68 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.925-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.013 24 18.063 24 12.073z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/happytime"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition duration-300"
          aria-label="Instagram"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
          >
            <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5C5.28 3.5 3.5 5.28 3.5 7.75v8.5c0 2.47 1.78 4.25 4.25 4.25h8.5c2.47 0 4.25-1.78 4.25-4.25v-8.5c0-2.47-1.78-4.25-4.25-4.25h-8.5z"/>
            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"/>
            <circle cx="17.25" cy="6.75" r="1"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TopInfoBar;
