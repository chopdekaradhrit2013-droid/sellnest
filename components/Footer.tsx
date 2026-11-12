"use client";

import React, { useState } from "react";
import { Logo } from "./Logo";
import { ArrowRight, Check, Heart, Shield, Sparkles, MessageCircle } from "lucide-react";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-white border-t border-stone-200/90 text-charcoal-700 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-stone-200/70">
          {/* Brand Info (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <Logo size="md" />
            </a>

            <p className="text-sm text-charcoal-500 font-medium max-w-sm leading-relaxed">
              "Your business. Your own little corner of the internet."
            </p>

            <p className="text-xs text-charcoal-500 max-w-sm leading-relaxed">
              Empowering home bakers, Instagram sellers, artisanal jewellers and independent makers
              to launch elegant online storefronts with zero coding.
            </p>

            {/* Newsletter mini box */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-charcoal-800 block mb-2">
                Join our Maker Newsletter
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200"
                  />
                  <button
                    type="submit"
                    className="bg-charcoal-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thank you for subscribing to Maker updates!</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 1: Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-medium text-charcoal-600">
              <li>
                <a href="#features" className="hover:text-purple-700 transition-colors">
                  Features & Tools
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-purple-700 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Live Bakery Demo
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-purple-700 transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-purple-700 transition-colors">
                  Seller Studio Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-purple-700 transition-colors font-semibold text-purple-700">
                  Create Free Store →
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs font-medium text-charcoal-600">
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Home Bakers
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Instagram Sellers
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Small Clothing Brands
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Jewellery Businesses
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Studio Pottery & Crafts
                </a>
              </li>
              <li>
                <a href="#demo-storefront" className="hover:text-purple-700 transition-colors">
                  Artisanal Candles & Scents
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Company & Support
            </h4>
            <ul className="space-y-2 text-xs font-medium text-charcoal-600">
              <li>
                <a href="/#features" className="hover:text-purple-700 transition-colors">
                  About SellNest
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-purple-700 transition-colors">
                  Contact Us & FAQs
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210?text=Hi%20SellNest%20Support!%20I%20have%20a%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-purple-700 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-purple-700 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-purple-700 transition-colors">
                  Refund & Cancellation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <div className="flex items-center gap-2">
            <span>© 2026 SellNest Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-charcoal-600 font-medium">All systems operational</span>
            </div>
            <span className="text-stone-300">•</span>
            <span className="text-charcoal-500">
              Made with care for independent creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

