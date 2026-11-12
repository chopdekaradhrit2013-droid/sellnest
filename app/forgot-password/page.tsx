"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, getSiteUrl } from "@/lib/supabase/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const siteUrl = getSiteUrl();

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/30 to-amber-100/20 blur-3xl rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-transform active:scale-95">
          <Logo size="lg" />
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-950">
          Reset your password
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-charcoal-600">
          Enter your registered email and we'll send you a secure recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200/90 shadow-card">
          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block">Error</span>
                <span className="text-rose-700 leading-relaxed">{errorMessage}</span>
              </div>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm font-medium text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black disabled:opacity-60 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-sm hover:shadow-purple-glow transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset email...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-charcoal-900">Check your inbox</h3>

              <p className="text-xs text-charcoal-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-charcoal-900">{email}</span>, we have sent a secure password reset link.
              </p>

              <div className="p-3.5 rounded-xl bg-purple-50 text-purple-900 text-xs text-left border border-purple-200/70">
                <p className="leading-relaxed">
                  💡 Follow the instructions in the email to set a new password. The link will expire in 60 minutes.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900"
                >
                  Resend recovery email
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-charcoal-600 hover:text-purple-700 transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 transition-colors"
          >
            ← Back to SellNest Home
          </Link>
        </div>
      </div>
    </div>
  );
}

