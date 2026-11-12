import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getSellerStore,
  getStoreSubscription,
  getStoreProducts,
  getBillingInvoices,
} from "@/lib/dashboardService";
import { getPlanConfig, canAddProduct } from "@/lib/plans";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isConfigured = Boolean(supabaseUrl && supabaseKey);

    // Default fallback store
    const store = await getSellerStore("seller-1");
    if (!store) {
      return NextResponse.json({ error: "No store found." }, { status: 404 });
    }

    const subscription = await getStoreSubscription(store.id, store.seller_id);
    const planConfig = getPlanConfig(subscription.plan_id);
    const products = await getStoreProducts(store.id);
    const invoices = await getBillingInvoices(store.id);

    const check = canAddProduct(subscription.plan_id, products.length);

    return NextResponse.json({
      success: true,
      subscription,
      plan: planConfig,
      usage: {
        productsCount: products.length,
        maxProducts: planConfig.limits.maxProducts,
        isAtProductLimit: !check.allowed,
        canAddProduct: check.allowed,
      },
      invoices,
    });
  } catch (err: any) {
    console.error("Subscription current API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve subscription." },
      { status: 500 }
    );
  }
}

