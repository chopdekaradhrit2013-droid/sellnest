"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Globe,
  Plus,
  Minus,
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Filter,
  Eye,
  Store as StoreIcon,
  Trash2,
  Package,
  Truck,
  ArrowUpDown,
} from "lucide-react";
import { Store, Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { getThemeConfig, getFontFamilyClass } from "@/lib/themes";

interface StorefrontViewProps {
  store: Partial<Store>;
  products: Product[];
  isPreview?: boolean;
  viewport?: "desktop" | "tablet" | "mobile";
  onProductClick?: (product: Product) => void;
}

export default function StorefrontView({
  store,
  products = [],
  isPreview = false,
  viewport = "desktop",
  onProductClick,
}: StorefrontViewProps) {
  const themeKey = store.theme || "modern";
  const theme = getThemeConfig(themeKey);
  const fontClass = getFontFamilyClass(store.font_family || theme.fontDefault);
  const primaryColor = store.accent_color || theme.defaultAccent;
  const secondaryColor = store.secondary_color || theme.defaultSecondary;
  const storeSlug = (store.slug || "demo").toLowerCase();
  const storageCartKey = `sellnest_cart_${storeSlug}`;

  // Search, Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  // Cart state persisted independently per store
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Load store-scoped cart from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageCartKey);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load cart:", e);
    } finally {
      setCartLoaded(true);
    }
  }, [storageCartKey]);

  // Save cart to store-specific localStorage
  useEffect(() => {
    if (!cartLoaded || typeof window === "undefined") return;
    try {
      localStorage.setItem(storageCartKey, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart:", e);
    }
  }, [cart, cartLoaded, storageCartKey]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (p.is_active === false) return false;
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (egglessOnly && !p.is_eggless) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, egglessOnly, searchQuery, sortBy]);

  // Featured Products (up to 3)
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.is_active !== false).slice(0, 3);
  }, [products]);

  // Cart Computations
  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [pId, qty]) => {
      const prod = products.find((p) => p.id === pId);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  }, [cart, products]);

  // Delivery fee: Free for orders >= 1000 INR, else 60 INR
  const deliveryFee = useMemo(() => {
    if (cartItemCount === 0) return 0;
    return subtotal >= 1000 ? 0 : 60;
  }, [cartItemCount, subtotal]);

  const finalTotal = subtotal + deliveryFee;

  const addToCart = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    setJustAddedId(productId);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const updateQuantity = (productId: string, delta: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const removeFromCart = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const s = theme.styles;

  return (
    <div
      className={`min-h-screen text-zinc-900 ${s.bodyBg} ${fontClass} transition-colors duration-300 relative`}
      style={
        {
          "--theme-primary": primaryColor,
          "--theme-secondary": secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {store.announcement && (
        <div
          className="text-white text-xs md:text-sm font-medium py-2 px-4 text-center transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto">
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span>{store.announcement}</span>
          </div>
        </div>
      )}

      {/* 2. STORE HEADER & NAVIGATION */}
      <header className={`sticky top-0 z-30 transition-all ${s.headerStyle}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Store Title */}
          <Link
            href={isPreview ? "#" : `/store/${store.slug}`}
            className="flex items-center gap-3 group"
            onClick={(e) => isPreview && e.preventDefault()}
          >
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name || "Store Logo"}
                className={`w-10 h-10 md:w-11 md:h-11 object-cover border border-black/5 shadow-xs transition-transform group-hover:scale-105 ${
                  themeKey === "playful" ? "rounded-2xl" : themeKey === "minimal" ? "rounded-md" : "rounded-full"
                }`}
              />
            ) : (
              <div
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-white font-bold text-lg shadow-xs ${
                  themeKey === "playful" ? "rounded-2xl" : themeKey === "minimal" ? "rounded-md" : "rounded-full"
                }`}
                style={{ backgroundColor: primaryColor }}
              >
                {(store.name || "S").charAt(0)}
              </div>
            )}
            <div>
              <h1 className={`font-semibold tracking-tight text-base sm:text-lg leading-tight group-hover:opacity-85 ${
                themeKey === "boutique" ? "font-serif text-lg sm:text-xl font-bold" : ""
              }`}>
                {store.name || "My Store"}
              </h1>
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <span>Direct Artisan Store</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              </p>
            </div>
          </Link>

          {/* Quick Actions & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Link */}
            {!isPreview && (
              <Link
                href={`/store/${store.slug}/track`}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-zinc-400" />
                <span>Track Order</span>
              </Link>
            )}

            {/* Direct WhatsApp Contact button */}
            {store.whatsapp_number && (
              <a
                href={
                  isPreview
                    ? "#"
                    : `https://wa.me/${(store.whatsapp_number || "").replace(/[^0-9]/g, "")}`
                }
                target={isPreview ? "_self" : "_blank"}
                rel="noreferrer"
                onClick={(e) => isPreview && e.preventDefault()}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 transition-colors ${s.buttonRadius}`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat</span>
              </a>
            )}

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-xs text-white ${s.buttonRadius}`}
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-white text-zinc-900 shadow-xs animate-in zoom-in">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO / BANNER SECTION */}
      <section className={`relative overflow-hidden transition-all ${s.heroStyle}`}>
        {store.banner_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={store.banner_url}
              alt={store.name || "Banner"}
              className="w-full h-full object-cover opacity-20 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl space-y-4">
            {themeKey === "playful" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 tracking-wide">
                <span>✨ Made with love & joy</span>
              </span>
            )}
            {themeKey === "boutique" && (
              <span className="inline-block text-xs uppercase tracking-[0.25em] text-amber-800/80 font-medium font-sans">
                Artisanal Collection
              </span>
            )}
            {themeKey === "minimal" && (
              <span className="inline-block text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                Fresh & Small-Batch
              </span>
            )}
            {themeKey === "modern" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                <Sparkles className="w-3.5 h-3.5" />
                Handcrafted Daily
              </span>
            )}

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 ${
                themeKey === "boutique" ? "font-serif italic font-normal text-4xl sm:text-5xl md:text-6xl" : ""
              }`}
            >
              {store.name || "Handmade with patience."}
            </h2>

            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {store.description ||
                "Small-batch artisanal creations made with pure ingredients, authentic passion and attention to every detail."}
            </p>

            {/* Highlights pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-xs rounded-lg border border-black/5 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Pre-orders & Daily Fresh Bakes</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-xs rounded-lg border border-black/5 shadow-xs">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free delivery on ₹1,000+ orders</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED HIGHLIGHTS */}
      {featuredProducts.length > 0 && selectedCategory === "all" && !searchQuery && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold tracking-tight text-zinc-900 ${
                themeKey === "boutique" ? "font-serif text-2xl" : ""
              }`}>
                Featured Highlights
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500">Most loved creations by our regulars</p>
            </div>
            <span
              className="text-xs font-semibold cursor-pointer hover:underline"
              style={{ color: primaryColor }}
              onClick={() => {
                const el = document.getElementById("all-products");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Full Menu &darr;
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onProductClick?.(prod)}
                className={`relative overflow-hidden cursor-pointer ${s.cardBg} ${s.cardBorder} ${s.cardRadius} ${s.productCardStyle}`}
              >
                {/* Product Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative group">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                      <StoreIcon className="w-10 h-10 opacity-30" />
                    </div>
                  )}

                  {/* Dietary / Feature Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {prod.is_eggless && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/95 text-white backdrop-blur-xs shadow-xs">
                        Eggless
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-zinc-800 backdrop-blur-xs shadow-xs">
                      {prod.category}
                    </span>
                  </div>

                  {/* Overlay button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isPreview ? (
                      <span className="px-3 py-1.5 bg-white text-zinc-900 text-xs font-semibold rounded-full shadow-md">
                        Preview Product
                      </span>
                    ) : (
                      <Link
                        href={`/store/${store.slug}/product/${prod.id}`}
                        className="px-3 py-1.5 bg-white text-zinc-900 text-xs font-semibold rounded-full shadow-md hover:bg-zinc-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-base text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {prod.name}
                    </h4>
                    {prod.description && (
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-400 block font-normal">Price</span>
                      <span className="font-bold text-base text-zinc-900">{formatINR(prod.price)}</span>
                    </div>

                    <button
                      onClick={(e) => addToCart(prod.id, e)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all shadow-xs text-white flex items-center gap-1 ${s.buttonRadius}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      {justAddedId === prod.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>+ Add to Bag</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. PRODUCT CATEGORIES, SEARCH & SORT CONTROLS */}
      <section id="all-products" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/70 pb-5">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${s.buttonRadius} ${
                  selectedCategory === cat
                    ? "text-white shadow-xs"
                    : "bg-black/[0.04] text-zinc-700 hover:bg-black/[0.07]"
                }`}
                style={selectedCategory === cat ? { backgroundColor: primaryColor } : {}}
              >
                {cat === "all" ? "All Products" : cat}
              </button>
            ))}
          </div>

          {/* Search, Eggless filter, and Sort By */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-white border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Eggless Filter */}
            <button
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                egglessOnly
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${egglessOnly ? "bg-emerald-600" : "bg-zinc-300"}`} />
              <span>Eggless</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. FULL PRODUCT GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/50 rounded-2xl border border-dashed border-zinc-200">
            <StoreIcon className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
            <h4 className="font-semibold text-zinc-800 text-sm">No products found</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your search query, sorting, or category filters.
            </p>
            {(searchQuery || selectedCategory !== "all" || egglessOnly) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setEgglessOnly(false);
                  setSortBy("featured");
                }}
                className="mt-4 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              themeKey === "minimal"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            }`}
          >
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onProductClick?.(prod)}
                className={`flex flex-col justify-between overflow-hidden cursor-pointer ${s.cardBg} ${s.cardBorder} ${s.cardRadius} ${s.productCardStyle}`}
              >
                <div>
                  {/* Product Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative group">
                    {prod.image_url ? (
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                        <StoreIcon className="w-8 h-8 opacity-30" />
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      {prod.is_eggless && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">
                          100% Veg
                        </span>
                      )}
                    </div>

                    {/* Stock availability badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {prod.stock_quantity !== undefined && prod.stock_quantity > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-black/60 text-white backdrop-blur-xs">
                          {prod.stock_quantity <= 5 ? `Only ${prod.stock_quantity} left` : "In Stock"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-black/60 text-white backdrop-blur-xs">
                          Made to Order
                        </span>
                      )}
                    </div>

                    {/* Quick view details overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isPreview ? (
                        <span className="px-3 py-1.5 bg-white text-zinc-900 text-xs font-semibold rounded-full shadow-md">
                          View Product
                        </span>
                      ) : (
                        <Link
                          href={`/store/${store.slug}/product/${prod.id}`}
                          className="px-3.5 py-1.5 bg-white text-zinc-900 text-xs font-semibold rounded-full shadow-md hover:bg-zinc-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details ↗
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 block mb-1">
                      {prod.category}
                    </span>
                    <h4 className="font-semibold text-sm sm:text-base text-zinc-900 leading-snug">
                      {prod.name}
                    </h4>
                    {prod.description && (
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Price & Add to Cart */}
                <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-base text-zinc-950">{formatINR(prod.price)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cart[prod.id] ? (
                      <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200">
                        <button
                          onClick={(e) => updateQuantity(prod.id, -1, e)}
                          className="p-1 hover:bg-white rounded text-zinc-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-zinc-900">{cart[prod.id]}</span>
                        <button
                          onClick={(e) => updateQuantity(prod.id, 1, e)}
                          className="p-1 hover:bg-white rounded text-zinc-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => addToCart(prod.id, e)}
                        className={`px-3 py-1.5 text-xs font-semibold transition-all shadow-xs text-white ${s.buttonRadius}`}
                        style={{ backgroundColor: primaryColor }}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. CONTACT & ABOUT SECTION */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/60 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Get in Touch
            </span>
            <h3 className={`text-2xl font-bold tracking-tight text-zinc-900 mt-1 ${
              themeKey === "boutique" ? "font-serif text-3xl" : ""
            }`}>
              Have a custom order or question?
            </h3>
            <p className="text-zinc-600 text-xs sm:text-sm mt-2 leading-relaxed">
              We specialize in celebration cakes, bulk orders, dessert tables and bespoke packaging. Reach out directly via WhatsApp for quick consultation.
            </p>

            <div className="mt-5 space-y-2 text-xs text-zinc-600">
              {store.whatsapp_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: {store.whatsapp_number}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{store.email}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            {store.social_links && (
              <div className="flex items-center gap-3 mt-4">
                {store.social_links.instagram && (
                  <a
                    href={store.social_links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-pink-600 transition-colors shadow-xs"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {store.social_links.facebook && (
                  <a
                    href={store.social_links.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-blue-600 transition-colors shadow-xs"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {store.social_links.website && (
                  <a
                    href={store.social_links.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-purple-600 transition-colors shadow-xs"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
            <h4 className="font-semibold text-zinc-900 text-sm">Direct Customer Care</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every order placed on SellNest is confirmed and fulfilled with personal care. Track your orders anytime with your mobile number.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {store.whatsapp_number && (
                <a
                  href={`https://wa.me/${(store.whatsapp_number || "").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
              {!isPreview && (
                <Link
                  href={`/store/${store.slug}/track`}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-center"
                >
                  Track Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-8 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {store.name || "Store"}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {!isPreview && (
              <Link href={`/store/${store.slug}/track`} className="hover:underline text-zinc-600">
                Track Order
              </Link>
            )}
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Powered by</span>
              <Link
                href="/"
                className="font-bold text-zinc-900 hover:text-purple-600 transition-colors"
              >
                SellNest
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. SHOPPING BAG SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Header with Store Name */}
              <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-zinc-800" />
                    <h3 className="font-semibold text-base text-zinc-900">Your Shopping Bag</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    From <span className="font-semibold text-zinc-800">{store.name}</span> • {cartItemCount} item{cartItemCount === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cartItemCount === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
                    <p className="text-sm font-semibold text-zinc-800">Your bag is empty</p>
                    <p className="text-xs text-zinc-500">Explore products from {store.name} and add them here.</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([pId, qty]) => {
                    const prod = products.find((p) => p.id === pId);
                    if (!prod) return null;
                    return (
                      <div
                        key={pId}
                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                      >
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-14 h-14 object-cover rounded-lg border border-zinc-200/60"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-400">
                            <StoreIcon className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-zinc-900 truncate">
                            {prod.name}
                          </h5>
                          <p className="text-xs font-bold text-zinc-800 mt-0.5">
                            {formatINR(prod.price * qty)}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            {formatINR(prod.price)} each
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-lg p-0.5 border border-zinc-200">
                            <button
                              onClick={() => updateQuantity(pId, -1)}
                              className="p-1 hover:bg-zinc-100 rounded text-zinc-600"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-zinc-900">{qty}</span>
                            <button
                              onClick={() => updateQuantity(pId, 1)}
                              className="p-1 hover:bg-zinc-100 rounded text-zinc-600"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(pId)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer & Checkout Button */}
              {cartItemCount > 0 && (
                <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/70 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="flex items-center gap-1">
                        <span>Delivery</span>
                        {subtotal >= 1000 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-zinc-900">
                        {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-sm font-bold text-zinc-950">
                      <span>Total</span>
                      <span>{formatINR(finalTotal)}</span>
                    </div>
                  </div>

                  {isPreview ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>Checkout (Preview Mode)</span>
                    </button>
                  ) : (
                    <Link
                      href={`/store/${store.slug}/checkout`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] hover:opacity-95"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
