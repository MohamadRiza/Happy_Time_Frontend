// src/components/HomeSections/HeroSection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const heroRef = useRef(null);
  const autoAdvanceTimeout = useRef(null);

  const videoSources = [
    '/generated_video.mp4',
    '/generated_video1.mp4',
    '/generated_video2.mp4',
  ];

  const totalVideos = videoSources.length;

  /* Entrance animation */
  useEffect(() => {
    setIsVisible(true);
  }, []);

  /* Scroll progress via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const progress = 1 - entry.intersectionRatio;
        heroRef.current?.setAttribute(
          'data-scroll-progress',
          progress.toString()
        );
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    if (heroRef.current) observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  /* Auto-advance with hover pause */
  useEffect(() => {
    autoAdvanceTimeout.current = setTimeout(() => {
      if (!isHovered) {
        setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
      }
    }, 12000);

    return () => clearTimeout(autoAdvanceTimeout.current);
  }, [currentVideoIndex, isHovered, totalVideos]);

  const nextVideo = useCallback(() => {
    clearTimeout(autoAdvanceTimeout.current);
    setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
  }, [totalVideos]);

  const prevVideo = useCallback(() => {
    clearTimeout(autoAdvanceTimeout.current);
    setCurrentVideoIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
  }, [totalVideos]);

  const scrollProgress = parseFloat(
    heroRef.current?.dataset.scrollProgress || '0'
  );

  return (
    <div
      ref={heroRef}
      className="sticky top-0 w-full h-screen overflow-hidden bg-black z-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <video
        key={currentVideoIndex}
        src={videoSources[currentVideoIndex]}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) =>
          console.warn('Hero video failed:', e.currentTarget.src)
        }
      />

      {/* Scroll fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,${
            scrollProgress * 0.7
          }) 100%)`,
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[2]" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="text-center px-4 max-w-5xl"
          style={{
            opacity: 1 - scrollProgress * 0.8,
            transform: `translateY(${scrollProgress * 30}px) scale(${
              1 - scrollProgress * 0.1
            })`,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <span className="inline-block mb-6 px-6 py-2 text-sm tracking-[0.3em] text-gold/90 border border-gold/30 rounded-full backdrop-blur-sm bg-black/20 uppercase">
            Since 1996
          </span>

          <h1 className="text-6xl md:text-8xl font-light text-white mb-8">
            <span className="block">Timeless</span>
            <span className="block text-gold font-normal">Elegance</span>
          </h1>

          <p className="text-lg text-gray-200 mb-12 max-w-2xl mx-auto">
            Curating the world's finest luxury timepieces across Sri Lanka
          </p>

          <div className="flex gap-5 justify-center">
            <Link to="/shop">
              <button className="px-10 py-4 bg-gold text-black rounded-lg uppercase tracking-wider hover:scale-105 transition">
                Explore Collection
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-10 py-4 border border-gold text-gold rounded-lg uppercase tracking-wider hover:bg-gold hover:text-black transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevVideo}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/30 rounded-full"
        style={{ opacity: 1 - scrollProgress }}
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextVideo}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/30 rounded-full"
        style={{ opacity: 1 - scrollProgress }}
      >
        <FaChevronRight />
      </button>

      {/* Progress Indicators */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3"
        style={{ opacity: 1 - scrollProgress }}
      >
        {videoSources.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              clearTimeout(autoAdvanceTimeout.current);
              setCurrentVideoIndex(index);
            }}
            aria-label={`Go to video ${index + 1}`}
          >
            {index === currentVideoIndex ? (
              <div className="w-12 h-[2px] bg-gold overflow-hidden">
                <div className="h-full bg-white/60 animate-progress-fill" />
              </div>
            ) : (
              <div className="w-8 h-[2px] bg-white/30 hover:bg-white/50 transition" />
            )}
          </button>
        ))}
      </div>

      {/* CSS (Vite / CRA safe) */}
      <style>{`
        @keyframes progress-fill {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-progress-fill {
          animation: progress-fill 12s linear;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
