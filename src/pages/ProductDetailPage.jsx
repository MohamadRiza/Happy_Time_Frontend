// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
// ✅ MAKE SURE THESE IMPORTS ARE CORRECT
import { 
  isCustomerAuthenticated, 
  getCustomer,
  getCustomerToken // ✅ Added this import
} from '../utils/auth';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const videoRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ✅ GET ROUTER HOOKS
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      const data = await res.json();
      
      if (data.success) {
        setProduct(data.product);
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products
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
      // Silently fail
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  // ✅ SERVER-SIDE ADD TO CART FUNCTION
  const addToCart = async () => {
    // ✅ DEBUG: Add console log to verify function is called
    console.log('Add to Cart clicked!');
    
    if (!product || product.price === null || product.price === undefined) {
      console.log('Invalid product or price');
      return;
    }
    
    // ✅ Check authentication
    if (!isCustomerAuthenticated()) {
      console.log('User not authenticated - redirecting to login');
      
      // Store pending item
      const pendingItem = {
        _id: product._id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        images: product.images,
        selectedColor,
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
      // ✅ Get customer token for API authentication
      const token = getCustomerToken();
      
      // ✅ Make API call to server
      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          selectedColor,
          quantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Success feedback
        setSuccessMessage('Added to cart successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Update navbar cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        console.log('Item added to cart via API:', data.cart);
      } else {
        setError(data.message || 'Failed to add to cart');
        console.error('API Error:', data);
      }
    } catch (err) {
      console.error('Add to cart API error:', err);
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
      case 'boy': return 'Boy';
      case 'girl': return 'Girl';
      default: return 'Unisex';
    }
  };

  const getCategoryBadgeClass = () => {
    if (product?.productType === 'wall_clock') return 'bg-amber-900/30 text-amber-300';
    switch(product?.gender) {
      case 'men': return 'bg-blue-900/30 text-blue-300';
      case 'women': return 'bg-pink-900/30 text-pink-300';
      case 'boy': return 'bg-green-900/30 text-green-300';
      case 'girl': return 'bg-purple-900/30 text-purple-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const handleBackToShop = () => {
    navigate('/shop');
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

  if (error) {
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

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBackToShop}
            className="flex items-center text-gray-400 hover:text-gold transition text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4">
              {isVideo ? (
                <div className="w-full h-full">
                  <video
                    ref={videoRef}
                    src={product.video}
                    controls
                    className="w-full h-full object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              ) : (
                <img
                  src={product.images?.[mainImageIndex] || ''}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain p-6"
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
                      className={`bg-gray-900 border rounded-lg overflow-hidden aspect-square flex items-center justify-center transition-all ${
                        mainImageIndex === index 
                          ? 'border-gold shadow-lg shadow-gold/20' 
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {isThumbVideo ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <img
                          src={media}
                          alt={`Thumbnail ${index + 1}`}
                          className="max-h-full max-w-full object-contain p-1"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-gold text-sm font-medium mb-2">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.title}</h1>
              <div className="flex items-center text-gray-400 text-sm">
                <span>{getCategoryDisplay()}</span>
                <span className="mx-2">•</span>
                <span>{product.watchShape}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {formatPrice(product.price)}
              </div>
              
              {product.price === null || product.price === undefined ? (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Please contact our luxury specialists for pricing details and availability.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto bg-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-gold/90 transition"
                  >
                    Contact for Pricing
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {product.colors?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Available Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                              selectedColor === color
                                ? 'bg-gold text-black'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.price !== null && product.price !== undefined && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                      <div className="flex items-center max-w-32">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-l-lg text-white hover:bg-gray-700 transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-12 h-10 bg-black border-y border-gray-700 text-white flex items-center justify-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-r-lg text-white hover:bg-gray-700 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ✅ SERVER-SIDE CART BUTTON */}
                  {product.price !== null && product.price !== undefined ? (
                    <button
                      onClick={addToCart} // ✅ NOW USES SERVER-SIDE FUNCTION
                      className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-gold/90 transition"
                    >
                      Contact for Purchase
                    </button>
                  )}

                  {successMessage && (
                    <p className="text-green-400 text-center text-sm">{successMessage}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
              <div className="space-y-3">
                {product.modelNumber && product.modelNumber !== 'N/A' && (
                  <div className="flex justify-between pb-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm">Model Number</span>
                    <span className="text-white text-sm">{product.modelNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Brand</span>
                  <span className="text-white text-sm">{product.brand}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Category</span>
                  <span className={`text-sm ${getCategoryBadgeClass()}`}>
                    {getCategoryDisplay()}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Shape</span>
                  <span className="text-white text-sm">{product.watchShape}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 mt-auto">
              <h3 className="text-lg font-semibold text-white mb-3">Need Assistance?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Our specialists are available to provide personalized consultation 
                and answer any questions about this {product.productType === 'wall_clock' ? 'wall clock' : 'timepiece'}.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="text-gold hover:text-white text-sm font-medium flex items-center"
              >
                Contact Our Experts
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              {product.productType === 'wall_clock' 
                ? 'You May Also Like Wall Clocks' 
                : 'You May Also Like Watches'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gold transition-all cursor-pointer"
                  onClick={() => navigate(`/shop/${relatedProduct._id}`)}
                >
                  {relatedProduct.images?.[0] ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-800">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1 mb-1">
                      {relatedProduct.title}
                    </h3>
                    <span className="text-gold text-xs">{relatedProduct.brand}</span>
                    <p className="text-gray-400 text-sm mt-2">
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