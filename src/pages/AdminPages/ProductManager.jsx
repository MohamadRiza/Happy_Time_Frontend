import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: 'Rolex',
    customBrand: '',
    price: '',
    modelNumber: '',
    watchShape: 'Round',
    gender: 'men',
    productType: 'watch',
    colors: [{ name: '', quantity: '' }],
    featured: false,
    specifications: [{ key: '', value: '' }]
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ✅ NEW: Track which image is the thumbnail (index)
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    search: '',
    brand: 'all',
    productType: 'all',
    gender: 'all',
    featured: 'all'
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const formBrands = ['Rolex', 'Omega', 'Citizen', 'Orix', 'Winsor', 'Arial', 'Patek Philippe', 'Audemars Piguet', 'Other'];
  const watchShapes = ['Round', 'Square', 'Rectangular', 'Oval', 'Tonneau', 'Other'];
  const wristWatchGenders = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'kids', label: 'Kids' }
  ];
  const productTypes = [
    { value: 'all', label: 'All Products' },
    { value: 'watch', label: 'Wrist Watch' },
    { value: 'wall_clock', label: 'Wall Clock' }
  ];
  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'kids', label: 'Kids' }
  ];
  const featuredOptions = [
    { value: 'all', label: 'All' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Non-Featured' }
  ];

  const countWords = (str) => {
    if (!str?.trim()) return 0;
    return str.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        const uniqueBrands = [...new Set((data.products || []).map(p => p.brand))];
        setAvailableBrands(uniqueBrands.sort());
      } else {
        toast.error(data.message || 'Failed to load products');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchFilters.search) {
      const query = searchFilters.search.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.modelNumber && product.modelNumber.toLowerCase().includes(query))
      );
    }
    if (searchFilters.brand !== 'all') {
      result = result.filter(product => product.brand === searchFilters.brand);
    }
    if (searchFilters.productType !== 'all') {
      result = result.filter(product => product.productType === searchFilters.productType);
    }
    if (searchFilters.gender !== 'all') {
      result = result.filter(product =>
        product.productType === 'wall_clock' ||
        product.gender === searchFilters.gender
      );
    }
    if (searchFilters.featured !== 'all') {
      const isFeatured = searchFilters.featured === 'true';
      result = result.filter(product => product.featured === isFeatured);
    }
    setFilteredProducts(result);
  }, [searchFilters, products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleProductTypeChange = (e) => {
    const productType = e.target.value;
    let gender = formData.gender;
    if (productType === 'wall_clock') gender = '';
    else if (!['men', 'women', 'unisex', 'kids'].includes(gender)) gender = 'men';
    setFormData(prev => ({ ...prev, productType, gender }));
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFormData(prev => ({ ...prev, brand, customBrand: brand === 'Other' ? '' : prev.customBrand }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, { name: '', quantity: '' }] });
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData({ ...formData, colors: newColors });
    }
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { key: '', value: '' }] });
  };

  const removeSpecification = (index) => {
    if (formData.specifications.length > 1) {
      const newSpecs = formData.specifications.filter((_, i) => i !== index);
      setFormData({ ...formData, specifications: newSpecs });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.some(file => file.size > 6 * 1024 * 1024);
    if (oversized) {
      toast.error('Image too large! Maximum size: 6MB per image.');
      return;
    }
    const selectedFiles = files.slice(0, 15);
    setImageFiles(selectedFiles);
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
    setThumbnailIndex(0); // Reset to first when new images uploaded
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const selectedFiles = files.slice(0, 2);
    for (const file of selectedFiles) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Video too large! Maximum size: 20MB per video.');
        return;
      }
    }
    const validVideos = [];
    const checkDuration = (file) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 60) resolve(null);
          else resolve(file);
        };
        video.onerror = () => resolve(null);
        video.src = URL.createObjectURL(file);
      });
    };
    Promise.all(selectedFiles.map(checkDuration)).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length === 0) {
        toast.error('Each video must be less than 1 minute long.');
        return;
      }
      setVideoFiles(valid);
      const previews = valid.map(f => URL.createObjectURL(f));
      setPreviewVideos(previews);
    });
  };

  const validateForm = () => {
    const { title, description, brand, customBrand, price, modelNumber, productType, gender } = formData;
    const finalBrand = brand === 'Other' ? customBrand.trim() : brand;

    if (!title?.trim()) { toast.error('Title is required'); return false; }
    if (!description?.trim()) { toast.error('Description is required'); return false; }
    if (!finalBrand) { toast.error('Brand is required'); return false; }
    if (productType === 'watch' && !gender) { toast.error('Gender is required for wrist watches'); return false; }
    if (imageFiles.length === 0 && !editingId) { toast.error('Please upload at least one image'); return false; }

    if (price !== '') {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) { toast.error('Price must be a valid non-negative number'); return false; }
      if (priceNum.toString().length > 10) { toast.error('Price cannot exceed 10 digits (max: 9,999,999,999)'); return false; }
    }

    if (modelNumber.trim().length > 20) { toast.error('Model number cannot exceed 20 characters'); return false; }
    if (countWords(description) > 200) { toast.error('Description cannot exceed 200 words'); return false; }

    const validColors = formData.colors.filter(color => color.name.trim());
    if (validColors.length === 0) { toast.error('At least one color combination is required'); return false; }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUploading(true);

    const finalBrand = formData.brand === 'Other' ? formData.customBrand.trim() : formData.brand;
    const validColors = formData.colors.filter(color => color.name.trim());

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('brand', finalBrand);
    formDataToSend.append('productType', formData.productType);
    if (formData.productType === 'watch') formDataToSend.append('gender', formData.gender);
    formDataToSend.append('featured', formData.featured.toString());
    if (formData.price) formDataToSend.append('price', formData.price);
    formDataToSend.append('modelNumber', formData.modelNumber.trim() || 'N/A');
    formDataToSend.append('watchShape', formData.watchShape);

    validColors.forEach((color, index) => {
      formDataToSend.append(`colors[${index}][name]`, color.name.trim());
      if (color.quantity && !isNaN(color.quantity)) {
        formDataToSend.append(`colors[${index}][quantity]`, color.quantity.toString());
      }
    });

    formData.specifications.forEach((spec, index) => {
      if (spec.key.trim() && spec.value.trim()) {
        formDataToSend.append(`specifications[${index}][key]`, spec.key.trim());
        formDataToSend.append(`specifications[${index}][value]`, spec.value.trim());
      }
    });

    // ✅ REORDER IMAGES: move selected thumbnail to index 0
    const reorderedImageFiles = [...imageFiles];
    if (thumbnailIndex !== 0) {
      const temp = reorderedImageFiles[0];
      reorderedImageFiles[0] = reorderedImageFiles[thumbnailIndex];
      reorderedImageFiles[thumbnailIndex] = temp;
    }
    reorderedImageFiles.forEach(file => {
      formDataToSend.append('images', file);
    });

    videoFiles.forEach(file => formDataToSend.append('videos', file));

    try {
      const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formDataToSend,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? 'Product updated!' : 'Product created!');
        fetchProducts();
        resetForm();
      } else {
        toast.error(data.message || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      brand: 'Rolex',
      customBrand: '',
      price: '',
      modelNumber: '',
      watchShape: 'Round',
      gender: 'men',
      productType: 'watch',
      colors: [{ name: '', quantity: '' }],
      featured: false,
      specifications: [{ key: '', value: '' }]
    });
    setImageFiles([]);
    setVideoFiles([]);
    setPreviewImages([]);
    setPreviewVideos([]);
    setThumbnailIndex(0);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    const isCustomBrand = !formBrands.includes(product.brand) || product.brand === 'Other';
    const brand = isCustomBrand ? 'Other' : product.brand;
    const customBrand = isCustomBrand ? product.brand : '';
    let genderValue = product.gender || 'men';
    if (genderValue === 'boy' || genderValue === 'girl') genderValue = 'kids';

    const colors = product.colors?.length > 0
      ? product.colors.map(c => ({ name: c.name || '', quantity: c.quantity != null ? c.quantity.toString() : '' }))
      : [{ name: '', quantity: '' }];

    const specs = product.specifications?.length > 0
      ? product.specifications.map(s => ({ key: s.key || '', value: s.value || '' }))
      : [{ key: '', value: '' }];

    setFormData({
      title: product.title,
      description: product.description,
      brand,
      customBrand,
      price: product.price?.toString() || '',
      modelNumber: product.modelNumber || '',
      watchShape: product.watchShape,
      gender: genderValue,
      productType: product.productType || 'watch',
      colors,
      featured: product.featured || false,
      specifications: specs
    });

    setPreviewImages(product.images || []);
    setPreviewVideos(product.videos || []);
    setThumbnailIndex(0); // On edit, first image is assumed thumbnail (matches backend)
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted!');
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const getProductCategory = (product) => {
    if (product.productType === 'wall_clock') return 'Wall Clock';
    switch (product.gender) {
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'unisex': return 'Unisex';
      case 'kids': return 'Kids';
      default: return 'N/A';
    }
  };

  const getCategoryBadgeClass = (product) => {
    if (product.productType === 'wall_clock') return 'bg-amber-900/30 text-amber-300';
    switch (product.gender) {
      case 'men': return 'bg-blue-900/30 text-blue-300';
      case 'women': return 'bg-pink-900/30 text-pink-300';
      case 'unisex': return 'bg-gray-800 text-gray-300';
      case 'kids': return 'bg-green-900/30 text-green-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setSearchFilters({
      search: '',
      brand: 'all',
      productType: 'all',
      gender: 'all',
      featured: 'all'
    });
  };

  // ✅ Set as thumbnail handler
  const handleSetAsThumbnail = (index) => {
    setThumbnailIndex(index);
  };

  return (
    <AdminLayout title="Product Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Manage Products</h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                viewMode === 'grid' ? 'bg-gold text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                viewMode === 'list' ? 'bg-gold text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-gold/90 whitespace-nowrap"
          >
            + Add New
          </button>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showFilters ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Filters
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Filters
            </>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {!showForm && showFilters && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 backdrop-blur-sm transition-all duration-300">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div className="lg:col-span-2 xl:col-span-3">
              <label className="block text-gray-400 mb-1 text-xs">Search</label>
              <input
                type="text"
                placeholder="Name, brand, model..."
                value={searchFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-xs">Brand</label>
              <select
                value={searchFilters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
              >
                <option value="all">All Brands</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-xs">Type</label>
              <select
                value={searchFilters.productType}
                onChange={(e) => handleFilterChange('productType', e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
              >
                {productTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-xs">Gender</label>
              <select
                value={searchFilters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
              >
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-xs">Featured</label>
              <select
                value={searchFilters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gold appearance-none"
              >
                {featuredOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="Rolex Submariner"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Brand *</label>
                <select
                  value={formData.brand}
                  onChange={handleBrandChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  {formBrands.map(brand => (
                    <option key={brand} value={brand} className="bg-gray-800 text-white">{brand}</option>
                  ))}
                </select>
                {formData.brand === 'Other' && (
                  <input
                    type="text"
                    value={formData.customBrand}
                    onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                    placeholder="Enter custom brand"
                    className="w-full mt-2 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    required
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleProductTypeChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  {productTypes.filter(t => t.value !== 'all').map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800 text-white">{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Watch Shape *</label>
                <select
                  name="watchShape"
                  value={formData.watchShape}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  {watchShapes.map(shape => (
                    <option key={shape} value={shape} className="bg-gray-800 text-white">{shape}</option>
                  ))}
                </select>
              </div>
              {formData.productType === 'watch' && (
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    {wristWatchGenders.map(gender => (
                      <option key={gender.value} value={gender.value} className="bg-gray-800 text-white">{gender.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {/* Colors */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Color Combinations *</label>
              <div className="space-y-3">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                      placeholder="e.g., Gold - Black"
                      className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                    <input
                      type="number"
                      value={color.quantity}
                      onChange={(e) => handleColorChange(index, 'quantity', e.target.value)}
                      placeholder="Qty (optional)"
                      min="0"
                      className="w-32 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="bg-red-900/30 text-red-300 px-3 rounded-lg hover:bg-red-800 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
                >
                  + Add Color
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Price (LKR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  placeholder="145000"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Leave empty for "Contact for Price"
                </p>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Model Number</label>
                <input
                  type="text"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  placeholder="126610LN"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="Describe the watch features, materials, and specifications..."
              />
            </div>
            {/* Specifications */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Specifications</label>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      placeholder="Key (e.g., Watch Glass)"
                      className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., Gorilla Glass)"
                      className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                    {formData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="bg-red-900/30 text-red-300 px-3 rounded-lg hover:bg-red-800 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
                >
                  + Add Specification
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-gold bg-gray-700 border-gray-600 focus:ring-gold"
                />
                <span className="ml-2 text-white text-sm">Featured Product</span>
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Featured products appear in the homepage showcase (max 4)
              </p>
            </div>
            {/* Images with Thumbnail Selection */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">
                Product Images * (Max 15, max 6MB each)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {previewImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-400 text-sm mb-2">Select thumbnail (used in product listings):</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {previewImages.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className={`w-full h-20 object-cover rounded border-2 ${
                            thumbnailIndex === idx ? 'border-gold' : 'border-gray-700'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleSetAsThumbnail(idx)}
                          className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity rounded ${
                            thumbnailIndex === idx ? 'opacity-100 bg-gold/70 text-black' : ''
                          }`}
                        >
                          {thumbnailIndex === idx ? '✓ Thumbnail' : 'Set as Thumbnail'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Videos */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-2 text-sm">
                Product Videos (Max 2, max 20MB each, 60s)
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {previewVideos.length > 0 && (
                <div className="mt-2 space-y-2">
                  {previewVideos.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <video
                        src={preview}
                        controls
                        className="w-full max-h-64 object-contain rounded border border-gray-700"
                      />
                      {idx < videoFiles.length && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = videoFiles.filter((_, i) => i !== idx);
                            const newPreviews = previewVideos.filter((_, i) => i !== idx);
                            setVideoFiles(newFiles);
                            setPreviewVideos(newPreviews);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90 disabled:opacity-70 transition-colors whitespace-nowrap"
              >
                {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center">
          <Loading message="Loading products..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-500">No products found.</p>
          <button
            onClick={resetFilters}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-gold transition-all ${
                    product.featured ? 'ring-1 ring-red-500/30' : ''
                  }`}
                >
                  <div className="relative h-36 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-gray-600 text-xs">No Image</span>
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">{product.title}</h3>
                      <span className="bg-gold/10 text-gold text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                        {product.brand}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">
                        {product.colors?.[0]?.name || 'N/A'}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${getCategoryBadgeClass(product)}`}>
                        {getProductCategory(product)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium text-xs">
                        {product.price ? `LKR ${product.price.toLocaleString()}` : 'Contact'}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-400 hover:text-blue-300 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-400 hover:text-red-300 text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-gray-900/50 rounded-lg border border-gray-800 p-4 hover:border-gold transition ${
                    product.featured ? 'ring-1 ring-red-500/30' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover rounded border border-gray-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded border border-gray-700">
                          <span className="text-gray-600 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold text-white">{product.title}</h3>
                        {product.featured && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{product.brand}</p>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">
                          {product.colors?.[0]?.name || 'N/A'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getCategoryBadgeClass(product)}`}>
                          {getProductCategory(product)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium text-sm">
                          {product.price ? `LKR ${product.price.toLocaleString()}` : 'Contact for Price'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default ProductManager;