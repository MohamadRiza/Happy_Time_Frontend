// src/pages/VacancyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

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
    navigate(`/careers/apply/${id}`);
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold mb-4"></div>
          <p className="text-gray-400">Loading vacancy...</p>
        </div>
      </div>
    );
  }

  /* -------------------- ERROR -------------------- */
  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || 'This vacancy is no longer available.'}
          </p>
          <button
            onClick={() => navigate('/careers')}
            className="text-gold hover:underline"
          >
            ← Back to Careers
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO */}
      <div className="relative h-[45vh]">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Careers at Happy Time"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <img
            src="/logo.png"
            alt="Happy Time Logo"
            className="h-14 mb-4 object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gold">
            Career Opportunity
          </h1>
          <p className="text-gray-300 mt-2 max-w-xl">
            Join Happy Time and grow with a trusted luxury brand
          </p>
        </div>
      </div>
<ScrollToTop />
      {/* CONTENT */}
      <div className="max-w-4xl mx-auto py-16 px-4">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/careers')}
          className="flex items-center text-gray-400 hover:text-gold mb-10 transition"
        >
          ← Back to Vacancies
        </button>

        {/* VACANCY CARD */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold text-white mb-3">
            {vacancy.title}
          </h2>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-gold/10 text-gold px-4 py-1 rounded-full text-sm">
              📍 {vacancy.location}
            </span>
            <span className="bg-gray-800 text-gray-300 px-4 py-1 rounded-full text-sm">
              💰 {vacancy.salary}
            </span>
            <span className="bg-gray-800 text-gray-300 px-4 py-1 rounded-full text-sm">
              ⏰ {vacancy.shift}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold">
              Job Description
            </h3>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {vacancy.description}
            </p>
          </div>

          {/* APPLY CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={handleApply}
              className="bg-gold text-black font-bold px-10 py-4 rounded-full hover:bg-gold/90 transition-all text-lg shadow-lg"
            >
              Apply for This Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyDetailPage;
