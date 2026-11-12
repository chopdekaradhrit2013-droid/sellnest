"use client";

import React, { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  PackagePlus,
  Share2,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";

interface HowItWorksSectionProps {
  onOpenCreateStore: () => void;
}

export function HowItWorksSection({ onOpenCreateStore }: HowItWorksSectionProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    copyToClipboard("sellnest.store/thebutterroom");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const steps = [
    {
      step: "01",
      icon: <UserCheck className="w-6 h-6 text-purple-700" />,
      title: "Create your SellNest account",
      description:
        "Claim your unique store link (sellnest.store/yourname) in under 60 seconds. Add your bio, logo, and connect the WhatsApp number where you want to receive orders.",
      highlight: "Takes under 2 minutes • No credit card needed",
      preview: (
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs">
          <div className="text-[11px] text-charcoal-400 font-semibold mb-1">RESERVED LINK</div>
          <div className="font-mono text-purple-900 font-bold bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 flex items-center justify-between">
            <span>sellnest.store/thebutterroom</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-sans font-semibold">
              Live
            </span>
          </div>
        </div>
      ),
    },
    {
      step: "02",
      icon: <PackagePlus className="w-6 h-6 text-indigo-700" />,
      title: "Add your products",
      description:
        "Upload photos directly from your phone camera. Set prices in ₹, customize options like flavors or sizes, and add tags like 'Eggless' or 'Small Batch'.",
      highlight: "Simple 30-sec product form • Instant updates",
      preview: (
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-semibold text-charcoal-800">
            <span>Pistachio Cruffin</span>
            <span className="text-purple-700 font-bold">₹240</span>
          </div>
          <div className="flex gap-1">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              Eggless Available
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              Fresh Daily
            </span>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      icon: <Share2 className="w-6 h-6 text-emerald-700" />,
      title: "Share your store link & receive orders",
      description:
        "Paste your link into your Instagram bio, WhatsApp catalog, or broadcast lists. Shoppers browse your menu, build their cart, and send itemized orders to your WhatsApp.",
      highlight: "Direct WhatsApp notifications • 0% commissions",
      preview: (
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-950">1-Click WhatsApp Order</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F7F6F3] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold uppercase tracking-wider text-charcoal-700 shadow-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Frictionless Setup</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-950 tracking-tight leading-tight">
            From idea to your first order in{" "}
            <span className="font-serif italic font-normal text-purple-900">
              three simple steps.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            No developers, no complicated plugins, no DNS headaches. You can launch during your lunch
            break.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative mb-16">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative rounded-3xl bg-white p-7 sm:p-8 border border-stone-200 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-stone-300 font-mono tracking-tighter">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-charcoal-900 mb-2.5 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Mini interactive UI preview */}
                <div className="mb-4">{item.preview}</div>

                <div className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison: The Old Way vs The SellNest Way */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 sm:p-8 md:p-10">
          <h4 className="text-xl sm:text-2xl font-bold text-charcoal-950 text-center mb-8 tracking-tight">
            Why independent makers are ditching chaotic Instagram DMs
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/50 border border-rose-200/70">
              <div className="flex items-center gap-2 mb-4 text-rose-800 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>The Old Way: Instagram DM Chaos</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-charcoal-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>"Price please?" asked 50 times a day in comments and DMs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Customers repeatedly asking if an item is still in stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Manual calculations, missed addresses, and misplaced notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Spending hours doing admin instead of creating and baking</span>
                </li>
              </ul>
            </div>

            {/* The SellNest Way */}
            <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/50 border border-purple-200/80">
              <div className="flex items-center gap-2 mb-4 text-purple-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span>The SellNest Way: Effortless Orders</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-charcoal-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>One clean link in your bio displays all items, photos & prices in ₹</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Instant stock availability prevents accidental over-ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Customers send complete itemized orders with delivery address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>You focus on making great products; your storefront handles the rest</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-black text-white text-sm font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-purple-glow transition-all"
            >
              <span>Build your store now — it's free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

