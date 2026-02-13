import React from 'react';

// Temporary placeholder data – replace with your actual brand images
const brands = [
  { name: 'Orix', image: '/OrixBrand.webp' },
  { name: 'Winsor', image: '/winsor.png' },
  { name: 'Arial', image: '/ArielBrand.webp' },
  { name: 'Hublot', image: 'https://iconape.com/wp-content/png_logo_vector/hublot.png' },
  { name: 'Rolex', image: 'https://i.pinimg.com/474x/c3/af/ba/c3afba827e7299415cb7034e00bc9533.jpg' },
  { name: 'Tissot', image: 'https://cdn.worldvectorlogo.com/logos/tissot-1.svg' },
  { name: 'Poedagar', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFMBU02B7LSzysRV8WEHMP2n9PZ2HpAV3_sw&s' },
  { name: 'Omega', image: 'https://www.watchandjewelryexchange.com/cdn/shop/collections/b78db2121aa575229bd01aaecd0491e4_grande.jpg?v=1581462971' },
  { name: 'Current', image: 'https://www.watchboyz.co.za/cdn/shop/collections/Curren-Watches-South-Africa---WatchBoyz.jpg?v=1663565114' },
  { name: 'Richerd Mille', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyJcgTg6CiZzVixoQDJXGxRHL2nCmXKlS10w&s' },
  { name: 'Rado', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjQCjGzBuz8-9cn52QSI5QtgtqpwIUV_iaLQ&s' },
];

const BrandsMarquee = () => {
  // Duplicate array for seamless loop
  const marqueeItems = [...brands, ...brands];

  return (
    <div className="w-full py-8 bg-black/40 border-t border-gray-800 mt-6">
      <div className="relative overflow-hidden group">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee hover:pause-animation">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 mx-6"
            >
              {/* Image container – all images forced to same size */}
              <div className="h-16 w-24 flex items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += `<span class="text-gray-600 text-sm">${brand.name}</span>`;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default BrandsMarquee;