"use client";

import React, { useState } from "react";
import { X, Lock, MessageCircle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo?: () => void;
}

export function LoginModal({ isOpen, onClose, onOpenDemo }: LoginModalProps) {
  const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [inputVal, setInputVal] = useState("");
  const [sentOtp, setSentOtp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal) return;
    setSentOtp(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <Logo size="sm" showWordmark={false} />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                Seller Studio
              </span>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mt-0.5">
                Log in to SellNest
              </h3>
            </div>
          </div>

          <p className="text-xs text-charcoal-500 mb-6 leading-relaxed">
            Manage your store, track WhatsApp orders, and update products from your Seller Studio.
          </p>

          {!sentOtp ? (
            <div>
              {/* Tab selector */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMethod("whatsapp");
                    setInputVal("");
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    method === "whatsapp"
                      ? "bg-white text-charcoal-900 shadow-sm"
                      : "text-charcoal-500 hover:text-charcoal-800"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod("email");
                    setInputVal("");
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    method === "email"
                      ? "bg-white text-charcoal-900 shadow-sm"
                      : "text-charcoal-500 hover:text-charcoal-800"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Email Magic Link</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {method === "whatsapp" ? (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Your Registered WhatsApp Number
                    </label>
                    <div className="flex items-center rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <span className="text-charcoal-400 font-medium mr-2">🇮🇳 +91</span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="w-full bg-transparent text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maker@yourbrand.com"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-charcoal-900 bg-stone-50/50 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all"
                >
                  <span>Send Login Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 p-3 rounded-xl bg-purple-50/80 border border-purple-200/70 text-center">
                <span className="text-xs text-purple-900 font-medium block mb-1">
                  💡 Exploring SellNest for the first time?
                </span>
                <p className="text-[11px] text-purple-700 leading-normal mb-2">
                  Check out the interactive demo storefront to experience the customer flow.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById("demo-storefront");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    if (onOpenDemo) onOpenDemo();
                  }}
                  className="text-xs font-bold text-purple-800 hover:text-purple-950 underline underline-offset-2"
                >
                  View Sample Bakery Storefront →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-charcoal-900 mb-1">Check your inbox</h4>
              <p className="text-xs text-charcoal-600 mb-5 leading-relaxed">
                We sent a 6-digit confirmation code to{" "}
                <span className="font-semibold text-charcoal-800">{inputVal}</span>. Enter code below:
              </p>

              <div className="flex justify-center gap-2 mb-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    defaultValue={i === 1 ? "4" : i === 2 ? "2" : ""}
                    className="w-10 h-12 text-center text-lg font-bold border border-stone-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none bg-stone-50"
                  />
                ))}
              </div>

              <div className="space-y-2">
                <a
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all"
                >
                  <span>Go to Full Sign In Page</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById("interactive-mockup");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all"
                >
                  Open Seller Studio Preview
                </button>
                <button
                  onClick={() => setSentOtp(false)}
                  className="text-xs text-charcoal-500 hover:text-charcoal-800 py-1"
                >
                  Change number / email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

