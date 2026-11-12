import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getSellerStore,
  getStoreSubscription,
  changeStorePlan,
  getStoreProducts,
} from "@/lib/dashboardService";
import { PlanId, getPlanConfig, PLANS } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, storeId } = body;

    const validPlans: PlanId[] = ["free", "starter", "pro"];
    if (!planId || !validPlans.includes(planId)) {
      return NextResponse.json(
        { error: "Invalid plan selected. Choose 'free', 'starter', or 'pro'." },
        { status: 400 }
      );
    }

    const store = await getSellerStore(storeId || "seller-1");
    if (!store) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    const currentSub = await getStoreSubscription(store.id, store.seller_id);
    if (currentSub.plan_id === planId) {
      return NextResponse.json(
        { error: `You are already subscribed to the ${PLANS[planId as PlanId].name} plan.` },
        { status: 400 }
      );
    }

    // Check product count vs new plan limit
    const products = await getStoreProducts(store.id);
    const targetPlan = getPlanConfig(planId);
    const exceedsLimit = products.length > targetPlan.limits.maxProducts;

    const { data: updatedSub, error: updateErr } = await changeStorePlan(
      store.id,
      store.seller_id,
      planId
    );

    if (updateErr || !updatedSub) {
      return NextResponse.json(
        { error: updateErr || "Failed to update subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: updatedSub,
      plan: targetPlan,
      exceedsLimit,
      productsCount: products.length,
      maxAllowed: targetPlan.limits.maxProducts,
      message: exceedsLimit
        ? `Switched to ${targetPlan.name} plan. Note: You have ${products.length} products, which exceeds the ${targetPlan.name} limit (${targetPlan.limits.maxProducts}). Existing products remain online, but you cannot add new products until you upgrade or reduce your catalog.`
        : `Successfully switched to the ${targetPlan.name} plan!`,
    });
  } catch (err: any) {
    console.error("Change plan API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to change subscription plan." },
      { status: 500 }
    );
  }
}

