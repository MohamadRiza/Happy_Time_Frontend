// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getToken,
  getCustomer,
  getCustomerToken,
  customerLogout,
  logout,
  getAuthType
} from '../utils/auth';

const menuItems = ["Home", "Shop", "About", "Careers", "Contact"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authType, setAuthType] = useState('guest');
  const [customer, setCustomer] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const type = getAuthType();
    setAuthType(type);
    if (type === 'customer') {
      setCustomer(getCustomer());
    }
  }, []);

  const handleLogout = () => {
    if (authType === 'admin') {
      logout();
      navigate('/admin/login');
    } else if (authType === 'customer') {
      customerLogout();
      navigate('/login');
    }
    setAuthType('guest');
    setCustomer(null);
    setIsMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

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
            
            {/* ✅ PROFESSIONAL GOLD RING AVATAR */}
            {authType === 'guest' ? (
              <Link
                to="/login"
                className="relative text-sm tracking-wide text-gray-300 hover:text-gold transition-colors"
              >
                Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gold transition-all scale-x-0 group-hover:scale-x-100 origin-left"></span>
              </Link>
            ) : (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  {/* ✅ GOLD MONOGRAM RING - LUXURY DESIGN */}
                  <div className="w-9 h-9 rounded-full bg-black border-2 border-gold flex items-center justify-center">
                    <span className="text-gold font-light text-sm">
                      {authType === 'admin' ? 'A' : getInitials(customer?.fullName)}
                    </span>
                  </div>
                </div>
                
                {/* Desktop Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl py-2 shadow-xl shadow-gold/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {authType === 'admin' ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800"
                      >
                        Admin Dashboard
                      </Link>
                      <div className="border-t border-gray-800 my-1"></div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800"
                      >
                        My Orders
                      </Link>
                      <div className="border-t border-gray-800 my-1"></div>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
            
            {/* ✅ COMPLETE MOBILE AUTH MENU */}
            {authType === 'guest' ? (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base text-gray-300 hover:text-gold"
              >
                Login
              </Link>
            ) : authType === 'admin' ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base text-gray-300 hover:text-gold"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-base text-gray-300 hover:text-red-400 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base text-gray-300 hover:text-gold"
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base text-gray-300 hover:text-gold"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-base text-gray-300 hover:text-red-400 text-left w-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;