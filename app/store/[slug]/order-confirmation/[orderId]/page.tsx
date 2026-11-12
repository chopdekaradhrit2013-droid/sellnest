"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  MessageCircle,
  Package,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  Store as StoreIcon,
  Loader2,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Order, Store } from "@/lib/types";
import { formatINR, getWhatsAppUrl, copyToClipboard } from "@/lib/utils";
import { getOrderById, getStoreBySlug } from "@/lib/dashboardService";
import { getThemeConfig, getFontFamilyClass } from "@/lib/themes";

export default function OrderConfirmationPage() {
  const params = useParams();
  const slug = (params.slug as string)?.toLowerCase() || "";
  const orderId = (params.orderId as string) || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadConfirmation() {
      setLoading(true);
      try {
        const { store: sData } = await getStoreBySlug(slug, true);
        setStore(sData);

        const ord = await getOrderById(orderId);
        setOrder(ord);
      } catch (e) {
        console.error("Error loading order confirmation:", e);
      } finally {
        setLoading(false);
      }
    }

    if (slug && orderId) {
      loadConfirmation();
    }
  }, [slug, orderId]);

  const orderCode = order?.order_code || (order?.order_number ? `SN-${order.order_number}` : orderId);

  const handleCopyCode = () => {
    copyToClipboard(orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading order confirmation...</p>
      </div>
    );
  }

  if (!order || !store) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Order Not Found</h2>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          We could not locate this order. It may have been placed under a different reference.
        </p>
        <Link
          href={`/store/${slug}`}
          className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-xl"
        >
          Return to Store &rarr;
        </Link>
      </div>
    );
  }

  const theme = getThemeConfig(store.theme);
  const fontClass = getFontFamilyClass(store.font_family || theme.fontDefault);
  const primaryColor = store.accent_color || theme.defaultAccent;

  // Generate structured WhatsApp message
  const itemsText = (order.items || [])
    .map((it) => `• ${it.product_name} x ${it.quantity} (₹${it.total_price || it.unit_price * it.quantity})`)
    .join("\n");

  const fullAddress = [
    order.delivery_address,
    order.city,
    order.state ? `${order.state} - ${order.pincode || ""}` : order.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const waMessage = `👋 Hello ${store.name}!
I have placed an order on your SellNest storefront.

🧾 *Order Number:* ${orderCode}
👤 *Customer:* ${order.customer_name}
📱 *Phone:* ${order.customer_phone || "Not provided"}
📍 *Delivery Address:* ${fullAddress}

📋 *Items Ordered:*
${itemsText}

💰 *Subtotal:* ₹${order.subtotal_amount || order.total_amount}
🚚 *Delivery:* ₹${order.delivery_fee || 0}
💵 *Total Amount:* ₹${order.total_amount}${order.notes ? `\n📝 *Notes:* ${order.notes}` : ""}

Please confirm my order and share payment instructions. Thank you!`;

  const waUrl = getWhatsAppUrl(store.whatsapp_number, waMessage);

  return (
    <div className={`min-h-screen ${theme.styles.bodyBg} ${fontClass} text-zinc-900 py-10 px-4 sm:px-6`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Success Card */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200/90 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
              Order Confirmed & Saved
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">
              Thank you, {order.customer_name}!
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Your order has been recorded in <span className="font-semibold text-zinc-800">{store.name}</span>&apos;s system.
            </p>
          </div>

          {/* Order Code Callout Pill */}
          <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 inline-flex items-center gap-3">
            <div className="text-left">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Order Reference Number
              </span>
              <span className="font-mono text-base font-bold text-zinc-900">{orderCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-xs flex items-center gap-1 shadow-xs transition-colors"
              title="Copy Order Number"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Primary Action: Send WhatsApp Confirmation */}
          {store.whatsapp_number ? (
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Notify Seller on WhatsApp ({store.name})</span>
              </a>
              <p className="text-[11px] text-zinc-400 mt-2">
                Sends your order details directly to the maker to speed up confirmation and delivery coordination.
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">
              The seller will reach out to you directly on your phone ({order.customer_phone}).
            </p>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h2 className="text-base font-bold text-zinc-900">Order Summary</h2>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Status: {order.status.toUpperCase()}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-zinc-100">
            {(order.items || []).map((it, idx) => (
              <div key={it.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-zinc-900">{it.product_name}</h4>
                  <p className="text-zinc-400 text-[11px]">
                    Qty: {it.quantity} &times; {formatINR(it.unit_price)}
                  </p>
                </div>
                <span className="font-bold text-zinc-900">
                  {formatINR(it.total_price || it.unit_price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-zinc-100 pt-3 space-y-1.5 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-900">
                {formatINR(order.subtotal_amount || order.total_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-zinc-900">
                {order.delivery_fee ? formatINR(order.delivery_fee) : "FREE"}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-base font-extrabold text-zinc-950">
              <span>Total Paid / Due</span>
              <span className="text-purple-700">{formatINR(order.total_amount)}</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="border-t border-zinc-100 pt-4 space-y-2 text-xs text-zinc-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-800 block">Delivery Address:</span>
                <span className="leading-relaxed">{fullAddress}</span>
              </div>
            </div>

            {order.customer_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Contact Phone: {order.customer_phone}</span>
              </div>
            )}

            {order.notes && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-[11px] text-zinc-600">
                <span className="font-semibold text-zinc-800">Special Instructions:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/store/${slug}/track?order=${encodeURIComponent(orderCode)}&phone=${encodeURIComponent(order.customer_phone || "")}`}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            href={`/store/${slug}`}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Back to Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

