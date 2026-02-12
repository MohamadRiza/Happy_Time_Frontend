// src/pages/VacancyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Loading from '../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const VacancyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vacancies/${id}`);
        const data = await res.json();
        if (data.success && data.data?.status === 'active') {
          setVacancy(data.data);
        } else {
          setError('Vacancy not found or no longer available.');
        }
      } catch (err) {
        setError('Failed to load vacancy details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  const handleApply = () => {
    if (!vacancy?._id) return;
    navigate(
      `/apply-job?positionId=${vacancy._id}&positionTitle=${encodeURIComponent(
        vacancy.title
      )}`
    );
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <Loading message="Loading vacancy details..." size="large" />
    );
  }

  /* -------------------- ERROR -------------------- */
  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <ScrollToTop />
        <div className="text-center p-6 max-w-md">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mx-auto text-red-400/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Position Not Found</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {error || 'This vacancy is no longer available or has been filled.'}
          </p>
          <button
            onClick={() => navigate('/careers')}
            className="inline-flex items-center text-gold hover:text-gold/80 font-semibold transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Careers
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />

      {/* HERO */}
      <div className="relative h-[50vh] md:h-[55vh]">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Careers at Happy Time"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <img
            src="/logo.png"
            alt="Happy Time Logo"
            className="h-16 md:h-20 mb-6 object-contain filter drop-shadow-2xl"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="inline-block mb-3">
            <span className="bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-semibold border border-gold/30">
              Career Opportunity
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 max-w-3xl">
            {vacancy.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Join our team and be part of Sri Lanka's trusted watch destination
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/careers')}
          className="inline-flex items-center text-gray-400 hover:text-gold mb-8 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Vacancies
        </button>

        {/* MAIN CARD */}
        <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
          
          {/* HEADER SECTION */}
          <div className="p-6 md:p-10 border-b border-gray-700/50">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {vacancy.title}
            </h2>

            {/* INFO BADGES */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center bg-gold/10 text-gold px-4 py-2.5 rounded-xl border border-gold/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-semibold">{vacancy.location}</span>
              </div>

              <div className="flex items-center bg-gray-800/60 text-gray-300 px-4 py-2.5 rounded-xl border border-gray-700/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{vacancy.salary}</span>
              </div>

              <div className="flex items-center bg-gray-800/60 text-gray-300 px-4 py-2.5 rounded-xl border border-gray-700/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{vacancy.shift}</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="p-6 md:p-10">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-gold/10 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gold">
                  Job Description
                </h3>
              </div>
              
              <div className="w-16 h-1 bg-gold/30 mb-6"></div>

              <div className="text-gray-300 whitespace-pre-line leading-relaxed text-base md:text-lg">
                {vacancy.description}
              </div>
            </div>
          </div>

          {/* APPLY CTA SECTION */}
          <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900/50 to-black/30 border-t border-gray-700/50">
            <div className="text-center">
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                Ready to take the next step in your career?
              </p>
              <button
                onClick={handleApply}
                className="inline-flex items-center bg-gold text-black font-bold px-8 md:px-12 py-3.5 md:py-4 rounded-xl hover:bg-gold/90 transition-all text-base md:text-lg shadow-lg hover:shadow-gold/20 hover:scale-105 transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Apply for This Position
              </button>
              <p className="text-gray-500 text-xs md:text-sm mt-4">
                Application process typically takes 5-10 minutes
              </p>
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO CARD */}
        <div className="mt-8 bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-gray-800/30 border border-gray-700/40 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-start">
            <div className="bg-blue-500/10 p-3 rounded-lg mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                If you have any questions about this position or the application process, 
                please don't hesitate to contact our HR team at{' '}
                <a href="mailto:happytime143b@gmail.com" className="text-gold hover:underline">
                  happytime143b@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyDetailPage;