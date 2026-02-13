// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoSources = [
    '/generated_video.mp4',
    '/generated_video1.mp4',
    '/generated_video2.mp4',
  ];

  const totalVideos = videoSources.length;

  // Go to next video
  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % totalVideos);
  };

  // Go to previous video
  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + totalVideos) % totalVideos);
  };

  // Auto-advance after video duration
  useEffect(() => {
    const videoDuration = 10000; // approximate duration in ms if videos are similar length
    const timer = setTimeout(nextVideo, videoDuration);
    return () => clearTimeout(timer);
  }, [currentVideoIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Backgrounds */}
      {videoSources.map((src, index) => (
        <video
          key={index}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentVideoIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
          }`}
        />
      ))}

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-4 tracking-wide">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            Discover the world’s most exquisite luxury timepieces at Happy Time, Sri Lanka’s trusted watch connoisseur since 1996.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
            <button className="bg-gold text-black font-semibold px-6 py-3 rounded-full hover:bg-gold/90 transition-all shadow-lg">
              Explore Collection
            </button>
            </Link>
            <Link to="/contact">
            <button className="border-2 border-gold text-gold font-semibold px-6 py-3 rounded-full hover:bg-gold hover:text-black transition-all">
              Contact Us  
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevVideo}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 transition-all"
        aria-label="Previous video"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={nextVideo}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 transition-all"
        aria-label="Next video"
      >
        <FaChevronRight size={20} />
      </button> */}

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {videoSources.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentVideoIndex ? 'bg-gold' : 'bg-white/50'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;