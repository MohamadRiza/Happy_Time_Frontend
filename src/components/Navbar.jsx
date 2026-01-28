// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
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

const menuItems = [
  { name: "Home", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Shop", path: "/shop", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { name: "About", path: "/about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { name: "Careers", path: "/careers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { name: "Contact", path: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authType, setAuthType] = useState('guest');
  const [customer, setCustomer] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const searchRef = useRef(null);

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

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success) {
        setSearchResults(data.products || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/${productId}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => checkAuthStatus();
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

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const mobileMenuItems = [
    { name: "About", path: "/about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Careers", path: "/careers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { name: "Contact", path: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
  ];

  return (
    <nav className="bg-black/90 text-white sticky top-0 z-50 relative">
      {/* Gold lighting effect */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Happy Time Logo"
              className="h-14 w-auto object-contain transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="leading-tight">
              <p className="glass-gold-text font-semibold text-lg tracking-wide transition-all duration-300 group-hover:tracking-widest">
                Happy Time
              </p>
              <p className="text-gray-400 text-xs tracking-widest transition-colors duration-300 group-hover:text-gold">
                PVT LTD
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm tracking-wide transition-all duration-300 transform hover:scale-110 group ${
                    isActive
                      ? "text-gold font-semibold"
                      : "text-gray-300 hover:text-gold"
                  }`}
                >
                  {item.name}
                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-gold/50 via-gold to-gold/50 transition-all duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    } origin-left`}
                  ></span>
                  {/* Glow effect on hover */}
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 blur-xl transition-all duration-300 rounded-full"></span>
                </Link>
              );
            })}
            
            {authType === 'customer' ? (
              <>
                {/* Search Icon */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-300 hover:text-gold transition-all duration-300 p-1 transform hover:scale-110 hover:rotate-12 relative group"
                  aria-label="Search products"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 blur-lg transition-all duration-300 rounded-full"></span>
                </button>
                
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative text-gray-300 hover:text-gold transition-all duration-300 transform hover:scale-110 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 blur-lg transition-all duration-300 rounded-full"></span>
                </Link>
                
                {/* User Avatar */}
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-gold/50">
                      {getInitials(customer?.fullName)}
                    </div>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl py-2 shadow-xl shadow-gold/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      My Cart ({cartCount})
                    </Link>
                    <div className="border-t border-gray-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : authType === 'admin' ? (
              <>
                {/* Search Icon for admin */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-300 hover:text-gold transition-all duration-300 p-1 transform hover:scale-110 hover:rotate-12 relative group"
                  aria-label="Search products"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 blur-lg transition-all duration-300 rounded-full"></span>
                </button>
                
                {/* Admin Avatar */}
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-gold/50">
                      A
                    </div>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl py-2 shadow-xl shadow-gold/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      Admin Dashboard
                    </Link>
                    <div className="border-t border-gray-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-all duration-200 hover:translate-x-1"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-sm tracking-wide text-gray-300 hover:text-gold transition-all duration-300 transform hover:scale-110 group"
                >
                  Login
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-gold/50 via-gold to-gold/50 transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 blur-xl transition-all duration-300 rounded-full"></span>
                </Link>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-300 hover:text-gold transition-all duration-300 p-1 transform hover:scale-110 hover:rotate-12 relative group"
                  aria-label="Search products"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 blur-lg transition-all duration-300 rounded-full"></span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-300 hover:text-gold transition-all duration-300 p-1 transform hover:scale-110 active:scale-95"
              aria-label="Search products"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-gold transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              <svg
                className="h-7 w-7 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {showSearch && (
        <div 
          ref={searchRef}
          className="absolute top-full left-0 right-0 md:left-auto md:right-0 md:w-96 bg-black/95 backdrop-blur-md border-b border-gray-800 z-50 shadow-xl animate-slideDown"
        >
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search products..."
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gold border-t-transparent"></div>
                </div>
              )}
            </form>
            
            {searchQuery && (
              <div className="mt-2 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer rounded-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-1"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded transform transition-transform duration-300 hover:scale-110"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{product.title}</p>
                        <p className="text-gray-400 text-sm truncate">{product.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {product.gender || 'N/A'}
                          </span>
                          <span className="text-xs text-gold">
                            {product.price ? `LKR ${product.price.toLocaleString()}` : 'Contact for Price'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {isLoading ? 'Searching...' : 'No products found'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/40 border-t border-b border-gray-800 animate-slideDown">
          <div className="px-4 py-3 space-y-2">
            {mobileMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2 ${
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-gray-300 hover:text-gold hover:bg-gray-800/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {authType === 'guest' && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-gray-300 hover:text-gold hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Login</span>
              </Link>
            )}
            
            {(authType === 'customer' || authType === 'admin') && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left py-2.5 px-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 hover:translate-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {(authType === 'customer' || authType === 'guest') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-gray-800 z-40">
          <div className="flex justify-around items-center py-3 px-2">
            <Link
              to="/"
              className={`flex flex-col items-center text-xs transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                location.pathname === '/' 
                  ? 'text-gold' 
                  : 'text-gray-400 hover:text-gold'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="mt-1">Home</span>
            </Link>
            
            <Link
              to="/shop"
              className={`flex flex-col items-center text-xs transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                location.pathname === '/shop' 
                  ? 'text-gold' 
                  : 'text-gray-400 hover:text-gold'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="mt-1">Shop</span>
            </Link>
            
            <Link
              to="/contact"
              className={`flex flex-col items-center text-xs transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                location.pathname === '/contact' 
                  ? 'text-gold' 
                  : 'text-gray-400 hover:text-gold'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="mt-1">Contact</span>
            </Link>

            {authType === 'customer' && (
              <>
                <Link
                  to="/cart"
                  className="flex flex-col items-center text-gray-400 hover:text-gold transition-all duration-300 relative transform hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                  <span className="text-xs mt-1">Cart</span>
                </Link>

                <Link
                  to="/account"
                  className={`flex flex-col items-center text-xs transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    location.pathname === '/account' 
                      ? 'text-gold' 
                      : 'text-gray-400 hover:text-gold'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="mt-1">Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;