// src/pages/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerLogin } from '../utils/auth';
import ScrollToTop from '../components/ScrollToTop';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // FIX 1: Avoid calling window.innerWidth directly in useState (SSR-safe)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  // FIX 2: Track active image index for the slider
  const [activeImage, setActiveImage] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FIX 3: Proper image slider — cycle through images with a JS interval
  useEffect(() => {
    if (!isDesktop) return;
    sliderRef.current = setInterval(() => {
      setActiveImage(prev => (prev + 1) % luxuryImages.length);
    }, 4000);
    return () => clearInterval(sliderRef.current);
  }, [isDesktop]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        customerLogin(data.data.token, data.data.customer);
        navigate('/account');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Luxury background images for desktop
  const luxuryImages = [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80'
  ];

  // FIX 4: Shared error block to avoid duplication
  const ErrorBlock = () =>
    error ? (
      <div className="mb-6 p-4 bg-[#1a0505] border border-[#8B0000]/40 rounded-lg flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6b6b] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-[#ff8080] text-sm">{error}</p>
      </div>
    ) : null;

  // FIX 5: Shared submit button to avoid duplication
  const SubmitButton = () => (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold tracking-wide hover:bg-[#b8962e] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Signing in...</span>
        </>
      ) : (
        'Sign In'
      )}
    </button>
  );

  return (
    <>
      <Helmet>
        <title>Customer Login – Happy Time</title>
        <meta name="description" content="Login to your Happy Time customer account to manage orders, track shipments, and access your profile." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://happytimeonline.com/login" />
        <meta property="og:title" content="Customer Login – Happy Time" />
        <meta property="og:description" content="Login to your Happy Time customer account." />
        <meta property="og:url" content="https://happytimeonline.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Login – Happy Time" />
        <meta name="twitter:description" content="Login to your Happy Time customer account." />
        <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
      </Helmet>
      <ScrollToTop />

      {/* Desktop Split Layout */}
      {isDesktop ? (
        <div className="min-h-screen flex bg-black">

          {/* Left Panel - Luxury Imagery (true 50%) */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            {luxuryImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Luxury timepiece ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{ opacity: idx === activeImage ? 1 : 0 }}
              />
            ))}

            {/* Dark overlay — stronger at top/bottom, lighter in centre so watch pops */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />

            {/* Branding — sits cleanly at bottom-left, away from the watch */}
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Happy Time Logo"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                />
                <div>
                  <h1 className="text-base font-bold text-[#D4AF37] tracking-widest uppercase">Happy Time</h1>
                  <p className="text-[#9a9a9a] text-[10px] uppercase tracking-widest">Luxury Timepieces Since 1996</p>
                </div>
              </div>
              <blockquote className="text-sm italic text-[#b0b0b0] border-l-2 border-[#D4AF37] pl-4 max-w-xs leading-relaxed">
                "Where every second tells a story of elegance."
              </blockquote>
            </div>

            {/* Subtle image counter dots */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
              {luxuryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeImage ? 'bg-[#D4AF37] w-4' : 'bg-white/30'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Login Form (true 50%, fully centered) */}
          <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center px-8 py-12 bg-[#080808] relative overflow-hidden">

            {/* Subtle gold glow blobs */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />

            <div className="relative w-full max-w-[420px]">
              {/* Card */}
              <div className="bg-[#0f0f0f] border border-[#222] rounded-2xl px-10 py-10 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#D4AF37] tracking-wide mb-1.5">Welcome Back</h2>
                  <p className="text-[#666] text-sm">Sign in to access your exclusive account</p>
                </div>

                <ErrorBlock />

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="block text-[#aaa] text-xs font-semibold uppercase tracking-wider">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-[#151515] border border-[#2e2e2e] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#444] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                      placeholder="Enter your username"
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-[#aaa] text-xs font-semibold uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#151515] border border-[#2e2e2e] rounded-xl px-4 py-3.5 pr-12 text-white text-sm placeholder-[#444] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#555] hover:text-[#D4AF37] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 text-[#777] cursor-pointer hover:text-[#aaa] transition-colors">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#444] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      disabled
                      className="text-[#D4AF37] font-medium cursor-not-allowed opacity-50 text-xs"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="pt-1">
                    <SubmitButton />
                  </div>
                </form>

                <div className="mt-7 pt-6 border-t border-[#1e1e1e] text-center">
                  <p className="text-[#555] text-sm">
                    New to Happy Time?{' '}
                    <Link to="/register" className="text-[#D4AF37] font-semibold hover:text-[#b8962e] transition-colors">
                      Create an account
                    </Link>
                  </p>
                </div>

                {/* Trust badges */}
                <div className="mt-5 flex items-center justify-center gap-5 text-[#444] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure Login</span>
                  </div>
                  <span className="text-[#2a2a2a]">•</span>
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Privacy Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout */
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white flex items-center justify-center p-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-12"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 20%), 
                                 radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 25%)`
            }}
          />

          <div className="relative w-full max-w-md">
            {/* Logo Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-3">
                {/* FIX 7 (mobile): Absolute path for logo */}
                <img
                  src="/logo.png"
                  alt="Happy Time Logo"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wide mb-1">HAPPY TIME</h1>
                <p className="text-[#9a9a9a] text-xs uppercase tracking-wider">Luxury Timepieces Since 1996</p>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#D4AF37] tracking-wide mb-1">Welcome Back</h2>
                <p className="text-[#9a9a9a] text-sm">Sign in to your account</p>
              </div>

              <ErrorBlock />

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="username-mobile" className="block text-[#b8b8b8] text-sm font-medium">Username</label>
                  <input
                    id="username-mobile"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-[#3a3a3a] rounded-xl px-4 py-4 text-white placeholder-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password-mobile" className="block text-[#b8b8b8] text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      id="password-mobile"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#3a3a3a] rounded-xl px-4 py-4 pr-12 text-white placeholder-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#7a7a7a] hover:text-[#D4AF37] transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  {/* FIX 8 (mobile): Controlled checkbox */}
                  <label className="flex items-center gap-2 text-[#9a9a9a] cursor-pointer hover:text-[#b8b8b8] transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4a4a4a] bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                    />
                    <span>Remember me</span>
                  </label>
                  {/* FIX 9 (mobile): button instead of <Link to="#"> */}
                  <button
                    type="button"
                    disabled
                    className="text-[#D4AF37] hover:text-[#b8962e] transition-colors font-medium cursor-not-allowed opacity-60"
                  >
                    Forgot?
                  </button>
                </div>

                <SubmitButton />
              </form>

              <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                <p className="text-[#7a7a7a] text-center text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#D4AF37] font-semibold hover:text-[#b8962e] transition-colors">
                    Register now
                  </Link>
                </p>
              </div>

              {/* Mobile trust indicators */}
              <div className="mt-6 flex items-center justify-center gap-4 text-[#5a5a5a] text-xs">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Private
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* FIX 10: Removed broken CSS @keyframes fadeSlide — slider is now JS-driven */}
    </>
  );
};

export default LoginPage; //CHANGE BG IIMAGE AND PUSSH