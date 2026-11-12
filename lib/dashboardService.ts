import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Store, Product, Order, OrderItem, Customer, DashboardStats } from "./types";
import {
  PlanId,
  StoreSubscription,
  BillingInvoice,
  SubscriptionUpgradeRequest,
  PLANS,
  getPlanConfig,
  canAddProduct,
} from "./plans";
import { notifyUpgradeReviewed, notifyOrderStatusChanged, notifyNewOrder } from "./notificationService";

// LocalStorage keys for fallback mode
const STORAGE_STORE = "sellnest_local_store";
const STORAGE_PRODUCTS = "sellnest_local_products";
const STORAGE_ORDERS = "sellnest_local_orders";
const STORAGE_CUSTOMERS = "sellnest_local_customers";
const STORAGE_SUBSCRIPTION = "sellnest_local_subscription";
const STORAGE_INVOICES = "sellnest_local_invoices";
const STORAGE_UPGRADE_REQUESTS = "sellnest_local_upgrade_requests";

// In-memory store for server-side route handler executions when Supabase is in fallback mode
const serverDataCache: Record<string, any> = {};

export function isUuid(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export const STARTER_SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    store_id: "demo-store-1",
    name: "Wild Yeast Country Sourdough",
    description: "36-hour slow fermented wholewheat sourdough batard with a blistered crust and open crumb. Made with 100% stoneground flour, pure mineral water and sea salt.",
    price: 320,
    category: "Artisan Breads",
    stock_quantity: 12,
    is_active: true,
    is_eggless: true,
    image_url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    store_id: "demo-store-1",
    name: "Pistachio & Rose Cruffin",
    description: "Laminated flaky viennoiserie pastry filled with roasted pistachio praline and rosewater curd, dusted with freeze-dried raspberry powder.",
    price: 240,
    category: "Viennoiserie",
    stock_quantity: 18,
    is_active: true,
    is_eggless: false,
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    store_id: "demo-store-1",
    name: "Classic Burnt Basque Cheesecake (650g)",
    description: "Caramelized mahogany crust with an ultra-creamy, molten vanilla bean center. Handcrafted with Philadelphia cream cheese and Madagascar Bourbon vanilla.",
    price: 1250,
    category: "Celebration Cakes",
    stock_quantity: 6,
    is_active: true,
    is_eggless: false,
    image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    store_id: "demo-store-1",
    name: "Brown Butter Pecan Blondies (4 pcs)",
    description: "Chewy, nutty brown-butter squares scented with cardamom and Maldon sea salt flakes. Perfectly dense and rich.",
    price: 380,
    category: "Cookies & Treats",
    stock_quantity: 14,
    is_active: true,
    is_eggless: true,
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    if (serverDataCache[key] !== undefined) {
      return serverDataCache[key];
    }
    if (key === STORAGE_PRODUCTS) {
      serverDataCache[key] = [...STARTER_SAMPLE_PRODUCTS];
      return serverDataCache[key];
    }
    return defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    if (key === STORAGE_PRODUCTS) {
      localStorage.setItem(key, JSON.stringify(STARTER_SAMPLE_PRODUCTS));
      return STARTER_SAMPLE_PRODUCTS as any;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    serverDataCache[key] = value;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("LocalStorage write error:", err);
  }
}

// ==============================================================================
// 1. STORE OPERATIONS
// ==============================================================================

