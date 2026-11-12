"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Mail,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, getSiteUrl } from "@/lib/supabase/config";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Real-time username check state
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Pre-fill query parameters if navigated from landing page
  useEffect(() => {
    const handleParam = searchParams.get("handle");
    const nameParam = searchParams.get("name");
    if (handleParam) {
      const clean = handleParam.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      setUsername(clean);
    }
    if (nameParam) {
      setFullName(nameParam);
    }
  }, [searchParams]);

  // Debounced username availability validation
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    if (clean.length < 3) {
      setUsernameAvailable(false);
      setUsernameError("Username must be at least 3 characters.");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(clean)) {
      setUsernameAvailable(false);
      setUsernameError("No spaces or special characters (only letters, numbers, -, _).");
      return;
    }

    setUsernameChecking(true);
    setUsernameError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: clean }),
        });
        const data = await res.json();
        if (data.available) {
          setUsernameAvailable(true);
          setUsernameError(null);
        } else {
          setUsernameAvailable(false);
          setUsernameError(data.error || "This username is already claimed.");
        }
      } catch {
        setUsernameAvailable(true);
      } finally {
        setUsernameChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  // Validation rules
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const isPasswordMatching = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (username.includes(" ")) {
      setServerError("Username cannot contain spaces.");
      return;
    }

    if (!isEmailValid) {
      setServerError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setServerError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setServerError("Please accept the Terms & Conditions to create your store.");
      return;
    }

    if (!isSupabaseConfigured()) {
      router.push("/dashboard");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const cleanUsername = username.trim().toLowerCase();
      const cleanEmail = email.trim().toLowerCase();
      const siteUrl = getSiteUrl();

      // Sign up through Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
          data: {
            full_name: fullName.trim(),
            username: cleanUsername,
          },
        },
      });

      if (error) {
        setServerError(error.message);
        setIsLoading(false);
        return;
      }

      // Check if email confirmation is required or already confirmed
      const user = data.user;
      if (user && !user.email_confirmed_at) {
        router.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}&username=${encodeURIComponent(cleanUsername)}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred during sign up.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200/90 shadow-card">
      {serverError && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold block">Registration Error</span>
            <span className="text-rose-700 leading-relaxed">{serverError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Full Name or Brand Name
          </label>
          <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Alisha Mehta or The Butter Room"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm font-medium text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Username / Store Handle */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Store Handle / Username
          </label>
          <div className="flex items-center rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 px-3.5 py-2.5 transition-all">
            <span className="text-xs sm:text-sm font-semibold text-charcoal-400 select-none mr-1">
              sellnest.store/
            </span>
            <input
              type="text"
              required
              placeholder="yourname"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
              }
              className="w-full bg-transparent text-sm font-bold text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
            />
            {usernameChecking && (
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0 ml-2" />
            )}
            {!usernameChecking && usernameAvailable === true && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Available
              </span>
            )}
          </div>
          {usernameError && (
            <p className="mt-1.5 text-[11px] text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{usernameError}</span>
            </p>
          )}
          {!usernameError && (
            <p className="mt-1 text-[10px] text-charcoal-500">
              Your store's permanent address. Use letters, numbers, hyphens, and underscores.
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Email Address
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
          {email && !isEmailValid && (
            <p className="mt-1 text-[11px] text-rose-600">Please enter a valid email address.</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Password (minimum 8 characters)
          </label>
          <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm font-medium text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-charcoal-700"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password && password.length < 8 && (
            <p className="mt-1 text-[11px] text-rose-600">
              Password must contain at least 8 characters ({password.length}/8).
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm font-medium text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-charcoal-700"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && !isPasswordMatching && (
            <p className="mt-1 text-[11px] text-rose-600">Passwords do not match.</p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 text-xs text-charcoal-600 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
            />
            <span>
              I agree to SellNest's{" "}
              <Link href="/terms" target="_blank" className="font-semibold text-purple-700 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="font-semibold text-purple-700 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating your store...</span>
              </>
            ) : (
              <>
                <span>Create Your Free Store</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 pt-5 border-t border-stone-100 text-center">
        <p className="text-xs text-charcoal-600">
          Already have a SellNest account?{" "}
          <Link
            href="/login"
            className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 transition-colors"
          >
            Sign in to your Seller Studio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/30 to-amber-100/20 blur-3xl rounded-full" />
      </div>

      {/* Header with SellNest Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-transform active:scale-95">
          <Logo size="lg" />
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-950">
          Claim your corner of the internet
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-charcoal-600">
          Create your free SellNest storefront in under 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl border border-stone-200 shadow-card flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          }
        >
          <SignUpContent />
        </Suspense>

        {/* Back to Home Link */}
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
