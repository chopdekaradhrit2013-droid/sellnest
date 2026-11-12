export type PlanId = "free" | "starter" | "pro";

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "trialing";

export interface PlanLimits {
  maxStores: number;
  maxProducts: number; // 10 for Free, 100 for Starter, Infinity for Pro
  themesAllowed: string[];
  customBranding: boolean;
  advancedAnalytics: boolean;
  customerInsights: boolean;
  prioritySupport: boolean;
  featuredSections: boolean;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number;
  currency: string;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface StoreSubscription {
  id: string;
  store_id: string;
  plan_id: PlanId;
  status: SubscriptionStatus;
  billing_cycle: "monthly" | "yearly";
  started_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingInvoice {
  id: string;
  subscription_id?: string;
  store_id: string;
  invoice_number: string;
  plan_id: PlanId;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "refunded";
  payment_method: string;
  created_at: string;
}

export type UpgradeRequestStatus = "pending" | "approved" | "rejected";

export interface SubscriptionUpgradeRequest {
  id: string;
  request_number: string;
  store_id: string;
  store_name?: string;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  current_plan_id: PlanId;
  target_plan_id: PlanId;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_reference: string;
  payment_date: string;
  payment_proof_url?: string;
  status: UpgradeRequestStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  activated_at?: string;
  created_at: string;
  updated_at: string;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    badge: "Forever Free",
    tagline: "Perfect for budding bakers, hobbyists & new makers starting out.",
    priceMonthly: 0,
    currency: "INR",
    limits: {
      maxStores: 1,
      maxProducts: 10,
      themesAllowed: ["minimal", "modern"],
      customBranding: false,
      advancedAnalytics: false,
      customerInsights: false,
      prioritySupport: false,
      featuredSections: false,
    },
    features: [
      "1 Online storefront",
      "Up to 10 products",
      "Basic themes (Minimal & Modern)",
      "Direct WhatsApp checkout",
      "Basic order management",
      "Core dashboard stats",
      "Community support",
    ],
    ctaText: "Current Plan",
  },
  starter: {
    id: "starter",
    name: "Starter",
    badge: "Most Popular",
    popular: true,
    tagline: "Ideal for growing independent creators & Instagram sellers scaling orders.",
    priceMonthly: 99,
    currency: "INR",
    limits: {
      maxStores: 1,
      maxProducts: 100,
      themesAllowed: ["minimal", "modern", "boutique", "playful"],
      customBranding: true,
      advancedAnalytics: false,
      customerInsights: false,
      prioritySupport: true,
      featuredSections: true,
    },
    features: [
      "1 Online storefront",
      "Up to 100 products",
      "All 4 themes (Boutique & Playful)",
      "Custom branding & colors",
      "Direct WhatsApp checkout",
      "Advanced order management",
      "Basic sales analytics",
      "Priority maker support",
    ],
    ctaText: "Upgrade to Starter",
  },
  pro: {
    id: "pro",
    name: "Pro",
    badge: "Full Power",
    tagline: "For busy artisanal studios, high-volume bakeries and established brands.",
    priceMonthly: 199,
    currency: "INR",
    limits: {
      maxStores: 1,
      maxProducts: Infinity,
      themesAllowed: ["minimal", "modern", "boutique", "playful"],
      customBranding: true,
      advancedAnalytics: true,
      customerInsights: true,
      prioritySupport: true,
      featuredSections: true,
    },
    features: [
      "1 Online storefront",
      "Unlimited products",
      "All customization options",
      "Advanced revenue & sales analytics",
      "Full customer insights & repeat metrics",
      "Featured highlights & promo banners",
      "Dedicated priority support",
      "All future Pro-exclusive features",
    ],
    ctaText: "Upgrade to Pro",
  },
};

export function getPlanConfig(planId?: string): PlanConfig {
  const clean = (planId || "free").toLowerCase() as PlanId;
  return PLANS[clean] || PLANS.free;
}

export function canAddProduct(
  planId: PlanId,
  currentProductCount: number
): { allowed: boolean; reason?: string; maxAllowed: number } {
  const plan = getPlanConfig(planId);
  const max = plan.limits.maxProducts;

  if (currentProductCount >= max) {
    const nextPlan = planId === "free" ? "Starter (up to 100 products)" : "Pro (unlimited products)";
    return {
      allowed: false,
      maxAllowed: max,
      reason: `You've reached your ${max}-product limit on the ${plan.name} plan. Upgrade to ${nextPlan} to add more products.`,
    };
  }

  return { allowed: true, maxAllowed: max };
}

export function canUseTheme(planId: PlanId, themeKey: string): boolean {
  const plan = getPlanConfig(planId);
  const key = themeKey.toLowerCase();
  return plan.limits.themesAllowed.includes(key);
}

export function hasPlanFeature(
  planId: PlanId,
  feature: keyof PlanLimits
): boolean {
  const plan = getPlanConfig(planId);
  return Boolean(plan.limits[feature]);
}

