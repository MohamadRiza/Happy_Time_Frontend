// src/components/HomeSections/AboutSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-4 bg-black relative overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.2) 1px, transparent 0)`,
               backgroundSize: '50px 50px',
               transform: `translateY(${scrollY * 50}px)`
             }}
        />
      </div>

      {/* Gradient Orbs with parallax */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[140px]"
        style={{ transform: `translateY(${scrollY * -30}px)` }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Image Side */}
        <div 
          className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="relative rounded-sm overflow-hidden border border-gray-800/50 group">
            {/* Image with subtle zoom on hover */}
            <div className="relative overflow-hidden">
              <img
                src="./interior.jpg"
                alt="Happy Time Boutique - Luxury Watch Store in Colombo"
                className="w-full h-auto object-cover transition-transform duration-700 
                         group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/images/fallback-about.jpg';
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-gold/10 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
            
            {/* Gold accent line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold via-gold/50 to-transparent" />
            
            {/* Floating year badge */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-gold/30 
                          rounded-full px-5 py-2.5">
              <span className="text-gold font-light text-sm tracking-wider">Est. 1996</span>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-gold/20" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-gold/20" />
        </div>

        {/* Text Content */}
        <div 
          className={`text-white space-y-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          {/* Subtitle */}
          <div className="inline-block">
            <span className="text-xs md:text-sm tracking-[0.3em] text-gold/70 uppercase font-light">
              Our Heritage
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            Crafted for <span className="text-gold font-normal">Connoisseurs</span>
          </h2>

          <div className="w-16 h-[1px] bg-gold" />

          {/* Body Text */}
          <div className="space-y-5">
            <p className="text-gray-300 leading-relaxed text-base font-light">
              Since <span className="text-gold font-normal">1996</span>, Happy Time Pvt Ltd has been 
              Sri Lanka's most trusted destination for luxury timepieces. Located in the heart of 
              Pettah, Colombo, we offer an exclusive collection of the world's finest watchmakers.
            </p>

            <p className="text-gray-400 leading-relaxed text-base font-light">
              With nearly three decades of horological expertise, we don't just sell watches — 
              we share passion, heritage, and timeless value.
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-gold/90 hover:text-gold 
                       font-medium transition-all duration-300 group/link"
            >
              <span className="tracking-wide">Discover Our Story</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform group-hover/link:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stats/Badge Section */}
          <div className="pt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-4 px-6 py-3 rounded-sm 
                          border border-gold/20 bg-black/40 backdrop-blur-sm">
              <div className="text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-light text-lg">30+</div>
                <div className="text-gray-400 text-xs tracking-wider uppercase">Years Experience</div>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3 rounded-sm 
                          border border-gold/20 bg-black/40 backdrop-blur-sm">
              <div className="text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-light text-lg">100%</div>
                <div className="text-gray-400 text-xs tracking-wider uppercase">Authentic</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for smooth parallax */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;