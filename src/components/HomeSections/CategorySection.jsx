// src/components/CategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Timeless elegance for the modern gentleman',
    image: '/watch1.png', // ← your PNG
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Graceful sophistication for every moment',
    image: '/Watch2.png',
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Fun, durable watches for young explorers',
    image: '/images/kids-watch.png',
  },
  {
    id: 'wall_clock',
    name: 'Wall Clocks',
    description: 'Statement timepieces for home & office',
    image: '/images/wall-clock.png',
  }
];

const CategorySection = () => {
  return (
    <section className="bg-black py-24 px-4 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-700 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by <span className="text-gold">Category</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-6 rounded-full" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover meticulously crafted timepieces designed for distinction and style.
          </p>
        </div>

        {/* Floating Watch Grid — NO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-8 justify-items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex flex-col items-center text-center max-w-xs"
            >
              {/* Floating 3D Watch Display */}
              <Link
                to={`/shop?productType=${category.id === 'wall_clock' ? 'wall_clock' : 'watch'}${
                  category.id !== 'wall_clock' && category.id !== 'kids' ? `&gender=${category.id}` : ''
                }`}
                className="block mb-6"
              >
                <div className="relative">
                  {/* Soft shadow for depth */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-48 h-16 bg-black/40 blur-2xl rounded-full"></div>
                  
                  {/* Your PNG watch — centered, scalable */}
                  <img
                    src={category.image}
                    alt={`${category.name} Collection`}
                    className="relative z-10 max-h-52 max-w-full object-contain drop-shadow-xl
                              transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Text Content */}
              <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-gold transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
                {category.description}
              </p>

              <Link
                to={`/shop?productType=${category.id === 'wall_clock' ? 'wall_clock' : 'watch'}${
                  category.id !== 'wall_clock' && category.id !== 'kids' ? `&gender=${category.id}` : ''
                }`}
                className="inline-flex items-center text-gold hover:text-yellow-300 text-sm font-medium 
                          group-hover:gap-2 transition-all duration-300"
              >
                <span>Explore Collection</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-20">
          <Link
            to="/shop"
            className="inline-flex items-center bg-gold text-black px-8 py-3.5 rounded-xl font-bold tracking-wide 
                      hover:bg-gold/90 transition-all duration-300 group shadow-lg shadow-gold/20"
          >
            <span>View All Collections</span>
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
      </div>
    </section>
  );
};

export default CategorySection;