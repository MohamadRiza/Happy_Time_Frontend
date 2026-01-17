// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getToken,
  getCustomer,
  getCustomerToken,
  customerLogout,
  logout,
  getAuthType,
  isCustomerAuthenticated
} from '../utils/auth';

const menuItems = ["Home", "Shop", "About", "Careers", "Contact"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authType, setAuthType] = useState('guest');
  const [customer, setCustomer] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ REAL-TIME AUTHENTICATION CHECK
  const checkAuthStatus = () => {
    const type = getAuthType();
    setAuthType(type);
    
    if (type === 'customer') {
      const cust = getCustomer();
      setCustomer(cust);
      fetchCartCount();
    } else {
      setCustomer(null);
      setCartCount(0);
    }
  };

  // ✅ SERVER-SIDE CART COUNT (NOT LOCALSTORAGE)
  const fetchCartCount = async () => {
    if (!isCustomerAuthenticated()) return;
    
    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        const count = data.cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ LISTEN FOR AUTHENTICATION CHANGES
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    const handleCartUpdate = () => {
      if (getAuthType() === 'customer') {
        fetchCartCount();
      }
    };
    
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // ✅ ALSO CHECK ON LOCATION CHANGE (for SPA navigation)
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const handleLogout = () => {
    if (authType === 'admin') {
      logout();
    } else if (authType === 'customer') {
      customerLogout();
    }
    
    setAuthType('guest');
    setCustomer(null);
    setCartCount(0);
    setIsMenuOpen(false);
    
    window.dispatchEvent(new CustomEvent('authChanged'));
    
    if (authType === 'admin') {
      navigate('/admin/login');
    } else if (authType === 'customer') {
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="bg-black/90 text-white sticky top-0 z-50 relative">
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
          <div className="hidden md:flex items-center space-x-8">
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
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-gold transition-all ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></span>
                </Link>
              );
            })}
            
            {/* ✅ CART ICON FOR LOGGED-IN CUSTOMERS */}
            {authType === 'customer' && (
              <Link
                to="/cart"
                className="relative text-gray-300 hover:text-gold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gold transition-all scale-x-0 group-hover:scale-x-100 origin-left"></span>
              </Link>
            )}
            
            {/* ✅ LOGIN / USER AVATAR */}
            {authType === 'guest' ? (
              <Link
                to="/login"
                className="relative text-sm tracking-wide text-gray-300 hover:text-gold transition-colors"
              >
                Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gold transition-all scale-x-0 group-hover:scale-x-100 origin-left"></span>
              </Link>
            ) : authType === 'admin' ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl py-2 shadow-xl shadow-gold/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800"
                  >
                    Admin Dashboard
                  </Link>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm">
                    {getInitials(customer?.fullName)}
                  </div>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl py-2 shadow-xl shadow-gold/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800"
                  >
                    My Cart ({cartCount})
                  </Link>
                  <div className="border-t border-gray-800 my-1"></div>
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

      {/* Mobile Menu - HAMBURGER MENU (without customer items) */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/40 border-t border-gray-800">
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
            
            {/* ✅ MOBILE AUTH MENU (only login/logout, no customer items) */}
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
              // ✅ For customers, only show logout in hamburger menu
              <button
                onClick={handleLogout}
                className="block text-base text-gray-300 hover:text-red-400 text-left w-full"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* ✅ MOBILE BOTTOM NAVIGATION FOR LOGGED-IN CUSTOMERS */}
      {authType === 'customer' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-gray-800 z-40 bg-gradient-to-br from-gold/20 via-black/50 to-black/80">
          <div className="flex justify-around items-center py-3 px-2">
            <Link
              to="/account"
              className="flex flex-col items-center text-gray-400 hover:text-gold transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Account</span>
            </Link>
            
            <Link
              to="/orders"
              className="flex flex-col items-center text-gray-400 hover:text-gold transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xs mt-1">Orders</span>
            </Link>
            
            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-400 hover:text-gold transition relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;