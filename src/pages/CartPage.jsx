// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    --radius: 14px;
    --radius-lg: 20px;
    --shadow-gold: 0 0 32px rgba(201,168,76,0.1);
    /* Nav bar height — adjust if yours differs */
    --nav-height: 56px;
    /* Sticky checkout bar height */
    --sticky-bar-height: 72px;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .cart-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    /* Reserve space so content isn't hidden behind sticky bar + nav on mobile */
    padding-bottom: calc(var(--sticky-bar-height) + var(--nav-height) + 16px);
  }
  @media(min-width:768px) {
    .cart-root { padding-bottom: 0; }
  }

  /* ── WRAPPER ── */
  .cart-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 16px 12px 32px;
    width: 100%;
  }
  @media(min-width:480px)  { .cart-wrapper { padding: 20px 16px 40px; } }
  @media(min-width:640px)  { .cart-wrapper { padding: 28px 22px 48px; } }
  @media(min-width:1024px) { .cart-wrapper { padding: 44px 40px 72px; } }

  /* ── PAGE HEADER ── */
  .cart-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
    gap: 10px;
    flex-wrap: wrap;
  }
  .cart-eyebrow {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }
  .cart-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 5vw, 40px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--text);
    margin: 0;
  }
  .cart-title em { font-style: italic; color: var(--gold-light); }
  .cart-item-count {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    align-self: flex-end;
  }

  /* ── LAYOUT: single col on mobile, 2-col on desktop ── */
  .cart-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  @media(min-width:900px) {
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 28px;
      align-items: start;
    }
  }
  @media(min-width:1024px) {
    .cart-layout { grid-template-columns: 1fr 340px; }
  }

  /* ── SELECT ALL BAR ── */
  .select-all-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 10px;
  }
  .select-all-label {
    display: flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-sub);
    letter-spacing: 0.03em;
    user-select: none;
  }
  .cart-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--gold);
    cursor: pointer;
    flex-shrink: 0;
  }
  .clear-btn {
    font-size: 11px;
    font-weight: 500;
    color: var(--red);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 0;
    transition: opacity 0.2s;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .clear-btn:hover { opacity: 0.75; }

  /* ── CART ITEMS LIST ── */
  .cart-items-list { display: flex; flex-direction: column; gap: 10px; }

  /* ── CART ITEM CARD ── */
  .cart-item-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px;
    transition: border-color 0.25s;
    position: relative;
    overflow: hidden;
  }
  @media(min-width:480px) { .cart-item-card { padding: 14px; } }
  @media(min-width:640px) { .cart-item-card { padding: 16px; } }

  .cart-item-card.selected { border-color: var(--gold-border); }
  .cart-item-card.selected::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--gold);
    border-radius: 3px 0 0 3px;
  }
  .cart-item-card.out-of-stock { border-color: var(--red-border); opacity: 0.75; }
  .cart-item-card.unavailable {
    background: var(--red-dim);
    border-color: var(--red-border);
  }

  /* Unavailable item */
  .unavailable-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .unavailable-msg {
    font-size: 12px;
    color: var(--red);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* Item inner layout */
  .cart-item-inner {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  @media(min-width:480px) { .cart-item-inner { gap: 12px; } }
  @media(min-width:640px) { .cart-item-inner { gap: 14px; } }

  /* Checkbox column */
  .item-check-col {
    display: flex;
    align-items: flex-start;
    padding-top: 3px;
    flex-shrink: 0;
  }

  /* Image */
  .item-img-wrap {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--surface2);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media(min-width:400px) { .item-img-wrap { width: 80px; height: 80px; } }
  @media(min-width:480px) { .item-img-wrap { width: 88px; height: 88px; } }
  @media(min-width:640px) { .item-img-wrap { width: 100px; height: 100px; } }
  .item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Details */
  .item-details { flex: 1; min-width: 0; }
  .item-brand {
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    display: block;
    margin-bottom: 3px;
  }
  .item-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    display: block;
  }
  @media(min-width:400px) { .item-title { font-size: 13px; } }
  @media(min-width:480px) { .item-title { font-size: 14px; } }

  .item-color-row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 3px;
  }
  .item-color-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold-border);
    border: 1px solid var(--gold-border);
    flex-shrink: 0;
  }
  .item-color-text { font-size: 11px; color: var(--text-muted); }
  .item-stock {
    font-size: 10px;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
    display: block;
    text-transform: uppercase;
    font-weight: 500;
  }
  .item-stock.in-stock { color: var(--green); }
  .item-stock.low-stock { color: var(--gold); }
  .item-stock.out  { color: var(--red); }

  /* Bottom row: qty + price — stack on very small, row on larger */
  .item-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: nowrap;
  }

  /* Quantity control */
  .qty-control {
    display: flex;
    align-items: center;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 9px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .qty-btn {
    width: 30px; height: 30px;
    background: var(--surface3);
    border: none;
    color: var(--text);
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
    font-weight: 300;
    line-height: 1;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  @media(min-width:400px) { .qty-btn { width: 32px; height: 32px; } }
  .qty-btn:hover:not(:disabled) { background: var(--gold-dim); color: var(--gold); }
  .qty-btn:active:not(:disabled) { background: rgba(201,168,76,0.2); }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-input {
    width: 32px; height: 30px;
    background: var(--surface2);
    border: none;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    color: var(--text);
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    outline: none;
    -moz-appearance: textfield;
  }
  @media(min-width:400px) { .qty-input { width: 34px; height: 32px; font-size: 13px; } }
  .qty-input::-webkit-inner-spin-button,
  .qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

  /* Price + remove */
  .item-price-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  .item-price {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  @media(min-width:400px) { .item-price { font-size: 14px; } }
  @media(min-width:480px) { .item-price { font-size: 15px; } }
  .item-remove {
    font-size: 10px;
    color: var(--red);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0;
    transition: opacity 0.2s;
    -webkit-tap-highlight-color: transparent;
    font-weight: 500;
    white-space: nowrap;
  }
  .item-remove:hover { opacity: 0.7; }

  /* Out of stock warning */
  .oos-warning {
    margin-top: 10px;
    padding: 8px 12px;
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    color: var(--red);
    line-height: 1.4;
  }

  /* ── ORDER SUMMARY (sidebar / mobile inline) ── */
  .order-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    /* On mobile: shown inline below items, no sticky */
  }
  @media(min-width:900px) {
    .order-summary {
      padding: 20px;
      position: sticky;
      top: 20px;
    }
  }

  .summary-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }
  .summary-row:last-of-type { margin-bottom: 0; }
  .summary-label { font-size: 12px; color: var(--text-muted); }
  .summary-val   { font-size: 13px; color: var(--text); font-weight: 500; }
  .summary-sep { height: 1px; background: var(--border); margin: 14px 0; }
  .summary-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .summary-total-label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
  }
  .summary-total-val {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gold-light);
    letter-spacing: -0.01em;
  }

  /* Checkout button */
  .btn-checkout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 12px;
    padding: 15px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.25);
    -webkit-tap-highlight-color: transparent;
    min-height: 52px;
  }
  .btn-checkout:hover:not(:disabled) { background: var(--gold-light); box-shadow: 0 6px 28px rgba(201,168,76,0.35); }
  .btn-checkout:active:not(:disabled) { transform: scale(0.99); }
  .btn-checkout:disabled { background: var(--surface3); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }

  /* Secondary buttons */
  .secondary-btns {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  /* Hide the left-column secondary buttons on desktop (summary has its own) */
  .items-col .secondary-btns {
    display: none;
  }
  @media(min-width:900px) {
    .items-col .secondary-btns { display: flex; }
  }

  .btn-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--surface2);
    color: var(--text-sub);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .btn-secondary:hover { border-color: var(--border-hover); color: var(--gold); background: var(--surface3); }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 20px;
  }
  .empty-icon { font-size: 52px; margin-bottom: 14px; }
  .empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 400;
    color: var(--text);
    margin-bottom: 8px;
  }
  .empty-title em { font-style: italic; color: var(--gold-light); }
  .empty-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 22px; line-height: 1.65; }
  .btn-browse {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 13px 28px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(201,168,76,0.2);
    -webkit-tap-highlight-color: transparent;
  }
  .btn-browse:hover { background: var(--gold-light); box-shadow: 0 6px 24px rgba(201,168,76,0.3); }

  /* ── MOBILE STICKY BAR ── */
  /*
    Sits just above the bottom nav bar.
    Uses var(--nav-height) so you only need to change it in one place.
  */
  .mobile-sticky-bar {
    display: block;
    position: fixed;
    bottom: var(--nav-height);
    left: 0;
    right: 0;
    background: rgba(8,8,8,0.97);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid var(--border);
    padding: 10px 14px;
    z-index: 100;
    /* Safe-area inset for notched phones — no effect on regular phones */
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  }
  @media(min-width:768px) { .mobile-sticky-bar { display: none; } }

  .sticky-bar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
  }
  .sticky-total-label {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .sticky-total-val {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gold-light);
    letter-spacing: -0.01em;
  }
  .btn-checkout-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: var(--gold);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 12px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 4px 16px rgba(201,168,76,0.28);
    flex-shrink: 0;
  }
  .btn-checkout-mobile:hover:not(:disabled) { background: var(--gold-light); }
  .btn-checkout-mobile:active:not(:disabled) { transform: scale(0.97); }
  .btn-checkout-mobile:disabled { background: var(--surface3); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }

  /* ── MISC ── */
  .error-msg { color: var(--red); font-size: 13px; margin-bottom: 14px; }

  input[type="checkbox"].cart-checkbox { cursor: pointer; border-radius: 4px; }

  /* Trust micro-badges */
  .trust-badges {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .trust-badge-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--text-muted);
  }
  .trust-badge-item span:first-child { font-size: 13px; }
