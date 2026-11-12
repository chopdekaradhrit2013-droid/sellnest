"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Plus,
  Minus,
  X,
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { BAKERY_PRODUCTS, BakeryProduct } from "@/data/sampleData";
import { formatINR } from "@/lib/utils";

interface CartItem {
  product: BakeryProduct;
  quantity: number;
}

export function DemoStorefront() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    "prod-2": 2, // Default 2x Cruffins in cart for instant delight
    "prod-1": 1, // Default 1x Sourdough in cart
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("Priya Sharma");
  const [customerAddress, setCustomerAddress] = useState<string>("Indiranagar 12th Main, Bengaluru");

  // Filter products
  const filteredProducts = useMemo(() => {
    return BAKERY_PRODUCTS.filter((prod) => {
      const matchesCategory =
        selectedCategory === "all" || prod.category === selectedCategory;
      const matchesEggless = !egglessOnly || prod.isEggless;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesEggless && matchesSearch;
    });
  }, [selectedCategory, egglessOnly, searchQuery]);

  // Cart helper functions
  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: current - 1,
      };
    });
  };

  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = BAKERY_PRODUCTS.find((p) => p.id === id);
        return product ? { product, quantity: qty } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Pre-generate WhatsApp message
  const generatedWhatsAppText = useMemo(() => {
    const itemsList = cartItems
      .map((item) => `• ${item.quantity}x ${item.product.name} (₹${item.product.price * item.quantity})`)
      .join("\n");

    return `Hi The Butter Room! 👋\nI'd like to place an order from your SellNest store:\n\n${itemsList}\n\n*Total Amount:* ₹${totalCartAmount}\n*Customer Name:* ${customerName}\n*Delivery Address:* ${customerAddress}\n\nPlease confirm availability and payment UPI. Thank you!`;
  }, [cartItems, totalCartAmount, customerName, customerAddress]);

  return (
    <section id="demo-storefront" className="py-24 md:py-32 bg-[#FBFBFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold uppercase tracking-wider text-amber-800 shadow-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Demo Storefront</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-950 tracking-tight leading-tight">
            Experience what your customers{" "}
            <span className="font-serif italic font-normal text-purple-900">will see & love.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Here is a live sample store for a Bengaluru-based artisan bakery. Test the category
            filters, add products to cart, and preview the WhatsApp order generator.
          </p>
        </div>

        {/* Live Storefront Shell Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-stone-300 shadow-card overflow-hidden">
          {/* Simulated Browser URL bar */}
          <div className="bg-stone-100/90 px-4 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-300 inline-block" />
              <span className="w-3 h-3 rounded-full bg-stone-300 inline-block" />
              <span className="w-3 h-3 rounded-full bg-stone-300 inline-block" />
            </div>
            <div className="bg-white px-4 py-1.5 rounded-full border border-stone-200 font-mono text-[11px] text-charcoal-600 flex items-center gap-1.5 shadow-xs">
              <span className="text-emerald-600">🔒</span>
              <span className="text-charcoal-400">https://</span>
              <span className="font-semibold text-charcoal-900">thebutterroom.sellnest.store</span>
            </div>
            <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 hidden sm:block">
              SellNest Hosted
            </div>
          </div>

          {/* Store Brand Banner & Profile */}
          <div className="relative bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-950 font-serif text-2xl sm:text-3xl font-bold flex items-center justify-center border-2 border-amber-300/60 shadow-lg shrink-0">
                  TBR
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                      The Butter Room
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      <Sparkles className="w-3 h-3" />
                      Artisan Verified
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
                    Small-batch artisanal sourdough, viennoiserie & celebratory cakes in
                    Indiranagar, Bengaluru.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-300">
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Baking fresh daily • 8 AM - 8 PM
                    </span>
                    <span className="flex items-center gap-1 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      Delivery across Bengaluru (Dunzo / Porter)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Store Stats Pill */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-1.5 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Batch status:</span>
                  <span className="text-emerald-300 font-semibold">Morning Bake Live</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">Pre-orders:</span>
                  <span className="text-amber-300 font-semibold">Open for tomorrow</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-300">WhatsApp Dispatch:</span>
                  <span className="text-white font-semibold">Under 10 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Store Navigation Bar & Controls */}
          <div className="bg-stone-50 border-b border-stone-200 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-semibold">
              {[
                { id: "all", label: "All Items" },
                { id: "breads", label: "Artisan Breads" },
                { id: "pastries", label: "Viennoiserie" },
                { id: "cakes", label: "Celebration Cakes" },
                { id: "treats", label: "Cookies & Treats" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? "bg-charcoal-900 text-white shadow-sm"
                      : "bg-white text-charcoal-700 hover:bg-stone-200/70 border border-stone-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Dietary filter */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              {/* Eggless toggle */}
              <button
                type="button"
                onClick={() => setEgglessOnly(!egglessOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  egglessOnly
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-white border-stone-200 text-charcoal-600 hover:bg-stone-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    egglessOnly ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                />
                <span>Eggless Only</span>
              </button>

              {/* Search input */}
              <div className="relative flex-1 md:w-52">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bakes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* View Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-purple-glow transition-all shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart</span>
                {totalCartCount > 0 && (
                  <span className="ml-1 bg-white text-purple-900 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="p-6 sm:p-8 bg-stone-50/40">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-charcoal-500 text-sm">No items match your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setEgglessOnly(false);
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-semibold text-purple-700 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const qtyInCart = cart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="group bg-white rounded-2xl border border-stone-200/90 shadow-subtle hover:shadow-card hover:border-purple-200 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Product Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            {prod.isBestseller && (
                              <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                                Bestseller
                              </span>
                            )}
                            {prod.isEggless && (
                              <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                                100% Eggless
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-4 sm:p-5">
                          <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block mb-1">
                            {prod.categoryLabel}
                          </span>
                          <h4 className="text-base font-bold text-charcoal-900 group-hover:text-purple-900 transition-colors">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-charcoal-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>

                          {prod.prepTime && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-stone-500">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>{prod.prepTime}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Add to Cart footer */}
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-stone-400 block font-normal">Price</span>
                          <span className="text-lg font-bold text-charcoal-900">
                            {formatINR(prod.price)}
                          </span>
                        </div>

                        {qtyInCart === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(prod.id)}
                            className="inline-flex items-center gap-1 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl p-1 text-purple-900">
                            <button
                              type="button"
                              onClick={() => removeFromCart(prod.id)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center font-bold text-xs shadow-xs text-purple-900 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-xs px-1 min-w-[16px] text-center">
                              {qtyInCart}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(prod.id)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center font-bold text-xs shadow-xs text-purple-900 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky Mini Cart Bar at Bottom of Storefront */}
          {totalCartCount > 0 && (
            <div className="bg-stone-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-sm shadow-sm">
                  {totalCartCount}
                </div>
                <div>
                  <div className="text-xs text-stone-300">
                    {totalCartCount} item{totalCartCount > 1 ? "s" : ""} selected for delivery
                  </div>
                  <div className="text-base font-bold text-white">
                    Total: {formatINR(totalCartAmount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer / Slide-over Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-700" />
                  <h3 className="font-bold text-charcoal-900 text-base">Your Bakery Cart</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    {totalCartCount} items
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-charcoal-800 hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-sm">
                    Your cart is currently empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-charcoal-900 truncate">
                          {item.product.name}
                        </h5>
                        <div className="text-xs text-charcoal-500">
                          {formatINR(item.product.price)} each
                        </div>
                        <div className="text-xs font-bold text-purple-800">
                          Subtotal: {formatINR(item.product.price * item.quantity)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 rounded bg-white text-charcoal-700 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item.product.id)}
                          className="w-6 h-6 rounded bg-white text-charcoal-700 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer with Checkout */}
            {totalCartCount > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Items Subtotal:</span>
                    <span>{formatINR(totalCartAmount)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600">
                    <span>Estimated Local Delivery:</span>
                    <span className="text-emerald-700 font-medium">Free (over ₹500)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-stone-200">
                    <span>Estimated Total:</span>
                    <span className="text-purple-800">{formatINR(totalCartAmount)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setShowWhatsAppModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-emerald-500" />
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-charcoal-900">
                      WhatsApp Order Generator
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      Pre-formatted message sent directly to the baker
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-charcoal-700 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Editable customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-600 uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-600 uppercase mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 font-medium"
                  />
                </div>
              </div>

              {/* Formatted Message Preview */}
              <div className="p-3.5 rounded-2xl bg-[#EFEAE2] border border-stone-300 font-mono text-xs text-charcoal-800 whitespace-pre-line leading-relaxed mb-5 shadow-inner">
                {generatedWhatsAppText}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Demo simulation: In production, this opens WhatsApp with your pre-formatted order message to The Butter Room's WhatsApp business number!"
                    );
                    setShowWhatsAppModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp (Simulate)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="w-full text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 py-1.5 text-center"
                >
                  Continue Browsing Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

