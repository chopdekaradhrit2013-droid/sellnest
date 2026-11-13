"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Phone, ArrowRight, RefreshCw } from "lucide-react";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  onVerified: (verifiedPhone: string) => void;
  title?: string;
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  initialPhone = "",
  onVerified,
  title = "Verify Your Mobile Number",
}: PhoneVerificationModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (initialPhone) {
      setPhone(initialPhone.replace(/[^0-9]/g, ""));
    }
  }, [initialPhone]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep("otp");
        setCountdown(45);
        setInfoMessage(data.message || `Code sent to ${phone}`);
      } else {
        setErrorMessage(data.error || "Failed to send verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep("success");
        setTimeout(() => {
          onVerified(phone);
          onClose();
        }, 1200);
      } else {
        setErrorMessage(data.message || data.error || "Invalid verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Twilio Secure OTP
              </span>
              <h3 className="text-xl font-bold text-charcoal-900 tracking-tight mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Enter your mobile number to receive a 6-digit one-time password (OTP) via SMS.
              </p>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-stone-50/50 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <span className="text-charcoal-500 font-bold mr-2 select-none">🇮🇳 +91</span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-transparent text-sm font-semibold text-charcoal-900 placeholder:text-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Enter the 6-digit code sent to <strong className="text-charcoal-900">+91 {phone}</strong>.
              </p>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full text-center tracking-[0.5em] text-lg font-bold rounded-xl border border-stone-300 py-3 bg-stone-50/50 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-charcoal-900 transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-stone-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify Code</span>}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-stone-500 hover:text-stone-800 font-medium"
                >
                  Edit number
                </button>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => handleSendOtp()}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold disabled:opacity-40"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-charcoal-900 text-lg">Verified Successfully!</h4>
              <p className="text-xs text-charcoal-500">Your phone number is confirmed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

