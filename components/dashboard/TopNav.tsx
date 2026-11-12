"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  ExternalLink,
  Store,
  CheckCircle2,
  X,
  User,
  Settings,
  LogOut,
  Sparkles,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAuthorizedAdmin } from "@/lib/paymentConfig";
import { useRouter } from "next/navigation";

interface TopNavProps {
  onToggleMobileSidebar: () => void;
}

export function TopNav({ onToggleMobileSidebar }: TopNavProps) {
  const router = useRouter();
  const {
    store,
    user,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    markSingleNotificationAsRead,
  } = useDashboard();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const storeSlug = store?.slug || user?.username || "mystore";

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Welcome */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-charcoal-700 hover:bg-stone-100 md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-sm font-bold text-charcoal-900 leading-tight">
            Welcome back, {user?.full_name?.split(" ")[0] || "Maker"} 👋
          </div>
          <div className="text-[11px] text-charcoal-500">
            {store?.name || "Your Store"} • Seller Studio
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, orders or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white pl-9 pr-3.5 py-1.5 rounded-xl border border-stone-200/80 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View My Storefront Button */}
        <Link
          href={`/store/${storeSlug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-xs px-3.5 py-2 rounded-xl border border-purple-200 transition-all shadow-xs"
        >
          <Store className="w-3.5 h-3.5 text-purple-700" />
          <span className="hidden sm:inline">View My Store</span>
          <ExternalLink className="w-3 h-3 text-purple-500" />
        </Link>

        {/* Notifications Icon with Flyout */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
            }}
            className="p-2 rounded-xl text-charcoal-600 hover:text-charcoal-950 hover:bg-stone-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse shadow-xs">
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-charcoal-950 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotificationsCount > 0 ? (
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                      {unreadNotificationsCount} new
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-semibold">All caught up</span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markNotificationsAsRead()}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">
                    <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || "/dashboard/orders"}
                      onClick={() => {
                        if (!n.read) markSingleNotificationAsRead(n.id);
                        setNotificationsOpen(false);
                      }}
                      className={`block p-3.5 hover:bg-stone-50 transition-colors text-xs cursor-pointer ${
                        !n.read ? "bg-purple-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 font-bold text-charcoal-900">
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                          )}
                          <span className="line-clamp-1">{n.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 flex-shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-600 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-stone-100 text-center bg-stone-50/50 rounded-b-3xl">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-800 transition"
                >
                  View All Notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-purple-200 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "M"}
            </div>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-stone-100">
                <div className="text-xs font-bold text-charcoal-900">{user?.full_name}</div>
                <div className="text-[11px] text-charcoal-500 font-mono">@{user?.username}</div>
              </div>

              <div className="py-1 text-xs text-charcoal-700">
                <Link
                  href="/dashboard/store"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50"
                >
                  <Store className="w-3.5 h-3.5 text-stone-400" />
                  <span>My Storefront</span>
                </Link>
                <Link
                  href="/dashboard/billing"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50"
                >
                  <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                  <span>Plans & Billing</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span>Account Settings</span>
                </Link>

                {isAuthorizedAdmin(user?.email) && (
                  <Link
                    href="/admin"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2 bg-stone-900 text-purple-300 hover:bg-stone-950 font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Super Admin</span>
                    </div>
                    <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded-full uppercase font-mono">
                      Host
                    </span>
                  </Link>
                )}
              </div>

              <div className="pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

