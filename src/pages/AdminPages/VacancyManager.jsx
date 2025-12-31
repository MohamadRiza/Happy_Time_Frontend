// src/pages/VacancyManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import AdminLayout from '../../components/AdminLayout';

const VacancyManager = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'LKR',
    hoursPerDay: 8,
    daysPerWeek: 6,
    location: 'colombo-head',
    status: 'active',
  });
  const [salaryError, setSalaryError] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const locations = [
    { id: 'colombo-head', name: 'Head Office - Colombo', address: 'No 143, 2nd Cross Street, Pettah, Colombo' },
    { id: 'colombo-49a', name: 'Keyzer Street Branch', address: 'No 49A, Keyzer Street, Pettah, Colombo' },
    { id: 'colombo-84', name: '2nd Cross Street Branch', address: 'No 84, 2nd Cross Street, Pettah, Colombo' },
    { id: 'kandy', name: 'Kandy Branch', address: 'Kandy City Center, Kandy' },
    { id: 'dubai', name: 'Dubai Office', address: 'Dubai, UAE' },
  ];

  // Fetch vacancies
  const fetchVacancies = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vacancies`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map(v => {
          let salaryMin = '', salaryMax = '', salaryCurrency = 'LKR';
          if (v.salary) {
            const match = v.salary.match(/(LKR|AED)\s*([\d,]+)\s*[-–]\s*([\d,]+)/i);
            if (match) {
              salaryCurrency = match[1].toUpperCase();
              salaryMin = match[2];
              salaryMax = match[3];
            } else {
              if (v.salary.includes('AED')) {
                salaryCurrency = 'AED';
                salaryMin = v.salary.replace(/AED\s*/g, '').trim();
              } else {
                salaryCurrency = 'LKR';
                salaryMin = v.salary.replace(/LKR\s*/g, '').trim();
              }
            }
          }
          return { ...v, salaryMin, salaryMax, salaryCurrency };
        });
        setVacancies(mapped);
      } else {
        setError('Failed to load vacancies');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin/login');
      return;
    }
    fetchVacancies();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSalaryError('');
  };

  const adjustNumber = (field, delta) => {
    const currentValue = parseInt(formData[field]) || 0;
    const newValue = Math.max(0, currentValue + delta);
    setFormData({ ...formData, [field]: newValue.toString() });
    setSalaryError('');
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return '';
    if (min && max) {
      return `${currency} ${parseInt(min).toLocaleString()} – ${parseInt(max).toLocaleString()}`;
    }
    return `${currency} ${parseInt(min || max).toLocaleString()}`;
  };

  const validateSalary = () => {
    const min = parseInt(formData.salaryMin) || 0;
    const max = parseInt(formData.salaryMax) || 0;
    if (formData.salaryMin || formData.salaryMax) {
      if (min > max && formData.salaryMax) {
        setSalaryError('Minimum salary cannot be greater than maximum');
        return false;
      }
      if (!formData.salaryMin && !formData.salaryMax) {
        setSalaryError('Please enter at least one salary value');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSalary()) return;

    try {
      const salary = formatSalary(formData.salaryMin, formData.salaryMax, formData.salaryCurrency);
      const shift = `${formData.hoursPerDay} hours/day, ${formData.daysPerWeek} days/week`;
      const locationObj = locations.find(loc => loc.id === formData.location);
      const locationDisplay = locationObj ? locationObj.address : formData.location;

      const payload = {
        title: formData.title,
        description: formData.description,
        salary,
        shift,
        location: locationDisplay,
        status: formData.status,
      };

      const url = editingId
        ? `${API_URL}/api/vacancies/${editingId}`
        : `${API_URL}/api/vacancies`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        fetchVacancies();
        resetAndCloseForm();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const resetAndCloseForm = () => {
    setFormData({
      title: '',
      description: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'LKR',
      hoursPerDay: 8,
      daysPerWeek: 6,
      location: 'colombo-head',
      status: 'active',
    });
    setSalaryError('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (vacancy) => {
    const locationId = locations.find(loc => 
      vacancy.location.includes(loc.address)
    )?.id || 'colombo-head';

    setFormData({
      title: vacancy.title,
      description: vacancy.description,
      salaryMin: vacancy.salaryMin || '',
      salaryMax: vacancy.salaryMax || '',
      salaryCurrency: vacancy.salaryCurrency || 'LKR',
      hoursPerDay: parseInt(vacancy.shift?.split(' ')[0]) || 8,
      daysPerWeek: parseInt(vacancy.shift?.split(',')[1]?.trim().split(' ')[0]) || 6,
      location: locationId,
      status: vacancy.status,
    });
    setEditingId(vacancy._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
    try {
      const res = await fetch(`${API_URL}/api/vacancies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchVacancies();
      }
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const toggleStatus = async (vacancy) => {
    try {
      const newStatus = vacancy.status === 'active' ? 'inactive' : 'active';
      const res = await fetch(`${API_URL}/api/vacancies/${vacancy._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...vacancy, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchVacancies();
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <AdminLayout title="Manage Vacancies">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Vacancy Management</h2>
        <button
          onClick={() => {
            resetAndCloseForm();
            setShowForm(true);
          }}
          className="bg-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition whitespace-nowrap"
        >
          + Add New Vacancy
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Vacancy' : 'Add New Vacancy'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                  style={{ backgroundImage: `url("image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id} className="bg-gray-800 text-white">{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Salary Range *</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="flex items-center">
                    <select
                      name="salaryCurrency"
                      value={formData.salaryCurrency}
                      onChange={handleChange}
                      className="w-20 bg-black/30 border border-gray-700 rounded-l-lg px-2 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                      style={{ backgroundImage: `url("image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em', paddingRight: '1.5rem' }}
                    >
                      <option value="LKR" className="bg-gray-800 text-white">LKR</option>
                      <option value="AED" className="bg-gray-800 text-white">AED</option>
                    </select>
                    <span className="px-3 py-2 bg-gray-800 text-gray-400 border-y border-gray-700">
                      Min
                    </span>
                    <div className="flex border border-gray-700 rounded-r-lg">
                      <button
                        type="button"
                        onClick={() => adjustNumber('salaryMin', -1000)}
                        className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-32 px-2 py-2 bg-black/30 text-white text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustNumber('salaryMin', 1000)}
                        className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-l-lg">
                      Max
                    </span>
                    <div className="flex border border-gray-700 rounded-r-lg">
                      <button
                        type="button"
                        onClick={() => adjustNumber('salaryMax', -1000)}
                        className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-32 px-2 py-2 bg-black/30 text-white text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustNumber('salaryMax', 1000)}
                        className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {salaryError && <p className="text-red-400 text-sm mt-1">{salaryError}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Example: LKR 120,000 – 150,000 per month
              </p>
            </div>

            {/* Working Hours */}
            <div className="mb-4">
              <label className="block text-gray-400 mb-2 text-sm">Working Schedule *</label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2 text-sm">Hours/Day:</span>
                  <div className="flex border border-gray-700 rounded-lg">
                    <button
                      type="button"
                      onClick={() => adjustNumber('hoursPerDay', -1)}
                      className="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 w-12 text-center bg-black/30 text-white">
                      {formData.hoursPerDay}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustNumber('hoursPerDay', 1)}
                      className="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2 text-sm">Days/Week:</span>
                  <div className="flex border border-gray-700 rounded-lg">
                    <button
                      type="button"
                      onClick={() => adjustNumber('daysPerWeek', -1)}
                      className="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 w-12 text-center bg-black/30 text-white">
                      {formData.daysPerWeek}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustNumber('daysPerWeek', 1)}
                      className="px-3 py-1 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-2 text-sm">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={resetAndCloseForm}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90 transition-colors whitespace-nowrap"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vacancy List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-400">Loading vacancies...</p>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
          <p className="text-gray-500">No vacancies created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gold transition-all"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{vacancy.title}</h3>
                  <p className="text-gold text-sm">{vacancy.location}</p>
                  <p className="text-gray-400 mt-1 text-sm">{vacancy.salary}</p>
                  <p className="text-gray-400 text-sm mt-1">{vacancy.shift}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vacancy.status === 'active'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {vacancy.status.charAt(0).toUpperCase() + vacancy.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mt-3 text-sm">{vacancy.description}</p>
              <div className="flex flex-wrap justify-end gap-2 mt-4">
                <button
                  onClick={() => toggleStatus(vacancy)}
                  className={`px-3 py-1 rounded text-xs ${
                    vacancy.status === 'active'
                      ? 'bg-red-900/30 text-red-300 hover:bg-red-800/50'
                      : 'bg-green-900/30 text-green-300 hover:bg-green-800/50'
                  }`}
                >
                  {vacancy.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(vacancy)}
                  className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded hover:bg-blue-800/50 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vacancy._id)}
                  className="px-3 py-1 bg-red-900/30 text-red-300 rounded hover:bg-red-800/50 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default VacancyManager;