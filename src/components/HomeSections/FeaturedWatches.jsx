// src/components/FeaturedWatches.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Temporary mock data — replace later with real products from your backend
const featuredWatches = [
  {
    id: 1,
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 14500,
    image: 'https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1920/v1742481485/rolexcom/new-watches/2025/hub/videos/autoplay/cover/rolex-watches-new-watches-2025-cover-autoplay-posterframe.jpg', // Place in public/watches/
  },
  {
    id: 2,
    name: 'Nautilus',
    brand: 'Patek Philippe',
    price: 32000,
    image: 'https://media.fashionnetwork.com/cdn-cgi/image/format=auto/m/06e4/0f65/5c91/8359/0a6e/d7df/f5a4/15e3/73a5/7505/7505.jpeg',
  },
  {
    id: 3,
    name: 'Royal Oak',
    brand: 'Audemars Piguet',
    price: 28500,
    image: 'https://cdn.shopify.com/s/files/1/0624/5777/4285/t/3/assets/1-1704373039748_1000x.jpg?v=1704373041',
  },
  {
    id: 4,
    name: 'Speedmaster Moonwatch',
    brand: 'Omega',
    price: 6800,
    image: 'https://barringtonwatchwinders.com/cdn/shop/articles/Rolex_Seadweller.webp?v=1727207605',
  },
];

const FeaturedWatches = () => {
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
              key={watch.id}
              className="bg-black soft border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Watch Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={watch.image}
                  alt={`${watch.brand} ${watch.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/watches/placeholder.jpg'; // Fallback image
                  }}
                />
                {/* Gold hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Watch Info */}
              <div className="p-5">
                <div className="text-gold font-semibold text-sm mb-1">{watch.brand}</div>
                <h3 className="text-white font-medium text-lg mb-2">{watch.name}</h3>
                <p className="text-white text-xl font-bold mb-4">${watch.price.toLocaleString()}</p>
                <Link
                  to={`/shop/${watch.id}`}
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