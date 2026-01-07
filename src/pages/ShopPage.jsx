// src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    productType: 'all',
    gender: 'all',
    brand: 'all',
    shape: 'all',
    minPrice: '',
    maxPrice: '',
    color: 'all',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /* -------------------- HELPERS -------------------- */
  const getUniqueBrands = () => [...new Set(products.map(p => p.brand))];
  const getUniqueShapes = () => [...new Set(products.map(p => p.watchShape))];
  const getUniqueColors = () => {
    const allColors = products.flatMap(p => p.colors || []);
    return [...new Set(allColors)];
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  // ✅ Get gender display text (handles wall clocks)
  const getGenderDisplay = (gender, productType) => {
    if (productType === 'wall_clock') {
      return 'Wall Clock';
    }
    switch(gender) {
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'boy': return 'Boy';
      case 'girl': return 'Girl';
      default: return 'Unisex';
    }
  };

  // ✅ Get gender badge class
  const getGenderBadgeClass = (gender, productType) => {
    if (productType === 'wall_clock') {
      return 'bg-amber-900/30 text-amber-300';
    }
    switch(gender) {
      case 'men': return 'bg-blue-900/30 text-blue-300';
      case 'women': return 'bg-pink-900/30 text-pink-300';
      case 'boy': return 'bg-green-900/30 text-green-300';
      case 'girl': return 'bg-purple-900/30 text-purple-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  /* -------------------- API -------------------- */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* -------------------- FILTER LOGIC -------------------- */
  useEffect(() => {
    let result = [...products];

    // ✅ Product type filter
    if (filters.productType !== 'all') {
      result = result.filter(p => p.productType === filters.productType);
    }

    // ✅ Gender filter (only apply to watches)
    if (filters.gender !== 'all') {
      result = result.filter(p => 
        p.productType === 'wall_clock' || p.gender === filters.gender
      );
    }

    if (filters.brand !== 'all')
      result = result.filter(p => p.brand === filters.brand);

    if (filters.shape !== 'all')
      result = result.filter(p => p.watchShape === filters.shape);

    if (filters.color !== 'all')
      result = result.filter(p => p.colors?.includes(filters.color));

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Handle product type change
  const handleProductTypeChange = (e) => {
    const productType = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      productType,
      gender: productType === 'wall_clock' ? 'all' : prev.gender
    }));
  };

  const resetFilters = () => {
    setFilters({
      productType: 'all',
      gender: 'all',
      brand: 'all',
      shape: 'all',
      minPrice: '',
      maxPrice: '',
      color: 'all',
    });
  };

  const handlePriceChange = (type, value) => {
    if (value === '' || /^\d*$/.test(value)) {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  /* ===================================================== */ 
  
  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />

      {/* ================= HERO (DESKTOP PERFECTED) ================= */}
      <section className="relative h-[420px] xl:h-[520px]">
        <img
          src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
          alt="Luxury Watches"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gold mb-4">
              Timeless Luxury Timepieces
            </h1>
            <p className="text-gray-300 max-w-xl text-lg">
              Discover premium craftsmanship, iconic brands, and exquisite timepieces 
              designed to elevate every moment.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* -------- MOBILE FILTER BUTTON -------- */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl text-gold"
            >
              Open Filters
            </button>
          </div>

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className={`lg:w-72 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-black/80 backdrop-blur border border-gray-800 rounded-2xl p-6 space-y-5 sticky top-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Refine Selection</h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400">
                  ✕
                </button>
              </div>

              {/* ✅ Product Type Filter */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Product Type</label>
                <select
                  name="productType"
                  value={filters.productType}
                  onChange={handleProductTypeChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold outline-none"
                >
                  <option value="all">All Products</option>
                  <option value="watch">Wrist Watches</option>
                  <option value="wall_clock">Wall Clocks</option>
                </select>
              </div>

              {/* ✅ Gender Filter (conditionally shown) */}
              {(filters.productType === 'all' || filters.productType === 'watch') && (
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold outline-none"
                  >
                    <option value="all">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              )}

              {[
                { label: 'Brand', name: 'brand', options: ['all', ...getUniqueBrands()] },
                { label: 'Shape', name: 'shape', options: ['all', ...getUniqueShapes()] },
                { label: 'Color', name: 'color', options: ['all', ...getUniqueColors()] },
              ].map(({ label, name, options }) => (
                <div key={name}>
                  <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                  <select
                    name={name}
                    value={filters[name]}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold outline-none"
                  >
                    {options.map(opt => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* PRICE */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Price Range (LKR)</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2"
                  />
                  <input
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <main className="flex-1">
            <h2 className="text-2xl font-semibold mb-8">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Timepiece' : 'Timepieces'} Found
            </h2>

            {/* LOADING */}
            {loading && (
              <div className="text-center py-24 text-gray-400">
                Loading luxury timepieces…
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <p className="text-red-400">{error}</p>
            )}

            {/* EMPTY STATE (PERFECT MESSAGE) */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="border border-gray-800 rounded-3xl p-16 text-center bg-gradient-to-b from-gray-900 to-black">
                <div className="text-gold text-6xl mb-6">⌚</div>
                <h3 className="text-2xl font-semibold mb-3">
                  No Timepieces Match Your Selection
                </h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  We couldn’t find a timepiece that fits your current filters.
                  Try adjusting your preferences or explore our full collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-400 transition"
                >
                  View All Timepieces
                </button>
              </div>
            )}

            {/* PRODUCTS GRID */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="group bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-gold hover:shadow-xl hover:shadow-gold/10 transition flex flex-col"
                  >
                    {/* ✅ PERFECT MOBILE IMAGE CONTAINER */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {product.title}
                      </h3>
                      <span className="text-gold text-xs uppercase mb-2">
                        {product.brand}
                      </span>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* ✅ Category/Gender Display */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className={`text-xs px-2 py-1 rounded ${getGenderBadgeClass(product.gender, product.productType)}`}>
                          {getGenderDisplay(product.gender, product.productType)}
                        </span>
                      </div>

                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        <Link to={`/shop/${product._id}`} className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;