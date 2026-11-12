"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Zap,
} from "lucide-react";

interface PricingSectionProps {
  onOpenCreateStore: (planName?: string) => void;
}

export function PricingSection({ onOpenCreateStore }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      id: "free",
      name: "Free",
      tagline: "For hobbyists and early makers starting their first venture.",
      priceMonthly: 0,
      priceYearly: 0,
      badge: null,
      isPopular: false,
      buttonText: "Create your free store",
      features: [
        "Up to 15 active products",
        "Instant WhatsApp direct checkout",
        "sellnest.store/yourname link",
        "Unlimited customer orders",
        "0% transaction commissions",
        "Mobile-optimized storefront",
        "Basic weekly order summary",
        "Community help center",
      ],
      ctaStyle: "bg-stone-900 hover:bg-black text-white",
    },
    {
      id: "starter",
      name: "Starter",
      tagline: "For growing sellers ready to establish a recognizable brand identity.",
      priceMonthly: 99,
      priceYearly: 79, // Billed annually
      badge: "Most Popular",
      isPopular: true,
      buttonText: "Start 14-day free trial",
      features: [
        "Unlimited products & categories",
        "Custom theme colors & typography",
        "Live Seller Studio dashboard",
        "Digital PDF order receipts",
        "Low-stock & sold-out alerts",
        "Direct WhatsApp order broadcasts",
        "Dietary & custom variant tags",
        "0% transaction commissions",
        "Priority WhatsApp support",
      ],
      ctaStyle:
        "bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 text-white shadow-purple-glow hover:shadow-purple-glow-lg",
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "For established boutiques wanting full domain control and deep insights.",
      priceMonthly: 199,
      priceYearly: 159, // Billed annually
      badge: "Full Control",
      isPopular: false,
      buttonText: "Start Pro trial",
      features: [
        "Everything included in Starter",
        "Connect custom domain (e.g. yourbrand.in)",
        "Advanced sales & repeat customer analytics",
        "Automated abandoned cart WhatsApp follow-ups",
        "Multi-staff accounts (bakers, dispatchers)",
        "Custom invoice & GST packing slips",
        "Batch export orders to CSV / Excel",
        "0% transaction commissions",
        "Dedicated 1-on-1 concierge onboarding",
      ],
      ctaStyle: "bg-stone-900 hover:bg-black text-white",
    },
  ];

  const faqs = [
    {
      q: "Are there really zero transaction fees?",
      a: "Yes, exactly 0%. Unlike marketplaces or traditional platforms that take 2% to 15% cuts on every order, SellNest charges zero transaction commissions. You keep 100% of the money your customers pay you.",
    },
    {
      q: "How do I receive payments from customers?",
      a: "When a customer places an order via your SellNest store, the complete order summary is sent to your WhatsApp. You can share your direct UPI ID, Google Pay, PhonePe QR code, or bank transfer details directly with your customer.",
    },
    {
      q: "Can I connect my own custom domain (like thebutterroom.in)?",
      a: "Yes! On our Pro plan, you can connect any domain you own (e.g., yourstore.com or yourstore.in) with free automatic SSL certificates configured in a few clicks.",
    },
    {
      q: "Do I need technical or coding knowledge?",
      a: "None at all. If you know how to use Instagram or WhatsApp, you can set up and run SellNest effortlessly in minutes.",
    },
    {
      q: "Can I change or cancel my plan anytime?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time without long-term lock-ins or cancellation penalties.",
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#F7F6F3] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold uppercase tracking-wider text-charcoal-700 shadow-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Honest & Predictable Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-950 tracking-tight leading-tight">
            Keep 100% of your sales.{" "}
            <span className="font-serif italic font-normal text-purple-900">
              Zero commissions forever.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Start for free and only upgrade when your business grows. No hidden fees or surprise
            cut-offs.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-stone-200/70 rounded-full border border-stone-300/80">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-charcoal-950 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-charcoal-950 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              <span>Yearly billing</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-20">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white p-7 sm:p-9 border transition-all duration-300 flex flex-col justify-between ${
                  plan.isPopular
                    ? "border-purple-500/80 ring-4 ring-purple-100 shadow-xl lg:-translate-y-2"
                    : "border-stone-200 shadow-card hover:shadow-card-hover"
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-charcoal-900 tracking-tight">
                      {plan.name}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      0% Fee
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-500 mb-6 leading-relaxed min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-charcoal-950 font-sans tracking-tight">
                        ₹{price}
                      </span>
                      <span className="text-charcoal-500 text-sm font-medium">/ month</span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                        Billed annually (₹{price * 12}/year)
                      </span>
                    )}
                    {price === 0 && (
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                        Free forever • No credit card required
                      </span>
                    )}
                  </div>

                  {/* Benefits checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                      What is included:
                    </span>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <a
                    href={`/signup?plan=${plan.id}`}
                    className={`w-full py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${plan.ctaStyle}`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <span className="text-[10px] text-charcoal-400 block text-center mt-2">
                    No card required to start
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Frequently Asked Questions Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-charcoal-900 tracking-tight">
              Frequently asked questions
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Have questions about selling on SellNest? We're here to help.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-subtle transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-charcoal-900 hover:text-purple-900 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-purple-700" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

