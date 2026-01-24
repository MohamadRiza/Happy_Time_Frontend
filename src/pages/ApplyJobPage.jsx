// src/pages/ApplyJobPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyJobPage = () => {
  const [formData, setFormData] = useState({
    // Position info
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
    cvGoogleDriveLink: '',
    
    // ✅ NEW: Applicant Email for tracking
    applicantEmail: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  
  const branches = [
    'Colombo – Head Office',
    'Pettah – Online Branch', 
    'Pettah – Retail Branch',
    'Kandy Branch',
    'Dubai – UAE Branch'
  ];
  
  const countries = [
    'Sri Lanka',
    'United States',
    'United Kingdom',
    'India',
    'United Arab Emirates',
    'China',
    'Japan',
    'Germany',
    'France',
    'Italy',
    'Russia',
    'Brazil',
    'Australia',
    'South Korea',
    'Spain',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Switzerland',
    'Austria',
    'Belgium',
    'Ireland',
    'Portugal',
    'Greece',
    'Poland',
    'Czech Republic',
    'Hungary',
    'Slovakia'
  ].sort();
  
  const experienceOptions = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch vacancies
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

  // Handle auto-fill from URL
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

  // Auto-calculate age
  useEffect(() => {
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload PDF or Word document only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, cvFile: file }));
    }
  };

  // ✅ Enhanced Validation with Applicant Email
  const validateForm = () => {
    // Full Name: Only letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!nameRegex.test(formData.fullName.trim())) {
      toast.error('Full name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }

    // DOB
    if (!formData.dob) {
      toast.error('Date of birth is required');
      return false;
    }
    const dob = new Date(formData.dob);
    const today = new Date();
    if (dob > today) {
      toast.error('Date of birth cannot be in the future');
      return false;
    }
    if (dob < new Date('1900-01-01')) {
      toast.error('Please enter a valid date of birth');
      return false;
    }

    // City
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }

    // Experience
    if (!formData.yearsExperience) {
      toast.error('Years of experience is required');
      return false;
    }

    // Branch
    if (!formData.interestedBranch) {
      toast.error('Interested branch is required');
      return false;
    }

    // ✅ Applicant Email
    if (!formData.applicantEmail.trim()) {
      toast.error('Applicant email is required for application tracking');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.applicantEmail.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // CV
    if (!formData.cvFile && !formData.cvGoogleDriveLink.trim()) {
      toast.error('Please upload CV or provide Google Drive link');
      return false;
    }

    // Google Drive Link
    if (formData.cvGoogleDriveLink.trim()) {
      const url = formData.cvGoogleDriveLink.trim();
      const googleDriveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/[^\/\s]+|open\?id=[^&\s]+)/;
      if (!googleDriveRegex.test(url)) {
        toast.error('Please provide a valid Google Drive shareable link');
        return false;
      }
    }

    // Reference Email (if provided)
    if (formData.referenceEmail.trim()) {
      if (!emailRegex.test(formData.referenceEmail.trim())) {
        toast.error('Please enter a valid reference email address');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'cvFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.cvFile) {
        formDataToSend.append('cvFile', formData.cvFile);
      }
      
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await res.json();
      
      if (data.success) {
        // ✅ Navigate to success page with application code
        navigate('/application-success', { 
          state: { 
            applicationCode: data.data.applicationCode,
            applicantEmail: data.data.applicantEmail
          } 
        });
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Application submission error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Apply for Position</h1>
          <p className="text-gray-400">
            Join our team at Happy Time PVT LTD and be part of our luxury timepiece journey
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
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
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
                    readOnly
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
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
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select years of experience</option>
                    {experienceOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Interested Branch *</label>
                  <select
                    name="interestedBranch"
                    value={formData.interestedBranch}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="">Select your preferred branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
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

            {/* ✅ NEW: Applicant Email Section */}
            <div className="bg-gray-800/30 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Application Tracking</h2>
              <p className="text-gray-400 text-sm mb-4">
                Your email will be used to send you a unique application code for tracking your application status.
              </p>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Applicant Email *</label>
                <input
                  type="email"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                  placeholder="your.email@example.com"
                />
                <p className="text-gray-500 text-xs mt-1">
                  We'll send you a unique code to track your application status
                </p>
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