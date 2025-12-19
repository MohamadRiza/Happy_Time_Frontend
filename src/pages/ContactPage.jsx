// src/pages/ContactPage.jsx
import React, { useState } from 'react';

const branches = [
  {
    id: 1,
    name: 'Colombo – Head Office',
    address: '49A Keyzer Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 77 123 4567',
    email: 'info@happytime.lk',
    mapLink:
      'https://www.google.com/maps?q=Happy+Time+(Pvt)+Ltd,+Pettah,+Colombo&output=embed',
    image:
      'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy6UDynoIaGrBBe5auk2SVB2B-uXWf0Y6lYYBYbYHgfGw37o3DkPW7PCwCblIwyoydTk3UOal3RS-EreuI8ISWdVUbUc7Fh5zKqa47Y79BDckNRGkBCocD3PYtInikpi63J3c6NJVyw5Ik=s680-w680-h510',
  },
  {
    id: 2,
    name: 'Pettah – Online Branch',
    address: 'No 143, 2nd Cross Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 71 987 6543',
    email: 'online@happytime.lk',
    mapLink:
      'https://www.google.com/maps?q=No+143,+2nd+Cross+Street,+Pettah,+Colombo,+Sri+Lanka&output=embed',
    image:
      'https://lh3.googleusercontent.com/p/AF1QipPCaSrRY-KInMSCHCAVmckf46xC4ASBekS6FeGR=s680-w680-h510',
  },
  {
    id: 3,
    name: 'Pettah – Retail Branch',
    address: 'No 84, 2nd Cross Street, Pettah, Colombo, Sri Lanka',
    phone: '+94 75 456 7890',
    email: 'retail@happytime.lk',
    mapLink:
      'https://www.google.com/maps?q=No+84,+2nd+Cross+Street,+Pettah,+Colombo,+Sri+Lanka&output=embed',
    image:
      'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx3VTjZPG1WzVFKWAOlfELllTrBAZF3xGC2lwWQWwMQOWMCbiDIRpd77aLZQuHBkiCvsuDz95jyfDUnuGFrEmJ4jjY__wBEXzoAUd_NxRZ18ILihq23rALg_rrFVtUdhIoK7EtA6A=s680-w680-h510',
  },
  {
    id: 4,
    name: 'Kandy Branch',
    address: 'No 57, Yatinuwara Lane (Alimudukkuwa), Kandy, Sri Lanka',
    phone: '+94 77 654 3210',
    email: 'kandy@happytime.lk',
    mapLink:
      'https://www.google.com/maps?q=No+57,+Yatinuwara+Lane,+Kandy,+Sri+Lanka&output=embed',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
  },
  {
    id: 5,
    name: 'Dubai – UAE Branch',
    address: 'No. 102–104, Behind Masjid Bin Dafoos, Murshid Bazar, Deira, Dubai, UAE',
    phone: '+971 55 123 4567',
    email: 'dubai@happytime.lk',
    mapLink:
      'https://www.google.com/maps?q=No.102-104,+Murshid+Bazar,+Deira,+Dubai,+UAE&output=embed',
    image: 'https://images.pexels.com/photos/4388167/pexels-photo-4388167.jpeg',
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);
  const [mapLoaded, setMapLoaded] = useState(false);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We’ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">

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
            Have a question, request, or consultation? We’re here to help.
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
                onChange={(e) => { setSelectedBranchId(Number(e.target.value)); setMapLoaded(false); }}
                className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold shadow-sm"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
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

          {/* RIGHT: Contact Form */}
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm" />
                <input type="tel" name="phone" placeholder="Phone (Optional)" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm" />
                <textarea name="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange} required className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold shadow-sm"></textarea>
                <button type="submit" className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-gold/90 transition-all">Send Message</button>
              </form>
            </div>
          </div>

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
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
