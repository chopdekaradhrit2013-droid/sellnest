"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Store,
  Package,
  Calendar,
  Lock,
  Unlock,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { SellerAdminView } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerAdminView[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [detailSeller, setDetailSeller] = useState<SellerAdminView | null>(null);
  const [suspensionModalSeller, setSuspensionModalSeller] = useState<SellerAdminView | null>(null);
  const [suspensionAction, setSuspensionAction] = useState<"suspend" | "reactivate">("suspend");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sellers");
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleOpenSuspensionModal = (seller: SellerAdminView, action: "suspend" | "reactivate") => {
    setSuspensionModalSeller(seller);
    setSuspensionAction(action);
    setSuspensionReason(
      action === "suspend"
        ? "Violation of platform terms or suspected suspicious store activity."
        : ""
    );
  };

  const handleExecuteSuspension = async () => {
    if (!suspensionModalSeller) return;

    if (suspensionAction === "suspend" && !suspensionReason.trim()) {
      alert("A suspension reason is strictly required.");
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await fetch("/api/admin/sellers/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: suspensionModalSeller.id,
          action: suspensionAction,
          reason: suspensionAction === "suspend" ? suspensionReason.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setToastMessage({ type: "error", text: data.error || "Action failed." });
      } else {
        setToastMessage({
          type: "success",
          text:
            suspensionAction === "suspend"
              ? `Account for ${suspensionModalSeller.full_name} has been suspended.`
              : `Account for ${suspensionModalSeller.full_name} has been reactivated.`,
        });
        setSuspensionModalSeller(null);
        await fetchSellers();
      }
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message || "Network error occurred." });
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.store?.name && s.store.name.toLowerCase().includes(q));

    const matchesPlan = planFilter === "all" || s.subscription_plan === planFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !s.is_suspended) ||
      (statusFilter === "suspended" && s.is_suspended);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-subtle ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
              : "bg-rose-50 border-rose-200 text-rose-950 font-bold"
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-stone-600 text-sm px-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Seller Directory
            </h1>
            <span className="text-xs font-semibold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
              {sellers.length} Registered Sellers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Manage maker accounts, inspect active catalogs, monitor subscriptions, and apply account moderation.
          </p>
        </div>

        <button
          onClick={fetchSellers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-charcoal-700 hover:bg-stone-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
          <span>Refresh Sellers</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, username, email, or store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-700 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Plans</option>
            <option value="free">Free Plan</option>
            <option value="starter">Starter Plan (₹99)</option>
            <option value="pro">Pro Plan (₹199)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-700 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Sellers</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
        </div>
      </div>

      {/* Sellers Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-charcoal-500">Loading seller directory...</p>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-stone-200 shadow-card space-y-2">
          <Users className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-charcoal-800">No sellers found</h3>
          <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
            Try adjusting your search query or filter selection.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 pl-5">Seller Profile</th>
                  <th className="py-3.5">Storefront</th>
                  <th className="py-3.5 text-center">Products</th>
                  <th className="py-3.5 text-center">Orders</th>
                  <th className="py-3.5">Subscription Plan</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Registered</th>
                  <th className="py-3.5 pr-5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Seller Profile */}
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {seller.full_name ? seller.full_name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div>
                          <div className="font-bold text-charcoal-900">{seller.full_name}</div>
                          <div className="text-[11px] text-charcoal-500 font-mono">
                            @{seller.username}
                          </div>
                          <div className="text-[10px] text-charcoal-400 font-mono">
                            {seller.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Storefront */}
                    <td className="py-4">
                      {seller.store ? (
                        <div>
                          <span className="font-bold text-charcoal-900 block">
                            {seller.store.name}
                          </span>
                          <Link
                            href={`/store/${seller.store.slug}`}
                            target="_blank"
                            className="text-[11px] text-purple-700 hover:text-purple-900 font-mono inline-flex items-center gap-1"
                          >
                            <span>/{seller.store.slug}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">No store created</span>
                      )}
                    </td>

                    {/* Product count */}
                    <td className="py-4 text-center font-bold text-charcoal-900">
                      {seller.products_count}
                    </td>

                    {/* Orders count */}
                    <td className="py-4 text-center font-bold text-charcoal-900">
                      {seller.orders_count}
                    </td>

                    {/* Plan */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          seller.subscription_plan === "pro"
                            ? "bg-purple-100 text-purple-900 border-purple-200"
                            : seller.subscription_plan === "starter"
                            ? "bg-indigo-100 text-indigo-900 border-indigo-200"
                            : "bg-stone-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        {seller.subscription_plan}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      {seller.is_suspended ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Suspended
                          </span>
                          {seller.suspended_reason && (
                            <span
                              className="text-[10px] text-rose-600 block mt-0.5 max-w-[140px] truncate"
                              title={seller.suspended_reason}
                            >
                              {seller.suspended_reason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 font-mono text-[11px] text-charcoal-500">
                      {new Date(seller.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailSeller(seller)}
                          className="px-2.5 py-1 text-xs font-semibold text-charcoal-700 hover:text-purple-700 bg-stone-100 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          Details
                        </button>

                        {seller.is_suspended ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSuspensionModal(seller, "reactivate")}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenSuspensionModal(seller, "suspend")}
                            className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SELLER DETAILS MODAL */}
      {detailSeller && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                  {detailSeller.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal-950">
                    {detailSeller.full_name}
                  </h3>
                  <div className="text-xs text-charcoal-500 font-mono">
                    @{detailSeller.username} &bull; {detailSeller.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailSeller(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold px-2"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Account ID</span>
                  <span className="font-mono text-charcoal-900 font-bold">{detailSeller.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Subscription Tier</span>
                  <span className="font-bold uppercase text-purple-700">
                    {detailSeller.subscription_plan} Plan ({detailSeller.subscription_status})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Registered On</span>
                  <span className="font-mono text-charcoal-900">
                    {new Date(detailSeller.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Account Status</span>
                  <span
                    className={`font-bold ${
                      detailSeller.is_suspended ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {detailSeller.is_suspended ? "Suspended" : "Active"}
                  </span>
                </div>
                {detailSeller.suspended_reason && (
                  <div className="pt-2 border-t border-stone-200/60">
                    <span className="text-charcoal-500 block mb-0.5">Suspension Reason:</span>
                    <span className="text-rose-700 font-medium">
                      {detailSeller.suspended_reason}
                    </span>
                  </div>
                )}
              </div>

              {detailSeller.store && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Connected Storefront
                  </span>
                  <div className="text-sm font-bold text-charcoal-950">
                    {detailSeller.store.name}
                  </div>
                  <div className="flex items-center justify-between text-charcoal-700">
                    <span>Products: {detailSeller.products_count}</span>
                    <span>Orders: {detailSeller.orders_count}</span>
                    <span>Revenue: {formatINR(detailSeller.total_revenue)}</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/store/${detailSeller.store.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-bold text-purple-700 hover:underline"
                    >
                      <span>Open live public store</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailSeller(null)}
                className="px-4 py-2 bg-charcoal-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND / REACTIVATE CONFIRMATION MODAL */}
      {suspensionModalSeller && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  suspensionAction === "suspend"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {suspensionAction === "suspend" ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <Unlock className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-charcoal-700">
                  Account Moderation
                </span>
                <h3 className="text-lg font-bold text-charcoal-950 mt-1">
                  {suspensionAction === "suspend"
                    ? `Suspend ${suspensionModalSeller.full_name}?`
                    : `Reactivate ${suspensionModalSeller.full_name}?`}
                </h3>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              {suspensionAction === "suspend" ? (
                <>
                  Suspending will temporarily disable this seller&apos;s storefront and block new
                  orders.{" "}
                  <strong className="text-charcoal-900">
                    Seller products and customer order data will NOT be deleted.
                  </strong>
                </>
              ) : (
                <>
                  Reactivating will restore the seller&apos;s dashboard access and republish their
                  storefront online.
                </>
              )}
            </p>

            {suspensionAction === "suspend" && (
              <div>
                <label className="text-xs font-bold text-charcoal-700 block mb-1">
                  Required Suspension Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g. Terms violation, reported scam, unfulfilled order spike..."
                  required
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSuspensionModalSeller(null)}
                disabled={submittingAction}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSuspension}
                disabled={submittingAction || (suspensionAction === "suspend" && !suspensionReason.trim())}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  suspensionAction === "suspend"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } disabled:opacity-50`}
              >
                {submittingAction ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>
                    {suspensionAction === "suspend" ? "Confirm Suspension" : "Confirm Reactivation"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

