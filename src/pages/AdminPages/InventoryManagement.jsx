import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getToken } from '../../utils/auth';
import Loading from '../../components/Loading';

const InventoryManagement = () => {
  const [settings, setSettings] = useState({
    lowStockThreshold: 10,
    outOfStockThreshold: 0,
    alertEmails: [],
    enabled: true
  });
  const [inventoryStatus, setInventoryStatus] = useState({
    outOfStock: [],
    lowStock: [],
    inStock: []
  });
  const [summary, setSummary] = useState({
    totalOutOfStock: 0,
    totalLowStock: 0,
    totalInStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const token = getToken();

      // Fetch settings
      const settingsRes = await fetch(`${API_URL}/api/admin/inventory/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        setSettings(settingsData.data);
      }

      // Fetch inventory status
      const statusRes = await fetch(`${API_URL}/api/admin/inventory/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statusData = await statusRes.json();

      if (statusData.success) {
        setInventoryStatus(statusData.data);
        setSummary(statusData.summary);
      }
    } catch (err) {
      console.error('Fetch inventory data error:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validateSettings = () => {
    if (settings.lowStockThreshold < 1 || settings.lowStockThreshold > 100) {
      setError('Low stock threshold must be between 1–100');
      return false;
    }
    if (settings.outOfStockThreshold < 0 || settings.outOfStockThreshold > 10) {
      setError('Out of stock threshold must be between 0–10');
      return false;
    }
    if (settings.outOfStockThreshold >= settings.lowStockThreshold) {
      setError('Out of stock threshold must be less than low stock threshold');
      return false;
    }
    return true;
  };

  const saveSettings = async () => {
    if (!validateSettings()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/admin/inventory/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchInventoryData();
      } else {
        setError(data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateStockQuantity = async (productId, colorName, newQuantity) => {
    if (newQuantity < 0 || newQuantity > 99999) {
      alert('Please enter a valid quantity (0–99,999)');
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/admin/inventory/stock/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ colorName, quantity: newQuantity })
      });
      const data = await res.json();

      if (data.success) {
        fetchInventoryData();
      } else {
        alert(data.message || 'Failed to update stock');
      }
    } catch (err) {
      console.error('Update stock error:', err);
      alert('Network error. Please try again.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  if (loading) {
    return (
      <AdminLayout title="Inventory Management">
        <div className='text-center py-8'>
        <Loading message="Loading inventory data..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Inventory Management">
      {/* Success/Error Banners */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-green-300 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Top Status Cards (Prominent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Out of Stock */}
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-white">{summary.totalOutOfStock}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              summary.totalOutOfStock === 0 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-red-900/50 text-red-300'
            }`}>
              {summary.totalOutOfStock} item{summary.totalOutOfStock !== 1 ? 's' : ''}
            </span>
          </div>
          {/* <div className="mt-auto pt-4 border-t border-red-700/30">
            <Link
              to="#out-of-stock"
              className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div> */}
        </div>

        {/* Low Stock */}
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-orange-300 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-white">{summary.totalLowStock}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              summary.totalLowStock === 0 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-orange-900/50 text-orange-300'
            }`}>
              {summary.totalLowStock} item{summary.totalLowStock !== 1 ? 's' : ''}
            </span>
          </div>
          {/* <div className="mt-auto pt-4 border-t border-orange-700/30">
            <Link
              to="#low-stock"
              className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div> */}
        </div>

        {/* In Stock */}
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-green-300 text-sm font-medium">In Stock</p>
                <p className="text-2xl font-bold text-white">{summary.totalInStock}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              summary.totalInStock === 0 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-green-900/50 text-green-300'
            }`}>
              {summary.totalInStock} item{summary.totalInStock !== 1 ? 's' : ''}
            </span>
          </div>
          {/* <div className="mt-auto pt-4 border-t border-green-700/30">
            <Link
              to="#in-stock"
              className="text-gold hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Settings Panel (Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.06.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1-6 0 3 3 0 016 0z" />
              </svg>
              Stock Alert Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleSettingsChange('lowStockThreshold', parseInt(e.target.value) || 10)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Enter threshold (1–100)"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Products with stock ≤ this number will show as “Low Stock”
                </p>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">
                  Out of Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.outOfStockThreshold}
                  onChange={(e) => handleSettingsChange('outOfStockThreshold', parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-gray-700 focus:border-gold rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Enter threshold (0–10)"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Products with stock ≤ this number will show as “Out of Stock”
                </p>
              </div>

              {/* Notification Toggle */}
              <div className="pt-4 border-t border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-medium">Alert Notifications</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {settings.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-gold peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  {settings.alertEmails.length > 0
                    ? `${settings.alertEmails.length} email${settings.alertEmails.length !== 1 ? 's' : ''} configured`
                    : 'No email addresses configured'}
                </p>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full bg-gold hover:bg-gold/90 text-black py-3 rounded-xl font-bold transition-all shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Status List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Out of Stock Section */}
          {inventoryStatus.outOfStock.length > 0 && (
            <div id="out-of-stock" className="bg-red-900/10 border border-red-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Out of Stock ({inventoryStatus.outOfStock.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventoryStatus.outOfStock.map((item, index) => (
                  <InventoryItem
                    key={`${item._id}-${item.colorName}-${index}`}
                    item={item}
                    onUpdateStock={updateStockQuantity}
                    API_URL={API_URL}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Section */}
          {inventoryStatus.lowStock.length > 0 && (
            <div id="low-stock" className="bg-orange-900/10 border border-orange-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Low Stock ({inventoryStatus.lowStock.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventoryStatus.lowStock.map((item, index) => (
                  <InventoryItem
                    key={`${item._id}-${item.colorName}-${index}`}
                    item={item}
                    onUpdateStock={updateStockQuantity}
                    API_URL={API_URL}
                  />
                ))}
              </div>
            </div>
          )}

          {/* In Stock Section */}
          {inventoryStatus.inStock.length > 0 && (
            <div id="in-stock" className="bg-green-900/10 border border-green-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  In Stock ({inventoryStatus.inStock.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventoryStatus.inStock.slice(0, 10).map((item, index) => (
                  <InventoryItem
                    key={`${item._id}-${item.colorName}-${index}`}
                    item={item}
                    onUpdateStock={updateStockQuantity}
                    API_URL={API_URL}
                  />
                ))}
                {inventoryStatus.inStock.length > 10 && (
                  <div className="md:col-span-2 text-center py-4">
                    <p className="text-gray-400">
                      Showing first 10 of {inventoryStatus.inStock.length} in-stock items
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inventoryStatus.outOfStock.length === 0 &&
           inventoryStatus.lowStock.length === 0 &&
           inventoryStatus.inStock.length === 0 && (
            <div className="text-center py-12 bg-gray-900/60 border border-gray-800 rounded-2xl">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400">Add products to your inventory to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Inventory Item Component
const InventoryItem = ({ item, onUpdateStock, API_URL }) => {
  const [editing, setEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState(item.currentStock === 'Unlimited' ? '' : item.currentStock);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (item.currentStock === 'Unlimited') {
      const qty = parseInt(newQuantity) || 99999;
      setIsUpdating(true);
      await onUpdateStock(item._id, item.colorName, qty);
      setIsUpdating(false);
      setEditing(false);
    } else {
      const qty = parseInt(newQuantity);
      if (!isNaN(qty) && qty >= 0) {
        setIsUpdating(true);
        await onUpdateStock(item._id, item.colorName, qty);
        setIsUpdating(false);
        setEditing(false);
      }
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  const getStatusColor = () => {
    switch (item.stockStatus) {
      case 'outOfStock': return 'text-red-400 bg-red-900/20 border-red-700/50';
      case 'lowStock': return 'text-orange-400 bg-orange-900/20 border-orange-700/50';
      default: return 'text-green-400 bg-green-900/20 border-green-700/50';
    }
  };

  return (
    <div className={`bg-black/40 border rounded-xl p-4 hover:bg-gray-800/50 transition-all ${getStatusColor()}`}>
      <div className="flex gap-4">
        <div className="w-16 h-16 flex-shrink-0">
          {item.images?.[0] ? (
            <img
              src={getImageUrl(item.images[0])}
              alt={item.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
              ?
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/shop/${item._id}`} className="block">
            <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1 hover:text-gold">
              {item.title}
            </h4>
          </Link>
          <p className="text-gray-400 text-xs mb-2">{item.brand}</p>
          <p className="text-gray-300 text-xs mb-2">
            Color: <span className="font-medium">{item.colorName}</span>
          </p>

          {editing ? (
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                min="0"
                max="99999"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="flex-1 bg-black/60 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpdate();
                }}
                disabled={isUpdating}
                className="px-3 py-1 bg-gold text-black rounded text-xs font-medium disabled:opacity-50"
              >
                {isUpdating ? '...' : 'Save'}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditing(false);
                }}
                className="px-3 py-1 bg-gray-700 text-white rounded text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-black/40 rounded">
                  {item.currentStock === 'Unlimited' ? '∞' : item.currentStock}
                </span>
                <span className="text-xs text-gray-400">
                  {item.stockStatus === 'outOfStock' ? 'Out of Stock' :
                   item.stockStatus === 'lowStock' ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="text-gold hover:text-yellow-300 text-xs font-medium flex items-center gap-1"
              >
                Edit Qty
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;