// src/pages/Home.jsx
// SEO OPTIMIZED - META TAGS & STRUCTURED DATA ADDED
import React from 'react';
import SEO from '../components/SEO/SEO';
import HeroSection from '../components/HomeSections/HeroSection';
import FeaturedWatches from '../components/HomeSections/FeaturedWatches';
import CategorySection from '../components/HomeSections/CategorySection';
import TrustSection from '../components/HomeSections/TrustSection';
import AboutSection from '../components/HomeSections/AboutSection';
import ScrollToTop from '../components/ScrollToTop';
import BrandsMarquee from '../components/HomeSections/BrandsMarquee';
import GuestPrompt from '../components/GuestPrompt';

const Home = () => {
  // SEO Meta Data
  const seoData = {
    title: "Happy Time | Sri Lanka's Premium Watch Collection - Winsor, Orix, Arial, and more",
    description: "Happy Time Pvt Ltd offers Sri Lanka's finest collection of luxury watches. Shop exclusive brands Winsor, Orix & Arial. Wholesale & retail available in Colombo, Kandy & Dubai.",
    keywords: "luxury watches Sri Lanka, premium watches Colombo, Winsor watches, Orix watches, Arial wall clocks, watch shop Pettah, wholesale watches, retail watches, Kandy watch store, Dubai watch shop, Happy Time watches, affordable luxury watches, men's watches, women's watches, unisex watches, kids watches, Smart watches, couple watches, high copy watches, watch repair Sri Lanka, watch accessories, watch servicing, watch collection Sri Lanka",
    canonicalUrl: "/"
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage="/watchFTR.jpg"
      />

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

      {/* Structured Data - Organization & Website */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Happy Time Pvt Ltd",
          "url": "https://www.happytime.lk",
          "logo": "https://www.happytime.lk/logo.png",
          "image": "https://www.happytime.lk/watchFTR.jpg",
          "description": "Sri Lanka's leading watch distribution and retail company serving customers across Sri Lanka and UAE",
          "telephone": "+94 76 300 9123",
          "email": "happytime143b@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No 49A, Keyzer Street, Pettah",
            "addressLocality": "Colombo 11",
            "postalCode": "11",
            "addressCountry": "LK"
          },
          "areaServed": ["LK", "AE"],
          "foundingYear": "1996",
          "brand": ["Winsor", "Orix", "Arial", "High Copy"],
          "sameAs": [
            "https://www.facebook.com/happytime",
            "https://www.instagram.com/happytime"
          ]
        })}
      </script>

      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Happy Time Watches",
          "url": "https://www.happytime.lk",
          "description": "Premium watch collection in Sri Lanka - Luxury watches from Winsor, Orix & Arial brands",
          "publisher": {
            "@type": "Organization",
            "name": "Happy Time Pvt Ltd"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.happytime.lk/shop?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Structured Data - Product Collection */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Happy Time Watch Collection",
          "description": "Explore our exclusive collection of luxury watches from Winsor, Orix and Arial brands",
          "url": "https://www.happytime.lk",
          "image": "https://www.happytime.lk/watchFTR.jpg",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "Product",
                "name": "Winsor Watches",
                "description": "Classic wrist watches with timeless elegance and traditional craftsmanship",
                "brand": "Winsor"
              },
              {
                "@type": "Product",
                "name": "Orix Watches",
                "description": "Precision wrist watches with contemporary design and engineering",
                "brand": "Orix"
              },
              {
                "@type": "Product",
                "name": "Arial Wall Clocks",
                "description": "Premium wall clocks combining functional design with artistic craftsmanship",
                "brand": "Arial"
              }
            ]
          }
        })}
      </script>
    </>
  );
};

export default Home;