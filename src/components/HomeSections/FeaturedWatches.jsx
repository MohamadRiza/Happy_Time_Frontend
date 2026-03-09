// src/components/HomeSections/FeaturedWatches.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────
   Single Card in 3D space
───────────────────────────────────────── */
const WatchCard3D = ({ watch, formatPrice, isFront, isNearFront, isBack, onHoverChange }) => {
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    onHoverChange(true);   // tell carousel to pause
  };
  const handleLeave = () => {
    setHovered(false);
    onHoverChange(false);  // tell carousel to resume
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '18px',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)',
        border: `1px solid ${isFront ? 'rgba(212,175,55,0.55)' : isNearFront ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.15)'}`,
        boxShadow: isFront
          ? '0 0 0 1px rgba(212,175,55,0.15), 0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.1)'
          : '0 8px 32px rgba(0,0,0,0.6)',
        /* All cards clearly visible — only back cards slightly dimmed */
        opacity: isBack ? 0.35 : 1,
        transform: hovered ? 'scale(1.03) translateZ(12px)' : 'scale(1) translateZ(0)',
        transition: 'opacity 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
        cursor: isFront ? 'default' : 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Image zone */}
      <div style={{
        flex: '0 0 220px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 65%, #1c1608 0%, #0d0d0d 75%)',
      }}>
        {/* Hover shine */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }} />

        {watch.images?.[0] ? (
          <img
            src={watch.images[0]}
            alt={`${watch.brand} ${watch.title}`}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: '24px',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
              display: 'block',
            }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>No Image</span>
          </div>
        )}

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to top, #0d0d0d 0%, transparent 55%)',
        }} />

        {/* Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 3 }}>
          <span style={{
            display: 'inline-block', padding: '3px 10px', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '999px',
            background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(212,175,55,0.5)',
            color: '#d4af37', backdropFilter: 'blur(8px)',
          }}>
            Featured
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px', margin: '0 18px',
        background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.3),transparent)',
      }} />

      {/* Info */}
      <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(212,175,55,0.85)',
          marginBottom: '7px',
        }}>
          {watch.brand}
        </div>
        <h3 style={{
          fontSize: '13px', fontWeight: 300, lineHeight: 1.5,
          color: hovered ? 'rgba(212,175,55,0.95)' : 'rgba(255,255,255,0.95)',
          transition: 'color 0.3s',
          marginBottom: '12px',
          flex: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {watch.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.02em' }}>
            {formatPrice(watch.price)}
          </span>
          <Link
            to={`/shop/${watch._id}`}
            style={{
              padding: '7px 16px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', borderRadius: '8px', textDecoration: 'none',
              border: '1px solid rgba(212,175,55,0.45)', color: '#d4af37', background: 'transparent',
              transition: 'all 0.25s ease', flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d4af37';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#d4af37';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View
          </Link>
        </div>
      </div>

      {/* Active bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.7),transparent)',
        opacity: isFront ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />
    </div>
  );
};

/* ─────────────────────────────────────────
   DESKTOP — True CSS 3D Rotating Carousel
   Pauses ONLY when hovering a card
───────────────────────────────────────── */
const DesktopCarousel = ({ watches, formatPrice, isVisible }) => {
  const total = watches.length;
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const angleRef = useRef(0);
  const pausedRef = useRef(false);

  const CARD_W = 280;
  const ITEMS = total;
  const STEP = 360 / ITEMS;
  const RADIUS = Math.round(CARD_W / (2 * Math.tan(Math.PI / ITEMS))) + 40;

  // Keep pausedRef in sync so RAF closure always sees latest value
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!isVisible) return;
    const speed = 0.016; // degrees per ms
    const tick = (now) => {
      if (lastTimeRef.current !== null && !pausedRef.current) {
        const delta = now - lastTimeRef.current;
        angleRef.current = (angleRef.current + speed * delta) % 360;
        setAngle(angleRef.current);
        const front = Math.round((-angleRef.current / STEP % ITEMS) + ITEMS * 100) % ITEMS;
        setActiveIdx(front);
      }
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, STEP, ITEMS]);

  const rotateTo = (idx) => {
    const target = -idx * STEP;
    const diff = ((target - angleRef.current) % 360 + 540) % 360 - 180;
    angleRef.current = angleRef.current + diff;
    setAngle(angleRef.current);
    setActiveIdx(idx);
  };

  const prevCard = () => rotateTo((activeIdx - 1 + ITEMS) % ITEMS);
  const nextCard = () => rotateTo((activeIdx + 1) % ITEMS);

  // Called by each card when hovered/unhovered
  const handleCardHover = useCallback((isHovering) => {
    setPaused(isHovering);
  }, []);

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 1s ease, transform 1s ease',
    }}>
      {/* 3D Scene — NO pause on scene hover, only card hover controls it */}
      <div style={{
        perspective: '1100px',
        perspectiveOrigin: '50% 40%',
        height: '520px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Ground glow */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', height: '80px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }} />

        {/* Rotating cylinder */}
        <div style={{
          position: 'relative',
          width: `${CARD_W}px`,
          height: '400px',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${angle}deg)`,
          // No CSS transition here — RAF drives it smoothly
        }}>
          {watches.map((watch, i) => {
            const itemAngle = i * STEP;
            const relAngle = (((-angle + itemAngle) % 360) + 360) % 360;
            const isFront = relAngle < 32 || relAngle > 328;
            const isNearFront = relAngle < 65 || relAngle > 295;
            const isBack = relAngle > 148 && relAngle < 212;

            return (
              <div
                key={watch._id}
                onClick={() => !isFront && rotateTo(i)}
                style={{
                  position: 'absolute',
                  width: `${CARD_W}px`,
                  height: '400px',
                  top: 0, left: 0,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${itemAngle}deg) translateZ(${RADIUS}px)`,
                  cursor: isFront ? 'default' : 'pointer',
                }}
              >
                <WatchCard3D
                  watch={watch}
                  formatPrice={formatPrice}
                  isFront={isFront}
                  isNearFront={isNearFront}
                  isBack={isBack}
                  onHoverChange={handleCardHover}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
        <button
          onClick={prevCard}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.35)',
            background: 'transparent', color: '#d4af37', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
        >‹</button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {watches.map((_, i) => (
            <button key={i} onClick={() => rotateTo(i)} style={{
              width: i === activeIdx ? '22px' : '7px',
              height: '7px',
              borderRadius: '999px', border: 'none', padding: 0, cursor: 'pointer',
              background: i === activeIdx ? '#d4af37' : 'rgba(212,175,55,0.28)',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>

        <button
          onClick={nextCard}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.35)',
            background: 'transparent', color: '#d4af37', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
        >›</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MOBILE — Touch Swipe Center Carousel
───────────────────────────────────────── */
const MobileCarousel = ({ watches, formatPrice, isVisible }) => {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const total = watches.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) isDragging.current = true;
  };
  const onTouchEnd = (e) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
    isDragging.current = false;
  };

  const getIdx = (offset) => ((active + offset) % total + total) % total;

  const SLOT = {
    '-1': { left: '0%',   right: 'auto', width: '30%', transform: 'translateY(-50%) scale(0.85)', opacity: 0.72, zIndex: 4 },
     '0': { left: '50%',  right: 'auto', width: '54%', transform: 'translate(-50%,-50%) scale(1)',  opacity: 1,    zIndex: 10 },
     '1': { left: 'auto', right: '0%',   width: '30%', transform: 'translateY(-50%) scale(0.85)', opacity: 0.72, zIndex: 4 },
  };

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    }}>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ position: 'relative', height: '460px', userSelect: 'none' }}
      >
        {[-1, 0, 1].map((offset) => {
          const w = watches[getIdx(offset)];
          const cfg = SLOT[String(offset)];
          const isCenter = offset === 0;

          return (
            <div
              key={`${offset}-${active}`}
              style={{
                position: 'absolute', top: '50%',
                ...cfg,
                transition: 'all 0.42s cubic-bezier(0.23,1,0.32,1)',
                cursor: isCenter ? 'default' : 'pointer',
              }}
              onClick={() => !isCenter && (offset === -1 ? prev() : next())}
            >
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)',
                border: `1px solid ${isCenter ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.2)'}`,
                boxShadow: isCenter
                  ? '0 16px 48px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.1)'
                  : '0 4px 16px rgba(0,0,0,0.5)',
              }}>
                {/* Image */}
                <div style={{
                  height: isCenter ? '190px' : '145px',
                  background: 'radial-gradient(ellipse at 50% 65%, #1c1608 0%, #0d0d0d 75%)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'height 0.42s cubic-bezier(0.23,1,0.32,1)',
                }}>
                  {w.images?.[0] ? (
                    <img
                      src={w.images[0]}
                      alt={w.title}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px', display: 'block' }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>No Image</span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, #0d0d0d 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                </div>

                {/* Center card full info */}
                {isCenter && (
                  <>
                    <div style={{
                      height: '1px', margin: '0 14px',
                      background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.28),transparent)',
                    }} />
                    <div style={{ padding: '14px 16px 18px' }}>
                      <div style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.26em',
                        textTransform: 'uppercase', color: 'rgba(212,175,55,0.85)',
                        marginBottom: '5px',
                      }}>
                        {w.brand}
                      </div>
                      <div style={{
                        fontSize: '12px', fontWeight: 300, color: 'rgba(255,255,255,0.92)',
                        lineHeight: 1.45, marginBottom: '10px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {w.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255,255,255,0.85)' }}>
                          {formatPrice(w.price)}
                        </span>
                        <Link
                          to={`/shop/${w._id}`}
                          style={{
                            padding: '6px 14px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em',
                            textTransform: 'uppercase', borderRadius: '7px', textDecoration: 'none',
                            border: '1px solid rgba(212,175,55,0.45)', color: '#d4af37', background: 'transparent',
                          }}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                {/* Side cards: brand label */}
                {!isCenter && (
                  <div style={{
                    padding: '8px 0 10px', textAlign: 'center',
                    fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'rgba(212,175,55,0.55)',
                  }}>
                    {w.brand}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '10px' }}>
        {watches.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? '22px' : '6px', height: '6px',
            borderRadius: '999px', border: 'none', padding: 0, cursor: 'pointer',
            background: i === active ? '#d4af37' : 'rgba(212,175,55,0.25)',
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
const FeaturedWatches = () => {
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/featured`);
        const data = await res.json();
        if (data.success) setFeaturedWatches(data.products || []);
        else setError('Failed to load featured watches');
      } catch { setError('Network error'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Contact for Price';
    return `LKR ${price.toLocaleString()}`;
  };

  if (featuredWatches.length === 0 && !loading && !error) return null;

  return (
    <section
      ref={sectionRef}
      style={{ padding: '96px 16px 112px', background: '#000', position: 'relative', overflow: 'hidden' }}
    >
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(212,175,55,0.15) 1px,transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: 0, left: '25%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', filter: 'blur(120px)', animation: 'fw-pulse 5s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '25%', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(212,175,55,0.04)', filter: 'blur(120px)', animation: 'fw-pulse 5s ease-in-out infinite', animationDelay: '2s', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '64px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}>
          <span style={{
            fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase',
            fontWeight: 300, color: 'rgba(212,175,55,0.7)', display: 'block', marginBottom: '14px',
          }}>
            Curated Selection
          </span>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 300, color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>
            Featured{' '}
            <span style={{ color: '#d4af37', fontWeight: 400 }}>Timepieces</span>
          </h2>
          <div style={{ width: '96px', height: '1px', background: 'linear-gradient(to right,transparent,#d4af37,transparent)', margin: '0 auto' }} />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: i === 1 ? '260px' : '180px',
                height: i === 1 ? '380px' : '290px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: i === 1 ? 1 : 0.6,
                animation: 'fw-pulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '72px', color: 'rgba(212,175,55,0.2)', marginBottom: '16px' }}>⌚</div>
            <p style={{ color: 'rgba(248,113,113,0.8)', fontSize: '16px' }}>{error}</p>
          </div>
        )}

        {/* Carousels */}
        {!loading && !error && featuredWatches.length > 0 && (
          isMobile ? (
            <MobileCarousel
              watches={featuredWatches.slice(0, 6)}
              formatPrice={formatPrice}
              isVisible={isVisible}
            />
          ) : (
            <DesktopCarousel
              watches={featuredWatches.slice(0, 6)}
              formatPrice={formatPrice}
              isVisible={isVisible}
            />
          )
        )}

        {/* View All */}
        {!loading && !error && featuredWatches.length > 0 && (
          <div style={{
            textAlign: 'center', marginTop: '56px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s ease 0.6s, transform 1s ease 0.6s',
          }}>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 44px', borderRadius: '12px',
                background: '#d4af37', color: '#000',
                fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontSize: '13px', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.4)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.25)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>View Full Collection</span>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fw-pulse {
          0%,100% { opacity:1; }
          50% { opacity:0.5; }
        }
      `}</style>
    </section>
  );
};

export default FeaturedWatches;