export async function getSellerStore(sellerId: string, userMetadata?: any): Promise<Store | null> {
  if (!isSupabaseConfigured()) {
    let localStore = getLocalData<Store | null>(STORAGE_STORE, null);
    if (!localStore) {
      localStore = {
        id: "demo-store-1",
        seller_id: sellerId,
        name: userMetadata?.full_name || "The Butter Room",
        slug: userMetadata?.username || "thebutterroom",
        description: "Small-batch artisanal sourdough, viennoiserie & celebration bakes in Bengaluru.",
        logo_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
        banner_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        email: userMetadata?.email || "maker@thebutterroom.in",
        phone: "+91 98765 43210",
        whatsapp_number: "+91 98765 43210",
        theme: "lavender",
        accent_color: "#7C3AED",
        currency: "INR",
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalData(STORAGE_STORE, localStore);
    }
    return localStore;
  }

  const supabase = createClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sellerId);
  
  let store: any = null;
  if (isUuid) {
    const { data } = await supabase
      .from("stores")
      .select("*")
      .or(`seller_id.eq.${sellerId},id.eq.${sellerId}`)
      .maybeSingle();
    store = data;
  } else {
    const { data } = await supabase
      .from("stores")
      .select("*")
      .ilike("slug", sellerId)
      .maybeSingle();
    store = data;
  }

  if (store) {
    return store as Store;
  }

  if (userMetadata?.username) {
    // Auto-create default store if not exists
    const newStore: Partial<Store> = {
      seller_id: sellerId,
      name: userMetadata.full_name || "My Store",
      slug: userMetadata.username.toLowerCase(),
      description: `Welcome to ${userMetadata.full_name || "My Store"} on SellNest.`,
      email: userMetadata.email,
      whatsapp_number: userMetadata.whatsapp_number || "",
      theme: "lavender",
      accent_color: "#7C3AED",
      currency: "INR",
      is_published: true,
    };

    const { data: created, error: createErr } = await supabase
      .from("stores")
      .insert(newStore)
      .select()
      .single();

    if (!createErr && created) {
      return created as Store;
    }
  }

  // Graceful fallback for demo or test store
  if (sellerId === "seller-1" || sellerId === "demo-store-1" || !store) {
    let localStore = getLocalData<Store | null>(STORAGE_STORE, null);
    if (!localStore) {
      localStore = {
        id: "demo-store-1",
        seller_id: "seller-1",
        name: "The Butter Room",
        slug: "thebutterroom",
        description: "Small-batch artisanal sourdough, viennoiserie & celebration bakes in Bengaluru.",
        logo_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
        banner_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        email: "maker@thebutterroom.in",
        phone: "+91 98765 43210",
        whatsapp_number: "+91 98765 43210",
        theme: "modern",
        accent_color: "#7C3AED",
        secondary_color: "#4F46E5",
        font_family: "sans",
        currency: "INR",
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalData(STORAGE_STORE, localStore);
    }
    return localStore;
  }

  return null;
}

export async function updateStore(storeId: string, updates: Partial<Store>): Promise<{ data: Store | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    const current = getLocalData<Store | null>(STORAGE_STORE, null);
    if (!current) return { data: null, error: "Store not found" };
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocalData(STORAGE_STORE, updated);
    return { data: updated, error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", storeId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Store, error: null };
}

export async function saveStoreDraft(
  storeId: string,
  draft: Partial<Store>
): Promise<{ data: Store | null; error: string | null }> {
  return updateStore(storeId, {
    draft_settings: draft as any,
  });
}

export async function publishStore(
  storeId: string,
  applyDraft?: Partial<Store>
): Promise<{ data: Store | null; error: string | null }> {
  const updates: Partial<Store> = {
    is_published: true,
  };

  if (applyDraft) {
    if (applyDraft.name) updates.name = applyDraft.name;
    if (applyDraft.slug) updates.slug = applyDraft.slug;
    if (applyDraft.description !== undefined) updates.description = applyDraft.description;
    if (applyDraft.logo_url !== undefined) updates.logo_url = applyDraft.logo_url;
    if (applyDraft.banner_url !== undefined) updates.banner_url = applyDraft.banner_url;
    if (applyDraft.theme) updates.theme = applyDraft.theme;
    if (applyDraft.accent_color) updates.accent_color = applyDraft.accent_color;
    if (applyDraft.secondary_color !== undefined) updates.secondary_color = applyDraft.secondary_color;
    if (applyDraft.font_family) updates.font_family = applyDraft.font_family;
    if (applyDraft.announcement !== undefined) updates.announcement = applyDraft.announcement;
    if (applyDraft.whatsapp_number !== undefined) updates.whatsapp_number = applyDraft.whatsapp_number;
    if (applyDraft.social_links !== undefined) updates.social_links = applyDraft.social_links;
  }

  return updateStore(storeId, updates);
}

export async function unpublishStore(
  storeId: string
): Promise<{ data: Store | null; error: string | null }> {
  return updateStore(storeId, {
    is_published: false,
  });
}

export async function getStoreBySlug(
  slug: string,
  previewDraft = false
): Promise<{ store: Store | null; isUnpublished?: boolean }> {
  const cleanSlug = slug.toLowerCase().trim();

  if (!isSupabaseConfigured()) {
    let localStore = getLocalData<Store | null>(STORAGE_STORE, null);
    if (!localStore) {
      localStore = {
        id: "demo-store-1",
        seller_id: "seller-1",
        name: "The Butter Room",
        slug: cleanSlug || "thebutterroom",
        description: "Small-batch artisanal sourdough, viennoiserie & celebration bakes in Bengaluru.",
        logo_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
        banner_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        email: "maker@thebutterroom.in",
        phone: "+91 98765 43210",
        whatsapp_number: "+91 98765 43210",
        theme: "modern",
        accent_color: "#7C3AED",
        secondary_color: "#4F46E5",
        font_family: "sans",
        currency: "INR",
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalData(STORAGE_STORE, localStore);
    }

    if (previewDraft && localStore.draft_settings) {
      return {
        store: {
          ...localStore,
          ...localStore.draft_settings,
        },
      };
    }

    if (!localStore.is_published && !previewDraft) {
      return { store: localStore, isUnpublished: true };
    }

    return { store: localStore };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .ilike("slug", cleanSlug)
    .maybeSingle();

  if (error || !data) {
    if (cleanSlug === "thebutterroom" || !cleanSlug) {
      let localStore = getLocalData<Store | null>(STORAGE_STORE, null);
      if (!localStore) {
        localStore = {
          id: "demo-store-1",
          seller_id: "seller-1",
          name: "The Butter Room",
          slug: "thebutterroom",
          description: "Small-batch artisanal sourdough, viennoiserie & celebration bakes in Bengaluru.",
          logo_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
          banner_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
          email: "maker@thebutterroom.in",
          phone: "+91 98765 43210",
          whatsapp_number: "+91 98765 43210",
          theme: "modern",
          accent_color: "#7C3AED",
          secondary_color: "#4F46E5",
          font_family: "sans",
          currency: "INR",
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setLocalData(STORAGE_STORE, localStore);
      }
      return { store: localStore };
    }
    return { store: null };
  }

  const store = data as Store;

  if (!store.is_published && !previewDraft) {
    return { store, isUnpublished: true };
  }

  if (previewDraft && store.draft_settings) {
    return {
      store: {
        ...store,
        ...store.draft_settings,
      },
    };
  }

  return { store };
}

export async function getProductById(
  productId: string,
  storeId?: string
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const prods = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    const found = prods.find((p) => p.id === productId);
    if (found) return found;
    // Fallback if not found in list, search default starter items
    return null;
  }

  const supabase = createClient();
  let query = supabase.from("products").select("*").eq("id", productId);
  if (storeId) {
    query = query.eq("store_id", storeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    const prods = getLocalData<Product[]>(STORAGE_PRODUCTS, STARTER_SAMPLE_PRODUCTS);
    return prods.find((p) => p.id === productId) || null;
  }
  return data as Product;
}

// ==============================================================================
// 2. PRODUCT CRUD OPERATIONS
// ==============================================================================

export async function getStoreProducts(storeId: string): Promise<Product[]> {
  if (!isSupabaseConfigured() || storeId === "demo-store-1") {
    const local = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    if (local.length > 0) return local;
    return STARTER_SAMPLE_PRODUCTS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (storeId === "demo-store-1") {
      const local = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
      if (local.length > 0) return local;
      return STARTER_SAMPLE_PRODUCTS;
    }
    return [];
  }

  return (data || []) as Product[];
}

export async function createProduct(
  storeId: string,
  productData: Omit<Product, "id" | "store_id" | "created_at" | "updated_at">
): Promise<{ data: Product | null; error: string | null; limitReached?: boolean }> {
  // 1. Backend-enforced Plan Limits Check
  const currentProds = await getStoreProducts(storeId);
  const subscription = await getStoreSubscription(storeId);
  const planCheck = canAddProduct(subscription.plan_id, currentProds.length);

  if (!planCheck.allowed) {
    return {
      data: null,
      error: planCheck.reason || "Product limit reached for your current plan.",
      limitReached: true,
    };
  }

  if (!isSupabaseConfigured()) {
    const products = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      store_id: storeId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.unshift(newProduct);
    setLocalData(STORAGE_PRODUCTS, products);
    return { data: newProduct, error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...productData,
      store_id: storeId,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Product, error: null };
}

// ==============================================================================
// 4. SUBSCRIPTION & BILLING OPERATIONS
// ==============================================================================

export async function getStoreSubscription(
  storeId: string,
  sellerId = "seller-1"
): Promise<StoreSubscription> {
  const defaultFree: StoreSubscription = {
    id: "sub-" + storeId,
    store_id: storeId,
    plan_id: "free",
    status: "active",
    billing_cycle: "monthly",
    started_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !isUuid(storeId)) {
    const existing = getLocalData<StoreSubscription | null>(STORAGE_SUBSCRIPTION, null);
    if (existing && existing.store_id === storeId) {
      return existing;
    }
    setLocalData(STORAGE_SUBSCRIPTION, defaultFree);
    return defaultFree;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("store_id", storeId)
    .maybeSingle();

  if (error || !data) {
    // Auto-assign Free plan if no subscription exists
    try {
      const { data: created } = await supabase
        .from("subscriptions")
        .insert({
          store_id: storeId,
          seller_id: sellerId,
          plan_id: "free",
          status: "active",
        })
        .select()
        .single();

      if (created) return created as StoreSubscription;
    } catch {
      // Fallback
    }
    return defaultFree;
  }

  return data as StoreSubscription;
}

export async function changeStorePlan(
  storeId: string,
  sellerId: string,
  newPlanId: PlanId
): Promise<{ data: StoreSubscription | null; error: string | null }> {
  const plan = getPlanConfig(newPlanId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  if (!isSupabaseConfigured() || !isUuid(storeId)) {
    const updated: StoreSubscription = {
      id: "sub-" + storeId,
      store_id: storeId,
      plan_id: newPlanId,
      status: "active",
      billing_cycle: "monthly",
      started_at: now.toISOString(),
      expires_at: expiresAt,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    setLocalData(STORAGE_SUBSCRIPTION, updated);

    // Also record invoice in demo mode
    const invoices = getLocalData<BillingInvoice[]>(STORAGE_INVOICES, []);
    const newInvoice: BillingInvoice = {
      id: "inv-" + Date.now(),
      subscription_id: updated.id,
      store_id: storeId,
      invoice_number: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      plan_id: newPlanId,
      amount: plan.priceMonthly,
      currency: "INR",
      status: "paid",
      payment_method: "Simulated Card / Demo",
      created_at: now.toISOString(),
    };
    invoices.unshift(newInvoice);
    setLocalData(STORAGE_INVOICES, invoices);

    return { data: updated, error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        store_id: storeId,
        seller_id: sellerId,
        plan_id: newPlanId,
        status: "active",
        started_at: now.toISOString(),
        expires_at: expiresAt,
        updated_at: now.toISOString(),
      },
      { onConflict: "store_id" }
    )
    .select()
    .single();

  if (error || !data) {
    return { data: null, error: error?.message || "Failed to update subscription." };
  }

  // Create invoice record
  try {
    const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await supabase.from("billing_invoices").insert({
      subscription_id: data.id,
      store_id: storeId,
      seller_id: sellerId,
      invoice_number: invNumber,
      plan_id: newPlanId,
      amount: plan.priceMonthly,
      currency: "INR",
      status: "paid",
      payment_method: "Simulated / Demo Activation",
    });
  } catch (invErr) {
    console.warn("Invoice creation non-critical warning:", invErr);
  }

  return { data: data as StoreSubscription, error: null };
}

export async function getBillingInvoices(storeId: string): Promise<BillingInvoice[]> {
  if (!isSupabaseConfigured()) {
    const invoices = getLocalData<BillingInvoice[]>(STORAGE_INVOICES, []);
    if (invoices.length === 0) {
      const initial: BillingInvoice = {
        id: "inv-welcome",
        store_id: storeId,
        invoice_number: "INV-2026-1001",
        plan_id: "free",
        amount: 0,
        currency: "INR",
        status: "paid",
        payment_method: "Account Creation",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setLocalData(STORAGE_INVOICES, [initial]);
      return [initial];
    }
    return invoices;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("billing_invoices")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching billing invoices:", error);
    return [];
  }

  return (data || []) as BillingInvoice[];
}

// ==============================================================================
// 5. MANUAL PAYMENT UPGRADE REQUEST OPERATIONS (ADMIN VERIFICATION WORKFLOW)
// ==============================================================================

export interface CreateUpgradeRequestInput {
  store_id: string;
  store_name?: string;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  target_plan_id: PlanId;
  payment_method: string;
  transaction_reference: string;
  payment_date: string;
  payment_proof_url?: string;
}

export async function createUpgradeRequest(
  input: CreateUpgradeRequestInput
): Promise<{ data: SubscriptionUpgradeRequest | null; error: string | null }> {
  const {
    store_id,
    store_name = "My Store",
    seller_id,
    seller_name,
    seller_email,
    target_plan_id,
    payment_method,
    transaction_reference,
    payment_date,
    payment_proof_url,
  } = input;

  if (!target_plan_id || (target_plan_id !== "starter" && target_plan_id !== "pro")) {
    return { data: null, error: "Please select a valid paid plan (Starter or Pro)." };
  }

  const cleanRef = (transaction_reference || "").trim();
  if (!cleanRef || cleanRef.length < 5) {
    return {
      data: null,
      error: "Please enter a valid Transaction Reference / UTR (at least 5 characters).",
    };
  }

  const now = new Date();
  const currentSub = await getStoreSubscription(store_id, seller_id);
  const targetPlan = getPlanConfig(target_plan_id);

  if (currentSub.plan_id === target_plan_id) {
    return {
      data: null,
      error: `Your store is already active on the ${targetPlan.name} plan.`,
    };
  }

  // 1. Check for existing pending request for this store
  const existingRequests = await getStoreUpgradeRequests(store_id);
  const activePending = existingRequests.find((r) => r.status === "pending");
  if (activePending) {
    return {
      data: null,
      error: `You already have an upgrade request (${activePending.request_number}) pending verification. Our team will verify it within 24 hours.`,
    };
  }

  const requestNumber = `REQ-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRequest: SubscriptionUpgradeRequest = {
    id: "req-" + Date.now(),
    request_number: requestNumber,
    store_id,
    store_name,
    seller_id,
    seller_name: seller_name.trim(),
    seller_email: (seller_email || "").trim(),
    current_plan_id: currentSub.plan_id,
    target_plan_id,
    amount: targetPlan.priceMonthly,
    currency: "INR",
    payment_method,
    transaction_reference: cleanRef,
    payment_date: payment_date || now.toISOString().split("T")[0],
    payment_proof_url: payment_proof_url || undefined,
    status: "pending",
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  if (!isSupabaseConfigured()) {
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    all.unshift(newRequest);
    setLocalData(STORAGE_UPGRADE_REQUESTS, all);
    return { data: newRequest, error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscription_upgrade_requests")
    .insert({
      request_number: newRequest.request_number,
      store_id: newRequest.store_id,
      store_name: newRequest.store_name,
      seller_id: newRequest.seller_id,
      seller_name: newRequest.seller_name,
      seller_email: newRequest.seller_email,
      current_plan_id: newRequest.current_plan_id,
      target_plan_id: newRequest.target_plan_id,
      amount: newRequest.amount,
      currency: newRequest.currency,
      payment_method: newRequest.payment_method,
      transaction_reference: newRequest.transaction_reference,
      payment_date: newRequest.payment_date,
      payment_proof_url: newRequest.payment_proof_url,
      status: "pending",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Supabase create upgrade request error:", error);
    // Fallback locally if table not yet migrated
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    all.unshift(newRequest);
    setLocalData(STORAGE_UPGRADE_REQUESTS, all);
    return { data: newRequest, error: null };
  }

  return { data: data as SubscriptionUpgradeRequest, error: null };
}

export async function getStoreUpgradeRequests(
  storeId: string
): Promise<SubscriptionUpgradeRequest[]> {
  if (!isSupabaseConfigured()) {
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    return all.filter((r) => r.store_id === storeId);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscription_upgrade_requests")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase fetch upgrade requests fallback:", error.message);
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    return all.filter((r) => r.store_id === storeId);
  }

  return (data || []) as SubscriptionUpgradeRequest[];
}

export async function getAllUpgradeRequests(
  filterStatus?: string
): Promise<SubscriptionUpgradeRequest[]> {
  if (!isSupabaseConfigured()) {
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    if (!filterStatus || filterStatus === "all") return all;
    return all.filter((r) => r.status === filterStatus);
  }

  const supabase = createClient();
  let query = supabase
    .from("subscription_upgrade_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Supabase fetch all upgrade requests fallback:", error.message);
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    if (!filterStatus || filterStatus === "all") return all;
    return all.filter((r) => r.status === filterStatus);
  }

  return (data || []) as SubscriptionUpgradeRequest[];
}

export async function reviewUpgradeRequest(
  requestId: string,
  action: "approve" | "reject",
  adminEmail: string,
  rejectionReason?: string
): Promise<{ success: boolean; request: SubscriptionUpgradeRequest | null; error: string | null }> {
  const now = new Date();

  // 1. Fetch the request
  let targetReq: SubscriptionUpgradeRequest | null = null;

  if (!isSupabaseConfigured()) {
    const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
    targetReq = all.find((r) => r.id === requestId || r.request_number === requestId) || null;
  } else {
    const supabase = createClient();
    let query = supabase.from("subscription_upgrade_requests").select("*");
    if (isUuid(requestId)) {
      query = query.or(`id.eq.${requestId},request_number.eq.${requestId}`);
    } else {
      query = query.eq("request_number", requestId);
    }
    const { data } = await query.maybeSingle();

    if (data) {
      targetReq = data as SubscriptionUpgradeRequest;
    } else {
      const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
      targetReq = all.find((r) => r.id === requestId || r.request_number === requestId) || null;
    }
  }

  if (!targetReq) {
    return { success: false, request: null, error: "Upgrade request not found." };
  }

  if (targetReq.status !== "pending") {
    return {
      success: false,
      request: targetReq,
      error: `This request has already been ${targetReq.status}.`,
    };
  }

  if (action === "approve") {
    // APPROVE: Update plan securely on backend & record activation date
    const { data: updatedSub, error: subErr } = await changeStorePlan(
      targetReq.store_id,
      targetReq.seller_id,
      targetReq.target_plan_id
    );

    if (subErr) {
      return { success: false, request: null, error: subErr };
    }

    const updatedRequest: SubscriptionUpgradeRequest = {
      ...targetReq,
      status: "approved",
      reviewed_by: adminEmail,
      reviewed_at: now.toISOString(),
      activated_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    // Also record invoice with manual verification details
    const targetPlan = getPlanConfig(targetReq.target_plan_id);
    const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!isSupabaseConfigured() || !isUuid(targetReq.store_id) || !isUuid(targetReq.id)) {
      // Update local storage requests
      const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
      const idx = all.findIndex((r) => r.id === targetReq!.id);
      if (idx !== -1) all[idx] = updatedRequest;
      setLocalData(STORAGE_UPGRADE_REQUESTS, all);

      // Record invoice
      const invoices = getLocalData<BillingInvoice[]>(STORAGE_INVOICES, []);
      invoices.unshift({
        id: "inv-" + Date.now(),
        subscription_id: updatedSub?.id,
        store_id: targetReq.store_id,
        invoice_number: invoiceNumber,
        plan_id: targetReq.target_plan_id,
        amount: targetPlan.priceMonthly,
        currency: "INR",
        status: "paid",
        payment_method: `${targetReq.payment_method} (Verified UTR: ${targetReq.transaction_reference})`,
        created_at: now.toISOString(),
      });
      setLocalData(STORAGE_INVOICES, invoices);
    } else {
      const supabase = createClient();
      await supabase
        .from("subscription_upgrade_requests")
        .update({
          status: "approved",
          reviewed_by: adminEmail,
          reviewed_at: now.toISOString(),
          activated_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("id", targetReq.id);

      await supabase.from("billing_invoices").insert({
        subscription_id: updatedSub?.id,
        store_id: targetReq.store_id,
        seller_id: targetReq.seller_id,
        invoice_number: invoiceNumber,
        plan_id: targetReq.target_plan_id,
        amount: targetPlan.priceMonthly,
        currency: "INR",
        status: "paid",
        payment_method: `${targetReq.payment_method} (Verified UTR: ${targetReq.transaction_reference})`,
      });
    }

    try {
      await notifyUpgradeReviewed({
        sellerId: targetReq.seller_id,
        sellerName: targetReq.seller_name,
        sellerEmail: targetReq.seller_email || "",
        storeName: targetReq.store_name || "SellNest Store",
        planName: targetPlan.name,
        action: "approved",
        invoiceNumber,
        amount: targetPlan.priceMonthly,
      });
    } catch (e) {
      console.warn("Notification dispatch warning:", e);
    }

    return { success: true, request: updatedRequest, error: null };
  } else {
    // REJECT: Do not activate plan. Record reason.
    const reason =
      (rejectionReason || "").trim() ||
      "Payment could not be matched against bank records. Please check the UTR reference number or contact support.";

    const updatedRequest: SubscriptionUpgradeRequest = {
      ...targetReq,
      status: "rejected",
      rejection_reason: reason,
      reviewed_by: adminEmail,
      reviewed_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    if (!isSupabaseConfigured() || !isUuid(targetReq.store_id) || !isUuid(targetReq.id)) {
      const all = getLocalData<SubscriptionUpgradeRequest[]>(STORAGE_UPGRADE_REQUESTS, []);
      const idx = all.findIndex((r) => r.id === targetReq!.id);
      if (idx !== -1) all[idx] = updatedRequest;
      setLocalData(STORAGE_UPGRADE_REQUESTS, all);
    } else {
      const supabase = createClient();
      await supabase
        .from("subscription_upgrade_requests")
        .update({
          status: "rejected",
          rejection_reason: reason,
          reviewed_by: adminEmail,
          reviewed_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("id", targetReq.id);
    }

    try {
      await notifyUpgradeReviewed({
        sellerId: targetReq.seller_id,
        sellerName: targetReq.seller_name,
        sellerEmail: targetReq.seller_email || "",
        storeName: targetReq.store_name || "SellNest Store",
        planName: getPlanConfig(targetReq.target_plan_id).name,
        action: "rejected",
        rejectionReason: reason,
      });
    } catch (e) {
      console.warn("Notification dispatch warning:", e);
    }

    return { success: true, request: updatedRequest, error: null };
  }
}

export async function updateProduct(
  productId: string,
  productData: Partial<Product>
): Promise<{ data: Product | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    const products = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    const idx = products.findIndex((p) => p.id === productId);
    if (idx === -1) return { data: null, error: "Product not found" };

    products[idx] = {
      ...products[idx],
      ...productData,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_PRODUCTS, products);
    return { data: products[idx], error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      ...productData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Product, error: null };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    const products = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    const filtered = products.filter((p) => p.id !== productId);
    setLocalData(STORAGE_PRODUCTS, filtered);
    return { success: true, error: null };
  }

  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ==============================================================================
// 3. ORDER CRUD OPERATIONS
// ==============================================================================

export async function getStoreOrders(storeId: string, statusFilter?: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    let orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    if (statusFilter && statusFilter !== "all") {
      orders = orders.filter((o) => o.status === statusFilter);
    }
    return orders;
  }

  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return (data || []) as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ success: boolean; error: string | null }> {
  let targetOrder: Order | null = null;

  if (!isSupabaseConfigured()) {
    const orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const oldStatus = orders[idx].status;
      orders[idx].status = status;
      orders[idx].updated_at = new Date().toISOString();
      setLocalData(STORAGE_ORDERS, orders);
      targetOrder = orders[idx];

      // Dispatch status change notifications
      try {
        notifyOrderStatusChanged({
          sellerId: targetOrder.store_id || "seller-1",
          storeName: "SellNest Store",
          orderCode: targetOrder.order_code || targetOrder.order_number?.toString() || orderId,
          customerName: targetOrder.customer_name,
          customerEmail: targetOrder.customer_email,
          oldStatus,
          newStatus: status,
          totalAmount: targetOrder.total_amount,
        });
      } catch (e) {
        console.warn("Status change notification error:", e);
      }

      return { success: true, error: null };
    }
    return { success: false, error: "Order not found" };
  }

  const supabase = createClient();
  const { data: currentOrder } = await supabase
    .from("orders")
    .select("*, store:stores(name, seller_id)")
    .eq("id", orderId)
    .maybeSingle();

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  if (currentOrder) {
    try {
      await notifyOrderStatusChanged({
        sellerId: currentOrder.store?.seller_id || currentOrder.store_id,
        storeName: currentOrder.store?.name || "SellNest Store",
        orderCode: currentOrder.order_code || currentOrder.order_number?.toString() || orderId,
        customerName: currentOrder.customer_name,
        customerEmail: currentOrder.customer_email,
        oldStatus: currentOrder.status,
        newStatus: status,
        totalAmount: currentOrder.total_amount,
      });
    } catch (e) {
      console.warn("Status change notification error:", e);
    }
  }

  return { success: true, error: null };
}

export async function createOrder(
  storeId: string,
  orderData: {
    order_code?: string;
    customer_name: string;
    customer_phone?: string;
    customer_email?: string;
    delivery_address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    subtotal_amount?: number;
    delivery_fee?: number;
    total_amount: number;
    status?: Order["status"];
    notes?: string;
  },
  items: Array<{
    product_id?: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }>
): Promise<{ data: Order | null; error: string | null }> {
  const generatedCode =
    orderData.order_code || `SN-${Math.floor(100000 + Math.random() * 900000)}`;

  if (!isSupabaseConfigured() || !isUuid(storeId)) {
    const orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    const newOrder: Order = {
      id: "ord-" + Date.now(),
      store_id: storeId,
      order_number: orders.length + 101,
      order_code: generatedCode,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      delivery_address: orderData.delivery_address,
      city: orderData.city,
      state: orderData.state,
      pincode: orderData.pincode,
      subtotal_amount: orderData.subtotal_amount ?? orderData.total_amount,
      delivery_fee: orderData.delivery_fee ?? 0,
      total_amount: orderData.total_amount,
      status: orderData.status || "pending",
      notes: orderData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map((it, idx) => ({
        id: "item-" + Date.now() + "-" + idx,
        order_id: "ord-" + Date.now(),
        product_id: it.product_id,
        product_name: it.product_name,
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.quantity * it.unit_price,
        created_at: new Date().toISOString(),
      })),
    };
    orders.unshift(newOrder);
    setLocalData(STORAGE_ORDERS, orders);

    // Atomically reduce stock in local products
    const prods = getLocalData<Product[]>(STORAGE_PRODUCTS, []);
    items.forEach((it) => {
      if (it.product_id) {
        const pIdx = prods.findIndex((p) => p.id === it.product_id);
        if (pIdx > -1) {
          prods[pIdx].stock_quantity = Math.max(0, prods[pIdx].stock_quantity - it.quantity);
        }
      }
    });
    setLocalData(STORAGE_PRODUCTS, prods);

    // Also update customers
    updateLocalCustomer(storeId, orderData);

    return { data: newOrder, error: null };
  }

  const supabase = createClient();

  // 1. Insert order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      store_id: storeId,
      order_code: generatedCode,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      delivery_address: orderData.delivery_address,
      city: orderData.city,
      state: orderData.state,
      pincode: orderData.pincode,
      subtotal_amount: orderData.subtotal_amount ?? orderData.total_amount,
      delivery_fee: orderData.delivery_fee ?? 0,
      total_amount: orderData.total_amount,
      status: orderData.status || "pending",
      notes: orderData.notes,
    })
    .select()
    .single();

  if (orderErr || !order) {
    return { data: null, error: orderErr?.message || "Failed to create order" };
  }

  // 2. Insert order items and reduce stock
  if (items && items.length > 0) {
    const itemRecords = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.product_name,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.quantity * it.unit_price,
    }));

    await supabase.from("order_items").insert(itemRecords);

    // Decrement stock in Supabase for each item
    for (const it of items) {
      if (it.product_id) {
        try {
          const { data: currentP } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", it.product_id)
            .single();

          if (currentP) {
            const nextStock = Math.max(0, (currentP.stock_quantity || 0) - it.quantity);
            await supabase
              .from("products")
              .update({ stock_quantity: nextStock })
              .eq("id", it.product_id);
          }
        } catch (e) {
          console.warn("Stock decrement warning:", e);
        }
      }
    }
  }

  // 3. Upsert customer record
  if (orderData.customer_name) {
    try {
      const { data: existingCust } = await supabase
        .from("customers")
        .select("*")
        .eq("store_id", storeId)
        .eq("name", orderData.customer_name)
        .maybeSingle();

      if (existingCust) {
        await supabase
          .from("customers")
          .update({
            total_orders: existingCust.total_orders + 1,
            total_spent: Number(existingCust.total_spent) + Number(orderData.total_amount),
            last_order_at: new Date().toISOString(),
            phone: orderData.customer_phone || existingCust.phone,
            address: orderData.delivery_address || existingCust.address,
          })
          .eq("id", existingCust.id);
      } else {
        await supabase.from("customers").insert({
          store_id: storeId,
          name: orderData.customer_name,
          phone: orderData.customer_phone,
          email: orderData.customer_email,
          address: orderData.delivery_address,
          total_orders: 1,
          total_spent: orderData.total_amount,
          last_order_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("Customer sync non-critical warning:", e);
    }
  }

  return { data: { ...order, order_code: generatedCode } as Order, error: null };
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    const orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    return (
      orders.find(
        (o) =>
          o.id === orderId ||
          o.order_code === orderId ||
          o.order_number?.toString() === orderId
      ) || null
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .or(`id.eq.${orderId},order_code.eq.${orderId}`)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as Order;
}

export async function trackCustomerOrder(
  orderCodeOrNumber: string,
  phone: string
): Promise<{ order: Order | null; store: Store | null; error: string | null }> {
  const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
  const cleanCode = orderCodeOrNumber.trim().toUpperCase();

  if (!cleanCode) {
    return { order: null, store: null, error: "Please provide an order number." };
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return { order: null, store: null, error: "Please enter the 10-digit mobile number used during checkout." };
  }

  if (!isSupabaseConfigured()) {
    const orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    const localStore = getLocalData<Store | null>(STORAGE_STORE, null);

    const found = orders.find((o) => {
      const matchCode =
        o.order_code?.toUpperCase() === cleanCode ||
        o.order_number?.toString() === cleanCode ||
        o.id === orderCodeOrNumber;
      const orderPhone = (o.customer_phone || "").replace(/[^0-9]/g, "");
      const matchPhone = orderPhone.includes(cleanPhone);
      return matchCode && matchPhone;
    });

    if (!found) {
      return {
        order: null,
        store: null,
        error: "No order matched that order number and phone combination. Please check your details.",
      };
    }

    return { order: found, store: localStore, error: null };
  }

  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .ilike("customer_phone", `%${cleanPhone}%`);

  if (cleanCode.startsWith("SN-")) {
    query = query.ilike("order_code", cleanCode);
  } else if (!isNaN(Number(cleanCode))) {
    query = query.or(`order_number.eq.${cleanCode},order_code.ilike.%${cleanCode}%`);
  } else {
    query = query.or(`id.eq.${cleanCode},order_code.ilike.%${cleanCode}%`);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    const orders = getLocalData<Order[]>(STORAGE_ORDERS, []);
    const localStore = getLocalData<Store | null>(STORAGE_STORE, null);

    const found = orders.find((o) => {
      const matchCode =
        o.order_code?.toUpperCase() === cleanCode ||
        o.order_number?.toString() === cleanCode ||
        o.id === orderCodeOrNumber;
      const orderPhone = (o.customer_phone || "").replace(/[^0-9]/g, "");
      const matchPhone = orderPhone.includes(cleanPhone);
      return matchCode && matchPhone;
    });

    if (found) {
      return { order: found, store: localStore, error: null };
    }

    return {
      order: null,
      store: null,
      error: "No matching order found for this order number and mobile combination.",
    };
  }

  // Fetch store info
  const { data: storeData } = await supabase
    .from("stores")
    .select("*")
    .eq("id", data.store_id)
    .maybeSingle();

  return { order: data as Order, store: (storeData || null) as Store | null, error: null };
}

function updateLocalCustomer(storeId: string, orderData: any) {
  const customers = getLocalData<Customer[]>(STORAGE_CUSTOMERS, []);
  const idx = customers.findIndex((c) => c.name.toLowerCase() === orderData.customer_name.toLowerCase());
  if (idx !== -1) {
    customers[idx].total_orders += 1;
    customers[idx].total_spent += Number(orderData.total_amount);
    customers[idx].last_order_at = new Date().toISOString();
  } else {
    customers.push({
      id: "cust-" + Date.now(),
      store_id: storeId,
      name: orderData.customer_name,
      phone: orderData.customer_phone,
      email: orderData.customer_email,
      address: orderData.delivery_address,
      total_orders: 1,
      total_spent: Number(orderData.total_amount),
      last_order_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  setLocalData(STORAGE_CUSTOMERS, customers);
}

// ==============================================================================
// 4. CUSTOMERS & ANALYTICS
// ==============================================================================

export async function getStoreCustomers(storeId: string): Promise<Customer[]> {
  if (!isSupabaseConfigured()) {
    return getLocalData<Customer[]>(STORAGE_CUSTOMERS, []);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("store_id", storeId)
    .order("total_spent", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data || []) as Customer[];
}

export async function getDashboardStats(storeId: string): Promise<{
  stats: DashboardStats;
  recentOrders: Order[];
  topProducts: Array<{ name: string; salesCount: number; revenue: number; image?: string }>;
  revenueChartData: Array<{ label: string; revenue: number; orders: number }>;
}> {
  const [orders, products, customers] = await Promise.all([
    getStoreOrders(storeId),
    getStoreProducts(storeId),
    getStoreCustomers(storeId),
  ]);

  const completedOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  // Calculate top products based on actual order items
  const productSalesMap = new Map<string, { name: string; salesCount: number; revenue: number; image?: string }>();

  orders.forEach((ord) => {
    if (ord.items) {
      ord.items.forEach((it) => {
        const existing = productSalesMap.get(it.product_name) || {
          name: it.product_name,
          salesCount: 0,
          revenue: 0,
        };
        existing.salesCount += it.quantity;
        existing.revenue += Number(it.total_price);
        productSalesMap.set(it.product_name, existing);
      });
    }
  });

  // Attach images from products table
  products.forEach((p) => {
    if (productSalesMap.has(p.name)) {
      const it = productSalesMap.get(p.name)!;
      it.image = p.image_url;
    }
  });

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Group revenue by day for the last 7 days
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueChartData: Array<{ label: string; revenue: number; orders: number }> = [];

  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    const dateStr = d.toISOString().split("T")[0];

    const dayOrders = completedOrders.filter((o) => o.created_at.startsWith(dateStr));
    const dayRev = dayOrders.reduce((acc, o) => acc + Number(o.total_amount), 0);

    revenueChartData.push({
      label: dayName,
      revenue: dayRev,
      orders: dayOrders.length,
    });
  }

  return {
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrdersCount,
      revenueChangePercent: orders.length > 0 ? 18.5 : 0,
      ordersChangePercent: orders.length > 0 ? 12 : 0,
    },
    recentOrders: orders.slice(0, 5),
    topProducts,
    revenueChartData,
  };
}

export async function populateSampleDataIfEmpty(storeId: string): Promise<boolean> {
  const products = await getStoreProducts(storeId);
  if (products.length > 0) return false;

  // Insert initial starter sample products for quick onboard delight
  const starterItems = [
    {
      name: "Wild Yeast Country Sourdough",
      description: "36-hour slow fermented wholewheat sourdough batard with a blistered crust and open crumb. Made with 100% stoneground flour, pure mineral water and sea salt.",
      price: 320,
      category: "Artisan Breads",
      stock_quantity: 12,
      is_active: true,
      is_eggless: true,
      image_url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Pistachio & Rose Cruffin",
      description: "Laminated flaky viennoiserie pastry filled with roasted pistachio praline and rosewater curd, dusted with freeze-dried raspberry powder.",
      price: 240,
      category: "Viennoiserie",
      stock_quantity: 18,
      is_active: true,
      is_eggless: false,
      image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Classic Burnt Basque Cheesecake (650g)",
      description: "Caramelized mahogany crust with an ultra-creamy, molten vanilla bean center. Handcrafted with Philadelphia cream cheese and Madagascar Bourbon vanilla.",
      price: 1250,
      category: "Celebration Cakes",
      stock_quantity: 6,
      is_active: true,
      is_eggless: false,
      image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      name: "Brown Butter Pecan Blondies (4 pcs)",
      description: "Chewy, nutty brown-butter squares scented with cardamom and Maldon sea salt flakes. Perfectly dense and rich.",
      price: 380,
      category: "Cookies & Treats",
      stock_quantity: 14,
      is_active: true,
      is_eggless: true,
      image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  for (const item of starterItems) {
    await createProduct(storeId, item);
  }

  // Create two initial orders to populate dashboard
  await createOrder(
    storeId,
    {
      customer_name: "Aisha Menon",
      customer_phone: "+91 98450 12345",
      customer_email: "aisha@example.com",
      delivery_address: "102, Palm Grove, Indiranagar 12th Main, Bengaluru",
      total_amount: 800,
      status: "confirmed",
      notes: "Please pack sourdough sliced.",
    },
    [
      { product_name: "Pistachio & Rose Cruffin", quantity: 2, unit_price: 240 },
      { product_name: "Wild Yeast Country Sourdough", quantity: 1, unit_price: 320 },
    ]
  );

  await createOrder(
    storeId,
    {
      customer_name: "Vikram Rao",
      customer_phone: "+91 99160 88221",
      customer_email: "vikram@example.com",
      delivery_address: "54, Koramangala 4th Block, Bengaluru",
      total_amount: 1250,
      status: "pending",
      notes: "Birthday cake for Saturday morning.",
    },
    [{ product_name: "Classic Burnt Basque Cheesecake (650g)", quantity: 1, unit_price: 1250 }]
  );

  return true;
}

