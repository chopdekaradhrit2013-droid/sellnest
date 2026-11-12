import { NextRequest, NextResponse } from "next/server";
import { trackCustomerOrder } from "@/lib/dashboardService";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("order") || "";
  const phone = searchParams.get("phone") || "";

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Both Order Number and 10-digit Mobile Number are required for tracking." },
      { status: 400 }
    );
  }

  try {
    const { order, store, error } = await trackCustomerOrder(orderNumber, phone);

    if (error || !order) {
      return NextResponse.json(
        { error: error || "Order not found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_code: order.order_code || `SN-${order.order_number}`,
        order_number: order.order_number,
        status: order.status,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        delivery_address: order.delivery_address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal_amount: order.subtotal_amount,
        delivery_fee: order.delivery_fee,
        total_amount: order.total_amount,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.items || [],
        store: store
          ? {
              id: store.id,
              name: store.name,
              slug: store.slug,
              logo_url: store.logo_url,
              whatsapp_number: store.whatsapp_number,
              theme: store.theme,
            }
          : null,
      },
    });
  } catch (err: any) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Unable to look up order at this time." },
      { status: 500 }
    );
  }
}

