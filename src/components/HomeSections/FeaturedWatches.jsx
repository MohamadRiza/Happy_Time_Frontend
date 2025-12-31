// src/components/FeaturedWatches.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedWatches = () => {
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch featured products from backend
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

  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Timepieces</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-black border border-gray-800 rounded-xl overflow-hidden">
                <div className="h-64 bg-gray-900 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-800 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Timepieces</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
            <p className="text-red-400 mt-4">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Hide section if no featured products
  if (featuredWatches.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Timepieces</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Handpicked masterpieces from the world’s most prestigious watchmakers.
          </p>
        </div>

        {/* Watch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredWatches.map((watch) => (
            <div
              key={watch._id}
              className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Watch Image */}
              <div className="relative h-64 overflow-hidden">
                {watch.images?.[0] ? (
                  <img
                    src={watch.images[0]}
                    alt={`${watch.brand} ${watch.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                {/* Gold hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Watch Info */}
              <div className="p-5">
                <div className="text-gold font-semibold text-sm mb-1">{watch.brand}</div>
                <h3 className="text-white font-medium text-lg mb-2 line-clamp-1">{watch.title}</h3>
                <p className="text-white text-xl font-bold mb-4">{formatPrice(watch.price)}</p>
                <Link
                  to={`/shop/${watch._id}`}
                  className="block w-full text-center py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-black transition-all font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-gold/90 transition-all shadow-lg"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWatches;