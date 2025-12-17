// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedWatches from '../components/FeaturedWatches';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedWatches />
      {/* You can add other sections below: product highlights, about snippet, etc. */}
    </>
  );
};

export default Home;