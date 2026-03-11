// src/pages/ShopPage.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Loading from "../components/Loading";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const filterRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = {
    productType: searchParams.get("productType") || "all",
    gender: searchParams.get("gender") || "all",
    brand: searchParams.get("brand") || "all",
    shape: searchParams.get("shape") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    color: searchParams.get("color") || "all",
  };

  const [filters, setFilters] = useState(initialFilters);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getUniqueBrands = () => {
    const allBrands = [...new Set(products.map((p) => p.brand))];
    const customBrands = ["Winsor", "Orix", "Arial"];
    const customBrandSet = new Set(customBrands);
    const otherBrands = allBrands.filter((brand) => !customBrandSet.has(brand));
    return [
      ...customBrands.filter((brand) => allBrands.includes(brand)),
      ...otherBrands.sort(),
    ];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const getUniqueShapes = () => [...new Set(products.map((p) => p.watchShape))];

  const getUniqueColors = () => {
    const allColors = products.flatMap((p) => {
      if (!p.colors || !Array.isArray(p.colors)) return [];
      return p.colors
        .map((color) => {
          if (typeof color === "object" && color.name) return color.name;
          if (typeof color === "string") return color;
          return null;
        })
        .filter(Boolean);
    });
    return [...new Set(allColors)].sort();
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "Contact for Price";
    return `LKR ${price.toLocaleString()}`;
  };

  const getGenderDisplay = (gender, productType) => {
    if (productType === "wall_clock") return "Wall Clock";
    switch (gender) {
      case "men": return "Men";
      case "women": return "Women";
      case "kids": return "Kids";
      case "unisex": return "Unisex";
      default: return "Unisex";
    }
  };

  const getGenderBadgeClass = (gender, productType) => {
    if (productType === "wall_clock") return "gender-badge wall-clock";
    switch (gender) {
      case "men": return "gender-badge men";
      case "women": return "gender-badge women";
      case "kids": return "gender-badge kids";
      default: return "gender-badge unisex";
    }
  };

  const getProductColors = (product) => {
    if (!product.colors || !Array.isArray(product.colors)) return [];
    return product.colors
      .map((color) => {
        if (typeof color === "object" && color.name) return { name: color.name, quantity: color.quantity || null };
        if (typeof color === "string") return { name: color, quantity: null };
        return null;
      })
      .filter(Boolean);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (filters.productType !== "all") params.productType = filters.productType;
    if (filters.gender !== "all" && filters.productType !== "wall_clock") params.gender = filters.gender;
    if (filters.brand !== "all") params.brand = filters.brand;
    if (filters.shape !== "all") params.shape = filters.shape;
    if (filters.color !== "all") params.color = filters.color;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (sortBy !== "featured") params.sortBy = sortBy;
    setSearchParams(params, { replace: true });
  }, [filters, searchQuery, sortBy, setSearchParams]);

  useEffect(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.modelNumber && p.modelNumber.toLowerCase().includes(query))
      );
    }
    if (filters.productType !== "all") result = result.filter((p) => p.productType === filters.productType);
    if (filters.gender !== "all") result = result.filter((p) => p.productType !== "wall_clock" && p.gender === filters.gender);
    if (filters.brand !== "all") result = result.filter((p) => p.brand === filters.brand);
    if (filters.shape !== "all") result = result.filter((p) => p.watchShape === filters.shape);
    if (filters.color !== "all") {
      result = result.filter((p) => {
        if (!p.colors || !Array.isArray(p.colors)) return false;
        return p.colors.some((color) => {
          if (typeof color === "object" && color.name) return color.name === filters.color;
          if (typeof color === "string") return color === filters.color;
          return false;
        });
      });
    }
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      result = result.filter((p) => {
        if (!p.price) return filters.minPrice === "" && filters.maxPrice === "";
        return p.price >= min && p.price <= max;
      });
    }
    result = sortProducts(result, sortBy);
    setFilteredProducts(result);
  }, [filters, products, searchQuery, sortBy]);

  const sortProducts = (products, sortBy) => {
    switch (sortBy) {
      case "price-low-high": return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high-low": return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest": return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return [...products].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductTypeChange = (e) => {
    const productType = e.target.value;
    setFilters((prev) => ({
      ...prev,
      productType,
      gender: productType === "wall_clock" ? "all" : prev.gender,
    }));
  };

  const resetFilters = () => {
    setFilters({ productType: "all", gender: "all", brand: "all", shape: "all", minPrice: "", maxPrice: "", color: "all" });
    setSearchQuery("");
    setSortBy("featured");
  };

  const handlePriceChange = (type, value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setFilters((prev) => ({ ...prev, [type]: value }));
    }
  };

  const brandLogos = {
    Winsor: "/winsor.png",
    Orix: "/OrixBrand.webp",
    Arial: "/ArielBrand.webp",
  };

  const hasActiveFilters =
    filters.productType !== "all" ||
    filters.gender !== "all" ||
    filters.brand !== "all" ||
    filters.shape !== "all" ||
    filters.color !== "all" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    searchQuery !== "";

  const FilterContent = ({ onClose }) => (
    <div className="filter-content">
      {/* Brand Logos */}
      <div className="filter-section brand-section">
        <h4 className="filter-section-title">Premium Brands</h4>
        <div className="brand-logos-grid">
          {Object.entries(brandLogos).map(([brand, logo]) => (
            <button
              key={brand}
              onClick={() => {
                setFilters((prev) => ({ ...prev, brand: prev.brand === brand ? "all" : brand }));
                if (onClose) onClose();
              }}
              className={`brand-logo-btn ${filters.brand === brand ? "active" : ""}`}
            >
              {logo ? (
                <img src={logo} alt={`${brand} Logo`} className="brand-logo-img" onError={(e) => (e.target.src = "/placeholder.png")} />
              ) : (
                <div className="brand-logo-placeholder">{brand}</div>
              )}
              <span className="brand-logo-label">{brand}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Product Type */}
      <div className="filter-group">
        <label className="filter-label">Product Type</label>
        <div className="custom-select-wrap">
          <select name="productType" value={filters.productType} onChange={handleProductTypeChange} className="custom-select">
            <option value="all">All Products</option>
            <option value="watch">Wrist Watches</option>
            <option value="wall_clock">Wall Clocks</option>
          </select>
          <span className="select-arrow">▾</span>
        </div>
      </div>

      {/* Gender */}
      {(filters.productType === "all" || filters.productType === "watch") && (
        <div className="filter-group">
          <label className="filter-label">Gender</label>
          <div className="custom-select-wrap">
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="custom-select">
              <option value="all">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>
      )}

      {[
        { label: "Brand", name: "brand", options: ["all", ...getUniqueBrands()] },
        { label: "Shape", name: "shape", options: ["all", ...getUniqueShapes()] },
        { label: "Color", name: "color", options: ["all", ...getUniqueColors()] },
      ].map(({ label, name, options }) => (
        <div key={name} className="filter-group">
          <label className="filter-label">{label}</label>
          <div className="custom-select-wrap">
            <select name={name} value={filters[name]} onChange={handleFilterChange} className="custom-select">
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt === "all" ? `All ${label}s` : opt}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>
      ))}

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-label">Price Range <span className="filter-label-sub">(LKR)</span></label>
        <div className="price-range-row">
          <input placeholder="Min" value={filters.minPrice} onChange={(e) => handlePriceChange("minPrice", e.target.value)} className="price-input" />
          <span className="price-separator">—</span>
          <input placeholder="Max" value={filters.maxPrice} onChange={(e) => handlePriceChange("maxPrice", e.target.value)} className="price-input" />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => { resetFilters(); if (onClose) onClose(); }}
        className={`reset-btn ${hasActiveFilters ? "active" : ""}`}
      >
        {hasActiveFilters ? "✕ Clear All Filters" : "No Active Filters"}
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E2C07A;
          --gold-dim: rgba(201,168,76,0.15);
          --gold-border: rgba(201,168,76,0.3);
          --bg: #080808;
          --surface: #0f0f0f;
          --surface2: #141414;
          --surface3: #1a1a1a;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(201,168,76,0.4);
          --text: #f0ece4;
          --text-muted: #7a7570;
          --text-sub: #a09890;
          --radius: 12px;
          --radius-lg: 18px;
          --shadow: 0 8px 32px rgba(0,0,0,0.6);
          --shadow-gold: 0 0 24px rgba(201,168,76,0.12);
        }

        .shop-root {
          background: var(--bg);
          min-height: 100vh;
          color: var(--text);
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
        }

        /* ── PAGE WRAPPER ── */
        .shop-wrapper {
          max-width: 1380px;
          margin: 0 auto;
          padding: 24px 16px 48px;
        }
        @media(min-width:640px){ .shop-wrapper { padding: 32px 24px 64px; } }
        @media(min-width:1024px){ .shop-wrapper { padding: 40px 40px 80px; } }

        /* ── PAGE HEADER ── */
        .shop-header {
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .shop-header-eyebrow {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }
        .shop-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 5vw, 46px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .shop-header-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        /* ── SEARCH BAR ── */
        .search-wrap {
          position: relative;
          max-width: 520px;
          margin-bottom: 16px;
        }
        .search-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 12px 20px 12px 46px;
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-input:focus {
          border-color: var(--gold-border);
          box-shadow: 0 0 0 3px var(--gold-dim);
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--surface3);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: color 0.2s;
        }
        .search-clear:hover { color: var(--text); }

        /* ── CONTROLS ROW ── */
        .controls-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        /* Filter button (mobile) */
        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 14px;
          color: var(--gold);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .filter-toggle-btn:hover { border-color: var(--gold-border); background: var(--surface3); }
        .filter-toggle-btn .filter-badge {
          background: var(--gold);
          color: #000;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        @media(min-width:1024px){ .filter-toggle-btn { display: none; } }

        /* View toggle */
        .view-toggle {
          display: flex;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 3px;
          flex-shrink: 0;
        }
        .view-btn {
          padding: 6px 9px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .view-btn.active { background: var(--gold); color: #000; }
        .view-btn:not(.active):hover { color: var(--text); }

        /* Sort */
        .sort-wrap {
          position: relative;
          flex: 1;
          min-width: 0;
          max-width: 200px;
        }
        .sort-select {
          width: 100%;
          appearance: none;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 30px 9px 12px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          color: var(--text-sub);
          outline: none;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: var(--gold-border); }
        .sort-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          font-size: 11px;
        }

        /* Results count */
        .results-count {
          margin-left: auto;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .results-count strong { color: var(--gold); font-weight: 500; }

        /* ── LAYOUT ── */
        .shop-layout {
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        /* ── DESKTOP SIDEBAR ── */
        .desktop-sidebar {
          display: none;
          width: 240px;
          flex-shrink: 0;
        }
        @media(min-width:1024px){ .desktop-sidebar { display: block; } }

        .sidebar-inner {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          position: sticky;
          top: 20px;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .sidebar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--text);
        }
        .sidebar-count {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── FILTER CONTENT (shared) ── */
        .filter-content { display: flex; flex-direction: column; gap: 16px; }

        .brand-section {}
        .filter-section-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
          font-weight: 500;
        }
        .brand-logos-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .brand-logo-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.2s;
          outline: none;
        }
        .brand-logo-btn:hover { border-color: var(--gold-border); }
        .brand-logo-btn.active {
          border-color: var(--gold);
          background: var(--gold-dim);
          box-shadow: var(--shadow-gold);
        }
        .brand-logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
          transition: transform 0.2s;
        }
        .brand-logo-btn:hover .brand-logo-img { transform: scale(1.05); }
        .brand-logo-placeholder {
          height: 32px;
          width: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: var(--gold);
        }
        .brand-logo-label {
          font-size: 9px;
          color: var(--text-muted);
          margin-top: 3px;
          letter-spacing: 0.06em;
        }

        .filter-divider {
          height: 1px;
          background: var(--border);
          margin: 2px 0;
        }

        .filter-group {}
        .filter-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .filter-label-sub { text-transform: none; letter-spacing: 0; font-size: 9px; }

        .custom-select-wrap {
          position: relative;
        }
        .custom-select {
          width: 100%;
          appearance: none;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 28px 9px 12px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          color: var(--text);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .custom-select:focus { border-color: var(--gold-border); box-shadow: 0 0 0 2px var(--gold-dim); }
        .select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-muted);
          font-size: 11px;
        }

        .price-range-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .price-input {
          flex: 1;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 10px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          min-width: 0;
        }
        .price-input::placeholder { color: var(--text-muted); }
        .price-input:focus { border-color: var(--gold-border); }
        .price-separator { color: var(--text-muted); font-size: 12px; flex-shrink: 0; }

        .reset-btn {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px;
          font-size: 11px;
          font-family: 'Outfit', sans-serif;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .reset-btn.active {
          border-color: rgba(255,80,80,0.3);
          color: #ff8080;
          background: rgba(255,80,80,0.05);
        }
        .reset-btn.active:hover {
          background: rgba(255,80,80,0.12);
          border-color: rgba(255,80,80,0.5);
        }
        .reset-btn:not(.active):hover {
          border-color: var(--border-hover);
          color: var(--text);
        }

        /* ── MOBILE FILTER DRAWER ── */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
        .mobile-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
        }
        .mobile-drawer {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 280px;
          max-width: 85vw;
          background: var(--surface);
          border-right: 1px solid var(--border);
          box-shadow: 4px 0 40px rgba(0,0,0,0.6);
          overflow-y: auto;
          z-index: 10;
          animation: slideIn 0.25s ease;
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .mobile-drawer-header {
          position: sticky;
          top: 0;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1;
        }
        .mobile-drawer-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--text);
        }
        .drawer-close-btn {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text-muted);
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        .drawer-close-btn:hover { color: var(--text); border-color: var(--border-hover); }
        .mobile-drawer-body { padding: 18px; }

        /* ── PRODUCT GRID / LIST ── */
        .products-main { flex: 1; min-width: 0; }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media(min-width:640px){ .product-grid { gap: 16px; } }
        @media(min-width:1024px){ .product-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        @media(min-width:1280px){ .product-grid { grid-template-columns: repeat(4, 1fr); } }

        .product-list { display: flex; flex-direction: column; gap: 10px; }
        @media(min-width:640px){ .product-list { gap: 14px; } }

        /* ── PRODUCT CARD (grid) ── */
        .product-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          position: relative;
        }
        .product-card:hover {
          border-color: var(--gold-border);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), var(--shadow-gold);
        }

        .card-img-wrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: var(--surface2);
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .product-card:hover .card-img { transform: scale(1.06); }

        .card-featured-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: var(--gold);
          color: #000;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 3px;
        }

        .card-body {
          padding: 12px;
        }
        @media(min-width:640px){ .card-body { padding: 14px; } }

        .card-brand {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
          margin-bottom: 4px;
          display: block;
        }

        .card-title {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.35;
          color: var(--text);
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media(min-width:640px){ .card-title { font-size: 13px; } }

        .card-desc {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }
        .card-price {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--gold-light);
          letter-spacing: 0.02em;
        }
        @media(min-width:640px){ .card-price { font-size: 14px; } }
        .card-cta {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s, gap 0.2s;
          font-weight: 500;
        }
        .product-card:hover .card-cta { color: var(--gold); gap: 7px; }

        /* ── PRODUCT CARD (list) ── */
        .product-card-list {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          gap: 0;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .product-card-list:hover {
          border-color: var(--gold-border);
          box-shadow: 0 6px 24px rgba(0,0,0,0.5), var(--shadow-gold);
        }
        .list-img-wrap {
          width: 100px;
          flex-shrink: 0;
          overflow: hidden;
          background: var(--surface2);
        }
        @media(min-width:640px){ .list-img-wrap { width: 140px; } }
        .list-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card-list:hover .list-img { transform: scale(1.05); }
        .list-body {
          flex: 1;
          min-width: 0;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media(min-width:640px){ .list-body { padding: 18px; flex-direction: row; align-items: center; gap: 20px; } }

        .list-info { flex: 1; min-width: 0; }
        .list-right {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
        }
        @media(min-width:640px){ .list-right { flex-direction: column; align-items: flex-end; margin-top: 0; gap: 8px; flex-shrink: 0; } }

        /* ── BADGES ── */
        .gender-badge {
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }
        .gender-badge.men { background: rgba(59,130,246,0.12); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
        .gender-badge.women { background: rgba(236,72,153,0.12); color: #f9a8d4; border: 1px solid rgba(236,72,153,0.2); }
        .gender-badge.kids { background: rgba(34,197,94,0.12); color: #86efac; border: 1px solid rgba(34,197,94,0.2); }
        .gender-badge.unisex { background: rgba(255,255,255,0.05); color: #a0a0a0; border: 1px solid rgba(255,255,255,0.08); }
        .gender-badge.wall-clock { background: rgba(201,168,76,0.1); color: var(--gold); border: 1px solid var(--gold-border); }

        .color-badge {
          font-size: 9px;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.04);
          color: var(--text-sub);
          border: 1px solid rgba(255,255,255,0.07);
          text-transform: uppercase;
          font-weight: 400;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 60px 24px;
          text-align: center;
          background: var(--surface);
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
          filter: grayscale(0.5);
        }
        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 8px;
          color: var(--text);
        }
        .empty-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .empty-reset-btn {
          background: var(--gold);
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .empty-reset-btn:hover { background: var(--gold-light); }

        /* ── ERROR ── */
        .error-msg { color: #f87171; padding: 40px 0; font-size: 14px; }

        /* ── Active filter pills ── */
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .filter-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 50px;
          padding: 4px 10px 4px 10px;
          font-size: 10px;
          color: var(--gold-light);
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .filter-pill:hover { background: rgba(201,168,76,0.25); }
        .filter-pill-x { font-size: 11px; opacity: 0.7; }

        /* ── SELECT OPTION COLORS ── */
        select option { background: #1a1a1a; color: #f0ece4; }
      `}</style>

      <div className="shop-root">
        <ScrollToTop />
        <div className="shop-wrapper">

          {/* ── PAGE HEADER ── */}
          <div className="shop-header">
            <span className="shop-header-eyebrow">Collection</span>
            <h1 className="shop-header-title">Our <em>Timepieces</em></h1>
          </div>

          {/* ── SEARCH ── */}
          <div className="search-wrap">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search watches, brands, models…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          {/* ── CONTROLS ROW ── */}
          <div className="controls-row">
            {/* Filter btn (mobile) */}
            <button className="filter-toggle-btn" onClick={() => setShowFilters(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && <span className="filter-badge">!</span>}
            </button>

            {/* View toggle */}
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} aria-label="Grid view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} aria-label="List view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort */}
            <div className="sort-wrap">
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low → High</option>
                <option value="price-high-low">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
              <span className="sort-arrow">▾</span>
            </div>

            {/* Results count */}
            <span className="results-count">
              <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* ── ACTIVE FILTER PILLS ── */}
          {hasActiveFilters && (
            <div className="active-filters">
              {searchQuery && (
                <button className="filter-pill" onClick={() => setSearchQuery("")}>
                  "{searchQuery}" <span className="filter-pill-x">✕</span>
                </button>
              )}
              {filters.productType !== "all" && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, productType: "all" }))}>
                  {filters.productType === "watch" ? "Wrist Watches" : "Wall Clocks"} <span className="filter-pill-x">✕</span>
                </button>
              )}
              {filters.gender !== "all" && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, gender: "all" }))}>
                  {filters.gender} <span className="filter-pill-x">✕</span>
                </button>
              )}
              {filters.brand !== "all" && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, brand: "all" }))}>
                  {filters.brand} <span className="filter-pill-x">✕</span>
                </button>
              )}
              {filters.shape !== "all" && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, shape: "all" }))}>
                  {filters.shape} <span className="filter-pill-x">✕</span>
                </button>
              )}
              {filters.color !== "all" && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, color: "all" }))}>
                  {filters.color} <span className="filter-pill-x">✕</span>
                </button>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <button className="filter-pill" onClick={() => setFilters(p => ({ ...p, minPrice: "", maxPrice: "" }))}>
                  LKR {filters.minPrice || "0"} – {filters.maxPrice || "∞"} <span className="filter-pill-x">✕</span>
                </button>
              )}
            </div>
          )}

          <div className="shop-layout">

            {/* ── MOBILE FILTER DRAWER ── */}
            {showFilters && (
              <div className="mobile-overlay">
                <div className="mobile-backdrop" onClick={() => setShowFilters(false)} />
                <aside ref={filterRef} className="mobile-drawer">
                  <div className="mobile-drawer-header">
                    <span className="mobile-drawer-title">Filters</span>
                    <button className="drawer-close-btn" onClick={() => setShowFilters(false)}>✕</button>
                  </div>
                  <div className="mobile-drawer-body">
                    <FilterContent onClose={() => setShowFilters(false)} />
                  </div>
                </aside>
              </div>
            )}

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="desktop-sidebar">
              <div className="sidebar-inner">
                <div className="sidebar-header">
                  <span className="sidebar-title">Filters</span>
                  <span className="sidebar-count">{filteredProducts.length} results</span>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* ── PRODUCTS MAIN ── */}
            <main className="products-main">
              {loading && <Loading message="Loading products..." size="large" />}

              {!loading && error && <p className="error-msg">{error}</p>}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">⌚</div>
                  <h3 className="empty-title">No timepieces found</h3>
                  <p className="empty-sub">Try adjusting your search or filters to explore our collection.</p>
                  <button className="empty-reset-btn" onClick={resetFilters}>Clear Filters</button>
                </div>
              )}

              {!loading && !error && filteredProducts.length > 0 && (
                viewMode === "grid" ? (
                  <div className="product-grid">
                    {filteredProducts.map((product) => {
                      const productColors = getProductColors(product);
                      return (
                        <Link key={product._id} to={`/shop/${product._id}`} className="product-card">
                          <div className="card-img-wrap">
                            <img src={product.images?.[0] || "/placeholder.png"} alt={product.title} className="card-img" loading="lazy" />
                            {product.featured && <span className="card-featured-badge">Featured</span>}
                          </div>
                          <div className="card-body">
                            <span className="card-brand">{product.brand}</span>
                            <h3 className="card-title">{product.title}</h3>
                            <p className="card-desc">{product.description}</p>
                            <div className="card-meta">
                              <span className={getGenderBadgeClass(product.gender, product.productType)}>
                                {getGenderDisplay(product.gender, product.productType)}
                              </span>
                              {productColors.length > 0 && (
                                <span className="color-badge">{productColors[0].name}</span>
                              )}
                            </div>
                            <div className="card-footer">
                              <span className="card-price">{formatPrice(product.price)}</span>
                              <span className="card-cta">View <span>→</span></span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="product-list">
                    {filteredProducts.map((product) => {
                      const productColors = getProductColors(product);
                      return (
                        <Link key={product._id} to={`/shop/${product._id}`} className="product-card-list">
                          <div className="list-img-wrap">
                            <img src={product.images?.[0] || "/placeholder.png"} alt={product.title} className="list-img" loading="lazy" />
                          </div>
                          <div className="list-body">
                            <div className="list-info">
                              <span className="card-brand" style={{ marginBottom: 4 }}>{product.brand}</span>
                              <h3 className="card-title" style={{ fontSize: 14, WebkitLineClamp: 1 }}>{product.title}</h3>
                              <p className="card-desc" style={{ marginBottom: 8 }}>{product.description}</p>
                              <div className="card-meta" style={{ marginBottom: 0 }}>
                                <span className={getGenderBadgeClass(product.gender, product.productType)}>
                                  {getGenderDisplay(product.gender, product.productType)}
                                </span>
                                {productColors.length > 0 && (
                                  <span className="color-badge">{productColors[0].name}</span>
                                )}
                              </div>
                            </div>
                            <div className="list-right">
                              <span className="card-price">{formatPrice(product.price)}</span>
                              <span className="card-cta">View →</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;