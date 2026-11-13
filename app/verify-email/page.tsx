"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, getSiteUrl } from "@/lib/supabase/config";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!emailParam || countdown > 0) return;
    setResending(true);
    setResendSuccess(false);
    setResendError(null);

    if (!isSupabaseConfigured()) {
      setResendSuccess(true);
      setCountdown(60);
      setResending(false);
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = getSiteUrl();

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailParam,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setResendError(error.message);
      } else {
        setResendSuccess(true);
        setCountdown(60);
      }
    } catch (err: any) {
      setResendError(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      } else {
        alert("Your email is not verified yet. Please check your inbox or try logging in.");
      }
    } catch {
      alert("Unable to verify status. Please check your email inbox.");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-10 rounded-3xl border border-stone-200/90 shadow-card text-center">
      {/* Mail Icon with animated ring */}
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-purple-100 animate-ping opacity-30" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-purple-glow">
          <Mail className="w-8 h-8" />
        </div>
      </div>

      <span className="text-[11px] font-bold tracking-wider uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/70 inline-block mb-3">
        Step 2 of 2 • Activation Pending
      </span>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-950 mb-3">
        Check your email inbox
      </h2>

      <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
        We've sent a verification link to:
        <span className="block mt-1 font-semibold text-charcoal-900 bg-stone-100 py-1.5 px-3 rounded-xl border border-stone-200 font-mono text-xs">
          {emailParam || "your email address"}
        </span>
      </p>

      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs text-charcoal-600 space-y-2 mb-6">
        <div className="flex items-start gap-2 text-charcoal-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
          <span>To secure your store:</span>
        </div>
        <p className="pl-6 text-[11px] leading-relaxed">
          1. Open the email from <strong>SellNest</strong>.
          <br />
          2. Click <strong>Confirm Your Email</strong> to activate your storefront.
          <br />
          3. You'll be automatically directed to your Seller Studio.
        </p>
      </div>

      {resendSuccess && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verification email resent! Please check your spam folder too.</span>
        </div>
      )}

      {resendError && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{resendError}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={checkingStatus}
          className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-sm transition-all"
        >
          {checkingStatus ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking status...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>I've Verified My Email</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || countdown > 0 || !emailParam}
          className="w-full text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 py-2.5 px-4 rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
        >
          {resending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Resending...</span>
            </>
          ) : countdown > 0 ? (
            <span>Resend email in {countdown}s</span>
          ) : (
            <span>Resend verification email</span>
          )}
        </button>
      </div>

      <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500">
        <Link
          href="/signup"
          className="hover:text-charcoal-800 transition-colors"
        >
          ← Change email
        </Link>
        <Link
          href="/login"
          className="font-semibold text-purple-700 hover:text-purple-900"
        >
          Back to sign in →
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl border border-stone-200 shadow-card flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
