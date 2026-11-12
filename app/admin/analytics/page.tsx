"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  Store,
  Calendar,
  RefreshCw,
  Loader2,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface AnalyticsData {
  planDistribution: {
    free: number;
    starter: number;
    pro: number;
  };
  conversionRate: number;
  totalVerifiedRevenue: number;
  chartData: Array<{
    label: string;
    sellers: number;
    stores: number;
    revenue: number;
  }>;
  summary: {
    totalSellers: number;
    totalStores: number;
    paidSellers: number;
    pendingRequests: number;
  };
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<"growth" | "revenue">("growth");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.analytics);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const totalSellers = data?.summary.totalSellers || 0;
  const freeCount = data?.planDistribution.free || 0;
  const starterCount = data?.planDistribution.starter || 0;
  const proCount = data?.planDistribution.pro || 0;

  const freePct = totalSellers > 0 ? Math.round((freeCount / totalSellers) * 100) : 0;
  const starterPct = totalSellers > 0 ? Math.round((starterCount / totalSellers) * 100) : 0;
  const proPct = totalSellers > 0 ? Math.round((proCount / totalSellers) * 100) : 0;

  // Max value for chart bar scaling
  const maxGrowthValue = Math.max(
    1,
    ...(data?.chartData.map((d) => Math.max(d.sellers, d.stores)) || [1])
  );
  const maxRevenueValue = Math.max(
    1,
    ...(data?.chartData.map((d) => d.revenue) || [1])
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Platform Metrics
            </span>
            <span className="text-xs text-charcoal-400">Multi-tenant Insights</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight mt-1">
            Platform Analytics
          </h1>
          <p className="text-xs text-charcoal-600">
            Real platform growth, verified recurring revenue, plan conversion ratios, and tenant activity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Time Range Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-subtle">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  timeRange === t.id
                    ? "bg-purple-600 text-white shadow-subtle"
                    : "text-charcoal-600 hover:text-charcoal-950"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="bg-white rounded-3xl p-16 border border-stone-200 text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-charcoal-600">Calculating real-time platform metrics...</p>
        </div>
      ) : (
        <>
          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Verified Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  Verified Monthly Rev
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-charcoal-950 font-mono mt-2">
                {formatINR(data?.totalVerifiedRevenue || 0)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-md w-fit">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified payments only</span>
              </div>
            </div>

            {/* Card 2: Conversion Rate */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  Free → Paid Conversion
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-charcoal-950 mt-2">
                {data?.conversionRate || 0}%
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-700 font-semibold bg-purple-50/80 px-2 py-0.5 rounded-md w-fit">
                <Zap className="w-3 h-3" />
                <span>{data?.summary.paidSellers} paying sellers</span>
              </div>
            </div>

            {/* Card 3: Total Sellers */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  Total Sellers
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-charcoal-950 mt-2">
                {data?.summary.totalSellers || 0}
              </p>
              <p className="text-[11px] text-charcoal-500 mt-2">
                {data?.summary.paidSellers} paid • {freeCount} on free tier
              </p>
            </div>

            {/* Card 4: Total Storefronts */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  Total Storefronts
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-charcoal-950 mt-2">
                {data?.summary.totalStores || 0}
              </p>
              <p className="text-[11px] text-charcoal-500 mt-2">
                All tenant online storefronts
              </p>
            </div>
          </div>

          {/* Plan Distribution Breakdown Section */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                  Subscription Tier Distribution
                </h3>
                <p className="text-xs text-charcoal-500">
                  Breakdown of active sellers across SellNest subscription tiers.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-charcoal-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                Total Base: {totalSellers} sellers
              </div>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
              <div
                style={{ width: `${freePct}%` }}
                className="bg-stone-300 transition-all duration-500"
                title={`Free: ${freePct}%`}
              />
              <div
                style={{ width: `${starterPct}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`Starter: ${starterPct}%`}
              />
              <div
                style={{ width: `${proPct}%` }}
                className="bg-purple-600 transition-all duration-500"
                title={`Pro: ${proPct}%`}
              />
            </div>

            {/* 3 Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* Free Tier */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-stone-600">Free Tier</span>
                  <span className="text-xs font-mono font-bold text-stone-700">₹0/mo</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-charcoal-950">{freeCount}</span>
                  <span className="text-xs font-bold text-stone-500">{freePct}% of sellers</span>
                </div>
                <p className="text-[11px] text-stone-500">10 products max limit</p>
              </div>

              {/* Starter Tier */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-blue-700">Starter Plan</span>
                  <span className="text-xs font-mono font-bold text-blue-800">₹99/mo</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-blue-950">{starterCount}</span>
                  <span className="text-xs font-bold text-blue-600">{starterPct}% of sellers</span>
                </div>
                <p className="text-[11px] text-blue-600">100 products limit & custom themes</p>
              </div>

              {/* Pro Tier */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-purple-700">Pro Plan</span>
                  <span className="text-xs font-mono font-bold text-purple-800">₹199/mo</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-purple-950">{proCount}</span>
                  <span className="text-xs font-bold text-purple-600">{proPct}% of sellers</span>
                </div>
                <p className="text-[11px] text-purple-600">Unlimited products & priority support</p>
              </div>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-charcoal-950 uppercase tracking-wider">
                  Growth & Trend Analysis ({timeRange.toUpperCase()})
                </h3>
                <p className="text-xs text-charcoal-500">
                  Daily registrations, store additions, and verified subscription receipts.
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setChartMetric("growth")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    chartMetric === "growth"
                      ? "bg-white text-charcoal-950 shadow-subtle"
                      : "text-charcoal-600 hover:text-charcoal-950"
                  }`}
                >
                  Sellers & Stores
                </button>
                <button
                  onClick={() => setChartMetric("revenue")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    chartMetric === "revenue"
                      ? "bg-white text-charcoal-950 shadow-subtle"
                      : "text-charcoal-600 hover:text-charcoal-950"
                  }`}
                >
                  Verified Revenue (₹)
                </button>
              </div>
            </div>

            {/* Bar Chart Display */}
            <div className="pt-4 pb-2">
              {data?.chartData && data.chartData.length > 0 ? (
                <div className="h-64 flex items-end gap-2 sm:gap-3 overflow-x-auto pb-6 pt-4 px-2">
                  {data.chartData.map((item, idx) => {
                    const growthHeight = Math.max(
                      8,
                      Math.round((Math.max(item.sellers, item.stores) / maxGrowthValue) * 180)
                    );
                    const revHeight = Math.max(
                      8,
                      Math.round((item.revenue / maxRevenueValue) * 180)
                    );

                    return (
                      <div
                        key={idx}
                        className="flex-1 min-w-[38px] flex flex-col items-center gap-2 group relative"
                      >
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full mb-2 bg-charcoal-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg transition-opacity z-20">
                          {item.label}
                          {chartMetric === "growth" ? (
                            <div>
                              +{item.sellers} sellers • +{item.stores} stores
                            </div>
                          ) : (
                            <div>Revenue: {formatINR(item.revenue)}</div>
                          )}
                        </div>

                        {/* Bar */}
                        {chartMetric === "growth" ? (
                          <div className="w-full flex items-end justify-center gap-1 h-48">
                            <div
                              style={{
                                height: `${Math.max(
                                  6,
                                  Math.round((item.sellers / maxGrowthValue) * 180)
                                )}px`,
                              }}
                              className="w-1/2 bg-purple-600 rounded-t-md hover:bg-purple-700 transition"
                            />
                            <div
                              style={{
                                height: `${Math.max(
                                  6,
                                  Math.round((item.stores / maxGrowthValue) * 180)
                                )}px`,
                              }}
                              className="w-1/2 bg-blue-500 rounded-t-md hover:bg-blue-600 transition"
                            />
                          </div>
                        ) : (
                          <div className="w-full flex items-end justify-center h-48">
                            <div
                              style={{ height: `${revHeight}px` }}
                              className="w-3/4 bg-emerald-600 rounded-t-md hover:bg-emerald-700 transition"
                            />
                          </div>
                        )}

                        {/* Date Label */}
                        <span className="text-[10px] font-semibold text-charcoal-500 truncate w-full text-center">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-charcoal-500">
                  No data points available for this period.
                </div>
              )}

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-stone-100 text-xs">
                {chartMetric === "growth" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-600" />
                      <span className="font-semibold text-charcoal-700">New Sellers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <span className="font-semibold text-charcoal-700">Stores Created</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-600" />
                    <span className="font-semibold text-charcoal-700">Verified Revenue (₹)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

