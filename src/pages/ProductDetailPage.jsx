// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import { 
  isCustomerAuthenticated, 
  getCustomerToken 
} from '../utils/auth';
import Loading from '../components/Loading';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColorObj, setSelectedColorObj] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(0);

  // Refs for touch/swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const galleryTouchStartX = useRef(0);
  const galleryTouchEndX = useRef(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // ✅ HELPER: Parse colors from product
  const parseProductColors = (product) => {
    if (!product?.colors || !Array.isArray(product.colors)) return [];
    
    return product.colors.map(color => {
      if (typeof color === 'object' && color.name) {
        return {
          name: color.name,
          quantity: color.quantity !== null && color.quantity !== undefined ? color.quantity : null
        };
      }
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
        const colors = parseProductColors(data.product);
        if (colors.length > 0) {
          setSelectedColorObj(colors[0]);
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

  useEffect(() => {
    if (selectedColorObj) {
      setQuantity(1);
    }
  }, [selectedColorObj]);

  // ✅ Handle main image touch start for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // ✅ Handle main image touch end for swipe
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  // ✅ Handle main image swipe logic
  const handleSwipe = () => {
    const allMedia = [...(product.images || [])];
    if (product.video) allMedia.push(product.video);
    
    if (allMedia.length <= 1) return;
    
    const minSwipeDistance = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (diff > minSwipeDistance) {
      // Swipe left - next image
      setMainImageIndex(prev => (prev + 1) % allMedia.length);
    } else if (diff < -minSwipeDistance) {
      // Swipe right - previous image
      setMainImageIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
    }
  };

  // ✅ Handle gallery touch start for swipe
  const handleGalleryTouchStart = (e) => {
    galleryTouchStartX.current = e.touches[0].clientX;
  };

  // ✅ Handle gallery touch end for swipe
  const handleGalleryTouchEnd = (e) => {
    galleryTouchEndX.current = e.changedTouches[0].clientX;
    handleGallerySwipe();
  };

  // ✅ Handle gallery swipe logic
  const handleGallerySwipe = () => {
    const allMedia = [...(product.images || [])];
    if (product.video) allMedia.push(product.video);
    
    if (allMedia.length <= 1) return;
    
    const minSwipeDistance = 50;
    const diff = galleryTouchStartX.current - galleryTouchEndX.current;
    
    if (diff > minSwipeDistance) {
      // Swipe left - next image
      setGalleryCurrentIndex(prev => (prev + 1) % allMedia.length);
    } else if (diff < -minSwipeDistance) {
      // Swipe right - previous image
      setGalleryCurrentIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
    }
  };

  // ✅ Open gallery modal
  const openGallery = (index) => {
    setGalleryCurrentIndex(index);
    setGalleryOpen(true);
  };

  // ✅ Close gallery modal
  const closeGallery = () => {
    setGalleryOpen(false);
  };

  // ✅ Navigate to next/previous in gallery
  const navigateGallery = (direction) => {
    const allMedia = [...(product.images || [])];
    if (product.video) allMedia.push(product.video);
    
    if (direction === 'next') {
      setGalleryCurrentIndex(prev => (prev + 1) % allMedia.length);
    } else {
      setGalleryCurrentIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
    }
  };

  const addToCart = async () => {
    if (!product || product.price === null || product.price === undefined) return;
    
    if (!selectedColorObj) {
      toast.error('Please select a color');
      return;
    }

    if (selectedColorObj.quantity !== null && quantity > selectedColorObj.quantity) {
      toast.error(`Only ${selectedColorObj.quantity} available in stock`);
      return;
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
        toast.success('Added to cart successfully!');
        setError('');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        toast.error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const goToCart = () => {
    navigate('/cart');
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

  // ✅ Handle quantity input change
  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity(1);
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const maxQty = getMaxQuantity();
      setQuantity(Math.max(1, Math.min(numValue, maxQty)));
    }
  };

  // ✅ Handle quantity input focus (select all text)
  const handleQuantityInputFocus = (e) => {
    e.target.select();
  };

  // ✅ Handle quantity change with validation
  const handleQuantityChange = (newQty) => {
    if (!selectedColorObj) return;
    
    if (selectedColorObj.quantity !== null) {
      const maxQty = selectedColorObj.quantity;
      setQuantity(Math.max(1, Math.min(newQty, maxQty)));
    } else {
      setQuantity(Math.max(1, newQty));
    }
  };

  const getMaxQuantity = () => {
    if (!selectedColorObj || selectedColorObj.quantity === null) {
      return 999;
    }
    return selectedColorObj.quantity;
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <ScrollToTop />
        <Loading message="Loading product details..." size="large" />
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    );
  }

  if (!product) return null;

  const allMedia = [...(product.images || [])];
  if (product.video) allMedia.push(product.video);
  const isVideo = mainImageIndex >= (product.images?.length || 0) && product.video;
  const productColors = parseProductColors(product);

  return (
    <div className="bg-black text-white min-h-screen relative">
      <ScrollToTop />
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* ✅ GALLERY MODAL */}
      {galleryOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              ✕
            </button>
            
            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              ›
            </button>
            
            {/* Main media */}
            <div 
              className="relative w-full h-full"
              onTouchStart={handleGalleryTouchStart}
              onTouchEnd={handleGalleryTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryCurrentIndex >= (product.images?.length || 0) && product.video ? (
                <video
                  src={product.video}
                  controls
                  className="w-full h-full max-h-[80vh] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img
                  src={product.images?.[galleryCurrentIndex] || ''}
                  alt={`${product.title} - ${galleryCurrentIndex + 1}`}
                  className="w-full h-full max-h-[80vh] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>
            
            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {galleryCurrentIndex + 1} / {allMedia.length}
            </div>
          </div>
        </div>
      )}

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
            <div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4 relative cursor-pointer"
              onTouchStart={isTouchDevice ? handleTouchStart : undefined}
              onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
              onClick={() => openGallery(mainImageIndex)}
            >
              {isVideo ? (
                <video
                  src={product.video}
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
              
              {/* Click to view gallery indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/60 px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-sm">View Gallery</span>
                </div>
              </div>
              
              {/* Mobile swipe indicators */}
              {isTouchDevice && allMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allMedia.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === mainImageIndex ? 'bg-gold' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {allMedia.length > 1 && !isTouchDevice && (
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
                          <video
                            src={media}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
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
                  {/* Color Selection */}
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
                      
                      {/* Stock Status */}
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

                  {/* Quantity Selector with Input */}
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
                        <input
                          type="number"
                          min="1"
                          max={getMaxQuantity()}
                          value={quantity}
                          onChange={handleQuantityInputChange}
                          onFocus={handleQuantityInputFocus}
                          className="w-16 h-10 bg-black border-y border-gray-700 text-white flex items-center justify-center font-medium text-center [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={selectedColorObj && selectedColorObj.quantity !== null && quantity >= selectedColorObj.quantity}
                          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-r-lg text-white hover:bg-gray-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      
                      {selectedColorObj && selectedColorObj.quantity !== null && (
                        <span className="text-gray-400 text-sm">
                          Max: {selectedColorObj.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={addToCart}
                      disabled={!selectedColorObj || (selectedColorObj.quantity !== null && selectedColorObj.quantity === 0)}
                      className="flex-1 bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {selectedColorObj && selectedColorObj.quantity === 0 
                        ? 'Out of Stock' 
                        : 'Add to Cart'}
                    </button>
                    <button
                      onClick={goToCart}
                      className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ WHOLESALE DEALER MESSAGE */}
            <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-300 mb-2">Wholesale Dealers</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Are you a registered wholesale dealer or retailer? Contact our team before placing your order to receive exclusive wholesale pricing and terms.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/94757575565"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.789-1.485-1.734-1.658-2.032-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.644-.506-.158-.005-.347-.005-.52-.005-.173 0-.471.074-.719.372-.247.297-1.016 1.016-1.016 2.489 0 1.473 1.068 2.922 1.217 3.12.149.199 2.096 3.17 5.077 4.485.709.313 1.262.49 1.694.622.712.219 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.726 9.726 0 01-4.83-1.318l-.361-.21-.36.21a9.726 9.726 0 01-4.83 1.318 2.94 2.94 0 01-3.54-3.54 9.765 9.765 0 011.318-4.83l.21-.36-.21-.36a9.726 9.726 0 01-1.318-4.83 2.94 2.94 0 013.54-3.54 9.726 9.726 0 014.83-1.318l.361.21.36-.21a9.726 9.726 0 014.83 1.318 2.94 2.94 0 013.54 3.54 9.726 9.726 0 011.318 4.83l-.21.36.21.36a9.726 9.726 0 011.318 4.83 2.94 2.94 0 01-3.54 3.54z" />
                      </svg>
                      WhatsApp Us
                    </a>
                    <button
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Team
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
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
                
                {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                  <>
                    {product.specifications.map((spec, idx) => {
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

        {/* Related Products */}
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