"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  FileText,
  Store,
  Scale,
  CreditCard,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function TermsOfServicePage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-charcoal-500">
            Last Updated: November 13, 2026 • Effective Immediately for all SellNest users
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
              Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>SellNest</strong> ("Platform", "we", "us", or "our"), operated by SellNest Platforms Pvt Ltd. By accessing or using the SellNest website, application, storefront builder, and associated services, you ("Seller", "Customer", or "User") agree to be bound by these Terms of Service ("Terms").
            </p>
            <p>
              If you do not agree to these Terms, you may not access or use SellNest. We may modify these Terms periodically, and your continued use of the platform after changes are posted constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                2
              </span>
              Platform Description & Role of SellNest
            </h2>
            <p>
              SellNest provides software tooling allowing independent entrepreneurs, home bakers, Instagram makers, and small business owners to create and customize online storefronts, catalog their products, and receive orders.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Important Distinction:</strong> SellNest is a technology service provider and is <em>not</em> an auction house, retail merchant, or logistics carrier. All transactions, product quality, food hygiene compliance (including FSSAI standards), fulfillment, delivery, and refunds are strictly agreements between the Seller and their Customers.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                3
              </span>
              Account Registration & Security
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li>You must be at least 18 years of age to register a seller account on SellNest.</li>
              <li>You agree to provide true, accurate, current, and complete registration information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and password.</li>
              <li>You agree to notify SellNest immediately at <code>chopdekaradhrit2013@gmail.com</code> of any unauthorized use of your account.</li>
              <li>Store handles (slugs) are granted on a first-come, first-served basis. System-reserved handles and handles infringing trademarks or impersonating third parties will be reassigned or revoked.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                4
              </span>
              Seller Content & Prohibited Items
            </h2>
            <p>
              Sellers retain full intellectual property ownership of their brand assets, images, and copy. By uploading content, you grant SellNest a non-exclusive license to host and display your storefront on the web.
            </p>
            <p>You strictly agree not to list or sell:</p>
            <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
              <li>Illegal, hazardous, counterfeit, stolen, or unregulated goods.</li>
              <li>Alcohol, tobacco, vape products, or prescription pharmaceuticals without licensed regulatory approval.</li>
              <li>Content that is defamatory, abusive, obscene, fraudulent, or infringing copyright/trademarks.</li>
              <li>Food products that fail to comply with applicable local health and food safety certifications.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                5
              </span>
              Subscription Plans & Manual Payment Verification
            </h2>
            <p>SellNest offers tiered subscription plans:</p>
            <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
              <li><strong>Free Plan (₹0/month)</strong>: 1 online storefront, up to 10 products, WhatsApp ordering, basic themes.</li>
              <li><strong>Starter Plan (₹99/month)</strong>: Up to 100 products, all 4 themes, sales analytics, custom store branding.</li>
              <li><strong>Pro Plan (₹199/month)</strong>: Unlimited products, priority support, lowest platform overhead, custom domain readiness.</li>
            </ul>
            <p>
              Plan upgrades operate via a <strong>Manual Payment Verification Workflow</strong>. Sellers transfer the exact plan amount via UPI or direct bank transfer and submit their 12-digit UTR reference. Plan entitlements are activated within 24 hours following administrator review.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                6
              </span>
              Store Moderation & Suspension
            </h2>
            <p>
              SellNest administrators reserve the right to suspend accounts, unpublish storefronts, or remove products that violate these Terms, receive repeated fraudulent order complaints, or fail compliance reviews. Moderation actions are accompanied by written notification to the seller's registered email address.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                7
              </span>
              Limitation of Liability & Governing Law
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SellNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-stone-100">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                8
              </span>
              Contact & Grievance Officer
            </h2>
            <p>
              If you have questions, concerns, or notices regarding these Terms, please contact our designated administrator:
            </p>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 text-xs">
              <p className="font-bold text-charcoal-900">SellNest Platforms Pvt Ltd</p>
              <p className="text-charcoal-600">Attn: Adhrit Chopdekar (Grievance Officer)</p>
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

