// src/components/HomeSections/FeaturedWatches.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const FeaturedWatches = () => {
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchFeaturedWatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/featured`);
      const data = await res.json();
      
      if (data.success) {
        setFeaturedWatches(data.products || []);
      } else {
        setError('Failed to load featured watches');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedWatches();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  // Hide section if no featured products
  if (featuredWatches.length === 0 && !loading && !error) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-4 bg-black relative overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      {/* Subtle Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="inline-block mb-4">
            <span className="text-xs md:text-sm tracking-[0.3em] text-gold/70 uppercase font-light">
              Curated Selection
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            Featured <span className="text-gold font-normal">Timepieces</span>
          </h2>
          
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="group">
                <div className="bg-gray-900/30 backdrop-blur border border-gray-800/50 rounded-lg overflow-hidden">
                  <div className="h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/30 animate-pulse-slow" />
                  <div className="p-6 space-y-4">
                    <div className="h-3 bg-gray-800/50 rounded w-1/2 animate-pulse-slow" />
                    <div className="h-5 bg-gray-800/50 rounded animate-pulse-slow" />
                    <div className="h-10 bg-gray-800/50 rounded w-2/3 animate-pulse-slow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="text-gold/20 text-7xl mb-6">⌚</div>
            <p className="text-red-400/80 text-lg">{error}</p>
          </div>
        )}

        {/* Featured Watches Grid — ✅ MOBILE: 2 per row, DESKTOP: 4 per row (unchanged) */}
        {!loading && !error && featuredWatches.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWatches.map((watch, index) => (
              <div
                key={watch._id}
                className={`group transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-gradient-to-b from-gray-900/40 to-gray-900/20 backdrop-blur-sm 
                              border border-gray-800/50 rounded-lg overflow-hidden 
                              hover:border-gold/50 transition-all duration-500 
                              hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]
                              flex flex-col h-full">
                  
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-black/40 to-gray-900/40">
                    {watch.images?.[0] ? (
                      <>
                        <img
                          src={watch.images[0]}
                          alt={`${watch.brand} ${watch.title}`}
                          className="w-full h-full object-contain p-6 transition-all duration-700 
                                   group-hover:scale-110 group-hover:rotate-2"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1.5 text-xs font-medium tracking-wider 
                                   bg-black/60 backdrop-blur-md text-gold border border-gold/30 
                                   rounded-full uppercase">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-gold/90 font-medium text-sm tracking-wider mb-2 uppercase">
                      {watch.brand}
                    </div>
                    
                    <h3 className="text-white font-light text-lg mb-4 line-clamp-2 
                                 group-hover:text-gold/90 transition-colors duration-300 leading-snug">
                      {watch.title}
                    </h3>
                    
                    <div className="mt-auto space-y-4">
                      <p className="text-white text-2xl font-light tracking-wide">
                        {formatPrice(watch.price)}
                      </p>
                      
                      <Link
                        to={`/shop/${watch._id}`}
                        className="block w-full text-center py-3 border border-gold/40 text-gold 
                                 rounded-sm hover:bg-gold hover:text-black transition-all duration-300 
                                 font-medium text-sm tracking-wider uppercase
                                 hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && featuredWatches.length > 0 && (
          <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 
                       rounded-sm font-medium tracking-wider uppercase text-sm
                       hover:bg-gold/90 transition-all duration-300 group 
                       shadow-[0_4px_20px_rgba(212,175,55,0.25)]
                       hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Full Collection</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default FeaturedWatches;