import {
  AppNotification,
  NotificationPreferences,
  NotificationType,
  NotificationRecipientType,
} from "./types";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";
import { sendTransactionalEmail } from "./emailService";
import {
  renderWelcomeSellerEmail,
  renderNewOrderSellerEmail,
  renderOrderConfirmationCustomerEmail,
  renderOrderStatusUpdateCustomerEmail,
  renderPaymentConfirmationCustomerEmail,
  renderUpgradeRequestReceivedEmail,
  renderUpgradeApprovedEmail,
  renderUpgradeRejectedEmail,
  renderSubscriptionExpiringEmail,
} from "./emailTemplates";
import { PAYMENT_CONFIG } from "./paymentConfig";

const STORAGE_NOTIFICATIONS = "sellnest_in_app_notifications";
const STORAGE_NOTIFICATION_PREFS = "sellnest_notification_preferences";

// In-memory cache for state management and fallback
let memoryNotifications: AppNotification[] = [
  {
    id: "notif-init-1",
    recipient_id: "seller-1",
    recipient_type: "seller",
    type: "order.created",
    title: "🎉 New Customer Order (#SN-482109)",
    message: "Karan Malhotra placed an order for 2x Pistachio Cruffins (₹760).",
    link: "/dashboard/orders",
    entity_type: "order",
    entity_id: "SN-482109",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "notif-init-2",
    recipient_id: "seller-1",
    recipient_type: "seller",
    type: "upgrade.approved",
    title: "🚀 Pro Plan Active",
    message: "Your subscription upgrade to Pro was verified. Unlimited products unlocked.",
    link: "/dashboard/billing",
    entity_type: "subscription",
    entity_id: "pro",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "notif-admin-1",
    recipient_id: "admin",
    recipient_type: "admin",
    type: "seller.registered",
    title: "New Seller Registration",
    message: "Zoya Khan registered Bloom & Petal Florals (@bloomandpetal).",
    link: "/admin/sellers",
    entity_type: "seller",
    entity_id: "seller-5",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

let memoryPreferences: Record<string, NotificationPreferences> = {};

function getLocalNotifications(): AppNotification[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return memoryNotifications;
}

function saveLocalNotifications(notifications: AppNotification[]) {
  memoryNotifications = notifications;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(notifications.slice(0, 200)));
    } catch {}
  }
}

// ------------------------------------------------------------------------------
// 1. IN-APP NOTIFICATION CORE
// ------------------------------------------------------------------------------

export async function createNotification(input: {
  recipient_id: string;
  recipient_type: NotificationRecipientType;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  entity_type?: "order" | "product" | "subscription" | "store" | "seller" | "system";
  entity_id?: string;
  idempotency_key?: string;
  metadata?: Record<string, any>;
}): Promise<AppNotification> {
  const notifId = "notif-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  const now = new Date().toISOString();

  // Check idempotency in memory
  if (input.idempotency_key) {
    const existing = memoryNotifications.find((n) => n.idempotency_key === input.idempotency_key);
    if (existing) {
      return existing;
    }
  }

  const newNotif: AppNotification = {
    id: notifId,
    recipient_id: input.recipient_id,
    recipient_type: input.recipient_type,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    is_read: false,
    idempotency_key: input.idempotency_key,
    metadata: input.metadata,
    created_at: now,
  };

  // Add to local list
  const current = getLocalNotifications();
  current.unshift(newNotif);
  saveLocalNotifications(current);

  if (!isSupabaseConfigured()) {
    return newNotif;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        recipient_id: input.recipient_id,
        recipient_type: input.recipient_type,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link || null,
        entity_type: input.entity_type || null,
        entity_id: input.entity_id || null,
        is_read: false,
        idempotency_key: input.idempotency_key || null,
        metadata: input.metadata || {},
        created_at: now,
      })
      .select()
      .single();

    if (error || !data) {
      return newNotif;
    }

    return data as AppNotification;
  } catch (err) {
    console.warn("Notification Supabase insert warning:", err);
    return newNotif;
  }
}

export async function getNotificationsForUser(
  recipientId: string,
  recipientType: NotificationRecipientType = "seller"
): Promise<AppNotification[]> {
  if (!isSupabaseConfigured()) {
    const all = getLocalNotifications();
    return all.filter((n) => {
      if (recipientType === "admin") {
        return n.recipient_type === "admin";
      }
      return n.recipient_id === recipientId || n.recipient_type === recipientType;
    });
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (recipientType === "admin") {
      query = query.eq("recipient_type", "admin");
    } else {
      query = query.eq("recipient_id", recipientId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      const all = getLocalNotifications();
      return all.filter((n) => {
        if (recipientType === "admin") return n.recipient_type === "admin";
        return n.recipient_id === recipientId || n.recipient_type === recipientType;
      });
    }

    return data as AppNotification[];
  } catch {
    const all = getLocalNotifications();
    return all.filter((n) => {
      if (recipientType === "admin") return n.recipient_type === "admin";
      return n.recipient_id === recipientId || n.recipient_type === recipientType;
    });
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const all = getLocalNotifications();
  const idx = all.findIndex((n) => n.id === notificationId);
  const now = new Date().toISOString();

  if (idx !== -1) {
    all[idx].is_read = true;
    all[idx].read_at = now;
    saveLocalNotifications(all);
  }

  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true, read_at: now })
      .eq("id", notificationId);
  } catch (err) {
    console.warn("Mark read Supabase warning:", err);
  }
}

export async function markAllNotificationsAsRead(
  recipientId: string,
  recipientType: NotificationRecipientType = "seller"
): Promise<void> {
  const all = getLocalNotifications();
  const now = new Date().toISOString();

  all.forEach((n) => {
    if (recipientType === "admin" && n.recipient_type === "admin") {
      n.is_read = true;
      n.read_at = now;
    } else if (n.recipient_id === recipientId) {
      n.is_read = true;
      n.read_at = now;
    }
  });
  saveLocalNotifications(all);

  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createClient();
    let query = supabase.from("notifications").update({ is_read: true, read_at: now });

    if (recipientType === "admin") {
      query = query.eq("recipient_type", "admin");
    } else {
      query = query.eq("recipient_id", recipientId);
    }
    await query;
  } catch (err) {
    console.warn("Mark all read Supabase warning:", err);
  }
}

// ------------------------------------------------------------------------------
// 2. NOTIFICATION PREFERENCES
// ------------------------------------------------------------------------------

export async function getSellerNotificationPreferences(sellerId: string): Promise<NotificationPreferences> {
  const defaultPrefs: NotificationPreferences = {
    seller_id: sellerId,
    email_new_orders: true,
    email_order_status: true,
    email_stock_alerts: true,
    email_subscription: true,
    in_app_notifications: true,
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    return memoryPreferences[sellerId] || defaultPrefs;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (error || !data) {
      return memoryPreferences[sellerId] || defaultPrefs;
    }

    return data as NotificationPreferences;
  } catch {
    return memoryPreferences[sellerId] || defaultPrefs;
  }
}

export async function updateSellerNotificationPreferences(
  sellerId: string,
  updates: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const current = await getSellerNotificationPreferences(sellerId);
  const updated: NotificationPreferences = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  memoryPreferences[sellerId] = updated;

  if (!isSupabaseConfigured()) {
    return updated;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          seller_id: sellerId,
          email_new_orders: updated.email_new_orders,
          email_order_status: updated.email_order_status,
          email_stock_alerts: updated.email_stock_alerts,
          email_subscription: updated.email_subscription,
          in_app_notifications: updated.in_app_notifications,
          updated_at: updated.updated_at,
        },
        { onConflict: "seller_id" }
      )
      .select()
      .single();

    if (error || !data) {
      return updated;
    }

    return data as NotificationPreferences;
  } catch {
    return updated;
  }
}

// ------------------------------------------------------------------------------
// 3. APPLICATION EVENT DISPATCHERS (IN-APP + EMAIL COORDINATION)
// ------------------------------------------------------------------------------

