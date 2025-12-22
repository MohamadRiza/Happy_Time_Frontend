// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Branch options (must match your admin locations)
const BRANCHES = [
  { id: 'all', name: 'All Locations' },
  { id: 'colombo-head', name: 'Head Office - Colombo' },
  { id: 'colombo-49a', name: 'Keyzer Street Branch' },
  { id: 'colombo-84', name: '2nd Cross Street Branch' },
  { id: 'kandy', name: 'Kandy Branch' },
  { id: 'dubai', name: 'Dubai Office' },
];

const CareersPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Map location string to branch ID for filtering
  const getLocationId = (location) => {
    if (location.includes('No 143, 2nd Cross Street, Pettah, Colombo')) return 'colombo-head';
    if (location.includes('No 49A, Keyzer Street, Pettah, Colombo')) return 'colombo-49a';
    if (location.includes('No 84, 2nd Cross Street, Pettah, Colombo')) return 'colombo-84';
    if (location.includes('Kandy')) return 'kandy';
    if (location.includes('Dubai, UAE')) return 'dubai';
    return 'other';
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vacancies`);
        const data = await res.json();
        if (data.success) {
          const activeVacancies = (data.data || []).filter(v => v.status === 'active');
          setVacancies(activeVacancies);
          setFilteredVacancies(activeVacancies);
        } else {
          setError('Failed to load vacancies.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // Filter when branch changes
  useEffect(() => {
    if (selectedBranch === 'all') {
      setFilteredVacancies(vacancies);
    } else {
      const filtered = vacancies.filter(vacancy => 
        getLocationId(vacancy.location) === selectedBranch
      );
      setFilteredVacancies(filtered);
    }
  }, [selectedBranch, vacancies]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
          alt="Happy Time Careers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold text-center px-4">
            Join Our Team
          </h1>
        </div>
              <ScrollToTop />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
          At Happy Time Pvt Ltd, we’re passionate about luxury, precision, and service. 
          Explore current opportunities across our branches.
        </p>

        {/* Branch Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedBranch === branch.id
                  ? 'bg-gold text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-400">Loading vacancies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="text-center py-16 bg-black soft border border-gray-800 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">No Vacancies in This Location</h3>
            <p className="text-gray-400">
              Try selecting a different branch or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVacancies.map((vacancy) => (
              <Link
                key={vacancy._id}
                to={`/careers/${vacancy._id}`}
                className="block"
              >
                <div className="bg-black soft border border-gray-800 rounded-xl overflow-hidden hover:border-gold transition-all h-full">
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-white mb-2">{vacancy.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded">
                        {vacancy.location}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                      {vacancy.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-auto">
                      {vacancy.salary} • {vacancy.shift}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPage;