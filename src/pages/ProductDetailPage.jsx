// https://chat.qwen.ai/c/7d6c0f8e-38cd-4481-a62b-623987138c8e  (USE Slug Based URLS for better SEO)
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken
} from '../utils/auth';
import Loading from '../components/Loading';
import GuestPrompt from '../components/GuestPrompt';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E2C07A;
    --gold-dim: rgba(201,168,76,0.12);
    --gold-border: rgba(201,168,76,0.3);
    --bg: #080808;
    --surface: #0f0f0f;
    --surface2: #141414;
    --surface3: #1c1c1c;
    --border: rgba(255,255,255,0.07);
    --text: #f0ece4;
    --text-muted: #7a7570;
    --text-sub: #a09890;
    --radius: 14px;
    --radius-lg: 20px;
    --shadow-gold: 0 0 32px rgba(201,168,76,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; }

  .pdp-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    width: 100%;
  }

  /* ── WRAPPER ── */
  .pdp-wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 18px 14px 60px;
    width: 100%;
  }
  @media(min-width:480px)  { .pdp-wrapper { padding: 22px 18px 68px; } }
  @media(min-width:640px)  { .pdp-wrapper { padding: 30px 24px 80px; } }
  @media(min-width:1024px) { .pdp-wrapper { padding: 44px 40px 100px; } }

  /* ── BACK BUTTON ── */
  .pdp-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 0;
    transition: color 0.2s;
    margin-bottom: 18px;
    -webkit-tap-highlight-color: transparent;
  }
  @media(min-width:640px) { .pdp-back-btn { margin-bottom: 26px; font-size: 12px; } }
  .pdp-back-btn:hover { color: var(--gold); }

  /* ── MAIN GRID ── */
  .pdp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
  }
  @media(min-width:640px)  { .pdp-grid { gap: 28px; } }
  @media(min-width:1024px) { .pdp-grid { grid-template-columns: 1fr 1fr; gap: 52px; } }

  /* ══════════════════════════════════
     GALLERY
  ══════════════════════════════════ */
  .gallery-col {
    width: 100%;
    min-width: 0;
  }

  .gallery-main {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 10px;
    transition: border-color 0.3s;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .gallery-main:hover { border-color: var(--gold-border); }

  .gallery-main-img {
    max-width: 82%;
    max-height: 82%;
    object-fit: contain;
    display: block;
    pointer-events: none;
    transition: transform 0.4s ease;
  }
  .gallery-main:hover .gallery-main-img { transform: scale(1.03); }

  .gallery-main-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  /* Color badge */
  .gallery-color-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(8,8,8,0.82);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid var(--gold-border);
    padding: 4px 9px 4px 7px;
    border-radius: 50px;
    max-width: calc(100% - 20px);
  }
  .gallery-color-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .gallery-color-name {
    font-size: 10px; font-weight: 500; color: var(--text); letter-spacing: 0.05em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .gallery-color-dismiss {
    background: none; border: none; color: var(--text-muted); cursor: pointer;
    font-size: 11px; padding: 0; line-height: 1; margin-left: 1px; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }

  /* Desktop arrow buttons on main image */
  .gallery-nav-btn {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 5;
    width: 34px; height: 34px; background: rgba(8,8,8,0.72);
    border: 1px solid var(--border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--text); font-size: 18px; cursor: pointer; line-height: 1;
    transition: opacity 0.2s, background 0.2s, border-color 0.2s;
    opacity: 0;
  }
  .gallery-main:hover .gallery-nav-btn { opacity: 1; }
  .gallery-nav-btn:hover { background: var(--gold-dim); border-color: var(--gold-border); color: var(--gold); }
  .gallery-nav-btn.prev { left: 10px; }
  .gallery-nav-btn.next { right: 10px; }

  /* Dot indicators */
  .gallery-dots {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 5px; z-index: 5;
  }
  .gallery-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.22);
    transition: background 0.2s, width 0.25s;
    cursor: pointer; border: none; padding: 0; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .gallery-dot.active { background: var(--gold); width: 16px; border-radius: 3px; }

  /* Zoom hint — hide on mobile */
  .gallery-zoom-hint {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.25); opacity: 0; transition: opacity 0.2s; pointer-events: none;
  }
  .gallery-main:hover .gallery-zoom-hint { opacity: 1; }
  @media(max-width:1023px) { .gallery-zoom-hint { display: none !important; } }
  .gallery-zoom-pill {
    background: rgba(8,8,8,0.88); border: 1px solid var(--gold-border); color: var(--text);
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 8px 16px; border-radius: 50px; display: flex; align-items: center; gap: 7px;
  }

  /* ── THUMBNAILS ── */
  .thumb-strip-wrap {
    position: relative;
    width: 100%;
  }
  @media(min-width:1024px) { .thumb-strip-wrap { padding: 0 20px; } }

  /* Always scrollable strip */
  .thumb-strip {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: visible;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 4px;
    width: 100%;
    /* Prevent accidental vertical scroll hijack */
    touch-action: pan-x;
  }
  .thumb-strip::-webkit-scrollbar { display: none; }

  .thumb-item {
    flex-shrink: 0;
    scroll-snap-align: start;
    /* 4 visible with gaps on any screen */
    width: calc((100% - 24px) / 4);
    min-width: 54px;
    max-width: 90px;
    aspect-ratio: 1 / 1;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: border-color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .thumb-item:active { opacity: 0.8; }
  .thumb-item.active { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(201,168,76,0.2); }

  .thumb-img { max-width: 80%; max-height: 80%; object-fit: contain; display: block; pointer-events: none; }
  .thumb-video-wrap { position: relative; width: 100%; height: 100%; }
  .thumb-video { width: 100%; height: 100%; object-fit: cover; }
  .thumb-play-icon {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.42);
  }
  .thumb-play-circle {
    background: rgba(201,168,76,0.9); border-radius: 50%;
    width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Desktop only thumb arrows */
  .thumb-nav-btn { display: none; }
  @media(min-width:1024px) {
    .thumb-nav-btn {
      display: flex; position: absolute; top: 50%; transform: translateY(-50%);
      z-index: 5; width: 28px; height: 28px;
      background: rgba(8,8,8,0.85); border: 1px solid var(--border); border-radius: 50%;
      align-items: center; justify-content: center; color: var(--text);
      font-size: 14px; cursor: pointer; transition: all 0.2s;
    }
    .thumb-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
    .thumb-nav-btn:not(:disabled):hover { border-color: var(--gold-border); color: var(--gold); }
    .thumb-nav-btn.t-prev { left: 0; }
    .thumb-nav-btn.t-next { right: 0; }
  }

  /* ══════════════════════════════════
     INFO COLUMN
  ══════════════════════════════════ */
  .info-col { display: flex; flex-direction: column; width: 100%; min-width: 0; }

  .info-eyebrow {
    display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;
  }
  .info-brand { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); font-weight: 600; }
  .info-divider-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; }
  .info-category-tag { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 9px; border-radius: 50px; font-weight: 500; }
  .tag-men      { background: rgba(59,130,246,0.12); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
  .tag-women    { background: rgba(236,72,153,0.12); color: #f9a8d4; border: 1px solid rgba(236,72,153,0.2); }
  .tag-kids     { background: rgba(34,197,94,0.12);  color: #86efac; border: 1px solid rgba(34,197,94,0.2); }
  .tag-unisex   { background: rgba(255,255,255,0.05); color: #a0a0a0; border: 1px solid rgba(255,255,255,0.08); }
  .tag-wallclock{ background: rgba(201,168,76,0.1); color: var(--gold); border: 1px solid var(--gold-border); }

  .info-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 6vw, 38px);
    font-weight: 400; line-height: 1.15; letter-spacing: -0.01em;
    color: var(--text); margin: 0 0 5px 0; word-break: break-word;
  }
  .info-shape { font-size: 11px; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
  @media(min-width:640px) { .info-shape { font-size: 12px; margin-bottom: 20px; } }

  .info-sep { height: 1px; background: linear-gradient(90deg, var(--gold-border), transparent); margin-bottom: 16px; }
  @media(min-width:640px) { .info-sep { margin-bottom: 20px; } }

  /* ── PRICE ── */
  .price-block { margin-bottom: 18px; }
  @media(min-width:640px) { .price-block { margin-bottom: 24px; } }
  .price-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; display: block; }
  .price-value {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(24px, 7vw, 36px);
    font-weight: 600; color: var(--text); letter-spacing: -0.01em; line-height: 1;
  }
  .price-contact-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 5vw, 28px); font-weight: 400; font-style: italic; color: var(--gold-light);
  }
  .price-contact-sub { font-size: 13px; color: var(--text-muted); line-height: 1.65; margin: 10px 0 14px; }

  /* ── SECTION BLOCK ── */
  .section-block { margin-bottom: 16px; }
  @media(min-width:640px) { .section-block { margin-bottom: 20px; } }
  .section-heading { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; font-weight: 500; display: block; }

  /* ── COLOR SWATCHES ── */
  .color-swatches { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 8px; }
  .color-swatch-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 12px; border-radius: 10px;
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--text-sub); font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 400; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.03em;
    -webkit-tap-highlight-color: transparent; white-space: nowrap;
  }
  .color-swatch-btn:active { transform: scale(0.96); }
  .color-swatch-btn.active { border-color: var(--gold); background: var(--gold-dim); color: var(--text); box-shadow: 0 0 0 2px rgba(201,168,76,0.15); }
  .color-swatch-thumb { width: 20px; height: 20px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
  .color-hint { display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-size: 11px; margin-top: 4px; }

  /* Stock */
  .stock-row { display: flex; align-items: center; gap: 7px; font-size: 12px; margin-top: 8px; }
  .stock-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .stock-dot.green { background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.5); }
  .stock-dot.blue  { background: #60a5fa; box-shadow: 0 0 6px rgba(96,165,250,0.4); }
  .stock-dot.red   { background: #f87171; box-shadow: 0 0 6px rgba(248,113,113,0.4); }
  .stock-text-green { color: #4ade80; }
  .stock-text-blue  { color: #60a5fa; }
  .stock-text-red   { color: #f87171; }

  /* ── QUANTITY ── */
  .qty-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .qty-control {
    display: flex; align-items: center;
    background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
  }
  .qty-btn {
    width: 46px; height: 46px; background: var(--surface3); border: none; color: var(--text);
    font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s; font-weight: 300; line-height: 1; flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .qty-btn:hover:not(:disabled) { background: var(--gold-dim); color: var(--gold); }
  .qty-btn:active:not(:disabled) { background: rgba(201,168,76,0.2); }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-input {
    width: 52px; height: 46px; background: var(--surface2);
    border: none; border-left: 1px solid var(--border); border-right: 1px solid var(--border);
    color: var(--text); text-align: center;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; outline: none;
    -moz-appearance: textfield;
  }
  .qty-input::-webkit-inner-spin-button,
  .qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .qty-max { font-size: 11px; color: var(--text-muted); letter-spacing: 0.04em; }

  /* ── ACTION BUTTONS ── */
  .action-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 18px;
    width: 100%;
  }
  @media(min-width:380px) { .action-row { flex-direction: row; } }
  @media(min-width:640px) { .action-row { margin-bottom: 22px; } }

  .btn-add-cart {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--gold); color: #000; border: none; border-radius: 12px;
    padding: 0 16px; font-family: 'Outfit', sans-serif; font-size: 13px;
    font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.25);
    -webkit-tap-highlight-color: transparent;
    min-height: 52px; width: 100%;
  }
  @media(min-width:380px) { .btn-add-cart { width: auto; } }
  .btn-add-cart:active:not(:disabled) { transform: scale(0.98); }
  .btn-add-cart:hover:not(:disabled) { background: var(--gold-light); box-shadow: 0 6px 24px rgba(201,168,76,0.35); }
  .btn-add-cart:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-my-cart {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    background: var(--surface2); color: var(--text); border: 1px solid var(--border);
    border-radius: 12px; padding: 0 18px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    -webkit-tap-highlight-color: transparent; min-height: 52px;
  }
  .btn-my-cart:hover { border-color: var(--gold-border); background: var(--surface3); color: var(--gold); }
  .btn-my-cart:active { transform: scale(0.98); }

  .btn-contact-cta {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--gold); color: #000; border: none; border-radius: 12px;
    padding: 15px 20px; font-family: 'Outfit', sans-serif; font-size: 13px;
    font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(201,168,76,0.25);
    margin-top: 12px; min-height: 52px; -webkit-tap-highlight-color: transparent;
  }
  .btn-contact-cta:hover { background: var(--gold-light); }
  .btn-contact-cta:active { transform: scale(0.98); }

  /* ── WHOLESALE ── */
  .wholesale-card {
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 100%);
    border: 1px solid rgba(201,168,76,0.2); border-radius: var(--radius);
    padding: 14px; margin-bottom: 18px;
  }
  @media(min-width:640px) { .wholesale-card { padding: 16px; margin-bottom: 22px; } }
  .wholesale-inner { display: flex; align-items: flex-start; gap: 12px; }
  .wholesale-icon-wrap { background: rgba(201,168,76,0.12); border-radius: 10px; padding: 9px; flex-shrink: 0; }
  .wholesale-content { flex: 1; min-width: 0; }
  .wholesale-title { font-size: 13px; font-weight: 600; color: var(--gold); margin-bottom: 4px; }
  .wholesale-text { font-size: 12px; color: var(--text-sub); line-height: 1.55; margin-bottom: 10px; }
  .wholesale-btns { display: flex; flex-wrap: wrap; gap: 8px; }
  .btn-whatsapp {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--gold); color: #000; border: none; border-radius: 8px;
    padding: 9px 14px; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; text-decoration: none; transition: all 0.2s; -webkit-tap-highlight-color: transparent;
  }
  .btn-whatsapp:hover { background: var(--gold-light); }
  .btn-whatsapp:active { transform: scale(0.97); }
  .btn-contact-team {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--surface3); color: var(--gold); border: 1px solid var(--gold-border);
    border-radius: 8px; padding: 9px 14px; font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-contact-team:hover { background: var(--gold-dim); }
  .btn-contact-team:active { transform: scale(0.97); }

  /* ── DESCRIPTION ── */
  .desc-block { margin-bottom: 18px; }
  .desc-text { font-size: 13px; color: var(--text-sub); line-height: 1.75; }

  /* ── SPECS TABLE ── */
  .specs-block { margin-bottom: 18px; }
  .specs-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .spec-row:last-child td { border-bottom: none; }
  .spec-key {
    font-size: 10px; color: var(--text-muted); letter-spacing: 0.06em;
    padding: 9px 8px 9px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    width: 42%; vertical-align: middle; text-transform: uppercase;
    overflow-wrap: break-word;
  }
  .spec-val {
    font-size: 12px; color: var(--text); padding: 9px 0 9px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    text-align: right; vertical-align: middle; word-break: break-word;
  }

  /* ── WARRANTY ── */
  .warranty-block { margin-bottom: 18px; }
  .warranty-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 14px;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .warranty-icon { background: var(--surface3); border-radius: 8px; padding: 8px; flex-shrink: 0; }
  .warranty-label { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .warranty-desc  { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

  /* ── TRUST BADGES ── */
  .trust-row { display: flex; flex-direction: row; gap: 8px; margin-bottom: 18px; }
  .trust-badge {
    flex: 1; display: flex; align-items: center; gap: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 10px;
    text-decoration: none; color: inherit; transition: border-color 0.2s;
    min-width: 0; -webkit-tap-highlight-color: transparent;
  }
  .trust-badge:hover { border-color: var(--gold-border); }
  .trust-icon-wrap { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .trust-text { min-width: 0; }
  .trust-title { font-size: 11px; font-weight: 500; color: var(--text); line-height: 1.3; }
  @media(min-width:360px) { .trust-title { font-size: 12px; } }
  .trust-sub { font-size: 10px; color: var(--text-muted); }

  /* ── ASSISTANCE ── */
  .assist-block { border-top: 1px solid var(--border); padding-top: 18px; margin-top: 4px; }
  .assist-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400; color: var(--text); margin-bottom: 6px; }
  .assist-text { font-size: 12px; color: var(--text-muted); line-height: 1.65; margin-bottom: 12px; }
  .assist-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: var(--gold);
    cursor: pointer; background: none; border: none; padding: 0;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: gap 0.2s, color 0.2s; -webkit-tap-highlight-color: transparent;
  }
  .assist-link:hover { color: var(--gold-light); gap: 9px; }

  /* ══════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════ */
  .lightbox-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 56px 8px 16px;
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    animation: lbFadeIn 0.2s ease;
  }
  @keyframes lbFadeIn { from { opacity:0; } to { opacity:1; } }
  .lightbox-close {
    position: fixed; top: 12px; right: 12px;
    width: 38px; height: 38px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 50%;
    color: var(--text); font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;
  }
  .lightbox-inner {
    position: relative; width: 100%; max-width: 900px;
    display: flex; flex-direction: column; align-items: center;
    touch-action: pan-y;
  }
  .lightbox-media-wrap {
    width: 100%; display: flex; align-items: center; justify-content: center;
    max-height: 68vh;
  }
  @media(min-width:640px) { .lightbox-media-wrap { max-height: 74vh; } }
  .lightbox-img { max-width: 100%; max-height: 68vh; object-fit: contain; border-radius: 8px; display: block; }
  @media(min-width:640px) { .lightbox-img { max-height: 74vh; } }
  .lightbox-video { max-width: 100%; max-height: 68vh; border-radius: 8px; }
  .lightbox-nav {
    position: fixed; top: 50%; transform: translateY(-50%);
    width: 42px; height: 42px; background: rgba(15,15,15,0.88);
    border: 1px solid var(--border); border-radius: 50%; color: var(--text);
    font-size: 22px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; line-height: 1; transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .lightbox-nav:hover { background: var(--gold-dim); border-color: var(--gold-border); color: var(--gold); }
  .lightbox-nav:active { transform: translateY(-50%) scale(0.93); }
  .lightbox-nav.lb-prev { left: 6px; }
  .lightbox-nav.lb-next { right: 6px; }
  @media(min-width:640px) { .lightbox-nav.lb-prev { left: 16px; } .lightbox-nav.lb-next { right: 16px; } }
  .lightbox-footer { margin-top: 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .lightbox-counter { font-size: 11px; color: var(--text-muted); letter-spacing: 0.12em; }
  .lightbox-color-label { font-size: 12px; color: var(--text-muted); letter-spacing: 0.06em; }

  /* ══════════════════════════════════
     RELATED PRODUCTS
  ══════════════════════════════════ */
  .related-section { margin-top: 52px; padding-top: 36px; border-top: 1px solid var(--border); }
  @media(min-width:640px) { .related-section { margin-top: 68px; padding-top: 48px; } }
  .related-eyebrow {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; display: block; text-align: center; margin-bottom: 6px;
  }
  .related-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 5vw, 30px); font-weight: 300;
    text-align: center; color: var(--text); margin-bottom: 22px;
  }
  @media(min-width:640px) { .related-title { margin-bottom: 30px; } }
  .related-title em { font-style: italic; color: var(--gold-light); }
  .related-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
  }
  @media(min-width:640px)  { .related-grid { gap: 14px; } }
  @media(min-width:768px)  { .related-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
  .related-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; cursor: pointer;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    -webkit-tap-highlight-color: transparent;
  }
  .related-card:hover { border-color: var(--gold-border); transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.4), var(--shadow-gold); }
  .related-card:active { transform: scale(0.98); }
  .related-card-img-wrap { aspect-ratio: 1; background: var(--surface2); overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .related-card-img { max-width: 80%; max-height: 80%; object-fit: contain; transition: transform 0.4s ease; }
  .related-card:hover .related-card-img { transform: scale(1.05); }
  .related-card-body { padding: 10px; text-align: center; }
  @media(min-width:640px) { .related-card-body { padding: 12px; } }
  .related-card-brand { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); font-weight: 500; display: block; margin-bottom: 3px; }
  .related-card-title { font-size: 11px; font-weight: 500; color: var(--text); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 4px; }
  @media(min-width:480px) { .related-card-title { font-size: 12px; } }
  .related-card-price { font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; color: var(--gold-light); }
  @media(min-width:480px) { .related-card-price { font-size: 13px; } }

  /* ── NOT FOUND ── */
  .notfound-wrap { max-width: 1280px; margin: 0 auto; padding: 80px 24px; text-align: center; }
  .notfound-icon { font-size: 52px; margin-bottom: 14px; }
  .notfound-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 400; color: var(--text); margin-bottom: 8px; }
  .notfound-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; }
  .notfound-btn {
    background: var(--gold); color: #000; border: none; padding: 12px 28px; border-radius: 8px;
    font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s;
  }
  .notfound-btn:hover { background: var(--gold-light); }
