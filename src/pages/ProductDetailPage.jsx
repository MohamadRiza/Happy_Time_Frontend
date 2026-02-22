//https://chat.qwen.ai/c/7d6c0f8e-38cd-4481-a62b-623987138c8e  (USE Slug Based URLS for better SEO)
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
import GuestPrompt from '../components/GuestPrompt';

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
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  // Touch refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const galleryTouchStartX = useRef(0);
  const galleryTouchEndX = useRef(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

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

  // ✅ Swipe handlers (main image)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    const allMedia = [...(product.images || []), ...(product.videos || [])];
    if (allMedia.length <= 1) return;
    if (diff > 50) {
      setMainImageIndex(prev => (prev + 1) % allMedia.length);
    } else if (diff < -50) {
      setMainImageIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
    }
  };

  // ✅ Gallery swipe
  const handleGalleryTouchStart = (e) => {
    galleryTouchStartX.current = e.touches[0].clientX;
  };

  const handleGalleryTouchEnd = (e) => {
    galleryTouchEndX.current = e.changedTouches[0].clientX;
    const allMedia = [...(product.images || []), ...(product.videos || [])];
    if (allMedia.length <= 1) return;
    const diff = galleryTouchStartX.current - galleryTouchEndX.current;
    if (diff > 50) {
      setGalleryCurrentIndex(prev => (prev + 1) % allMedia.length);
    } else if (diff < -50) {
      setGalleryCurrentIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
    }
  };

  const openGallery = (index) => {
    setGalleryCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const navigateGallery = (direction) => {
    const allMedia = [...(product.images || []), ...(product.videos || [])];
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

  const handleQuantityInputFocus = (e) => {
    e.target.select();
  };

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

  const allMedia = [...(product.images || []), ...(product.videos || [])];
  const isVideo = mainImageIndex >= (product.images?.length || 0);
  const currentMediaUrl = allMedia[mainImageIndex];
  const productColors = parseProductColors(product);
  const totalMedia = allMedia.length;
  const visibleThumbnails = 4;

  // For thumbnail navigation
  const visibleMedia = allMedia.slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails);

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* <GuestPrompt> */}
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

      {/* Gallery Modal */}
      {galleryOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              ✕
            </button>
            
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
            
            <div 
              className="relative w-full h-full"
              onTouchStart={handleGalleryTouchStart}
              onTouchEnd={handleGalleryTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryCurrentIndex >= (product.images?.length || 0) ? (
                <video
                  src={allMedia[galleryCurrentIndex]}
                  controls
                  className="w-full h-full max-h-[80vh] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img
                  src={allMedia[galleryCurrentIndex] || ''}
                  alt={`${product.title} - ${galleryCurrentIndex + 1}`}
                  className="w-full h-full max-h-[80vh] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {galleryCurrentIndex + 1} / {totalMedia}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Media Gallery */}
          <div>
            {/* Main Image/Video */}
            <div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4 relative cursor-pointer"
              onTouchStart={isTouchDevice ? handleTouchStart : undefined}
              onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
              onClick={() => openGallery(mainImageIndex)}
            >
              {isVideo ? (
                <video
                  src={currentMediaUrl}
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img
                  src={currentMediaUrl || ''}
                  alt={product.title}
                  className="max-h-[85%] max-w-[85%] object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/60 px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-sm">View Gallery ({totalMedia})</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {totalMedia > 0 && (
              <div className="relative">
                {/* Navigation Arrows */}
                {totalMedia > visibleThumbnails && (
                  <>
                    <button
                      onClick={() => setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1))}
                      disabled={thumbnailStartIndex === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center ${
                        thumbnailStartIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/80'
                      }`}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setThumbnailStartIndex(Math.min(totalMedia - visibleThumbnails, thumbnailStartIndex + 1))}
                      disabled={thumbnailStartIndex + visibleThumbnails >= totalMedia}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center ${
                        thumbnailStartIndex + visibleThumbnails >= totalMedia ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/80'
                      }`}
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-hidden">
                  {visibleMedia.map((media, idx) => {
                    const globalIndex = thumbnailStartIndex + idx;
                    const isThumbVideo = globalIndex >= (product.images?.length || 0);
                    return (
                      <button
                        key={globalIndex}
                        onClick={() => {
                          setMainImageIndex(globalIndex);
                          openGallery(globalIndex);
                        }}
                        className={`flex-shrink-0 bg-gray-900/40 backdrop-blur border rounded-lg overflow-hidden aspect-square flex items-center justify-center transition-all relative ${
                          mainImageIndex === globalIndex
                            ? 'border-gold shadow-lg shadow-gold/20'
                            : 'border-gray-800 hover:border-gray-600'
                        }`}
                        style={{ width: 'calc(25% - 6px)' }}
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
                              <div className="bg-gold/90 rounded-full p-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media}
                            alt={`Thumbnail ${globalIndex + 1}`}
                            className="max-h-[80%] max-w-[80%] object-contain p-0.5"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand & Title */}
            <div className="mb-3">
              <p className="text-gold text-sm font-semibold tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{product.title}</h1>
            </div>

            {/* Category & Shape */}
            <div className="flex items-center text-gray-400 text-sm space-x-2 mb-4">
              <span>{getCategoryDisplay()}</span>
              <span>•</span>
              <span>{product.watchShape}</span>
            </div>

            {/* Price */}
            <div className="mb-5">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {formatPrice(product.price)}
              </div>
              
              {product.price === null || product.price === undefined ? (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Please contact our luxury specialists for pricing details and.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-gold/90 transition shadow-lg shadow-gold/20"
                  >
                    Contact for Pricing
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Available Colors */}
                  {productColors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Available Colors</h3>
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

                  {/* Quantity Selector */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="w-12 h-10 bg-black border-y border-gray-700 text-white text-center font-medium [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={selectedColorObj && selectedColorObj.quantity !== null && quantity >= selectedColorObj.quantity}
                          className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={addToCart}
                      disabled={!selectedColorObj || (selectedColorObj.quantity !== null && selectedColorObj.quantity === 0)}
                      className="flex-1 bg-gold text-black py-3.5 rounded-xl font-bold text-lg hover:bg-gold/90 transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
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

            {/* Wholesale Dealer Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-900/70 to-black/70 border border-yellow-500/40 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gold mb-1">Wholesale Dealers</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Are you a registered wholesale dealer or retailer? Contact our team before placing your order to receive exclusive wholesale pricing and terms.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/94763009123"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.813.735 5.44 2.02 7.746L0 32l8.413-2.008A15.957 15.957 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.566 22.486c-.33.92-1.927 1.77-2.689 1.86-.717.083-1.598.115-5.488-2.078-4.572-2.566-7.506-9.118-7.718-9.505-.212-.388-1.715-2.452-1.715-4.676 0-2.224 1.112-3.316 1.507-3.765.397-.449.87-.575 1.164-.575.295 0 .59.003.847.01.273.007.64-.103.997.774.355.875 1.203 3.03 1.31 3.25.107.22.178.483-.106.775-.283.293-.515.637-.736.95-.223.314-.47.66-.218 1.05.252.388 1.124 1.853 2.406 2.998 1.657 1.55 3.041 2.07 3.534 2.3.493.229.781.191.975.116.193-.076.588-.22 1.074-.532.485-.313 1.28-1.488 1.457-2.926.176-1.438.176-2.658-.124-2.926-.3-.268-.557-.318-.747-.316-.19.003-.41.003-.63.003-.22 0-.577-.082-.88.623-.302.704-1.2 1.49-1.2 1.49s-.173.22-.31.365c-.137.145-.28.3-.28.3s-.263.22-.1.55c.163.33.744 1.205.8 1.29.056.085.93 1.56 2.39 2.51 1.46.95 2.285.905 2.62.85.334-.055 1.085-.44 1.238-.87.153-.43.153-.8.106-.88z"/>
                      </svg>
                      WhatsApp Us
                    </a>
                    <button
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 px-4 py-2 rounded-lg font-medium transition-all"
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

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Specifications</h2>
              <div className="space-y-2">
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
            <div className="pt-4 border-t border-gray-800/50 mt-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

              <h3 className="text-lg font-semibold text-white mb-2">Need Assistance?</h3>
              <p className="text-gray-400 text-sm mb-3">
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
          <div className="mt-12 pt-8 border-t border-gray-800/50">
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
                        className="w-full h-full object-contain"
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
        {/* </GuestPrompt> */}
    </div>
  );
};

export default ProductDetailPage;