/**
 * Event: New Customer Order Placed
 * 1. Creates Seller In-App Notification.
 * 2. Sends Seller Email (if seller preference email_new_orders = true).
 * 3. Sends Customer Confirmation Email (if customer email provided).
 */
export async function notifyNewOrder(params: {
  sellerId: string;
  sellerEmail?: string;
  sellerName?: string;
  storeName: string;
  orderCode: string;
  totalAmount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: Array<{ product_name: string; quantity: number; unit_price: number }>;
}) {
  const idempotencyBase = `order-created-${params.orderCode}`;

  // 1. Seller in-app notification
  await createNotification({
    recipient_id: params.sellerId,
    recipient_type: "seller",
    type: "order.created",
    title: `🎉 New Customer Order (#${params.orderCode})`,
    message: `${params.customerName} ordered ${params.items.length} item(s) totaling ₹${params.totalAmount.toLocaleString("en-IN")}.`,
    link: "/dashboard/orders",
    entity_type: "order",
    entity_id: params.orderCode,
    idempotency_key: `notif-${idempotencyBase}`,
  });

  // 2. Seller email notification (if enabled in preferences)
  if (params.sellerEmail) {
    const prefs = await getSellerNotificationPreferences(params.sellerId);
    if (prefs.email_new_orders) {
      const emailContent = renderNewOrderSellerEmail({
        sellerName: params.sellerName || "Seller",
        storeName: params.storeName,
        orderCode: params.orderCode,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        deliveryAddress: params.deliveryAddress,
        totalAmount: params.totalAmount,
        items: params.items,
      });

      await sendTransactionalEmail({
        to: params.sellerEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        templateType: "new_order_seller",
        eventType: "order.created",
        recipientType: "seller",
        idempotencyKey: `email-seller-${idempotencyBase}`,
        metadata: { orderCode: params.orderCode, storeName: params.storeName },
      });
    }
  }

  // 3. Customer order confirmation email
  if (params.customerEmail && params.customerEmail.includes("@")) {
    const customerEmailContent = renderOrderConfirmationCustomerEmail({
      customerName: params.customerName,
      storeName: params.storeName,
      orderCode: params.orderCode,
      totalAmount: params.totalAmount,
      items: params.items,
    });

    await sendTransactionalEmail({
      to: params.customerEmail,
      subject: customerEmailContent.subject,
      html: customerEmailContent.html,
      templateType: "order_confirmation_customer",
      eventType: "order.created",
      recipientType: "customer",
      idempotencyKey: `email-customer-${idempotencyBase}`,
      metadata: { orderCode: params.orderCode, storeName: params.storeName },
    });
  }
}

/**
 * Event: Order Status Changed / Payment Verified
 * 1. Creates Seller In-App Notification (for cancellations or payment verified).
 * 2. Sends Customer Status Email (if customer email provided).
 */
export async function notifyOrderStatusChanged(params: {
  sellerId: string;
  storeName: string;
  orderCode: string;
  customerName: string;
  customerEmail?: string;
  oldStatus?: string;
  newStatus: string;
  totalAmount?: number;
}) {
  const idempotencyBase = `order-status-${params.orderCode}-${params.newStatus}`;

  // Seller notification for important changes (e.g. cancellation)
  if (params.newStatus === "cancelled") {
    await createNotification({
      recipient_id: params.sellerId,
      recipient_type: "seller",
      type: "order.cancelled",
      title: `Order Cancelled (#${params.orderCode})`,
      message: `Order #${params.orderCode} from ${params.customerName} has been marked as cancelled.`,
      link: "/dashboard/orders",
      entity_type: "order",
      entity_id: params.orderCode,
      idempotency_key: `notif-${idempotencyBase}`,
    });
  }

  // Customer status email
  if (params.customerEmail && params.customerEmail.includes("@")) {
    const emailContent = renderOrderStatusUpdateCustomerEmail({
      customerName: params.customerName,
      storeName: params.storeName,
      orderCode: params.orderCode,
      newStatus: params.newStatus,
    });

    await sendTransactionalEmail({
      to: params.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      templateType: "order_status_update_customer",
      eventType: "order.status_changed",
      recipientType: "customer",
      idempotencyKey: `email-customer-${idempotencyBase}`,
      metadata: { orderCode: params.orderCode, newStatus: params.newStatus },
    });
  }
}

