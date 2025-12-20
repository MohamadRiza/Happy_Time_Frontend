// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

// API URL (matches your Vite config)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CareersPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vacancies`);
        const data = await res.json();
        if (data.success) {
          setVacancies(data.data || []);
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

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner */}
      
      <ScrollToTop />
      
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          At Happy Time Pvt Ltd, we’re passionate about luxury, precision, and service. 
          Explore current opportunities to become part of Sri Lanka’s premier watch destination.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-400">Loading vacancies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-16 bg-black soft border border-gray-800 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">No Vacancies Available</h3>
            <p className="text-gray-400">
              We’re not currently hiring, but check back soon for future opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy._id}
                className="bg-black soft border border-gray-800 rounded-xl overflow-hidden hover:border-gold transition-all"
              >
                {vacancy.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={vacancy.imageUrl}
                      alt={vacancy.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{vacancy.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded">
                      {vacancy.country}
                    </span>
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                      {vacancy.salary}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {vacancy.description}
                  </p>
                  <Link
                    to={`/careers/apply/${vacancy._id}`}
                    className="block w-full text-center py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-black transition-all font-medium"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Future: Application form will use vacancy._id to auto-fill job title & location */}
      </div>
    </div>
  );
};

export default CareersPage;