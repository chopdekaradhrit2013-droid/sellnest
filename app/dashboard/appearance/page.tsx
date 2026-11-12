"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
  Check,
  Eye,
  Globe,
  Upload,
  RefreshCw,
  MessageCircle,
  Instagram,
  Facebook,
  Sliders,
  Type,
  Layout,
  Share2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { canUseTheme } from "@/lib/plans";
import {
  updateStore,
  saveStoreDraft,
  publishStore,
  unpublishStore,
  getStoreProducts,
} from "@/lib/dashboardService";
import {
  Store,
  Product,
  StoreTheme,
  StoreFont,
  StoreSocialLinks,
  StoreCustomization,
} from "@/lib/types";
import {
  STORE_THEMES,
  FONT_OPTIONS,
  PRESET_BRAND_COLORS,
  PRESET_LOGOS,
  PRESET_BANNERS,
  getThemeConfig,
} from "@/lib/themes";
import { validateSlug } from "@/lib/slugUtils";
import StorefrontView from "@/components/storefront/StorefrontView";

export default function StoreAppearanceBuilderPage() {
  const { store, plan, refreshStore, loading: storeLoading } = useDashboard();

  // Active editor tab
  const [activeTab, setActiveTab] = useState<"theme" | "branding" | "content" | "social">("theme");
  const [themeUpgradeModal, setThemeUpgradeModal] = useState<{
    open: boolean;
    title?: string;
    description?: string;
  } | null>(null);

  // Form & Draft states
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<StoreTheme>("modern");
  const [fontFamily, setFontFamily] = useState<StoreFont>("sans");
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState("#4F46E5");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState<StoreSocialLinks>({
    instagram: "",
    facebook: "",
    website: "",
  });
  const [isPublished, setIsPublished] = useState(true);

  // Slug validation status
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available: boolean; error?: string } | null>(null);

  // Preview & Viewport states
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Async action states
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Sync initial store data
  useEffect(() => {
    if (store) {
      // Check if there is an existing draft, otherwise use live settings
      const source = (store.draft_settings as Partial<Store>) || store;

      setStoreName(source.name || store.name || "");
      setStoreSlug(source.slug || store.slug || "");
      setDescription(source.description || store.description || "");
      setTheme(source.theme || store.theme || "modern");
      setFontFamily(source.font_family || store.font_family || "sans");
      setAccentColor(source.accent_color || store.accent_color || "#7C3AED");
      setSecondaryColor(source.secondary_color || store.secondary_color || "#4F46E5");
      setLogoUrl(source.logo_url || store.logo_url || "");
      setBannerUrl(source.banner_url || store.banner_url || "");
      setAnnouncement(source.announcement || store.announcement || "");
      setWhatsappNumber(source.whatsapp_number || store.whatsapp_number || "");
      setSocialLinks(source.social_links || store.social_links || {});
      setIsPublished(store.is_published ?? true);
      setHasUnsavedChanges(false);
    }
  }, [store]);

  // Load products for live preview
  useEffect(() => {
    async function loadProds() {
      if (store?.id) {
        const prods = await getStoreProducts(store.id);
        setSampleProducts(prods);
      }
    }
    loadProds();
  }, [store?.id]);

  // Slug check debounced
  useEffect(() => {
    if (!storeSlug || storeSlug === store?.slug) {
      setSlugStatus(null);
      setSlugChecking(false);
      return;
    }

    const val = validateSlug(storeSlug);
    if (!val.isValid) {
      setSlugStatus({ available: false, error: val.error });
      return;
    }

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        const res = await fetch(
          `/api/store/check-slug?slug=${encodeURIComponent(storeSlug)}&storeId=${store?.id || ""}`
        );
        const data = await res.json();
        setSlugStatus({
          available: data.available,
          error: data.error,
        });
      } catch {
        setSlugStatus({ available: true });
      } finally {
        setSlugChecking(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [storeSlug, store?.slug, store?.id]);

  // Track unsaved modifications
  const markDirty = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  // Assembled live draft store object for real-time preview
  const livePreviewStore: Partial<Store> = useMemo(() => {
    return {
      id: store?.id || "preview-store",
      seller_id: store?.seller_id || "seller",
      name: storeName || "My Store",
      slug: storeSlug || store?.slug || "mystore",
      description,
      theme,
      font_family: fontFamily,
      accent_color: accentColor,
      secondary_color: secondaryColor,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      announcement,
      whatsapp_number: whatsappNumber,
      social_links: socialLinks,
      currency: "INR",
      is_published: isPublished,
    };
  }, [
    store,
    storeName,
    storeSlug,
    description,
    theme,
    fontFamily,
    accentColor,
    secondaryColor,
    logoUrl,
    bannerUrl,
    announcement,
    whatsappNumber,
    socialLinks,
    isPublished,
  ]);

  // Current draft payload
  const currentDraftPayload: Partial<Store> = {
    name: storeName,
    slug: storeSlug,
    description,
    theme,
    font_family: fontFamily,
    accent_color: accentColor,
    secondary_color: secondaryColor,
    logo_url: logoUrl,
    banner_url: bannerUrl,
    announcement,
    whatsapp_number: whatsappNumber,
    social_links: socialLinks,
  };

  // 1. SAVE DRAFT
  const handleSaveDraft = async () => {
    if (!store?.id) return;
    setSavingDraft(true);
    setStatusMessage(null);

    const { error } = await saveStoreDraft(store.id, currentDraftPayload);

    if (error) {
      setStatusMessage({ type: "error", text: error });
    } else {
      setHasUnsavedChanges(false);
      setStatusMessage({ type: "success", text: "Draft changes saved successfully!" });
      await refreshStore();
    }
    setSavingDraft(false);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // 2. PUBLISH STORE (Apply draft to live)
  const handlePublish = async () => {
    if (!store?.id) return;

    if (slugStatus && !slugStatus.available) {
      alert("Please fix the store handle error before publishing.");
      return;
    }

    setPublishing(true);
    setStatusMessage(null);

    const { error } = await publishStore(store.id, currentDraftPayload);

    if (error) {
      setStatusMessage({ type: "error", text: error });
    } else {
      setIsPublished(true);
      setHasUnsavedChanges(false);
      setStatusMessage({
        type: "success",
        text: "Store published! Your storefront is now live with the latest changes.",
      });
      await refreshStore();
    }
    setPublishing(false);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // 3. UNPUBLISH TOGGLE
  const handleTogglePublished = async () => {
    if (!store?.id) return;
    setPublishing(true);

    if (isPublished) {
      await unpublishStore(store.id);
      setIsPublished(false);
      setStatusMessage({
        type: "success",
        text: "Store unpublished. Only you can view it via draft preview.",
      });
    } else {
      await publishStore(store.id, currentDraftPayload);
      setIsPublished(true);
      setStatusMessage({
        type: "success",
        text: "Store is published and live!",
      });
    }

    await refreshStore();
    setPublishing(false);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  if (storeLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading Storefront Builder...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-zinc-100">
      {/* TOP BUILDER TOOLBAR */}
      <div className="h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
        {/* Left: Store info & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <h2 className="font-semibold text-sm text-zinc-900 hidden sm:inline">Storefront Builder</h2>
          </div>

          <span className="text-zinc-300 hidden sm:inline">|</span>

          {/* Published vs Draft Pill */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-xs font-medium text-zinc-600">
              {isPublished ? "Published" : "Draft Only"}
            </span>
          </div>

          {hasUnsavedChanges ? (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Unsaved changes
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hidden md:inline">
              All changes saved
            </span>
          )}
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              viewport === "desktop"
                ? "bg-white text-zinc-900 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              viewport === "tablet"
                ? "bg-white text-zinc-900 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              viewport === "mobile"
                ? "bg-white text-zinc-900 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* External Links */}
          <Link
            href={`/store/${storeSlug || store?.slug}?preview=draft`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Preview Draft in New Tab"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span>Preview Draft</span>
          </Link>

          {isPublished && (
            <Link
              href={`/store/${storeSlug || store?.slug}`}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              title="Open Live Public Store"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Store</span>
            </Link>
          )}

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft || publishing}
            className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3 text-zinc-500" />
            )}
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing || savingDraft}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {publishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* STATUS NOTIFICATION TOAST */}
      {statusMessage && (
        <div
          className={`px-4 py-2 text-xs font-medium flex items-center justify-between border-b transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-400 hover:text-zinc-600 ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT CONTROLS + RIGHT LIVE PREVIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANEL: CUSTOMIZATION CONTROLS */}
        {/* ============================================================== */}
        <aside className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-zinc-200 flex flex-col shrink-0 overflow-hidden shadow-xs">
          {/* Sub-Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-zinc-200 text-xs font-semibold text-zinc-500 bg-zinc-50/50">
            <button
              onClick={() => setActiveTab("theme")}
              className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === "theme"
                  ? "border-purple-600 text-purple-600 bg-white"
                  : "border-transparent hover:text-zinc-800"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setActiveTab("branding")}
              className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === "branding"
                  ? "border-purple-600 text-purple-600 bg-white"
                  : "border-transparent hover:text-zinc-800"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Branding</span>
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === "content"
                  ? "border-purple-600 text-purple-600 bg-white"
                  : "border-transparent hover:text-zinc-800"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Content</span>
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === "social"
                  ? "border-purple-600 text-purple-600 bg-white"
                  : "border-transparent hover:text-zinc-800"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Social</span>
            </button>
          </div>

          {/* Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* TAB 1: THEME & TYPOGRAPHY */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Storefront Theme
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Choose one of 4 professionally curated storefront design styles.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.values(STORE_THEMES).map((t) => {
                      const isSelected = theme === t.id;
                      const isAllowed = canUseTheme(plan?.id || "free", t.id);

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (!isAllowed) {
                              setThemeUpgradeModal({
                                open: true,
                                title: `${t.name} Theme (Starter & Pro)`,
                                description: `The ${t.name} storefront theme is available exclusively on the Starter (₹99/mo) and Pro (₹199/mo) plans. Upgrade to unlock this theme and unlimited store customization.`,
                              });
                              return;
                            }
                            setTheme(t.id);
                            setFontFamily(t.fontDefault);
                            markDirty();
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-purple-600 bg-purple-50/40 shadow-xs"
                              : !isAllowed
                              ? "border-stone-200 bg-stone-50/80 hover:border-purple-300"
                              : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full shadow-xs"
                                style={{ backgroundColor: t.defaultAccent }}
                              />
                              <h4 className="font-semibold text-sm text-zinc-900">{t.name}</h4>
                              {!isAllowed && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                                  <Lock className="w-3 h-3" />
                                  <span>Starter & Pro</span>
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <span className="p-0.5 rounded-full bg-purple-600 text-white">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">{t.tagline}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                            {t.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Typography Picker */}
                <div className="border-t border-zinc-100 pt-5">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Typography & Fonts
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Select typography pairing that expresses your brand personality.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFontFamily(f.id);
                          markDirty();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          fontFamily === f.id
                            ? "border-purple-600 bg-purple-50/50 shadow-xs"
                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                        }`}
                      >
                        <p className={`text-sm font-bold text-zinc-900 ${f.cssClass}`}>
                          {f.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{f.preview}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BRANDING & COLORS */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                {!plan?.limits?.customBranding && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-purple-950 flex items-start gap-2.5 text-xs shadow-xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Custom Brand Colors (Starter & Pro)</p>
                      <p className="text-[11px] text-purple-800 mt-0.5">
                        Free plan storefronts use SellNest's curated brand palette. Upgrade to Starter or Pro to apply your custom brand HEX colors and styling.
                      </p>
                      <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 hover:underline mt-1.5"
                      >
                        <span>Upgrade to customize branding</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Brand Colors */}
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Brand Color Palette
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Customize primary and secondary accents across buttons and badges.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">
                        Primary Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => {
                            setAccentColor(e.target.value);
                            markDirty();
                          }}
                          className="w-9 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => {
                            setAccentColor(e.target.value);
                            markDirty();
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">
                        Secondary Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => {
                            setSecondaryColor(e.target.value);
                            markDirty();
                          }}
                          className="w-9 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => {
                            setSecondaryColor(e.target.value);
                            markDirty();
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="pt-2">
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-2">
                        Curated Color Presets
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_BRAND_COLORS.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => {
                              setAccentColor(p.primary);
                              setSecondaryColor(p.secondary);
                              markDirty();
                            }}
                            className="px-2.5 py-1 text-[11px] rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span>{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Logo */}
                <div className="border-t border-zinc-100 pt-5">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Store Logo
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    Paste a direct image URL or choose one of our artisanal presets.
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                        {(storeName || "S").charAt(0)}
                      </div>
                    )}
                    <input
                      type="url"
                      placeholder="https://... logo image URL"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        markDirty();
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setLogoUrl(preset.url);
                          markDirty();
                        }}
                        className="px-2 py-1 text-[10px] font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner Image */}
                <div className="border-t border-zinc-100 pt-5">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Hero Cover Banner
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">
                    High-resolution photography displayed across your storefront header.
                  </p>

                  <input
                    type="url"
                    placeholder="https://... banner image URL"
                    value={bannerUrl}
                    onChange={(e) => {
                      setBannerUrl(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 mb-2"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_BANNERS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setBannerUrl(preset.url);
                          markDirty();
                        }}
                        className="px-2 py-1 text-[10px] font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT & STORE IDENTITY */}
            {activeTab === "content" && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => {
                      setStoreName(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Store Slug / Unique URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-700">
                      Store URL Handle (Slug)
                    </label>
                    {slugChecking && (
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Checking...
                      </span>
                    )}
                    {slugStatus && !slugChecking && (
                      <span
                        className={`text-[10px] font-semibold ${
                          slugStatus.available ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {slugStatus.available ? "✓ Available" : "✗ Unavailable"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center rounded-lg border border-zinc-300 overflow-hidden bg-zinc-50 focus-within:ring-1 focus-within:ring-purple-500">
                    <span className="px-2.5 py-2 text-xs text-zinc-400 font-mono select-none bg-zinc-100 border-r border-zinc-200">
                      sellnest.com/store/
                    </span>
                    <input
                      type="text"
                      required
                      value={storeSlug}
                      onChange={(e) => {
                        setStoreSlug(e.target.value.toLowerCase().trim());
                        markDirty();
                      }}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-white focus:outline-none"
                    />
                  </div>

                  {slugStatus?.error && (
                    <p className="text-[11px] text-red-600 mt-1 leading-tight">
                      {slugStatus.error}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Lowercase letters, numbers, and hyphens. 3 to 30 characters.
                  </p>
                </div>

                {/* Store Bio */}
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Store Bio / Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      markDirty();
                    }}
                    placeholder="Tell your customers about your craft, sourdough process, or story..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
                  />
                </div>

                {/* Announcement Banner */}
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Top Announcement Banner
                  </label>
                  <input
                    type="text"
                    value={announcement}
                    onChange={(e) => {
                      setAnnouncement(e.target.value);
                      markDirty();
                    }}
                    placeholder="✨ Free delivery on orders above ₹1,000 this weekend!"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Appears as a prominent banner at the very top of your storefront.
                  </p>
                </div>

                {/* Store Visibility */}
                <div className="border-t border-zinc-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Public Visibility</p>
                      <p className="text-[11px] text-zinc-500">
                        {isPublished
                          ? "Store is publicly accessible by customers."
                          : "Store is hidden. Only visible in draft preview."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleTogglePublished}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                      }`}
                    >
                      {isPublished ? "Published" : "Unpublished"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SOCIAL & WHATSAPP */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Order Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value);
                      markDirty();
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Customers will message this number directly with their pre-filled order basket.
                  </p>
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-800">Social Media Handles</h4>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 mb-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Instagram Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram || ""}
                      onChange={(e) => {
                        setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }));
                        markDirty();
                      }}
                      placeholder="https://instagram.com/thebutterroom"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 mb-1">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook Page URL</span>
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook || ""}
                      onChange={(e) => {
                        setSocialLinks((prev) => ({ ...prev, facebook: e.target.value }));
                        markDirty();
                      }}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Custom Website URL</span>
                    </label>
                    <input
                      type="url"
                      value={socialLinks.website || ""}
                      onChange={(e) => {
                        setSocialLinks((prev) => ({ ...prev, website: e.target.value }));
                        markDirty();
                      }}
                      placeholder="https://thebutterroom.in"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT PANEL: LIVE RESPONSIVE STOREFRONT PREVIEW */}
        {/* ============================================================== */}
        <main className="flex-1 bg-zinc-200/80 p-4 md:p-6 overflow-y-auto flex flex-col items-center justify-start">
          {/* Viewport Frame */}
          <div
            className={`transition-all duration-300 bg-white shadow-xl rounded-2xl overflow-hidden border border-zinc-300 flex flex-col ${
              viewport === "desktop"
                ? "w-full max-w-5xl min-h-[800px]"
                : viewport === "tablet"
                ? "w-[768px] min-h-[850px]"
                : "w-[375px] min-h-[750px]"
            }`}
          >
            {/* Mock browser address bar */}
            <div className="h-8 bg-zinc-100 border-b border-zinc-200 px-3 flex items-center gap-2 select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white px-4 py-0.5 rounded-md text-[10px] text-zinc-500 border border-zinc-200 flex items-center gap-1 font-mono">
                  <span className="text-zinc-400">https://</span>
                  <span>sellnest.com/store/</span>
                  <span className="font-semibold text-zinc-800">{storeSlug || "mystore"}</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Storefront Component */}
            <div className="flex-1 overflow-y-auto">
              <StorefrontView
                store={livePreviewStore}
                products={sampleProducts}
                isPreview={true}
                viewport={viewport}
              />
            </div>
          </div>
        </main>
      </div>

      {/* THEME & FEATURE UPGRADE MODAL */}
      {themeUpgradeModal?.open && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Exclusive Feature
                </span>
                <h3 className="text-lg font-bold text-charcoal-950 mt-1">
                  {themeUpgradeModal.title || "Upgrade Your Store"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              {themeUpgradeModal.description ||
                "This storefront feature requires a Starter (₹99/mo) or Pro (₹199/mo) plan."}
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal-900">Starter Plan (₹99/mo)</span>
                <span className="text-purple-700 font-semibold">All 4 Themes & Custom Colors</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal-900">Pro Plan (₹199/mo)</span>
                <span className="text-emerald-700 font-semibold">Full Customization & Analytics</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setThemeUpgradeModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/dashboard/billing"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Plans & Billing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
