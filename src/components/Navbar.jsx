import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = ["Home", "Shop", "About", "Careers", "Contact", "Login"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-black text-white sticky top-0 z-50 relative">
      {/* Gold lighting effect - subtle gradient shadow */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      
      {/* Main navbar content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Happy Time Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="leading-tight">
              <p className="glass-gold-text font-semibold text-lg tracking-wide">
                Happy Time
              </p>
              <p className="text-gray-400 text-xs tracking-widest">
                PVT LTD
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {menuItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;

              return (
                <Link
                  key={item}
                  to={path}
                  className={`relative text-sm tracking-wide transition-colors ${
                    isActive
                      ? "text-gold font-semibold"
                      : "text-gray-300 hover:text-gold"
                  }`}
                >
                  {item}
                  {/* Underline for active or hover */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-gold transition-all ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-gold transition"
            aria-label="Toggle menu"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-6 py-4 space-y-3">
            {menuItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;

              return (
                <Link
                  key={item}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-base transition ${
                    isActive
                      ? "text-gold font-semibold border-b-2 border-gold pb-1"
                      : "text-gray-300 hover:text-gold"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;