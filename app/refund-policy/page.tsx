"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import {
  RefreshCw,
  CreditCard,
  Store,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#14141C] selection:bg-purple-100 selection:text-purple-900 font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-950 px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-purple-glow transition-all"
          >
            <span>Create Free Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-purple-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Banner */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Customer Satisfaction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-charcoal-500">
            Last Updated: November 13, 2026 • Transparent, fair, and maker-friendly policies
          </p>
        </div>

        {/* Legal Body Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-card space-y-8 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                1
              </span>
              Overview
            </h2>
            <p>
              At <strong>SellNest</strong>, we strive to provide an extraordinary storefront building experience for independent businesses. This policy outlines how cancellations and refunds are handled for <strong>SellNest Subscription Plans</strong> as well as guidelines for <strong>Customer Orders</strong> placed on individual seller storefronts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                2
              </span>
              SellNest Subscription Plans (Starter & Pro)
            </h2>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>7-Day Money-Back Guarantee for Plan Upgrades</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                If you upgrade your store to the Starter (₹99/month) or Pro (₹199/month) plan and find that our tools do not fit your workflow, you can request a 100% full refund within <strong>7 days</strong> of your plan activation date. No questions asked.
              </p>
            </div>

            <div className="space-y-2 text-charcoal-600">
              <h3 className="font-bold text-charcoal-800">A. Refund Eligibility Rules</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refund requests must be submitted within 7 calendar days from the date the upgrade was approved by our team.</li>
                <li>After 7 days, subscriptions remain active until the end of the 30-day billing cycle and are non-refundable for that period.</li>
                <li>Downgrading to the Free plan can be done anytime from your dashboard under <strong>Plans & Billing</strong>. Existing products and orders remain intact.</li>
              </ul>
            </div>

            <div className="space-y-2 text-charcoal-600">
              <h3 className="font-bold text-charcoal-800">B. Rejected or Unverified Payments</h3>
              <p>
                If an upgrade request is rejected by our admin team due to an invalid transaction reference, mismatched amount, or uncredited transfer, no charges are assessed. If funds were debited from your account due to an inter-bank delay, they will either be credited to SellNest and manually refunded to your UPI VPA, or auto-reversed by your issuing bank within standard banking timelines (usually 48 hours).
              </p>
            </div>

            <div className="space-y-2 text-charcoal-600">
              <h3 className="font-bold text-charcoal-800">C. Refund Processing Timeframe</h3>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-700 shrink-0" />
                <span>
                  Approved subscription refunds are processed within <strong>5 to 7 business days</strong> directly back to the original UPI VPA or bank account from which payment was received.
                </span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                3
              </span>
              Customer Orders on Seller Storefronts
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Notice for End Customers:</strong> SellNest provides the software platform that powers independent seller storefronts. Each seller operates their own independent business and manages their own product fulfillment, returns, and cancellation policies.
              </div>
            </div>

            <p>Because many SellNest makers create perishable or customized goods (such as home-baked cakes, slow-fermented breads, and made-to-order jewellery):</p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li><strong>Perishable Goods</strong>: Home-baked food and fresh flowers are generally non-returnable once prepared or dispatched. Cancellation requests should be submitted promptly via WhatsApp before the seller commences baking or preparation.</li>
              <li><strong>Damaged or Incorrect Items</strong>: If an order arrives damaged or incorrect, contact the seller directly with photos within 24 hours of delivery using the WhatsApp contact number provided on your order confirmation receipt.</li>
              <li><strong>Seller Disputes</strong>: If a seller is completely unresponsive to a legitimate order issue, you may notify SellNest at <code>chopdekaradhrit2013@gmail.com</code> with your order code. While SellNest does not process customer funds, we actively investigate seller conduct and suspend fraudulent stores.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-stone-100">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                4
              </span>
              How to Request a Subscription Refund
            </h2>
            <p>To request a refund for your Starter or Pro plan upgrade, follow these simple steps:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-charcoal-600">
              <li>
                Send an email from your registered seller email address to{" "}
                <a
                  href="mailto:chopdekaradhrit2013@gmail.com"
                  className="text-purple-700 font-bold hover:underline"
                >
                  chopdekaradhrit2013@gmail.com
                </a>
                .
              </li>
              <li>Include your <strong>Store Name</strong>, <strong>Store URL Handle</strong>, and original <strong>UTR / Reference Number</strong>.</li>
              <li>Briefly mention your reason for requesting a refund (your feedback helps us improve our maker tools).</li>
            </ol>
            <p className="pt-2 text-charcoal-500 text-xs">
              Our admin team will review your request and confirm refund execution within 24 business hours.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

