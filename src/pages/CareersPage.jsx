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

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive Salary';
    return salary;
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
          alt="Happy Time Careers"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold text-center px-4">
            Join Our Team
          </h1>
        </div>
        <ScrollToTop />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-gray-400 text-lg leading-relaxed">
            At Happy Time Pvt Ltd, we’re passionate about luxury, precision, and exceptional service. 
            Explore current opportunities across our prestigious locations worldwide.
          </p>
        </div>

        {/* Branch Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedBranch === branch.id
                  ? 'bg-gold text-black shadow-lg shadow-gold/20'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-gold border border-gray-700'
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
            <p className="text-gray-400 text-lg">Discovering exceptional opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-400 text-lg mb-4">⚠️ {error}</div>
            <p className="text-gray-500">Please try refreshing the page</p>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">💼</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Current Opportunities</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We currently have no open positions at this location. 
              Check back soon or explore opportunities at other branches.
            </p>
            <button
              onClick={() => setSelectedBranch('all')}
              className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-400 transition shadow-lg"
            >
              View All Locations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVacancies.map((vacancy) => (
              <Link
                key={vacancy._id}
                to={`/careers/${vacancy._id}`}
                className="block group"
              >
                <div className="bg-gradient-to-b from-gray-900/80 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-gold hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 h-full flex flex-col">
                  <div className="p-6 flex flex-col h-full">
                    {/* Job Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                      {vacancy.title}
                    </h3>
                    
                    {/* Location Badge */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gold/10 text-gold text-xs px-3 py-1.5 rounded-full font-medium">
                        {vacancy.location}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                      {vacancy.description}
                    </p>
                    
                    {/* Details Grid */}
                    <div className="space-y-2 mt-auto pt-4 border-t border-gray-800/50">
                      {/* Salary */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Compensation</span>
                        <span className="text-white font-semibold text-sm">
                          {formatSalary(vacancy.salary)}
                        </span>
                      </div>
                      
                      {/* Work Schedule */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Schedule</span>
                        <span className="text-gray-300 text-sm">
                          {vacancy.shift}
                        </span>
                      </div>
                    </div>
                    
                    {/* Apply Button */}
                    <div className="mt-6">
                      <div className="inline-flex items-center text-gold text-sm font-medium group-hover:text-yellow-300 transition-colors">
                        <span>View Details</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* CTA Section */}
        {filteredVacancies.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Interested in a Different Role?</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Don't see the perfect opportunity? Send us your resume and we'll keep you in mind for future positions that match your expertise.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg hover:shadow-gold/20"
              >
                Send Your Resume
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPage;