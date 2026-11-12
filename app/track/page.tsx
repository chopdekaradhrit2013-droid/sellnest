"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { Order, OrderStatus } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const STATUS_STEPS: Array<{ id: OrderStatus; label: string; desc: string }> = [
  { id: "pending", label: "Order Received", desc: "Awaiting confirmation from maker" },
  { id: "confirmed", label: "Confirmed", desc: "Order accepted and scheduled" },
  { id: "processing", label: "In Preparation", desc: "Handcrafted, baked & packed" },
  { id: "completed", label: "Delivered", desc: "Dispatched or collected" },
];

function GlobalTrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderQuery, setOrderQuery] = useState(initialOrder);
  const [phoneQuery, setPhoneQuery] = useState(initialPhone);

  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  useEffect(() => {
    if (initialOrder && initialPhone) {
      handleTrack();
    }
  }, [initialOrder, initialPhone]);

  const currentStepIdx = trackedOrder
    ? STATUS_STEPS.findIndex((s) => s.id === trackedOrder.status)
    : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 pb-20">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>SellNest Home</span>
          </Link>
          <span className="text-xs font-bold text-zinc-900">SellNest Order Tracking Portal</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Track Any SellNest Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Enter your order reference code and checkout phone number to verify real-time status.
          </p>
        </div>

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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
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
                  <span>Looking up Order...</span>
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

        {trackedOrder && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200 shadow-card space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Store: {trackedOrder.store?.name || "SellNest Seller"}
                </span>
                <span className="text-lg font-mono font-bold text-zinc-950">
                  {trackedOrder.order_code || `SN-${trackedOrder.order_number}`}
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Placed on{" "}
                  {new Date(trackedOrder.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200">
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span>{trackedOrder.status}</span>
                </span>
              </div>
            </div>

            {/* Stepper */}
            {trackedOrder.status !== "cancelled" && (
              <div className="grid grid-cols-4 gap-2 text-center relative py-2">
                <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-zinc-200 -z-0" />
                <div
                  className="absolute top-4 left-[12%] h-0.5 bg-purple-600 transition-all duration-500 -z-0"
                  style={{
                    width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 76}%`,
                  }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isDone ? "bg-purple-600 text-white" : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${isDone ? "text-zinc-900" : "text-zinc-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Items */}
            <div className="border-t border-zinc-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-zinc-700">Order Items</h4>
              {(trackedOrder.items || []).map((it: any, idx: number) => (
                <div key={it.id || idx} className="flex justify-between text-xs py-1.5 border-b border-zinc-50">
                  <span>{it.product_name} &times; {it.quantity}</span>
                  <span className="font-semibold">{formatINR(it.total_price || it.unit_price * it.quantity)}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between text-sm font-extrabold text-zinc-950">
                <span>Total Amount:</span>
                <span className="text-purple-700">{formatINR(trackedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Contact Seller */}
            {trackedOrder.store?.whatsapp_number && (
              <a
                href={`https://wa.me/${trackedOrder.store.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact {trackedOrder.store.name} on WhatsApp</span>
              </a>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function GlobalTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-xs text-zinc-500 font-medium">Loading tracking portal...</p>
        </div>
      }
    >
      <GlobalTrackContent />
    </Suspense>
  );
}

