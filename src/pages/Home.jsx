// src/pages/Home.jsx
// SEO OPTIMIZED - TOP 1 WATCH SHOP IN COLOMBO / SRI LANKA & BEST WATCH SHOP IN UAE
import React from 'react';
import SEO from '../components/SEO/SEO';
import HeroSection from '../components/HomeSections/HeroSection';
import FeaturedWatches from '../components/HomeSections/FeaturedWatches';
import CategorySection from '../components/HomeSections/CategorySection';
import TrustSection from '../components/HomeSections/TrustSection';
import AboutSection from '../components/HomeSections/AboutSection';
import ScrollToTop from '../components/ScrollToTop';
import BrandsMarquee from '../components/HomeSections/BrandsMarquee';
import GuestPrompt1 from '../components/GuestPrompt1';

const Home = () => {
  // Enhanced SEO Meta Data targeting Top 1 Watch Shop in Colombo / Sri Lanka & Best Watch Shop in UAE
  const seoData = {
    title: "Happy Time | Best Watch Shop in Sri Lanka & UAE - Top #1 Watch Shop in Colombo",
    description: "Happy Time is the #1 best watch shop in Colombo & Sri Lanka, and leading watch store in Dubai, UAE. Explore luxury timepieces from Winsor, Orix & Ariel. Retail & wholesale with islandwide & UAE delivery.",
    keywords: "best watch shop in sri lanka, top 1 watch shop in colombo, best watch shop in uae, top watch shop in colombo sri lanka, best watch store in dubai, watch shop pettah, watch wholesaler colombo, happy time watches, luxury watches sri lanka, winsor watches, orix watches, ariel wall clocks, original watches sri lanka, branded watches colombo, watch shop kandy, dubai wholesale watch store, deira watch shop, best watch brands sri lanka, buy watches online sri lanka, happy time online",
    canonicalUrl: "/"
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage="/ogimage.png"
      />

      <ScrollToTop />
      <div className="relative">
        <GuestPrompt1>
          <HeroSection />
          <FeaturedWatches />
          <CategorySection />
          <AboutSection />
          <TrustSection />
          <BrandsMarquee />
        </GuestPrompt1>
      </div>
    </>
  );
};

export default Home;