/**
 * Event: Online / Order Payment Verified
 */
export async function notifyPaymentVerified(params: {
  sellerId: string;
  storeName: string;
  orderCode: string;
  customerName: string;
  customerEmail?: string;
  amountPaid: number;
}) {
  const idempotencyBase = `payment-verified-${params.orderCode}`;

  await createNotification({
    recipient_id: params.sellerId,
    recipient_type: "seller",
    type: "payment.verified",
    title: `Payment Verified (Order #${params.orderCode})`,
    message: `Payment of ₹${params.amountPaid.toLocaleString("en-IN")} from ${params.customerName} has been cleared.`,
    link: "/dashboard/orders",
    entity_type: "order",
    entity_id: params.orderCode,
    idempotency_key: `notif-${idempotencyBase}`,
  });

  if (params.customerEmail && params.customerEmail.includes("@")) {
    const emailContent = renderPaymentConfirmationCustomerEmail({
      customerName: params.customerName,
      storeName: params.storeName,
      orderCode: params.orderCode,
      amountPaid: params.amountPaid,
    });

    await sendTransactionalEmail({
      to: params.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      templateType: "payment_confirmation_customer",
      eventType: "payment.verified",
      recipientType: "customer",
      idempotencyKey: `email-customer-${idempotencyBase}`,
      metadata: { orderCode: params.orderCode },
    });
  }
}

/**
 * Event: Upgrade Request Submitted
 * 1. Admin In-App Notification.
 * 2. Seller In-App Notification.
 * 3. Seller Confirmation Email.
 */
export async function notifyUpgradeSubmitted(params: {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  storeName: string;
  planName: string;
  requestNumber: string;
  amount: number;
}) {
  const idempotencyBase = `upgrade-submitted-${params.requestNumber}`;

  // 1. Admin in-app notification
  await createNotification({
    recipient_id: "admin",
    recipient_type: "admin",
    type: "upgrade.submitted",
    title: `New Upgrade Request: ${params.planName} Plan`,
    message: `${params.sellerName} (${params.storeName}) submitted manual payment verification for ${params.planName} (₹${params.amount}).`,
    link: "/admin/subscriptions",
    entity_type: "subscription",
    entity_id: params.requestNumber,
    idempotency_key: `admin-notif-${idempotencyBase}`,
  });

  // 2. Seller in-app notification
  await createNotification({
    recipient_id: params.sellerId,
    recipient_type: "seller",
    type: "upgrade.submitted",
    title: `Upgrade Request Submitted (${params.planName})`,
    message: `Your upgrade request #${params.requestNumber} is pending review. Turnaround is within 24 hours.`,
    link: "/dashboard/billing",
    entity_type: "subscription",
    entity_id: params.requestNumber,
    idempotency_key: `seller-notif-${idempotencyBase}`,
  });

  // 3. Seller confirmation email
  if (params.sellerEmail) {
    const emailContent = renderUpgradeRequestReceivedEmail({
      sellerName: params.sellerName,
      storeName: params.storeName,
      planName: params.planName,
      requestNumber: params.requestNumber,
      amount: params.amount,
    });

    await sendTransactionalEmail({
      to: params.sellerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      templateType: "upgrade_request_received",
      eventType: "upgrade.submitted",
      recipientType: "seller",
      idempotencyKey: `email-seller-${idempotencyBase}`,
      metadata: { requestNumber: params.requestNumber, planName: params.planName },
    });
  }
}

/**
 * Event: Upgrade Request Approved or Rejected
 */
