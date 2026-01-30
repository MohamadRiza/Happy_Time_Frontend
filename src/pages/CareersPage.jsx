// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const [searchQuery, setSearchQuery] = useState('');

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

  // ✅ Enhanced filtering with search
  useEffect(() => {
    let result = [...vacancies];
    
    // Branch filter
    if (selectedBranch !== 'all') {
      result = result.filter(vacancy => 
        getLocationId(vacancy.location) === selectedBranch
      );
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(vacancy =>
        vacancy.title.toLowerCase().includes(query) ||
        vacancy.location.toLowerCase().includes(query) ||
        vacancy.description.toLowerCase().includes(query) ||
        (vacancy.keywords && vacancy.keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        ))
      );
    }
    
    setFilteredVacancies(result);
  }, [selectedBranch, searchQuery, vacancies]);

  const formatSalary = (salary) => {
    if (!salary) return 'Competitive Salary';
    return salary;
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner - Updated to match About page */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <img
          src="https://images.pexels.com/photos/11489971/pexels-photo-11489971.jpeg"
          alt="Happy Time Careers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-4 tracking-wide">
            Join Our Team
          </h1>
          <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-8">
            Shape the future of luxury timekeeping with Sri Lanka’s most trusted watch connoisseur since 1996.
          </p>
          
          {/* CTA Buttons in Hero */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply-job"
              className="bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg"
            >
              Send Your Resume
            </Link>
            <Link
              to="/application-status"
              className="bg-gray-800 text-gold px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition border border-gray-700"
            >
              Check Application Status
            </Link>
          </div>
        </div>
        <ScrollToTop />
      </div>

      {/* Vacancies Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Current <span className="text-gold">Opportunities</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Explore open positions across our prestigious locations worldwide.
          </p>
        </div>

        {/* ✅ SEARCH BAR */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, location, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
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
              We currently have no open positions matching your search criteria. 
              Try adjusting your search or explore opportunities at other branches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('all');
                }}
                className="bg-gold text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-400 transition shadow-lg"
              >
                Clear Search & View All
              </button>
              <Link
                to="/apply-job"
                className="bg-gray-800 text-gold px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition border border-gray-700"
              >
                Submit General Application
              </Link>
            </div>
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
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                      {vacancy.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gold/10 text-gold text-xs px-3 py-1.5 rounded-full font-medium">
                        {vacancy.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                      {vacancy.description}
                    </p>
                    
                    <div className="space-y-2 mt-auto pt-4 border-t border-gray-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Compensation</span>
                        <span className="text-white font-semibold text-sm">
                          {formatSalary(vacancy.salary)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Schedule</span>
                        <span className="text-gray-300 text-sm">
                          {vacancy.shift}
                        </span>
                      </div>
                    </div>
                    
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
      </div>
    </div>
  );
};

export default CareersPage;