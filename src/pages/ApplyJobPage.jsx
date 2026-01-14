// src/pages/ApplyJobPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const ApplyJobPage = () => {
  const [formData, setFormData] = useState({
    // Position info (auto-filled or manual)
    positionId: '',
    positionTitle: '',
    
    // Personal Information
    fullName: '',
    age: '',
    gender: 'male',
    dob: '',
    country: 'Sri Lanka',
    city: '',
    address: '',
    
    // Work Details
    canWork9to5: false,
    yearsExperience: '',
    referenceName: '',
    referenceEmail: '',
    referenceWorkplace: '',
    interestedBranch: '',
    canWorkLegally: false,
    
    // CV/Resume
    cvFile: null,
    cvGoogleDriveLink: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch vacancies for position selection
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vacancies`);
        const data = await res.json();
        if (data.success) {
          setVacancies(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch vacancies:', err);
      }
    };
    
    fetchVacancies();
  }, []);

  // Handle auto-fill from vacancy selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const positionId = searchParams.get('positionId');
    const positionTitle = searchParams.get('positionTitle');
    
    if (positionId && positionTitle) {
      setFormData(prev => ({
        ...prev,
        positionId,
        positionTitle
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload PDF or Word document only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, cvFile: file }));
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.yearsExperience) {
      setError('Years of experience is required');
      return false;
    }
    if (!formData.interestedBranch.trim()) {
      setError('Interested branch is required');
      return false;
    }
    if (!formData.cvFile && !formData.cvGoogleDriveLink.trim()) {
      setError('Please upload CV or provide Google Drive link');
      return false;
    }
    if (formData.cvGoogleDriveLink.trim() && !isValidGoogleDriveLink(formData.cvGoogleDriveLink)) {
      setError('Please provide a valid Google Drive shareable link');
      return false;
    }
    return true;
  };

  const isValidGoogleDriveLink = (url) => {
    const googleDriveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/[^\/]+|open\?id=[^&]+)/;
    return googleDriveRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'cvFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add CV file if uploaded
      if (formData.cvFile) {
        formDataToSend.append('cvFile', formData.cvFile);
      }
      
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            positionId: '',
            positionTitle: '',
            fullName: '',
            age: '',
            gender: 'male',
            dob: '',
            country: 'Sri Lanka',
            city: '',
            address: '',
            canWork9to5: false,
            yearsExperience: '',
            referenceName: '',
            referenceEmail: '',
            referenceWorkplace: '',
            interestedBranch: '',
            canWorkLegally: false,
            cvFile: null,
            cvGoogleDriveLink: ''
          });
        }, 3000);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Application submission error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-black text-white min-h-screen">
        <ScrollToTop />
        <div className="max-w-4xl mx-auto py-24 px-4 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-gold mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest in Happy Time. Our HR team will review your application and contact you soon.
          </p>
          <button
            onClick={() => navigate('/careers')}
            className="bg-gold text-black px-8 py-3 rounded-xl font-medium hover:bg-gold/90 transition"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Apply for Position</h1>
          <p className="text-gray-400">
            Join our team at Happy Time PVT LTD and be part of our luxury timepiece journey
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          {error && <p className="text-red-400 mb-6 text-center">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Position Information */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Position Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Select Position *</label>
                  <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={(e) => {
                      const selectedVacancy = vacancies.find(v => v._id === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        positionId: e.target.value,
                        positionTitle: selectedVacancy ? selectedVacancy.title : ''
                      }));
                    }}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="">Select a position</option>
                    {vacancies.map(vacancy => (
                      <option key={vacancy._id} value={vacancy._id}>
                        {vacancy.title}
                      </option>
                    ))}
                    <option value="manual">Other / Manual Entry</option>
                  </select>
                </div>
                
                {(formData.positionId === 'manual' || !formData.positionId) && (
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Position Title *</label>
                    <input
                      type="text"
                      name="positionTitle"
                      value={formData.positionTitle}
                      onChange={handleChange}
                      placeholder="e.g., Sales Executive"
                      className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                )}
                
                {formData.positionId && formData.positionId !== 'manual' && (
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Selected Position</label>
                    <div className="bg-gold/10 text-gold px-4 py-2 rounded-lg">
                      {formData.positionTitle}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="25"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="Sri Lanka"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="Colombo"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2 text-sm">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="123 Main Street, Colombo"
                  />
                </div>
              </div>
            </div>

            {/* Work Experience & Details */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Work Experience & Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Years of Experience *</label>
                  <select
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="">Select years</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Interested Branch *</label>
                  <input
                    type="text"
                    name="interestedBranch"
                    value={formData.interestedBranch}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="Colombo Main Branch"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="canWork9to5"
                      checked={formData.canWork9to5}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold"
                    />
                    <span className="ml-2 text-white text-sm">
                      I am available to work standard business hours (9 AM - 5 PM)
                    </span>
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="canWorkLegally"
                      checked={formData.canWorkLegally}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-gold bg-gray-700 border-gray-600 rounded focus:ring-gold"
                    />
                    <span className="ml-2 text-white text-sm">
                      I am legally authorized to work in this country
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Reference Information */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Reference Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Reference Name</label>
                  <input
                    type="text"
                    name="referenceName"
                    value={formData.referenceName}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Reference Email</label>
                  <input
                    type="email"
                    name="referenceEmail"
                    value={formData.referenceEmail}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="jane@example.com"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2 text-sm">Reference Workplace</label>
                  <input
                    type="text"
                    name="referenceWorkplace"
                    value={formData.referenceWorkplace}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="ABC Company, Marketing Department"
                  />
                </div>
              </div>
            </div>

            {/* CV/Resume Upload */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">CV/Resume Upload *</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Upload CV File (PDF/DOC, Max 5MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Or Google Drive Link</label>
                  <input
                    type="url"
                    name="cvGoogleDriveLink"
                    value={formData.cvGoogleDriveLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Make sure the Google Drive link is publicly accessible (Anyone with the link can view)
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gold text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-gold/90 transition disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPage;