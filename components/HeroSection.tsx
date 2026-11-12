"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Eye,
  Smartphone,
  LayoutDashboard,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  Percent,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface HeroSectionProps {
  onOpenCreateStore: (handle?: string) => void;
  onScrollToDemo: () => void;
}

export function HeroSection({ onOpenCreateStore, onScrollToDemo }: HeroSectionProps) {
  const [handleInput, setHandleInput] = useState("");
  const [activeMockupTab, setActiveMockupTab] = useState<"dual" | "dashboard" | "storefront">("dual");
  const [simulatedOrderAdded, setSimulatedOrderAdded] = useState(false);

  const handleClaimStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleInput.trim()) {
      window.location.href = `/signup?handle=${encodeURIComponent(handleInput.trim())}`;
      return;
    }
    onOpenCreateStore(handleInput);
  };

  const triggerSimulatedOrder = () => {
    setSimulatedOrderAdded(true);
    setTimeout(() => {
      setSimulatedOrderAdded(false);
    }, 4000);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background ambient subtle gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-tr from-purple-200/50 via-indigo-100/40 to-amber-100/30 blur-3xl rounded-full" />
        <div className="absolute top-44 left-1/4 w-[380px] h-[280px] bg-purple-300/30 blur-[90px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Typography */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/90 shadow-subtle mb-6 text-xs md:text-sm text-charcoal-700 animate-in fade-in duration-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-purple-900">SellNest Studio</span>
            <span className="text-stone-300">•</span>
            <span className="text-charcoal-600">The premier storefront for makers & independent sellers</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-charcoal-950 tracking-tight leading-[1.08] mb-6">
            Your business.{" "}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 bg-clip-text text-transparent">
              Your own little corner
            </span>
            <span className="font-serif italic font-normal text-charcoal-800 tracking-normal">
              of the internet.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 font-normal">
            Create a beautiful online store, showcase your products and start receiving orders. No
            coding required.
          </p>

          {/* Interactive Store Handle Claim Bar */}
          <form
            onSubmit={handleClaimStore}
            className="max-w-xl mx-auto mb-6 p-1.5 bg-white/95 rounded-2xl md:rounded-full border border-stone-300/90 shadow-card hover:shadow-card-hover focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-100 transition-all flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex items-center w-full px-4 py-2 md:py-1">
              <span className="text-xs md:text-sm font-semibold text-charcoal-400 select-none tracking-tight">
                sellnest.store/
              </span>
              <input
                type="text"
                placeholder="yourbrand"
                value={handleInput}
                onChange={(e) =>
                  setHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                }
                className="w-full bg-transparent text-sm md:text-base font-semibold text-charcoal-900 placeholder:text-stone-300 focus:outline-none pl-1"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl md:rounded-full shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-200"
            >
              <span>Create your free store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dual Action Buttons (as requested) */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-black text-white text-sm font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span>Create your free store</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onScrollToDemo}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-stone-100 text-charcoal-800 text-sm font-semibold px-6 py-3 rounded-full border border-stone-300/80 shadow-subtle hover:border-stone-400 transition-all"
            >
              <Eye className="w-4 h-4 text-purple-700" />
              <span>Explore demo store</span>
            </button>
          </div>

          {/* Value props micro-tags */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-charcoal-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ₹0/month free plan
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              0% transaction commission
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Direct WhatsApp checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Launch in under 5 mins
            </span>
          </div>
        </div>

        {/* VISUALLY STUNNING PRODUCT MOCKUP SECTION */}
        <div id="interactive-mockup" className="mt-14 md:mt-20 max-w-6xl mx-auto">
          {/* Mockup Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                Interactive Preview
              </span>
              <span className="h-3 w-px bg-stone-300" />
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live Storefront & Studio Sync
              </div>
            </div>

            {/* View tabs */}
            <div className="flex items-center bg-stone-200/60 p-1 rounded-xl text-xs font-medium text-charcoal-600">
              <button
                type="button"
                onClick={() => setActiveMockupTab("dual")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeMockupTab === "dual"
                    ? "bg-white text-charcoal-900 shadow-sm font-semibold"
                    : "hover:text-charcoal-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Side-by-Side</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMockupTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeMockupTab === "dashboard"
                    ? "bg-white text-charcoal-900 shadow-sm font-semibold"
                    : "hover:text-charcoal-900"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" />
                <span>Seller Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMockupTab("storefront")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeMockupTab === "storefront"
                    ? "bg-white text-charcoal-900 shadow-sm font-semibold"
                    : "hover:text-charcoal-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                <span>Customer Store</span>
              </button>
            </div>
          </div>

          {/* Main Mockup Frame */}
          <div className="relative rounded-3xl p-3 md:p-6 bg-gradient-to-b from-stone-200/80 via-stone-100 to-stone-200/40 border border-stone-300/80 shadow-2xl overflow-hidden">
            {/* Grid background inside preview */}
            <div className="absolute inset-0 grid-subtle pointer-events-none opacity-40" />

            {/* Layout Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT / MAIN: SellNest Seller Studio Dashboard */}
              {(activeMockupTab === "dual" || activeMockupTab === "dashboard") && (
                <div
                  className={`${
                    activeMockupTab === "dual" ? "lg:col-span-7" : "lg:col-span-12"
                  } bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300`}
                >
                  {/* Dashboard Topbar */}
                  <div className="bg-stone-50/80 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="h-4 w-px bg-stone-300 ml-1" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-charcoal-900">SellNest Studio</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                          Seller Mode
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Taking Orders
                      </span>
                      <button
                        onClick={triggerSimulatedOrder}
                        className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                      >
                        + Test New Order
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Body */}
                  <div className="p-4 sm:p-5">
                    {/* Seller Store Header Info */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                          BR
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-charcoal-900">
                              The Butter Room
                            </h4>
                            <span className="text-[11px] text-stone-500">
                              thebutterroom.sellnest.store
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-500">
                            Artisanal Sourdough & Patisserie • Indiranagar, BLR
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <a
                          href="#demo-storefront"
                          className="text-xs font-semibold text-charcoal-700 hover:text-purple-700 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Store
                        </a>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                        <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                          <span>Today's Sales</span>
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-charcoal-900">
                          {formatINR(8450)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          +18% from yesterday
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                        <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                          <span>Orders</span>
                          <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-charcoal-900">
                          14 orders
                        </div>
                        <span className="text-[10px] text-purple-700 font-medium">
                          3 ready for delivery
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                        <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                          <span>WhatsApp Sync</span>
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-charcoal-900">
                          Connected
                        </div>
                        <span className="text-[10px] text-charcoal-500 font-medium">
                          Direct to +91 98***
                        </span>
                      </div>
                    </div>

                    {/* Simulated order alert */}
                    {simulatedOrderAdded && (
                      <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in slide-in-from-top-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                          <span className="font-bold">New WhatsApp Order Received!</span>
                          <span>Order #1043 • Karan M. (₹940)</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-200/70 px-2 py-0.5 rounded">
                          Just now
                        </span>
                      </div>
                    )}

                    {/* Recent Orders List */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
                          Live Orders (WhatsApp Dispatch)
                        </h5>
                        <span className="text-[11px] text-purple-700 font-semibold cursor-pointer hover:underline">
                          View all 14 orders →
                        </span>
                      </div>

                      <div className="space-y-2">
                        {/* Order 1 */}
                        <div className="p-2.5 rounded-xl bg-stone-50/70 hover:bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[11px]">
                              #42
                            </div>
                            <div>
                              <div className="font-semibold text-charcoal-900">
                                Aisha Menon{" "}
                                <span className="font-normal text-stone-500">• 10 mins ago</span>
                              </div>
                              <div className="text-charcoal-600 text-[11px]">
                                2x Pistachio Cruffins, 1x Country Sourdough
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-charcoal-900">{formatINR(800)}</div>
                            <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                              Baking ⏳
                            </span>
                          </div>
                        </div>

                        {/* Order 2 */}
                        <div className="p-2.5 rounded-xl bg-stone-50/70 hover:bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[11px]">
                              #41
                            </div>
                            <div>
                              <div className="font-semibold text-charcoal-900">
                                Vikram Rao{" "}
                                <span className="font-normal text-stone-500">• 32 mins ago</span>
                              </div>
                              <div className="text-charcoal-600 text-[11px]">
                                1x Burnt Basque Cheesecake (650g)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-charcoal-900">{formatINR(1250)}</div>
                            <span className="inline-block text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                              Ready for Pickup 🛵
                            </span>
                          </div>
                        </div>

                        {/* Order 3 */}
                        <div className="p-2.5 rounded-xl bg-stone-50/70 hover:bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-[11px]">
                              #40
                            </div>
                            <div>
                              <div className="font-semibold text-charcoal-900">
                                Sneha Kapoor{" "}
                                <span className="font-normal text-stone-500">• 1 hr ago</span>
                              </div>
                              <div className="text-charcoal-600 text-[11px]">
                                1x Raspberry Macaron Box (6 pcs)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-charcoal-900">{formatINR(540)}</div>
                            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              Dispatched ✨
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT / FOREGROUND: Customer Storefront Mobile / Tablet Preview */}
              {(activeMockupTab === "dual" || activeMockupTab === "storefront") && (
                <div
                  className={`${
                    activeMockupTab === "dual" ? "lg:col-span-5" : "lg:col-span-12 max-w-xl mx-auto"
                  } bg-white rounded-2xl md:rounded-3xl border border-stone-300 shadow-xl overflow-hidden transition-all duration-300`}
                >
                  {/* Smartphone Browser Bar */}
                  <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                    </div>
                    <div className="flex-1 bg-white rounded-md px-2.5 py-1 text-[11px] text-charcoal-600 flex items-center justify-center gap-1 border border-stone-200 font-mono">
                      <span className="text-emerald-600 text-xs">🔒</span>
                      <span>thebutterroom.sellnest.store</span>
                    </div>
                  </div>

                  {/* Customer Store Content */}
                  <div className="p-4 bg-[#FAF9F6]">
                    {/* Store Banner */}
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white p-4 mb-3">
                      <div className="relative z-10">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-amber-200">
                          BENGALURU • ARTISAN BAKERY
                        </span>
                        <h4 className="text-lg font-serif font-bold text-white mt-0.5">
                          The Butter Room
                        </h4>
                        <p className="text-xs text-stone-200 mt-1 max-w-xs leading-snug">
                          Slow-fermented sourdoughs & French viennoiserie baked fresh every morning.
                        </p>
                        <div className="mt-2.5 flex items-center gap-2 text-[11px]">
                          <span className="bg-emerald-500/30 text-emerald-200 font-semibold px-2 py-0.5 rounded border border-emerald-400/30">
                            🟢 Open for delivery today
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Storefront Category Pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 text-[11px] font-semibold text-charcoal-700">
                      <span className="px-2.5 py-1 bg-charcoal-900 text-white rounded-full whitespace-nowrap">
                        All Bakes
                      </span>
                      <span className="px-2.5 py-1 bg-stone-200/80 text-charcoal-800 rounded-full whitespace-nowrap">
                        Sourdough
                      </span>
                      <span className="px-2.5 py-1 bg-stone-200/80 text-charcoal-800 rounded-full whitespace-nowrap">
                        Pastries
                      </span>
                      <span className="px-2.5 py-1 bg-stone-200/80 text-charcoal-800 rounded-full whitespace-nowrap">
                        Cakes
                      </span>
                    </div>

                    {/* Sample Product Cards inside mobile frame */}
                    <div className="space-y-2.5">
                      {/* Product 1 */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-subtle flex gap-3 items-center">
                        <img
                          src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=200&q=80"
                          alt="Country Sourdough"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                              VEG
                            </span>
                            <h5 className="text-xs font-bold text-charcoal-900 truncate">
                              Country Sourdough
                            </h5>
                          </div>
                          <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                            36h wild ferment, dark blistered crust
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-charcoal-900">{formatINR(320)}</span>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              + Add
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product 2 */}
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-subtle flex gap-3 items-center">
                        <img
                          src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80"
                          alt="Pistachio Cruffin"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1 rounded">
                              BESTSELLER
                            </span>
                            <h5 className="text-xs font-bold text-charcoal-900 truncate">
                              Pistachio & Rose Cruffin
                            </h5>
                          </div>
                          <p className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                            Flaky laminated dough, roasted pistachio
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-charcoal-900">{formatINR(240)}</span>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              + Add
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Checkout Bar */}
                    <div className="mt-3 bg-whatsapp-dark text-white p-2.5 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-emerald-700 transition-colors">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-300" />
                        <div>
                          <div className="text-[11px] font-bold leading-tight">
                            Order Direct on WhatsApp
                          </div>
                          <div className="text-[10px] text-emerald-100">Instant confirmation</div>
                        </div>
                      </div>
                      <span className="text-[11px] bg-white text-emerald-900 font-bold px-2 py-1 rounded-lg">
                        Send Order →
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

