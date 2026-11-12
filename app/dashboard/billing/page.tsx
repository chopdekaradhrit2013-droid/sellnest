"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Info,
  Lock,
  Copy,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import {
  PLANS,
  PlanId,
  PlanConfig,
  BillingInvoice,
  SubscriptionUpgradeRequest,
  getPlanConfig,
} from "@/lib/plans";
import { PAYMENT_CONFIG, isAuthorizedAdmin } from "@/lib/paymentConfig";
import { formatINR, copyToClipboard } from "@/lib/utils";

export default function BillingPage() {
  const { store, user, subscription, plan, refreshSubscription, loading: contextLoading } =
    useDashboard();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [upgradeRequests, setUpgradeRequests] = useState<SubscriptionUpgradeRequest[]>([]);

  // Upgrade & Downgrade modal states
  const [targetPlanToChange, setTargetPlanToChange] = useState<PlanConfig | null>(null);
  const [modalType, setModalType] = useState<"upgrade" | "downgrade" | null>(null);
  const [receiptModalInvoice, setReceiptModalInvoice] = useState<BillingInvoice | null>(null);

  // Manual payment form fields
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentProofBase64, setPaymentProofBase64] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [submittingUpgradeReq, setSubmittingUpgradeReq] = useState(false);
  const [submittedConfirmation, setSubmittedConfirmation] = useState<SubscriptionUpgradeRequest | null>(
    null
  );

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Downgrade processing state
  const [processingDowngrade, setProcessingDowngrade] = useState(false);

  // Toast / feedback state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
  } | null>(null);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [resSub, resReqs] = await Promise.all([
        fetch("/api/subscriptions/current"),
        fetch(`/api/subscriptions/upgrade-request?storeId=${store?.id || ""}`),
      ]);

      if (resSub.ok) {
        const data = await resSub.json();
        if (data.usage) {
          setProductCount(data.usage.productsCount || 0);
        }
        if (data.invoices) {
          setInvoices(data.invoices);
        }
      }

      if (resReqs.ok) {
        const reqData = await resReqs.json();
        if (reqData.requests) {
          setUpgradeRequests(reqData.requests);
        }
      }
    } catch (err) {
      console.error("Failed to load billing details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    if (user) {
      setSellerName(user.full_name || "");
      setSellerEmail(user.email || "");
    }
    setPaymentDate(new Date().toISOString().split("T")[0]);
  }, [store?.id, user]);

  const handleCopyText = (text: string, key: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenModal = (target: PlanConfig) => {
    if (target.id === plan.id) return;

    const planRanks: Record<PlanId, number> = { free: 0, starter: 1, pro: 2 };
    const currentRank = planRanks[plan.id];
    const targetRank = planRanks[target.id];

    setTargetPlanToChange(target);

    if (targetRank > currentRank) {
      // Manual Payment Upgrade Flow
      setModalType("upgrade");
      setSubmittedConfirmation(null);
      setTransactionRef("");
      setPaymentProofBase64(null);
      setProofFileName(null);
    } else {
      // Free / Downgrade Flow
      setModalType("downgrade");
    }
  };

  // Image upload handler with size validation (<= 5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProofBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Manual Upgrade Request
  const handleSubmitUpgradeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlanToChange || !store?.id) return;

    if (!transactionRef.trim() || transactionRef.trim().length < 5) {
      setFeedback({
        type: "error",
        title: "Transaction Reference Required",
        message: "Please enter a valid Transaction Reference / UTR number from your payment app.",
      });
      return;
    }

    setSubmittingUpgradeReq(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/subscriptions/upgrade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          sellerName: sellerName || user?.full_name || "Seller",
          sellerEmail: sellerEmail || user?.email || "",
          targetPlanId: targetPlanToChange.id,
          paymentMethod: PAYMENT_CONFIG.paymentMethod,
          transactionReference: transactionRef.trim(),
          paymentDate: paymentDate || new Date().toISOString().split("T")[0],
          paymentProofUrl: paymentProofBase64 || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setFeedback({
          type: "error",
          title: "Submission Error",
          message: result.error || "Failed to submit upgrade request.",
        });
      } else {
        // Successful submission -> Show Confirmation Screen
        setSubmittedConfirmation(result.request);
        await fetchSubscriptionData();
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        title: "Network Error",
        message: err.message || "Failed to connect to verification server.",
      });
    } finally {
      setSubmittingUpgradeReq(false);
    }
  };

  // Downgrade confirmation (e.g. Starter -> Free)
  const handleConfirmDowngrade = async () => {
    if (!targetPlanToChange || !store?.id) return;

    setProcessingDowngrade(true);
    try {
      const res = await fetch("/api/subscriptions/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: targetPlanToChange.id,
          storeId: store.id,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        setFeedback({
          type: "error",
          title: "Downgrade Failed",
          message: result.error || "Could not complete downgrade.",
        });
      } else {
        await refreshSubscription();
        await fetchSubscriptionData();
        setFeedback({
          type: "info",
          title: `Switched to ${targetPlanToChange.name}`,
          message: result.message || "Your storefront plan has been updated.",
        });
        setModalType(null);
        setTargetPlanToChange(null);
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        title: "Error",
        message: err.message || "Failed to process plan switch.",
      });
    } finally {
      setProcessingDowngrade(false);
    }
  };

  const currentPlanMax = plan.limits.maxProducts;
  const isUnlimited = !isFinite(currentPlanMax);
  const usagePercentage = isUnlimited
    ? 0
    : Math.min(100, Math.round((productCount / currentPlanMax) * 100));

  const pendingUpgradeRequest = upgradeRequests.find((r) => r.status === "pending");

  if (contextLoading || loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading plan & billing details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between shadow-subtle transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
              : feedback.type === "error"
              ? "bg-rose-50/90 border-rose-200 text-rose-950"
              : "bg-purple-50/90 border-purple-200 text-purple-950"
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : feedback.type === "error" ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold">{feedback.title}</h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{feedback.message}</p>
            </div>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-0.5 rounded-lg"
          >
            &times;
          </button>
        </div>
      )}

      {/* PENDING VERIFICATION TOP ALERT BANNER */}
      {pendingUpgradeRequest && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Pending Verification
                </span>
                <span className="font-mono text-xs font-bold text-charcoal-900">
                  Ref #{pendingUpgradeRequest.request_number}
                </span>
              </div>
              <p className="text-xs font-semibold text-charcoal-900">
                Upgrade request for the{" "}
                <strong className="text-purple-700 uppercase">
                  {pendingUpgradeRequest.target_plan_id} Plan
                </strong>{" "}
                is currently under review.
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Your plan upgrade will be processed within {PAYMENT_CONFIG.processingPromiseHours}{" "}
                hours after payment verification. If your upgrade hasn&apos;t been completed within 24
                hours, contact{" "}
                <a
                  href={`mailto:${PAYMENT_CONFIG.supportEmail}`}
                  className="font-bold underline hover:text-amber-950"
                >
                  {PAYMENT_CONFIG.supportEmail}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-charcoal-800">
              UTR: {pendingUpgradeRequest.transaction_reference}
            </span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Plans & Billing
            </h1>
            <span className="text-xs font-semibold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
              Subscription Management
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl">
            Manage your SellNest storefront tier, view usage entitlements, and submit plan upgrades
            via manual payment verification.
          </p>
        </div>

        {/* Admin Portal Quick Switcher (visible for administrative testing / evaluation) */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/subscriptions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Verification Portal &rarr;</span>
          </Link>
        </div>
      </div>

      {/* 1. CURRENT PLAN SUMMARY CARD */}
      <div className="bg-gradient-to-br from-white via-white to-purple-50/40 rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Plan Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Current Active Subscription
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-extrabold text-charcoal-950 tracking-tight">
                {plan.name} Plan
              </h2>
              <span className="text-base font-semibold text-charcoal-500">
                {plan.priceMonthly === 0 ? "Free forever" : `₹${plan.priceMonthly}/month`}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl leading-relaxed">
              {plan.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-charcoal-500">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                <span>1 Online Storefront</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>0% Transaction Commission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                <span>Payment: Manual Verification ({PAYMENT_CONFIG.paymentMethod})</span>
              </div>
            </div>
          </div>

          {/* Catalog Usage Progress Box */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-800">Catalog Capacity</span>
              <span className="font-semibold text-charcoal-500 font-mono">
                {isUnlimited ? (
                  <span className="text-purple-700 font-bold">{productCount} (Unlimited)</span>
                ) : (
                  `${productCount} / ${currentPlanMax} products`
                )}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isUnlimited
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 w-full"
                    : usagePercentage >= 100
                    ? "bg-rose-500"
                    : usagePercentage >= 80
                    ? "bg-amber-500"
                    : "bg-purple-600"
                }`}
                style={{ width: isUnlimited ? "100%" : `${Math.max(usagePercentage, 5)}%` }}
              />
            </div>

            <p className="text-[11px] text-charcoal-500 leading-snug">
              {isUnlimited
                ? "You have full freedom to list as many items as you want."
                : productCount >= currentPlanMax
                ? "⚠️ You have reached your product cap. Upgrade to add more items."
                : `You can list ${currentPlanMax - productCount} more products on this plan.`}
            </p>

            {plan.id !== "pro" && (
              <button
                type="button"
                onClick={() =>
                  handleOpenModal(plan.id === "free" ? PLANS.starter : PLANS.pro)
                }
                className="w-full text-center text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200/80 py-2 rounded-xl transition-colors"
              >
                Upgrade for more capacity &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PLAN COMPARISON CARDS */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal-950">Select a Subscription Tier</h3>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Upgrade your store securely. Manual payments are verified and activated within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["free", "starter", "pro"] as PlanId[]).map((pid) => {
            const p = PLANS[pid];
            const isCurrent = plan.id === pid;
            const isTargetPending = pendingUpgradeRequest?.target_plan_id === pid;

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative ${
                  isCurrent
                    ? "bg-white border-2 border-purple-600 shadow-purple-glow ring-2 ring-purple-100"
                    : p.popular
                    ? "bg-white border border-purple-300 shadow-card hover:border-purple-500"
                    : "bg-white border border-stone-200/90 shadow-subtle hover:border-stone-300 hover:shadow-card"
                }`}
              >
                {/* Popular / Active Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                      Active Plan
                    </span>
                  </div>
                )}
                {!isCurrent && isTargetPending && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Verification Pending
                    </span>
                  </div>
                )}
                {!isCurrent && p.popular && !isTargetPending && (
                  <div className="absolute -top-3 right-6">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-charcoal-950">{p.name}</h4>
                    {p.badge && !isCurrent && !p.popular && (
                      <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-charcoal-500 min-h-[36px] leading-relaxed">
                    {p.tagline}
                  </p>

                  <div className="my-5 pb-5 border-b border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-charcoal-950 font-sans">
                        ₹{p.priceMonthly}
                      </span>
                      <span className="text-xs font-semibold text-charcoal-400">/month</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      Verified payment via UPI / Bank Transfer
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                      Included features:
                    </p>
                    <ul className="space-y-2.5">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-charcoal-700">
                          <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-2">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 cursor-default"
                    >
                      Currently Subscribed
                    </button>
                  ) : isTargetPending ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Verification</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenModal(p)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        p.popular || pid === "pro"
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-charcoal-900 hover:bg-black text-white"
                      }`}
                    >
                      <span>
                        {pid === "free"
                          ? "Downgrade to Free"
                          : `Upgrade to ${p.name}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. UPGRADE REQUESTS & VERIFICATION STATUS TABLE */}
      {upgradeRequests.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-charcoal-950">
                Upgrade Requests & Verification Status
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-500">
                Track your manual payment verification requests and approval history.
              </p>
            </div>
            <span className="text-xs text-charcoal-400 font-mono">
              {upgradeRequests.length} {upgradeRequests.length === 1 ? "request" : "requests"} logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 pl-4">Request Ref</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Requested Plan</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Transaction UTR</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 pr-4">Details / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {upgradeRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-bold text-charcoal-900">
                      {req.request_number}
                    </td>
                    <td className="py-3.5 text-charcoal-600">
                      {new Date(req.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 font-bold text-purple-700 uppercase">
                      {req.target_plan_id} Plan
                    </td>
                    <td className="py-3.5 font-bold text-charcoal-950 font-sans">
                      {formatINR(req.amount)}
                    </td>
                    <td className="py-3.5 font-mono text-charcoal-700">
                      {req.transaction_reference}
                    </td>
                    <td className="py-3.5">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending Verification
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Approved & Active
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-charcoal-600">
                      {req.status === "pending" && (
                        <span className="text-[11px] text-amber-700">
                          Verification in progress (&le; 24h)
                        </span>
                      )}
                      {req.status === "approved" && req.activated_at && (
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          Activated on{" "}
                          {new Date(req.activated_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <div className="text-[11px] text-rose-700 font-medium max-w-xs">
                          {req.rejection_reason || "Payment could not be verified."}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. COMPREHENSIVE FEATURE COMPARISON MATRIX */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-6">
        <div>
          <h3 className="text-lg font-bold text-charcoal-950">Detailed Feature Comparison</h3>
          <p className="text-xs sm:text-sm text-charcoal-500">
            Compare all entitlements, quotas and exclusive perks side by side.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-3.5 pl-4 font-bold text-charcoal-900 w-2/5">Platform Features</th>
                <th className="py-3.5 px-4 text-center font-bold text-charcoal-700 w-1/5">
                  Free (₹0)
                </th>
                <th className="py-3.5 px-4 text-center font-bold text-purple-700 w-1/5 bg-purple-50/50 rounded-t-xl">
                  Starter (₹99)
                </th>
                <th className="py-3.5 pr-4 text-center font-bold text-charcoal-900 w-1/5">
                  Pro (₹199)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {/* Category: Storefront & Catalog */}
              <tr className="bg-stone-50/80">
                <td colSpan={4} className="py-2.5 pl-4 font-bold text-[11px] uppercase tracking-wider text-charcoal-500">
                  Storefront & Catalog
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Online Storefronts</td>
                <td className="py-3 px-4 text-center text-charcoal-600">1 Store</td>
                <td className="py-3 px-4 text-center font-semibold text-purple-900 bg-purple-50/30">1 Store</td>
                <td className="py-3 pr-4 text-center font-semibold text-charcoal-900">1 Store</td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Product Catalog Limit</td>
                <td className="py-3 px-4 text-center font-semibold text-charcoal-700">Up to 10 products</td>
                <td className="py-3 px-4 text-center font-bold text-purple-700 bg-purple-50/30">
                  Up to 100 products
                </td>
                <td className="py-3 pr-4 text-center font-black text-emerald-700">
                  Unlimited products
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Public Custom Store URL</td>
                <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>

              {/* Category: Themes & Branding */}
              <tr className="bg-stone-50/80">
                <td colSpan={4} className="py-2.5 pl-4 font-bold text-[11px] uppercase tracking-wider text-charcoal-500">
                  Design & Customization
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Curated Store Themes</td>
                <td className="py-3 px-4 text-center text-charcoal-600">2 Themes (Minimal, Modern)</td>
                <td className="py-3 px-4 text-center font-semibold text-purple-900 bg-purple-50/30">
                  All 4 Themes (incl. Boutique & Playful)
                </td>
                <td className="py-3 pr-4 text-center font-semibold text-charcoal-900">
                  All 4 Themes + Future Releases
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Custom Brand Colors & Fonts</td>
                <td className="py-3 px-4 text-center text-stone-300">&mdash;</td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Featured Product Highlights</td>
                <td className="py-3 px-4 text-center text-stone-300">&mdash;</td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>

              {/* Category: Orders & Checkout */}
              <tr className="bg-stone-50/80">
                <td colSpan={4} className="py-2.5 pl-4 font-bold text-[11px] uppercase tracking-wider text-charcoal-500">
                  Orders & Operations
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Direct WhatsApp Ordering</td>
                <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Public Customer Order Tracking</td>
                <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Order Status Management</td>
                <td className="py-3 px-4 text-center text-charcoal-600">Basic</td>
                <td className="py-3 px-4 text-center font-semibold text-purple-900 bg-purple-50/30">Advanced</td>
                <td className="py-3 pr-4 text-center font-semibold text-charcoal-900">Advanced + Priority Filter</td>
              </tr>

              {/* Category: Analytics & Insights */}
              <tr className="bg-stone-50/80">
                <td colSpan={4} className="py-2.5 pl-4 font-bold text-[11px] uppercase tracking-wider text-charcoal-500">
                  Analytics & Growth
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Core Dashboard Revenue & Orders</td>
                <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Sales Velocity & Product Trends</td>
                <td className="py-3 px-4 text-center text-stone-300">&mdash;</td>
                <td className="py-3 px-4 text-center text-emerald-600 bg-purple-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 pl-4 font-medium text-charcoal-800">Customer Insights & Repeat Buyers</td>
                <td className="py-3 px-4 text-center text-stone-300">&mdash;</td>
                <td className="py-3 px-4 text-center text-stone-300 bg-purple-50/30">&mdash;</td>
                <td className="py-3 pr-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. BILLING HISTORY & INVOICES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-charcoal-950">Billing History & Invoices</h3>
            <p className="text-xs sm:text-sm text-charcoal-500">
              Verified receipts and invoices for approved subscription charges.
            </p>
          </div>
          <span className="text-xs text-charcoal-400 font-mono">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"} on file
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-stone-50 border border-stone-200/60">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-charcoal-700">No Invoices Yet</p>
            <p className="text-[11px] text-charcoal-400 max-w-sm mx-auto mt-1">
              You are currently on the Free plan. Invoices will automatically appear here once your
              upgrade payment is verified.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 pl-4">Invoice #</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Plan</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Payment Method</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-bold text-charcoal-900">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3.5 text-charcoal-600">
                      {new Date(inv.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 font-bold text-purple-700 uppercase text-[11px]">
                      {inv.plan_id}
                    </td>
                    <td className="py-3.5 font-bold text-charcoal-950 font-sans">
                      {formatINR(inv.amount)}
                    </td>
                    <td className="py-3.5 text-charcoal-600">{inv.payment_method}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => setReceiptModalInvoice(inv)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                      >
                        <Download className="w-3 h-3" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MANUAL PAYMENT UPGRADE WORKFLOW MODAL */}
      {/* ============================================================== */}
      {modalType === "upgrade" && targetPlanToChange && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95">
            {!submittedConfirmation ? (
              // STEP 1 & 2: INSTRUCTIONS & VERIFICATION SUBMISSION FORM
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        Manual Verification Upgrade
                      </span>
                      <h3 className="text-xl font-extrabold text-charcoal-950 mt-1">
                        Upgrade to {targetPlanToChange.name} Plan
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalType(null);
                      setTargetPlanToChange(null);
                    }}
                    className="text-stone-400 hover:text-stone-600 text-xl font-bold px-2"
                  >
                    &times;
                  </button>
                </div>

                {/* Plan Price Pill */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-purple-900 font-semibold">Total Amount to Pay</span>
                    <div className="text-3xl font-black text-purple-950 font-sans mt-0.5">
                      ₹{targetPlanToChange.priceMonthly}
                      <span className="text-xs font-semibold text-purple-700 font-normal"> / month</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-800 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-xs">
                    0% Convenience Fee
                  </span>
                </div>

                {/* Step 1: Configurable Payment Instructions & Accounts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Step 1: Make Payment Using Configured Methods
                  </h4>

                  {/* Payment Accounts Box */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                    {/* UPI Details */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-charcoal-400">
                          Primary Method: UPI VPA
                        </span>
                        <div className="font-mono font-bold text-charcoal-900 text-sm mt-0.5">
                          {PAYMENT_CONFIG.upiId}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(PAYMENT_CONFIG.upiId, "upi")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-charcoal-700 font-bold hover:bg-stone-100 text-[11px] transition-colors"
                      >
                        {copiedKey === "upi" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedKey === "upi" ? "Copied" : "Copy UPI"}</span>
                      </button>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-1.5 pt-1 text-charcoal-700">
                      <div className="text-[10px] uppercase font-bold text-charcoal-400">
                        Alternative Method: Direct Bank Transfer (NEFT/IMPS)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-charcoal-400">Account Name:</span>{" "}
                          <span className="font-semibold text-charcoal-900">
                            {PAYMENT_CONFIG.bankDetails.accountName}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-400">Bank:</span>{" "}
                          <span className="font-semibold text-charcoal-900">
                            {PAYMENT_CONFIG.bankDetails.bankName}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-400">Account #:</span>{" "}
                          <span className="font-mono font-bold text-charcoal-900">
                            {PAYMENT_CONFIG.bankDetails.accountNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-400">IFSC Code:</span>{" "}
                          <span className="font-mono font-bold text-charcoal-900">
                            {PAYMENT_CONFIG.bankDetails.ifscCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Instructions */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold">Instructions for fast verification:</p>
                    <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                      <li>Pay exact ₹{targetPlanToChange.priceMonthly} via any UPI app or Net Banking.</li>
                      <li>Copy the 12-digit UTR / Transaction Reference from your payment screen.</li>
                      <li>
                        Plans are activated within {PAYMENT_CONFIG.processingPromiseHours} hours after
                        admin verification.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 2: Verification Submission Form */}
                <form onSubmit={handleSubmitUpgradeRequest} className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Step 2: Submit Payment Reference for Verification
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Seller / Business Name
                      </label>
                      <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 bg-stone-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Selected Plan
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${targetPlanToChange.name} Plan (₹${targetPlanToChange.priceMonthly}/mo)`}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-100 text-charcoal-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Transaction Reference / UTR <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 431289012384 or Ref #"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-charcoal-700 block mb-1">
                        Payment Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* Optional Payment Screenshot Upload */}
                  <div>
                    <label className="font-bold text-charcoal-700 block mb-1 text-xs">
                      Payment Screenshot / Proof <span className="text-stone-400 font-normal">(Optional, helps faster approval)</span>
                    </label>

                    {paymentProofBase64 ? (
                      <div className="p-3 rounded-2xl border border-purple-200 bg-purple-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={paymentProofBase64}
                            alt="Screenshot preview"
                            className="w-12 h-12 rounded-lg object-cover border border-purple-200"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-charcoal-900 block truncate">
                              {proofFileName || "screenshot.png"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              Attached successfully
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProofBase64(null);
                            setProofFileName(null);
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-stone-200 hover:border-purple-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-50/60">
                        <Upload className="w-5 h-5 text-stone-400 mb-1" />
                        <span className="text-xs font-bold text-charcoal-700">
                          Click to upload payment screenshot
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">
                          PNG, JPG or JPEG up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType(null);
                        setTargetPlanToChange(null);
                      }}
                      disabled={submittingUpgradeReq}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingUpgradeReq || !transactionRef.trim()}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submittingUpgradeReq ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit for Verification</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // STEP 3: CONFIRMATION SCREEN (EXACT SPECIFICATION)
              <div className="space-y-6 text-center animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-charcoal-950">
                    Your upgrade request has been submitted successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-medium max-w-md mx-auto">
                    Your plan upgrade will be processed within {PAYMENT_CONFIG.processingPromiseHours}{" "}
                    hours after payment verification.
                  </p>
                  <p className="text-xs text-charcoal-500 max-w-md mx-auto pt-1 leading-relaxed">
                    If your upgrade hasn&apos;t been completed within 24 hours, contact{" "}
                    <a
                      href={`mailto:${PAYMENT_CONFIG.supportEmail}`}
                      className="font-bold text-purple-700 underline hover:text-purple-900"
                    >
                      {PAYMENT_CONFIG.supportEmail}
                    </a>
                    .
                  </p>
                </div>

                {/* Reference Details Box */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-charcoal-500">Requested Plan</span>
                    <span className="font-bold text-purple-700 uppercase">
                      {submittedConfirmation.target_plan_id} Plan (₹{submittedConfirmation.amount}/mo)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-charcoal-500">Request Reference Number</span>
                    <span className="font-mono font-bold text-charcoal-900 text-sm">
                      {submittedConfirmation.request_number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-charcoal-500">Transaction Reference / UTR</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {submittedConfirmation.transaction_reference}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-charcoal-500">Status</span>
                    <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                      Pending Verification
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalType(null);
                      setSubmittedConfirmation(null);
                      setTargetPlanToChange(null);
                    }}
                    className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Return to Billing Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DOWNGRADE WARNING MODAL */}
      {modalType === "downgrade" && targetPlanToChange && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Plan Downgrade Notice
                </span>
                <h3 className="text-xl font-extrabold text-charcoal-950 mt-1">
                  Downgrade to {targetPlanToChange.name}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2 text-xs leading-relaxed">
              <p className="font-bold">
                Important: Your existing products and customer data will NOT be deleted.
              </p>
              <p>
                {productCount > targetPlanToChange.limits.maxProducts
                  ? `You currently have ${productCount} products. The ${targetPlanToChange.name} plan supports up to ${targetPlanToChange.limits.maxProducts} products. Your existing products remain active online, but you will not be able to add new products until you reduce your catalog or upgrade again.`
                  : `Your product limit will be adjusted to ${targetPlanToChange.limits.maxProducts} products, and plan-specific features (such as premium themes or advanced analytics) will be locked.`}
              </p>
            </div>

            <p className="text-xs text-charcoal-500">
              Are you sure you want to proceed with downgrading to the {targetPlanToChange.name} plan?
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setTargetPlanToChange(null);
                }}
                disabled={processingDowngrade}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={handleConfirmDowngrade}
                disabled={processingDowngrade}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-charcoal-900 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processingDowngrade ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm Downgrade</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT VIEW MODAL */}
      {receiptModalInvoice && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                  Payment Receipt
                </span>
                <h4 className="text-lg font-bold text-charcoal-950 mt-0.5">
                  {receiptModalInvoice.invoice_number}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModalInvoice(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold px-2"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-500">Store</span>
                <span className="font-bold text-charcoal-900">{store?.name || "The Butter Room"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-500">Plan</span>
                <span className="font-bold text-purple-700 uppercase">
                  {receiptModalInvoice.plan_id} Plan
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-500">Date</span>
                <span className="font-semibold text-charcoal-800">
                  {new Date(receiptModalInvoice.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-500">Payment Method</span>
                <span className="font-semibold text-charcoal-800">
                  {receiptModalInvoice.payment_method}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold">
                <span className="text-charcoal-900">Total Paid</span>
                <span className="text-purple-700 font-sans">
                  {formatINR(receiptModalInvoice.amount)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 text-[11px] text-charcoal-500 text-center leading-relaxed">
              This is a verified receipt for manual payment on SellNest.
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print or Save PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
