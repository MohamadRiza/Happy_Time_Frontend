// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// ✅ UPDATED with REAL branch information
const branches = [
  {
    id: 1,
    name: 'Colombo – Head Office (Sri Lanka Main Branch)',
    address: 'No 49A, Keyzer Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 76 300 9123',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps?q=Happy+Time+Pvt+Ltd,+Pettah,+Colombo&output=embed',
    image: './MainBranchPettah.jpeg',
  },
  {
    id: 2,
    name: 'Online Branch - Pettah 143',
    address: 'No 143, 2nd Cross Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 75 757 5565',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.608471754673!2d79.84937707499664!3d6.937308993062671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTQuMyJOIDc5wrA1MScwNy4wIkU!5e0!3m2!1sen!2slk!4v1767424589827!5m2!1sen!2slk',
    image: './143_OnlineBranch.jpeg',
  },
  {
    id: 3,
    name: '84 Branch - Wholesale',
    address: 'No 84, 2nd Cross Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 75 577 5565',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.6176388086064!2d79.84965107499666!3d6.936218993063737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTAuNCJOIDc5wrA1MScwOC4wIkU!5e0!3m2!1sen!2slk!4v1767424754590!5m2!1sen!2slk',
    image: './2nd_CS_86.jpeg',
  },
  {
    id: 4,
    name: 'Kandy Branch',
    address: 'No 57, Yatinuwara Lane (Alimudukkuwa), Kandy, Sri Lanka',
    phone: '+94 77 345 2456',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3957.5350371179384!2d80.633076075!3d7.2936209927139055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTcnMzcuMCJOIDgwwrAzOCcwOC4zIkU!5e0!3m2!1sen!2slk!4v1767424839096!5m2!1sen!2slk',
    image: '',
  },
  {
    id: 5,
    name: 'Kandy City Center Branch (KCC) - Winsor (Wholesale)',
    address: 'Level 3, Kandy City Center, Kandy, Sri Lanka',
    phone: '+94 77 977 9666',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5477352274393!2d80.63232717026546!3d7.292184497679624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662be0e19fad%3A0xfc32bb846bc0d50a!2sKandy%20City%20Centre%2C%20Kandy!5e0!3m2!1sen!2slk!4v1767424917683!5m2!1sen!2slk',
    image: '',
  },
  {
    id: 6,
    name: 'Dubai – UAE Branch',
    address: 'No. 102, Al-Buteen (Oppsite to Dubai Wholesale Plaza), Murshid Bazar, Deira, Dubai, UAE',
    phone: '+971 58 667 7143',
    email: 'happytime143b@gmail.com',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3608.041541217658!2d55.29727207538427!3d25.269187977664714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE2JzA5LjEiTiA1NcKwMTcnNTkuNSJF!5e0!3m2!1sen!2slk!4v1767425006177!5m2!1sen!2slk',
    image: './DubaiBranch1.jpeg',
  },
];

