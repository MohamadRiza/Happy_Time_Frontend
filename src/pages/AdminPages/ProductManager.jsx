// src/pages/ProductManager.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    gender: 'unisex',
    colors: '',
    customColors: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState('');
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const brands = [
    'Rolex', 'Omega', 'Citizen', 'Orix', 'Winsor', 'Arial', 'Patek Philippe', 'Audemars Piguet', 'Other'
  ];
  
  const watchShapes = [
    'Round', 'Square', 'Rectangular', 'Oval', 'Tonneau', 'Other'
  ];
  
  const genders = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' }
  ];
  
  const colorCombinations = [
    'Gold - Black',
    'Gold - White',
    'Silver - Black',
    'Silver - Blue',
    'Rose Gold - Black',
    'Rose Gold - White',
    'Black - Gold',
    'Blue - Silver',
    'Green - Gold',
    'Brown - Gold',
    'Other'
  ];

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/admin`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFormData(prev => ({
      ...prev,
      brand,
      customBrand: brand === 'Other' ? '' : prev.customBrand
    }));
    setError('');
  };

  const handleColorChange = (e) => {
    const colors = e.target.value;
    setFormData(prev => ({
      ...prev,
      colors,
      customColors: colors === 'Other' ? '' : prev.customColors
    }));
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.some(file => file.size > 20 * 1024 * 1024);
    if (oversized) {
      alert('Image too large! Maximum size: 20MB per image.');
      return;
    }
    const selectedFiles = files.slice(0, 3);
    setImageFiles(selectedFiles);
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
    setError('');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('Video too large! Maximum size: 20MB.');
      return;
    }
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        alert('Video must be less than 1 minute long.');
        setVideoFile(null);
        setPreviewVideo('');
      } else {
        setVideoFile(file);
        setPreviewVideo(URL.createObjectURL(file));
      }
    };
    video.src = URL.createObjectURL(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    const finalBrand = formData.brand === 'Other' 
      ? formData.customBrand.trim() 
      : formData.brand;
      
    const finalColors = formData.colors === 'Other'
      ? formData.customColors.trim()
      : formData.colors;

    if (!formData.title.trim()) {
      setError('Title is required');
      setUploading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setUploading(false);
      return;
    }
    if (!finalBrand) {
      setError('Brand is required');
      setUploading(false);
      return;
    }
    if (!formData.gender) {
      setError('Gender is required');
      setUploading(false);
      return;
    }
    if (!finalColors) {
      setError('Color combination is required');
      setUploading(false);
      return;
    }
    if (imageFiles.length === 0 && !editingId) {
      setError('Please upload at least one image');
      setUploading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('brand', finalBrand);
    formDataToSend.append('gender', formData.gender);
    if (formData.price) {
      formDataToSend.append('price', formData.price);
    }
    formDataToSend.append('modelNumber', formData.modelNumber.trim() || 'N/A');
    formDataToSend.append('watchShape', formData.watchShape);
    formDataToSend.append('colors', JSON.stringify([finalColors]));

    imageFiles.forEach(file => {
      formDataToSend.append('images', file);
    });

    if (videoFile) {
      formDataToSend.append('video', videoFile);
    }

    try {
      const url = editingId 
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        fetchProducts();
        resetForm();
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
      gender: 'unisex',
      colors: '',
      customColors: '',
    });
    setImageFiles([]);
    setVideoFile(null);
    setPreviewImages([]);
    setPreviewVideo('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    const isCustomBrand = !brands.includes(product.brand) || product.brand === 'Other';
    const brand = isCustomBrand ? 'Other' : product.brand;
    const customBrand = isCustomBrand ? product.brand : '';

    const colorCombo = product.colors?.[0] || '';
    const isCustomColor = !colorCombinations.includes(colorCombo) || colorCombo === 'Other';
    const colors = isCustomColor ? 'Other' : colorCombo;
    const customColors = isCustomColor ? colorCombo : '';

    setFormData({
      title: product.title,
      description: product.description,
      brand,
      customBrand,
      price: product.price?.toString() || '',
      modelNumber: product.modelNumber || '',
      watchShape: product.watchShape,
      gender: product.gender || 'unisex',
      colors,
      customColors,
    });
    setPreviewImages(product.images || []);
    setPreviewVideo(product.video || '');
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Manage Products</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition whitespace-nowrap"
        >
          + Add New Product
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

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
                  {brands.map(brand => (
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
            </div>

            {/* Gender Selection */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Gender *</label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map(gender => (
                  <label 
                    key={gender.value} 
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender.value}
                      checked={formData.gender === gender.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-gold bg-gray-700 border-gray-600 focus:ring-gold focus:ring-offset-0 focus:ring-2"
                      required
                    />
                    <span className="ml-2 text-white text-sm">{gender.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Color Combination *</label>
              <select
                value={formData.colors}
                onChange={handleColorChange}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                {colorCombinations.map(combo => (
                  <option key={combo} value={combo} className="bg-gray-800 text-white">{combo}</option>
                ))}
              </select>
              {formData.colors === 'Other' && (
                <input
                  type="text"
                  value={formData.customColors}
                  onChange={(e) => setFormData({ ...formData, customColors: e.target.value })}
                  placeholder="e.g., Titanium - Ceramic"
                  className="w-full mt-2 bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  required
                />
              )}
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

            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">
                Product Images * (Max 3, max 20MB each)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {previewImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {previewImages.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = previewImages.filter((_, i) => i !== idx);
                          const newFiles = imageFiles.filter((_, i) => i !== idx);
                          setPreviewImages(newPreviews);
                          setImageFiles(newFiles);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-2 text-sm">
                Product Video (Max 1 min, max 20MB)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {previewVideo && (
                <div className="mt-2">
                  <video
                    src={previewVideo}
                    controls
                    className="w-full max-h-64 object-contain rounded border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setPreviewVideo('');
                    }}
                    className="mt-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove Video
                  </button>
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

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-500">No products created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gold transition-all"
            >
              {product.images?.[0] ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center bg-gray-800">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{product.title}</h3>
                  <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded whitespace-nowrap">
                    {product.brand}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                    {product.colors?.[0] || 'N/A'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.gender === 'men' ? 'bg-blue-900/30 text-blue-300' :
                    product.gender === 'women' ? 'bg-pink-900/30 text-pink-300' :
                    'bg-purple-900/30 text-purple-300'
                  }`}>
                    {product.gender === 'men' ? 'Men' : 
                     product.gender === 'women' ? 'Women' : 'Unisex'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm">
                    {product.price ? `LKR ${product.price.toLocaleString()}` : 'Contact for Price'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-400 hover:text-red-300 text-sm"
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
    </AdminLayout>
  );
};

export default ProductManager;