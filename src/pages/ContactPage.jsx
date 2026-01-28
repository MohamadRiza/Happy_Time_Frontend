// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// ✅ All URLs and names cleaned - NO trailing spaces
const branches = [
  {
    id: 1,
    name: 'Colombo – Head Office',
    address: '49A Keyzer Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 77 123 4567',
    email: 'info@happytime.lk',
    mapLink: 'https://www.google.com/maps?q=Happy+Time+(Pvt)+Ltd,+Pettah,+Colombo&output=embed',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy6UDynoIaGrBBe5auk2SVB2B-uXWf0Y6lYYBYbYHgfGw37o3DkPW7PCwCblIwyoydTk3UOal3RS-EreuI8ISWdVUbUc7Fh5zKqa47Y79BDckNRGkBCocD3PYtInikpi63J3c6NJVyw5Ik=s680-w680-h510',
  },
  {
    id: 2,
    name: 'Pettah – Online Branch',
    address: 'No 143, 2nd Cross Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 71 987 6543',
    email: 'online@happytime.lk',
    mapLink: 'https://www.google.com/maps?q=No+143,+2nd+Cross+Street,+Pettah,+Colombo,+Sri+Lanka&output=embed',
    image: 'https://lh3.googleusercontent.com/p/AF1QipPCaSrRY-KInMSCHCAVmckf46xC4ASBekS6FeGR=s680-w680-h510',
  },
  {
    id: 3,
    name: 'Pettah – Retail Branch',
    address: 'No 84, 2nd Cross Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 75 456 7890',
    email: 'retail@happytime.lk',
    mapLink: 'https://www.google.com/maps?q=No+84,+2nd+Cross+Street,+Pettah,+Colombo,+Sri+Lanka&output=embed',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx3VTjZPG1WzVFKWAOlfELllTrBAZF3xGC2lwWQWwMQOWMCbiDIRpd77aLZQuHBkiCvsuDz95jyfDUnuGFrEmJ4jjY__wBEXzoAUd_NxRZ18ILihq23rALg_rrFVtUdhIoK7EtA6A=s680-w680-h510',
  },
  {
    id: 4,
    name: 'Kandy Branch',
    address: 'No 57, Yatinuwara Lane (Alimudukkuwa), Kandy, Sri Lanka',
    phone: '+94 77 654 3210',
    email: 'kandy@happytime.lk',
    mapLink: 'https://www.google.com/maps?q=No+57,+Yatinuwara+Lane,+Kandy,+Sri+Lanka&output=embed',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
  },
  {
    id: 5,
    name: 'Dubai – UAE Branch',
    address: 'No. 102–104, Behind Masjid Bin Dafoos, Murshid Bazar, Deira, Dubai, UAE',
    phone: '+971 55 123 4567',
    email: 'dubai@happytime.lk',
    mapLink: 'https://www.google.com/maps?q=No.102-104,+Murshid+Bazar,+Deira,+Dubai,+UAE&output=embed',
    image: 'https://images.pexels.com/photos/4388167/pexels-photo-4388167.jpeg',
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

// ✅ Contact Form Component (needs to be separate to use reCAPTCHA hook)
const ContactFormWithRecaptcha = ({ selectedBranchId, branches }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    countryCode: '+94',
    message: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Get reCAPTCHA v3 hook
  const { executeRecaptcha } = useGoogleReCaptcha();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ Get selected branch
  const getSelectedBranch = () => {
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // ✅ Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({ ...formData, phone: limitedDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    // Trim all values
    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim();
    const phoneTrimmed = formData.phone.trim();
    const messageTrimmed = formData.message.trim();

    // Required fields validation
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    // Phone validation (optional but if provided, must be 9-10 digits)
    if (phoneTrimmed) {
      if (phoneTrimmed.length < 9 || phoneTrimmed.length > 10) {
        toast.error('Phone number must contain 9-10 digits.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ✅ Check if reCAPTCHA is ready
    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready. Please wait a moment and try again.');
      return;
    }

    // ✅ Get branch
    const selectedBranch = getSelectedBranch();
    const branchName = selectedBranch.name.trim();

    setSubmitting(true);

    try {
      // ✅ Execute reCAPTCHA v3 invisibly - Get token
      console.log('🔄 Generating reCAPTCHA token...');
      const recaptchaToken = await executeRecaptcha('contact_form_submit');
      console.log('✅ Token generated:', recaptchaToken ? 'YES' : 'NO');

      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() ? `${formData.countryCode}${formData.phone.trim()}` : '',
          message: formData.message.trim(),
          branch: branchName,
          recaptchaToken: recaptchaToken, // ✅ Send reCAPTCHA v3 token
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', phone: '', countryCode: '+94', message: '' });
      } else {
        // ✅ Show EXACT error from backend
        const errorMsg = 
          data.message || 
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"
        />
        
        {/* ✅ PHONE WITH COUNTRY CODE AND STRICT VALIDATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="sr-only">Country Code</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"
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
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"
            />
          </div>
        </div>
        
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message *"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"
        ></textarea>
        
        {/* ✅ reCAPTCHA v3 Notice */}
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
          className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold/90 transition-all disabled:opacity-70"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

// ✅ Main Contact Page Component
const ContactPage = () => {
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ✅ Get reCAPTCHA site key from environment variable
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // ✅ Guaranteed to always have a valid branch
  const getSelectedBranch = () => {
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  };

  const selectedBranch = getSelectedBranch();

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <div className="bg-black text-white min-h-screen font-sans">
        <ScrollToTop />
        
        {/* TOAST CONTAINER */}
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
        <div className="relative h-[70vh] md:h-[80vh]">
          <img
            src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
            alt="Get In Touch"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
              Get In Touch
            </h1>
            <p className="max-w-2xl text-gray-300 text-lg">
              Have a question, request, or consultation? We're here to help.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto py-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT: Branch Info */}
            <div>
              <div className="mb-6">
                <label className="text-gold font-semibold mb-2 block">Select Branch</label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => {
                    setSelectedBranchId(Number(e.target.value));
                    setMapLoaded(false);
                  }}
                  className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold shadow-sm"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 mt-4 p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-md">
                <div>
                  <h3 className="text-gold font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-300">{selectedBranch.address}</p>
                </div>
                <div>
                  <h3 className="text-gold font-semibold text-lg mb-1">Contact</h3>
                  <p className="text-gray-300 flex items-center gap-2">📞 {selectedBranch.phone}</p>
                  <p className="text-gray-300 flex items-center gap-2">✉️ {selectedBranch.email}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form with reCAPTCHA v3 */}
            <ContactFormWithRecaptcha 
              selectedBranchId={selectedBranchId} 
              branches={branches}
            />
          </div>

          {/* GOOGLE MAP */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Location</h3>
            <div className="rounded-2xl overflow-hidden border border-gray-800 h-96 md:h-[500px] relative shadow-lg">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                  <span className="text-white">Loading map...</span>
                </div>
              )}
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
            </div>
          </div>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default ContactPage;