"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  User,
  Store,
  Lock,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Bell,
  Mail,
  Zap,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function SettingsPage() {
  const router = useRouter();
  const { store, user, refreshStore, loading: storeLoading } = useDashboard();

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification Preferences state
  const [emailNewOrders, setEmailNewOrders] = useState(true);
  const [emailOrderStatus, setEmailOrderStatus] = useState(true);
  const [emailStockAlerts, setEmailStockAlerts] = useState(true);
  const [emailSubscription, setEmailSubscription] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState(false);

  // Load preferences
  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/notifications/preferences");
        if (res.ok) {
          const json = await res.json();
          if (json.preferences) {
            setEmailNewOrders(Boolean(json.preferences.email_new_orders));
            setEmailOrderStatus(Boolean(json.preferences.email_order_status));
            setEmailStockAlerts(Boolean(json.preferences.email_stock_alerts));
            setEmailSubscription(Boolean(json.preferences.email_subscription));
          }
        }
      } catch {}
    }
    loadPrefs();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsSuccess(false);

    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_new_orders: emailNewOrders,
          email_order_status: emailOrderStatus,
          email_stock_alerts: emailStockAlerts,
          email_subscription: emailSubscription,
        }),
      });

      if (res.ok) {
        setPrefsSuccess(true);
        setTimeout(() => setPrefsSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save prefs error:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
      return;
    }

    setSavingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  if (storeLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
          Settings & Account Management
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
          Manage your personal account, credentials, and store configurations.
        </p>
      </div>

      {/* Section 1: Account Information */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Account Information</h3>
            <p className="text-xs text-charcoal-500">Your profile details in SellNest</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-500 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              value={user?.full_name || ""}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50 text-charcoal-800 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-charcoal-500 uppercase mb-1">
              Store Handle / Username
            </label>
            <input
              type="text"
              readOnly
              value={`@${user?.username || ""}`}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50 font-mono text-purple-700 font-bold cursor-not-allowed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-charcoal-500 uppercase mb-1">
              Registered Email
            </label>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50">
              <span className="font-medium text-charcoal-800">{user?.email}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Store Information Summary */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Storefront Overview</h3>
              <p className="text-xs text-charcoal-500">Live settings for your online store</p>
            </div>
          </div>

          <Link
            href="/dashboard/store"
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
          >
            Edit in My Store →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold block mb-0.5">
              Store Name
            </span>
            <span className="font-bold text-charcoal-900">{store?.name || "The Butter Room"}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold block mb-0.5">
              Order WhatsApp Line
            </span>
            <span className="font-semibold text-emerald-700 font-mono">
              {store?.whatsapp_number || "Not set"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold block mb-0.5">
              Store Currency
            </span>
            <span className="font-bold text-charcoal-900">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Section 3: Password Management */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Password Management</h3>
            <p className="text-xs text-charcoal-500">Update your account login password</p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Your password has been updated securely.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg text-xs">
          {/* New password */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
              New Password (minimum 8 characters)
            </label>
            <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 bg-stone-50/50">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs font-medium text-charcoal-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-charcoal-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
              Confirm New Password
            </label>
            <div className="relative rounded-xl border border-stone-300 focus-within:border-purple-600 bg-stone-50/50">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs font-medium text-charcoal-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-charcoal-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-black text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Section 4: Notification Preferences */}
      <div id="notifications" className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Notification Preferences</h3>
              <p className="text-xs text-charcoal-500">
                Choose which transactional email alerts you receive. In-app notifications remain active.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/notifications"
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline hidden sm:inline"
          >
            Open Notification Center →
          </Link>
        </div>

        {prefsSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Notification preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="divide-y divide-stone-100">
            {/* Toggle 1: New orders */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  New Customer Order Alerts
                </span>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  Receive an email whenever a customer places an order on your storefront.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={emailNewOrders}
                  onChange={(e) => setEmailNewOrders(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 2: Order status */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  Order Status & Payment Updates
                </span>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  Email updates on payment verifications and customer delivery inquiries.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={emailOrderStatus}
                  onChange={(e) => setEmailOrderStatus(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 3: Low stock */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  Catalog Inventory & Stock Alerts
                </span>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  Instant alert when a product stock count drops to zero.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={emailStockAlerts}
                  onChange={(e) => setEmailStockAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 4: Subscription */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  Subscription & Upgrade Notices
                </span>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  Emails regarding plan renewal dates and manual payment approvals.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Security Notice: Always enabled */}
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-charcoal-900 block">
                    Security & Account Safeguards
                  </span>
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Mandatory
                  </span>
                </div>
                <span className="text-[11px] text-charcoal-500 block mt-0.5">
                  Critical security alerts, password resets, and account suspension notices cannot be disabled.
                </span>
              </div>
              <div className="text-xs font-bold text-stone-400 select-none">Always On</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPrefs}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-subtle transition-all"
          >
            {savingPrefs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Notification Preferences</span>
          </button>
        </form>
      </div>

      {/* Section 5: Danger Zone / Log Out */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-charcoal-900">Sign Out</h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            End your current Seller Studio session on this device.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs px-5 py-2.5 rounded-xl border border-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from SellNest</span>
        </button>
      </div>
    </div>
  );
}

