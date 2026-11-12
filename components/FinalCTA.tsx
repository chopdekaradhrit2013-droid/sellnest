"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

interface FinalCTAProps {
  onOpenCreateStore: (handle?: string) => void;
}

export function FinalCTA({ onOpenCreateStore }: FinalCTAProps) {
  const [handle, setHandle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      window.location.href = `/signup?handle=${encodeURIComponent(handle.trim())}`;
      return;
    }
    onOpenCreateStore(handle);
  };

  return (
    <section className="py-24 md:py-32 bg-[#FBFBFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl md:rounded-[40px] bg-gradient-to-b from-stone-900 via-charcoal-950 to-black text-white p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl border border-stone-800">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-purple-200 font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch your online storefront today</span>
            </div>

            {/* Headline as requested */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Your next chapter starts with{" "}
              <span className="block mt-1 bg-gradient-to-r from-purple-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent font-serif italic font-normal">
                your own store.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
              Join thousands of independent home bakers, Instagram sellers and passionate makers who
              have turned their craft into a thriving, professional business.
            </p>

            {/* Interactive Domain Claim Form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto mb-8 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-full border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2"
            >
              <div className="flex items-center w-full px-4 py-2 md:py-1">
                <span className="text-xs md:text-sm font-semibold text-stone-400 select-none">
                  sellnest.store/
                </span>
                <input
                  type="text"
                  placeholder="your-brand-name"
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                  }
                  className="w-full bg-transparent text-sm md:text-base font-semibold text-white placeholder:text-stone-500 focus:outline-none pl-1"
                />
              </div>

              {/* Button text exactly as requested: "Create your free store" */}
              <button
                type="submit"
                className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl md:rounded-full shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-200"
              >
                <span>Create your free store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Reassurance Tags */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                0% transaction fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Setup in 3 minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

