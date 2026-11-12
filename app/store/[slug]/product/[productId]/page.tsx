"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  X,
  Share2,
  Store as StoreIcon,
  Loader2,
  Zap,
} from "lucide-react";
import { Store, Product } from "@/lib/types";
import { formatINR, getWhatsAppUrl, copyToClipboard } from "@/lib/utils";
import { getStoreBySlug, getProductById, getStoreProducts } from "@/lib/dashboardService";
import { getThemeConfig, getFontFamilyClass } from "@/lib/themes";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string)?.toLowerCase() || "";
  const productId = (params.productId as string) || "";
  const storageCartKey = `sellnest_cart_${slug}`;

  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // WhatsApp order modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load existing cart count from localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !slug) return;
    try {
      const saved = localStorage.getItem(storageCartKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const count = Object.values(parsed).reduce((sum: number, q: any) => sum + (Number(q) || 0), 0);
        setCartCount(count);
      }
    } catch (e) {
      console.warn("Could not read cart:", e);
    }
  }, [slug, storageCartKey]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { store: storeData } = await getStoreBySlug(slug, true);
        if (!storeData) {
          setLoading(false);
          return;
        }
        setStore(storeData);

        const allProds = await getStoreProducts(storeData.id);
        const prod = allProds.find((p) => p.id === productId);

        if (prod) {
          setProduct(prod);
          const initialImg = prod.images?.[0] || prod.image_url || "";
          setSelectedImage(initialImg);

          // Related products in same category
          const related = allProds
            .filter((p) => p.id !== prod.id && (p.category === prod.category || !p.category))
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug && productId) {
      loadData();
    }
  }, [slug, productId]);

  const saveToLocalCart = (prodId: string, qty: number) => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageCartKey);
      const currentCart = saved ? JSON.parse(saved) : {};
      currentCart[prodId] = (currentCart[prodId] || 0) + qty;
      localStorage.setItem(storageCartKey, JSON.stringify(currentCart));

      const newCount = Object.values(currentCart).reduce(
        (sum: number, q: any) => sum + (Number(q) || 0),
        0
      );
      setCartCount(newCount);
    } catch (e) {
      console.warn("Cart update error:", e);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    saveToLocalCart(product.id, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    saveToLocalCart(product.id, quantity);
    router.push(`/store/${slug}/checkout`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!store || !product) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Product Not Found</h2>
        <p className="text-sm text-zinc-500 max-w-md mt-1">
          This product is either unavailable, has been removed, or the link is incorrect.
        </p>
        <Link
          href={`/store/${slug}`}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    );
  }

  const theme = getThemeConfig(store.theme);
  const fontClass = getFontFamilyClass(store.font_family || theme.fontDefault);
  const primaryColor = store.accent_color || theme.defaultAccent;
  const s = theme.styles;

  // Gallery images list
  const galleryImages = [
    product.image_url,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  const uniqueImages = Array.from(new Set(galleryImages));

  const handleDirectWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    if (!store.whatsapp_number) {
      setOrderError("Seller has not configured a WhatsApp number yet. Please check back later.");
      return;
    }

    const message = `👋 Hello ${store.name}! I'd like to order from your SellNest storefront:\n\n📦 *Product:* ${product.name}\n🔢 *Quantity:* ${quantity}\n💰 *Price:* ${formatINR(product.price * quantity)} (₹${product.price} each)\n\n👤 *My Details:*\n• Name: ${customerName}\n• WhatsApp: ${customerPhone}\n• Delivery Area: ${customerAddress || "Pickup / To confirm"}${
      customerNotes ? `\n• Notes: ${customerNotes}` : ""
    }\n\nPlease confirm availability. Thank you!`;

    const waUrl = getWhatsAppUrl(store.whatsapp_number, message);

    setOrderSent(true);
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setIsOrderModalOpen(false);
      setOrderSent(false);
    }, 1000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | ${store.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyToClipboard(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen ${s.bodyBg} ${fontClass} text-zinc-900 transition-colors duration-200`}>
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Added {quantity}x &quot;{product.name}&quot; to your bag!</span>
          <Link
            href={`/store/${slug}/checkout`}
            className="ml-2 text-purple-300 hover:text-white underline text-[11px]"
          >
            Checkout &rarr;
          </Link>
        </div>
      )}

      {/* Top Header */}
      <header className={`sticky top-0 z-30 transition-all ${s.headerStyle}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {store.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-black/5 text-zinc-600 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] font-medium text-emerald-600">Copied!</span>
            )}

            {/* Bag Button */}
            <Link
              href={`/store/${slug}/checkout`}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Product Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Primary Main Image */}
            <div className={`aspect-square w-full overflow-hidden bg-zinc-100 relative ${s.cardBorder} ${s.cardRadius} shadow-xs`}>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <StoreIcon className="w-16 h-16" />
                </div>
              )}

              {product.is_eggless && (
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                  100% Eggless
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {uniqueImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {uniqueImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === imgUrl
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-zinc-200 hover:border-zinc-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO & ORDER ACTIONS */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {product.category || "Specialty"}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {product.stock_quantity !== undefined && product.stock_quantity > 0
                    ? `${product.stock_quantity <= 5 ? `Only ${product.stock_quantity} left in stock` : "In Stock"}`
                    : "Made to Order"}
                </span>
              </div>

              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 ${
                store.theme === "boutique" ? "font-serif" : ""
              }`}>
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-zinc-950">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-zinc-500">Taxes included • Pre-order recommended</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-zinc-100 py-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Description & Craft
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed whitespace-pre-line">
                {product.description ||
                  "Handcrafted using authentic traditional methods and carefully sourced premium ingredients. Made fresh to order."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-white rounded-lg text-zinc-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-zinc-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:bg-white rounded-lg text-zinc-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-500">
                  Total: <span className="font-bold text-zinc-900 text-sm">{formatINR(product.price * quantity)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border-2 transition-all shadow-xs ${
                    addedToast
                      ? "bg-emerald-50 text-emerald-800 border-emerald-400"
                      : "bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedToast ? "Added to Bag ✓" : "Add to Bag"}</span>
                </button>

                {/* 2. Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now &rarr;</span>
                </button>
              </div>

              {/* Direct WhatsApp Inquiry */}
              {store.whatsapp_number && (
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-emerald-800 font-medium text-xs flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inquire or Customize on WhatsApp</span>
                </button>
              )}
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.02] border border-black/5">
                <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-900">Direct Delivery</p>
                  <p className="text-[11px] text-zinc-500">Pan-city or pickup</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.02] border border-black/5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-900">Fresh Artisan Craft</p>
                  <p className="text-[11px] text-zinc-500">Made with care</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-zinc-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold text-zinc-900 ${
                  store.theme === "boutique" ? "font-serif text-2xl" : ""
                }`}>
                  More from {store.name}
                </h3>
                <p className="text-xs text-zinc-500">Handmade items in the same collection</p>
              </div>
              <Link
                href={`/store/${store.slug}`}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/store/${store.slug}/product/${rel.id}`}
                  className={`group overflow-hidden ${s.cardBg} ${s.cardBorder} ${s.cardRadius} ${s.productCardStyle}`}
                >
                  <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                    {rel.image_url ? (
                      <img
                        src={rel.image_url}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <StoreIcon className="w-8 h-8" />
                      </div>
                    )}
                    {rel.is_eggless && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                        Eggless
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 group-hover:text-purple-600 transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-zinc-950 mt-1">{formatINR(rel.price)}</p>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-8 px-4 text-center mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href={`/store/${store.slug}/track`} className="hover:underline">
              Track Order
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Powered by</span>
              <Link href="/" className="font-bold text-zinc-900 hover:text-purple-600">
                SellNest
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP CUSTOMIZE MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsOrderModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-zinc-900 text-base">Inquire on WhatsApp</h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {orderError}
              </div>
            )}

            {orderSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-zinc-900 text-base">Launching WhatsApp...</h4>
                <p className="text-xs text-zinc-500">Opening WhatsApp chat with {store.name}.</p>
              </div>
            ) : (
              <form onSubmit={handleDirectWhatsApp} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">{product.name}</p>
                    <p className="text-zinc-500 text-[11px]">Qty: {quantity} × {formatINR(product.price)}</p>
                  </div>
                  <span className="font-bold text-sm text-zinc-950">
                    {formatINR(product.price * quantity)}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Delivery Area / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Indiranagar, Bengaluru / Message on card"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation &rarr;</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
