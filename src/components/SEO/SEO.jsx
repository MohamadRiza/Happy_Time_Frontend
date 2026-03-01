import { Helmet } from 'react-helmet';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = '/ogimage.png',
  ogType = 'website'
}) => {
  const baseUrl = 'https://happytimeonline.com';
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Happy Time Pvt Ltd" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Happy Time Watches" />
      <meta property="og:locale" content="en_LK" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={fullUrl} />}
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Happy Time Pvt Ltd",
          "url": baseUrl,
          "logo": `${baseUrl}/logo1.png`,
          "image": `${baseUrl}${ogImage}`,
          "description": "Sri Lanka's trusted watch distribution and retail company serving customers across Sri Lanka and abroad including UAE",
          "telephone": "+94 76 300 9123",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No 49A, Keyzer Street, Pettah",
            "addressLocality": "Colombo 11",
            "postalCode": "11",
            "addressCountry": "LK"
          },
          "sameAs": [
            "https://www.facebook.com/happytime",
            "https://www.instagram.com/happytime"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;