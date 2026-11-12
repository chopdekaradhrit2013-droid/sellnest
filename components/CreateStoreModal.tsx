"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight, Store, MessageCircle, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHandle?: string;
}

export function CreateStoreModal({ isOpen, onClose, initialHandle = "" }: CreateStoreModalProps) {
  const [handle, setHandle] = useState(initialHandle);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("bakery");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync handle if initialHandle changes
  React.useEffect(() => {
    if (initialHandle) {
      setHandle(initialHandle.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
    }
  }, [initialHandle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;
    window.location.href = `/signup?handle=${encodeURIComponent(handle)}&name=${encodeURIComponent(businessName)}`;
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative gradient border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 md:p-8">
          {!isSubmitted ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Logo size="sm" showWordmark={false} />
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                    Free Forever • 0% Commission
                  </span>
                  <h3 className="text-2xl font-bold text-charcoal-900 tracking-tight mt-1">
                    Create your online store
                  </h3>
                </div>
              </div>

              <p className="text-sm text-charcoal-500 mb-6 leading-relaxed">
                Start taking direct orders via WhatsApp in under 3 minutes. No credit card required.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Store Handle Input */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Your Store Link
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 px-3 py-2.5 transition-all">
                    <span className="text-sm font-medium text-charcoal-400 select-none">
                      sellnest.store/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="yourbrand"
                      value={handle}
                      onChange={(e) =>
                        setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                      }
                      className="w-full bg-transparent text-sm font-semibold text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none pl-0.5"
                    />
                    {handle.length > 2 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Brand / Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Brand or Seller Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Butter Room or Maya Ceramics"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-stone-50/50 transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    What are you selling?
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-charcoal-900 bg-stone-50/50 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
                  >
                    <option value="bakery">🧁 Home Bakery & Confectionery</option>
                    <option value="fashion">👗 Instagram Clothing & Apparel</option>
                    <option value="jewellery">✨ Handmade Jewellery & Silver</option>
                    <option value="pottery">🏺 Studio Pottery, Ceramics & Decor</option>
                    <option value="candles">🕯️ Artisan Candles & Fragrances</option>
                    <option value="other">🌿 Other Handcrafted & Indie Goods</option>
                  </select>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Number (for order notifications)
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <span className="text-charcoal-400 font-medium mr-2">🇮🇳 +91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-transparent text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-200"
                  >
                    <span>Create Storefront & Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Instant store setup
                </span>
                <span>Cancel anytime</span>
                <span>Zero commission</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Store Created Successfully
              </span>
              <h3 className="text-2xl font-bold text-charcoal-900 mt-3 mb-2">
                Your corner of the internet is ready!
              </h3>
              <p className="text-sm text-charcoal-600 mb-6">
                Your store link is active. In this frontend preview, your store handle has been reserved:
              </p>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 mb-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-900">Live Store URL</span>
                  <span className="text-[11px] bg-purple-200/70 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="font-mono text-sm font-semibold text-purple-950 bg-white px-3 py-2 rounded-xl border border-purple-200 flex items-center justify-between">
                  <span>sellnest.store/{handle || "yourbrand"}</span>
                  <span className="text-xs text-purple-600 font-sans">Ready</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-charcoal-600">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp notifications configured
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    const demoEl = document.getElementById("demo-storefront");
                    if (demoEl) demoEl.scrollIntoView({ behavior: "smooth" });
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Demo Storefront Below</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full text-xs font-medium text-charcoal-500 hover:text-charcoal-800 py-2 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

