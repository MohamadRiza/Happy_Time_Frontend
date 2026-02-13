// src/components/TopInfoBar.jsx
import React from "react";

const TopInfoBar = () => {
  return (
    <div className="bg-black/80 backdrop-blur-sm border-b border-gold/20 text-gold text-xs py-2.5 px-4 hidden sm:flex items-center overflow-hidden">
      {/* Contact Info Marquee */}
      <div className="flex items-center gap-6 whitespace-nowrap animate-marque">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <a 
            href="https://www.google.com/maps?q=49A+Keyzer+Street,+Pettah,+Colombo,+Sri+Lanka" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            49A Keyzer Street, Pettah, Colombo, Sri Lanka
          </a>
        </span>

        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.74 21 3 14.26 3 6V5z" />
          </svg>
          <a href="tel:+94763009123" className="hover:text-white transition-colors duration-200">+94 76 300 9123</a>
          <span className="mx-1">|</span>
          <a href="tel:+94755775565" className="hover:text-white transition-colors duration-200">+94 75 577 5565 </a>
        </span>

        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a 
            href="mailto:happytime143b@gmail.com" 
            className="hover:text-white transition-colors duration-200"
          >
            happytime143b@gmail.com
          </a>
        </span>
      </div>

      {/* Social Icons */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Facebook */}
        <a
          href="https://www.facebook.com/share/1FHVAaZFLz/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-200"
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 5.99 4.388 10.94 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.014 1.806-4.68 4.533-4.68 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.925-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.013 24 18.063 24 12.073z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/happy_time_pvt_ltd?igsh=MXdkcHV2bnFpenBjMw%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-200"
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

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@happytime_pvtltd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-200"
          aria-label="TikTok"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12.75 2h3.18c.24 1.5 1.02 2.88 2.22 3.96a7.7 7.7 0 0 0 3.85 1.74v3.22a11 11 0 0 1-3.85-.74v6.7a6.44 6.44 0 1 1-6.44-6.44c.3 0 .6.02.89.07v3.36a3.22 3.22 0 1 0 2.33 3.09V2z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com/@happytimepvt077?si=zN4VfnTDUnbyFRLG"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-200"
          aria-label="YouTube"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.507 3.545 12 3.545 12 3.545s-7.507 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.869.505 9.376.505 9.376.505s7.507 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TopInfoBar;