"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Lock,
  Loader2,
  Sparkles,
  Store as StoreIcon,
} from "lucide-react";
import { Store, Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { getStoreBySlug, getStoreProducts } from "@/lib/dashboardService";
import { getThemeConfig, getFontFamilyClass } from "@/lib/themes";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string)?.toLowerCase() || "";
  const storageCartKey = `sellnest_cart_${slug}`;

  const [store, setStore] = useState<Store | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [stateName, setStateName] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  // Submitting & Error states
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // 1. Load store and cart from localStorage
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { store: storeData } = await getStoreBySlug(slug, false);
        if (!storeData) {
          setLoading(false);
          return;
        }
        setStore(storeData);

        const prods = await getStoreProducts(storeData.id);
        setAllProducts(prods);

        // Load cart
        if (typeof window !== "undefined") {
          const savedCart = localStorage.getItem(storageCartKey);
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          }
        }
      } catch (e) {
        console.error("Error loading checkout data:", e);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug, storageCartKey]);

  // Sync cart modifications to localStorage
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      const updated = { ...prev };
      if (next <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = next;
      }
      localStorage.setItem(storageCartKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      localStorage.setItem(storageCartKey, JSON.stringify(updated));
      return updated;
    });
  };

  // Cart item objects
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([pId, qty]) => {
        const product = allProducts.find((p) => p.id === pId);
        return product ? { product, quantity: qty } : null;
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number }>;
  }, [cart, allProducts]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal >= 1000 ? 0 : 60;
  }, [cartItems, subtotal]);

  const finalTotal = subtotal + deliveryFee;

  // Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = "Please enter your full street/apartment delivery address.";
    }

    if (!city.trim()) {
      errors.city = "Please enter your city.";
    }

    if (!stateName.trim()) {
      errors.stateName = "Please enter your state.";
    }

    const cleanPin = pincode.replace(/[^0-9]/g, "");
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    if (cartItems.length === 0) {
      setApiError("Your shopping bag is empty. Please add items before checking out.");
      return;
    }

    setSubmitting(true);

    try {
      const idempotencyKey = `ord_sub_${slug}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const response = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: slug,
          idempotencyKey,
          customer: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            delivery_address: deliveryAddress.trim(),
            city: city.trim(),
            state: stateName.trim(),
            pincode: pincode.trim(),
            notes: notes.trim() || undefined,
          },
          items: cartItems.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setApiError(result.error || "Failed to place order. Please check your items and try again.");
        setSubmitting(false);
        return;
      }

      // Clear this store's cart in localStorage
      localStorage.removeItem(storageCartKey);
      setCart({});

      // Redirect to Confirmation Page
      const orderIdentifier = result.order.order_code || result.order.id;
      router.push(`/store/${slug}/order-confirmation/${orderIdentifier}`);
    } catch (err: any) {
      console.error("Order submission failure:", err);
      setApiError("A network error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading checkout...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900">Store Not Found</h2>
        <Link href="/" className="mt-4 text-xs font-semibold text-purple-600 hover:underline">
          Return to SellNest &rarr;
        </Link>
      </div>
    );
  }

  const theme = getThemeConfig(store.theme);
  const fontClass = getFontFamilyClass(store.font_family || theme.fontDefault);
  const primaryColor = store.accent_color || theme.defaultAccent;

  return (
    <div className={`min-h-screen ${theme.styles.bodyBg} ${fontClass} text-zinc-900 pb-20`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 transition-all ${theme.styles.headerStyle}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {store.name}</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 ${
            store.theme === "boutique" ? "font-serif" : ""
          }`}>
            Complete Your Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Placing order with <span className="font-semibold text-zinc-800">{store.name}</span>. Delivered fresh to your doorstep.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Your shopping bag is empty</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Explore delicious sourdough, pastries, and artisanal creations from {store.name}.
            </p>
            <Link
              href={`/store/${slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Explore Products &rarr;</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: CUSTOMER DELIVERY DETAILS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200 shadow-xs space-y-5">
                <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <span>1. Delivery Information</span>
                  </h2>
                  <span className="text-[11px] text-zinc-400">* Required</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        formErrors.fullName ? "border-red-400 bg-red-50/20" : "border-zinc-300"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        Mobile Number * (WhatsApp preferred)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                          formErrors.phone ? "border-red-400 bg-red-50/20" : "border-zinc-300"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="aditi@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                          formErrors.email ? "border-red-400 bg-red-50/20" : "border-zinc-300"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Street Address & Flat / House No. *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Flat 302, Palm Grove Apts, 12th Main Road, Indiranagar"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        formErrors.deliveryAddress
                          ? "border-red-400 bg-red-50/20"
                          : "border-zinc-300"
                      }`}
                    />
                    {formErrors.deliveryAddress && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {formErrors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="560038"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                          formErrors.pincode ? "border-red-400 bg-red-50/20" : "border-zinc-300"
                        }`}
                      />
                      {formErrors.pincode && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.pincode}</p>
                      )}
                    </div>
                  </div>

                  {/* Special Notes / Instructions */}
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Order Instructions / Notes on Cake <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please leave at door, message on card: Happy Birthday Rahul!"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/70 flex items-start gap-3 text-xs text-purple-950">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-semibold text-purple-900">Direct Maker Confirmation</p>
                  <p className="text-[11px] text-purple-700 mt-0.5">
                    Your order is confirmed directly by {store.name}. You will receive a direct WhatsApp order notification with your order number.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200 shadow-xs space-y-5 sticky top-20">
                <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900">Order Summary</h3>
                  <span className="text-xs text-zinc-500">
                    {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map(({ product, quantity: qty }) => (
                    <div key={product.id} className="py-3 flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <StoreIcon className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-zinc-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          {formatINR(product.price)} &times; {qty}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 hover:bg-white rounded text-zinc-600"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-1.5 text-xs font-bold text-zinc-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 hover:bg-white rounded text-zinc-600"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-bold text-xs text-zinc-950 w-16 text-right">
                          {formatINR(product.price * qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="flex items-center gap-1">
                      <span>Delivery Charges</span>
                      {deliveryFee === 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                    </span>
                  </div>

                  {subtotal < 1000 && (
                    <p className="text-[10px] text-zinc-400 italic">
                      Add {formatINR(1000 - subtotal)} more for free delivery!
                    </p>
                  )}

                  <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-base font-extrabold text-zinc-950">
                    <span>Total Amount</span>
                    <span className="text-lg text-purple-700">{formatINR(finalTotal)}</span>
                  </div>
                </div>

                {/* Confirm & Place Order Button */}
                <button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Your Order...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Place Order ({formatINR(finalTotal)})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                  By placing your order, you agree to receive delivery updates directly on WhatsApp from {store.name}.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

