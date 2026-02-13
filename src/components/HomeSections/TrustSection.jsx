// src/components/HomeSections/TrustSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const trustFeatures = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '30+ Years',
      subtitle: 'Horological Expertise',
      description: 'Serving Sri Lanka and the UAE with authentic timepieces since 1996.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '7-Day Returns',
      subtitle: 'Conditional Policy',
      description: 'Eligible returns accepted within 7 days if unused, with original packaging. Some watches are non-returnable - please confirm before purchase.',
      link: { text: 'View Return Policy', to: '/return-policy' }
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Wholesale & Retail',
      subtitle: 'Flexible Solutions',
      description: 'We serve individual customers, retailers, and wholesale partners across Sri Lanka and the UAE.',
      link: { text: 'Contact for Wholesale', to: '/contact' }
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-28 md:py-36 px-4 bg-black relative overflow-hidden"
    >
      {/* Refined Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `linear-gradient(30deg, rgba(212,175,55,0.15) 1px, transparent 1px),
                                linear-gradient(150deg, rgba(212,175,55,0.15) 1px, transparent 1px)`,
               backgroundSize: '80px 80px'
             }}
        />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[140px] animate-pulse-slow animation-delay-3000" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="inline-block mb-4">
            <span className="text-xs md:text-sm tracking-[0.3em] text-gold/70 uppercase font-light">
              Our Commitment
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            The Happy Time <span className="text-gold font-normal">Promise</span>
          </h2>
          
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-b from-gray-900/30 to-gray-900/10 
                        backdrop-blur-sm border border-gray-800/50 rounded-lg p-8 
                        hover:border-gold/40 transition-all duration-500 
                        hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                            bg-gold/10 mb-6 relative overflow-hidden group-hover:bg-gold/15 
                            transition-colors duration-500">
                <div className="text-gold relative z-10">
                  {feature.icon}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-white text-2xl font-light mb-1 
                               group-hover:text-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gold/70 text-sm tracking-wider uppercase font-light">
                    {feature.subtitle}
                  </p>
                </div>
                
                <p className="text-gray-400 leading-relaxed text-sm font-light">
                  {feature.description}
                </p>

                {feature.link && (
                  <Link
                    to={feature.link.to}
                    className="inline-flex items-center gap-2 text-gold/80 hover:text-gold 
                             text-sm font-medium transition-all duration-300 group/link pt-2"
                  >
                    <span className="tracking-wide">{feature.link.text}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-gold/30 to-transparent" />
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-gold/30 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Final Statement */}
        <div className={`text-center max-w-3xl mx-auto space-y-6 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight">
            Your Trusted Partner in Timekeeping Excellence
          </h3>
          
          <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
            From selection to after-sales support, we ensure every watch meets our standard of authenticity and service.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold/50" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default TrustSection;