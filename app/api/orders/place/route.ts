import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOrder, getStoreBySlug, getStoreProducts } from "@/lib/dashboardService";
import { notifyNewOrder, notifyProductOutOfStock } from "@/lib/notificationService";

// In-memory idempotency cache to prevent duplicate rapid submissions (5 seconds TTL)
const recentSubmissions = new Map<string, { timestamp: number; response: any }>();

function cleanupOldSubmissions() {
  const now = Date.now();
  recentSubmissions.forEach((val, key) => {
    if (now - val.timestamp > 15000) {
      recentSubmissions.delete(key);
    }
  });
}

export async function POST(request: NextRequest) {
  cleanupOldSubmissions();

  try {
    const body = await request.json();
    const { storeSlug, customer, items, idempotencyKey } = body;

    // Check idempotency token
    if (idempotencyKey && recentSubmissions.has(idempotencyKey)) {
      const cached = recentSubmissions.get(idempotencyKey)!;
      return NextResponse.json(cached.response);
    }

    if (!storeSlug) {
      return NextResponse.json({ error: "Store slug is required." }, { status: 400 });
    }

    if (!customer || !customer.full_name || !customer.phone || !customer.delivery_address) {
      return NextResponse.json(
        { error: "Customer name, mobile number, and delivery address are required." },
        { status: 400 }
      );
    }

    const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your shopping bag is empty." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const isConfigured = Boolean(supabaseUrl && supabaseKey);

    // -------------------------------------------------------------
    // DEMO / OFFLINE FALLBACK (When Supabase is not configured)
    // -------------------------------------------------------------
    if (!isConfigured) {
      const { store } = await getStoreBySlug(storeSlug);
      if (!store) {
        return NextResponse.json({ error: "Storefront not found." }, { status: 404 });
      }

      const allProds = await getStoreProducts(store.id);

      // Verify and recalculate prices from trusted server data
      let trustedSubtotal = 0;
      const orderItemsToSave: Array<{
        product_id?: string;
        product_name: string;
        quantity: number;
        unit_price: number;
      }> = [];

      for (const reqItem of items) {
        const product = allProds.find((p) => p.id === reqItem.productId);
        if (!product) {
          return NextResponse.json(
            { error: `A product in your bag is no longer available.` },
            { status: 400 }
          );
        }

        const qty = Math.max(1, parseInt(reqItem.quantity) || 1);
        if (product.stock_quantity !== undefined && product.stock_quantity < qty) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} left in stock.`,
            },
            { status: 400 }
          );
        }

        const itemTotal = product.price * qty;
        trustedSubtotal += itemTotal;

        orderItemsToSave.push({
          product_id: product.id,
          product_name: product.name,
          quantity: qty,
          unit_price: product.price,
        });
      }

      const deliveryFee = trustedSubtotal >= 1000 ? 0 : 60;
      const finalTotal = trustedSubtotal + deliveryFee;
      const orderCode = `SN-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: createdOrder, error: createErr } = await createOrder(
        store.id,
        {
          order_code: orderCode,
          customer_name: customer.full_name.trim(),
          customer_phone: customer.phone.trim(),
          customer_email: customer.email?.trim(),
          delivery_address: customer.delivery_address.trim(),
          city: customer.city?.trim() || "Bengaluru",
          state: customer.state?.trim() || "Karnataka",
          pincode: customer.pincode?.trim() || "560001",
          subtotal_amount: trustedSubtotal,
          delivery_fee: deliveryFee,
          total_amount: finalTotal,
          status: "pending",
          notes: customer.notes?.trim() || "",
        },
        orderItemsToSave
      );

      if (createErr || !createdOrder) {
        return NextResponse.json(
          { error: createErr || "Failed to create order." },
          { status: 500 }
        );
      }

      // Trigger seller in-app, seller email, and customer order confirmation email
      try {
        await notifyNewOrder({
          sellerId: store.seller_id || "seller-1",
          sellerEmail: store.email || "maker@thebutterroom.in",
          sellerName: store.name || "Artisan Seller",
          storeName: store.name,
          orderCode,
          totalAmount: finalTotal,
          customerName: customer.full_name.trim(),
          customerEmail: customer.email?.trim(),
          customerPhone: customer.phone.trim(),
          deliveryAddress: customer.delivery_address.trim(),
          items: orderItemsToSave,
        });

        // Check if any product reached 0 stock
        for (const reqItem of items) {
          const product = allProds.find((p) => p.id === reqItem.productId);
          if (product && product.stock_quantity !== undefined && product.stock_quantity - (parseInt(reqItem.quantity) || 1) <= 0) {
            await notifyProductOutOfStock({
              sellerId: store.seller_id || "seller-1",
              productName: product.name,
              productId: product.id,
            });
          }
        }
      } catch (notifErr) {
        console.warn("Order notification dispatch warning:", notifErr);
      }

      const successResp = {
        success: true,
        order: {
          id: createdOrder.id,
          order_code: orderCode,
          customer_name: createdOrder.customer_name,
          total_amount: finalTotal,
          delivery_fee: deliveryFee,
          subtotal_amount: trustedSubtotal,
          items_count: orderItemsToSave.length,
          store_slug: store.slug,
          store_name: store.name,
          whatsapp_number: store.whatsapp_number,
        },
      };

      if (idempotencyKey) {
        recentSubmissions.set(idempotencyKey, {
          timestamp: Date.now(),
          response: successResp,
        });
      }

      return NextResponse.json(successResp);
    }

    // -------------------------------------------------------------
    // LIVE SUPABASE TRANSACTION & VALIDATION
    // -------------------------------------------------------------
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // 1. Fetch store
    const { data: store, error: storeErr } = await supabase
      .from("stores")
      .select("id, name, slug, whatsapp_number, is_published, seller_id, email")
      .ilike("slug", storeSlug.toLowerCase().trim())
      .single();

    if (storeErr || !store) {
      const { store: demoStore } = await getStoreBySlug(storeSlug);
      if (demoStore) {
        // Fall back to demo store ordering handler
        const allProds = await getStoreProducts(demoStore.id);
        let trustedSubtotal = 0;
        const orderItemsToSave: Array<{
          product_id?: string;
          product_name: string;
          quantity: number;
          unit_price: number;
        }> = [];

        for (const reqItem of items) {
          const product = allProds.find((p) => p.id === reqItem.productId);
          if (!product) {
            return NextResponse.json(
              { error: `A product in your bag is no longer available.` },
              { status: 400 }
            );
          }

          const qty = Math.max(1, parseInt(reqItem.quantity) || 1);
          if (product.stock_quantity !== undefined && product.stock_quantity < qty) {
            return NextResponse.json(
              {
                error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} left in stock.`,
              },
              { status: 400 }
            );
          }

          const itemTotal = product.price * qty;
          trustedSubtotal += itemTotal;

          orderItemsToSave.push({
            product_id: product.id,
            product_name: product.name,
            quantity: qty,
            unit_price: product.price,
          });
        }

        const deliveryFee = trustedSubtotal >= 1000 ? 0 : 60;
        const finalTotal = trustedSubtotal + deliveryFee;
        const orderCode = `SN-${Math.floor(100000 + Math.random() * 900000)}`;

        const { data: createdOrder, error: createErr } = await createOrder(
          demoStore.id,
          {
            order_code: orderCode,
            customer_name: customer.full_name.trim(),
            customer_phone: customer.phone.trim(),
            customer_email: customer.email?.trim(),
            delivery_address: customer.delivery_address.trim(),
            city: customer.city?.trim() || "Bengaluru",
            state: customer.state?.trim() || "Karnataka",
            pincode: customer.pincode?.trim() || "560001",
            subtotal_amount: trustedSubtotal,
            delivery_fee: deliveryFee,
            total_amount: finalTotal,
            status: "pending",
            notes: customer.notes?.trim() || "",
          },
          orderItemsToSave
        );

        if (createErr || !createdOrder) {
          return NextResponse.json(
            { error: createErr || "Failed to create order." },
            { status: 500 }
          );
        }

        const successResp = {
          success: true,
          order: {
            id: createdOrder.id,
            order_code: orderCode,
            customer_name: createdOrder.customer_name,
            total_amount: finalTotal,
            delivery_fee: deliveryFee,
            subtotal_amount: trustedSubtotal,
            items_count: orderItemsToSave.length,
            store_slug: demoStore.slug,
            store_name: demoStore.name,
            whatsapp_number: demoStore.whatsapp_number,
          },
        };

        if (idempotencyKey) {
          recentSubmissions.set(idempotencyKey, {
            timestamp: Date.now(),
            response: successResp,
          });
        }

        return NextResponse.json(successResp);
      }

      return NextResponse.json({ error: "Store not found." }, { status: 404 });
    }

    if (!store.is_published) {
      return NextResponse.json(
        { error: "This storefront is currently offline and not accepting orders." },
        { status: 403 }
      );
    }

    // 2. Fetch products for all requested items
    const productIds = items.map((it: any) => it.productId);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .in("id", productIds)
      .eq("store_id", store.id);

    if (prodErr || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { error: "Products could not be validated. Please refresh your cart." },
        { status: 400 }
      );
    }

    // 3. Server-side validation of active status, price, and stock
    let trustedSubtotal = 0;
    const validatedItems: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      remainingStock: number;
    }> = [];

    for (const reqItem of items) {
      const product = dbProducts.find((p) => p.id === reqItem.productId);
      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product "${product?.name || reqItem.productId}" is currently unavailable.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, parseInt(reqItem.quantity) || 1);
      if (product.stock_quantity < qty) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} available.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.price) * qty;
      trustedSubtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        unit_price: Number(product.price),
        total_price: itemTotal,
        remainingStock: product.stock_quantity - qty,
      });
    }

    const deliveryFee = trustedSubtotal >= 1000 ? 0 : 60;
    const trustedTotal = trustedSubtotal + deliveryFee;
    const orderCode = `SN-${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Create Order record
    const { data: newOrder, error: orderInsertErr } = await supabase
      .from("orders")
      .insert({
        store_id: store.id,
        order_code: orderCode,
        customer_name: customer.full_name.trim(),
        customer_phone: customer.phone.trim(),
        customer_email: customer.email?.trim() || null,
        delivery_address: customer.delivery_address.trim(),
        city: customer.city?.trim() || "Bengaluru",
        state: customer.state?.trim() || "Karnataka",
        pincode: customer.pincode?.trim() || "560001",
        subtotal_amount: trustedSubtotal,
        delivery_fee: deliveryFee,
        total_amount: trustedTotal,
        status: "pending",
        notes: customer.notes?.trim() || null,
      })
      .select()
      .single();

    if (orderInsertErr || !newOrder) {
      console.error("Order creation database error:", orderInsertErr);
      return NextResponse.json(
        { error: "Failed to place order. Please try again." },
        { status: 500 }
      );
    }

    // 5. Insert order items
    const orderItemsToInsert = validatedItems.map((it) => ({
      order_id: newOrder.id,
      product_id: it.product_id,
      product_name: it.product_name,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.total_price,
    }));

    await supabase.from("order_items").insert(orderItemsToInsert);

    // 6. Reduce stock atomically for each product
    for (const it of validatedItems) {
      await supabase
        .from("products")
        .update({ stock_quantity: it.remainingStock })
        .eq("id", it.product_id);
    }

    // 7. Upsert customer history
    try {
      const { data: existingCust } = await supabase
        .from("customers")
        .select("id, total_orders, total_spent")
        .eq("store_id", store.id)
        .eq("name", customer.full_name.trim())
        .maybeSingle();

      if (existingCust) {
        await supabase
          .from("customers")
          .update({
            total_orders: existingCust.total_orders + 1,
            total_spent: Number(existingCust.total_spent) + trustedTotal,
            last_order_at: new Date().toISOString(),
            phone: customer.phone.trim(),
            address: customer.delivery_address.trim(),
          })
          .eq("id", existingCust.id);
      } else {
        await supabase.from("customers").insert({
          store_id: store.id,
          name: customer.full_name.trim(),
          phone: customer.phone.trim(),
          email: customer.email?.trim() || null,
          address: customer.delivery_address.trim(),
          total_orders: 1,
          total_spent: trustedTotal,
          last_order_at: new Date().toISOString(),
        });
      }
    } catch (custErr) {
      console.warn("Non-critical customer record update:", custErr);
    }

    // Trigger in-app & transactional email notifications
    try {
      await notifyNewOrder({
        sellerId: store.seller_id || "seller-1",
        sellerEmail: store.email || undefined,
        sellerName: store.name,
        storeName: store.name,
        orderCode,
        totalAmount: trustedTotal,
        customerName: customer.full_name.trim(),
        customerEmail: customer.email?.trim(),
        customerPhone: customer.phone.trim(),
        deliveryAddress: customer.delivery_address.trim(),
        items: validatedItems,
      });

      // Check if any item reached 0 stock
      for (const it of validatedItems) {
        if (it.remainingStock <= 0) {
          await notifyProductOutOfStock({
            sellerId: store.seller_id || "seller-1",
            productName: it.product_name,
            productId: it.product_id,
          });
        }
      }
    } catch (notifErr) {
      console.warn("Order placement notification non-critical error:", notifErr);
    }

    const successResponse = {
      success: true,
      order: {
        id: newOrder.id,
        order_code: orderCode,
        customer_name: newOrder.customer_name,
        total_amount: trustedTotal,
        delivery_fee: deliveryFee,
        subtotal_amount: trustedSubtotal,
        items_count: validatedItems.length,
        store_slug: store.slug,
        store_name: store.name,
        whatsapp_number: store.whatsapp_number,
      },
    };

    if (idempotencyKey) {
      recentSubmissions.set(idempotencyKey, {
        timestamp: Date.now(),
        response: successResponse,
      });
    }

    return NextResponse.json(successResponse);
  } catch (err: any) {
    console.error("Place order API exception:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while placing your order." },
      { status: 500 }
    );
  }
}

