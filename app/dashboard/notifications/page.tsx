"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Package,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Info,
  Calendar,
  Search,
  Filter,
  Check,
  ExternalLink,
  RefreshCw,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { AppNotification } from "@/lib/types";

export default function NotificationsCenterPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    markSingleNotificationAsRead,
    refreshNotifications,
  } = useDashboard();

  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = async () => {
    setLoading(true);
    await refreshNotifications();
    setLoading(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);

    // Tab filter
    let matchesTab = true;
    if (filterTab === "unread") {
      matchesTab = !n.read;
    } else if (filterTab === "orders") {
      matchesTab = Boolean(n.type?.startsWith("order.") || n.type === "payment.verified");
    } else if (filterTab === "billing") {
      matchesTab = Boolean(n.type?.startsWith("upgrade.") || n.type?.startsWith("subscription."));
    } else if (filterTab === "catalog") {
      matchesTab = Boolean(n.type?.startsWith("product."));
    }

    return matchesSearch && matchesTab;
  });

  const getNotificationIcon = (type?: string) => {
    if (type?.startsWith("order.")) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
      );
    }
    if (type === "payment.verified") {
      return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    }
    if (type?.startsWith("upgrade.") || type?.startsWith("subscription.")) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
      );
    }
    if (type === "product.out_of_stock") {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-stone-100 text-charcoal-700 flex items-center justify-center flex-shrink-0">
        <Info className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Notification Center
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs font-bold text-charcoal-500">
                {unreadNotificationsCount} unread
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-950 tracking-tight mt-1">
            Store Notifications
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Real-time updates on customer orders, plan verifications, catalog stock, and important store events.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={() => markNotificationsAsRead()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
            {(
              [
                { id: "all", label: "All" },
                { id: "unread", label: `Unread (${unreadNotificationsCount})` },
                { id: "orders", label: "Orders" },
                { id: "billing", label: "Plans & Upgrades" },
                { id: "catalog", label: "Stock Alerts" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  filterTab === tab.id
                    ? "bg-white text-charcoal-950 shadow-subtle"
                    : "text-charcoal-600 hover:text-charcoal-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-stone-200/80 text-center shadow-subtle">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-charcoal-900">No notifications found</h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              {filterTab === "unread"
                ? "You're all caught up! No unread notifications to review."
                : "No store notifications match your selected filter."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-subtle flex items-start gap-4 ${
                  isUnread
                    ? "border-purple-200 bg-purple-50/20 ring-1 ring-purple-100"
                    : "border-stone-200/80 hover:border-stone-300"
                }`}
              >
                {getNotificationIcon(notif.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm tracking-tight ${
                          isUnread ? "font-black text-charcoal-950" : "font-bold text-charcoal-800"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">{notif.time}</span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => {
                          if (isUnread) markSingleNotificationAsRead(notif.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => markSingleNotificationAsRead(notif.id)}
                        className="ml-auto text-[11px] font-semibold text-charcoal-500 hover:text-charcoal-900 transition px-2 py-1 rounded-lg hover:bg-stone-100"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

