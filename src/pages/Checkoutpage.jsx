// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout
} from '../utils/auth';
import Loading from '../components/Loading';
import { Helmet } from 'react-helmet';

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
    --blue-dim: rgba(59,130,246,0.08);
    --blue-border: rgba(59,130,246,0.25);
    --radius: 14px;
    --radius-lg: 20px;
    --nav-height: 56px;
    --sticky-bar-height: 68px;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .co-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    padding-bottom: calc(var(--sticky-bar-height) + var(--nav-height) + 16px);
  }
  @media(min-width:1024px) { .co-root { padding-bottom: 0; } }

  /* ── WRAPPER ── */
  .co-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 16px 12px 40px;
    width: 100%;
  }
  @media(min-width:480px)  { .co-wrapper { padding: 20px 16px 48px; } }
  @media(min-width:640px)  { .co-wrapper { padding: 28px 22px 56px; } }
  @media(min-width:1024px) { .co-wrapper { padding: 44px 40px 72px; } }

  /* ── HEADER ── */
  .co-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
  }
  .co-back-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .co-back-btn:hover { border-color: var(--gold-border); color: var(--gold); background: var(--gold-dim); }
  .co-header-text {}
  .co-eyebrow {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 3px;
  }
  .co-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 5vw, 38px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--text);
    margin: 0;
  }
  .co-title em { font-style: italic; color: var(--gold-light); }

  /* ── PROGRESS STEPS ── */
  .co-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 24px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .co-steps::-webkit-scrollbar { display: none; }
  .co-step {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }
  .co-step-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0;
    flex-shrink: 0;
  }
  .co-step-dot.done {
    background: var(--gold);
    color: #000;
  }
  .co-step-dot.active {
    background: var(--gold-dim);
    border: 1.5px solid var(--gold);
    color: var(--gold);
  }
  .co-step-dot.pending {
    background: var(--surface3);
    border: 1.5px solid var(--border);
    color: var(--text-muted);
  }
  .co-step-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .co-step-label.active { color: var(--gold); }
  .co-step-label.done   { color: var(--text-sub); }
  .co-step-label.pending { color: var(--text-muted); }
  .co-step-line {
    flex: 1;
    min-width: 20px;
    max-width: 48px;
    height: 1px;
    background: var(--border);
    margin: 0 6px;
    flex-shrink: 0;
  }
  .co-step-line.done { background: var(--gold-border); }

  /* ── LAYOUT ── */
  .co-layout {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  @media(min-width:1024px) {
    .co-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 28px;
      align-items: start;
    }
  }

  /* ── SECTION CARD ── */
  .co-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    transition: border-color 0.25s;
  }
  @media(min-width:480px) { .co-card { padding: 20px; } }
  @media(min-width:640px) { .co-card { padding: 24px; } }
  .co-card:focus-within { border-color: rgba(201,168,76,0.2); }

  .co-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
    gap: 10px;
  }
  .co-card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--text);
    margin: 0;
    line-height: 1.2;
  }
  .co-card-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .co-card-icon svg { color: var(--gold); }
  .co-edit-btn {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    border-radius: 8px;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .co-edit-btn:hover { background: rgba(201,168,76,0.2); }

  /* ── ORDER ITEMS ── */
  .co-items-list { display: flex; flex-direction: column; gap: 0; }
  .co-order-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .co-order-item:last-child { border-bottom: none; padding-bottom: 0; }
  .co-order-item:first-child { padding-top: 0; }
  @media(min-width:480px) { .co-order-item { gap: 14px; } }
  .co-item-img {
    width: 64px; height: 64px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
    background: var(--surface2);
    display: block;
  }
  @media(min-width:480px) { .co-item-img { width: 72px; height: 72px; } }
  @media(min-width:640px) { .co-item-img { width: 80px; height: 80px; } }
  .co-item-info { flex: 1; min-width: 0; }
  .co-item-brand {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 3px;
  }
  .co-item-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-bottom: 4px;
  }
  @media(min-width:480px) { .co-item-title { font-size: 14px; } }
  .co-item-meta {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .co-item-meta-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold-border);
    border: 1px solid var(--gold-border);
    flex-shrink: 0;
  }
  .co-item-price {
    font-size: 13px;
    font-weight: 600;
    color: var(--gold-light);
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 2px;
  }
  @media(min-width:480px) { .co-item-price { font-size: 14px; } }

  /* ── ADDRESS DISPLAY ── */
  .co-address-display {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 13px;
    color: var(--text-sub);
    line-height: 1.6;
  }

  /* ── ADDRESS FORM ── */
  .co-form-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .co-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .co-input::placeholder { color: var(--text-muted); }
  .co-input:focus { border-color: var(--gold-border); }
  .co-select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%237a7570' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .co-select:focus { border-color: var(--gold-border); }
  .co-select option { background: #1c1c1c; color: var(--text); }
  .co-form-actions { display: flex; gap: 8px; margin-top: 4px; }
  .co-btn-save {
    flex: 1;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 11px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .co-btn-save:hover { background: var(--gold-light); }
  .co-btn-cancel {
    flex: 1;
    background: var(--surface3);
    color: var(--text-sub);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .co-btn-cancel:hover { border-color: var(--border-hover); color: var(--text); }

  /* ── BANK INFO ── */
  .co-bank-box {
    background: var(--blue-dim);
    border: 1px solid var(--blue-border);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 16px;
  }
  .co-bank-amount-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .co-bank-amount-label {
    font-size: 12px;
    color: var(--text-muted);
  }
  .co-bank-amount-val {
    font-size: 18px;
    font-weight: 700;
    color: var(--gold-light);
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.01em;
  }
  .co-bank-rows { display: flex; flex-direction: column; gap: 8px; }
  .co-bank-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
  }
  @media(min-width:400px) { .co-bank-row { font-size: 13px; } }
  .co-bank-row-label { color: var(--text-muted); flex-shrink: 0; }
  .co-bank-row-val {
    font-weight: 600;
    color: var(--text);
    text-align: right;
    word-break: break-all;
  }
  .co-bank-sep { height: 1px; background: var(--blue-border); margin: 8px 0; }

  /* Copy hint */
  .co-copy-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 10px;
  }

  /* ── RECEIPT UPLOAD ── */
  .co-receipt-label-text {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-sub);
    display: block;
    margin-bottom: 10px;
  }
  .co-file-upload-area {
    border: 1.5px dashed var(--border);
    border-radius: 12px;
    padding: 20px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: var(--surface2);
  }
  .co-file-upload-area:hover { border-color: var(--gold-border); background: var(--gold-dim); }
  .co-file-upload-area input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .co-upload-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--surface3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
  }
  .co-upload-text { font-size: 13px; color: var(--text-sub); margin-bottom: 4px; }
  .co-upload-sub { font-size: 11px; color: var(--text-muted); }

  .co-receipt-preview {
    margin-top: 12px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--surface2);
    border: 1px solid var(--border);
    position: relative;
  }
  .co-receipt-preview img {
    width: 100%;
    max-height: 180px;
    object-fit: contain;
    display: block;
  }
  .co-receipt-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
    padding: 9px;
    background: none;
    border: none;
    border-top: 1px solid var(--red-border);
    color: var(--red);
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .co-receipt-remove:hover { background: var(--red-dim); }

  /* ── CONFIRMATION CHECKBOXES ── */
  .co-checks-list { display: flex; flex-direction: column; gap: 12px; }
  .co-check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 11px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .co-check-item:hover { border-color: var(--gold-border); background: var(--gold-dim); }
  .co-check-item.checked { border-color: var(--gold-border); background: var(--gold-dim); }
  .co-checkbox {
    width: 17px; height: 17px;
    accent-color: var(--gold);
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .co-check-text {
    font-size: 12px;
    color: var(--text-sub);
    line-height: 1.55;
  }
  @media(min-width:480px) { .co-check-text { font-size: 13px; } }
  .co-check-text a { color: var(--gold); text-decoration: none; font-weight: 500; }
  .co-check-text a:hover { text-decoration: underline; }

  /* ── ORDER SUMMARY SIDEBAR ── */
  .co-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
  }
  @media(min-width:1024px) {
    .co-summary { position: sticky; top: 24px; }
  }
  .co-summary-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .co-summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .co-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .co-summary-label { font-size: 12px; color: var(--text-muted); }
  .co-summary-val { font-size: 13px; color: var(--text); font-weight: 500; }
  .co-summary-sep { height: 1px; background: var(--border); margin: 4px 0 14px; }
  .co-summary-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .co-summary-total-label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
  }
  .co-summary-total-val {
    font-size: 22px;
    font-weight: 700;
    color: var(--gold-light);
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.01em;
  }

  /* Place Order Button */
  .co-btn-place {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 13px;
    padding: 15px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.25);
    -webkit-tap-highlight-color: transparent;
    min-height: 52px;
  }
  .co-btn-place:hover:not(:disabled) {
    background: var(--gold-light);
    box-shadow: 0 6px 30px rgba(201,168,76,0.4);
  }
  .co-btn-place:active:not(:disabled) { transform: scale(0.99); }
  .co-btn-place:disabled {
    background: var(--surface3);
    color: var(--text-muted);
    cursor: not-allowed;
    box-shadow: none;
  }

  .co-secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 12px;
  }

  /* Trust badges in summary */
  .co-trust-list {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .co-trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }
  .co-trust-item span:first-child { font-size: 13px; flex-shrink: 0; }

  /* ── MOBILE STICKY BAR ── */
  .co-sticky-bar {
    display: block;
    position: fixed;
    bottom: var(--nav-height);
    left: 0; right: 0;
    background: rgba(8,8,8,0.97);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid var(--border);
    padding: 10px 14px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    z-index: 100;
  }
  @media(min-width:1024px) { .co-sticky-bar { display: none; } }
  .co-sticky-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
  }
  .co-sticky-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px; }
  .co-sticky-val { font-size: 16px; font-weight: 700; color: var(--gold-light); letter-spacing: -0.01em; font-family: 'Outfit', sans-serif; }
  .co-btn-place-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 11px;
    padding: 12px 22px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 4px 16px rgba(201,168,76,0.28);
  }
  .co-btn-place-mobile:hover:not(:disabled) { background: var(--gold-light); }
  .co-btn-place-mobile:active:not(:disabled) { transform: scale(0.97); }
  .co-btn-place-mobile:disabled { background: var(--surface3); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }

  /* ── BLINK ERROR ── */
  @keyframes blink {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.7); }
    50%       { box-shadow: 0 0 0 5px rgba(201,168,76,0); }
  }
  .blink-error {
    animation: blink 1.5s ease-in-out 2;
  }

  /* Processing spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .co-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* Section number badge */
  .co-section-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    font-size: 10px;
    font-weight: 700;
    color: var(--gold);
    flex-shrink: 0;
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  const allowedCountries = [
    'Sri Lanka','United Arab Emirates','Bahrain','Egypt','Iran','Iraq','Jordan',
    'Kuwait','Lebanon','Oman','Palestine','Qatar','Saudi Arabia','Syria','Turkey',
    'Yemen','India','Maldives','Bangladesh','Pakistan','Nepal','Bhutan','Myanmar',
    'Afghanistan','Kazakhstan','Turkmenistan','Uzbekistan','Azerbaijan','Georgia','Armenia'
  ];

  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    province: '',
    country: 'Sri Lanka'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const bankInfo = {
    accountNumber: '0010501838001',
    accountName: 'Happy Time (PVT) LTD',
    bankName: 'Amana Bank',
    branch: 'Pettah Branch'
  };

  const receiptInputRef = useRef(null);
  const addressCheckboxRef = useRef(null);
  const receiptCheckboxRef = useRef(null);
  const termsCheckboxRef = useRef(null);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    const { selectedItems, cartItems: items } = location.state || {};
    if (!selectedItems || !items || items.length === 0) {
      toast.error('No items selected for checkout');
      navigate('/cart');
      return;
    }
    setCartItems(items);
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const token = getCustomerToken();
      const customerRes = await fetch(`${API_URL}/api/customers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customerData = await customerRes.json();
      if (customerData.success) {
        setCustomerInfo(customerData.data);
        const savedCountry = customerData.data.country;
        const countryToUse = allowedCountries.includes(savedCountry) ? savedCountry : 'Sri Lanka';
        setDeliveryAddress({
          address: customerData.data.address || '',
          city: customerData.data.city || '',
          province: customerData.data.province || '',
          country: countryToUse
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer information');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const getMaxAvailableQuantity = (productId, selectedColor) => {
    const item = cartItems.find(item =>
      item.productId._id === productId && item.selectedColor === selectedColor
    );
    if (!item || !item.productId) return 0;
    const colorEntry = item.productId.colors?.find(color => color.name === selectedColor);
    if (colorEntry?.quantity == null) return Infinity;
    return colorEntry.quantity;
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload JPG, PNG, or PDF files only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setReceiptConfirmed(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));
  };

  const saveAddress = () => {
    if (!deliveryAddress.address.trim() || !deliveryAddress.city.trim() || !deliveryAddress.province.trim()) {
      toast.error('Please fill in all address fields');
      return;
    }
    setIsEditingAddress(false);
    setAddressConfirmed(false);
    toast.success('Delivery address updated');
  };

  const cancelAddressEdit = () => {
    if (customerInfo) {
      const savedCountry = customerInfo.country;
      const countryToUse = allowedCountries.includes(savedCountry) ? savedCountry : 'Sri Lanka';
      setDeliveryAddress({
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        province: customerInfo.province || '',
        country: countryToUse
      });
    }
    setIsEditingAddress(false);
  };

  const validateOrder = () => {
    document.querySelectorAll('.blink-error').forEach(el => el.classList.remove('blink-error'));

    if (!receiptFile) {
      toast.error('Please upload a bank transfer receipt');
      if (receiptInputRef.current) {
        receiptInputRef.current.classList.add('blink-error');
        receiptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (!addressConfirmed) {
      toast.error('Please confirm your delivery address is correct');
      if (addressCheckboxRef.current) {
        addressCheckboxRef.current.classList.add('blink-error');
        addressCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (!receiptConfirmed) {
      toast.error('Please confirm your payment receipt is correct');
      if (receiptCheckboxRef.current) {
        receiptCheckboxRef.current.classList.add('blink-error');
        receiptCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (!termsAccepted) {
      toast.error('Please accept our Terms and Conditions');
      if (termsCheckboxRef.current) {
        termsCheckboxRef.current.classList.add('blink-error');
        termsCheckboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    const hasSufficientStock = cartItems.every(item => {
      const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
      return maxAvailable === Infinity || item.quantity <= maxAvailable;
    });
    if (!hasSufficientStock) {
      toast.error('Some items are out of stock. Please update your cart.');
      return false;
    }
    if (!allowedCountries.includes(deliveryAddress.country)) {
      toast.error('Selected country is not supported for delivery');
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateOrder()) return;
    setIsProcessing(true);
    try {
      const token = getCustomerToken();
      const formData = new FormData();
      const items = cartItems.map(item => ({
        productId: item.productId._id,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.productId.price
      }));
      formData.append('items', JSON.stringify(items));
      formData.append('totalAmount', total.toString());
      formData.append('receipt', receiptFile);
      formData.append('deliveryAddress', JSON.stringify(deliveryAddress));
      const selectedItemIds = location.state?.selectedItems || [];
      formData.append('cartItemIds', JSON.stringify(selectedItemIds));
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order placed successfully!', { autoClose: 3000 });
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0
  );
  const formatPrice = (p) => p == null ? 'Contact' : `LKR ${p.toLocaleString()}`;
  const formatAddress = (a) => {
    if (!a) return 'Address not provided';
    const parts = [a.address, a.city, a.province, a.country].filter(Boolean);
    return parts.join(', ') || 'Address not provided';
  };

  if (loading) return <Loading message="Loading checkout..." size="large" />;

  // Step states (visual only, based on form completion)
  const stepItems = true;
  const stepAddress = !!deliveryAddress.address && !!deliveryAddress.city;
  const stepPayment = !!receiptFile;

  return (
    <>
      <style>{styles}</style>

      <div className="co-root">
        <Helmet>
          <title>Checkout – Happy Time</title>
          <meta name="description" content="Complete your purchase securely at Happy Time. Review your order, upload payment receipt, and place your order." />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href="https://happytimeonline.com/checkout" />
          <meta property="og:title" content="Checkout – Happy Time" />
          <meta property="og:description" content="Complete your purchase securely at Happy Time." />
          <meta property="og:url" content="https://happytimeonline.com/checkout" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Checkout – Happy Time" />
          <meta name="twitter:description" content="Complete your purchase securely at Happy Time." />
          <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
        </Helmet>

        <ScrollToTop />

        <div className="co-wrapper">

          {/* ── HEADER ── */}
          <div className="co-header">
            <button className="co-back-btn" onClick={() => navigate('/cart')} aria-label="Back to cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="co-header-text">
              <span className="co-eyebrow">Secure Order</span>
              <h1 className="co-title">Check<em>out</em></h1>
            </div>
          </div>

          {/* ── PROGRESS STEPS ── */}
          <div className="co-steps">
            <div className="co-step">
              <div className={`co-step-dot ${stepItems ? 'done' : 'active'}`}>
                {stepItems ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : '1'}
              </div>
              <span className={`co-step-label ${stepItems ? 'done' : 'active'}`}>Items</span>
            </div>
            <div className={`co-step-line ${stepItems ? 'done' : ''}`} />
            <div className="co-step">
              <div className={`co-step-dot ${stepAddress ? 'done' : stepItems ? 'active' : 'pending'}`}>
                {stepAddress ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : '2'}
              </div>
              <span className={`co-step-label ${stepAddress ? 'done' : stepItems ? 'active' : 'pending'}`}>Address</span>
            </div>
            <div className={`co-step-line ${stepAddress ? 'done' : ''}`} />
            <div className="co-step">
              <div className={`co-step-dot ${stepPayment ? 'done' : stepAddress ? 'active' : 'pending'}`}>
                {stepPayment ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : '3'}
              </div>
              <span className={`co-step-label ${stepPayment ? 'done' : stepAddress ? 'active' : 'pending'}`}>Payment</span>
            </div>
            <div className={`co-step-line ${stepPayment ? 'done' : ''}`} />
            <div className="co-step">
              <div className={`co-step-dot ${addressConfirmed && receiptConfirmed && termsAccepted ? 'done' : 'pending'}`}>
                {addressConfirmed && receiptConfirmed && termsAccepted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : '4'}
              </div>
              <span className={`co-step-label ${addressConfirmed && receiptConfirmed && termsAccepted ? 'done' : 'pending'}`}>Confirm</span>
            </div>
          </div>

          {/* ── MAIN LAYOUT ── */}
          <div className="co-layout">

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* 1. Order Items */}
              <div className="co-card">
                <div className="co-card-header">
                  <h2 className="co-card-title">
                    <div className="co-card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    Order Items
                  </h2>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="co-items-list">
                  {cartItems.map(item => (
                    <div key={item._id} className="co-order-item">
                      <img
                        src={item.productId?.images?.[0]}
                        alt={item.productId?.title}
                        className="co-item-img"
                      />
                      <div className="co-item-info">
                        <span className="co-item-brand">{item.productId?.brand}</span>
                        <span className="co-item-title">{item.productId?.title}</span>
                        <div className="co-item-meta">
                          <div className="co-item-meta-dot" />
                          {item.selectedColor}
                          <span style={{ color: 'var(--border)', margin: '0 2px' }}>·</span>
                          Qty {item.quantity}
                        </div>
                      </div>
                      <span className="co-item-price">
                        {formatPrice(item.productId?.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="co-card">
                <div className="co-card-header">
                  <h2 className="co-card-title">
                    <div className="co-card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Delivery Address
                  </h2>
                  {!isEditingAddress && (
                    <button className="co-edit-btn" onClick={() => setIsEditingAddress(true)}>
                      Edit
                    </button>
                  )}
                </div>

                {!isEditingAddress ? (
                  <div className="co-address-display">
                    {formatAddress(deliveryAddress)}
                  </div>
                ) : (
                  <div className="co-form-grid">
                    <input
                      type="text"
                      placeholder="Street Address *"
                      value={deliveryAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="co-input"
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="co-input"
                    />
                    <input
                      type="text"
                      placeholder="Province / State *"
                      value={deliveryAddress.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      className="co-input"
                    />
                    <select
                      value={deliveryAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="co-select"
                    >
                      {allowedCountries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    <div className="co-form-actions">
                      <button className="co-btn-save" onClick={saveAddress}>Save Address</button>
                      <button className="co-btn-cancel" onClick={cancelAddressEdit}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Payment / Bank Transfer */}
              <div className="co-card">
                <div className="co-card-header">
                  <h2 className="co-card-title">
                    <div className="co-card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    Bank Transfer
                  </h2>
                </div>

                {/* Bank info box */}
                <div className="co-bank-box">
                  <div className="co-bank-amount-row">
                    <span className="co-bank-amount-label">Transfer exactly:</span>
                    <span className="co-bank-amount-val">LKR {total.toLocaleString()}</span>
                  </div>
                  <div className="co-bank-rows">
                    <div className="co-bank-row">
                      <span className="co-bank-row-label">Account Number</span>
                      <span className="co-bank-row-val">{bankInfo.accountNumber}</span>
                    </div>
                    <div className="co-bank-sep" />
                    <div className="co-bank-row">
                      <span className="co-bank-row-label">Account Name</span>
                      <span className="co-bank-row-val">{bankInfo.accountName}</span>
                    </div>
                    <div className="co-bank-sep" />
                    <div className="co-bank-row">
                      <span className="co-bank-row-label">Bank</span>
                      <span className="co-bank-row-val">{bankInfo.bankName}</span>
                    </div>
                    <div className="co-bank-sep" />
                    <div className="co-bank-row">
                      <span className="co-bank-row-label">Branch</span>
                      <span className="co-bank-row-val">{bankInfo.branch}</span>
                    </div>
                  </div>
                </div>

                {/* Receipt upload */}
                <span className="co-receipt-label-text">Upload Payment Receipt *</span>
                <div className="co-file-upload-area" ref={receiptInputRef}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptChange}
                  />
                  <div className="co-upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="co-upload-text">
                    {receiptFile ? receiptFile.name : 'Tap to upload receipt'}
                  </p>
                  <p className="co-upload-sub">JPG, PNG or PDF · max 5MB</p>
                </div>

                {receiptPreview && (
                  <div className="co-receipt-preview">
                    <img src={receiptPreview} alt="Receipt preview" />
                    <button
                      type="button"
                      className="co-receipt-remove"
                      onClick={() => {
                        setReceiptFile(null);
                        setReceiptPreview('');
                        setReceiptConfirmed(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Receipt
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Confirmation Checkboxes */}
              <div className="co-card">
                <div className="co-card-header">
                  <h2 className="co-card-title">
                    <div className="co-card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Confirm Order
                  </h2>
                </div>
                <div className="co-checks-list">
                  <label
                    ref={addressCheckboxRef}
                    className={`co-check-item${addressConfirmed ? ' checked' : ''}`}
                    onClick={() => setAddressConfirmed(v => !v)}
                  >
                    <input
                      type="checkbox"
                      className="co-checkbox"
                      checked={addressConfirmed}
                      onChange={(e) => setAddressConfirmed(e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="co-check-text">
                      I confirm that my delivery address is correct and complete.
                    </span>
                  </label>
                  <label
                    ref={receiptCheckboxRef}
                    className={`co-check-item${receiptConfirmed ? ' checked' : ''}`}
                    onClick={() => setReceiptConfirmed(v => !v)}
                  >
                    <input
                      type="checkbox"
                      className="co-checkbox"
                      checked={receiptConfirmed}
                      onChange={(e) => setReceiptConfirmed(e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="co-check-text">
                      I confirm that the payment receipt shows the correct amount and transaction details.
                    </span>
                  </label>
                  <label
                    ref={termsCheckboxRef}
                    className={`co-check-item${termsAccepted ? ' checked' : ''}`}
                    onClick={() => setTermsAccepted(v => !v)}
                  >
                    <input
                      type="checkbox"
                      className="co-checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="co-check-text">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" onClick={e => e.stopPropagation()}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" target="_blank" onClick={e => e.stopPropagation()}>Privacy Policy</a>.
                    </span>
                  </label>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: ORDER SUMMARY ── */}
            <div className="co-summary">
              <h3 className="co-summary-title">Order Summary</h3>

              <div className="co-summary-rows">
                <div className="co-summary-row">
                  <span className="co-summary-label">Items ({cartItems.length})</span>
                  <span className="co-summary-val">{formatPrice(total)}</span>
                </div>
                <div className="co-summary-row">
                  <span className="co-summary-label">Shipping</span>
                  <span className="co-summary-val" style={{ color: 'var(--green)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Free</span>
                </div>
              </div>

              <div className="co-summary-sep" />

              <div className="co-summary-total-row">
                <span className="co-summary-total-label">Total</span>
                <span className="co-summary-total-val">{formatPrice(total)}</span>
              </div>

              <button
                className="co-btn-place"
                onClick={placeOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="co-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Place Order
                  </>
                )}
              </button>

              <div className="co-secure-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                256-bit SSL encrypted checkout
              </div>

              <div className="co-trust-list">
                {[
                  { icon: '🔒', text: 'Secure bank transfer' },
                  { icon: '↩️', text: '7-day hassle-free returns' },
                  { icon: '✓',  text: 'Authentic products only' },
                  { icon: '📦', text: 'Tracked delivery' },
                ].map(({ icon, text }) => (
                  <div key={text} className="co-trust-item">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ──- MOBILE STICKY BAR -── */}
        <div className="co-sticky-bar">
          <div className="co-sticky-inner">
            <div>
              <p className="co-sticky-label">Total Amount</p>
              <p className="co-sticky-val">{formatPrice(total)}</p>
            </div>
            <button
              className="co-btn-place-mobile"
              onClick={placeOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="co-spinner" style={{ borderColor: 'rgba(150,150,150,0.3)', borderTopColor: 'var(--text-muted)' }} />
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default CheckoutPage;