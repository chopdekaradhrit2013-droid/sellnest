"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-purple-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <Mail className="w-3.5 h-3.5" />
            <span>Maker Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Have questions about starting your store, plan upgrades, or need technical help? Our team responds within 24 hours.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-4">
            {/* Card 1: Email */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-900">Direct Email</h3>
              <p className="text-xs text-charcoal-600">
                For account support, subscription inquiries, or grievance redressal:
              </p>
              <a
                href="mailto:chopdekaradhrit2013@gmail.com"
                className="text-xs font-bold text-purple-700 hover:underline block truncate"
              >
                chopdekaradhrit2013@gmail.com
              </a>
            </div>

            {/* Card 2: WhatsApp */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-900">WhatsApp Chat</h3>
              <p className="text-xs text-charcoal-600">
                Instant maker support for active sellers and storefront inquiries:
              </p>
              <a
                href="https://wa.me/919876543210?text=Hi%20SellNest%20Support!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: Response Time & Location */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 text-charcoal-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-900">Registered Office</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                SellNest Platforms Pvt Ltd<br />
                Indiranagar, Bengaluru, Karnataka 560038, India
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-charcoal-500">
                <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Response promise: Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/90 shadow-card">
              <div className="mb-6 space-y-1">
                <h2 className="text-xl font-bold text-charcoal-950">Send us a message</h2>
                <p className="text-xs text-charcoal-500">
                  Fill in your details below and our team will get back to your email directly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-900">Message Delivered!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you, {name}! Your message has been routed to our team. We will reply to{" "}
                    <strong>{email}</strong> within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Send another message &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alisha Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@yourbrand.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 bg-stone-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-charcoal-700 block mb-1">
                      Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 bg-stone-50 font-medium text-charcoal-800"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="store_setup">Help Setting Up My Store</option>
                      <option value="plan_upgrade">Plan Upgrade / Manual UTR Verification</option>
                      <option value="bug_report">Technical Issue or Bug Report</option>
                      <option value="partnership">Maker Partnership or Press</option>
                      <option value="grievance">Grievance / Dispute</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-charcoal-700 block mb-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you need help with..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-200 bg-stone-50 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

