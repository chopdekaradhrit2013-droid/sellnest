import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  AdminAuditLog,
  SellerAdminView,
  StoreAdminView,
  PlatformSettings,
  AdminOverviewStats,
} from "./types";
import {
  getStoreProducts,
  getStoreOrders,
  getAllUpgradeRequests,
  getBillingInvoices,
  getStoreSubscription,
  changeStorePlan,
} from "./dashboardService";
import { PAYMENT_CONFIG } from "./paymentConfig";
import { PLANS, PlanId, getPlanConfig } from "./plans";

// LocalStorage & Cache keys for admin data in fallback mode
const STORAGE_ADMIN_SELLERS = "sellnest_admin_sellers";
const STORAGE_ADMIN_STORES = "sellnest_admin_stores";
const STORAGE_ADMIN_AUDIT_LOGS = "sellnest_admin_audit_logs";
const STORAGE_ADMIN_SETTINGS = "sellnest_admin_settings";

const serverCache: Record<string, any> = {};

function getAdminData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    if (serverCache[key] !== undefined) return serverCache[key];
    return defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function setAdminData<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    serverCache[key] = value;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Initial Sample Sellers
const SAMPLE_SELLERS: SellerAdminView[] = [
  {
    id: "seller-1",
    full_name: "Artisan Seller",
    username: "thebutterroom",
    email: "maker@thebutterroom.in",
    is_admin: false,
    is_suspended: false,
    stores_count: 1,
    products_count: 4,
    orders_count: 2,
    total_revenue: 2050,
    subscription_plan: "pro",
    subscription_status: "active",
    store: {
      id: "demo-store-1",
      name: "The Butter Room",
      slug: "thebutterroom",
      is_published: true,
      is_suspended: false,
    },
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seller-2",
    full_name: "Ananya Sharma",
    username: "ananyajewels",
    email: "ananya@studioloom.in",
    is_admin: false,
    is_suspended: false,
    stores_count: 1,
    products_count: 18,
    orders_count: 14,
    total_revenue: 8920,
    subscription_plan: "starter",
    subscription_status: "active",
    store: {
      id: "store-2",
      name: "Studio Loom Jewellery",
      slug: "studioloom",
      is_published: true,
      is_suspended: false,
    },
    created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seller-3",
    full_name: "Kavita Rao",
    username: "earthandclay",
    email: "kavita@earthandclay.in",
    is_admin: false,
    is_suspended: false,
    stores_count: 1,
    products_count: 6,
    orders_count: 5,
    total_revenue: 3400,
    subscription_plan: "free",
    subscription_status: "active",
    store: {
      id: "store-3",
      name: "Earth & Clay Ceramics",
      slug: "earthandclay",
      is_published: true,
      is_suspended: false,
    },
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seller-4",
    full_name: "Rohan Mehta",
    username: "vintageroast",
    email: "rohan@vintageroast.in",
    is_admin: false,
    is_suspended: false,
    stores_count: 1,
    products_count: 12,
    orders_count: 9,
    total_revenue: 5150,
    subscription_plan: "starter",
    subscription_status: "active",
    store: {
      id: "store-4",
      name: "Vintage Roast Coffee",
      slug: "vintageroast",
      is_published: true,
      is_suspended: false,
    },
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seller-5",
    full_name: "Zoya Khan",
    username: "bloomandpetal",
    email: "zoya@bloompetal.in",
    is_admin: false,
    is_suspended: false,
    stores_count: 1,
    products_count: 8,
    orders_count: 3,
    total_revenue: 1200,
    subscription_plan: "free",
    subscription_status: "active",
    store: {
      id: "store-5",
      name: "Bloom & Petal Florals",
      slug: "bloomandpetal",
      is_published: true,
      is_suspended: false,
    },
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial Sample Stores
const SAMPLE_STORES: StoreAdminView[] = [
  {
    id: "demo-store-1",
    seller_id: "seller-1",
    seller_name: "Artisan Seller",
    seller_email: "maker@thebutterroom.in",
    name: "The Butter Room",
    slug: "thebutterroom",
    description: "Artisanal slow-fermented breads, cruffins & burnt Basque cheesecakes.",
    theme: "modern",
    is_published: true,
    is_suspended: false,
    products_count: 4,
    orders_count: 2,
    total_revenue: 2050,
    plan_id: "pro",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "store-2",
    seller_id: "seller-2",
    seller_name: "Ananya Sharma",
    seller_email: "ananya@studioloom.in",
    name: "Studio Loom Jewellery",
    slug: "studioloom",
    description: "Handcrafted 925 sterling silver earrings and raw gemstone pendants.",
    theme: "boutique",
    is_published: true,
    is_suspended: false,
    products_count: 18,
    orders_count: 14,
    total_revenue: 8920,
    plan_id: "starter",
    created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "store-3",
    seller_id: "seller-3",
    seller_name: "Kavita Rao",
    seller_email: "kavita@earthandclay.in",
    name: "Earth & Clay Ceramics",
    slug: "earthandclay",
    description: "Wheel-thrown rustic stoneware mugs, planters, and serving platters.",
    theme: "minimal",
    is_published: true,
    is_suspended: false,
    products_count: 6,
    orders_count: 5,
    total_revenue: 3400,
    plan_id: "free",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "store-4",
    seller_id: "seller-4",
    seller_name: "Rohan Mehta",
    seller_email: "rohan@vintageroast.in",
    name: "Vintage Roast Coffee",
    slug: "vintageroast",
    description: "Single-origin Arabica beans roasted in small batches from Chikmagalur.",
    theme: "modern",
    is_published: true,
    is_suspended: false,
    products_count: 12,
    orders_count: 9,
    total_revenue: 5150,
    plan_id: "starter",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "store-5",
    seller_id: "seller-5",
    seller_name: "Zoya Khan",
    seller_email: "zoya@bloompetal.in",
    name: "Bloom & Petal Florals",
    slug: "bloomandpetal",
    description: "Fresh daily bouquets and preserved floral arrangements in Mumbai.",
    theme: "playful",
    is_published: true,
    is_suspended: false,
    products_count: 8,
    orders_count: 3,
    total_revenue: 1200,
    plan_id: "free",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "log-1",
    admin_email: PAYMENT_CONFIG.supportEmail,
    admin_id: "super-admin",
    action: "platform.initialized",
    target_type: "settings",
    target_id: "system",
    target_name: "SellNest Production Engine",
    reason: "Platform initialized with manual payment verification and Supabase RLS.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial Platform Settings
const INITIAL_SETTINGS: PlatformSettings = {
  id: "default",
  platform_name: "SellNest",
  support_email: PAYMENT_CONFIG.supportEmail,
  processing_promise_hours: 24,
  maintenance_mode: false,
  plan_pricing: {
    free: 0,
    starter: 99,
    pro: 199,
  },
  plan_limits: {
    free: 10,
    starter: 100,
    pro: null,
  },
  payment_instructions: [
    "Open your preferred UPI app (Google Pay, PhonePe, Paytm, BHIM) or Net Banking portal.",
    "Transfer the exact plan amount to the official SellNest account details provided.",
    "Copy or screenshot the 12-digit UTR (Unique Transaction Reference) / Bank Reference Number.",
    "Submit your transaction reference number and payment date in the verification form.",
    "Our admin team will verify your transaction against bank records and activate your plan within 24 hours.",
  ],
  updated_at: new Date().toISOString(),
  updated_by: PAYMENT_CONFIG.supportEmail,
};

// ==============================================================================
// 1. OVERVIEW METRICS
// ==============================================================================

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const sellers = await getAllSellers();
  const stores = await getAllStores();
  const upgradeRequests = await getAllUpgradeRequests("all");

  const totalSellers = sellers.length;
  const totalActiveStores = stores.filter((s) => s.is_published && !s.is_suspended).length;

  const totalProducts = stores.reduce((sum, s) => sum + (s.products_count || 0), 0);
  const totalOrders = stores.reduce((sum, s) => sum + (s.orders_count || 0), 0);

  // Revenue strictly from verified approved requests / paid invoices
  const verifiedRevenueFromRequests = upgradeRequests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  // Starter & Pro subscribers count
  const activeStarterSubscribers = sellers.filter(
    (s) => s.subscription_plan === "starter" && s.subscription_status === "active"
  ).length;

  const activeProSubscribers = sellers.filter(
    (s) => s.subscription_plan === "pro" && s.subscription_status === "active"
  ).length;

  const freeSubscribers = sellers.filter((s) => s.subscription_plan === "free").length;

  const pendingUpgradeRequests = upgradeRequests.filter((r) => r.status === "pending").length;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newRegistrations30d = sellers.filter(
    (s) => new Date(s.created_at).getTime() >= thirtyDaysAgo
  ).length;

  const paidSubscribers = activeStarterSubscribers + activeProSubscribers;
  const conversionRate = totalSellers > 0 ? (paidSubscribers / totalSellers) * 100 : 0;

  // Base subscription revenue computed from active paid plans (₹99 for starter, ₹199 for pro)
  const totalVerifiedRevenue =
    activeStarterSubscribers * 99 + activeProSubscribers * 199 + verifiedRevenueFromRequests;

  return {
    totalSellers,
    totalActiveStores,
    totalProducts,
    totalOrders,
    totalVerifiedRevenue,
    pendingUpgradeRequests,
    newRegistrations30d,
    activeStarterSubscribers,
    activeProSubscribers,
    freeSubscribers,
    conversionRate: Number(conversionRate.toFixed(1)),
  };
}

// ==============================================================================
// 2. SELLER MANAGEMENT
// ==============================================================================

export async function getAllSellers(filters?: {
  search?: string;
  plan?: string;
  status?: string;
}): Promise<SellerAdminView[]> {
  let sellers: SellerAdminView[] = [];

  if (!isSupabaseConfigured()) {
    sellers = getAdminData<SellerAdminView[]>(STORAGE_ADMIN_SELLERS, SAMPLE_SELLERS);
  } else {
    try {
      const supabase = createClient();
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          username,
          email,
          avatar_url,
          is_admin,
          is_suspended,
          suspended_reason,
          suspended_at,
          created_at,
          stores:stores(
            id,
            name,
            slug,
            is_published,
            is_suspended
          )
        `)
        .order("created_at", { ascending: false });

      if (error || !profiles || profiles.length === 0) {
        sellers = getAdminData<SellerAdminView[]>(STORAGE_ADMIN_SELLERS, SAMPLE_SELLERS);
      } else {
        // Map profiles with store details and subscriptions
        sellers = await Promise.all(
          profiles.map(async (p: any) => {
            const userStore = p.stores?.[0] || null;
            let subPlan: PlanId = "free";
            let subStatus = "active";
            let productsCount = 0;
            let ordersCount = 0;
            let totalRevenue = 0;

            if (userStore?.id) {
              const sub = await getStoreSubscription(userStore.id, p.id);
              subPlan = sub.plan_id;
              subStatus = sub.status;
              const prods = await getStoreProducts(userStore.id);
              productsCount = prods.length;
              const ords = await getStoreOrders(userStore.id);
              ordersCount = ords.length;
              totalRevenue = ords
                .filter((o) => o.status !== "cancelled")
                .reduce((acc, o) => acc + Number(o.total_amount), 0);
            }

            return {
              id: p.id,
              full_name: p.full_name || "Seller",
              username: p.username || "user",
              email: p.email || "",
              avatar_url: p.avatar_url,
              is_admin: Boolean(p.is_admin),
              is_suspended: Boolean(p.is_suspended),
              suspended_reason: p.suspended_reason,
              suspended_at: p.suspended_at,
              stores_count: p.stores?.length || 0,
              products_count: productsCount,
              orders_count: ordersCount,
              total_revenue: totalRevenue,
              subscription_plan: subPlan,
              subscription_status: subStatus,
              store: userStore,
              created_at: p.created_at,
            };
          })
        );
      }
    } catch {
      sellers = getAdminData<SellerAdminView[]>(STORAGE_ADMIN_SELLERS, SAMPLE_SELLERS);
    }
  }

  // Apply filters
  if (!filters) return sellers;

  return sellers.filter((s) => {
    const q = (filters.search || "").toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.store?.name && s.store.name.toLowerCase().includes(q));

    const matchesPlan =
      !filters.plan || filters.plan === "all" || s.subscription_plan === filters.plan;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      (filters.status === "active" && !s.is_suspended) ||
      (filters.status === "suspended" && s.is_suspended);

    return matchesSearch && matchesPlan && matchesStatus;
  });
}

export async function suspendSeller(
  sellerId: string,
  reason: string,
  adminEmail: string
): Promise<{ success: boolean; error: string | null }> {
  if (!reason.trim()) {
    return { success: false, error: "A suspension reason is strictly required." };
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const sellers = getAdminData<SellerAdminView[]>(STORAGE_ADMIN_SELLERS, SAMPLE_SELLERS);
    const idx = sellers.findIndex((s) => s.id === sellerId);
    if (idx === -1) return { success: false, error: "Seller not found." };

    sellers[idx].is_suspended = true;
    sellers[idx].suspended_reason = reason.trim();
    sellers[idx].suspended_at = now;
    if (sellers[idx].store) {
      sellers[idx].store!.is_suspended = true;
    }
    setAdminData(STORAGE_ADMIN_SELLERS, sellers);

    // Also update stores table
    const stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
    stores.forEach((st) => {
      if (st.seller_id === sellerId) {
        st.is_suspended = true;
        st.suspension_reason = reason.trim();
      }
    });
    setAdminData(STORAGE_ADMIN_STORES, stores);

    await logAdminAction({
      admin_email: adminEmail,
      action: "seller.suspend",
      target_type: "seller",
      target_id: sellerId,
      target_name: sellers[idx].full_name,
      reason: reason.trim(),
    });

    return { success: true, error: null };
  }

  try {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        is_suspended: true,
        suspended_reason: reason.trim(),
        suspended_at: now,
      })
      .eq("id", sellerId);

    // Suspend their stores
    await supabase
      .from("stores")
      .update({
        is_suspended: true,
        suspension_reason: reason.trim(),
      })
      .eq("seller_id", sellerId);

    await logAdminAction({
      admin_email: adminEmail,
      action: "seller.suspend",
      target_type: "seller",
      target_id: sellerId,
      reason: reason.trim(),
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to suspend seller." };
  }
}

export async function reactivateSeller(
  sellerId: string,
  adminEmail: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    const sellers = getAdminData<SellerAdminView[]>(STORAGE_ADMIN_SELLERS, SAMPLE_SELLERS);
    const idx = sellers.findIndex((s) => s.id === sellerId);
    if (idx === -1) return { success: false, error: "Seller not found." };

    sellers[idx].is_suspended = false;
    sellers[idx].suspended_reason = undefined;
    sellers[idx].suspended_at = undefined;
    if (sellers[idx].store) {
      sellers[idx].store!.is_suspended = false;
    }
    setAdminData(STORAGE_ADMIN_SELLERS, sellers);

    const stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
    stores.forEach((st) => {
      if (st.seller_id === sellerId) {
        st.is_suspended = false;
        st.suspension_reason = undefined;
      }
    });
    setAdminData(STORAGE_ADMIN_STORES, stores);

    await logAdminAction({
      admin_email: adminEmail,
      action: "seller.reactivate",
      target_type: "seller",
      target_id: sellerId,
      target_name: sellers[idx].full_name,
      reason: "Account reactivated by administrator.",
    });

    return { success: true, error: null };
  }

  try {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        is_suspended: false,
        suspended_reason: null,
        suspended_at: null,
      })
      .eq("id", sellerId);

    await supabase
      .from("stores")
      .update({
        is_suspended: false,
        suspension_reason: null,
      })
      .eq("seller_id", sellerId);

    await logAdminAction({
      admin_email: adminEmail,
      action: "seller.reactivate",
      target_type: "seller",
      target_id: sellerId,
      reason: "Account reactivated by administrator.",
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reactivate seller." };
  }
}

// ==============================================================================
// 3. STORE MANAGEMENT
// ==============================================================================

export async function getAllStores(filters?: {
  search?: string;
  status?: string;
}): Promise<StoreAdminView[]> {
  let stores: StoreAdminView[] = [];

  if (!isSupabaseConfigured()) {
    stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
  } else {
    try {
      const supabase = createClient();
      const { data: dbStores, error } = await supabase
        .from("stores")
        .select(`
          *,
          seller:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error || !dbStores || dbStores.length === 0) {
        stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
      } else {
        stores = await Promise.all(
          dbStores.map(async (st: any) => {
            const prods = await getStoreProducts(st.id);
            const ords = await getStoreOrders(st.id);
            const sub = await getStoreSubscription(st.id, st.seller_id);
            const totalRev = ords
              .filter((o) => o.status !== "cancelled")
              .reduce((acc, o) => acc + Number(o.total_amount), 0);

            return {
              id: st.id,
              seller_id: st.seller_id,
              seller_name: st.seller?.full_name || "Artisan Seller",
              seller_email: st.seller?.email || st.email || "",
              name: st.name,
              slug: st.slug,
              description: st.description,
              theme: st.theme || "modern",
              is_published: Boolean(st.is_published),
              is_suspended: Boolean(st.is_suspended),
              suspension_reason: st.suspension_reason,
              moderation_note: st.moderation_note,
              products_count: prods.length,
              orders_count: ords.length,
              total_revenue: totalRev,
              plan_id: sub.plan_id,
              created_at: st.created_at,
              updated_at: st.updated_at,
            };
          })
        );
      }
    } catch {
      stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
    }
  }

  if (!filters) return stores;

  return stores.filter((st) => {
    const q = (filters.search || "").toLowerCase().trim();
    const matchesSearch =
      !q ||
      st.name.toLowerCase().includes(q) ||
      st.slug.toLowerCase().includes(q) ||
      st.seller_name.toLowerCase().includes(q) ||
      st.seller_email.toLowerCase().includes(q);

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      (filters.status === "published" && st.is_published && !st.is_suspended) ||
      (filters.status === "unpublished" && !st.is_published) ||
      (filters.status === "suspended" && st.is_suspended);

    return matchesSearch && matchesStatus;
  });
}

export async function unpublishStore(
  storeId: string,
  reason: string,
  adminEmail: string
): Promise<{ success: boolean; error: string | null }> {
  if (!reason.trim()) {
    return { success: false, error: "A moderation reason is required to unpublish a store." };
  }

  if (!isSupabaseConfigured()) {
    const stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
    const idx = stores.findIndex((s) => s.id === storeId);
    if (idx === -1) return { success: false, error: "Store not found." };

    stores[idx].is_published = false;
    stores[idx].moderation_note = reason.trim();
    setAdminData(STORAGE_ADMIN_STORES, stores);

    await logAdminAction({
      admin_email: adminEmail,
      action: "store.unpublish",
      target_type: "store",
      target_id: storeId,
      target_name: stores[idx].name,
      reason: reason.trim(),
    });

    return { success: true, error: null };
  }

  try {
    const supabase = createClient();
    await supabase
      .from("stores")
      .update({
        is_published: false,
        moderation_note: reason.trim(),
      })
      .eq("id", storeId);

    await logAdminAction({
      admin_email: adminEmail,
      action: "store.unpublish",
      target_type: "store",
      target_id: storeId,
      reason: reason.trim(),
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to unpublish store." };
  }
}

export async function restoreStore(
  storeId: string,
  adminEmail: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    const stores = getAdminData<StoreAdminView[]>(STORAGE_ADMIN_STORES, SAMPLE_STORES);
    const idx = stores.findIndex((s) => s.id === storeId);
    if (idx === -1) return { success: false, error: "Store not found." };

    stores[idx].is_published = true;
    stores[idx].is_suspended = false;
    stores[idx].moderation_note = undefined;
    stores[idx].suspension_reason = undefined;
    setAdminData(STORAGE_ADMIN_STORES, stores);

    await logAdminAction({
      admin_email: adminEmail,
      action: "store.restore",
      target_type: "store",
      target_id: storeId,
      target_name: stores[idx].name,
      reason: "Store restored by administrator after review.",
    });

    return { success: true, error: null };
  }

  try {
    const supabase = createClient();
    await supabase
      .from("stores")
      .update({
        is_published: true,
        is_suspended: false,
        moderation_note: null,
        suspension_reason: null,
      })
      .eq("id", storeId);

    await logAdminAction({
      admin_email: adminEmail,
      action: "store.restore",
      target_type: "store",
      target_id: storeId,
      reason: "Store restored by administrator after review.",
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to restore store." };
  }
}

// ==============================================================================
// 4. PLATFORM ANALYTICS
// ==============================================================================

export async function getPlatformAnalytics(timeRange: "7d" | "30d" | "all" = "7d") {
  const sellers = await getAllSellers();
  const stores = await getAllStores();
  const upgradeRequests = await getAllUpgradeRequests("all");

  const approvedRequests = upgradeRequests.filter((r) => r.status === "approved");

  // Plan distribution counts
  const planDistribution = {
    free: sellers.filter((s) => s.subscription_plan === "free").length,
    starter: sellers.filter((s) => s.subscription_plan === "starter").length,
    pro: sellers.filter((s) => s.subscription_plan === "pro").length,
  };

  const totalSellers = sellers.length;
  const paidSellers = planDistribution.starter + planDistribution.pro;
  const conversionRate = totalSellers > 0 ? (paidSellers / totalSellers) * 100 : 0;

  // Chart data points
  const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 12;
  const chartData: Array<{ label: string; sellers: number; stores: number; revenue: number }> = [];

  const now = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    // Count registrations on that day
    const daySellers = sellers.filter((s) => s.created_at.startsWith(dateStr)).length;
    const dayStores = stores.filter((s) => s.created_at.startsWith(dateStr)).length;

    // Revenue only from verified approved requests on that date
    const dayRevenue = approvedRequests
      .filter((r) => (r.activated_at || r.created_at).startsWith(dateStr))
      .reduce((sum, r) => sum + Number(r.amount), 0);

    chartData.push({
      label,
      sellers: daySellers,
      stores: dayStores,
      revenue: dayRevenue,
    });
  }

  // Monthly revenue breakdown
  const monthlyRevenue = approvedRequests.reduce((sum, r) => sum + Number(r.amount), 0) +
    (planDistribution.starter * 99) + (planDistribution.pro * 199);

  return {
    planDistribution,
    conversionRate: Number(conversionRate.toFixed(1)),
    totalVerifiedRevenue: monthlyRevenue,
    chartData,
    summary: {
      totalSellers,
      totalStores: stores.length,
      paidSellers,
      pendingRequests: upgradeRequests.filter((r) => r.status === "pending").length,
    },
  };
}

// ==============================================================================
// 5. AUDIT LOGGING
// ==============================================================================

export async function logAdminAction(input: {
  admin_email: string;
  admin_id?: string;
  action: string;
  target_type: "seller" | "store" | "upgrade_request" | "subscription" | "settings";
  target_id: string;
  target_name?: string;
  reason?: string;
  metadata?: Record<string, any>;
}): Promise<AdminAuditLog> {
  const newLog: AdminAuditLog = {
    id: "audit-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    admin_email: input.admin_email,
    admin_id: input.admin_id || "admin",
    action: input.action,
    target_type: input.target_type,
    target_id: input.target_id,
    target_name: input.target_name,
    reason: input.reason,
    metadata: input.metadata || {},
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    const logs = getAdminData<AdminAuditLog[]>(STORAGE_ADMIN_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    logs.unshift(newLog);
    setAdminData(STORAGE_ADMIN_AUDIT_LOGS, logs);
    return newLog;
  }

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("admin_audit_logs")
      .insert({
        admin_email: newLog.admin_email,
        admin_id: newLog.admin_id,
        action: newLog.action,
        target_type: newLog.target_type,
        target_id: newLog.target_id,
        target_name: newLog.target_name,
        reason: newLog.reason,
        metadata: newLog.metadata,
      })
      .select()
      .single();

    return (data || newLog) as AdminAuditLog;
  } catch {
    const logs = getAdminData<AdminAuditLog[]>(STORAGE_ADMIN_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    logs.unshift(newLog);
    setAdminData(STORAGE_ADMIN_AUDIT_LOGS, logs);
    return newLog;
  }
}

export async function getAdminAuditLogs(limit = 100): Promise<AdminAuditLog[]> {
  if (!isSupabaseConfigured()) {
    const logs = getAdminData<AdminAuditLog[]>(STORAGE_ADMIN_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return logs.slice(0, limit);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      const logs = getAdminData<AdminAuditLog[]>(STORAGE_ADMIN_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
      return logs.slice(0, limit);
    }

    return data as AdminAuditLog[];
  } catch {
    const logs = getAdminData<AdminAuditLog[]>(STORAGE_ADMIN_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return logs.slice(0, limit);
  }
}

// ==============================================================================
// 6. PLATFORM SETTINGS
// ==============================================================================

export async function getPlatformSettings(): Promise<PlatformSettings> {
  if (!isSupabaseConfigured()) {
    return getAdminData<PlatformSettings>(STORAGE_ADMIN_SETTINGS, INITIAL_SETTINGS);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return getAdminData<PlatformSettings>(STORAGE_ADMIN_SETTINGS, INITIAL_SETTINGS);
    }
    return data as PlatformSettings;
  } catch {
    return getAdminData<PlatformSettings>(STORAGE_ADMIN_SETTINGS, INITIAL_SETTINGS);
  }
}

export async function updatePlatformSettings(
  updates: Partial<PlatformSettings>,
  adminEmail: string
): Promise<{ success: boolean; settings: PlatformSettings | null; error: string | null }> {
  const current = await getPlatformSettings();
  const updated: PlatformSettings = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: adminEmail,
  };

  if (!isSupabaseConfigured()) {
    setAdminData(STORAGE_ADMIN_SETTINGS, updated);

    await logAdminAction({
      admin_email: adminEmail,
      action: "settings.update",
      target_type: "settings",
      target_id: "default",
      target_name: "Platform Configuration",
      reason: "Platform settings updated by administrator.",
      metadata: updates,
    });

    return { success: true, settings: updated, error: null };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("platform_settings")
      .upsert(
        {
          id: "default",
          platform_name: updated.platform_name,
          support_email: updated.support_email,
          processing_promise_hours: updated.processing_promise_hours,
          maintenance_mode: updated.maintenance_mode,
          plan_pricing: updated.plan_pricing,
          plan_limits: updated.plan_limits,
          payment_instructions: updated.payment_instructions,
          updated_at: updated.updated_at,
          updated_by: adminEmail,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      return { success: false, settings: null, error: error.message };
    }

    await logAdminAction({
      admin_email: adminEmail,
      action: "settings.update",
      target_type: "settings",
      target_id: "default",
      target_name: "Platform Configuration",
      reason: "Platform settings updated by administrator.",
      metadata: updates,
    });

    return { success: true, settings: data as PlatformSettings, error: null };
  } catch (err: any) {
    return { success: false, settings: null, error: err.message || "Failed to update settings." };
  }
}

