// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedWatches from '../components/FeaturedWatches';
import AboutSection from '../components/AboutSection';
import CategorySection from '../components/CategorySection';
import TrustSection from '../components/TrustSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedWatches />
      <CategorySection/>
      <AboutSection />
      <TrustSection/>
      {/* You can add other sections below: product highlights, about snippet, etc. */}
    </>
  );
};

export default Home;