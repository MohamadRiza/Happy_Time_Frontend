// src/components/CategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Classic & modern styles',
    image: 'ManW.jpg',
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Elegant timepieces',
    image: 'WomenW.jpg',
  },
  {
    id: 'smart-watch',
    name: 'Smart Watch',
    description: 'Technology-driven watches',
    image:
      'https://4elementsclothing.co.uk/cdn/shop/products/telsatelsa-uk-waterproof-smart-watch-t410-sports-fitness-digital-watch-military-style-mens-with-touch-screen-display-fitness-watch-smart-watch-for-men-ios-andro-795028.jpg?v=1706428380',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury collections',
    image: '/categories/premium.jpg',
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Fun & durable watches',
    image: '/categories/kids.jpg',
  },
  {
    id: 'clocks',
    name: 'Clocks',
    description: 'Wall & table clocks',
    image: '/categories/clocks.jpg',
  },
  {
    id: 'striped',
    name: 'Striped',
    description: 'Bold striped designs',
    image:
      'https://fossil.scene7.com/is/image/FossilPartners/FS5963_main?$sfcc_fos_large$',
  },
  {
    id: 'gold-steel',
    name: 'Gold & Steel',
    description: 'Gold and steel finishes',
    image:
      'https://www.casio.com/content/casio/locales/europe/en-gb/products/watches/types/men-watches-gold/_jcr_content/root/responsivegrid/container_671877457_/accordion_copy_copy_/item_1/container_4844771_co/container_copy/container_1032216771/container_copy_copy_/container_copy/image_copy_153882584.casiocoreimg.png/1757701873011/mtp-b145g-9av.png',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Built for active lifestyle',
    image: '/categories/sports.jpg',
  },
];

const CategorySection = () => {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Shop by <span className="text-gold">Category</span>
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto my-4 rounded-full" />
          <p className="text-gray-400 max-w-xl mx-auto">
            Find the perfect watch for every style and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group text-center"
            >
              <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border border-gray-800 group-hover:border-gold transition-all duration-300 shadow-lg bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <h3 className="mt-5 text-white font-semibold text-lg group-hover:text-gold transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
