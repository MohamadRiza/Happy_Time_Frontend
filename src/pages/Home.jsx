// src/pages/Home.jsx
// SEO OPTIMIZED SUCCESS and META TAGS ADDED Other Pages are Pending
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/HomeSections/HeroSection';
import FeaturedWatches from '../components/HomeSections/FeaturedWatches';
import CategorySection from '../components/HomeSections/CategorySection';
import TrustSection from '../components/HomeSections/TrustSection';
import AboutSection from '../components/HomeSections/AboutSection';
import ScrollToTop from '../components/ScrollToTop';
import BrandsMarquee from '../components/HomeSections/BrandsMarquee';
import GuestPrompt from '../components/GuestPrompt';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Happy Time | Luxury & Premium Watches Collection</title>
        <meta
          name="description"
          content="Explore Happy Time's exclusive collection of luxury and premium watches. Discover stylish, high-quality timepieces perfect for every occasion."
        />
        <meta
          name="keywords"
          content="luxury watches, premium watches, stylish timepieces, affordable watches, watch collection, high-quality watches"
        />
        <meta property="og:title" content="Happy Time | Luxury & Premium Watches" />
        <meta
          property="og:description"
          content="Discover Happy Time's curated selection of luxury and premium watches. Perfect timepieces for style, elegance, and everyday wear."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.happytime.com/" />
        <meta property="og:image" content="https://www.happytime.com/og-image.jpg" />
      </Helmet>

      <ScrollToTop />
      <div className="relative">
        <GuestPrompt>
        <HeroSection />
        <FeaturedWatches />
        <CategorySection />
        <AboutSection />
        <TrustSection />
        <BrandsMarquee />
        </GuestPrompt>
      </div>
    </>
  );
};

export default Home;
