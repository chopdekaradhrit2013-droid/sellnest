"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Store, UserProfile } from "./types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSellerStore, getStoreSubscription } from "./dashboardService";
import { StoreSubscription, PlanConfig, getPlanConfig, PLANS } from "@/lib/plans";

export interface DashboardNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
  link?: string;
  created_at?: string;
}

interface DashboardContextType {
  store: Store | null;
  user: UserProfile | null;
  subscription: StoreSubscription | null;
  plan: PlanConfig;
  loading: boolean;
  refreshStore: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: DashboardNotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => Promise<void>;
  markSingleNotificationAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<StoreSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<DashboardNotificationItem[]>([
    {
      id: "n-1",
      title: "Storefront Live",
      message: "Your SellNest store link is active and ready to receive customer orders.",
      time: "Just now",
      read: false,
      link: "/dashboard/store",
    },
    {
      id: "n-2",
      title: "Direct Customer Orders",
      message: "Connected to WhatsApp & database checkout. Orders appear here in real-time.",
      time: "2h ago",
      read: false,
      link: "/dashboard/orders",
    },
  ]);

  const fetchLiveNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?recipientType=seller");
      if (res.ok) {
        const json = await res.json();
        if (json.notifications && Array.isArray(json.notifications)) {
          const mapped: DashboardNotificationItem[] = json.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: formatRelativeTime(n.created_at),
            read: Boolean(n.is_read),
            type: n.type,
            link: n.link || "/dashboard/orders",
            created_at: n.created_at,
          }));
          setNotifications(mapped);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 12000);
    return () => clearInterval(interval);
  }, []);

  // Real-time order listener
  useEffect(() => {
    if (!store?.id) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const channel = supabase
        .channel(`store_orders_${store.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "orders",
            filter: `store_id=eq.${store.id}`,
          },
          (payload: any) => {
            const newOrder = payload.new as any;
            setNotifications((prev) => [
              {
                id: `n-order-${newOrder.id}-${Date.now()}`,
                title: "🎉 New Order Received!",
                message: `Order #${newOrder.order_code || newOrder.order_number} from ${
                  newOrder.customer_name
                } (₹${newOrder.total_amount}).`,
                time: "Just now",
                read: false,
              },
              ...prev,
            ]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Local storage listener for multi-tab testing
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "sellnest_local_orders" && e.newValue) {
          try {
            const orders = JSON.parse(e.newValue);
            if (orders && orders.length > 0) {
              const latest = orders[0];
              setNotifications((prev) => [
                {
                  id: `n-local-${latest.id}-${Date.now()}`,
                  title: "🎉 New Customer Order!",
                  message: `Order #${latest.order_code || latest.order_number} from ${
                    latest.customer_name
                  } (₹${latest.total_amount}).`,
                  time: "Just now",
                  read: false,
                },
                ...prev,
              ]);
            }
          } catch {}
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [store?.id]);

  const fetchStoreAndUser = async () => {
    try {
      if (!isSupabaseConfigured()) {
        const dummyUser: UserProfile = {
          id: "seller-local-1",
          full_name: "Artisan Seller",
          username: "thebutterroom",
          email: "maker@thebutterroom.in",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(dummyUser);
        const s = await getSellerStore(dummyUser.id, dummyUser);
        setStore(s);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      const profileObj: UserProfile = {
        id: authUser.id,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || "Artisan Seller",
        username: profile?.username || authUser.user_metadata?.username || "mystore",
        email: authUser.email || "",
        avatar_url: profile?.avatar_url,
        created_at: authUser.created_at,
        updated_at: profile?.updated_at || authUser.created_at,
      };

      setUser(profileObj);

      // Fetch store
      const userStore = await getSellerStore(authUser.id, profileObj);
      setStore(userStore);

      // Fetch subscription
      if (userStore?.id) {
        const sub = await getStoreSubscription(userStore.id, authUser.id);
        setSubscription(sub);
      }
    } catch (err) {
      console.error("Dashboard context load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionOnly = async () => {
    if (store?.id) {
      const sub = await getStoreSubscription(store.id, user?.id || "seller-1");
      setSubscription(sub);
    }
  };

  useEffect(() => {
    fetchStoreAndUser();
  }, []);

  // Also fetch subscription if store loads in local fallback
  useEffect(() => {
    if (store?.id && !subscription) {
      fetchSubscriptionOnly();
    }
  }, [store?.id]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const markNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", recipientType: "seller" }),
      });
    } catch {}
  };

  const markSingleNotificationAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationId: id }),
      });
    } catch {}
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const activePlanConfig = getPlanConfig(subscription?.plan_id || store?.plan_id || "free");

  return (
    <DashboardContext.Provider
      value={{
        store,
        user,
        subscription,
        plan: activePlanConfig,
        loading,
        refreshStore: fetchStoreAndUser,
        refreshSubscription: fetchSubscriptionOnly,
        isSidebarCollapsed,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        markSingleNotificationAsRead,
        refreshNotifications: fetchLiveNotifications,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