`;

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColorObj, setSelectedColorObj] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [colorImageDismissed, setColorImageDismissed] = useState(false);

  // Touch refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const galleryTouchStartX = useRef(0);
  const galleryTouchEndX = useRef(0);
  const thumbStripRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const parseProductColors = (product) => {
    if (!product?.colors || !Array.isArray(product.colors)) return [];
    return product.colors.map(color => {
      if (typeof color === 'object' && color.name) {
        return { name: color.name, quantity: color.quantity !== null && color.quantity !== undefined ? color.quantity : null, colorImage: color.colorImage || null };
      }
      if (typeof color === 'string') return { name: color, quantity: null, colorImage: null };
      return null;
    }).filter(Boolean);
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        const colors = parseProductColors(data.product);
        if (colors.length > 0) { setSelectedColorObj(colors[0]); setQuantity(1); setColorImageDismissed(false); }
      } else { setError('Product not found'); }
    } catch (err) { console.error('Fetch product error:', err); setError('Network error'); }
    finally { setLoading(false); }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setRelatedProducts(data.products.filter(p => p._id !== id && p.status === 'active').slice(0, 4));
      }
    } catch (err) { console.error('Fetch related products error:', err); }
  };

  useEffect(() => { if (id) { fetchProduct(); fetchRelatedProducts(); } }, [id]);
  useEffect(() => { if (selectedColorObj) setQuantity(1); }, [selectedColorObj]);

  const handleColorSelect = (colorObj) => { setSelectedColorObj(colorObj); setColorImageDismissed(false); };

  // Main image swipe — distinguishes from vertical scroll
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    // Ignore mostly-vertical movements
    if (Math.abs(diffX) < 35 || Math.abs(diffX) < diffY) return;
    if (selectedColorObj?.colorImage && !colorImageDismissed) { setColorImageDismissed(true); return; }
    const allMedia = [...(product.images || []), ...(product.videos || [])];
    if (allMedia.length <= 1) return;
    if (diffX > 0) setMainImageIndex(prev => (prev + 1) % allMedia.length);
    else setMainImageIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
  };

  // Lightbox swipe
  const handleGalleryTouchStart = (e) => { galleryTouchStartX.current = e.touches[0].clientX; };
  const handleGalleryTouchEnd = (e) => {
    const diff = galleryTouchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 35) return;
    const allMedia = [...(product.images || []), ...(product.videos || [])];
    if (allMedia.length <= 1) return;
    if (diff > 0) setGalleryCurrentIndex(prev => (prev + 1) % allMedia.length);
    else setGalleryCurrentIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
  };

  const openGallery = (index) => {
    setGalleryCurrentIndex(selectedColorObj?.colorImage && !colorImageDismissed ? -1 : index);
    setGalleryOpen(true);
  };
  const closeGallery = () => setGalleryOpen(false);
  const navigateGallery = (direction) => {
    if (galleryCurrentIndex === -1) { setGalleryCurrentIndex(0); return; }
    const allMedia = [...(product.images || []), ...(product.videos || [])];
    if (direction === 'next') setGalleryCurrentIndex(prev => (prev + 1) % allMedia.length);
    else setGalleryCurrentIndex(prev => prev === 0 ? allMedia.length - 1 : prev - 1);
  };

  const addToCart = async () => {
    if (!product || product.price === null || product.price === undefined) return;
    if (!selectedColorObj) { toast.error('Please select a color'); return; }
    if (selectedColorObj.quantity !== null && quantity > selectedColorObj.quantity) { toast.error(`Only ${selectedColorObj.quantity} available in stock`); return; }
    if (!isCustomerAuthenticated()) {
      const pendingItem = { _id: product._id, title: product.title, brand: product.brand, price: product.price, images: product.images, selectedColor: selectedColorObj.name, quantity, modelNumber: product.modelNumber, gender: product.gender, watchShape: product.watchShape, productType: product.productType };
      sessionStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      navigate('/login', { state: { from: `/shop/${id}` } }); return;
    }
    try {
      const token = getCustomerToken();
      const response = await fetch(`${API_URL}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: product._id, selectedColor: selectedColorObj.name, quantity }) });
      const data = await response.json();
      if (data.success) { toast.success('Added to cart successfully!'); setError(''); window.dispatchEvent(new CustomEvent('cartUpdated')); }
      else toast.error(data.message || 'Failed to add to cart');
    } catch (err) { console.error('Add to cart error:', err); toast.error('Network error. Please try again.'); }
  };

  const goToCart = () => navigate('/cart');
  const formatPrice = (price) => { if (price === null || price === undefined) return 'Contact for Price'; return `LKR ${price.toLocaleString()}`; };

  const getCategoryDisplay = () => {
    if (product?.productType === 'wall_clock') return 'Wall Clock';
    switch (product?.gender) { case 'men': return 'Men'; case 'women': return 'Women'; case 'kids': return 'Kids'; case 'unisex': return 'Unisex'; default: return 'Unisex'; }
  };
  const getCategoryTagClass = () => {
    if (product?.productType === 'wall_clock') return 'info-category-tag tag-wallclock';
    switch (product?.gender) { case 'men': return 'info-category-tag tag-men'; case 'women': return 'info-category-tag tag-women'; case 'kids': return 'info-category-tag tag-kids'; default: return 'info-category-tag tag-unisex'; }
  };
  const getWarrantyLabel = (duration) => {
    const map = { '1year':'1 Year','3months':'3 Months','6months':'6 Months','2years':'2 Years','nowarranty':'No Warranty' };
    return map[duration] || duration;
  };
  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    if (value === '') { setQuantity(1); return; }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) { const maxQty = getMaxQuantity(); setQuantity(Math.max(1, Math.min(numValue, maxQty))); }
  };
  const handleQuantityInputFocus = (e) => e.target.select();
  const handleQuantityChange = (newQty) => {
    if (!selectedColorObj) return;
    if (selectedColorObj.quantity !== null) setQuantity(Math.max(1, Math.min(newQty, selectedColorObj.quantity)));
    else setQuantity(Math.max(1, newQty));
  };
  const getMaxQuantity = () => { if (!selectedColorObj || selectedColorObj.quantity === null) return 999; return selectedColorObj.quantity; };

  const handleThumbClick = (globalIndex) => {
    setMainImageIndex(globalIndex);
    setColorImageDismissed(true);
    if (thumbStripRef.current) {
      const items = thumbStripRef.current.querySelectorAll('.thumb-item');
      if (items[globalIndex]) items[globalIndex].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
    openGallery(globalIndex);
  };

  if (loading) return (
    <div className="pdp-root">
      <style>{styles}</style>
      <ScrollToTop />
      <Loading message="Loading product details..." size="large" />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );

  if (error && !product) return (
    <div className="pdp-root">
      <style>{styles}</style>
      <ScrollToTop />
      <div className="notfound-wrap">
        <div className="notfound-icon">⌚</div>
        <h2 className="notfound-title">Product Not Found</h2>
        <p className="notfound-sub">{error}</p>
        <button onClick={() => navigate('/shop')} className="notfound-btn">Browse Collection</button>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );

  if (!product) return null;

  const allMedia = [...(product.images || []), ...(product.videos || [])];
  const colorImageOverride = (!colorImageDismissed && selectedColorObj?.colorImage) ? selectedColorObj.colorImage : null;
  const isVideo = !colorImageOverride && mainImageIndex >= (product.images?.length || 0);
  const currentMediaUrl = colorImageOverride || allMedia[mainImageIndex];
  const productColors = parseProductColors(product);
  const totalMedia = allMedia.length;
  const visibleThumbnails = 4;

  return (
    <div className="pdp-root">
      <style>{styles}</style>
      <ScrollToTop />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      {/* ══ LIGHTBOX ══ */}
      {galleryOpen && (
        <div className="lightbox-overlay" onClick={closeGallery}>
          <button className="lightbox-close" onClick={closeGallery}>✕</button>
          {galleryCurrentIndex !== -1 && (
            <>
              <button className="lightbox-nav lb-prev" onClick={e => { e.stopPropagation(); navigateGallery('prev'); }}>‹</button>
              <button className="lightbox-nav lb-next" onClick={e => { e.stopPropagation(); navigateGallery('next'); }}>›</button>
            </>
          )}
          <div className="lightbox-inner" onTouchStart={handleGalleryTouchStart} onTouchEnd={handleGalleryTouchEnd} onClick={e => e.stopPropagation()}>
            <div className="lightbox-media-wrap">
              {galleryCurrentIndex === -1 ? (
                <img src={colorImageOverride} alt={`${selectedColorObj?.name} color`} className="lightbox-img" />
              ) : galleryCurrentIndex >= (product.images?.length || 0) ? (
                <video src={allMedia[galleryCurrentIndex]} controls className="lightbox-video" onError={e => e.target.style.display = 'none'} />
              ) : (
                <img src={allMedia[galleryCurrentIndex] || ''} alt={`${product.title} – ${galleryCurrentIndex + 1}`} className="lightbox-img" onError={e => e.target.style.display = 'none'} />
              )}
            </div>
            <div className="lightbox-footer">
              {galleryCurrentIndex === -1
                ? <p className="lightbox-color-label">{selectedColorObj?.name}</p>
                : <p className="lightbox-counter">{galleryCurrentIndex + 1} / {totalMedia}</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* ══ PAGE ══ */}
      <div className="pdp-wrapper">

        {/* Back */}
        <button className="pdp-back-btn" onClick={() => navigate('/shop')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collection
        </button>

        <div className="pdp-grid">

          {/* ══ GALLERY COLUMN ══ */}
          <div className="gallery-col">

            {/* Main image */}
            <div
              className="gallery-main"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => openGallery(mainImageIndex)}
            >
              {/* Color badge */}
              {colorImageOverride && (
                <div className="gallery-color-badge">
                  <div className="gallery-color-dot" />
                  <span className="gallery-color-name">{selectedColorObj?.name}</span>
                  <button className="gallery-color-dismiss" onClick={e => { e.stopPropagation(); setColorImageDismissed(true); }} title="Show all images">✕</button>
                </div>
              )}
              {/* Desktop nav arrows */}
              {!colorImageOverride && totalMedia > 1 && !isTouchDevice && (
                <>
                  <button className="gallery-nav-btn prev" onClick={e => { e.stopPropagation(); setMainImageIndex(prev => prev === 0 ? totalMedia - 1 : prev - 1); }}>‹</button>
                  <button className="gallery-nav-btn next" onClick={e => { e.stopPropagation(); setMainImageIndex(prev => (prev + 1) % totalMedia); }}>›</button>
                </>
              )}
              {/* Media */}
              {colorImageOverride ? (
                <img src={colorImageOverride} alt={`${selectedColorObj?.name} variant`} className="gallery-main-img" onError={e => e.target.style.display = 'none'} />
              ) : isVideo ? (
                <video src={currentMediaUrl} className="gallery-main-video" onError={e => e.target.style.display = 'none'} />
              ) : (
                <img src={currentMediaUrl || ''} alt={product.title} className="gallery-main-img" onError={e => e.target.style.display = 'none'} />
              )}
              {/* Dots */}
              {!colorImageOverride && totalMedia > 1 && (
                <div className="gallery-dots">
                  {allMedia.map((_, i) => (
                    <button key={i} className={`gallery-dot${mainImageIndex === i ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setMainImageIndex(i); }} />
                  ))}
                </div>
              )}
              {/* Zoom hint (CSS hides on mobile) */}
              <div className="gallery-zoom-hint">
                <div className="gallery-zoom-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {colorImageOverride ? 'Fullscreen' : `Gallery · ${totalMedia}`}
                </div>
              </div>
            </div>

            {/* Thumbnails — always scrollable on mobile, windowed on desktop */}
            {totalMedia > 0 && (
              <div className="thumb-strip-wrap">
                {totalMedia > visibleThumbnails && (
                  <>
                    <button className="thumb-nav-btn t-prev" onClick={() => setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1))} disabled={thumbnailStartIndex === 0}>‹</button>
                    <button className="thumb-nav-btn t-next" onClick={() => setThumbnailStartIndex(Math.min(totalMedia - visibleThumbnails, thumbnailStartIndex + 1))} disabled={thumbnailStartIndex + visibleThumbnails >= totalMedia}>›</button>
                  </>
                )}
                {/* All items always rendered — native scroll on mobile, JS-windowed on desktop */}
                <div className="thumb-strip" ref={thumbStripRef}>
                  {allMedia.map((media, globalIndex) => {
                    const isThumbVideo = globalIndex >= (product.images?.length || 0);
                    const isActive = !colorImageOverride && mainImageIndex === globalIndex;
                    return (
                      <button key={globalIndex} className={`thumb-item${isActive ? ' active' : ''}`} onClick={() => handleThumbClick(globalIndex)}>
                        {isThumbVideo ? (
                          <div className="thumb-video-wrap">
                            <video src={media} className="thumb-video" muted playsInline />
                            <div className="thumb-play-icon">
                              <div className="thumb-play-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img src={media} alt={`Thumbnail ${globalIndex + 1}`} className="thumb-img" onError={e => e.target.style.display = 'none'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══ INFO COLUMN ══ */}
          <div className="info-col">

            <div className="info-eyebrow">
              <span className="info-brand">{product.brand}</span>
              <div className="info-divider-dot" />
              <span className={getCategoryTagClass()}>{getCategoryDisplay()}</span>
            </div>

            <h1 className="info-title">{product.title}</h1>
            <p className="info-shape">{product.watchShape}</p>
            <div className="info-sep" />

            {/* Price */}
            <div className="price-block">
              <span className="price-label">Price</span>
              {product.price === null || product.price === undefined
                ? <span className="price-contact-text">Contact for Pricing</span>
                : <span className="price-value">{formatPrice(product.price)}</span>
              }
            </div>

            {/* Contact-only */}
            {(product.price === null || product.price === undefined) && (
              <div style={{ marginBottom: 18 }}>
                <p className="price-contact-sub">Please contact our luxury specialists for pricing details.</p>
                <button className="btn-contact-cta" onClick={() => navigate('/contact')}>Contact for Pricing</button>
              </div>
            )}

            {/* Purchase section */}
            {product.price !== null && product.price !== undefined && (
              <>
                {/* Colors */}
                {productColors.length > 0 && (
                  <div className="section-block">
                    <span className="section-heading">Available Colors</span>
                    <div className="color-swatches">
                      {productColors.map((colorObj, idx) => (
                        <button key={idx} className={`color-swatch-btn${selectedColorObj?.name === colorObj.name ? ' active' : ''}`} onClick={() => handleColorSelect(colorObj)}>
                          {colorObj.colorImage && <img src={colorObj.colorImage} alt={colorObj.name} className="color-swatch-thumb" />}
                          {colorObj.name}
                        </button>
                      ))}
                    </div>
                    {selectedColorObj?.colorImage && (
                      <div className="color-hint">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Showing image for selected color
                      </div>
                    )}
                    {selectedColorObj && selectedColorObj.quantity !== null && selectedColorObj.quantity > 0 && (
                      <div className="stock-row"><div className="stock-dot green" /><span className="stock-text-green">{selectedColorObj.quantity} {selectedColorObj.quantity === 1 ? 'item' : 'items'} in stock</span></div>
                    )}
                    {selectedColorObj && selectedColorObj.quantity === 0 && (
                      <div className="stock-row"><div className="stock-dot red" /><span className="stock-text-red">Out of stock</span></div>
                    )}
                    {selectedColorObj && selectedColorObj.quantity === null && (
                      <div className="stock-row"><div className="stock-dot blue" /><span className="stock-text-blue">Available</span></div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="section-block">
                  <span className="section-heading">Quantity</span>
                  <div className="qty-row">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>−</button>
                      <input type="number" className="qty-input" min="1" max={getMaxQuantity()} value={quantity} onChange={handleQuantityInputChange} onFocus={handleQuantityInputFocus} />
                      <button className="qty-btn" onClick={() => handleQuantityChange(quantity + 1)} disabled={selectedColorObj && selectedColorObj.quantity !== null && quantity >= selectedColorObj.quantity}>+</button>
                    </div>
                    {selectedColorObj && selectedColorObj.quantity !== null && <span className="qty-max">Max: {selectedColorObj.quantity}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="action-row">
                  <button className="btn-add-cart" onClick={addToCart} disabled={!selectedColorObj || (selectedColorObj.quantity !== null && selectedColorObj.quantity === 0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {selectedColorObj && selectedColorObj.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button className="btn-my-cart" onClick={goToCart}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Cart
                  </button>
                </div>
              </>
            )}

            {/* Wholesale */}
            <div className="wholesale-card">
              <div className="wholesale-inner">
                <div className="wholesale-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="wholesale-content">
                  <div className="wholesale-title">Wholesale Dealers</div>
                  <p className="wholesale-text">Registered wholesale dealer or retailer? Contact us before ordering for exclusive pricing and terms.</p>
                  <div className="wholesale-btns">
                    <a href="https://wa.me/94763009123" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.813.735 5.44 2.02 7.746L0 32l8.413-2.008A15.957 15.957 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.566 22.486c-.33.92-1.927 1.77-2.689 1.86-.717.083-1.598.115-5.488-2.078-4.572-2.566-7.506-9.118-7.718-9.505-.212-.388-1.715-2.452-1.715-4.676 0-2.224 1.112-3.316 1.507-3.765.397-.449.87-.575 1.164-.575.295 0 .59.003.847.01.273.007.64-.103.997.774.355.875 1.203 3.03 1.31 3.25.107.22.178.483-.106.775-.283.293-.515.637-.736.95-.223.314-.47.66-.218 1.05.252.388 1.124 1.853 2.406 2.998 1.657 1.55 3.041 2.07 3.534 2.3.493.229.781.191.975.116.193-.076.588-.22 1.074-.532.485-.313 1.28-1.488 1.457-2.926.176-1.438.176-2.658-.124-2.926-.3-.268-.557-.318-.747-.316-.19.003-.41.003-.63.003-.22 0-.577-.082-.88.623-.302.704-1.2 1.49-1.2 1.49s-.173.22-.31.365c-.137.145-.28.3-.28.3s-.263.22-.1.55c.163.33.744 1.205.8 1.29.056.085.93 1.56 2.39 2.51 1.46.95 2.285.905 2.62.85.334-.055 1.085-.44 1.238-.87.153-.43.153-.8.106-.88z"/>
                      </svg>
                      WhatsApp Us
                    </a>
                    <button className="btn-contact-team" onClick={() => navigate('/contact')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Team
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="desc-block">
              <span className="section-heading">Description</span>
              <p className="desc-text">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="specs-block">
              <span className="section-heading">Specifications</span>
              <table className="specs-table">
                <tbody>
                  {product.modelNumber && product.modelNumber !== 'N/A' && (
                    <tr className="spec-row"><td className="spec-key">Model</td><td className="spec-val">{product.modelNumber}</td></tr>
                  )}
                  <tr className="spec-row"><td className="spec-key">Brand</td><td className="spec-val">{product.brand}</td></tr>
                  <tr className="spec-row">
                    <td className="spec-key">Category</td>
                    <td className="spec-val"><span className={getCategoryTagClass()}>{getCategoryDisplay()}</span></td>
                  </tr>
                  <tr className="spec-row"><td className="spec-key">Shape</td><td className="spec-val">{product.watchShape}</td></tr>
                  {product.specifications && Array.isArray(product.specifications) && product.specifications.map((spec, idx) => {
                    const key = typeof spec === 'object' ? spec.key : spec;
                    const value = typeof spec === 'object' ? spec.value : '';
                    if (!key || !value) return null;
                    return <tr key={idx} className="spec-row"><td className="spec-key">{key}</td><td className="spec-val">{value}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>

            {/* Warranty */}
            {product.warranty && product.warranty.duration !== 'nowarranty' && (
              <div className="warranty-block">
                <span className="section-heading">Warranty</span>
                <div className="warranty-card">
                  <div className="warranty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="warranty-label">{getWarrantyLabel(product.warranty.duration)}</p>
                    {product.warranty.description && <p className="warranty-desc">{product.warranty.description}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="trust-row">
              <div className="trust-badge">
                <div className="trust-icon-wrap" style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="trust-text">
                  <p className="trust-title">7-Day Returns</p>
                  <p className="trust-sub">Hassle-free</p>
                </div>
              </div>
              <Link to="/privacy" style={{ textDecoration: 'none' }} className="trust-badge">
                <div className="trust-icon-wrap" style={{ background: 'var(--surface3)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="var(--text-sub)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="trust-text">
                  <p className="trust-title">Privacy Policy</p>
                  <p className="trust-sub">Your data is safe</p>
                </div>
              </Link>
            </div>

            {/* Assistance */}
            <div className="assist-block">
              <h3 className="assist-title">Need Assistance?</h3>
              <p className="assist-text">Our specialists are ready to answer any questions about this {product.productType === 'wall_clock' ? 'wall clock' : 'timepiece'}.</p>
              <button className="assist-link" onClick={() => navigate('/contact')}>
                Contact Our Experts
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>{/* /info-col */}
        </div>{/* /pdp-grid */}

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <span className="related-eyebrow">Explore More</span>
            <h2 className="related-title">You May Also Like <em>{product.productType === 'wall_clock' ? 'Wall Clocks' : 'Watches'}</em></h2>
            <div className="related-grid">
              {relatedProducts.map(rp => (
                <div key={rp._id} className="related-card" onClick={() => navigate(`/shop/${rp._id}`)}>
                  <div className="related-card-img-wrap">
                    {rp.images?.[0]
                      ? <img src={rp.images[0]} alt={rp.title} className="related-card-img" onError={e => e.target.style.display = 'none'} />
                      : <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>No Image</div>
                    }
                  </div>
                  <div className="related-card-body">
                    <span className="related-card-brand">{rp.brand}</span>
                    <h3 className="related-card-title">{rp.title}</h3>
                    <p className="related-card-price">{formatPrice(rp.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>{/* /pdp-wrapper */}
    </div>
  );
};

export default ProductDetailPage;