"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(errorParam);
  const [successMessage, setSuccessMessage] = useState<string | null>(messageParam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setErrorMessage("Please enter your username/email and password.");
      return;
    }

    if (!isSupabaseConfigured()) {
      if (password.length >= 6) {
        router.push(nextUrl);
        return;
      }
      setErrorMessage("Please enter a valid password (at least 6 characters).");
      return;
    }

    setIsLoading(true);

    try {
      let resolvedEmail = cleanIdentifier;

      // 1. Resolve username to email if identifier is not an email
      if (!cleanIdentifier.includes("@")) {
        const lookupRes = await fetch("/api/auth/lookup-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: cleanIdentifier }),
        });

        const lookupData = await lookupRes.json();
        if (!lookupRes.ok || !lookupData.email) {
          setErrorMessage(
            lookupData.error ||
              "No account found with this username. Please check your spelling or use your registered email."
          );
          setIsLoading(false);
          return;
        }

        resolvedEmail = lookupData.email;
      }

      // 2. Sign in with Supabase Auth
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          router.push(`/verify-email?email=${encodeURIComponent(resolvedEmail)}`);
          return;
        }
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage(
            "Invalid email or password. If you haven't created your SellNest store account yet, please create your account on the Sign Up page first!"
          );
        } else {
          setErrorMessage(error.message || "Invalid credentials. Please verify your username, email, or password.");
        }
        setIsLoading(false);
        return;
      }

      // 3. Check if user email is verified (exempt platform super administrator)
      const isSuperAdmin = resolvedEmail.toLowerCase().trim() === "chopdekaradhrit2013@gmail.com";
      if (data.user && !data.user.email_confirmed_at && !isSuperAdmin) {
        router.push(`/verify-email?email=${encodeURIComponent(data.user.email || resolvedEmail)}`);
        return;
      }

      // 4. Successful login -> redirect to destination
      router.push(nextUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200/90 shadow-card">
      {errorMessage && (
        <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold block">Authentication Error</span>
            <span className="text-rose-700 leading-relaxed">{errorMessage}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold block">Notice</span>
            <span className="text-emerald-700 leading-relaxed">{successMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username or Email */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Username or Email Address
          </label>
          <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="yourname or you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm font-medium text-charcoal-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
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
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black disabled:opacity-60 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-sm hover:shadow-purple-glow transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Seller Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Create Account Link */}
      <div className="mt-6 pt-5 border-t border-stone-100 text-center">
        <p className="text-xs text-charcoal-600">
          Don't have a SellNest store yet?{" "}
          <Link
            href="/signup"
            className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 transition-colors"
          >
            Create your free store
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          Welcome back to SellNest
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-charcoal-600">
          Sign in to access your Seller Studio and manage orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl border border-stone-200 shadow-card flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          }
        >
          <LoginContent />
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
