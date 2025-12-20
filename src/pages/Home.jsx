// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/HomeSections/HeroSection';
import FeaturedWatches from '../components/HomeSections/FeaturedWatches';
import CategorySection from '../components/HomeSections/CategorySection';
import TrustSection from '../components/HomeSections/TrustSection';
import AboutSection from '../components/HomeSections/AboutSection';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  return (
    <>
    <ScrollToTop />
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