"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  Clock,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertTriangle,
  History,
  RefreshCw,
} from "lucide-react";
import { AdminOverviewStats, SellerAdminView, AdminAuditLog } from "@/lib/types";
import { SubscriptionUpgradeRequest } from "@/lib/plans";
import { formatINR } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [recentSellers, setRecentSellers] = useState<SellerAdminView[]>([]);
  const [recentRequests, setRecentRequests] = useState<SubscriptionUpgradeRequest[]>([]);
  const [recentActivity, setRecentActivity] = useState<AdminAuditLog[]>([]);
  const [chartData, setChartData] = useState<
    Array<{ label: string; sellers: number; stores: number; revenue: number }>
  >([]);
  const [chartMetric, setChartMetric] = useState<"sellers" | "stores" | "revenue">("sellers");

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentSellers(data.recentSellers || []);
        setRecentRequests(data.recentRequests || []);
        setRecentActivity(data.recentActivity || []);
        setChartData(data.chartData || []);
      }
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">
          Aggregating real-time platform metrics...
        </p>
      </div>
    );
  }

  const maxChartVal = Math.max(
    ...chartData.map((d) =>
      chartMetric === "revenue" ? d.revenue : chartMetric === "stores" ? d.stores : d.sellers
    ),
    chartMetric === "revenue" ? 500 : 5
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Platform Overview
            </h1>
            <span className="text-xs font-semibold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
              Live Database Figures
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Real-time aggregate performance, seller adoption, catalog metrics, and revenue across
            the SellNest network.
          </p>
        </div>

        <button
          onClick={fetchOverviewData}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-charcoal-700 hover:bg-stone-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 1. TOP METRIC CARDS (9 KEY METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Sellers */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Registered Sellers
            </span>
            <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
              {stats.totalSellers}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              +{stats.newRegistrations30d} new in last 30d
            </span>
          </div>
        </div>

        {/* Active Stores */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Active Storefronts
            </span>
            <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
              {stats.totalActiveStores}
            </div>
            <span className="text-[10px] text-charcoal-500 font-medium">Published & live online</span>
          </div>
        </div>

        {/* Total Products Listed */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Products Listed
            </span>
            <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
              {stats.totalProducts}
            </div>
            <span className="text-[10px] text-charcoal-500 font-medium">Across all creator catalogs</span>
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Orders Placed
            </span>
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-charcoal-950">
              {stats.totalOrders}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Direct store checkouts</span>
          </div>
        </div>

        {/* Verified Subscription Revenue */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 to-charcoal-950 text-white shadow-card flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              Verified Revenue
            </span>
            <span className="w-7 h-7 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
              ₹
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              {formatINR(stats.totalVerifiedRevenue)}
            </div>
            <span className="text-[10px] text-purple-300 font-medium">
              Approved subscription charges
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Metric Bar (Subscription Tiers & Conversion) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Pending Upgrades
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xl font-black ${
                stats.pendingUpgradeRequests > 0 ? "text-amber-600" : "text-charcoal-700"
              }`}
            >
              {stats.pendingUpgradeRequests}
            </span>
            {stats.pendingUpgradeRequests > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.2 rounded-full">
                Review Required
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Starter Subscribers (₹99)
          </span>
          <div className="text-xl font-black text-purple-700 mt-1">
            {stats.activeStarterSubscribers}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Pro Subscribers (₹199)
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {stats.activeProSubscribers}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Free-to-Paid Conversion
          </span>
          <div className="text-xl font-black text-charcoal-950 mt-1">
            {stats.conversionRate}%
          </div>
        </div>
      </div>

      {/* 2. PLATFORM GROWTH CHART */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Platform Growth & Velocity</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Daily distribution of seller registrations, storefront creations, and verified revenue
            </p>
          </div>

          {/* Metric Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold text-charcoal-600">
            <button
              onClick={() => setChartMetric("sellers")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === "sellers" ? "bg-white text-purple-900 shadow-xs" : "hover:text-charcoal-900"
              }`}
            >
              New Sellers
            </button>
            <button
              onClick={() => setChartMetric("stores")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === "stores" ? "bg-white text-purple-900 shadow-xs" : "hover:text-charcoal-900"
              }`}
            >
              Stores Created
            </button>
            <button
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === "revenue" ? "bg-white text-purple-900 shadow-xs" : "hover:text-charcoal-900"
              }`}
            >
              Verified Revenue (₹)
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-60 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-4 border-b border-stone-100">
          {chartData.map((item, idx) => {
            const currentVal =
              chartMetric === "revenue"
                ? item.revenue
                : chartMetric === "stores"
                ? item.stores
                : item.sellers;

            const heightPct = Math.max(Math.round((currentVal / maxChartVal) * 100), 8);
            const isToday = idx === chartData.length - 1;

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                <div className="text-[10px] font-bold text-charcoal-900 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                  {chartMetric === "revenue" ? formatINR(item.revenue) : `${currentVal} entries`}
                </div>

                <div
                  className={`w-full max-w-[50px] rounded-t-xl transition-all duration-300 ${
                    isToday
                      ? "bg-gradient-to-t from-purple-700 to-indigo-600 shadow-purple-glow"
                      : "bg-purple-100 group-hover:bg-purple-300"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />

                <span
                  className={`text-[11px] font-semibold ${
                    isToday ? "text-purple-800 font-bold" : "text-charcoal-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TWO-COLUMN SPLIT: RECENT SELLERS + RECENT UPGRADE REQUESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-charcoal-950">Recent Seller Registrations</h3>
            <Link
              href="/admin/sellers"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5">Seller</th>
                  <th className="py-2.5">Store</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentSellers.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-charcoal-900">{s.full_name}</div>
                      <div className="text-[10px] text-charcoal-400 font-mono">{s.email}</div>
                    </td>
                    <td className="py-3 text-charcoal-700 font-semibold">
                      {s.store?.name || "No store created"}
                    </td>
                    <td className="py-3">
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {s.subscription_plan}
                      </span>
                    </td>
                    <td className="py-3 text-right text-charcoal-500 font-mono text-[11px]">
                      {new Date(s.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Upgrade Requests */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-charcoal-950">Recent Upgrade Requests</h3>
              {stats.pendingUpgradeRequests > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats.pendingUpgradeRequests} Pending
                </span>
              )}
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Review Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5">Ref #</th>
                  <th className="py-2.5">Seller</th>
                  <th className="py-2.5">Target Plan</th>
                  <th className="py-2.5">UTR</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 font-mono font-bold text-charcoal-900">
                      {r.request_number}
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-charcoal-900">{r.seller_name}</div>
                      <div className="text-[10px] text-charcoal-400 font-mono truncate max-w-[120px]">
                        {r.seller_email}
                      </div>
                    </td>
                    <td className="py-3 font-bold text-purple-700 uppercase text-[11px]">
                      {r.target_plan_id} (₹{r.amount})
                    </td>
                    <td className="py-3 font-mono text-charcoal-700 text-[11px]">
                      {r.transaction_reference}
                    </td>
                    <td className="py-3 text-right">
                      {r.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending
                        </span>
                      ) : r.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. RECENT PLATFORM AUDIT LOG ACTIVITY FEED */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-charcoal-950">Administrative Audit Trail</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Secure record of all administrator interventions and moderation events
            </p>
          </div>
          <Link
            href="/admin/activity"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-charcoal-900 bg-stone-200/80 px-2 py-0.5 rounded-md text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-bold text-charcoal-900">
                      {log.target_name || log.target_id}
                    </span>
                  </div>
                  {log.reason && (
                    <p className="text-[11px] text-charcoal-600 mt-1">{log.reason}</p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 text-charcoal-400 font-mono text-[10px]">
                <div>{log.admin_email}</div>
                <div>
                  {new Date(log.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
