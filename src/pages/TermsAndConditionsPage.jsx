// src/pages/TermsAndConditionsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO/SEO';

const TermsAndConditionsPage = () => {
  // ✅ SEO Meta Data
  const seoData = {
    title: "Terms & Conditions | Happy Time Watches Sri Lanka - User Agreement",
    description: "Read Happy Time Pvt Ltd's Terms & Conditions for account registration, order placement, payment policies, and user responsibilities. Applicable to customers in Sri Lanka and UAE.",
    keywords: "happy time terms and conditions, happy time user agreement, happy time registration terms, watch shop terms Sri Lanka, happy time order policy, happy time payment terms, happy time return policy, happy time account security, happy time legal terms, happy time dubai terms",
    canonicalUrl: "/terms"
  };

  return (
    <div className="bg-black text-white min-h-screen" itemScope itemType="https://schema.org/WebPage">
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogImage="/watchFTR.jpg"
      />
      
      <ScrollToTop />
      
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 
          className="text-4xl font-bold text-center mb-12 text-[#D4AF37]" 
          itemProp="headline"
        >
          Terms & Conditions
        </h1>

        <p className="text-gray-400 mb-8">
          Last updated: February 2026
        </p>

        {/* 1. Acceptance of Terms */}
        <section className="mb-10" aria-labelledby="acceptance-heading">
          <h2 
            className="text-2xl font-bold text-[#D4AF37] mb-4" 
            id="acceptance-heading"
            itemProp="name"
          >
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-300 leading-relaxed" itemProp="description">
            By registering an account, accessing, browsing, or making a purchase on <strong>happytimeonline.com</strong> (the "Site"), operated by Happy Time Pvt Ltd ("we", "us", or "our"), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the Site immediately.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section className="mb-10" aria-labelledby="eligibility-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="eligibility-heading">
            2. Eligibility & Registration
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>You must be at least 18 years old or have parental consent to register.</li>
            <li>You agree to provide accurate, current, and complete information during registration (Full Name, DOB, Mobile Number, Email, Address, Country, City).</li>
            <li>You are responsible for maintaining the confidentiality of your username and password.</li>
            <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that provide false information or violate these terms.</li>
          </ul>
        </section>

        {/* 3. Account Security */}
        <section className="mb-10" aria-labelledby="security-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="security-heading">
            3. Account Security & Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Your account credentials are protected using bcrypt hashing and secure MongoDB storage.</li>
            <li>Rate limiting (max 10 login attempts/hour) is enforced to prevent unauthorized access.</li>
            <li>You agree not to share your account credentials or allow third-party access.</li>
            <li>All sensitive actions (viewing orders, messages, cart) require authentication.</li>
            <li>We are not liable for losses resulting from your failure to safeguard login details.</li>
          </ul>
        </section>

        {/* 4. Products, Pricing & Availability */}
        <section className="mb-10" aria-labelledby="products-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="products-heading">
            4. Products, Pricing & Availability
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>All prices are displayed in <strong>LKR (Sri Lankan Rupees)</strong> unless otherwise specified.</li>
            <li>Product descriptions, images, and specifications are provided in good faith but may contain inadvertent errors.</li>
            <li>We reserve the right to correct pricing errors, update product details, or discontinue items without prior notice.</li>
            <li>Product availability is subject to real-time inventory; items may sell out before order confirmation.</li>
            <li>Luxury watches are authentic, brand-new, and sourced directly from authorized distributors.</li>
          </ul>
        </section>

        {/* 5. Order Placement & Payment */}
        <section className="mb-10" aria-labelledby="orders-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="orders-heading">
            5. Order Placement & Payment Process
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Orders are confirmed only after payment verification via uploaded receipt.</li>
            <li>We currently accept bank transfers. Payment gateway integration is in progress.</li>
            <li>After placing an order, you must upload a clear copy of your payment receipt via the secure portal.</li>
            <li>Our admin team verifies receipts manually; order status updates appear in your <strong>My Orders</strong> section.</li>
            <li>Failed verification, insufficient funds, or mismatched details may result in order cancellation.</li>
            <li>"Buy Now" initiates direct checkout; items are not added to cart. Cart functionality is reserved for logged-in users only.</li>
          </ul>
        </section>

        {/* 6. Shipping, Delivery & Risk */}
        <section className="mb-10" aria-labelledby="shipping-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="shipping-heading">
            6. Shipping, Delivery & Transfer of Risk
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Delivery is available within Sri Lanka; international shipping (e.g., UAE) is subject to separate terms and customs duties.</li>
            <li>Estimated delivery times are provided at checkout but are not guaranteed due to logistical variables.</li>
            <li>Title and risk of loss transfer to you upon delivery to the address provided.</li>
            <li>You are responsible for ensuring the delivery address is accurate and accessible.</li>
            <li>We are not liable for delays caused by courier services, customs, or force majeure events.</li>
          </ul>
        </section>

        {/* 7. Returns, Refunds & Exchanges */}
        <section className="mb-10" aria-labelledby="returns-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="returns-heading">
            7. Returns, Refunds & Exchanges
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Luxury watches are eligible for return/exchange only if: (a) unworn, (b) original packaging/tags intact, (c) reported within 7 days of delivery.</li>
            <li>Personalized, engraved, or special-order items are non-returnable unless defective.</li>
            <li>Defective items must be reported with photo/video evidence; we will arrange inspection and resolution.</li>
            <li>Refunds are processed to the original payment method within 14 business days after approval.</li>
            <li>Return shipping costs are the customer's responsibility unless the item is proven defective.</li>
            <li>Full return policy details are available on our <Link to="/returns" className="text-[#D4AF37] hover:underline">Returns Policy</Link> page.</li>
          </ul>
        </section>

        {/* 8. Intellectual Property */}
        <section className="mb-10" aria-labelledby="ip-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="ip-heading">
            8. Intellectual Property Rights
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            All content on this Site—including text, graphics, logos, brand names, product images, and software—is the property of Happy Time Pvt Ltd or its licensors and is protected by Sri Lankan and international copyright, trademark, and intellectual property laws.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>You may not reproduce, distribute, modify, or create derivative works without explicit written permission.</li>
            <li>Brand logos displayed under "Our Exclusive Brands" are trademarks of their respective owners; use is for identification only.</li>
            <li>Unauthorized commercial use of our content may result in legal action.</li>
          </ul>
        </section>

        {/* 9. User Conduct & Prohibited Activities */}
        <section className="mb-10" aria-labelledby="conduct-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="conduct-heading">
            9. User Conduct & Prohibited Activities
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Use the Site for any unlawful purpose or in violation of local, national, or international law.</li>
            <li>Attempt to gain unauthorized access to our systems, databases, or user accounts.</li>
            <li>Use automated scripts, bots, or scraping tools to extract data from the Site.</li>
            <li>Submit false, misleading, or fraudulent information during registration or checkout.</li>
            <li>Upload malicious files, viruses, or content that harms the Site or other users.</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with Happy Time.</li>
          </ul>
        </section>

        {/* 10. Limitation of Liability */}
        <section className="mb-10" aria-labelledby="liability-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="liability-heading">
            10. Limitation of Liability
          </h2>
          <p className="text-gray-300 leading-relaxed">
            To the maximum extent permitted by Sri Lankan law, Happy Time Pvt Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the Site or products. Our total liability for any claim related to your order shall not exceed the amount you paid for the specific product in question.
          </p>
        </section>

        {/* 11. Indemnification */}
        <section className="mb-10" aria-labelledby="indemnity-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="indemnity-heading">
            11. Indemnification
          </h2>
          <p className="text-gray-300 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Happy Time Pvt Ltd, its directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from: (a) your breach of these Terms, (b) your use of the Site, or (c) your violation of any third-party rights.
          </p>
        </section>

        {/* 12. Privacy & Data Protection */}
        <section className="mb-10" aria-labelledby="privacy-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="privacy-heading">
            12. Privacy & Data Protection
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Your personal information is collected, used, and protected in accordance with our <Link to="/privacy" className="text-[#D4AF37] hover:underline">Privacy Policy</Link>. By using this Site, you consent to the data practices described therein, including secure storage of payment receipts, order history, and communication records.
          </p>
        </section>

        {/* 13. Governing Law & Dispute Resolution */}
        <section className="mb-10" aria-labelledby="law-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="law-heading">
            13. Governing Law & Dispute Resolution
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>These Terms are governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.</li>
            <li>Any disputes shall first be addressed through good-faith negotiation via our contact channels.</li>
            <li>If unresolved, disputes shall be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.</li>
          </ul>
        </section>

        {/* 14. Changes to Terms */}
        <section className="mb-10" aria-labelledby="changes-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="changes-heading">
            14. Modifications to These Terms
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We reserve the right to update or modify these Terms at any time. Changes become effective immediately upon posting with a revised "Last updated" date. Your continued use of the Site after changes constitutes acceptance. We encourage you to review this page periodically.
          </p>
        </section>

        {/* 15. Contact Information */}
        <section className="mb-10" aria-labelledby="contact-heading">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4" id="contact-heading">
            15. Contact Us
          </h2>
          <p className="text-gray-300 leading-relaxed">
            For questions about these Terms & Conditions, please contact us:
          </p>
          <ul className="list-none pl-6 space-y-2 text-gray-300 mt-4">
            <li><strong>Address:</strong> 49A Keyzer Street, Pettah, Colombo, Sri Lanka</li>
            <li><strong>Phone:</strong> <a href="tel:+94777181785" className="text-[#D4AF37] hover:underline">+94 77 718 1785</a></li>
            <li><strong>Email:</strong> <a href="mailto:sales@happytimeonline.com" className="text-[#D4AF37] hover:underline">sales@happytimeonline.com</a></li>
            <li><strong>Website:</strong> <a href="https://www.happytimeonline.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">www.happytimeonline.com</a></li>
            <li><strong>Support:</strong> Visit our <Link to="/contact" className="text-[#D4AF37] hover:underline">Contact Page</Link> for inquiries</li>
          </ul>
        </section>

        {/* Footer Notice */}
        <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Happy Time Pvt Ltd. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Developed by <a href="https://nexasoft.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Nexasoft</a>
          </p>
        </div>
      </div>

      {/* ✅ Structured Data - TermsOfService Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TermsOfService",
          "name": "Happy Time Pvt Ltd Terms & Conditions",
          "description": "Terms and conditions for account registration, order placement, payment, shipping, returns, and user responsibilities on Happy Time Watches e-commerce platform",
          "url": "https://www.happytimeonline.com/terms",
          "creator": {
            "@type": "Organization",
            "name": "Happy Time Pvt Ltd",
            "url": "https://www.happytimeonline.com"
          },
          "dateCreated": "2026-02-01",
          "dateModified": "2026-02-14",
          "publisher": {
            "@type": "Organization",
            "name": "Happy Time Pvt Ltd",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "49A Keyzer Street, Pettah",
              "addressLocality": "Colombo",
              "addressCountry": "LK"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "sales@happytimeonline.com",
              "telephone": "+94 77 718 1785"
            }
          },
          "about": {
            "@type": "WebSite",
            "name": "Happy Time Watches",
            "url": "https://www.happytimeonline.com"
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "Text",
                "name": "Account Registration",
                "description": "Eligibility, accurate information, credential security, account responsibility"
              },
              {
                "@type": "Text",
                "name": "Orders & Payment",
                "description": "Bank transfer via Sri Lankan banks, receipt upload verification, order confirmation process"
              },
              {
                "@type": "Text",
                "name": "Shipping & Returns",
                "description": "Delivery within Sri Lanka, 7-day return window for unworn luxury watches with original packaging"
              },
              {
                "@type": "Text",
                "name": "User Obligations",
                "description": "Prohibited activities, intellectual property respect, indemnification, compliance with laws"
              },
              {
                "@type": "Text",
                "name": "Legal Framework",
                "description": "Governing law: Sri Lanka; dispute resolution via Colombo courts; terms subject to change with notice"
              }
            ]
          }
        })}
      </script>

      {/* ✅ Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.happytimeonline.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Terms & Conditions",
              "item": "https://www.happytimeonline.com/terms"
            }
          ]
        })}
      </script>
    </div>
  );
};

export default TermsAndConditionsPage;