`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCart = async () => {
    if (!isCustomerAuthenticated()) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    try {
      const token = getCustomerToken();
      const cartRes = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartData = await cartRes.json();
      if (cartData.success) {
        const items = cartData.cart || [];
        setCartItems(items);
        const inStockIds = items
          .filter(item => {
            if (!item.productId) return false;
            return getMaxAvailableQuantityFromItems(items, item.productId._id, item.selectedColor) > 0;
          })
          .map(item => item._id);
        setSelectedItems(new Set(inStockIds));
      } else {
        setError(cartData.message || 'Failed to load cart');
      }
    } catch (err) {
      console.error(err);
      customerLogout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const getMaxAvailableQuantityFromItems = (items, productId, selectedColor) => {
    if (!productId) return 0;
    const item = items.find(i => i.productId?._id === productId && i.selectedColor === selectedColor);
    if (!item || !item.productId) return 0;
    const colorEntry = item.productId.colors?.find(c => c.name === selectedColor);
    if (colorEntry?.quantity == null) return Infinity;
    return colorEntry.quantity;
  };

  const getMaxAvailableQuantity = (productId, selectedColor) => {
    return getMaxAvailableQuantityFromItems(cartItems, productId, selectedColor);
  };

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;
    const item = cartItems.find(i => i._id === itemId);
    if (!item || !item.productId) { toast.error('Item is no longer available'); return; }
    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
    if (maxAvailable !== Infinity && qty > maxAvailable) {
      toast.error(`Only ${maxAvailable} units available for this color`);
      return;
    }
    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        toast.success('Quantity updated');
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch { toast.error('Failed to update quantity'); }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      const token = getCustomerToken();
      await fetch(`${API_URL}/api/cart/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(items => items.filter(i => i._id !== id));
      setSelectedItems(prev => { const s = new Set(prev); s.delete(id); return s; });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Item removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear your cart?')) return;
    try {
      const token = getCustomerToken();
      await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
      setSelectedItems(new Set());
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Cart cleared');
    } catch { toast.error('Failed to clear cart'); }
  };

  const toggleSelectItem = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item || !item.productId) { toast.error('Item is no longer available'); return; }
    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
    if (maxAvailable === 0) { toast.error('Cannot select out of stock items'); return; }
    setSelectedItems(prev => {
      const s = new Set(prev);
      if (s.has(itemId)) s.delete(itemId); else s.add(itemId);
      return s;
    });
  };

  const toggleSelectAll = () => {
    const inStockItems = cartItems.filter(item =>
      item.productId && getMaxAvailableQuantity(item.productId._id, item.selectedColor) > 0
    );
    if (selectedItems.size === inStockItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(inStockItems.map(item => item._id)));
    }
  };

  const proceedToCheckout = () => {
    if (selectedItems.size === 0) { toast.error('Please select at least one item'); return; }
    const selectedCartItems = cartItems.filter(item => selectedItems.has(item._id));
    for (const item of selectedCartItems) {
      if (!item.productId) { toast.error('Some items are no longer available'); return; }
      const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
      if (maxAvailable !== Infinity && item.quantity > maxAvailable) {
        toast.error(`Insufficient stock for ${item.productId.title}`); return;
      }
    }
    navigate('/checkout', {
      state: { selectedItems: Array.from(selectedItems), cartItems: selectedCartItems }
    });
  };

  const handleQuantityInputChange = (itemId, value) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item || !item.productId) return;
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) { if (value === '') updateQuantity(itemId, 1); return; }
    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
    const clamped = Math.max(1, Math.min(numValue, maxAvailable !== Infinity ? maxAvailable : 999));
    updateQuantity(itemId, clamped);
  };

  const handleQuantityInputFocus = (e) => e.target.select();

  const selectedTotal = cartItems
    .filter(item => selectedItems.has(item._id))
    .reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  const formatPrice = (p) => p == null ? 'Contact' : `LKR ${p.toLocaleString()}`;

  const getStockStatus = (productId, selectedColor) => {
    const maxQty = getMaxAvailableQuantity(productId, selectedColor);
    if (maxQty === Infinity) return { label: 'In Stock', cls: 'in-stock' };
    if (maxQty === 0) return { label: 'Out of Stock', cls: 'out' };
    if (maxQty <= 3) return { label: `${maxQty} left`, cls: 'low-stock' };
    return { label: `${maxQty} available`, cls: 'in-stock' };
  };

  if (loading) return <Loading message="Loading your cart..." size="large" />;

  const inStockCount = cartItems.filter(item =>
    item.productId && getMaxAvailableQuantity(item.productId._id, item.selectedColor) > 0
  ).length;

  const trustBadges = [
    { icon: '🔒', text: 'Secure checkout' },
    { icon: '↩️', text: '7-day hassle-free returns' },
    { icon: '✓', text: 'Authentic products' },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="cart-root">
        <Helmet>
          <title>Shopping Cart – Happy Time</title>
          <meta name="description" content="Review your selected items and proceed to checkout securely at Happy Time." />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href="https://happytimeonline.com/cart" />
          <meta property="og:title" content="Shopping Cart – Happy Time" />
          <meta property="og:description" content="Review your selected items and proceed to checkout." />
          <meta property="og:url" content="https://happytimeonline.com/cart" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://happytimeonline.com/ogimage.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Shopping Cart – Happy Time" />
          <meta name="twitter:description" content="Review your selected items and proceed to checkout." />
          <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png" />
        </Helmet>

        <ScrollToTop />

        <div className="cart-wrapper">
          {/* ── HEADER ── */}
          <div className="cart-header">
            <div className="cart-header-left">
              <span className="cart-eyebrow">Your Selection</span>
              <h1 className="cart-title">Shopping <em>Cart</em></h1>
            </div>
            <span className="cart-item-count">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {/* ── EMPTY STATE ── */}
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h2 className="empty-title">Your cart is <em>empty</em></h2>
              <p className="empty-sub">Add items from our collection to see them here.</p>
              <button className="btn-browse" onClick={() => navigate('/shop')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m7-7-7 7 7 7" />
                </svg>
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="cart-layout">

              {/* ── LEFT: ITEMS ── */}
              <div className="items-col">
                {/* Select all bar */}
                <div className="select-all-bar">
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      className="cart-checkbox"
                      checked={selectedItems.size === inStockCount && inStockCount > 0}
                      onChange={toggleSelectAll}
                    />
                    Select All
                    <span style={{ color: 'var(--text-muted)', fontWeight: 300, fontSize: 11 }}>
                      ({inStockCount} available)
                    </span>
                  </label>
                  <button className="clear-btn" onClick={clearCart}>
                    Clear All
                  </button>
                </div>

                {/* Items */}
                <div className="cart-items-list">
                  {cartItems.map(item => {
                    if (!item.productId) {
                      return (
                        <div key={item._id} className="cart-item-card unavailable">
                          <div className="unavailable-row">
                            <span className="unavailable-msg">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              This item is no longer available
                            </span>
                            <button className="item-remove" onClick={() => removeItem(item._id)}>Remove</button>
                          </div>
                        </div>
                      );
                    }

                    const maxAvailable = getMaxAvailableQuantity(item.productId._id, item.selectedColor);
                    const isOutOfStock = maxAvailable === 0;
                    const canIncrease = maxAvailable === Infinity || item.quantity < maxAvailable;
                    const isSelected = selectedItems.has(item._id);
                    const stock = getStockStatus(item.productId._id, item.selectedColor);

                    return (
                      <div
                        key={item._id}
                        className={`cart-item-card${isSelected ? ' selected' : ''}${isOutOfStock ? ' out-of-stock' : ''}`}
                      >
                        <div className="cart-item-inner">
                          {/* Checkbox */}
                          <div className="item-check-col">
                            <input
                              type="checkbox"
                              className="cart-checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(item._id)}
                              disabled={isOutOfStock}
                            />
                          </div>

                          {/* Image */}
                          <div className="item-img-wrap">
                            <img
                              src={item.productId.images?.[0]}
                              alt={item.productId.title}
                              className="item-img"
                            />
                          </div>

                          {/* Details */}
                          <div className="item-details">
                            <span className="item-brand">{item.productId.brand}</span>
                            <span className="item-title">{item.productId.title}</span>

                            <div className="item-color-row">
                              <div className="item-color-dot" />
                              <span className="item-color-text">{item.selectedColor}</span>
                            </div>

                            <span className={`item-stock ${stock.cls}`}>{stock.label}</span>

                            {/* Qty + Price */}
                            <div className="item-bottom-row">
                              <div className="qty-control">
                                <button
                                  className="qty-btn"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >−</button>
                                <input
                                  type="number"
                                  className="qty-input"
                                  min="1"
                                  max={maxAvailable !== Infinity ? maxAvailable : 999}
                                  value={item.quantity}
                                  onChange={e => handleQuantityInputChange(item._id, e.target.value)}
                                  onFocus={handleQuantityInputFocus}
                                />
                                <button
                                  className="qty-btn"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={!canIncrease || isOutOfStock}
                                >+</button>
                              </div>

                              <div className="item-price-col">
                                <span className="item-price">{formatPrice(item.productId.price)}</span>
                                <button className="item-remove" onClick={() => removeItem(item._id)}>Remove</button>
                              </div>
                            </div>

                            {/* OOS warning */}
                            {isOutOfStock && (
                              <div className="oos-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Currently out of stock — cannot be selected for checkout
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop-only secondary buttons below items list */}
                <div className="secondary-btns">
                  <button className="btn-secondary" onClick={() => navigate('/shop')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/orders')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </button>
                </div>
              </div>

              {/* ── RIGHT / BOTTOM: ORDER SUMMARY ── */}
              {/* On mobile this renders below the items list (normal flow).
                  On desktop (≥900px) it becomes the sticky sidebar via grid. */}
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                  <span className="summary-label">Items selected</span>
                  <span className="summary-val">{selectedItems.size} of {cartItems.length}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-val">{formatPrice(selectedTotal)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-val" style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Calculated at checkout</span>
                </div>

                <div className="summary-sep" />

                <div className="summary-total-row">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-val">{formatPrice(selectedTotal)}</span>
                </div>

                {/* Show checkout button inside summary only on desktop */}
                <button
                  className="btn-checkout"
                  onClick={proceedToCheckout}
                  disabled={selectedItems.size === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </button>

                <div className="secondary-btns">
                  <button className="btn-secondary" onClick={() => navigate('/shop')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/orders')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </button>
                </div>

                <div className="trust-badges">
                  {trustBadges.map(({ icon, text }) => (
                    <div key={text} className="trust-badge-item">
                      <span>{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── MOBILE STICKY BOTTOM BAR ── */}
        {cartItems.length > 0 && (
          <div className="mobile-sticky-bar">
            <div className="sticky-bar-inner">
              <div>
                <p className="sticky-total-label">
                  Total · {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'}
                </p>
                <p className="sticky-total-val">{formatPrice(selectedTotal)}</p>
              </div>
              <button
                className="btn-checkout-mobile"
                onClick={proceedToCheckout}
                disabled={selectedItems.size === 0}
              >
                Checkout
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;