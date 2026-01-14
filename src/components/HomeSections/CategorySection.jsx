// src/components/CategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Classic & modern timepieces for the distinguished gentleman',
    image: 'https://images.pexels.com/photos/290436/pexels-photo-290436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-blue-900/20 to-blue-800/10'
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Elegant and sophisticated watches for every occasion',
    image: 'https://images.pexels.com/photos/2259283/pexels-photo-2259283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-pink-900/20 to-pink-800/10'
  },
  {
    id: 'boy',
    name: 'Boy',
    description: 'Durable and fun timepieces for young adventurers',
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-green-900/20 to-green-800/10'
  },
  {
    id: 'girl',
    name: 'Girl',
    description: 'Colorful and stylish watches for little fashionistas',
    image: 'https://images.pexels.com/photos/1095511/pexels-photo-1095511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-purple-900/20 to-purple-800/10'
  },
  {
    id: 'wall_clock',
    name: 'Wall Clocks',
    description: 'Premium wall clocks for home and office',
    image: 'https://images.pexels.com/photos/730546/pexels-photo-730546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-amber-900/20 to-amber-800/10'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury collections from world-renowned brands',
    image: 'https://images.pexels.com/photos/145300/pexels-photo-145300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gradient: 'from-gold/20 to-yellow-800/10'
  }
];

const CategorySection = () => {
  return (
    <section className="bg-black py-20 px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-black/30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by <span className="text-gold bg-gradient-to-r from-gold/20 to-transparent bg-clip-text">Category</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-6 rounded-full" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover our curated collection of luxury timepieces, meticulously crafted for every style and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?productType=${category.id === 'wall_clock' ? 'wall_clock' : 'watch'}${category.id !== 'wall_clock' && category.id !== 'premium' ? `&gender=${category.id}` : ''}`}
              className="group block"
            >
              <div className="bg-gradient-to-b from-gray-900/50 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-gold hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 transform hover:-translate-y-1 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80`}></div>
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 backdrop-blur-sm text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30">
                      {category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">
                    {category.description}
                  </p>
                  
                  {/* Explore Button */}
                  <div className="mt-4">
                    <div className="inline-flex items-center text-gold hover:text-yellow-300 text-sm font-medium group-hover:gap-2 transition-all duration-300">
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
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center bg-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-gold/90 transition-all duration-300 group"
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