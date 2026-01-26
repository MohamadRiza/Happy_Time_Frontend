// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { 
  isCustomerAuthenticated, 
  getCustomerToken 
} from '../utils/auth';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gold text-black px-5 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2 animate-fade-in-up">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {message}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColorObj, setSelectedColorObj] = useState(null); // ✅ Store full color object
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ HELPER: Parse colors from product
  const parseProductColors = (product) => {
    if (!product?.colors || !Array.isArray(product.colors)) return [];
    
    return product.colors.map(color => {
      // Handle object format {name: "Gold - Black", quantity: 5}
      if (typeof color === 'object' && color.name) {
        return {
          name: color.name,
          quantity: color.quantity !== null && color.quantity !== undefined ? color.quantity : null
        };
      }
      // Handle old string format for backward compatibility
      if (typeof color === 'string') {
        return {
          name: color,
          quantity: null
        };
      }
      return null;
    }).filter(Boolean);
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      const data = await res.json();
      
      if (data.success) {
        setProduct(data.product);
        
        // ✅ Parse colors and set default selection
        const colors = parseProductColors(data.product);
        if (colors.length > 0) {
          setSelectedColorObj(colors[0]);
          // ✅ Set quantity to 1 by default (will be validated against available stock)
          setQuantity(1);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Fetch product error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      
      if (data.success) {
        const related = data.products
          .filter(p => p._id !== id && p.status === 'active')
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Fetch related products error:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  // ✅ Reset quantity when color changes
  useEffect(() => {
    if (selectedColorObj) {
      setQuantity(1);
    }
  }, [selectedColorObj]);

  const addToCart = async () => {
    if (!product || product.price === null || product.price === undefined) return;
    
    if (!selectedColorObj) {
      setError('Please select a color');
      return;
    }

    // ✅ Validate quantity against available stock
    if (selectedColorObj.quantity !== null) {
      if (quantity > selectedColorObj.quantity) {
        setError(`Only ${selectedColorObj.quantity} available in stock`);
        return;
      }
    }
    
    if (!isCustomerAuthenticated()) {
      const pendingItem = {
        _id: product._id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        images: product.images,
        selectedColor: selectedColorObj.name,
        quantity,
        modelNumber: product.modelNumber,
        gender: product.gender,
        watchShape: product.watchShape,
        productType: product.productType
      };
      
      sessionStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      navigate('/login', { state: { from: `/shop/${id}` } });
      return;
    }

    try {
      const token = getCustomerToken();
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          selectedColor: selectedColorObj.name,
          quantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToastMessage('Added to cart successfully!');
        setError(''); // Clear any errors
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        setError(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setError('Network error. Please try again.');
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  const getCategoryDisplay = () => {
    if (product?.productType === 'wall_clock') return 'Wall Clock';
    switch(product?.gender) {
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'kids': return 'Kids';
      case 'unisex': return 'Unisex';
      default: return 'Unisex';
    }
  };

  const getCategoryBadgeClass = () => {
    if (product?.productType === 'wall_clock') return 'bg-amber-900/30 text-amber-300';
    switch(product?.gender) {
      case 'men': return 'bg-blue-900/30 text-blue-300';
      case 'women': return 'bg-pink-900/30 text-pink-300';
      case 'kids': return 'bg-green-900/30 text-green-300';
      case 'unisex': return 'bg-gray-800 text-gray-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  // ✅ Handle quantity change with validation
  const handleQuantityChange = (newQty) => {
    if (!selectedColorObj) return;
    
    // Validate against available stock
    if (selectedColorObj.quantity !== null) {
      const maxQty = selectedColorObj.quantity;
      setQuantity(Math.max(1, Math.min(newQty, maxQty)));
    } else {
      // No stock limit
      setQuantity(Math.max(1, newQty));
    }
  };

  // ✅ Get max quantity for selected color
  const getMaxQuantity = () => {
    if (!selectedColorObj || selectedColorObj.quantity === null) {
      return 999; // No limit
    }
    return selectedColorObj.quantity;
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <ScrollToTop />
        <div className="max-w-7xl mx-auto py-24 px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-black text-white min-h-screen">
        <ScrollToTop />
        <div className="max-w-7xl mx-auto py-24 px-4 text-center">
          <div className="text-6xl mb-4">⌚</div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBackToShop}
            className="bg-gold text-black px-6 py-2 rounded-lg font-medium hover:bg-gold/90 transition"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const allMedia = [...(product.images || [])];
  if (product.video) allMedia.push(product.video);
  const isVideo = mainImageIndex >= (product.images?.length || 0) && product.video;

  // ✅ Get parsed colors
  const productColors = parseProductColors(product);

  return (
    <div className="bg-black text-white min-h-screen relative">
      <ScrollToTop />
      
      <Toast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
        onClose={() => setToastMessage('')} 
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBackToShop}
            className="flex items-center text-gray-400 hover:text-gold transition text-sm group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Media Gallery */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4">
              {isVideo ? (
                <video
                  src={product.video}
                  controls
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img
                  src={product.images?.[mainImageIndex] || ''}
                  alt={product.title}
                  className="max-h-[85%] max-w-[85%] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>

            {allMedia.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allMedia.map((media, index) => {
                  const isThumbVideo = index >= (product.images?.length || 0);
                  return (
                    <button
                      key={index}
                      onClick={() => setMainImageIndex(index)}
                      className={`bg-gray-900/40 backdrop-blur border rounded-lg overflow-hidden aspect-square flex items-center justify-center transition-all relative ${
                        mainImageIndex === index 
                          ? 'border-gold shadow-lg shadow-gold/20' 
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {isThumbVideo ? (
                        <div className="relative w-full h-full">
                          {/* Video thumbnail */}
                          <video
                            src={media}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          {/* Play icon overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                            <div className="bg-gold/90 rounded-full p-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media}
                          alt={`Thumbnail ${index + 1}`}
                          className="max-h-[80%] max-w-[80%] object-contain p-0.5"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-gold text-sm font-semibold tracking-wide mb-2">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{product.title}</h1>
              <div className="flex items-center text-gray-400 text-sm space-x-2">
                <span>{getCategoryDisplay()}</span>
                <span>•</span>
                <span>{product.watchShape}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {formatPrice(product.price)}
              </div>
              
              {product.price === null || product.price === undefined ? (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Please contact our luxury specialists for pricing details and availability.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto bg-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-gold/90 transition shadow-lg shadow-gold/20"
                  >
                    Contact for Pricing
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ✅ IMPROVED COLOR SELECTION */}
                  {productColors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Available Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {productColors.map((colorObj, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColorObj(colorObj)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              selectedColorObj?.name === colorObj.name
                                ? 'bg-gold text-black shadow-md ring-2 ring-gold/50'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            }`}
                          >
                            {colorObj.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* ✅ SHOW AVAILABLE QUANTITY AFTER COLOR SELECTION */}
                      {selectedColorObj && selectedColorObj.quantity !== null && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-400 font-medium">
                            {selectedColorObj.quantity} {selectedColorObj.quantity === 1 ? 'item' : 'items'} in stock
                          </span>
                        </div>
                      )}
                      
                      {selectedColorObj && selectedColorObj.quantity === null && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-blue-400 font-medium">
                            Available
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ IMPROVED QUANTITY SELECTOR WITH VALIDATION */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-l-lg text-white hover:bg-gray-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-16 h-10 bg-black border-y border-gray-700 text-white flex items-center justify-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={selectedColorObj && selectedColorObj.quantity !== null && quantity >= selectedColorObj.quantity}
                          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-r-lg text-white hover:bg-gray-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* ✅ Show max quantity info */}
                      {selectedColorObj && selectedColorObj.quantity !== null && (
                        <span className="text-gray-400 text-sm">
                          Max: {selectedColorObj.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ Show error message if any */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-300 text-sm">{error}</span>
                    </div>
                  )}

                  <button
                    onClick={addToCart}
                    disabled={!selectedColorObj || (selectedColorObj.quantity !== null && selectedColorObj.quantity === 0)}
                    className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedColorObj && selectedColorObj.quantity === 0 
                      ? 'Out of Stock' 
                      : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* ✅ IMPROVED SPECIFICATIONS WITH CUSTOM SPECS */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
              <div className="space-y-3">
                {product.modelNumber && product.modelNumber !== 'N/A' && (
                  <div className="flex justify-between pb-2 border-b border-gray-800/50">
                    <span className="text-gray-400 text-sm">Model Number</span>
                    <span className="text-white text-sm">{product.modelNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Brand</span>
                  <span className="text-white text-sm">{product.brand}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Category</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${getCategoryBadgeClass()}`}>
                    {getCategoryDisplay()}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Shape</span>
                  <span className="text-white text-sm">{product.watchShape}</span>
                </div>
                
                {/* ✅ DISPLAY CUSTOM SPECIFICATIONS */}
                {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                  <>
                    {product.specifications.map((spec, idx) => {
                      // Handle both object format and old format
                      const key = typeof spec === 'object' ? spec.key : spec;
                      const value = typeof spec === 'object' ? spec.value : '';
                      
                      if (!key || !value) return null;
                      
                      return (
                        <div key={idx} className="flex justify-between pb-2 border-b border-gray-800/50">
                          <span className="text-gray-400 text-sm">{key}</span>
                          <span className="text-white text-sm">{value}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Return & Warranty */}
            <div className="pt-6 border-t border-gray-800/50 mt-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <div className="flex items-center gap-2 bg-black/40 border border-gray-800 rounded-lg px-4 py-2.5">
                  <div className="bg-gold/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">7-Day Returns</p>
                    <p className="text-gray-400 text-xs">Hassle-free returns</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 border border-gray-800 rounded-lg px-4 py-2.5">
                  <div className="bg-gray-700 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <Link 
                    to="/privacy" 
                    className="text-white text-sm font-medium hover:text-gold transition"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">Need Assistance?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Our specialists are available to provide personalized consultation 
                and answer any questions about this {product.productType === 'wall_clock' ? 'wall clock' : 'timepiece'}.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="text-gold hover:text-white text-sm font-medium flex items-center group"
              >
                Contact Our Experts
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ✅ RELATED PRODUCTS WITH PROPER COLOR HANDLING */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {product.productType === 'wall_clock' 
                ? 'You May Also Like Wall Clocks' 
                : 'You May Also Like Watches'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/shop/${relatedProduct._id}`)}
                >
                  {/* Image Container - Mobile Optimized */}
                  <div className="aspect-square bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden mb-3 transition-all hover:border-gold">
                    {relatedProduct.images?.[0] ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-1">{relatedProduct.brand}</p>
                    <p className="text-gold text-sm font-medium">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;