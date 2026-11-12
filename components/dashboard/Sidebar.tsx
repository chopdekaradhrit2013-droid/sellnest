"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Palette,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useDashboard } from "@/lib/DashboardContext";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAuthorizedAdmin } from "@/lib/paymentConfig";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { store, user, plan, isSidebarCollapsed, toggleSidebar } = useDashboard();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Store", href: "/dashboard/store", icon: Store },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Store Appearance", href: "/dashboard/appearance", icon: Palette },
    { label: "Plans & Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  const storeSlug = store?.slug || user?.username || "mystore";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-stone-200/90 flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-stone-100">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 overflow-hidden"
              onClick={onCloseMobile}
            >
              <Logo size="sm" showWordmark={!isSidebarCollapsed} />
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-charcoal-700 hover:bg-stone-100 transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Active Store Selector Pill */}
          {!isSidebarCollapsed && (
            <div className="p-3 mx-3 mt-3 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                  Active Store
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="font-bold text-xs text-charcoal-900 truncate">
                {store?.name || "The Butter Room"}
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-purple-700">
                <span className="font-mono truncate">sellnest.com/store/{storeSlug}</span>
                <Link
                  href={`/store/${storeSlug}`}
                  target="_blank"
                  className="hover:text-purple-900 ml-1 shrink-0"
                  title="Open Storefront in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                <span className="text-charcoal-400 font-semibold uppercase">Plan</span>
                <Link
                  href="/dashboard/billing"
                  className="font-bold text-purple-700 hover:text-purple-800 bg-purple-100/70 hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors"
                >
                  {plan.name} Plan &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-purple-50 text-purple-900 font-bold border border-purple-200/70 shadow-xs"
                      : "text-charcoal-600 hover:text-charcoal-950 hover:bg-stone-100/80"
                  } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-purple-700" : "text-stone-400 group-hover:text-charcoal-700"
                    }`}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            {isAuthorizedAdmin(user?.email) && (
              <div className="pt-2 mt-2 border-t border-stone-100">
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 bg-stone-900 text-purple-300 hover:bg-stone-950 hover:text-purple-200 shadow-xs ${
                    isSidebarCollapsed ? "justify-center px-0" : ""
                  }`}
                  title={isSidebarCollapsed ? "Super Admin Panel" : undefined}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>Super Admin</span>
                      <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded-full uppercase font-mono">
                        Host
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-3 border-t border-stone-100">
          {!isSidebarCollapsed ? (
            <div className="p-2 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "M"}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-charcoal-900 truncate">
                    {user?.full_name || "Seller"}
                  </div>
                  <div className="text-[10px] text-charcoal-500 font-mono truncate">
                    @{user?.username || "store"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
                title={user?.full_name || "Seller"}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "M"}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

