import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getSellerStore,
  createUpgradeRequest,
  getStoreUpgradeRequests,
} from "@/lib/dashboardService";
import { PlanId } from "@/lib/plans";
import { createClient } from "@supabase/supabase-js";
import { notifyUpgradeSubmitted } from "@/lib/notificationService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeId,
      sellerName,
      sellerEmail,
      targetPlanId,
      paymentMethod,
      transactionReference,
      paymentDate,
      paymentProofUrl,
    } = body;

    // Fallback store
    const store = await getSellerStore(storeId || "seller-1");
    if (!store) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    if (!targetPlanId || (targetPlanId !== "starter" && targetPlanId !== "pro")) {
      return NextResponse.json(
        { error: "Invalid target plan selected. Choose 'starter' or 'pro'." },
        { status: 400 }
      );
    }

    if (!transactionReference || transactionReference.trim().length < 5) {
      return NextResponse.json(
        { error: "Please enter a valid Transaction Reference / UTR (at least 5 characters)." },
        { status: 400 }
      );
    }

    const { data: upgradeReq, error } = await createUpgradeRequest({
      store_id: store.id,
      store_name: store.name,
      seller_id: store.seller_id,
      seller_name: sellerName || "Seller",
      seller_email: sellerEmail || store.email || "",
      target_plan_id: targetPlanId as PlanId,
      payment_method: paymentMethod || "UPI / Direct Bank Transfer",
      transaction_reference: transactionReference.trim(),
      payment_date: paymentDate || new Date().toISOString().split("T")[0],
      payment_proof_url: paymentProofUrl || undefined,
    });

    if (error || !upgradeReq) {
      return NextResponse.json({ error: error || "Failed to create upgrade request." }, { status: 400 });
    }

    try {
      await notifyUpgradeSubmitted({
        sellerId: store.seller_id,
        sellerName: sellerName || "Seller",
        sellerEmail: sellerEmail || store.email || "",
        storeName: store.name,
        planName: targetPlanId.toUpperCase(),
        requestNumber: upgradeReq.request_number,
        amount: upgradeReq.amount,
      });
    } catch (notifErr) {
      console.warn("Upgrade notification error:", notifErr);
    }

    return NextResponse.json({
      success: true,
      request: upgradeReq,
      message:
        "Your upgrade request has been submitted successfully! Your plan upgrade will be processed within 24 hours after payment verification.",
    });
  } catch (err: any) {
    console.error("Upgrade request API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit upgrade request." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    const store = await getSellerStore(storeId || "seller-1");
    if (!store) {
      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    const requests = await getStoreUpgradeRequests(store.id);

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (err: any) {
    console.error("Get upgrade requests error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch upgrade requests." },
      { status: 500 }
    );
  }
}

