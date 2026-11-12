"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  FileText,
  User,
  Store,
  CreditCard,
  Sparkles,
  Download,
  Loader2,
  Lock,
} from "lucide-react";
import { SubscriptionUpgradeRequest } from "@/lib/plans";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";
import { formatINR, copyToClipboard } from "@/lib/utils";

export default function AdminSubscriptionsPage() {
  const [requests, setRequests] = useState<SubscriptionUpgradeRequest[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalVerifiedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Action modals
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionUpgradeRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [proofModalUrl, setProofModalUrl] = useState<string | null>(null);

  // Copied state
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/subscriptions?status=all&email=${encodeURIComponent(PAYMENT_CONFIG.supportEmail)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests(data.requests || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleOpenActionModal = (req: SubscriptionUpgradeRequest, type: "approve" | "reject") => {
    setSelectedRequest(req);
    setActionType(type);
    setRejectionReason(
      type === "reject"
        ? "Payment reference could not be verified against bank records. Please re-check your 12-digit UTR."
        : ""
    );
  };

  const handleExecuteAction = async () => {
    if (!selectedRequest || !actionType) return;

    setSubmittingAction(true);
    try {
      const res = await fetch("/api/admin/subscriptions/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action: actionType,
          rejectionReason: actionType === "reject" ? rejectionReason : undefined,
          adminEmail: PAYMENT_CONFIG.supportEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setToastMessage({
          type: "error",
          text: data.error || `Failed to ${actionType} request.`,
        });
      } else {
        setToastMessage({
          type: "success",
          text:
            actionType === "approve"
              ? `Request ${selectedRequest.request_number} approved! Plan activated successfully.`
              : `Request ${selectedRequest.request_number} rejected. Seller has been notified.`,
        });
        setActionType(null);
        setSelectedRequest(null);
        await fetchAdminRequests();
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err.message || "Network error while processing review.",
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filterStatus === "all" || r.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.request_number.toLowerCase().includes(q) ||
      r.seller_name.toLowerCase().includes(q) ||
      r.seller_email.toLowerCase().includes(q) ||
      (r.store_name && r.store_name.toLowerCase().includes(q)) ||
      r.transaction_reference.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-charcoal-900 font-sans pb-20">
      {/* Top Admin Header */}
      <header className="bg-charcoal-950 text-white border-b border-charcoal-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-purple-glow">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  SellNest Admin
                </span>
                <span className="bg-purple-900/80 text-purple-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-purple-700">
                  Manual Verification Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Logged in as: <strong className="text-stone-300">{PAYMENT_CONFIG.supportEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminRequests}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-charcoal-800 transition-colors"
              title="Refresh requests"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
            </button>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-stone-200 text-xs font-semibold border border-charcoal-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Seller Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between shadow-subtle ${
              toastMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-bold">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2"
            >
              &times;
            </button>
          </div>
        )}

        {/* Top Info Banner */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-purple-950">
                Security Policy: Manual Payment Verification
              </p>
              <p className="text-[11px] text-purple-800 mt-0.5">
                Every transaction reference / UTR must be verified against bank statements before
                approval. Plans are activated strictly on administrator approval.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shrink-0">
            Promise: &le; 24h turnaround
          </span>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Pending Verification
              </span>
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-amber-600">{stats.pending}</div>
            <span className="text-[11px] text-charcoal-500">Requires bank verification</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Approved & Activated
              </span>
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">{stats.approved}</div>
            <span className="text-[11px] text-charcoal-500">Subscriptions live</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Rejected Requests
              </span>
              <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                <XCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-rose-600">{stats.rejected}</div>
            <span className="text-[11px] text-charcoal-500">Invalid UTR / unpaid</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Verified Revenue
              </span>
              <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                ₹
              </span>
            </div>
            <div className="text-3xl font-extrabold text-charcoal-950 font-sans">
              {formatINR(stats.totalVerifiedRevenue)}
            </div>
            <span className="text-[11px] text-charcoal-500">Total collected via UPI/Bank</span>
          </div>
        </div>

        {/* Requests Management Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold text-charcoal-600">
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  filterStatus === "pending"
                    ? "bg-white text-amber-900 shadow-xs"
                    : "hover:text-charcoal-900"
                }`}
              >
                <span>Pending Verification</span>
                {stats.pending > 0 && (
                  <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === "approved"
                    ? "bg-white text-emerald-900 shadow-xs"
                    : "hover:text-charcoal-900"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilterStatus("rejected")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === "rejected"
                    ? "bg-white text-rose-900 shadow-xs"
                    : "hover:text-charcoal-900"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === "all" ? "bg-white text-charcoal-900 shadow-xs" : "hover:text-charcoal-900"
                }`}
              >
                All ({stats.total})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UTR, seller name, or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 hover:bg-stone-100 focus:bg-white pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
              <p className="text-xs font-semibold text-charcoal-500">Loading upgrade requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
              <FileText className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-charcoal-700">No requests in this view</p>
              <p className="text-[11px] text-charcoal-400 max-w-sm mx-auto">
                {filterStatus === "pending"
                  ? "All caught up! No pending upgrade requests waiting for verification."
                  : "No requests found matching the current search criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3.5 pl-4">Request Ref</th>
                    <th className="py-3.5">Seller & Store</th>
                    <th className="py-3.5">Target Plan</th>
                    <th className="py-3.5">Transaction UTR / Ref</th>
                    <th className="py-3.5">Payment Date</th>
                    <th className="py-3.5">Proof Screenshot</th>
                    <th className="py-3.5">Status</th>
                    <th className="py-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Ref */}
                      <td className="py-4 pl-4 font-mono font-bold text-charcoal-900">
                        {req.request_number}
                        <div className="text-[10px] text-charcoal-400 font-sans font-normal">
                          {new Date(req.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Seller Info */}
                      <td className="py-4">
                        <div className="font-bold text-charcoal-900">{req.seller_name}</div>
                        <div className="text-[11px] text-charcoal-500 font-mono truncate max-w-[180px]">
                          {req.seller_email}
                        </div>
                        {req.store_name && (
                          <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                            Store: {req.store_name}
                          </div>
                        )}
                      </td>

                      {/* Plan & Amount */}
                      <td className="py-4">
                        <span className="font-bold text-purple-700 uppercase text-[11px]">
                          {req.target_plan_id} Plan
                        </span>
                        <div className="text-sm font-black text-charcoal-950 font-sans">
                          {formatINR(req.amount)}
                        </div>
                        <span className="text-[10px] text-stone-400">{req.payment_method}</span>
                      </td>

                      {/* Transaction Reference / UTR */}
                      <td className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-charcoal-900 bg-stone-100 px-2 py-1 rounded-md text-[11px] border border-stone-200">
                            {req.transaction_reference}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(req.transaction_reference)}
                            className="p-1 rounded text-stone-400 hover:text-charcoal-700 transition-colors"
                            title="Copy UTR to clipboard"
                          >
                            {copiedRef === req.transaction_reference ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 text-charcoal-700">
                        {req.payment_date || "Today"}
                      </td>

                      {/* Payment Proof */}
                      <td className="py-4">
                        {req.payment_proof_url ? (
                          <button
                            type="button"
                            onClick={() => setProofModalUrl(req.payment_proof_url || null)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">No proof attached</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        {req.status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending Verification
                          </span>
                        )}
                        {req.status === "approved" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {req.status === "rejected" && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                            {req.rejection_reason && (
                              <div
                                className="text-[10px] text-rose-700 mt-1 max-w-[160px] truncate"
                                title={req.rejection_reason}
                              >
                                {req.rejection_reason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 pr-4 text-right">
                        {req.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(req, "approve")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(req, "reject")}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : req.status === "approved" ? (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Activated
                          </span>
                        ) : (
                          <span className="text-[11px] text-charcoal-400">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* APPROVE / REJECT CONFIRMATION MODAL */}
      {actionType && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            {actionType === "approve" ? (
              // APPROVAL MODAL
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verification Approval
                    </span>
                    <h3 className="text-xl font-extrabold text-charcoal-950 mt-1">
                      Approve & Activate Plan
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Request Ref</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {selectedRequest.request_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Seller</span>
                    <span className="font-bold text-charcoal-900">
                      {selectedRequest.seller_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Target Plan</span>
                    <span className="font-bold text-purple-700 uppercase">
                      {selectedRequest.target_plan_id} (₹{selectedRequest.amount}/mo)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Transaction Reference / UTR</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {selectedRequest.transaction_reference}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Confirming approval will immediately upgrade the seller's storefront to the{" "}
                  <strong className="text-charcoal-900 uppercase">
                    {selectedRequest.target_plan_id}
                  </strong>{" "}
                  tier and generate a paid invoice.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionType(null);
                      setSelectedRequest(null);
                    }}
                    disabled={submittingAction}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteAction}
                    disabled={submittingAction}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {submittingAction ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Confirm & Activate</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // REJECTION MODAL
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      Verification Rejection
                    </span>
                    <h3 className="text-xl font-extrabold text-charcoal-950 mt-1">
                      Reject Upgrade Request
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-charcoal-600">
                  Please provide a reason. This explanation will be displayed directly to the seller
                  in their billing dashboard.
                </p>

                <div>
                  <label className="text-xs font-bold text-charcoal-700 block mb-1">
                    Rejection Reason (Visible to Seller)
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. UTR reference not found in bank statement, amount mismatch..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionType(null);
                      setSelectedRequest(null);
                    }}
                    disabled={submittingAction}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteAction}
                    disabled={submittingAction || !rejectionReason.trim()}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {submittingAction ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Confirm Rejection</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROOF SCREENSHOT VIEW MODAL */}
      {proofModalUrl && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-sm font-bold text-charcoal-900">Submitted Payment Screenshot</h4>
              <button
                type="button"
                onClick={() => setProofModalUrl(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold px-2"
              >
                &times;
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-stone-200 bg-stone-900 flex items-center justify-center p-2">
              <img
                src={proofModalUrl}
                alt="Payment proof screenshot"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={proofModalUrl}
                target="_blank"
                download="payment-proof.png"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900"
              >
                <Download className="w-4 h-4" />
                <span>Download Proof Image</span>
              </a>
              <button
                type="button"
                onClick={() => setProofModalUrl(null)}
                className="px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

