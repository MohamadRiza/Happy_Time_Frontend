// src/pages/CustomerOrders.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout,
} from "../utils/auth";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

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
    --border-hover: rgba(201,168,76,0.35);
    --text: #f0ece4;
    --text-muted: #7a7570;
    --text-sub: #a09890;
    --red: #f87171;
    --red-dim: rgba(248,113,113,0.08);
    --red-border: rgba(248,113,113,0.25);
    --green: #4ade80;
    --green-dim: rgba(74,222,128,0.1);
    --green-border: rgba(74,222,128,0.25);
    --blue-dim: rgba(96,165,250,0.1);
    --blue-border: rgba(96,165,250,0.25);
    --purple-dim: rgba(167,139,250,0.1);
    --purple-border: rgba(167,139,250,0.25);
    --yellow-dim: rgba(251,191,36,0.1);
    --yellow-border: rgba(251,191,36,0.25);
    --radius: 14px;
    --radius-lg: 20px;
    --nav-height: 56px;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .ord-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    padding-bottom: calc(var(--nav-height) + 24px);
  }
  @media(min-width:768px) { .ord-root { padding-bottom: 48px; } }

  /* ── WRAPPER ── */
  .ord-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 12px 32px;
    width: 100%;
  }
  @media(min-width:480px)  { .ord-wrapper { padding: 20px 16px 40px; } }
  @media(min-width:640px)  { .ord-wrapper { padding: 28px 22px 48px; } }
  @media(min-width:1024px) { .ord-wrapper { padding: 44px 40px 64px; } }

  /* ── HEADER ── */
  .ord-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
    gap: 12px;
    flex-wrap: wrap;
  }
  .ord-eyebrow {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }
  .ord-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 5vw, 40px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--text);
    margin: 0;
  }
  .ord-title em { font-style: italic; color: var(--gold-light); }
  .ord-continue-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--surface2);
    color: var(--text-sub);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 9px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    align-self: flex-end;
    -webkit-tap-highlight-color: transparent;
  }
  .ord-continue-btn:hover { border-color: var(--gold-border); color: var(--gold); background: var(--gold-dim); }

  /* ── FILTERS ── */
  .ord-filters {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .ord-filter-group {}
  .ord-filter-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
  }
  .ord-filter-btns { display: flex; flex-wrap: wrap; gap: 6px; }
  .ord-filter-btn {
    padding: 5px 12px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .ord-filter-btn:hover { border-color: var(--gold-border); color: var(--gold); }
  .ord-filter-btn.active {
    background: var(--gold);
    color: #000;
    border-color: var(--gold);
    font-weight: 600;
  }

  /* ── TOOLBAR ── */
  .ord-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 10px;
  }
  .ord-count { font-size: 12px; color: var(--text-muted); letter-spacing: 0.04em; }
  .ord-count strong { color: var(--text-sub); font-weight: 500; }
  .ord-view-toggle {
    display: flex;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 9px;
    padding: 3px;
    gap: 2px;
  }
  .ord-view-btn {
    width: 30px; height: 26px;
    border-radius: 7px;
    border: none;
    background: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ord-view-btn.active { background: var(--gold); color: #000; }
  .ord-view-btn:hover:not(.active) { color: var(--text); }

  /* ── ERROR ── */
  .ord-error {
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    border-radius: var(--radius);
    padding: 12px 16px;
    font-size: 13px;
    color: var(--red);
    margin-bottom: 16px;
  }

  /* ── EMPTY STATE ── */
  .ord-empty {
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 52px 24px;
  }
  .ord-empty-icon { font-size: 52px; margin-bottom: 14px; }
  .ord-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 400;
    color: var(--text);
    margin-bottom: 8px;
  }
  .ord-empty-title em { font-style: italic; color: var(--gold-light); }
  .ord-empty-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 22px; line-height: 1.65; }
  .ord-empty-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
  .btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(201,168,76,0.2);
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-gold:hover { background: var(--gold-light); }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--surface2);
    color: var(--text-sub);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-ghost:hover { border-color: var(--border-hover); color: var(--gold); }

  /* ── ORDERS GRID ── */
  .ord-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  @media(min-width:560px)  { .ord-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(min-width:900px)  { .ord-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(min-width:1200px) { .ord-grid { grid-template-columns: repeat(4, 1fr); } }

  .ord-list { display: flex; flex-direction: column; gap: 10px; }

  /* ── ORDER CARD ── */
  .ord-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.15s;
    position: relative;
  }
  .ord-card:hover {
    border-color: var(--gold-border);
    box-shadow: 0 8px 32px rgba(201,168,76,0.08);
  }
  .ord-card:active { transform: scale(0.995); }
  .ord-card.has-alert { border-color: var(--red-border); }
  .ord-card.has-alert:hover { border-color: var(--red); }

  /* alert stripe */
  .ord-card.has-alert::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--red);
  }

  /* list mode card */
  .ord-card.list-mode {
    display: flex;
    align-items: stretch;
  }
  .ord-card.list-mode .ord-card-body {
    display: flex;
    flex: 1;
    gap: 0;
    align-items: center;
  }

  /* ── CARD TOP ── */
  .ord-card-top {
    padding: 12px 14px 10px;
    border-bottom: 1px solid var(--border);
  }
  .ord-card-top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }
  .ord-card-id {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.04em;
  }
  .ord-card-date {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.03em;
    margin-top: 2px;
  }
  .ord-badges { display: flex; flex-wrap: wrap; gap: 4px; }
  .ord-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 7px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border: 1px solid;
    white-space: nowrap;
  }
  /* status colors */
  .badge-pending   { background: var(--yellow-dim); color: #fbbf24; border-color: var(--yellow-border); }
  .badge-processing { background: var(--blue-dim); color: #60a5fa; border-color: var(--blue-border); }
  .badge-confirmed  { background: var(--green-dim); color: #4ade80; border-color: var(--green-border); }
  .badge-shipped    { background: var(--purple-dim); color: #a78bfa; border-color: var(--purple-border); }
  .badge-delivered  { background: var(--green-dim); color: #34d399; border-color: var(--green-border); }
  .badge-cancelled  { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }
  .badge-receipt-pending  { background: var(--yellow-dim); color: #fbbf24; border-color: var(--yellow-border); }
  .badge-receipt-verified { background: var(--green-dim); color: #4ade80; border-color: var(--green-border); }
  .badge-receipt-rejected { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }

  /* alert note */
  .ord-alert-note {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--red);
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    border-radius: 7px;
    padding: 5px 9px;
    margin-top: 6px;
  }

  /* ── CARD IMAGES ── */
  .ord-card-imgs {
    display: flex;
    gap: 6px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .ord-card-img-wrap {
    width: 48px; height: 48px;
    border-radius: 9px;
    overflow: hidden;
    background: var(--surface2);
    flex-shrink: 0;
    border: 1px solid var(--border);
  }
  .ord-card-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .ord-card-img-more {
    width: 48px; height: 48px;
    border-radius: 9px;
    background: var(--surface3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--gold);
    flex-shrink: 0;
  }
  .ord-card-img-placeholder {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── CARD FOOTER ── */
  .ord-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    gap: 8px;
  }
  .ord-card-total-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px; }
  .ord-card-total-val {
    font-size: 14px;
    font-weight: 700;
    color: var(--gold-light);
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.01em;
  }
  .ord-card-cta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* LIST MODE extras */
  .ord-list-left {
    padding: 12px 14px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }
  .ord-list-mid {
    padding: 10px 12px;
    border-right: 1px solid var(--border);
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
  .ord-list-right {
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    flex-shrink: 0;
    min-width: 110px;
  }

  /* ── MINI PROGRESS BAR (on card) ── */
  .ord-card-progress {
    height: 2px;
    background: var(--surface3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 14px 10px;
  }
  .ord-card-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 2px;
    transition: width 0.6s ease;
  }

  /* ────────────────────────────────
     MODAL
  ──────────────────────────────── */
  .ord-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 200;
    padding: 0;
  }
  @media(min-width:640px) {
    .ord-modal-overlay {
      align-items: center;
      padding: 16px;
    }
  }
  .ord-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    width: 100%;
    max-width: 860px;
    max-height: 96vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -8px 60px rgba(0,0,0,0.6);
    position: relative;
  }
  @media(min-width:640px) {
    .ord-modal {
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08);
    }
  }

  /* drag handle */
  .ord-modal-handle {
    width: 36px; height: 4px;
    border-radius: 2px;
    background: var(--surface3);
    margin: 10px auto 0;
    flex-shrink: 0;
  }
  @media(min-width:640px) { .ord-modal-handle { display: none; } }

  /* modal header */
  .ord-modal-head {
    padding: 16px 18px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
  }
  @media(min-width:480px) { .ord-modal-head { padding: 18px 22px 16px; } }
  .ord-modal-head-left {}
  .ord-modal-eyebrow {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }
  .ord-modal-id {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(18px, 3vw, 26px);
    font-weight: 400;
    color: var(--text);
    line-height: 1.1;
    margin: 0 0 5px;
  }
  .ord-modal-date { font-size: 11px; color: var(--text-muted); }
  .ord-modal-close {
    width: 34px; height: 34px;
    border-radius: 9px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    margin-top: 2px;
  }
  .ord-modal-close:hover { border-color: var(--red-border); color: var(--red); background: var(--red-dim); }

  /* modal body scroll */
  .ord-modal-body {
    overflow-y: auto;
    flex: 1;
    padding: 16px 18px 24px;
    -webkit-overflow-scrolling: touch;
  }
  @media(min-width:480px) { .ord-modal-body { padding: 18px 22px 28px; } }

  /* ── DELIVERY PROGRESS ── */
  .ord-progress-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
  }
  .ord-progress-title {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ord-progress-bar-wrap {
    position: relative;
    margin-bottom: 24px;
    padding-top: 20px;
  }
  .ord-progress-bar-track {
    height: 4px;
    background: var(--surface3);
    border-radius: 4px;
    overflow: visible;
    position: relative;
  }
  .ord-progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 4px;
    transition: width 0.8s ease;
    position: relative;
  }
  .ord-truck {
    position: absolute;
    top: -18px;
    transform: translateX(-50%);
    transition: left 0.8s ease;
    font-size: 22px;
    line-height: 1;
  }
  .ord-truck img { width: 28px; height: 28px; object-fit: contain; display: block; }
  @keyframes truckBounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-3px); }
  }
  .ord-truck { animation: truckBounce 2s ease-in-out infinite; }

  /* timeline steps */
  .ord-timeline {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .ord-tl-step { text-align: center; }
  .ord-tl-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    margin: 0 auto 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    border: 2px solid;
    transition: all 0.3s;
  }
  .ord-tl-dot.done    { background: var(--green-dim); border-color: var(--green); color: var(--green); }
  .ord-tl-dot.active  { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); animation: pulseDot 2s ease-in-out infinite; }
  .ord-tl-dot.pending { background: var(--surface3); border-color: var(--border); color: var(--text-muted); opacity: 0.6; }
  .ord-tl-dot.cancelled { background: var(--red-dim); border-color: var(--red-border); color: var(--red); opacity: 0.7; }
  @keyframes pulseDot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
  }
  .ord-tl-name { font-size: 10px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .ord-tl-desc { font-size: 9px; color: var(--text-muted); line-height: 1.4; }

  /* ── ADMIN NOTE ── */
  .ord-admin-note {
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    border-radius: var(--radius);
    padding: 14px 16px;
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .ord-admin-note-icon { font-size: 18px; flex-shrink: 0; }
  .ord-admin-note-title { font-size: 12px; font-weight: 600; color: var(--red); letter-spacing: 0.04em; margin-bottom: 4px; text-transform: uppercase; }
  .ord-admin-note-text { font-size: 13px; color: #fca5a5; line-height: 1.55; }

  /* ── MODAL SECTION ── */
  .ord-m-section {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 12px;
    overflow: hidden;
  }
  .ord-m-section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }
  .ord-m-section-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ord-m-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 500;
    color: var(--text);
    margin: 0;
  }
  .ord-m-section-body { padding: 14px 16px; }

  /* ── MODAL LAYOUT ── */
  .ord-modal-cols {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media(min-width:600px) {
    .ord-modal-cols { flex-direction: row; }
    .ord-modal-col { flex: 1; }
  }

  /* ── ORDER ITEMS LIST ── */
  .ord-m-items-list { display: flex; flex-direction: column; gap: 10px; }
  .ord-m-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .ord-m-item-img {
    width: 56px; height: 56px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: var(--surface3);
    border: 1px solid var(--border);
    display: block;
  }
  @media(min-width:480px) { .ord-m-item-img { width: 64px; height: 64px; } }
  .ord-m-item-info { flex: 1; min-width: 0; }
  .ord-m-item-brand {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 3px;
  }
  .ord-m-item-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-bottom: 4px;
  }
  .ord-m-item-meta { font-size: 11px; color: var(--text-muted); }
  .ord-m-item-price {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── SUMMARY TABLE ── */
  .ord-summary-rows { display: flex; flex-direction: column; gap: 10px; }
  .ord-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }
  .ord-summary-label { color: var(--text-muted); }
  .ord-summary-val { font-weight: 500; color: var(--text); }
  .ord-summary-sep { height: 1px; background: var(--border); margin: 4px 0; }
  .ord-summary-total { font-size: 15px; font-weight: 700; color: var(--gold-light); }

  /* ── ADDRESS ── */
  .ord-address-lines { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-sub); line-height: 1.6; }
  .ord-phone {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--gold);
    font-weight: 500;
    padding-top: 8px;
    margin-top: 6px;
    border-top: 1px solid var(--border);
  }

  /* ── RECEIPT LINK ── */
  .ord-receipt-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    border-radius: 10px;
    color: var(--gold);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ord-receipt-link:hover { background: rgba(201,168,76,0.2); border-color: var(--gold); }

  /* ── MODAL ACTIONS ── */
  .ord-modal-actions { display: flex; flex-direction: column; gap: 8px; }
  .ord-action-cancel {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid var(--red-border);
    background: var(--red-dim);
    color: var(--red);
    -webkit-tap-highlight-color: transparent;
  }
  .ord-action-cancel:hover { background: rgba(248,113,113,0.15); border-color: var(--red); }
  .ord-action-primary {
    display: block;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    background: var(--gold);
    color: #000;
    border: none;
    text-align: center;
    text-decoration: none;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(201,168,76,0.2);
    -webkit-tap-highlight-color: transparent;
  }
  .ord-action-primary:hover { background: var(--gold-light); }
  .ord-action-outline {
    display: block;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    background: none;
    color: var(--gold);
    border: 1px solid var(--gold-border);
    text-align: center;
    text-decoration: none;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ord-action-outline:hover { background: var(--gold-dim); }
  .ord-action-ghost {
    width: 100%;
    padding: 11px 16px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    background: var(--surface3);
    color: var(--text-sub);
    border: 1px solid var(--border);
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ord-action-ghost:hover { border-color: var(--border-hover); color: var(--text); }

  @keyframes pulseDot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
  }
  @keyframes truckBounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-3px); }
  }
