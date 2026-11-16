"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Check,
  Copy,
  Layout,
  Grid,
  Megaphone,
  Star,
  Zap,
  ShieldCheck,
  Compass,
  Code2,
  Eye,
  Sliders,
  CheckCircle2,
  PackageCheck,
  Layers,
  ArrowRight,
  Lock,
  Crown,
} from "lucide-react";
import {
  TRENDING_21ST_COMPONENTS,
  CATEGORY_LABELS,
  ComponentCategory,
  Component21st,
  filterComponents21st,
} from "@/lib/trendingComponents21st";
import { canUseComponent, ComponentPlanTier } from "@/lib/plans";
import { copyToClipboard } from "@/lib/utils";

interface ComponentLibrary21stProps {
  selectedHero: string;
  onSelectHero: (heroId: string) => void;
  installedComponents: string[];
  onToggleComponent: (componentId: string) => void;
  onInstallPack: (componentIds: string[]) => void;
  currentPlanId?: string;
  onUpgradeRequired?: (targetPlan: "starter" | "pro", componentTitle: string) => void;
}

export default function ComponentLibrary21st({
  selectedHero,
  onSelectHero,
  installedComponents,
  onToggleComponent,
  onInstallPack,
  currentPlanId = "free",
  onUpgradeRequired,
}: ComponentLibrary21stProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>("all");
  const [selectedPlanTier, setSelectedPlanTier] = useState<"all" | "free" | "starter" | "pro">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewSnippetId, setViewSnippetId] = useState<string | null>(null);

  // Filter components by category, search, and plan tier
  const filtered = useMemo(() => {
    return filterComponents21st(
      TRENDING_21ST_COMPONENTS,
      selectedCategory,
      searchQuery,
      selectedPlanTier
    );
  }, [selectedCategory, searchQuery, selectedPlanTier]);

  const handleCopyCode = (comp: Component21st, e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(comp.codeSnippet);
    setCopiedId(comp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Recommended 5-pack
  const RECOMMENDED_PACK = [
    "banner-infinite-marquee",
    "feat-3col-trust",
    "proof-avatar-stack",
    "badge-whatsapp-pulse",
    "feat-accordion-faq",
  ];

  const handleHeroSelect = (hero: { id: string; name: string; requiredPlan: ComponentPlanTier }) => {
    if (!canUseComponent(currentPlanId, hero.requiredPlan)) {
      onUpgradeRequired?.(
        hero.requiredPlan === "starter" ? "starter" : "pro",
        `${hero.name} Hero`
      );
      return;
    }
    onSelectHero(hero.id);
  };

  const handleComponentClick = (comp: Component21st) => {
    const isAccessible = canUseComponent(currentPlanId, comp.requiredPlan);
    if (!isAccessible) {
      onUpgradeRequired?.(
        comp.requiredPlan === "starter" ? "starter" : "pro",
        comp.name
      );
      return;
    }
    onToggleComponent(comp.id);
  };

  const handleInstallPackClick = () => {
    if (currentPlanId === "free") {
      onUpgradeRequired?.(
        "starter",
        "Trending 5-Component Starter Pack"
      );
      return;
    }
    onInstallPack(RECOMMENDED_PACK);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-zinc-950 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>21st.dev Component Catalog</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              100+ Trending Components &amp; Heros
            </h3>
            <p className="text-xs text-zinc-300 max-w-md">
              Basic components are free for everyone, 50% unlocked on Starter (₹99/mo), and all 100+ components unlocked on Pro (₹199/mo).
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <span className="text-xs font-mono font-bold text-purple-300 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
              {installedComponents.length} Installed &bull;{" "}
              {currentPlanId === "pro"
                ? "Pro (All Unlocked)"
                : currentPlanId === "starter"
                ? "Starter (50% Unlocked)"
                : "Free Plan (26 Basic)"}
            </span>
            <button
              type="button"
              onClick={handleInstallPackClick}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Install Trending Pack (5)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PLAN TIER ENTITLEMENT STATUS BAR */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {currentPlanId === "pro" ? (
            <Crown className="w-4 h-4 text-amber-500 shrink-0" />
          ) : currentPlanId === "starter" ? (
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
          )}
          <div>
            <span className="font-bold text-zinc-900">
              Current Plan:{" "}
              {currentPlanId === "pro"
                ? "Pro Plan (₹199/mo)"
                : currentPlanId === "starter"
                ? "Starter Plan (₹99/mo)"
                : "Free Plan (₹0)"}
            </span>
            <span className="text-zinc-500 block text-[11px]">
              {currentPlanId === "pro"
                ? "All 102 components & premium heroes are fully unlocked."
                : currentPlanId === "starter"
                ? "52 components unlocked (50% catalog). Upgrade to Pro for all 102."
                : "26 basic components unlocked. Upgrade to Starter (₹99) for 50%, or Pro (₹199) for all."}
            </span>
          </div>
        </div>

        {currentPlanId !== "pro" && (
          <button
            type="button"
            onClick={() => onUpgradeRequired?.(currentPlanId === "starter" ? "pro" : "starter", "All Components")}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs shrink-0 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{currentPlanId === "starter" ? "Upgrade to Pro (₹199)" : "Upgrade to Starter (₹99)"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3. ACTIVE HERO PICKER (Featured 21st.dev Heroes with Tier Badges) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select Active Storefront Hero
          </h4>
          <span className="text-[11px] text-purple-600 font-semibold">
            Changes live preview immediately
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            {
              id: "default",
              name: "Standard Theme Hero",
              author: "SellNest",
              tag: "Classic",
              requiredPlan: "free" as ComponentPlanTier,
              desc: "Default responsive banner matching your chosen theme.",
            },
            {
              id: "hero-split-showcase",
              name: "Split Image Showcase",
              author: "@shadcn",
              tag: "Free Basic",
              requiredPlan: "free" as ComponentPlanTier,
              desc: "Dual-column layout with photo showcase & CTA.",
            },
            {
              id: "hero-bento-grid",
              name: "Bento Grid Showcase",
              author: "@magicui",
              tag: "Starter (₹99)",
              requiredPlan: "starter" as ComponentPlanTier,
              desc: "Asymmetric cards showcasing fresh batch & metrics.",
            },
            {
              id: "hero-ambient-glow",
              name: "Ambient Glow Radial",
              author: "@aceternity",
              tag: "Pro (₹199)",
              requiredPlan: "pro" as ComponentPlanTier,
              desc: "Multi-layered radial gradient blur with dark aesthetics.",
            },
          ].map((h) => {
            const isSelected = selectedHero === h.id;
            const isAccessible = canUseComponent(currentPlanId, h.requiredPlan);

            return (
              <div
                key={h.id}
                onClick={() => handleHeroSelect(h)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-600"
                    : !isAccessible
                    ? "border-zinc-200 bg-stone-50/60 opacity-80 hover:opacity-100 hover:border-amber-300"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-900 flex items-center gap-1">
                      {!isAccessible && <Lock className="w-3 h-3 text-amber-600 shrink-0" />}
                      <span>{h.name}</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        h.requiredPlan === "free"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : h.requiredPlan === "starter"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-amber-50 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {h.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block">by {h.author}</span>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{h.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                  <span
                    className={
                      isSelected
                        ? "font-bold text-purple-700"
                        : !isAccessible
                        ? "font-bold text-amber-700"
                        : "text-zinc-500"
                    }
                  >
                    {isSelected
                      ? "✓ Active Hero"
                      : !isAccessible
                      ? `Locked (${h.requiredPlan === "starter" ? "₹99" : "₹199"})`
                      : "Click to Activate"}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full bg-zinc-300"
                    style={isSelected ? { backgroundColor: "#7C3AED" } : {}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PLAN TIER & CATEGORY FILTER TABS */}
      <div className="space-y-3">
        {/* Plan Access Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-1">
              Filter by Plan:
            </span>
            {[
              { id: "all", label: "All Plans (102)" },
              { id: "free", label: "Free Basic (26)" },
              { id: "starter", label: "Starter ₹99 (52)" },
              { id: "pro", label: "Pro ₹199 (102)" },
            ].map((tab) => {
              const active = selectedPlanTier === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPlanTier(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-zinc-400 font-mono">
            {filtered.length} matching components
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 100+ components (e.g. hero, marquee, trust, bento, badge)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-purple-600 text-xs bg-white shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"
            >
              &times;
            </button>
          )}
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(CATEGORY_LABELS) as ComponentCategory[]).map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <span>{meta.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {meta.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Component Cards Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((comp) => {
            const isInstalled = installedComponents.includes(comp.id);
            const isAccessible = canUseComponent(currentPlanId, comp.requiredPlan);
            const isViewingCode = viewSnippetId === comp.id;

            return (
              <div
                key={comp.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between bg-white shadow-2xs ${
                  isInstalled
                    ? "border-purple-400 ring-1 ring-purple-400/50 bg-purple-50/20"
                    : !isAccessible
                    ? "border-zinc-200/90 bg-stone-50/40"
                    : "border-zinc-200"
                }`}
              >
                <div className="space-y-2">
                  {/* Top Bar: Category + Plan Tier Pill + Badge */}
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {comp.category.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Plan Tier Pill */}
                      {comp.requiredPlan === "free" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Free
                        </span>
                      )}
                      {comp.requiredPlan === "starter" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                          Starter (₹99)
                        </span>
                      )}
                      {comp.requiredPlan === "pro" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-300">
                          PRO (₹199)
                        </span>
                      )}

                      {comp.badge && (
                        <span className="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                          {comp.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-zinc-900 leading-snug flex items-center gap-1">
                      {!isAccessible && (
                        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span>{comp.name}</span>
                    </h5>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      21st.dev &bull; {comp.author}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {comp.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Code Snippet Drawer */}
                  {isViewingCode && (
                    <div className="mt-2 p-2.5 rounded-xl bg-zinc-950 text-purple-300 font-mono text-[10px] overflow-x-auto max-h-36">
                      <pre>{comp.codeSnippet}</pre>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(comp, e)}
                      title="Copy React + Tailwind Code"
                      className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-xs transition-colors flex items-center gap-1"
                    >
                      {copiedId === comp.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewSnippetId(isViewingCode ? null : comp.id)}
                      className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-[10px] transition-colors"
                      title="View Code Snippet"
                    >
                      <Code2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Toggle Component on Storefront or Prompt Upgrade */}
                  {!isAccessible ? (
                    <button
                      type="button"
                      onClick={() => handleComponentClick(comp)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 active:scale-95"
                    >
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>{comp.requiredPlan === "starter" ? "Starter (₹99)" : "Pro (₹199)"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleComponentClick(comp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 ${
                        isInstalled
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Installed</span>
                        </>
                      ) : (
                        <span>+ Install</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
