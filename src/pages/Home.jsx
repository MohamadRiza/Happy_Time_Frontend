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
    description: "Happy Time is the #1 best watch shop in Colombo & Sri Lanka, and top watch store in Dubai, UAE. Explore luxury timepieces from Winsor, Orix & Ariel. Retail & wholesale with islandwide & UAE delivery.",
    keywords: "best watch shop in sri lanka, top 1 watch shop in colombo, best watch shop in uae, top watch shop in colombo sri lanka, best watch store in dubai, watch shop pettah, watch wholesaler colombo, happy time watches, luxury watches sri lanka, winsor watches, orix watches, ariel wall clocks, original watches sri lanka, branded watches colombo, watch shop kandy, dubai wholesale watch store, deira watch shop, best watch brands sri lanka, buy watches online sri lanka, happy time online",
    canonicalUrl: "/"
  };

  // Structured Data - Schema.org JSON-LD Graph
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://happytimeonline.com/#organization",
        "name": "Happy Time Pvt Ltd",
        "alternateName": ["Happy Time Watches", "Happy Time Sri Lanka", "Happy Time UAE"],
        "url": "https://happytimeonline.com",
        "logo": "https://happytimeonline.com/logo1.png",
        "image": "https://happytimeonline.com/ogimage.png",
        "description": "Sri Lanka's leading watch distribution and retail company since 1996, serving customers across Sri Lanka and Dubai, UAE. Exclusive distributor of Winsor, Orix, and Ariel timepieces.",
        "telephone": "+94 76 300 9123",
        "email": "happytime143b@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No 49A, Keyzer Street, Pettah",
          "addressLocality": "Colombo 11",
          "postalCode": "01100",
          "addressCountry": "LK"
        },
        "areaServed": [
          { "@type": "Country", "name": "Sri Lanka" },
          { "@type": "Country", "name": "United Arab Emirates" }
        ],
        "foundingDate": "1996",
        "brand": [
          { "@type": "Brand", "name": "Winsor" },
          { "@type": "Brand", "name": "Orix" },
          { "@type": "Brand", "name": "Ariel" },
          { "@type": "Brand", "name": "Happylex" }
        ],
        "sameAs": [
          "https://www.facebook.com/happytime",
          "https://www.instagram.com/happytime"
        ]
      },
      {
        "@type": "WatchStore",
        "@id": "https://happytimeonline.com/#colombo-headoffice",
        "name": "Happy Time - Best Watch Shop in Colombo (Head Office)",
        "alternateName": "Top 1 Watch Shop in Colombo Sri Lanka - Happy Time",
        "url": "https://happytimeonline.com",
        "image": "https://happytimeonline.com/inside.png",
        "telephone": "+94 76 300 9123",
        "email": "happytime143b@gmail.com",
        "priceRange": "$$",
        "currenciesAccepted": "LKR, USD",
        "paymentAccepted": "Cash, Credit Card, Debit Card, Bank Transfer",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No 49A, Keyzer Street, Pettah",
          "addressLocality": "Colombo 11",
          "addressRegion": "Western Province",
          "postalCode": "01100",
          "addressCountry": "LK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 6.937309,
          "longitude": 79.849377
        },
        "hasMap": "https://www.google.com/maps?q=Happy+Time+(Pvt)+Ltd,+Pettah,+Colombo",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WatchStore",
        "@id": "https://happytimeonline.com/#dubai-branch",
        "name": "Happy Time - Best Watch Shop in UAE (Dubai Branch)",
        "alternateName": "Top Watch Store in Dubai UAE - Happy Time",
        "url": "https://happytimeonline.com",
        "image": "https://happytimeonline.com/DubaiBranch1.jpeg",
        "telephone": "+971 58 667 7143",
        "priceRange": "$$$",
        "currenciesAccepted": "AED, USD",
        "paymentAccepted": "Cash, Credit Card, Debit Card, Bank Transfer",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No. 102, Al-Buteen (Opposite to Dubai Wholesale Plaza), Murshid Bazar, Deira",
          "addressLocality": "Dubai",
          "addressRegion": "Dubai",
          "addressCountry": "AE"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.269188,
          "longitude": 55.297272
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "22:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "890",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://happytimeonline.com/#website",
        "name": "Happy Time Watches",
        "url": "https://happytimeonline.com",
        "description": "Best watch shop in Sri Lanka and UAE. Luxury watches from Winsor, Orix & Ariel brands.",
        "publisher": {
          "@type": "Organization",
          "name": "Happy Time Pvt Ltd"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://happytimeonline.com/shop?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": "https://happytimeonline.com/#collection",
        "name": "Happy Time Watch Collection - Best Watch Shop in Sri Lanka & UAE",
        "description": "Explore our exclusive collection of luxury watches from Winsor, Orix, and Ariel brands",
        "url": "https://happytimeonline.com",
        "image": "https://happytimeonline.com/ogimage.png",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "Product",
              "name": "Winsor Watches",
              "description": "Classic wrist watches with timeless elegance and traditional craftsmanship",
              "brand": { "@type": "Brand", "name": "Winsor" }
            },
            {
              "@type": "Product",
              "name": "Orix Watches",
              "description": "Precision wrist watches with contemporary design and engineering",
              "brand": { "@type": "Brand", "name": "Orix" }
            },
            {
              "@type": "Product",
              "name": "Ariel Wall Clocks",
              "description": "Premium wall clocks combining functional design with artistic craftsmanship",
              "brand": { "@type": "Brand", "name": "Ariel" }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://happytimeonline.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which is the best watch shop in Sri Lanka?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy Time (Pvt) Ltd is recognized as the #1 best watch shop in Sri Lanka. Established in 1996, Happy Time offers luxury, classic, and sports timepieces from exclusive brands including Winsor, Orix, and Ariel with retail and wholesale branches across Colombo and Kandy."
            }
          },
          {
            "@type": "Question",
            "name": "Where is the top 1 watch shop in Colombo located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy Time's main Colombo Head Office is located at No 49A, Keyzer Street, Pettah, Colombo 11, Sri Lanka. Additional branches operate at No 143 and No 84, 2nd Cross Street, Pettah, Colombo."
            }
          },
          {
            "@type": "Question",
            "name": "Which is the best watch shop in UAE / Dubai for wholesale and luxury watches?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy Time operates an exclusive international branch in Dubai, UAE located at No. 102, Al-Buteen (opposite Dubai Wholesale Plaza), Murshid Bazar, Deira, Dubai. It offers premium watches at wholesale and retail prices."
            }
          },
          {
            "@type": "Question",
            "name": "Can I buy authentic watches online in Sri Lanka with delivery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can buy authentic watches online directly from Happy Time at happytimeonline.com with warranty, secure checkout, and fast islandwide cash-on-delivery across Sri Lanka."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage="/ogimage.png"
        schemaData={homeSchema}
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
