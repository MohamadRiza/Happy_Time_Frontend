// src/components/HomeSections/HeroSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);
  const rafRef = useRef(null);
  const lastScrollY = useRef(0);

  const videoSources = [
    '/generated_video.mp4',
    '/generated_video1.mp4',
    '/generated_video2.mp4',
  ];

  const totalVideos = videoSources.length;

  // Entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Optimized scroll handler with RAF (Request Animation Frame) throttling
  const handleScroll = useCallback(() => {
    // Cancel any pending frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      // Only update if scroll changed significantly (reduces re-renders)
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        lastScrollY.current = currentScrollY;
        
        if (heroRef.current) {
          const heroHeight = heroRef.current.offsetHeight;
          const progress = Math.min(currentScrollY / (heroHeight * 0.6), 1);
          setScrollProgress(progress);
        }
      }
    });
  }, []);

  // Scroll progress tracking - optimized with passive listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Auto-advance videos
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
    }, 12000);
    return () => clearTimeout(timer);
  }, [currentVideoIndex, totalVideos]);

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + totalVideos) % totalVideos);

  return (
    <div 
      ref={heroRef} 
      className="sticky top-0 w-full h-screen overflow-hidden bg-black"
      style={{ willChange: scrollProgress > 0 && scrollProgress < 1 ? 'opacity' : 'auto' }}
    >
      {/* Video Backgrounds with Smooth Transitions */}
      {videoSources.map((src, index) => (
        <video
          key={index}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}

      {/* Scroll-based fade overlay - Omega effect - Using CSS variable for GPU optimization */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-200"
        style={{ 
          opacity: scrollProgress * 0.7,
          willChange: scrollProgress > 0 && scrollProgress < 1 ? 'opacity' : 'auto'
        }}
      />

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      
      {/* Animated Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Hero Content - Using CSS transform for better performance */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`text-center px-4 max-w-5xl transition-opacity duration-1500 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            opacity: 1 - (scrollProgress * 0.8),
            transform: `translate3d(0, ${scrollProgress * 30}px, 0) scale(${1 - scrollProgress * 0.1})`,
            willChange: scrollProgress > 0 && scrollProgress < 1 ? 'transform, opacity' : 'auto'
          }}
        >
          
          {/* Subtitle - Animated Entry */}
          <div 
            className={`mb-6 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-block px-6 py-2 text-sm md:text-base tracking-[0.3em] text-gold/90 
                           border border-gold/30 rounded-full backdrop-blur-sm bg-black/20 
                           uppercase font-light">
              Since 1996
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-8 
                       tracking-tight leading-[1.1] transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block font-extralight">Timeless</span>
            <span className="block text-gold font-normal">Elegance</span>
          </h1>

          {/* Description */}
          <p 
            className={`text-base sm:text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto 
                       leading-relaxed font-light transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Curating the world's finest luxury timepieces for discerning collectors 
            across Sri Lanka
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-5 justify-center items-center 
                       transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link to="/shop">
              <button 
                className="group relative px-10 py-4 bg-gold text-black font-medium text-sm 
                         tracking-wider uppercase rounded-sm overflow-hidden
                         transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 
                              transition-transform duration-500 origin-left" />
              </button>
            </Link>

            <Link to="/contact">
              <button 
                className="group relative px-10 py-4 border-2 border-gold/60 text-gold font-medium 
                         text-sm tracking-wider uppercase rounded-sm backdrop-blur-sm bg-black/10
                         transition-all duration-500 hover:bg-gold hover:text-black hover:border-gold
                         hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Refined Design */}
      <button
        onClick={prevVideo}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20
                 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 
                 backdrop-blur-md p-4 rounded-full transition-all duration-300
                 border border-white/10 hover:border-gold/50 hover:scale-110
                 focus:outline-none focus:ring-2 focus:ring-gold/50"
        aria-label="Previous video"
        style={{ 
          opacity: 1 - scrollProgress,
          pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
        }}
      >
        <FaChevronLeft size={18} />
      </button>

      <button
        onClick={nextVideo}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20
                 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 
                 backdrop-blur-md p-4 rounded-full transition-all duration-300
                 border border-white/10 hover:border-gold/50 hover:scale-110
                 focus:outline-none focus:ring-2 focus:ring-gold/50"
        aria-label="Next video"
        style={{ 
          opacity: 1 - scrollProgress,
          pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
        }}
      >
        <FaChevronRight size={18} />
      </button>

      {/* Elegant Progress Indicators */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3"
        style={{ 
          opacity: 1 - scrollProgress,
          pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
        }}
      >
        {videoSources.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className="group relative focus:outline-none"
            aria-label={`Go to video ${index + 1}`}
          >
            {index === currentVideoIndex ? (
              <div className="w-12 h-[2px] bg-gold rounded-full overflow-hidden">
                <div className="h-full bg-white/50 animate-progress-fill" />
              </div>
            ) : (
              <div className="w-8 h-[2px] bg-white/30 rounded-full 
                            group-hover:bg-white/50 transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator - Perfectly Centered */}
      <div 
        className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-20
                   transition-all duration-1000 delay-[1500ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ 
          opacity: (1 - scrollProgress) * (isVisible ? 1 : 0),
          pointerEvents: 'none'
        }}
      >
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes progress-fill {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-progress-fill {
          animation: progress-fill 12s linear;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;