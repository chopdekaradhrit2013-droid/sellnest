"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  BarChart3,
  History,
  Settings,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/paymentConfig";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("chopdekaradhrit2013@gmail.com");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usePasskeyMode, setUsePasskeyMode] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [unreadAdminCount, setUnreadAdminCount] = useState(0);
  const [adminNotifsOpen, setAdminNotifsOpen] = useState(false);

  // Check admin session on mount
  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth/verify");
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          setIsAdminAuthenticated(true);
          setAdminEmail(data.email || PAYMENT_CONFIG.supportEmail);
          fetchPendingCount();
          fetchAdminNotifs();
          return;
        }
      }
      setIsAdminAuthenticated(false);
    } catch {
      setIsAdminAuthenticated(false);
    }
  };

  const fetchAdminNotifs = async () => {
    try {
      const res = await fetch("/api/notifications?recipientType=admin");
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setAdminNotifications(data.notifications);
          setUnreadAdminCount(data.unreadCount || 0);
        }
      }
    } catch {}
  };

  const markAdminNotifsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", recipientType: "admin" }),
      });
      setUnreadAdminCount(0);
      setAdminNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const fetchPendingCount = async () => {
    try {
      const res = await fetch("/api/admin/subscriptions?status=pending");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setPendingRequestsCount(data.stats.pending || 0);
        }
      }
    } catch {}
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail.trim() || PAYMENT_CONFIG.supportEmail,
          password: passwordInput,
          passkey: passkeyInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setLoginError(data.error || "Authentication failed. Invalid password or credentials.");
      } else {
        setIsAdminAuthenticated(true);
        setAdminEmail(data.email || PAYMENT_CONFIG.supportEmail);
        fetchPendingCount();
        fetchAdminNotifs();
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to contact admin authentication service.");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    setIsAdminAuthenticated(false);
    setPasskeyInput("");
    setPasswordInput("");
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Sellers", href: "/admin/sellers", icon: Users },
    { label: "Stores", href: "/admin/stores", icon: Store },
    {
      label: "Upgrade Requests",
      href: "/admin/subscriptions",
      icon: CreditCard,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { label: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Email Logs", href: "/admin/emails", icon: Mail },
    { label: "Activity Log", href: "/admin/activity", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // 1. Initial Loading State
  if (isAdminAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
        <p className="text-xs font-semibold text-stone-300">Verifying Super Admin Authorization...</p>
      </div>
    );
  }

  // 2. Unauthenticated Gate Screen (Strict Server-Validated Access)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-charcoal-950 to-purple-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-200/90 space-y-6 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-purple-glow">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Super Admin Gate
            </span>
            <h1 className="text-2xl font-black text-charcoal-950 tracking-tight">
              SellNest Command Center
            </h1>
            <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
              Restricted area. Only explicitly authorized administrators can access platform
              controls, moderate stores, and review upgrade requests.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-charcoal-700 block mb-1">
                Authorized Administrator Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 bg-stone-50 font-medium"
              />
              <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
                Primary Super Admin: chopdekaradhrit2013@gmail.com
              </span>
            </div>

            {!usePasskeyMode ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-charcoal-700 block">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setUsePasskeyMode(true)}
                    className="text-[10px] text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                  >
                    Use Passkey instead
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your account password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required={!usePasskeyMode}
                    className="w-full p-3 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Sign in with the password you created during signup.
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-charcoal-700 block">
                    Security Passkey / Admin Secret Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setUsePasskeyMode(false)}
                    className="text-[10px] text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                  >
                    Use Password instead
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter admin passkey..."
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  required={usePasskeyMode}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-purple-600 font-mono"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Enter your secure administrator passkey configured in environment.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Privileges...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 space-y-2 text-center text-xs">
            <p className="text-[11px] text-stone-500">
              Haven't registered your admin account yet?{" "}
              <Link
                href="/signup?email=chopdekaradhrit2013@gmail.com&name=Adhrit+Chopdekar"
                className="font-bold text-purple-700 hover:text-purple-800 underline"
              >
                Sign Up as chopdekaradhrit2013@gmail.com
              </Link>
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Seller Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Super Admin Dashboard Shell
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-charcoal-900 font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-charcoal-950 text-white w-64 border-r border-charcoal-800 flex flex-col justify-between transition-all duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand & Status */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-charcoal-800">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 overflow-hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-purple-glow">
                S
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block leading-none">
                  SellNest Admin
                </span>
                <span className="text-[10px] text-purple-400 font-mono">Super Console</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Identity Card */}
          <div className="p-3 mx-3 mt-3 rounded-2xl bg-charcoal-900 border border-charcoal-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Super Admin
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="font-mono text-xs text-stone-200 truncate">{adminEmail}</div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-purple-600 text-white font-bold shadow-purple-glow"
                      : "text-stone-300 hover:text-white hover:bg-charcoal-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-400"}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="bg-amber-500 text-charcoal-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Back to Seller View & Sign Out */}
        <div className="p-3 border-t border-charcoal-800 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-charcoal-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-400" />
            <span>Seller Dashboard</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] uppercase font-mono">Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-charcoal-700 hover:bg-stone-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 hidden sm:inline" />
              <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
                Platform Control
              </span>
              <span className="text-stone-300">/</span>
              <span className="text-xs font-bold text-charcoal-900">
                {navItems.find((n) =>
                  n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
                )?.label || "Super Admin"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingRequestsCount > 0 && (
              <Link
                href="/admin/subscriptions"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{pendingRequestsCount} Pending Upgrade</span>
              </Link>
            )}

            {/* Admin Notifications Bell & Flyout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAdminNotifsOpen(!adminNotifsOpen)}
                className="p-2 rounded-xl text-charcoal-600 hover:text-charcoal-950 hover:bg-stone-100 transition relative"
                aria-label="Admin Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAdminCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadAdminCount}
                  </span>
                )}
              </button>

              {adminNotifsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-charcoal-950 uppercase tracking-wider">
                        Platform Alerts
                      </span>
                      {unreadAdminCount > 0 && (
                        <span className="text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                          {unreadAdminCount} unread
                        </span>
                      )}
                    </div>
                    {unreadAdminCount > 0 && (
                      <button
                        onClick={markAdminNotifsRead}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 transition"
                      >
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                    {adminNotifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400">
                        <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        No admin notifications.
                      </div>
                    ) : (
                      adminNotifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.link || "/admin"}
                          onClick={() => setAdminNotifsOpen(false)}
                          className={`block p-3.5 hover:bg-stone-50 transition text-xs ${
                            !notif.is_read ? "bg-purple-50/20" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-charcoal-900 mb-0.5">
                            <span className="line-clamp-1">{notif.title}</span>
                            <span className="text-[10px] font-mono text-stone-400 font-normal">
                              {new Date(notif.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-charcoal-600 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-xs font-semibold text-charcoal-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              Admin: <strong className="text-charcoal-900">{adminEmail.split("@")[0]}</strong>
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