export async function notifyUpgradeReviewed(params: {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  storeName: string;
  planName: string;
  action: "approved" | "rejected";
  invoiceNumber?: string;
  amount?: number;
  rejectionReason?: string;
}) {
  const idempotencyBase = `upgrade-reviewed-${params.sellerId}-${params.planName}-${params.action}-${Date.now()}`;

  if (params.action === "approved") {
    // In-app notification
    await createNotification({
      recipient_id: params.sellerId,
      recipient_type: "seller",
      type: "upgrade.approved",
      title: `🚀 ${params.planName} Plan Activated!`,
      message: `Your payment was verified. Your storefront ${params.storeName} is now on the ${params.planName} plan.`,
      link: "/dashboard/billing",
      entity_type: "subscription",
      entity_id: params.planName,
      idempotency_key: `notif-${idempotencyBase}`,
    });

    // Email
    if (params.sellerEmail) {
      const emailContent = renderUpgradeApprovedEmail({
        sellerName: params.sellerName,
        storeName: params.storeName,
        planName: params.planName,
        invoiceNumber: params.invoiceNumber || `INV-${new Date().getFullYear()}-001`,
        amount: params.amount || (params.planName.toLowerCase() === "pro" ? 199 : 99),
      });

      await sendTransactionalEmail({
        to: params.sellerEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        templateType: "upgrade_approved",
        eventType: "upgrade.approved",
        recipientType: "seller",
        idempotencyKey: `email-${idempotencyBase}`,
      });
    }
  } else {
    // In-app notification
    await createNotification({
      recipient_id: params.sellerId,
      recipient_type: "seller",
      type: "upgrade.rejected",
      title: `Upgrade Verification Notice`,
      message: `Your upgrade request for ${params.planName} could not be verified: ${params.rejectionReason || "Reference mismatch"}.`,
      link: "/dashboard/billing",
      entity_type: "subscription",
      entity_id: params.planName,
      idempotency_key: `notif-${idempotencyBase}`,
    });

    // Email
    if (params.sellerEmail) {
      const emailContent = renderUpgradeRejectedEmail({
        sellerName: params.sellerName,
        storeName: params.storeName,
        planName: params.planName,
        rejectionReason: params.rejectionReason || "We were unable to verify the transaction reference against bank records.",
      });

      await sendTransactionalEmail({
        to: params.sellerEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        templateType: "upgrade_rejected",
        eventType: "upgrade.rejected",
        recipientType: "seller",
        idempotencyKey: `email-${idempotencyBase}`,
      });
    }
  }
}

/**
 * Event: Product Reaches 0 Stock / Out of Stock
 */
export async function notifyProductOutOfStock(params: {
  sellerId: string;
  productName: string;
  productId: string;
}) {
  const idempotencyBase = `stock-zero-${params.productId}-${new Date().toISOString().slice(0, 10)}`;

  await createNotification({
    recipient_id: params.sellerId,
    recipient_type: "seller",
    type: "product.out_of_stock",
    title: `⚠️ Product Out of Stock`,
    message: `"${params.productName}" has reached zero inventory and will show as out of stock to customers.`,
    link: "/dashboard/products",
    entity_type: "product",
    entity_id: params.productId,
    idempotency_key: `notif-${idempotencyBase}`,
  });
}

/**
 * Event: New Seller Registered
 */
export async function notifyNewSellerRegistered(params: {
  sellerName: string;
  sellerEmail: string;
  username: string;
  storeName: string;
  sellerId: string;
}) {
  const idempotencyBase = `seller-registered-${params.sellerId}`;

  // Admin Notification
  await createNotification({
    recipient_id: "admin",
    recipient_type: "admin",
    type: "seller.registered",
    title: `New Seller Registered: ${params.sellerName}`,
    message: `${params.sellerName} registered @${params.username} with store "${params.storeName}".`,
    link: "/admin/sellers",
    entity_type: "seller",
    entity_id: params.sellerId,
    idempotency_key: `admin-${idempotencyBase}`,
  });

  // Welcome email to seller
  if (params.sellerEmail && params.sellerEmail.includes("@")) {
    const emailContent = renderWelcomeSellerEmail({
      sellerName: params.sellerName,
      storeName: params.storeName,
      storeSlug: params.username,
    });

    await sendTransactionalEmail({
      to: params.sellerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      templateType: "welcome_seller",
      eventType: "seller.registered",
      recipientType: "seller",
      idempotencyKey: `email-${idempotencyBase}`,
    });
  }
}

