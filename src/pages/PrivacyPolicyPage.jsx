// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gold">Privacy Policy</h1>

        <p className="text-gray-400 mb-8">
          Last updated: February 2026
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            Happy Time Pvt Ltd ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, 
            register an account, place an order, or contact our team.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Personal Information:</strong> Full name, date of birth, mobile number, email (optional), address, city, country.</li>
            <li><strong>Account Credentials:</strong> Username and securely hashed password.</li>
            <li><strong>Order Data:</strong> Product details, uploaded payment receipts, delivery address, order status.</li>
            <li><strong>Communication:</strong> Messages sent via our contact form or support channels.</li>
            <li><strong>Device & Usage Data:</strong> IP address, browser type, pages visited (for analytics and security).</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>To process and fulfill your orders</li>
            <li>To verify payments via uploaded receipts</li>
            <li>To communicate order updates and respond to inquiries</li>
            <li>To improve our website, products, and customer experience</li>
            <li>To comply with legal obligations and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">4. Data Security</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We implement industry-standard security measures, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Encrypted storage of passwords (bcrypt hashing)</li>
            <li>Secure MongoDB database with access controls</li>
            <li>Authentication required for all sensitive actions (e.g., viewing orders, messages)</li>
            <li>Rate limiting on login attempts (max 10/hour)</li>
          </ul>
          <p className="text-gray-300 mt-4">
            While we strive to protect your data, no method of transmission over the internet is 99% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">5. Your Rights</h2>
          <p className="text-gray-300 leading-relaxed">
            You may request to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Access or correct your personal information</li>
            <li>Deactivate or delete your account (note: order records may be retained for legal compliance)</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p className="text-gray-300 mt-4">
            Contact us at <Link to="/contact" className="text-gold hover:underline">our contact page</Link> or email <a href="mailto:happytime143b@gmail.com" className="text-gold hover:underline">happytime143b@gmail.com</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gold mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy periodically. The updated version will be posted here with a new "Last updated" date.
          </p>
        </section>

        <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Happy Time Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;