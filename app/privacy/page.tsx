"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Bell,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-charcoal-500">
            Last Updated: November 13, 2026 • We respect your privacy and protect your personal data
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
              Overview & Commitment
            </h2>
            <p>
              At <strong>SellNest</strong>, we are committed to safeguarding the privacy and personal data of our sellers and their end customers. This Privacy Policy outlines what information we collect, how it is used, how we protect it, and the rights you have concerning your data.
            </p>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
              <span>
                <strong>Our Core Privacy Promise:</strong> We never sell, rent, monetize, or broker your personal information or customer lists to third-party advertisers. Your business data belongs to you.
              </span>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                2
              </span>
              Information We Collect
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-charcoal-800 mb-1">A. Seller Account Information</h3>
                <p>When you register as a seller, we collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-charcoal-600 mt-1">
                  <li>Full name and store / brand name.</li>
                  <li>Email address and unique username / URL handle.</li>
                  <li>Encrypted password credentials (managed securely via Supabase Auth).</li>
                  <li>Contact details including WhatsApp phone number for receiving customer orders.</li>
                  <li>Transaction reference (UTR) and payment receipts for subscription plan upgrades.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-charcoal-800 mb-1">B. Customer Order Information</h3>
                <p>When a customer places an order on a seller's storefront, we collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-charcoal-600 mt-1">
                  <li>Customer full name and 10-digit mobile number.</li>
                  <li>Delivery address, city, state, and pincode.</li>
                  <li>Order items, selected quantities, and special preparation instructions.</li>
                  <li>Optional customer email for dispatching confirmation receipts.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                3
              </span>
              How We Use Your Data
            </h2>
            <p>We use collected data solely for legitimate business operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li>To host, render, and power your public online storefront.</li>
              <li>To record customer orders and notify sellers via the seller dashboard and WhatsApp.</li>
              <li>To dispatch transactional emails (e.g. order confirmation, status updates, upgrade verification).</li>
              <li>To verify subscription upgrade requests and enforce catalog limits.</li>
              <li>To prevent platform fraud, spam, and prohibited content distribution.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                4
              </span>
              Two-Factor Private Order Tracking
            </h2>
            <p>
              To protect end-customer privacy, SellNest does not expose order details or delivery addresses on public URLs.
            </p>
            <p>
              Our tracking system at <code>/track</code> requires <strong>both</strong> the unique Order Code (e.g., <code>SN-123456</code>) and the customer's <strong>10-digit mobile number</strong> before any delivery details or item histories are returned. This prevents unauthorized third parties from enumerating customer personal information.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                5
              </span>
              Data Storage & Security Measures
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li><strong>Row-Level Security (RLS)</strong>: Database tables enforce strict PostgreSQL security policies guaranteeing sellers can only read and modify their own store data.</li>
              <li><strong>Encryption</strong>: All communications are encrypted in transit via SSL/TLS (HTTPS).</li>
              <li><strong>Password Hashing</strong>: Passwords are irreversibly hashed and salted by Supabase Auth; raw passwords are never visible to SellNest administrators.</li>
              <li><strong>Secret Isolation</strong>: Administrative master passkeys are locked to server-side execution and never included in client JavaScript chunks.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                6
              </span>
              Cookies & Session Management
            </h2>
            <p>
              SellNest uses essential, first-party cookies necessary for platform operation:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
              <li><code>sellnest_admin_session</code>: Encrypted, HTTP-only cookie for administrator authorization.</li>
              <li>Supabase Authentication tokens for managing active seller login states.</li>
            </ul>
            <p>We do not use invasive third-party cross-site tracking cookies.</p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                7
              </span>
              Your Data Rights & Deletion Requests
            </h2>
            <p>
              Under applicable Indian data protection principles and international standards, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
              <li>Access and export your product and customer order records from your dashboard.</li>
              <li>Correct or update inaccurate store or profile information.</li>
              <li>Request complete permanent deletion of your store and account.</li>
            </ul>
            <p>
              To exercise these rights, submit a deletion or export request to{" "}
              <a
                href="mailto:chopdekaradhrit2013@gmail.com"
                className="text-purple-700 font-bold hover:underline"
              >
                chopdekaradhrit2013@gmail.com
              </a>
              . Requests are processed within 7 business days.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-stone-100">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                8
              </span>
              Privacy Grievance Redressal
            </h2>
            <p>
              For privacy inquiries, data requests, or compliance questions, please contact our designated Privacy Officer:
            </p>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 text-xs">
              <p className="font-bold text-charcoal-900">SellNest Platforms Pvt Ltd</p>
              <p className="text-charcoal-600">Privacy & Data Protection Officer: Adhrit Chopdekar</p>
              <p className="text-charcoal-600">
                Email:{" "}
                <a
                  href="mailto:chopdekaradhrit2013@gmail.com"
                  className="text-purple-700 font-bold hover:underline"
                >
                  chopdekaradhrit2013@gmail.com
                </a>
              </p>
              <p className="text-charcoal-500">Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

