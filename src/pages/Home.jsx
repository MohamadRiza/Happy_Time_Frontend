// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedWatches from '../components/FeaturedWatches';
import AboutSection from '../components/AboutSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedWatches />
      <AboutSection />
      {/* You can add other sections below: product highlights, about snippet, etc. */}
    </>
  );
};

export default Home;