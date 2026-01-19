// src/components/FeaturedWatches.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedWatches = () => {
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  // Hide section if no featured products
  if (featuredWatches.length === 0 && !loading && !error) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Featured <span className="text-gold">Timepieces</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Handpicked masterpieces from the world’s most prestigious watchmakers.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
                <div className="h-64 bg-gray-900 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="text-gold text-6xl mb-4">⌚</div>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Featured Watches Grid */}
        {!loading && !error && featuredWatches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWatches.map((watch) => (
              <div
                key={watch._id}
                className="group bg-gray-900/40 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden 
                          hover:border-gold transition-all duration-500 transform hover:-translate-y-1.5
                          shadow-xl hover:shadow-gold/10 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {watch.images?.[0] ? (
                    <>
                      <img
                        src={watch.images[0]}
                        alt={`${watch.brand} ${watch.title}`}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Floating shadow for 3D effect */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-black/30 blur-xl rounded-full"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-600">No Image</span>
                    </div>
                  )}
                  
                  {/* Gold corner accent */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 backdrop-blur-sm text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-gold font-semibold text-sm mb-2">{watch.brand}</div>
                  <h3 className="text-white font-medium text-lg mb-3 line-clamp-1 group-hover:text-gold transition-colors">
                    {watch.title}
                  </h3>
                  
                  <div className="mt-auto">
                    <p className="text-white text-xl font-bold mb-4">{formatPrice(watch.price)}</p>
                    <Link
                      to={`/shop/${watch._id}`}
                      className="block w-full text-center py-2.5 border border-gold text-gold rounded-xl 
                                hover:bg-gold hover:text-black transition-all font-medium group-hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && featuredWatches.length > 0 && (
          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-flex items-center bg-gold text-black px-8 py-3.5 rounded-xl font-bold tracking-wide 
                        hover:bg-gold/90 transition-all duration-300 group shadow-lg shadow-gold/20"
            >
              <span>View Full Collection</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWatches;