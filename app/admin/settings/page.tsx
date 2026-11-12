"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  DollarSign,
  Layers,
  Power,
  Plus,
  Trash2,
  RefreshCw,
  Building,
} from "lucide-react";
import { PlatformSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Form states
  const [platformName, setPlatformName] = useState("SellNest");
  const [supportEmail, setSupportEmail] = useState("chopdekaradhrit2013@gmail.com");
  const [processingHours, setProcessingHours] = useState(24);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Pricing
  const [priceFree, setPriceFree] = useState(0);
  const [priceStarter, setPriceStarter] = useState(99);
  const [pricePro, setPricePro] = useState(199);

  // Limits
  const [limitFree, setLimitFree] = useState(10);
  const [limitStarter, setLimitStarter] = useState(100);

  // Payment instructions
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        const s: PlatformSettings = json.settings;
        setSettings(s);
        setPlatformName(s.platform_name || "SellNest");
        setSupportEmail(s.support_email || "chopdekaradhrit2013@gmail.com");
        setProcessingHours(s.processing_promise_hours || 24);
        setMaintenanceMode(Boolean(s.maintenance_mode));
        setPriceFree(s.plan_pricing?.free ?? 0);
        setPriceStarter(s.plan_pricing?.starter ?? 99);
        setPricePro(s.plan_pricing?.pro ?? 199);
        setLimitFree(s.plan_limits?.free ?? 10);
        setLimitStarter(s.plan_limits?.starter ?? 100);
        setInstructions(s.payment_instructions || []);
      }
    } catch (err) {
      console.error("Failed to load platform settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction("");
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);

    try {
      const updates: Partial<PlatformSettings> = {
        platform_name: platformName.trim(),
        support_email: supportEmail.trim(),
        processing_promise_hours: Number(processingHours),
        maintenance_mode: maintenanceMode,
        plan_pricing: {
          free: Number(priceFree),
          starter: Number(priceStarter),
          pro: Number(pricePro),
        },
        plan_limits: {
          free: Number(limitFree),
          starter: Number(limitStarter),
          pro: null, // unlimited
        },
        payment_instructions: instructions,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setToastMessage({ type: "error", text: data.error || "Failed to update settings." });
      } else {
        setToastMessage({
          type: "success",
          text: "Platform settings updated and logged to audit trail successfully.",
        });
        setSettings(data.settings);
      }
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message || "Failed to contact settings API." });
    } finally {
      setSaving(false);
    }
  };

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
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
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
              System Configuration
            </span>
            {settings?.updated_at && (
              <span className="text-xs text-charcoal-400">
                Last updated {new Date(settings.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight mt-1">
            Platform Settings
          </h1>
          <p className="text-xs text-charcoal-600">
            Configure platform branding, official support channels, subscription plan prices, and manual verification instructions.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
          Reload
        </button>
      </div>

      {loading && !settings ? (
        <div className="bg-white rounded-3xl p-16 border border-stone-200 text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-charcoal-600">Loading system settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Section 1: Platform Identity & Support */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                Platform Identity & Support
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700">Platform Brand Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  Official Platform Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-charcoal-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
                <p className="text-[11px] text-charcoal-400">
                  Target address for seller inquiries and escalation if upgrade takes over 24 hours.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Verification Turnaround Promise (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={processingHours}
                  onChange={(e) => setProcessingHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
                <p className="text-[11px] text-charcoal-400">
                  Communicated on the upgrade confirmation screen (default: 24h).
                </p>
              </div>

              {/* Maintenance Mode */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Power className={`w-4 h-4 ${maintenanceMode ? "text-red-600" : "text-stone-400"}`} />
                    <span className="text-xs font-bold text-charcoal-900">Maintenance Mode</span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Restrict public access during platform updates.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Subscription Plan Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                Subscription Plan Pricing (INR ₹ / month)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-stone-600 uppercase">Free Plan</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-charcoal-400">₹</span>
                  <input
                    type="number"
                    value={priceFree}
                    disabled
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold text-charcoal-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-stone-400">Always ₹0/month for basic onboarding.</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                <span className="text-xs font-bold text-blue-700 uppercase">Starter Plan</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={priceStarter}
                    onChange={(e) => setPriceStarter(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-900 font-mono focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <p className="text-[11px] text-blue-600">Configured default: ₹99/month.</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1.5">
                <span className="text-xs font-bold text-purple-700 uppercase">Pro Plan</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-700">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={pricePro}
                    onChange={(e) => setPricePro(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-900 font-mono focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <p className="text-[11px] text-purple-600">Configured default: ₹199/month.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Feature Entitlements & Catalog Limits */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                Plan Feature Limits (Product Catalog Cap)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Free Tier Limit</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={limitFree}
                  onChange={(e) => setLimitFree(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-charcoal-900 font-mono"
                  required
                />
                <p className="text-[11px] text-stone-500">Default: 10 products maximum.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Starter Tier Limit</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={limitStarter}
                  onChange={(e) => setLimitStarter(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-charcoal-900 font-mono"
                  required
                />
                <p className="text-[11px] text-stone-500">Default: 100 products maximum.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Pro Tier Limit</label>
                <input
                  type="text"
                  value="Unlimited"
                  disabled
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold text-purple-700 font-mono"
                />
                <p className="text-[11px] text-stone-500">Unlimited products on Pro tier.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Manual Payment Verification Instructions */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                  Payment Verification Instructions for Sellers
                </h2>
                <p className="text-xs text-charcoal-500">
                  Steps displayed to sellers when selecting Starter or Pro plans during manual upgrade checkout.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {instructions.map((inst, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                >
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-black flex items-center justify-center flex-shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium text-charcoal-800">{inst}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add step input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a new instruction step for sellers..."
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInstruction();
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-charcoal-900 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-charcoal-900 rounded-xl text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200/80 shadow-subtle">
            <div className="text-xs text-charcoal-500">
              {settings?.updated_by ? (
                <span>
                  Last modified by: <strong className="font-mono text-charcoal-700">{settings.updated_by}</strong>
                </span>
              ) : (
                <span>Changes will be immediately active platform-wide.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-subtle transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Platform Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

