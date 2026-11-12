"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  XCircle,
  Store as StoreIcon,
} from "lucide-react";
import { Order, Store, OrderStatus } from "@/lib/types";
import { formatINR, getWhatsAppUrl } from "@/lib/utils";
import { getStoreBySlug } from "@/lib/dashboardService";

const STATUS_STEPS: Array<{ id: OrderStatus; label: string; desc: string }> = [
  { id: "pending", label: "Order Received", desc: "Awaiting confirmation from maker" },
  { id: "confirmed", label: "Confirmed", desc: "Order accepted and scheduled" },
  { id: "processing", label: "In Preparation", desc: "Handcrafted, baked & packed" },
  { id: "completed", label: "Delivered", desc: "Dispatched or collected" },
];

function OrderTrackingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string)?.toLowerCase() || "";

  const initialOrder = searchParams.get("order") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [store, setStore] = useState<Store | null>(null);
  const [orderQuery, setOrderQuery] = useState(initialOrder);
  const [phoneQuery, setPhoneQuery] = useState(initialPhone);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadStore() {
      if (slug) {
        const { store: sData } = await getStoreBySlug(slug, true);
        setStore(sData);
      }
    }
    loadStore();
  }, [slug]);

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);

    const cleanOrder = orderQuery.trim();
    const cleanPhone = phoneQuery.replace(/[^0-9]/g, "");

    if (!cleanOrder) {
      setErrorMsg("Please enter your Order Reference Number (e.g. SN-849201).");
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Please enter the 10-digit mobile number used during checkout.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/orders/track?order=${encodeURIComponent(cleanOrder)}&phone=${encodeURIComponent(
          cleanPhone
        )}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(
          data.error ||
            "No order found matching this order number and mobile combination. Please verify your details."
        );
        setTrackedOrder(null);
      } else {
        setTrackedOrder(data.order);
      }
    } catch {
      setErrorMsg("Network error checking order. Please try again.");
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if query params are present
  useEffect(() => {
    if (initialOrder && initialPhone) {
      handleTrack();
    }
  }, [initialOrder, initialPhone]);

  // Compute status step index
  const currentStepIdx = useMemo(() => {
    if (!trackedOrder) return 0;
    const st = trackedOrder.status as OrderStatus;
    if (st === "cancelled") return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.id === st);
    return idx >= 0 ? idx : 0;
  }, [trackedOrder]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href={slug ? `/store/${slug}` : "/"}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {store?.name || "Store"}</span>
          </Link>

          <span className="text-xs font-bold text-zinc-900">SellNest Order Tracking</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Check the real-time fulfillment status of your artisanal goods from {store?.name || "SellNest"}.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Order Number / Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-849201"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Mobile Number * (used at checkout)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking Order Status...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* RESULTS: TRACKED ORDER */}
        {trackedOrder && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-card space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Order header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Order Reference
                </span>
                <span className="text-lg font-mono font-bold text-zinc-950">
                  {trackedOrder.order_code || `SN-${trackedOrder.order_number}`}
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Placed with <span className="font-semibold text-zinc-800">{trackedOrder.store?.name || store?.name || "Seller"}</span> on{" "}
                  {new Date(trackedOrder.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    trackedOrder.status === "completed"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : trackedOrder.status === "processing"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : trackedOrder.status === "confirmed"
                      ? "bg-purple-50 text-purple-800 border border-purple-200"
                      : trackedOrder.status === "cancelled"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span>{trackedOrder.status}</span>
                </span>
              </div>
            </div>

            {/* PROGRESS STEPPER (Unless cancelled) */}
            {trackedOrder.status === "cancelled" ? (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Order Cancelled</p>
                  <p className="text-[11px] text-red-600 mt-0.5">
                    This order was cancelled by the store. Please reach out via WhatsApp for details or refunds.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {/* Connecting track line */}
                  <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-zinc-200 -z-0" />
                  <div
                    className="absolute top-4 left-[12%] h-0.5 bg-purple-600 transition-all duration-500 -z-0"
                    style={{
                      width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 76}%`,
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                          } ${isCurrent ? "ring-4 ring-purple-100 scale-105" : ""}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <p
                          className={`mt-2 text-xs font-semibold leading-tight ${
                            isDone ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-zinc-400 hidden sm:block mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ORDER ITEMS & SUMMARY */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                Items in This Order
              </h3>
              <div className="divide-y divide-zinc-100">
                {(trackedOrder.items || []).map((it: any, idx: number) => (
                  <div key={it.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-zinc-900">{it.product_name}</span>
                      <p className="text-[11px] text-zinc-400">
                        Qty: {it.quantity} &times; {formatINR(it.unit_price)}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-900">
                      {formatINR(it.total_price || it.unit_price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-sm font-bold text-zinc-950">
                <span>Total Amount:</span>
                <span className="text-purple-700">{formatINR(trackedOrder.total_amount)}</span>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="border-t border-zinc-100 pt-4 flex items-start gap-2.5 text-xs text-zinc-600">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-900 block">Delivery Address:</span>
                <span className="leading-relaxed">
                  {[
                    trackedOrder.delivery_address,
                    trackedOrder.city,
                    trackedOrder.state,
                    trackedOrder.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>

            {/* SELLER WHATSAPP BUTTON */}
            {(trackedOrder.store?.whatsapp_number || store?.whatsapp_number) && (
              <div className="border-t border-zinc-100 pt-4">
                <a
                  href={getWhatsAppUrl(
                    trackedOrder.store?.whatsapp_number || store?.whatsapp_number,
                    `Hello ${trackedOrder.store?.name || store?.name || "Seller"}! I am inquiring about my order ${trackedOrder.order_code || trackedOrder.order_number}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Seller on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-xs text-zinc-500 font-medium">Loading tracking portal...</p>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}

