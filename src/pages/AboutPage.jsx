// src/pages/AboutPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const branches = [
  {
    id: 1,
    name: 'Colombo – Head Office',
    address: '49A Keyzer Street, Pettah, Colombo 11, Sri Lanka',
    phone: '011 244 1800',
    image:
      './MainBranchPettah.jpeg',
    mapLink:
      'https://www.google.com/maps?q=Happy+Time+(Pvt)+Ltd,+Pettah,+Colombo&output=embed',
  },
  {
    id: 2,
    name: 'Online Branch - Pettah 143',
    address: 'No 143, 2nd Cross Street, Pettah, Colombo 11, Sri Lanka',
    phone: '+94 75 757 5565',
    image:
      './143_OnlineBranch.jpeg',
    mapLink:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.608471754673!2d79.84937707499664!3d6.937308993062671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTQuMyJOIDc5wrA1MScwNy4wIkU!5e0!3m2!1sen!2slk!4v1767424589827!5m2!1sen!2slk',
  },
  {
    id: 3,
    name: '2nd Cross Street 86 Branch - Wholesale',
    address: 'No 84, 2nd Cross Street, Pettah, Colombo, Sri Lanka',
    phone: '011 244 1800',
    image:
      './2nd_CS_86.jpeg',
    mapLink:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.6176388086064!2d79.84965107499666!3d6.936218993063737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTAuNCJOIDc5wrA1MScwOC4wIkU!5e0!3m2!1sen!2slk!4v1767424754590!5m2!1sen!2slk',
  },
  {
    id: 4,
    name: 'Kandy Branch',
    address: 'No 57, Yatinuwara Lane (Alimudukkuwa), Kandy, Sri Lanka',
    phone: '011 244 1800',
    image:
      '',
    mapLink:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3957.5350371179384!2d80.633076075!3d7.2936209927139055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTcnMzcuMCJOIDgwwrAzOCcwOC4zIkU!5e0!3m2!1sen!2slk!4v1767424839096!5m2!1sen!2slk',
  },
  {
    id: 4,
    name: 'Kandy City Center Branch (KCC)',
    address: 'KCC, 2nd Floor, No 01',
    phone: '011 244 1800',
    image:
      '',
    mapLink:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5477352274393!2d80.63232717026546!3d7.292184497679624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3662be0e19fad%3A0xfc32bb846bc0d50a!2sKandy%20City%20Centre%2C%20Kandy!5e0!3m2!1sen!2slk!4v1767424917683!5m2!1sen!2slk',
  },
  {
    id: 5,
    name: 'Dubai – UAE Branch',
    address:
      'No. 102–104, Behind Masjid Bin Dafoos, Murshid Bazar, Deira, Dubai, UAE',
    phone: '011 244 1800',
    image:
      './DubaiBranch1.jpeg',
    mapLink:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3608.041541217658!2d55.29727207538427!3d25.269187977664714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE2JzA5LjEiTiA1NcKwMTcnNTkuNSJF!5e0!3m2!1sen!2slk!4v1767425006177!5m2!1sen!2slk',
  },
];

const AboutPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">
<ScrollToTop />
      {/* HERO */}
      <div className="relative h-[70vh] md:h-[80vh]">
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx3VTjZPG1WzVFKWAOlfELllTrBAZF3xGC2lwWQWwMQOWMCbiDIRpd77aLZQuHBkiCvsuDz95jyfDUnuGFrEmJ4jjY__wBEXzoAUd_NxRZ18ILihq23rALg_rrFVtUdhIoK7EtA6A=s680-w680-h510"
          alt="Happy Time Boutique"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-4">
            Our Story
          </h1>
          <p className="max-w-2xl text-gray-300 text-lg">
            A legacy of precision, trust, and timeless craftsmanship
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto py-20 px-4">

        {/* INTRO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sri Lanka’s Trusted <span className="text-gold">Luxury Watch Destination</span>
            </h2>
            <div className="w-16 h-1 bg-gold mb-6" />
            <p className="text-gray-300 mb-6 leading-relaxed">
              Since <span className="text-gold font-semibold">2014</span>, Happy Time Pvt Ltd
              has stood at the heart of Colombo’s luxury watch scene.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We connect collectors with the world’s finest timepieces —
              backed by authenticity and exceptional care.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 via-transparent to-gold/10" />
            <img
              src="https://images.pexels.com/photos/11489971/pexels-photo-11489971.jpeg"
              alt="Team"
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>

        {/* BRANCHES */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Branches
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-14 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch);
                  setMapLoaded(false); // reset loading state
                }}
                className="border border-gray-800 rounded-2xl overflow-hidden hover:border-gold transition-all duration-300 block text-left"
              >
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    {branch.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    📍 {branch.address}
                  </p>
                  <p className="text-gray-500 text-sm">
                    📞 {branch.phone}
                  </p>
                  <p className="text-sm mt-2 text-blue-400 underline">
                    View on Map
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MODAL FOR MAP */}
        {selectedBranch && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl p-4 max-w-3xl w-full relative">
              <button
                onClick={() => setSelectedBranch(null)}
                className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gold"
              >
                ✕
              </button>
              <h3 className="text-gold text-2xl font-semibold mb-4 text-center">
                {selectedBranch.name}
              </h3>
              <div className="w-full h-[60vh] relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
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
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-block bg-gold text-black font-semibold px-10 py-4 rounded-full hover:bg-gold/90 transition"
          >
            Book a Private Viewing
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
