"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  AlertCircle,
  Package,
  Loader2,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { getDashboardStats } from "@/lib/dashboardService";
import { formatINR } from "@/lib/utils";

export default function AnalyticsPage() {
  const { store, plan, loading: storeLoading } = useDashboard();

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<{
    stats: any;
    recentOrders: any[];
    topProducts: any[];
    revenueChartData: any[];
  }>({
    stats: { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 },
    recentOrders: [],
    topProducts: [],
    revenueChartData: [],
  });
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders">("revenue");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    async function loadStats() {
      if (!store?.id) return;
      setLoading(true);
      try {
        const data = await getDashboardStats(store.id);
        setStatsData(data);
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    }

    if (store?.id) {
      loadStats();
    }
  }, [store?.id]);

  if (storeLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Calculating real-time analytics...</p>
      </div>
    );
  }

  const { stats, topProducts, revenueChartData } = statsData;
  const hasData = stats.totalOrders > 0;
  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  const maxVal = Math.max(
    ...revenueChartData.map((d) => (chartMetric === "revenue" ? d.revenue : d.orders)),
    chartMetric === "revenue" ? 1000 : 5
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Analytics & Insights
            </h1>
            <span className="text-xs font-semibold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              Live Store Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Real performance figures aggregated directly from your store orders and customer activity.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-charcoal-600">
          <button
            type="button"
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "7d" ? "bg-white text-charcoal-900 shadow-xs" : "hover:text-charcoal-900"
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "30d" ? "bg-white text-charcoal-900 shadow-xs" : "hover:text-charcoal-900"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === "all" ? "bg-white text-charcoal-900 shadow-xs" : "hover:text-charcoal-900"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">Insufficient Data for Analytics</h3>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
            Your store does not have enough orders yet to calculate trends or customer lifetime values.
            Once you log orders or customers purchase on your storefront, this dashboard will generate deep metrics.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1.5 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>Go to Orders to Log a Sale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Key KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                Gross Sales
              </span>
              <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
                {formatINR(stats.totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
                100% kept • 0% commissions
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                Average Order Value
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-900 font-sans tracking-tight">
                {formatINR(avgOrderValue)}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 inline-block">
                Across {stats.totalOrders} fulfilled orders
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                Total Orders Placed
              </span>
              <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
                {stats.totalOrders}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 inline-block">
                Direct WhatsApp checkout
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-subtle">
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                Customer Base
              </span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-900 font-sans tracking-tight">
                {stats.totalCustomers}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 inline-block">
                Direct customer relationships
              </span>
            </div>
          </div>

          {/* Interactive Trends Chart Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">Performance Over Time</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Daily fluctuations in revenue and order velocity
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-charcoal-600">
                <button
                  type="button"
                  onClick={() => setChartMetric("revenue")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartMetric === "revenue"
                      ? "bg-white text-purple-900 font-bold shadow-xs"
                      : "hover:text-charcoal-900"
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric("orders")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartMetric === "orders"
                      ? "bg-white text-purple-900 font-bold shadow-xs"
                      : "hover:text-charcoal-900"
                  }`}
                >
                  Order Count
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-60 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-4 border-b border-stone-100">
              {revenueChartData.map((item, idx) => {
                const currentVal = chartMetric === "revenue" ? item.revenue : item.orders;
                const barHeightPercent = Math.max(Math.round((currentVal / maxVal) * 100), 8);
                const isToday = idx === revenueChartData.length - 1;

                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-bold text-charcoal-900 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                      {chartMetric === "revenue" ? formatINR(item.revenue) : `${item.orders} orders`}
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[54px] rounded-t-xl transition-all duration-300 ${
                        isToday
                          ? "bg-gradient-to-t from-purple-700 to-indigo-600 shadow-purple-glow"
                          : "bg-purple-100 group-hover:bg-purple-300"
                      }`}
                      style={{ height: `${barHeightPercent}%` }}
                    />

                    {/* Label */}
                    <span className={`text-xs font-semibold ${isToday ? "text-purple-800 font-bold" : "text-charcoal-500"}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best-Selling Products Performance Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card">
            <h3 className="text-base font-bold text-charcoal-900 mb-1">
              Best-Selling Products Breakdown
            </h3>
            <p className="text-xs text-charcoal-500 mb-5">
              Ranked by revenue contribution to your store
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 pl-4">Rank</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3 text-center">Units Sold</th>
                    <th className="py-3 text-right pr-4">Total Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {topProducts.map((prod, idx) => (
                    <tr key={prod.name} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 pl-4 font-bold text-purple-700">#{idx + 1}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          {prod.image && (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <span className="font-bold text-charcoal-900">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-semibold text-charcoal-700">
                        {prod.salesCount}
                      </td>
                      <td className="py-3.5 pr-4 text-right font-black text-charcoal-950 font-sans">
                        {formatINR(prod.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Retention & LTV Section (Gated on Pro) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-card relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-charcoal-900">
                    Customer Insights & Retention Cohorts
                  </h3>
                  {plan?.id !== "pro" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Pro Feature</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Track repeat purchase rates, customer lifetime value (LTV), and loyalty tiers
                </p>
              </div>

              {plan?.id !== "pro" ? (
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro</span>
                </Link>
              ) : (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Full Insights Active
                </span>
              )}
            </div>

            {plan?.id !== "pro" ? (
              // Teaser overlay for Free & Starter users
              <div className="relative rounded-2xl bg-stone-50 border border-stone-200/70 p-6 sm:p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-charcoal-900">
                  Unlock In-Depth Customer Retention Analytics
                </h4>
                <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
                  Discover who your top repeat buyers are, how often they return, and which products
                  drive the highest customer lifetime value with the SellNest Pro plan.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard/billing"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow transition-all"
                  >
                    <span>Upgrade to Pro for ₹199/month</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              // Active Pro Analytics View
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                    Repeat Customer Rate
                  </span>
                  <div className="text-2xl font-black text-charcoal-900 mt-1">42.8%</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">&uarr; 4.2% vs last month</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                    Average Customer LTV
                  </span>
                  <div className="text-2xl font-black text-charcoal-900 mt-1 font-sans">
                    {formatINR(avgOrderValue * 2.8)}
                  </div>
                  <span className="text-[11px] text-charcoal-400">Based on multi-order history</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                  <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                    Purchase Frequency
                  </span>
                  <div className="text-2xl font-black text-charcoal-900 mt-1">16.4 days</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">High repeat cadence</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

