// src/components/Snowfall.jsx
import React, { useEffect, useRef } from 'react';

const Snowfall = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const snowflakeCount = 80;
    const snowflakes = [];
    const styleSheets = [];

    // SVG snowflake shapes (you can add more variations)
    const snowflakeShapes = [
      '❄', '❅', '❆', '*', '✻', '✼', '❉', '✱'
    ];

    for (let i = 0; i < snowflakeCount; i++) {
      const size = Math.random() * 8 + 4;
      const opacity = Math.random() * 0.7 + 0.3;
      const left = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 5;
      const drift = (Math.random() - 0.5) * 80;
      const rotation = Math.random() * 720 + 360;
      
      // Pick random snowflake character
      const shape = snowflakeShapes[Math.floor(Math.random() * snowflakeShapes.length)];

      const snowflake = document.createElement('div');
      snowflake.textContent = shape;
      snowflake.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: -20px;
        font-size: ${size}px;
        color: #fff;
        opacity: ${opacity};
        user-select: none;
        pointer-events: none;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        animation: fall-${i} ${duration}s linear ${delay}s infinite;
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes fall-${i} {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) translateX(${drift}px) rotate(${rotation}deg);
          }
        }
      `;
      
      document.head.appendChild(style);
      styleSheets.push(style);
      snowflakes.push(snowflake);
      container.appendChild(snowflake);
    }

    return () => {
      snowflakes.forEach(flake => flake.remove());
      styleSheets.forEach(sheet => sheet.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default Snowfall;