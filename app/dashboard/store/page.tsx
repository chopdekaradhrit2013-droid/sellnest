"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store as StoreIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Phone,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { updateStore } from "@/lib/dashboardService";

export default function MyStorePage() {
  const { store, user, refreshStore, loading: storeLoading } = useDashboard();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync state when store loads
  useEffect(() => {
    if (store) {
      setName(store.name || "");
      setSlug(store.slug || "");
      setDescription(store.description || "");
      setLogoUrl(store.logo_url || "");
      setBannerUrl(store.banner_url || "");
      setEmail(store.email || "");
      setPhone(store.phone || "");
      setWhatsapp(store.whatsapp_number || "");
      setIsPublished(store.is_published ?? true);
    }
  }, [store]);

  const handleCopyLink = () => {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}/store/${slug}` : `https://sellnest.com/store/${slug}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanSlug || cleanSlug.length < 3) {
      setErrorMessage("Store handle must be at least 3 characters long without spaces.");
      setSaving(false);
      return;
    }

    try {
      const { data, error } = await updateStore(store.id, {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        logo_url: logoUrl.trim(),
        banner_url: bannerUrl.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp_number: whatsapp.trim(),
        is_published: isPublished,
      });

      if (error) {
        setErrorMessage(error);
      } else {
        setSaveSuccess(true);
        await refreshStore();
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update store settings.");
    } finally {
      setSaving(false);
    }
  };

  if (storeLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
            My Storefront Settings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Manage your store's identity, public address, branding and WhatsApp order recipient.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-charcoal-800 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-200 shadow-subtle transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
            <span>Open Public Store</span>
          </Link>
        </div>
      </div>

      {/* Live Store URL Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
            <StoreIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-950">Your Independent Storefront URL</div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-purple-900 mt-0.5">
              sellnest.com/store/{slug}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-white hover:bg-purple-100/50 text-purple-900 font-semibold text-xs px-3.5 py-2 rounded-xl border border-purple-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <span>Visit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Success & Error alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Store settings updated successfully! Your public storefront has been updated.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Basic Information */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-5">
              <h3 className="text-base font-bold text-charcoal-900 pb-3 border-b border-stone-100">
                Store Identity
              </h3>

              {/* Store Name */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Store Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Butter Room"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-semibold text-charcoal-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-stone-50/50 transition-all"
                />
              </div>

              {/* Store Slug / Handle */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Store Slug (URL Handle)
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 px-3.5 py-2.5 transition-all">
                  <span className="text-xs sm:text-sm font-semibold text-charcoal-400 select-none mr-1">
                    sellnest.store/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="yourbrand"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                    }
                    className="w-full bg-transparent text-sm font-bold text-charcoal-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Unique handle for your store. Letters, numbers, hyphens, and underscores only.
                </p>
              </div>

              {/* Store Description / Bio */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Store Bio & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell your customers what makes your craft or bakery special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-stone-50/50 transition-all"
                />
              </div>
            </div>

            {/* Contact & WhatsApp Ordering */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">
                    Order Dispatch & WhatsApp
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Orders placed on your storefront will be formatted and dispatched to this number.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Number (with country code)
                </label>
                <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm font-semibold text-charcoal-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Example: +91 98765 43210. Customers click "Order via WhatsApp" and message this line directly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Contact Email
                  </label>
                  <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="maker@yourbrand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Visuals */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-5">
              <h3 className="text-base font-bold text-charcoal-900 pb-3 border-b border-stone-100">
                Visual Assets (Logo & Banner)
              </h3>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Store Logo URL
                </label>
                <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or uploaded asset URL"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Banner URL */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Store Header Banner URL
                </label>
                <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 bg-stone-50/50 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... wide banner image"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Storefront Card Preview & Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Preview Card */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  Store Header Preview
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* Visual Banner Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-stone-900 text-white shadow-sm border border-stone-200">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Banner Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  <div className="flex items-center gap-2.5">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white/80 shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-serif font-bold text-lg flex items-center justify-center border-2 border-white/80 shadow-xs">
                        {name ? name.charAt(0) : "S"}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {name || "Your Store"}
                      </h4>
                      <p className="text-[10px] text-stone-300 font-mono">
                        sellnest.store/{slug || "handle"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-charcoal-900">Store Status</div>
                  <div className="text-[11px] text-charcoal-500">
                    {isPublished ? "Open for orders" : "Paused / Maintenance"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    isPublished ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isPublished ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button Card */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-purple-glow hover:shadow-purple-glow-lg transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Storefront Settings</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-charcoal-400 text-center">
                Updates are published to your public link immediately.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

