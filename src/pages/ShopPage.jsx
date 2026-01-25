// src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // ✅ Use useSearchParams to read and update URL
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Initialize filters from URL
  const initialFilters = {
    productType: searchParams.get('productType') || 'all',
    gender: searchParams.get('gender') || 'all',
    brand: searchParams.get('brand') || 'all',
    shape: searchParams.get('shape') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    color: searchParams.get('color') || 'all',
  };

  const [filters, setFilters] = useState(initialFilters);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /* -------------------- HELPERS -------------------- */
  const getUniqueBrands = () => [...new Set(products.map(p => p.brand))];
  const getUniqueShapes = () => [...new Set(products.map(p => p.watchShape))];
  
  // ✅ FIXED: Handle colors as array of objects
  const getUniqueColors = () => {
    const allColors = products.flatMap(p => {
      // Handle both old format (array of strings) and new format (array of objects)
      if (!p.colors || !Array.isArray(p.colors)) return [];
      
      return p.colors.map(color => {
        // If it's an object with a name property, return the name
        if (typeof color === 'object' && color.name) {
          return color.name;
        }
        // If it's a string (old format), return as is
        if (typeof color === 'string') {
          return color;
        }
        return null;
      }).filter(Boolean); // Remove null values
    });
    
    return [...new Set(allColors)].sort();
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  const getGenderDisplay = (gender, productType) => {
    if (productType === 'wall_clock') return 'Wall Clock';
    switch(gender) {
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'kids': return 'Kids';
      case 'unisex': return 'Unisex';
      default: return 'Unisex';
    }
  };

  const getGenderBadgeClass = (gender, productType) => {
    if (productType === 'wall_clock') return 'bg-amber-900/30 text-amber-300';
    switch(gender) {
      case 'men': return 'bg-blue-900/30 text-blue-300';
      case 'women': return 'bg-pink-900/30 text-pink-300';
      case 'kids': return 'bg-green-900/30 text-green-300';
      case 'unisex': return 'bg-gray-800 text-gray-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  // ✅ HELPER: Get display colors for a product
  const getProductColors = (product) => {
    if (!product.colors || !Array.isArray(product.colors)) return [];
    
    return product.colors.map(color => {
      // Handle object format
      if (typeof color === 'object' && color.name) {
        return {
          name: color.name,
          quantity: color.quantity || null
        };
      }
      // Handle string format (old data)
      if (typeof color === 'string') {
        return {
          name: color,
          quantity: null
        };
      }
      return null;
    }).filter(Boolean);
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
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ✅ Sync filters → URL */
  useEffect(() => {
    const params = {};
    
    // Only add non-default values to keep URL clean
    if (searchQuery) params.q = searchQuery;
    if (filters.productType !== 'all') params.productType = filters.productType;
    if (filters.gender !== 'all' && filters.productType !== 'wall_clock') params.gender = filters.gender;
    if (filters.brand !== 'all') params.brand = filters.brand;
    if (filters.shape !== 'all') params.shape = filters.shape;
    if (filters.color !== 'all') params.color = filters.color;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (sortBy !== 'featured') params.sortBy = sortBy;

    setSearchParams(params, { replace: true });
  }, [filters, searchQuery, sortBy, setSearchParams]);

  /* -------------------- FILTER LOGIC -------------------- */
  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.modelNumber && p.modelNumber.toLowerCase().includes(query))
      );
    }

    if (filters.productType !== 'all') {
      result = result.filter(p => p.productType === filters.productType);
    }

    if (filters.gender !== 'all') {
      result = result.filter(p => 
        p.productType === 'wall_clock' || p.gender === filters.gender
      );
    }

    if (filters.brand !== 'all')
      result = result.filter(p => p.brand === filters.brand);

    if (filters.shape !== 'all')
      result = result.filter(p => p.watchShape === filters.shape);

    // ✅ FIXED: Color filtering with new structure
    if (filters.color !== 'all') {
      result = result.filter(p => {
        if (!p.colors || !Array.isArray(p.colors)) return false;
        
        return p.colors.some(color => {
          // Handle object format
          if (typeof color === 'object' && color.name) {
            return color.name === filters.color;
          }
          // Handle string format (old data)
          if (typeof color === 'string') {
            return color === filters.color;
          }
          return false;
        });
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      result = result.filter(p => {
        // Skip products without price (Contact for Price)
        if (!p.price) return filters.minPrice === '' && filters.maxPrice === '';
        return p.price >= min && p.price <= max;
      });
    }

    result = sortProducts(result, sortBy);
    setFilteredProducts(result);
  }, [filters, products, searchQuery, sortBy]);

  const sortProducts = (products, sortBy) => {
    switch(sortBy) {
      case 'price-low-high':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high-low':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'featured':
      default:
        return [...products].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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
    setSearchQuery('');
    setSortBy('featured');
    // URL will auto-update via useEffect
  };

  const handlePriceChange = (type, value) => {
    if (value === '' || /^\d*$/.test(value)) {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        {/* ✅ TOP BAR: Centered on mobile, aligned on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
          {/* Search - Full width on mobile, constrained on desktop */}
          <div className="relative w-full max-w-xl mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Search watches or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Right Controls: View + Sort - Aligned right on desktop */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
            {/* View Toggle */}
            <div className="flex bg-gray-900/60 rounded-lg border border-gray-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gold"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low → High</option>
              <option value="price-high-low">Price: High → Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-xl text-gold flex items-center gap-2 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Filter Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-black/70 backdrop-blur border border-gray-800 rounded-2xl p-5 sticky top-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-white">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Product Type</label>
                  <select
                    name="productType"
                    value={filters.productType}
                    onChange={handleProductTypeChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold outline-none"
                  >
                    <option value="all">All Products</option>
                    <option value="watch">Wrist Watches</option>
                    <option value="wall_clock">Wall Clocks</option>
                  </select>
                </div>

                {(filters.productType === 'all' || filters.productType === 'watch') && (
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Gender</label>
                    <select
                      name="gender"
                      value={filters.gender}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold outline-none"
                    >
                      <option value="all">All Genders</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
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
                    <label className="text-gray-400 text-xs mb-1 block">{label}</label>
                    <select
                      name={name}
                      value={filters[name]}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold outline-none"
                    >
                      {options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === 'all' ? 'All' : opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Price Range (LKR)</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm"
                    />
                    <input
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm mt-2"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Product Listing */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
              </p>
            </div>

            {loading && (
              <div className="text-center py-20 text-gray-500">Loading products...</div>
            )}

            {!loading && error && (
              <p className="text-red-400 py-10">{error}</p>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="border border-gray-800 rounded-2xl p-10 text-center bg-gray-900/30">
                <div className="text-gold text-5xl mb-4">⌚</div>
                <h3 className="text-xl font-medium mb-2">No products match your filters</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                <button
                  onClick={resetFilters}
                  className="bg-gold text-black px-5 py-2 rounded-lg font-medium hover:bg-yellow-400 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-6"
              }>
                {filteredProducts.map(product => {
                  const productColors = getProductColors(product);
                  
                  return (
                    <div
                      key={product._id}
                      className={`bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden hover:border-gold transition ${
                        viewMode === 'list' ? 'flex gap-6 p-4' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={viewMode === 'list' 
                        ? "w-32 h-32 flex-shrink-0" 
                        : "aspect-square overflow-hidden"
                      }>
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className={viewMode === 'list' ? "flex-1" : "p-4"}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{product.title}</h3>
                          <span className="text-gold text-sm font-medium whitespace-nowrap ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        
                        <span className="text-gray-400 text-xs uppercase mb-2 block">
                          {product.brand}
                        </span>

                        <p className={`text-gray-400 text-xs mb-3 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className={`text-[10px] px-2 py-1 rounded ${getGenderBadgeClass(product.gender, product.productType)}`}>
                            {getGenderDisplay(product.gender, product.productType)}
                          </span>
                          {/* ✅ Display first color if available */}
                          {productColors.length > 0 && (
                            <span className="text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-300">
                              {productColors[0].name}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto">
                          <Link 
                            to={`/shop/${product._id}`} 
                            className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition"
                          >
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;