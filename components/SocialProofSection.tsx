"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  MessageCircle,
  Gem,
  Shirt,
  Cake,
  Palette,
  Flame,
  Check,
  ArrowUpRight,
} from "lucide-react";

interface CategoryShowcase {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tags: string[];
  imageUrl: string;
  exampleItems: string;
  focus: string;
}

const CATEGORIES: CategoryShowcase[] = [
  {
    id: "bakers",
    title: "Home-based Bakers",
    subtitle: "Artisanal breads, celebration cakes & tea bakes",
    icon: <Cake className="w-5 h-5 text-amber-600" />,
    tags: ["Pre-order slots", "Dietary badges (Eggless)", "Delivery radius"],
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Sourdough batards, Basque cheesecakes, Macaron boxes",
    focus: "Schedule daily bake capacities and collect delivery addresses automatically.",
  },
  {
    id: "instagram",
    title: "Instagram Sellers",
    subtitle: "Curated vintage, drops & independent thrift",
    icon: <ShoppingBag className="w-5 h-5 text-purple-600" />,
    tags: ["Drop timers", "Instant WhatsApp ping", "Bio link ready"],
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Vintage denim, linen shirts, hand-knit vests",
    focus: "Replace chaotic 'DM to order' threads with an organized product catalog.",
  },
  {
    id: "jewellery",
    title: "Jewellery Businesses",
    subtitle: "Handcrafted 925 silver, beads & clay pieces",
    icon: <Gem className="w-5 h-5 text-emerald-600" />,
    tags: ["Material details", "Care guides", "Variant selector"],
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Moonstone pendants, beaten brass cuffs, baroque pearl hoops",
    focus: "Showcase close-up craftsmanship and answer sizing questions directly.",
  },
  {
    id: "clothing",
    title: "Small Clothing Brands",
    subtitle: "Slow fashion, handloom & tailored apparel",
    icon: <Shirt className="w-5 h-5 text-indigo-600" />,
    tags: ["Size charts", "Made-to-order", "Fabric story"],
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Khadi co-ords, organic cotton kurtas, reversible tote bags",
    focus: "Tell your textile story and manage custom measurement requests.",
  },
  {
    id: "ceramics",
    title: "Pottery & Studio Crafts",
    subtitle: "Wheel-thrown ceramics, vases & tableware",
    icon: <Palette className="w-5 h-5 text-rose-600" />,
    tags: ["One-of-a-kind", "Batch drops", "Fragile packing tags"],
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Speckled stoneware mugs, matcha bowls, sculptural vases",
    focus: "Highlight handmade uniqueness with high-resolution visual cards.",
  },
  {
    id: "candles",
    title: "Candles & Scents",
    subtitle: "Hand-poured soy wax & botanical aromas",
    icon: <Flame className="w-5 h-5 text-amber-500" />,
    tags: ["Scent notes", "Burn time info", "Gift sets"],
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80",
    exampleItems: "Wood-wick candles, botanical wax melts, room elixirs",
    focus: "Offer gift packaging add-ons and direct customer notes.",
  },
];

export function SocialProofSection() {
  const [activeCategory, setActiveCategory] = useState<string>("bakers");

  const selected = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <section className="py-20 md:py-28 bg-[#F7F6F3] border-y border-stone-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold uppercase tracking-wider text-charcoal-700 shadow-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Targeted For Passion Businesses</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-950 tracking-tight leading-tight">
            Built for people building{" "}
            <span className="font-serif italic font-normal text-purple-900">
              something of their own.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            SellNest is crafted specifically for independent craftspeople, bakers, curators and
            designers who want an online home without corporate complexity.
          </p>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-charcoal-900 text-white shadow-md scale-102"
                    : "bg-white text-charcoal-700 hover:text-charcoal-950 hover:bg-stone-100 border border-stone-200/90 shadow-subtle"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 sm:p-8 md:p-10 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Image Side */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                    Featured Discipline
                  </span>
                  <h4 className="text-xl font-bold mt-1 text-white">{selected.title}</h4>
                  <p className="text-xs text-stone-200 mt-0.5">{selected.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Content & Blueprint Side */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Custom-tailored experience
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight mt-3">
                  How {selected.title} sell with SellNest
                </h3>
                <p className="mt-2 text-sm sm:text-base text-charcoal-600 leading-relaxed">
                  {selected.focus}
                </p>
              </div>

              {/* Tags */}
              <div>
                <span className="text-xs font-semibold text-charcoal-500 block mb-2">
                  Key store features for this niche:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-800 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/80"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* What you can sell */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Popular item setups:
                </span>
                <p className="text-sm font-medium text-charcoal-800">{selected.exampleItems}</p>
              </div>

              {/* Frictionless flow note */}
              <div className="flex items-center gap-3 text-xs text-charcoal-600 pt-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <p>
                  Customers browse your catalog and check out directly via WhatsApp with zero app
                  installs required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Architectural Pillars (No fake numbers, pure product value) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">Direct Relationships</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              No algorithmic feeds hiding your customers. Every order initiates a direct WhatsApp
              conversation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">0% Commissions</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We never take a percentage cut of your revenue. What you earn belongs 100% to your
              business.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">Instant Mobile Checkout</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Built for shoppers tapping links from your Instagram bio. Loads in under 1 second with
              zero friction.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900 mb-1">No Technical Skill</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              If you know how to send a photo on WhatsApp, you have all the technical skill needed to
              run SellNest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