// ✅ Country codes data
const countryCodes = [
  { code: '+94', name: 'Sri Lanka' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+86', name: 'China' },
  { code: '+81', name: 'Japan' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+39', name: 'Italy' },
  { code: '+7', name: 'Russia' },
  { code: '+55', name: 'Brazil' },
  { code: '+61', name: 'Australia' },
  { code: '+82', name: 'South Korea' },
  { code: '+34', name: 'Spain' },
  { code: '+31', name: 'Netherlands' },
  { code: '+46', name: 'Sweden' },
  { code: '+47', name: 'Norway' },
  { code: '+45', name: 'Denmark' },
  { code: '+358', name: 'Finland' },
  { code: '+41', name: 'Switzerland' },
  { code: '+43', name: 'Austria' },
  { code: '+32', name: 'Belgium' },
  { code: '+353', name: 'Ireland' },
  { code: '+351', name: 'Portugal' },
  { code: '+30', name: 'Greece' },
  { code: '+48', name: 'Poland' },
  { code: '+420', name: 'Czech Republic' },
  { code: '+36', name: 'Hungary' },
  { code: '+421', name: 'Slovakia' }
].sort((a, b) => a.name.localeCompare(b.name));

// ✅ Contact Form Component
const ContactFormWithRecaptcha = ({ selectedBranchId, branches }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    countryCode: '+94',
    message: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getSelectedBranch = () => {
    return branches.find(b => b.id === selectedBranchId) || null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({ ...formData, phone: limitedDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim();
    const phoneTrimmed = formData.phone.trim();
    const messageTrimmed = formData.message.trim();

    if (!nameTrimmed) {
      toast.error('Please enter your name.');
      return false;
    }
    if (!emailTrimmed) {
      toast.error('Please enter your email.');
      return false;
    }
    if (!messageTrimmed) {
      toast.error('Please enter your message.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (phoneTrimmed && (phoneTrimmed.length < 9 || phoneTrimmed.length > 10)) {
      toast.error('Phone number must contain 9-10 digits.');
      return false;
    }

    // ✅ Enforce branch selection
    if (!selectedBranchId) {
      toast.error('Please select a branch to contact.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready. Please wait a moment and try again.');
      return;
    }

    setSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha('contact_form_submit');

      const selectedBranch = getSelectedBranch();
      const branchName = selectedBranch?.name || 'Unknown Branch';

      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() ? `${formData.countryCode}${formData.phone.trim()}` : '',
          message: formData.message.trim(),
          branch: branchName,
          recaptchaToken
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', phone: '', countryCode: '+94', message: '' });
      } else {
        const errorMsg = data.message || 
          (Array.isArray(data.errors) ? data.errors.join(', ') : 'Failed to send your message.');
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Network error. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gold/30 transition-all duration-300">
      <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm transition-colors"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm transition-colors"
        />
        
        {/* PHONE WITH COUNTRY CODE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="sr-only">Country Code</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm transition-colors"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} ({country.name})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="sr-only">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone (9-10 digits)"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm transition-colors"
            />
          </div>
        </div>
        
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message *"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm resize-none transition-colors"
        ></textarea>
        
        {/* reCAPTCHA Notice */}
        <div className="text-xs text-gray-500 text-center">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            Terms of Service
          </a>{' '}
          apply.
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

// ✅ Main Contact Page Component
const ContactPage = () => {
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const getSelectedBranch = () => {
    return branches.find(b => b.id === selectedBranchId) || null;
  };

  const selectedBranch = getSelectedBranch();

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <div className="bg-black text-white min-h-screen font-sans">
        <ScrollToTop />
        
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        {/* HERO */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <img
            src="/MainBranchPettah.jpeg"
            alt="Happy Time Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-4 tracking-wide">
              Contact Us
            </h1>
            <p className="max-w-2xl text-gray-300 text-lg md:text-xl">
              We're here to help. Reach out to any of our branches.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto py-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT: Branch Info */}
            <div>
              <div className="mb-6">
                <h3 className="text-gold font-semibold text-lg mb-2">Which branch would you like to contact?</h3>
                <select
                  value={selectedBranchId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedBranchId(val ? Number(val) : null);
                    setMapLoaded(false);
                  }}
                  className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold shadow-sm transition-colors"
                >
                  <option value="">— Select a branch —</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBranch ? (
                <div className="space-y-4 mt-4 p-6 bg-gradient-to-br from-gray-800/40 via-gray-900/30 to-gray-800/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                  <div>
                    <h3 className="text-gold font-semibold text-lg mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Address
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedBranch.address}</p>
                  </div>
                  <div>
                    <h3 className="text-gold font-semibold text-lg mb-2">Contact</h3>
                    <a 
                      href={`tel:${selectedBranch.phone}`}
                      className="text-gray-300 flex items-center gap-2 mb-2 hover:text-gold transition-colors group"
                    >
                      <span className="text-gold group-hover:scale-110 transition-transform">📞</span>
                      <span className="group-hover:underline">{selectedBranch.phone}</span>
                    </a>
                    <a 
                      href={`mailto:${selectedBranch.email}`}
                      className="text-gray-300 flex items-center gap-2 hover:text-gold transition-colors group"
                    >
                      <span className="text-gold group-hover:scale-110 transition-transform">✉️</span>
                      <span className="group-hover:underline">{selectedBranch.email}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 text-gray-500 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Select a branch above to view its details and send a message.</p>
                </div>
              )}
            </div>

            {/* RIGHT: Contact Form */}
            <ContactFormWithRecaptcha 
              selectedBranchId={selectedBranchId} 
              branches={branches}
            />
          </div>

          {/* GOOGLE MAP */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Location</h3>
            <div className="rounded-2xl overflow-hidden border border-gray-700/50 h-96 md:h-[500px] relative shadow-lg">
              {!mapLoaded && selectedBranch && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent mb-2"></div>
                    <span className="text-white">Loading map...</span>
                  </div>
                </div>
              )}
              {selectedBranch ? (
                <iframe
                  src={selectedBranch.mapLink}
                  width="100%"
                  height="100%"
                  className="rounded-xl relative z-10"
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                  title={selectedBranch.name}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-500">Select a branch to see its location on the map.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default ContactPage;