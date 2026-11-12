"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowRight,
  Plus,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Store,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { getDashboardStats, populateSampleDataIfEmpty } from "@/lib/dashboardService";
import { formatINR } from "@/lib/utils";
import { Order } from "@/lib/types";

export default function DashboardOverviewPage() {
  const { store, user, loading: storeLoading } = useDashboard();

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<{
    stats: any;
    recentOrders: Order[];
    topProducts: any[];
    revenueChartData: any[];
  }>({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      pendingOrdersCount: 0,
    },
    recentOrders: [],
    topProducts: [],
    revenueChartData: [],
  });
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    if (!store?.id) return;
    setLoading(true);
    try {
      const data = await getDashboardStats(store.id);
      setStatsData(data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      loadData();
    }
  }, [store?.id]);

  const handleSeedSampleData = async () => {
    if (!store?.id) return;
    setSeeding(true);
    try {
      await populateSampleDataIfEmpty(store.id);
      await loadData();
    } catch (e) {
      console.error("Error populating sample data:", e);
    } finally {
      setSeeding(false);
    }
  };

  if (storeLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading store analytics...</p>
      </div>
    );
  }

  const { stats, recentOrders, topProducts, revenueChartData } = statsData;
  const isBrandNewStore = stats.totalProducts === 0 && stats.totalOrders === 0;

  // Find max revenue for chart normalization
  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 1000);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Store URL Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              {store?.name || "My Store"}
            </h1>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              🟢 Taking Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Store URL:{" "}
            <Link
              href={`/store/${store?.slug}`}
              target="_blank"
              className="font-mono text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              sellnest.store/{store?.slug} <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-purple-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href={`/store/${store?.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-charcoal-800 font-semibold text-xs px-4 py-2.5 rounded-xl border border-stone-200 shadow-subtle transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>Customer View</span>
          </Link>
        </div>
      </div>

      {/* Brand New Seller Empty State / Starter Option */}
      {isBrandNewStore && (
        <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-white to-amber-50/40 p-6 sm:p-8 border border-purple-200/80 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 shadow-xs inline-block">
                ✨ Ready to launch
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal-950">
                Welcome to your new Seller Studio!
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl leading-relaxed">
                Your store is online and reserved. Add your handcrafted products or populate a
                sample artisanal bakery catalog to see how your live storefront and analytics look.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleSeedSampleData}
                disabled={seeding}
                className="inline-flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all shadow-sm"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading Sample Bakes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Load Sample Bakery Items</span>
                  </>
                )}
              </button>

              <Link
                href="/dashboard/products"
                className="inline-flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-purple-glow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Product</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
            {formatINR(stats.totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>0% transaction fee</span>
            <span className="text-stone-300">•</span>
            <span className="text-charcoal-400 font-normal">Direct UPI</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
            {stats.totalOrders}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {stats.pendingOrdersCount > 0 ? (
              <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                {stats.pendingOrdersCount} pending confirmation
              </span>
            ) : (
              <span className="text-charcoal-400 font-medium">All orders fulfilled</span>
            )}
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Products</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
            {stats.totalProducts}
          </div>
          <div className="mt-2 text-xs text-charcoal-500 flex items-center justify-between">
            <span>In stock & catalog</span>
            <Link href="/dashboard/products" className="text-purple-700 font-semibold hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Metric 4: Customers */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Customers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-charcoal-950 font-sans tracking-tight">
            {stats.totalCustomers}
          </div>
          <div className="mt-2 text-xs text-charcoal-500 flex items-center justify-between">
            <span>Direct WhatsApp buyers</span>
            <Link href="/dashboard/customers" className="text-purple-700 font-semibold hover:underline">
              View list →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Revenue Over Time</h3>
              <p className="text-xs text-charcoal-500 mt-0.5">7-day sales breakdown</p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Last 7 Days
            </span>
          </div>

          {stats.totalRevenue === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-stone-50/50 rounded-2xl border border-stone-100">
              <BarChartIcon className="w-8 h-8 text-stone-300 mb-2" />
              <p className="text-xs font-semibold text-charcoal-600">No sales recorded yet</p>
              <p className="text-[11px] text-charcoal-400 mt-0.5 max-w-xs">
                As soon as buyers check out from your storefront, daily revenue bars will populate here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bar Chart Visualization */}
              <div className="h-52 flex items-end gap-3 sm:gap-4 pt-6 pb-2 px-2">
                {revenueChartData.map((item, idx) => {
                  const barHeightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 8);
                  const isToday = idx === revenueChartData.length - 1;

                  return (
                    <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="text-[10px] font-bold text-charcoal-800 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                        {formatINR(item.revenue)}
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                          isToday
                            ? "bg-gradient-to-t from-purple-700 to-indigo-600 shadow-purple-glow"
                            : "bg-purple-100 group-hover:bg-purple-300"
                        }`}
                        style={{ height: `${barHeightPercent}%` }}
                      />

                      {/* Label */}
                      <span className={`text-[11px] font-semibold ${isToday ? "text-purple-800 font-bold" : "text-charcoal-500"}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500">
                <span>Calculated from live orders</span>
                <span className="font-semibold text-charcoal-800">
                  Total in period: {formatINR(stats.totalRevenue)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Best-Selling Products */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-charcoal-900">Top Products</h3>
              <Link
                href="/dashboard/products"
                className="text-xs font-semibold text-purple-700 hover:underline"
              >
                View all →
              </Link>
            </div>

            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-charcoal-400 text-xs">
                <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>No product sales recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((prod, i) => (
                  <div key={prod.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                        #{i + 1}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-charcoal-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-charcoal-500">
                        {prod.salesCount} sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-charcoal-900">
                        {formatINR(prod.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <Link
              href="/dashboard/analytics"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              See detailed analytics breakdown →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders List */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Recent Orders</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">Latest orders received via your storefront</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-purple-700 hover:underline"
          >
            Manage all orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-charcoal-400 text-xs">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p>No orders yet. When customers place orders on your store, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-charcoal-900">
                      #{ord.order_number || ord.id.slice(0, 6)}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-charcoal-900">{ord.customer_name}</div>
                      <div className="text-[11px] text-charcoal-400">{ord.customer_phone}</div>
                    </td>
                    <td className="py-3.5 text-charcoal-600 max-w-xs truncate">
                      {ord.items && ord.items.length > 0
                        ? ord.items.map((it) => `${it.quantity}x ${it.product_name}`).join(", ")
                        : "Handcrafted order"}
                    </td>
                    <td className="py-3.5 font-bold text-charcoal-900">
                      {formatINR(ord.total_amount)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "confirmed"
                            ? "bg-purple-100 text-purple-800"
                            : ord.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <Link
                        href="/dashboard/orders"
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BarChartIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
