"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Package,
  ShoppingBag,
  RefreshCw,
  Loader2,
  Palette,
  Calendar,
  Lock,
  Unlock,
  Building,
  Mail,
  User,
} from "lucide-react";
import { StoreAdminView } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreAdminView[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished" | "suspended">("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Modals
  const [detailStore, setDetailStore] = useState<StoreAdminView | null>(null);
  const [moderationModalStore, setModerationModalStore] = useState<StoreAdminView | null>(null);
  const [moderationAction, setModerationAction] = useState<"unpublish" | "restore">("unpublish");
  const [moderationReason, setModerationReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stores");
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores || []);
      }
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleOpenModerationModal = (store: StoreAdminView, action: "unpublish" | "restore") => {
    setModerationModalStore(store);
    setModerationAction(action);
    setModerationReason(
      action === "unpublish"
        ? "Violation of storefront acceptable use policy or suspected prohibited catalog content."
        : ""
    );
  };

  const handleExecuteModeration = async () => {
    if (!moderationModalStore) return;

    if (moderationAction === "unpublish" && !moderationReason.trim()) {
      alert("A moderation reason is strictly required before unpublishing a store.");
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await fetch("/api/admin/stores/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: moderationModalStore.id,
          action: moderationAction,
          reason: moderationAction === "unpublish" ? moderationReason.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setToastMessage({ type: "error", text: data.error || "Action failed." });
      } else {
        setToastMessage({
          type: "success",
          text:
            moderationAction === "unpublish"
              ? `Store "${moderationModalStore.name}" has been unpublished.`
              : `Store "${moderationModalStore.name}" has been restored and published.`,
        });
        setModerationModalStore(null);
        await fetchStores();
      }
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message || "Network error occurred." });
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredStores = stores.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.seller_name.toLowerCase().includes(q) ||
      s.seller_email.toLowerCase().includes(q);

    const matchesPlan = planFilter === "all" || s.plan_id === planFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && s.is_published && !s.is_suspended) ||
      (statusFilter === "unpublished" && !s.is_published && !s.is_suspended) ||
      (statusFilter === "suspended" && s.is_suspended);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const publishedCount = stores.filter((s) => s.is_published && !s.is_suspended).length;
  const suspendedCount = stores.filter((s) => s.is_suspended).length;
  const unpublishedCount = stores.filter((s) => !s.is_published && !s.is_suspended).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-subtle ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-3">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p className="text-sm font-semibold">{toastMessage.text}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Moderation & Governance
            </span>
            <span className="text-xs text-charcoal-400">Total: {stores.length}</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight mt-1">
            Store Management
          </h1>
          <p className="text-xs text-charcoal-600">
            Browse all tenant storefronts, inspect live public sites, review catalog volumes, and moderate compliance.
          </p>
        </div>

        <button
          onClick={fetchStores}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
          Refresh Stores
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Total Stores</p>
          <p className="text-2xl font-black text-charcoal-950 mt-1">{stores.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Live Published</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Unpublished Drafts</p>
          <p className="text-2xl font-black text-stone-700 mt-1">{unpublishedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">Moderated / Suspended</p>
          <p className="text-2xl font-black text-red-700 mt-1">{suspendedCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store name, slug, owner name, or owner email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {(
                [
                  { id: "all", label: "All Status" },
                  { id: "published", label: "Published" },
                  { id: "unpublished", label: "Unpublished" },
                  { id: "suspended", label: "Suspended" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    statusFilter === tab.id
                      ? "bg-white text-charcoal-950 shadow-subtle"
                      : "text-charcoal-600 hover:text-charcoal-950"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-charcoal-700 focus:outline-none focus:border-purple-600"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Tier</option>
              <option value="starter">Starter Plan</option>
              <option value="pro">Pro Plan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stores Directory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-xs font-bold text-charcoal-500">Loading platform storefronts...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-16 text-center">
            <Store className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-charcoal-900">No stores found</p>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              No storefronts match your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  <th className="py-3.5 px-4">Store & Slug</th>
                  <th className="py-3.5 px-4">Owner / Seller</th>
                  <th className="py-3.5 px-4">Theme</th>
                  <th className="py-3.5 px-4">Catalog / Orders</th>
                  <th className="py-3.5 px-4">Revenue</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-charcoal-700">
                {filteredStores.map((store) => {
                  const isModerated = store.is_suspended;
                  const isLive = store.is_published && !isModerated;

                  return (
                    <tr
                      key={store.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isModerated ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Store & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-xs ${
                              isModerated
                                ? "bg-red-100 text-red-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {store.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-950 flex items-center gap-1.5">
                              {store.name}
                              {isModerated && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                                  Moderated
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-purple-700 bg-purple-50/80 px-1.5 py-0.5 rounded border border-purple-100">
                                /store/{store.slug}
                              </span>
                              {isLive && (
                                <a
                                  href={`/store/${store.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-stone-400 hover:text-purple-600 transition"
                                  title="View Public Storefront"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-charcoal-900">{store.seller_name}</div>
                        <div className="text-[11px] text-charcoal-500 font-mono">{store.seller_email}</div>
                      </td>

                      {/* Theme */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-charcoal-700 bg-stone-100 px-2 py-0.5 rounded-md capitalize">
                          <Palette className="w-3 h-3 text-charcoal-500" />
                          {store.theme || "minimal"}
                        </span>
                      </td>

                      {/* Catalog / Orders */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-charcoal-700">
                            <Package className="w-3.5 h-3.5 text-stone-400" />
                            <strong>{store.products_count}</strong>
                            <span className="text-charcoal-400 text-[10px]">items</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-charcoal-700">
                            <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                            <strong>{store.orders_count}</strong>
                            <span className="text-charcoal-400 text-[10px]">orders</span>
                          </span>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 font-bold text-charcoal-950 font-mono">
                        {formatINR(store.total_revenue || 0)}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            store.plan_id === "pro"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : store.plan_id === "starter"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {store.plan_id}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isModerated ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Suspended
                          </span>
                        ) : store.is_published ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailStore(store)}
                            className="p-1.5 text-charcoal-600 hover:text-purple-700 hover:bg-stone-100 rounded-lg transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isLive && (
                            <a
                              href={`/store/${store.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-charcoal-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                              title="Open Storefront in New Tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          {isModerated ? (
                            <button
                              onClick={() => handleOpenModerationModal(store, "restore")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                            >
                              <Unlock className="w-3 h-3" />
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenModerationModal(store, "unpublish")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                            >
                              <Lock className="w-3 h-3" />
                              Unpublish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Store Details Modal */}
      {detailStore && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-sm">
                  {detailStore.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-charcoal-950">{detailStore.name}</h3>
                  <p className="text-xs font-mono text-purple-700">/store/{detailStore.slug}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailStore(null)}
                className="text-charcoal-400 hover:text-charcoal-900 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <p className="text-[10px] font-bold uppercase text-charcoal-500">Theme Preset</p>
                <p className="text-xs font-bold text-charcoal-900 capitalize mt-0.5">
                  {detailStore.theme || "Minimal"}
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <p className="text-[10px] font-bold uppercase text-charcoal-500">Current Plan</p>
                <p className="text-xs font-bold text-purple-700 uppercase mt-0.5">
                  {detailStore.plan_id}
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <p className="text-[10px] font-bold uppercase text-charcoal-500">Active Products</p>
                <p className="text-xs font-bold text-charcoal-900 mt-0.5">
                  {detailStore.products_count} listed
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                <p className="text-[10px] font-bold uppercase text-charcoal-500">Total Orders</p>
                <p className="text-xs font-bold text-charcoal-900 mt-0.5">
                  {detailStore.orders_count} orders ({formatINR(detailStore.total_revenue || 0)})
                </p>
              </div>
            </div>

            {/* Owner Details */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-charcoal-500">Store Owner</p>
              <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>{detailStore.seller_name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-charcoal-600 font-mono">
                <Mail className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{detailStore.seller_email}</span>
              </div>
            </div>

            {/* Moderation Details if Suspended */}
            {detailStore.is_suspended && (
              <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 space-y-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Store Moderation Status: Suspended
                </p>
                <p className="text-xs text-red-900">
                  <strong>Reason:</strong> {detailStore.suspension_reason || "Admin moderation action taken."}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {detailStore.is_published && !detailStore.is_suspended && (
                <a
                  href={`/store/${detailStore.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live Storefront
                </a>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => setDetailStore(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-charcoal-800 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Unpublish / Restore Confirmation Modal */}
      {moderationModalStore && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  moderationAction === "unpublish"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {moderationAction === "unpublish" ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <Unlock className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-charcoal-950">
                  {moderationAction === "unpublish" ? "Unpublish Storefront" : "Restore Storefront"}
                </h3>
                <p className="text-xs text-charcoal-600 font-mono">
                  {moderationModalStore.name} (/store/{moderationModalStore.slug})
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              {moderationAction === "unpublish" ? (
                <>
                  Unpublishing will immediately revoke public accessibility for{" "}
                  <strong>/store/{moderationModalStore.slug}</strong>. Visitors will see a platform
                  moderation notice. <em>No store products, orders or seller data will be deleted.</em>
                </>
              ) : (
                <>
                  Restoring will reactivate the storefront and make{" "}
                  <strong>/store/{moderationModalStore.slug}</strong> publicly visible online again.
                </>
              )}
            </p>

            {moderationAction === "unpublish" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-charcoal-700">
                  Moderation Reason <span className="text-red-500">* Required</span>
                </label>
                <textarea
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  placeholder="Explain why this storefront is being unpublished from public view..."
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setModerationModalStore(null)}
                disabled={submittingAction}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-charcoal-700 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteModeration}
                disabled={submittingAction || (moderationAction === "unpublish" && !moderationReason.trim())}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition ${
                  moderationAction === "unpublish"
                    ? "bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    : "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                }`}
              >
                {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {moderationAction === "unpublish" ? "Confirm Unpublish" : "Confirm Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

