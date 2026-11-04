import { Helmet } from 'react-helmet';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = '/ogimage.png',
  ogType = 'website',
  schemaData = null,
  geoRegion = 'LK-11',
  geoPlacename = 'Colombo, Pettah, Sri Lanka',
  geoPosition = '6.937309;79.849377'
}) => {
  const baseUrl = 'https://happytimeonline.com';
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  // Default Structured Data if not customized per page
  const defaultSchema = schemaData || {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Happy Time Pvt Ltd",
        "alternateName": ["Happy Time Watches", "Happy Time Sri Lanka", "Happy Time UAE"],
        "url": baseUrl,
        "logo": `${baseUrl}/logo1.png`,
        "image": `${baseUrl}/ogimage.png`,
        "description": "Sri Lanka's leading watch distribution and retail company since 1996, serving customers across Sri Lanka and Dubai, UAE. Exclusive dealer of Winsor, Orix, and Ariel timepieces.",
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
        "@id": `${baseUrl}/#colombo-headoffice`,
        "name": "Happy Time - Best Watch Shop in Colombo (Head Office)",
        "alternateName": "Top 1 Watch Shop in Colombo - Happy Time",
        "url": baseUrl,
        "image": `${baseUrl}/inside.png`,
        "telephone": "+94 76 300 9123",
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
          "bestRating": "5"
        }
      },
      {
        "@type": "WatchStore",
        "@id": `${baseUrl}/#dubai-branch`,
        "name": "Happy Time - Best Watch Shop in UAE (Dubai Branch)",
        "alternateName": "Top Watch Store in Dubai UAE - Happy Time",
        "url": baseUrl,
        "image": `${baseUrl}/DubaiBranch1.jpeg`,
        "telephone": "+971 58 667 7143",
        "priceRange": "$$$",
        "currenciesAccepted": "AED, USD",
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
          "bestRating": "5"
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Happy Time Pvt Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Geo Location Tags for Local SEO */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition.replace(';', ', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Happy Time Watches" />
      <meta property="og:locale" content="en_LK" />
      <meta property="og:locale:alternate" content="en_AE" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={fullUrl} />}
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