`;

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [receiptFilter, setReceiptFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    if (!isCustomerAuthenticated()) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const sortedOrders = (data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        setError(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      setError("Network error. Please try again.");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── HELPERS ──
  const getStatusBadgeClass = (status) => {
    const map = {
      pending_payment: "badge-pending",
      processing: "badge-processing",
      confirmed: "badge-confirmed",
      shipped: "badge-shipped",
      delivered: "badge-delivered",
      cancelled: "badge-cancelled",
    };
    return map[status] || "badge-pending";
  };

  const getReceiptBadgeClass = (status) => {
    const map = {
      pending: "badge-receipt-pending",
      verified: "badge-receipt-verified",
      rejected: "badge-receipt-rejected",
    };
    return map[status] || "badge-receipt-pending";
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "Contact for Price";
    return `LKR ${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderTimeline = (order) => {
    const steps = [
      {
        id: "payment",
        shortName: "Payment",
        completed: order.receiptStatus === "verified",
        active: order.receiptStatus === "pending" || order.receiptStatus === "rejected",
        icon: "💳",
        description:
          order.receiptStatus === "verified" ? "Verified" :
          order.receiptStatus === "pending" ? "Awaiting" : "Resubmit",
      },
      {
        id: "confirmed",
        shortName: "Confirmed",
        completed: ["confirmed", "shipped", "delivered"].includes(order.status),
        active: order.status === "processing",
        icon: "✓",
        description: ["confirmed", "shipped", "delivered"].includes(order.status)
          ? "Confirmed" : "Processing",
      },
      {
        id: "shipped",
        shortName: "Shipped",
        completed: ["shipped", "delivered"].includes(order.status),
        active: order.status === "confirmed",
        icon: "🚚",
        description: ["shipped", "delivered"].includes(order.status) ? "Shipped" : "Preparing",
      },
      {
        id: "delivered",
        shortName: "Delivered",
        completed: order.status === "delivered",
        active: order.status === "shipped",
        icon: "📦",
        description: order.status === "delivered" ? "Delivered" : "In transit",
      },
    ];

    if (order.status === "cancelled") {
      return steps.map((step) => ({ ...step, completed: false, active: false, cancelled: true }));
    }
    return steps;
  };

  const getDeliveryProgress = (order) => {
    if (order.status === "cancelled") return 0;
    const statusOrder = ["pending_payment", "processing", "confirmed", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(order.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const hasAdminNotesAndActive = (order) =>
    order.adminNotes && order.status !== "delivered" && order.status !== "cancelled";

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const receiptMatch =
      receiptFilter === "all" ||
      (receiptFilter === "verified" && order.receiptStatus === "verified") ||
      (receiptFilter === "not_verified" && order.receiptStatus !== "verified");
    return statusMatch && receiptMatch;
  });

  if (loading) return <Loading message="Loading your orders..." size="large" />;

  // Status label helper
  const statusLabel = (s) => s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <style>{styles}</style>

      <div className="ord-root">
        <Helmet>
          <title>My Orders – Happy Time</title>
          <meta name="description" content="View and track your orders from Happy Time." />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href="https://happytimeonline.com/orders" />
          <meta property="og:title" content="My Orders – Happy Time" />
          <meta property="og:description" content="View and track your orders from Happy Time." />
          <meta property="og:url" content="https://happytimeonline.com/orders" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="My Orders – Happy Time" />
          <meta name="twitter:description" content="View and track your orders from Happy Time." />
          <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
        </Helmet>

        <ScrollToTop />

        <div className="ord-wrapper">

          {/* ── HEADER ── */}
          <div className="ord-header">
            <div>
              <span className="ord-eyebrow">Account</span>
              <h1 className="ord-title">My <em>Orders</em></h1>
            </div>
            <Link to="/shop" className="ord-continue-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* ── FILTERS ── */}
          <div className="ord-filters">
            <div className="ord-filter-group">
              <span className="ord-filter-label">Order Status</span>
              <div className="ord-filter-btns">
                {[
                  { value: "all", label: "All" },
                  { value: "pending_payment", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                  { value: "cancelled", label: "Cancelled" },
                ].map((f) => (
                  <button
                    key={f.value}
                    className={`ord-filter-btn${statusFilter === f.value ? " active" : ""}`}
                    onClick={() => setStatusFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ord-filter-group">
              <span className="ord-filter-label">Receipt Status</span>
              <div className="ord-filter-btns">
                {[
                  { value: "all", label: "All" },
                  { value: "verified", label: "Verified" },
                  { value: "not_verified", label: "Not Verified" },
                ].map((f) => (
                  <button
                    key={f.value}
                    className={`ord-filter-btn${receiptFilter === f.value ? " active" : ""}`}
                    onClick={() => setReceiptFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── ERROR ── */}
          {error && <div className="ord-error">{error}</div>}

          {/* ── EMPTY STATE ── */}
          {filteredOrders.length === 0 ? (
            <div className="ord-empty">
              <div className="ord-empty-icon">📦</div>
              <h2 className="ord-empty-title">No orders <em>found</em></h2>
              <p className="ord-empty-sub">
                {statusFilter === "all" && receiptFilter === "all"
                  ? "You haven't placed any orders yet."
                  : "No orders match your current filters."}
              </p>
              <div className="ord-empty-actions">
                {(statusFilter !== "all" || receiptFilter !== "all") && (
                  <button
                    className="btn-gold"
                    onClick={() => { setStatusFilter("all"); setReceiptFilter("all"); }}
                  >
                    Clear Filters
                  </button>
                )}
                <Link to="/shop" className="btn-ghost">Browse Collection</Link>
              </div>
            </div>
          ) : (
            <>
              {/* ── TOOLBAR ── */}
              <div className="ord-toolbar">
                <span className="ord-count">
                  <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? "order" : "orders"}
                </span>
                <div className="ord-view-toggle">
                  <button
                    className={`ord-view-btn${viewMode === "grid" ? " active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className={`ord-view-btn${viewMode === "list" ? " active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── ORDER CARDS ── */}
              <div className={viewMode === "grid" ? "ord-grid" : "ord-list"}>
                {filteredOrders.map((order) => {
                  const progress = getDeliveryProgress(order);
                  const hasAlert = hasAdminNotesAndActive(order);
                  const shortId = order._id.substring(order._id.length - 6).toUpperCase();

                  if (viewMode === "list") {
                    return (
                      <div
                        key={order._id}
                        className={`ord-card list-mode${hasAlert ? " has-alert" : ""}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="ord-card-body">
                          {/* Left: id + date + badges */}
                          <div className="ord-list-left">
                            <span className="ord-card-id">#{shortId}</span>
                            <span className="ord-card-date">{formatDate(order.createdAt)}</span>
                            <div className="ord-badges" style={{ marginTop: 5 }}>
                              <span className={`ord-badge ${getStatusBadgeClass(order.status)}`}>
                                {statusLabel(order.status)}
                              </span>
                              <span className={`ord-badge ${getReceiptBadgeClass(order.receiptStatus)}`}>
                                {order.receiptStatus}
                              </span>
                            </div>
                          </div>
                          {/* Mid: images */}
                          <div className="ord-list-mid">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="ord-card-img-wrap">
                                {item.productId?.images?.[0]
                                  ? <img src={item.productId.images[0]} alt={item.productId.title} />
                                  : <div className="ord-card-img-placeholder">?</div>
                                }
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="ord-card-img-more">+{order.items.length - 3}</div>
                            )}
                          </div>
                          {/* Right: total + cta */}
                          <div className="ord-list-right">
                            <div className="ord-card-total-label">Total</div>
                            <div className="ord-card-total-val">{formatPrice(order.totalAmount)}</div>
                            <div className="ord-card-cta" style={{ marginTop: 4 }}>
                              View
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // GRID CARD
                  return (
                    <div
                      key={order._id}
                      className={`ord-card${hasAlert ? " has-alert" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Header */}
                      <div className="ord-card-top">
                        <div className="ord-card-top-row">
                          <div>
                            <div className="ord-card-id">#{shortId}</div>
                            <div className="ord-card-date">{formatDate(order.createdAt)}</div>
                          </div>
                          <div className="ord-badges">
                            <span className={`ord-badge ${getStatusBadgeClass(order.status)}`}>
                              {statusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                        <div className="ord-badges">
                          <span className={`ord-badge ${getReceiptBadgeClass(order.receiptStatus)}`}>
                            Receipt: {order.receiptStatus}
                          </span>
                        </div>
                        {hasAlert && (
                          <div className="ord-alert-note">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Action required
                          </div>
                        )}
                      </div>

                      {/* Images */}
                      <div className="ord-card-imgs">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="ord-card-img-wrap">
                            {item.productId?.images?.[0]
                              ? <img src={item.productId.images[0]} alt={item.productId.title} />
                              : <div className="ord-card-img-placeholder">?</div>
                            }
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="ord-card-img-more">+{order.items.length - 3}</div>
                        )}
                        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      {/* Mini progress */}
                      <div className="ord-card-progress">
                        <div className="ord-card-progress-fill" style={{ width: `${progress}%` }} />
                      </div>

                      {/* Footer */}
                      <div className="ord-card-footer">
                        <div>
                          <div className="ord-card-total-label">Total</div>
                          <div className="ord-card-total-val">{formatPrice(order.totalAmount)}</div>
                        </div>
                        <div className="ord-card-cta">
                          View details
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ────────────────────────────────
            ORDER DETAILS MODAL
        ──────────────────────────────── */}
        {selectedOrder && (
          <div className="ord-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="ord-modal" onClick={(e) => e.stopPropagation()}>

              {/* drag handle (mobile) */}
              <div className="ord-modal-handle" />

              {/* modal header */}
              <div className="ord-modal-head">
                <div className="ord-modal-head-left">
                  <span className="ord-modal-eyebrow">Order Details</span>
                  <h2 className="ord-modal-id">
                    #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                  </h2>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    <span className={`ord-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {statusLabel(selectedOrder.status)}
                    </span>
                    <span className={`ord-badge ${getReceiptBadgeClass(selectedOrder.receiptStatus)}`}>
                      Receipt: {selectedOrder.receiptStatus}
                    </span>
                  </div>
                  <div className="ord-modal-date" style={{ marginTop: 5 }}>
                    Placed {formatDate(selectedOrder.createdAt)}
                    {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <> · Updated {formatDate(selectedOrder.updatedAt)}</>
                    )}
                  </div>
                </div>
                <button className="ord-modal-close" onClick={() => setSelectedOrder(null)} aria-label="Close">✕</button>
              </div>

              {/* modal body */}
              <div className="ord-modal-body">

                {/* Delivery Progress */}
                <div className="ord-progress-card">
                  <div className="ord-progress-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Delivery Progress
                  </div>
                  <div className="ord-progress-bar-wrap">
                    <div className="ord-progress-bar-track">
                      <div
                        className="ord-progress-bar-fill"
                        style={{ width: `${getDeliveryProgress(selectedOrder)}%` }}
                      />
                    </div>
                    {selectedOrder.status !== "cancelled" && (
                      <div
                        className="ord-truck"
                        style={{ left: `${Math.min(Math.max(getDeliveryProgress(selectedOrder), 4), 96)}%` }}
                      >
                        <img src="/Delivery_Truck.webp" alt="delivery truck" loading="eager" />
                      </div>
                    )}
                  </div>
                  <div className="ord-timeline">
                    {getOrderTimeline(selectedOrder).map((step) => {
                      const dotClass = step.cancelled ? "cancelled" : step.completed ? "done" : step.active ? "active" : "pending";
                      return (
                        <div key={step.id} className="ord-tl-step">
                          <div className={`ord-tl-dot ${dotClass}`}>
                            {step.cancelled ? "✕" : step.completed ? "✓" : step.icon}
                          </div>
                          <div className="ord-tl-name">{step.shortName}</div>
                          <div className="ord-tl-desc">
                            {step.cancelled ? "Cancelled" : step.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedOrder.adminNotes && (
                  <div className="ord-admin-note">
                    <div className="ord-admin-note-icon">⚠️</div>
                    <div>
                      <div className="ord-admin-note-title">Message from Admin</div>
                      <div className="ord-admin-note-text">{selectedOrder.adminNotes}</div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="ord-m-section">
                  <div className="ord-m-section-head">
                    <div className="ord-m-section-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="ord-m-section-title">
                      Order Items
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                        {selectedOrder.items.length} {selectedOrder.items.length === 1 ? "item" : "items"}
                      </span>
                    </h3>
                  </div>
                  <div className="ord-m-section-body">
                    <div className="ord-m-items-list">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="ord-m-item">
                          {item.productId?.images?.[0] && (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="ord-m-item-img"
                            />
                          )}
                          <div className="ord-m-item-info">
                            <span className="ord-m-item-brand">{item.productId?.brand}</span>
                            <span className="ord-m-item-title">{item.productId?.title}</span>
                            <div className="ord-m-item-meta">
                              {item.selectedColor} · Qty {item.quantity}
                            </div>
                          </div>
                          <span className="ord-m-item-price">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Two-col: summary + address | receipt + actions */}
                <div className="ord-modal-cols">
                  {/* Left col */}
                  <div className="ord-modal-col" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Order Summary */}
                    <div className="ord-m-section">
                      <div className="ord-m-section-head">
                        <div className="ord-m-section-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                          </svg>
                        </div>
                        <h3 className="ord-m-section-title">Summary</h3>
                      </div>
                      <div className="ord-m-section-body">
                        <div className="ord-summary-rows">
                          <div className="ord-summary-row">
                            <span className="ord-summary-label">Subtotal</span>
                            <span className="ord-summary-val">{formatPrice(selectedOrder.totalAmount)}</span>
                          </div>
                          <div className="ord-summary-row">
                            <span className="ord-summary-label">Shipping</span>
                            <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Free</span>
                          </div>
                          <div className="ord-summary-sep" />
                          <div className="ord-summary-row">
                            <span className="ord-summary-label" style={{ fontWeight: 600, color: 'var(--text-sub)' }}>Total</span>
                            <span className="ord-summary-total">{formatPrice(selectedOrder.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="ord-m-section">
                      <div className="ord-m-section-head">
                        <div className="ord-m-section-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="ord-m-section-title">Delivery Address</h3>
                      </div>
                      <div className="ord-m-section-body">
                        <div className="ord-address-lines">
                          <span>{selectedOrder.deliveryAddress?.address || "Not provided"}</span>
                          <span>
                            {selectedOrder.deliveryAddress?.city || "City"},{" "}
                            {selectedOrder.deliveryAddress?.province || "Province"}
                          </span>
                          <span>{selectedOrder.deliveryAddress?.country || "Country"}</span>
                        </div>
                        {selectedOrder.customer?.mobileNumber && (
                          <div className="ord-phone">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {selectedOrder.customer.mobileNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right col */}
                  <div className="ord-modal-col" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Receipt */}
                    {selectedOrder.receipt && (
                      <div className="ord-m-section">
                        <div className="ord-m-section-head">
                          <div className="ord-m-section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="ord-m-section-title">Payment Receipt</h3>
                        </div>
                        <div className="ord-m-section-body">
                          <a
                            href={`${API_URL}/${selectedOrder.receipt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ord-receipt-link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Receipt
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ord-m-section">
                      <div className="ord-m-section-head">
                        <div className="ord-m-section-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="ord-m-section-title">Actions</h3>
                      </div>
                      <div className="ord-m-section-body">
                        <div className="ord-modal-actions">
                          {selectedOrder.status === "pending_payment" && (
                            <button
                              className="ord-action-cancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrder(selectedOrder._id);
                                setSelectedOrder(null);
                              }}
                            >
                              Cancel Order
                            </button>
                          )}
                          <Link
                            to="/shop"
                            className="ord-action-primary"
                            onClick={() => setSelectedOrder(null)}
                          >
                            Continue Shopping
                          </Link>
                          <Link
                            to="/contact"
                            className="ord-action-outline"
                            onClick={() => setSelectedOrder(null)}
                          >
                            Contact Support
                          </Link>
                          <button
                            className="ord-action-ghost"
                            onClick={() => setSelectedOrder(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerOrders;