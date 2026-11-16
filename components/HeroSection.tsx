"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Check,
  CheckCircle2,
  MessageCircle,
  Eye,
  Smartphone,
  Zap,
  ShieldCheck,
  Heart,
  QrCode,
  Calendar,
  Clock,
  ChevronRight,
  Store,
  Star,
  ShoppingBag,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface HeroSectionProps {
  onOpenCreateStore: (handle?: string) => void;
  onScrollToDemo: () => void;
}

/**
 * 21st.dev Style Floating Background Paths (inspired by Kokonut UI & Aceternity)
 * Pure CSS GPU-accelerated floating vector paths with organic curves.
 */
function BackgroundPaths() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      <svg
        className="w-full h-full opacity-60"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hero-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="hero-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="hero-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <path
          d="M -100 260 C 260 90, 520 520, 880 200 C 1220 -120, 1380 430, 1650 280"
          stroke="url(#hero-grad-1)"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="animate-float"
        />
        <path
          d="M -150 490 C 210 230, 620 700, 1080 340 C 1380 90, 1530 530, 1700 400"
          stroke="url(#hero-grad-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-float-delayed"
        />
        <path
          d="M -50 130 C 360 410, 720 90, 1130 540 C 1430 840, 1580 210, 1750 330"
          stroke="url(#hero-grad-3)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="animate-float"
        />
        <path
          d="M 60 700 C 420 390, 820 840, 1280 500 C 1530 250, 1680 640, 1850 470"
          stroke="url(#hero-grad-1)"
          strokeWidth="1"
          strokeDasharray="5 7"
          strokeLinecap="round"
          className="animate-float-delayed"
        />
      </svg>

      {/* Subtle organic warmth */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/30 to-amber-100/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-rose-200/20 blur-[90px] rounded-full pointer-events-none" />
    </div>
  );
}

export function HeroSection({ onOpenCreateStore, onScrollToDemo }: HeroSectionProps) {
  const [handleInput, setHandleInput] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<"500g" | "1kg">("1kg");
  const [selectedDiet, setSelectedDiet] = useState<"standard" | "eggless">("eggless");
  const [orderSimulated, setOrderSimulated] = useState(false);

  const price = selectedVariant === "1kg" ? 1200 : 650;

  const handleClaimStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleInput.trim()) {
      window.location.href = `/signup?handle=${encodeURIComponent(handleInput.trim())}`;
      return;
    }
    onOpenCreateStore();
  };

  const handleSimulateOrderClick = () => {
    setOrderSimulated(true);
    setTimeout(() => {
      setOrderSimulated(false);
    }, 4500);
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* 21st.dev Background Paths Canvas */}
      <BackgroundPaths />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TOP SECTION: KINETIC TYPOGRAPHY & VALUE PROPOSITION */}
        {/* ========================================================= */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Pill / Micro-Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-xs mb-6 text-xs md:text-sm text-charcoal-700 backdrop-blur-sm animate-in fade-in duration-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-purple-900">SellNest Studio</span>
            <span className="text-stone-300">•</span>
            <span className="text-charcoal-600 font-medium">Built for Instagram Sellers, Bakers & Creators</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full ml-1">
              0% Fee
            </span>
          </div>

          {/* Headline with 21st.dev Style Highlighter Effect */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-charcoal-950 tracking-tight leading-[1.07] mb-6">
            Turn messy Instagram DMs into{" "}
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="relative z-10 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-950 bg-clip-text text-transparent">
                an effortless storefront.
              </span>
              {/* Organic Marker Highlight Sweep */}
              <span className="absolute inset-x-0 bottom-1.5 sm:bottom-2 h-3 sm:h-4 bg-gradient-to-r from-purple-200/70 via-indigo-200/60 to-purple-300/60 -rotate-1 rounded-sm -z-0" />
            </span>
          </h1>

          {/* Human, Clear Subtitle */}
          <p className="text-base sm:text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 font-normal">
            Your customers pick flavors, sizes, delivery dates & dietary notes — then send clean,
            paid orders straight to your WhatsApp. <strong className="text-charcoal-900 font-semibold">Ready in 5 minutes. No coding.</strong>
          </p>

          {/* Interactive Store Handle Claim Bar */}
          <form
            onSubmit={handleClaimStore}
            className="max-w-xl mx-auto mb-5 p-1.5 bg-white/95 rounded-2xl md:rounded-full border border-stone-300/90 shadow-card hover:shadow-card-hover focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-100/80 transition-all flex flex-col md:flex-row items-center gap-2 backdrop-blur-sm"
          >
            <div className="flex items-center w-full px-4 py-2 md:py-1">
              <span className="text-xs md:text-sm font-bold text-charcoal-400 select-none tracking-tight">
                sellnest.store/
              </span>
              <input
                type="text"
                placeholder="yourbrand"
                value={handleInput}
                onChange={(e) =>
                  setHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                }
                className="w-full bg-transparent text-sm md:text-base font-bold text-charcoal-900 placeholder:text-stone-300 focus:outline-none pl-1"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-xl md:rounded-full shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>Create your free store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Store Handle live validation hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal-500 mb-8">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {handleInput ? (
                <>
                  <strong className="text-charcoal-800">sellnest.store/{handleInput}</strong> is available to claim today!
                </>
              ) : (
                "Free forever • Direct UPI payment • No credit card required"
              )}
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-black text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onScrollToDemo}
              className="inline-flex items-center gap-2 bg-white/95 hover:bg-stone-50 text-charcoal-800 text-sm font-bold px-6 py-3.5 rounded-full border border-stone-300 shadow-xs hover:border-stone-400 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-purple-700" />
              <span>Explore live demo store</span>
            </button>
          </div>

          {/* 4 Core Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-charcoal-600">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ₹0/month Free Tier
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              0% Transaction Commission
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Direct WhatsApp Orders
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              UPI QR Code Included
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SHOWCASE HERO: HYBRID BENTO + PHOTOREALISTIC IPHONE PRO */}
        {/* ========================================================= */}
        <div className="mt-14 md:mt-20 max-w-6xl mx-auto">
          {/* Section Subtitle */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Interactive Store Experience
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-2">
              See what your customers see in 20 seconds
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Tap the cake sizes and dietary chips below to test the live store preview!
            </p>
          </div>

          {/* Toast Notification Simulation */}
          {orderSimulated && (
            <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <p className="font-bold">✨ WhatsApp Message Prepared!</p>
                <p className="opacity-90 mt-0.5">
                  &ldquo;Hi Chef! I want to order 1kg Belgian Truffle Cake (Eggless 🌱) for Tomorrow 4 PM. Custom note: &apos;Happy Birthday!&apos;. Total ₹{price}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Grid Layout: Left Card + Center Simulator + Right Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* LEFT BENTO TILE: WhatsApp Push Notification & Order Queue */}
            <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
              {/* WhatsApp Push Notification */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-charcoal-900 block leading-tight">
                        WhatsApp Order
                      </span>
                      <span className="text-[10px] text-charcoal-400">Just Now</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paid ₹1,200
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-charcoal-700 space-y-1.5 leading-relaxed font-sans">
                  <p className="font-bold text-charcoal-900 flex items-center gap-1">
                    <span>From:</span>
                    <span className="text-purple-700">Pooja M. (Bandra West)</span>
                  </p>
                  <p className="text-[11px] text-charcoal-600">
                    &ldquo;Hi Chef! Order <strong>#SN-9102</strong> confirmed. Delivery scheduled for <strong>Tomorrow 4 PM</strong>. 100% Eggless 🌱&rdquo;
                  </p>
                  <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between text-[10px] text-charcoal-500">
                    <span>UTR: 4098129038</span>
                    <span className="text-emerald-700 font-bold">✓ GPay Verified</span>
                  </div>
                </div>
              </div>

              {/* Order Tracking & Schedule Note */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-50/80 to-indigo-50/80 border border-purple-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Scheduled Delivery Built-in</span>
                </div>
                <p className="text-xs text-purple-950/80 leading-relaxed">
                  No more chasing dates in DMs. Customers pick delivery slots & enter cake messages right at checkout.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 bg-white/90 p-2 rounded-xl border border-purple-200">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tomorrow &bull; 4:00 PM – 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* CENTERPIECE: IPHONE PRO SMARTPHONE SIMULATOR */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="w-full max-w-[340px] sm:max-w-[370px] bg-charcoal-950 p-3 sm:p-3.5 rounded-[48px] shadow-2xl border-4 border-stone-800/80 relative">
                {/* iPhone Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                {/* iPhone Screen Content */}
                <div className="bg-[#FAF9F6] rounded-[38px] overflow-hidden pt-8 pb-5 px-4 sm:px-5 space-y-3.5 text-charcoal-900 border border-stone-200/50 shadow-inner">
                  {/* Storefront Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-serif font-black text-xs border border-purple-200 shadow-2xs">
                        B
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-charcoal-900 leading-tight">
                          The Butter Room
                        </h4>
                        <span className="text-[10px] text-stone-500">sellnest.store/butterroom</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Open Now
                    </span>
                  </div>

                  {/* Product Card Showcase */}
                  <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-xs space-y-3">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-100">
                      <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                        alt="Belgian Chocolate Truffle Cake"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-charcoal-900/85 backdrop-blur-xs text-white text-[10px] font-bold">
                        Bestseller 🔥
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                        {selectedDiet === "eggless" ? "100% Eggless 🌱" : "Standard"}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-xs sm:text-sm font-extrabold text-charcoal-900">
                            Belgian Chocolate Truffle Cake
                          </h5>
                          <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                            55% dark chocolate ganache, moist crumb
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm sm:text-base font-black text-purple-900 block font-sans">
                            {formatINR(price)}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Size Chips */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1.5">
                          Select Portion / Weight
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedVariant("500g")}
                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                              selectedVariant === "500g"
                                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                : "bg-stone-50 text-charcoal-700 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            500g &bull; ₹650
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedVariant("1kg")}
                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                              selectedVariant === "1kg"
                                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                : "bg-stone-50 text-charcoal-700 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            1 kg &bull; ₹1,200
                          </button>
                        </div>
                      </div>

                      {/* Interactive Dietary Preference Chips */}
                      <div className="mt-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                          Dietary Preference
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDiet("eggless")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              selectedDiet === "eggless"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs"
                                : "bg-stone-100 text-charcoal-600 hover:bg-stone-200"
                            }`}
                          >
                            🌱 100% Eggless
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDiet("standard")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              selectedDiet === "standard"
                                ? "bg-stone-800 text-white shadow-2xs"
                                : "bg-stone-100 text-charcoal-600 hover:bg-stone-200"
                            }`}
                          >
                            Regular
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 1-Tap WhatsApp Checkout Button */}
                    <button
                      type="button"
                      onClick={handleSimulateOrderClick}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Order on WhatsApp &bull; {formatINR(price)}</span>
                    </button>
                  </div>
                </div>

                {/* iPhone Home Indicator Bar */}
                <div className="w-28 h-1 bg-stone-700 rounded-full mx-auto mt-2.5" />
              </div>
            </div>

            {/* RIGHT BENTO TILE: Direct UPI QR Code & 0% Fee Guarantee */}
            <div className="lg:col-span-3 space-y-4 order-3">
              {/* Dynamic UPI QR Code Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all text-center backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-400">
                    Direct Payment
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    Instant Bank Transfer
                  </span>
                </div>

                <div className="relative inline-block bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3Dthebutterroom%40okaxis%26pn%3DThe%2520Butter%2520Room%26am%3D1200%26cu%3DINR"
                    alt="Demo UPI QR"
                    className="w-32 h-32 mx-auto rounded-lg"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-charcoal-900 text-white text-[9px] font-bold whitespace-nowrap shadow-xs">
                    ₹{price} Pre-filled
                  </div>
                </div>

                <p className="text-xs font-bold text-charcoal-900 pt-1">
                  Google Pay, PhonePe, Paytm or BHIM
                </p>
                <p className="text-[11px] text-charcoal-500 leading-tight">
                  100% of the money lands in your bank account immediately.
                </p>
              </div>

              {/* 0% Commission Guarantee */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/80 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>0% Commission. Always.</span>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Swiggy and Zomato take 25% to 30%. On SellNest, your revenue is 100% yours.
                </p>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-extrabold text-emerald-800">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>₹0 cuts on any of your sales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAKER SOCIAL PROOF & CREATOR COMMUNITY BAR */}
        {/* ========================================================= */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-stone-200/80 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            {/* Stack of Creator Avatars */}
            <div className="flex -space-x-2.5 overflow-hidden shrink-0">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Maker Rhea"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                alt="Maker Tanya"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                alt="Maker Kabir"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Maker Rohit"
              />
            </div>

            <div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-black text-charcoal-900 ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Loved by <strong>500+ home bakers, candle makers & creators</strong> across India
              </p>
            </div>
          </div>

          <div className="text-xs text-charcoal-500 font-medium">
            <span className="text-purple-700 font-bold">“No more asking &apos;Price please?&apos; in Instagram comments.”</span>
            <span className="block text-[11px] text-stone-400 mt-0.5">— Rhea K., Home Baker & Creator</span>
          </div>
        </div>
      </div>
    </section>
  );
}
