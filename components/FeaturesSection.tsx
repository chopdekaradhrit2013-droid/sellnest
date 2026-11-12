"use client";

import React, { useState } from "react";
import {
  Store,
  Sliders,
  MessageCircle,
  Smartphone,
  TrendingUp,
  Palette,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function FeaturesSection() {
  // Micro-interaction states
  const [stockStatus, setStockStatus] = useState<"in_stock" | "sold_out">("in_stock");
  const [selectedBrandColor, setSelectedBrandColor] = useState<string>("#8B5CF6");
  const [activeTheme, setActiveTheme] = useState<"ivory" | "lavender" | "stone">("ivory");

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-[#FBFBFA]">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Designed For Independent Sellers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-950 tracking-tight leading-tight">
            Everything you need to sell.{" "}
            <span className="font-serif italic font-normal text-purple-900">
              Nothing you don't.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            No messy plugins, no complex payment gateways to configure, and no code. Just a sleek,
            functional storefront that converts your followers into paying buyers.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1: Beautiful Online Storefronts */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                Beautiful online storefronts
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Clean, elegant storefronts designed to showcase your craft. Fast loading,
                distraction-free, and effortlessly styled to make your products shine.
              </p>
            </div>

            {/* Interactive Micro UI: Theme preview */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="text-[11px] font-semibold text-charcoal-500 mb-2 flex items-center justify-between">
                <span>Theme Preset</span>
                <span className="text-purple-700 font-bold uppercase">{activeTheme}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTheme("ivory")}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    activeTheme === "ivory"
                      ? "bg-amber-50/80 border-amber-300 text-amber-950 font-bold shadow-xs"
                      : "bg-white border-stone-200 text-charcoal-600 hover:bg-stone-100"
                  }`}
                >
                  Ivory Warm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTheme("lavender")}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    activeTheme === "lavender"
                      ? "bg-purple-50 border-purple-300 text-purple-900 font-bold shadow-xs"
                      : "bg-white border-stone-200 text-charcoal-600 hover:bg-stone-100"
                  }`}
                >
                  Lavender
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTheme("stone")}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    activeTheme === "stone"
                      ? "bg-stone-200 border-stone-400 text-charcoal-900 font-bold shadow-xs"
                      : "bg-white border-stone-200 text-charcoal-600 hover:bg-stone-100"
                  }`}
                >
                  Minimal Stone
                </button>
              </div>
            </div>
          </div>

          {/* Feature 2: Simple Product Management */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                Simple product management
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Add products in 30 seconds from your phone. Set prices in INR, dietary tags
                (Eggless/Vegan), and toggle sold out with a single tap.
              </p>
            </div>

            {/* Interactive Micro UI: Stock toggle preview */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-charcoal-900">Pistachio Cruffin</div>
                  <div className="text-[11px] text-charcoal-500">{formatINR(240)} • Fresh Bake</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setStockStatus(stockStatus === "in_stock" ? "sold_out" : "in_stock")
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    stockStatus === "in_stock"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      stockStatus === "in_stock" ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  />
                  <span>{stockStatus === "in_stock" ? "In Stock" : "Sold Out"}</span>
                </button>
              </div>
              <span className="text-[10px] text-charcoal-400 mt-2 block text-center">
                (Click button to toggle stock status)
              </span>
            </div>
          </div>

          {/* Feature 3: WhatsApp Ordering */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                WhatsApp ordering
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Receive neat, pre-formatted order summaries straight to your WhatsApp. Confirm
                details, coordinate deliveries, and build authentic customer relationships.
              </p>
            </div>

            {/* Interactive Micro UI: WhatsApp Message Snippet */}
            <div className="p-3.5 rounded-2xl bg-[#EFEAE2] border border-stone-300/80 shadow-inner font-sans">
              <div className="bg-white p-3 rounded-xl shadow-xs text-xs space-y-1.5 border-l-4 border-emerald-500">
                <div className="text-[11px] font-bold text-emerald-800">
                  🛒 New Order: The Butter Room
                </div>
                <div className="text-charcoal-700 text-[11px] leading-relaxed">
                  • 2x Pistachio Cruffins (₹480)
                  <br />• 1x Country Sourdough (₹320)
                </div>
                <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-charcoal-900">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700">{formatINR(800)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Mobile-Friendly Stores */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                Mobile-friendly stores
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Over 85% of your shoppers arrive via Instagram and WhatsApp. Your SellNest store
                loads instantly and feels like a native mobile app on any screen.
              </p>
            </div>

            {/* Interactive Micro UI: Speed and mobile badge */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  100
                </div>
                <div>
                  <div className="text-xs font-bold text-charcoal-900">Lighthouse Mobile</div>
                  <div className="text-[11px] text-charcoal-500">Sub-second load time</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-1 rounded-md">
                <Zap className="w-3 h-3 text-purple-600" />
                Instant
              </span>
            </div>
          </div>

          {/* Feature 5: Sales Analytics */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                Sales analytics
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Understand your best-selling items, weekly revenue trajectories, and repeat customer
                orders at a glance. No confusing spreadsheet formulas.
              </p>
            </div>

            {/* Interactive Micro UI: Clean sparkline chart */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-charcoal-600">This Week's Revenue</span>
                <span className="font-bold text-emerald-600">+24.8%</span>
              </div>
              <div className="flex items-end gap-1.5 h-10 pt-2">
                {[35, 45, 30, 60, 75, 55, 95].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        i === 6 ? "bg-purple-600" : "bg-purple-200 hover:bg-purple-400"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-charcoal-400 mt-1.5">
                <span>Mon</span>
                <span>Wed</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Feature 6: Custom Branding */}
          <div className="group rounded-3xl bg-white p-7 sm:p-8 border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mb-2">
                Custom branding
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                Make your store truly yours. Upload your logo, pick your signature palette, customize
                store bio, and connect your own domain on the Pro plan.
              </p>
            </div>

            {/* Interactive Micro UI: Color swatch selector */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center justify-between text-xs font-semibold text-charcoal-700 mb-2">
                <span>Select Brand Color:</span>
                <div
                  className="w-4 h-4 rounded-full ring-2 ring-stone-300"
                  style={{ backgroundColor: selectedBrandColor }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                {[
                  { name: "Lavender", color: "#8B5CF6" },
                  { name: "Terracotta", color: "#EA580C" },
                  { name: "Emerald", color: "#059669" },
                  { name: "Rose", color: "#E11D48" },
                  { name: "Midnight", color: "#18181B" },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedBrandColor(item.color)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedBrandColor === item.color
                        ? "scale-110 ring-2 ring-purple-600 ring-offset-2"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
              <span className="text-[10px] text-charcoal-400 mt-2 block text-center">
                (Click any swatch to change accent)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

