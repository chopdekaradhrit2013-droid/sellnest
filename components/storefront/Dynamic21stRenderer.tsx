"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Check,
  ShieldCheck,
  Clock,
  Truck,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ShoppingBag,
  Heart,
  ArrowRight,
  Flame,
  Award,
  Zap,
} from "lucide-react";
import { Store, Product } from "@/lib/types";
import { getWhatsAppUrl } from "@/lib/utils";

interface Dynamic21stRendererProps {
  heroId?: string;
  installedComponents?: string[];
  store: Partial<Store>;
  products?: Product[];
  primaryColor?: string;
  secondaryColor?: string;
  isPreview?: boolean;
}

export default function Dynamic21stRenderer({
  heroId = "default",
  installedComponents = [],
  store,
  products = [],
  primaryColor = "#7C3AED",
  secondaryColor = "#4F46E5",
  isPreview = false,
}: Dynamic21stRendererProps) {
  const storeName = store.name || "The Artisan Bakehouse";
  const description =
    store.description ||
    "Small-batch artisanal sourdough, viennoiserie, and celebration bakes crafted with pure patience.";
  const bannerUrl =
    store.banner_url ||
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80";
  const whatsappUrl = store.whatsapp_number ? getWhatsAppUrl(store.whatsapp_number) : "#";

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 1. RENDER SELECTED 21st.dev HERO
  const renderHero = () => {
    switch (heroId) {
      case "hero-ambient-glow":
        return (
          <section className="relative overflow-hidden py-16 sm:py-24 bg-zinc-950 text-white rounded-3xl my-4 mx-4 sm:mx-6 shadow-2xl">
            {/* Ambient Radial Gradient Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] blur-[140px] rounded-full pointer-events-none opacity-40 animate-pulse"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="absolute top-1/4 right-1/4 w-[350px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-30"
              style={{ backgroundColor: secondaryColor }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>21st.dev Ambient Glow Showcase</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                {storeName}
              </h1>

              <p className="text-zinc-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target={isPreview ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("all-products");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all"
                >
                  Explore Today&apos;s Menu &darr;
                </button>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <strong className="text-white">4.9 / 5.0</strong> (180+ Reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Daily Fresh Batch &bull; Zero Additives</span>
                </span>
              </div>
            </div>
          </section>
        );

      case "hero-bento-grid":
        return (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Bento Hero Block */}
              <div
                className="md:col-span-2 p-8 sm:p-12 rounded-3xl text-white flex flex-col justify-between min-h-[380px] relative overflow-hidden shadow-xl"
                style={{
                  background: `linear-gradient(135deg, #18181b 0%, #09090b 100%)`,
                }}
              >
                {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt={storeName}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter contrast-125"
                  />
                )}
                <div className="relative z-10 space-y-3 max-w-lg">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${primaryColor}40`, color: primaryColor }}
                  >
                    ★ 21st.dev Bento Hero
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    {storeName}
                  </h2>
                  <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="relative z-10 pt-6 flex items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target={isPreview ? "_self" : "_blank"}
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Order</span>
                  </a>
                  <span className="text-xs text-zinc-400">Accepting pre-orders today</span>
                </div>
              </div>

              {/* Bento Card 2: Freshness / Proof */}
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-purple-50/90 border border-purple-200/90 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      CRAFT PHILOSOPHY
                    </span>
                    <h4 className="text-xl font-extrabold text-purple-950 mt-1">36-Hour Wild Proof</h4>
                    <p className="text-xs text-purple-800/80 mt-1">
                      No commercial yeast or conditioners. Just flour, water, salt and time.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-900 mt-2">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>100% Digestible &amp; Wholesome</span>
                  </div>
                </div>

                {/* Bento Card 3: Free Delivery */}
                <div className="p-6 rounded-3xl bg-emerald-50/90 border border-emerald-200/90 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      EXPRESS COURIER
                    </span>
                    <h4 className="text-xl font-extrabold text-emerald-950 mt-1">Free Delivery</h4>
                    <p className="text-xs text-emerald-800/80 mt-1">
                      Free doorstep delivery on orders of ₹1,000 and above.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 mt-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Temperature-Safe Packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "hero-split-showcase":
        return (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>21st.dev Split Showcase</span>
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
                  {storeName}
                </h1>
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">{description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target={isPreview ? "_self" : "_blank"}
                    rel="noreferrer"
                    className="px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("all-products");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-5 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs sm:text-sm transition-colors"
                  >
                    View Menu
                  </button>
                </div>
              </div>

              {/* Right Image Showcase */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-zinc-200/80 group">
                <img
                  src={bannerUrl}
                  alt={storeName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 block">Fresh From The Hearth</span>
                    <span className="text-zinc-500 text-[11px]">Baking daily from 6:00 AM</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ● Active Oven
                  </span>
                </div>
              </div>
            </div>
          </section>
        );

      case "hero-spotlight-radial":
        return (
          <section className="relative py-20 sm:py-28 bg-zinc-950 text-white rounded-3xl my-4 mx-4 sm:mx-6 overflow-hidden text-center shadow-2xl">
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-40"
              style={{ backgroundColor: primaryColor }}
            />
            <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono tracking-widest uppercase border border-zinc-700">
                [ 21st.dev Spotlight Hero ]
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                {storeName}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">{description}</p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target={isPreview ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Order</span>
                </a>
              </div>
            </div>
          </section>
        );

      default:
        // No custom 21st hero selected; render null to allow StorefrontView's native hero
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* 1. INFINITE RUNNING MARQUEE BANNER (if installed) */}
      {(installedComponents.includes("banner-infinite-marquee") ||
        installedComponents.includes("banner-shimmer-gradient")) && (
        <div className="w-full bg-zinc-950 text-white py-2.5 overflow-hidden border-b border-zinc-800 text-xs font-semibold select-none">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
            <span>🥖 Authentic 36-Hour Sourdough Fermentation</span>
            <span>&bull;</span>
            <span>🚚 Free Express Doorstep Delivery on ₹1,000+ Orders</span>
            <span>&bull;</span>
            <span>✨ 100% Pure Butter Viennoiserie</span>
            <span>&bull;</span>
            <span>🌱 Zero Preservatives or Artificial Improvers</span>
            <span>&bull;</span>
            <span>⚡ Instant Order Confirmation on WhatsApp</span>
          </div>
        </div>
      )}

      {/* 2. CUSTOM HERO SECTION */}
      {renderHero()}

      {/* 3. 3-COLUMN TRUST ICONS (if installed) */}
      {installedComponents.includes("feat-3col-trust") && (
        <section className="max-w-5xl mx-auto px-4 my-8">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto text-lg shadow-xs"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                🥖
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Baked Every Dawn</h4>
              <p className="text-xs text-zinc-500">
                Fresh out of the ovens every morning. Never frozen, never preserved.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-lg shadow-xs">
                🌿
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Zero Artificial Additives</h4>
              <p className="text-xs text-zinc-500">
                Pure wholewheat, organic stoneground flours, Himalayan salt and water.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-lg shadow-xs">
                🚚
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Temperature Safe Delivery</h4>
              <p className="text-xs text-zinc-500">
                Dispatched in breathable, eco-friendly craft boxes to maintain crust crispness.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 4. SOCIAL PROOF AVATAR STACK & REVIEWS (if installed) */}
      {(installedComponents.includes("proof-avatar-stack") ||
        installedComponents.includes("proof-marquee-reviews")) && (
        <section className="max-w-6xl mx-auto px-4 my-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50/60 via-stone-50 to-indigo-50/60 border border-purple-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-white text-xs text-white font-bold flex items-center justify-center shadow-xs">
                  AR
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white text-xs text-white font-bold flex items-center justify-center shadow-xs">
                  SM
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-white text-xs text-white font-bold flex items-center justify-center shadow-xs">
                  VK
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white text-xs text-white font-bold flex items-center justify-center shadow-xs">
                  NP
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <span>★★★★★</span>
                  <span className="text-zinc-900 font-extrabold ml-1">4.9 / 5.0</span>
                </div>
                <span className="text-xs text-zinc-600">
                  Loved by over <strong>1,400+ foodies</strong> in our neighborhood
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-700 italic border-l-2 border-purple-300 pl-4 max-w-md">
              “The sourdough crust crackles like music. Honestly the best bread in the city.”
              <span className="block font-bold text-zinc-900 not-italic mt-1">
                — Sneha M. &bull; Verified Regular
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 5. INTERACTIVE ACCORDION FAQ (if installed) */}
      {installedComponents.includes("feat-accordion-faq") && (
        <section className="max-w-4xl mx-auto px-4 my-12 space-y-4">
          <div className="text-center space-y-1 mb-6">
            <h3 className="text-xl font-bold text-zinc-900">Frequently Asked Questions</h3>
            <p className="text-xs text-zinc-500">Everything you need to know about our bakes and ordering</p>
          </div>

          {[
            {
              q: "How long does your artisan sourdough stay fresh?",
              a: "Our sourdough naturally stays fresh for 4 to 5 days on your counter due to its gentle wild acidity. Never refrigerate sourdough—simply slice and freeze it for up to 1 month, and toast directly from frozen for day-one crispness!",
            },
            {
              q: "Are your creations 100% eggless?",
              a: "Yes! All products tagged with our green 'Eggless' badge are crafted without eggs, gelatin, or animal rennet in a dedicated clean preparation area.",
            },
            {
              q: "How does payment and delivery work?",
              a: "When you submit your bag via WhatsApp or 1-click checkout, you receive direct confirmation with order code and UPI payment options. We dispatch twice daily in insulated, eco-friendly boxes.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-zinc-900"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-purple-600" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed pt-2 border-t border-zinc-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 6. FLOATING WHATSAPP PULSE BUTTON (if installed) */}
      {installedComponents.includes("badge-whatsapp-pulse") && store.whatsapp_number && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in">
          <a
            href={whatsappUrl}
            target={isPreview ? "_self" : "_blank"}
            rel="noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
