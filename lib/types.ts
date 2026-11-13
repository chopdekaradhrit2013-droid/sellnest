export type StoreTheme =
  | "minimal"
  | "modern"
  | "boutique"
  | "playful"
  | "lavender"
  | "ivory"
  | "charcoal"
  | "sage";

export type StoreFont = "sans" | "serif" | "display" | "playful";

export interface StoreSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

export interface StoreCustomization {
  name: string;
  description?: string;
  business_category?: string;
  theme: StoreTheme;
  accent_color: string;
  secondary_color?: string;
  font_family: StoreFont;
  logo_url?: string;
  banner_url?: string;
  announcement?: string;
  whatsapp_number?: string;
  email?: string;
  phone?: string;
  social_links?: StoreSocialLinks;
  is_published?: boolean;
}

export interface Store {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description?: string;
  business_category?: string;
  logo_url?: string;
  banner_url?: string;
  email?: string;
  phone?: string;
  whatsapp_number?: string;
  theme: StoreTheme;
  accent_color: string;
  secondary_color?: string;
  font_family?: StoreFont;
  announcement?: string;
  social_links?: StoreSocialLinks;
  currency: string;
  is_published: boolean;
  plan_id?: "free" | "starter" | "pro";
  draft_settings?: StoreCustomization | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  images?: string[];
  stock_quantity: number;
  is_active: boolean;
  is_eggless?: boolean;
  prep_time?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_id?: string;
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
  status: OrderStatus;
  notes?: string;
  order_number: number;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerCheckoutData {
  full_name: string;
  phone: string;
  email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface Customer {
  id: string;
  store_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  last_order_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrdersCount: number;
  revenueChangePercent?: number;
  ordersChangePercent?: number;
}

export interface AdminAuditLog {
  id: string;
  admin_email: string;
  admin_id?: string;
  action: string;
  target_type: "seller" | "store" | "upgrade_request" | "subscription" | "settings";
  target_id: string;
  target_name?: string;
  reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SellerAdminView {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  is_admin: boolean;
  is_suspended: boolean;
  suspended_reason?: string;
  suspended_at?: string;
  stores_count: number;
  products_count: number;
  orders_count: number;
  total_revenue: number;
  subscription_plan: "free" | "starter" | "pro";
  subscription_status: string;
  store?: {
    id: string;
    name: string;
    slug: string;
    is_published: boolean;
    is_suspended: boolean;
  };
  created_at: string;
}

export interface StoreAdminView {
  id: string;
  seller_id: string;
  seller_name: string;
  seller_email: string;
  name: string;
  slug: string;
  description?: string;
  theme: string;
  is_published: boolean;
  is_suspended: boolean;
  suspension_reason?: string;
  moderation_note?: string;
  products_count: number;
  orders_count: number;
  total_revenue: number;
  plan_id: "free" | "starter" | "pro";
  created_at: string;
  updated_at: string;
}

export interface PlatformSettings {
  id: string;
  platform_name: string;
  support_email: string;
  processing_promise_hours: number;
  maintenance_mode: boolean;
  plan_pricing: {
    free: number;
    starter: number;
    pro: number;
  };
  plan_limits: {
    free: number;
    starter: number;
    pro: number | null;
  };
  payment_instructions: string[];
  updated_at: string;
  updated_by?: string;
}

export interface AdminOverviewStats {
  totalSellers: number;
  totalActiveStores: number;
  totalProducts: number;
  totalOrders: number;
  totalVerifiedRevenue: number;
  pendingUpgradeRequests: number;
  newRegistrations30d: number;
  activeStarterSubscribers: number;
  activeProSubscribers: number;
  freeSubscribers: number;
  conversionRate: number;
}

export type { SubscriptionUpgradeRequest, UpgradeRequestStatus } from "./plans";


// ==============================================================================
// PHASE 09: NOTIFICATIONS & EMAIL TYPES
// ==============================================================================

export type NotificationRecipientType = "seller" | "admin" | "customer";

export type NotificationType =
  | "order.created"
  | "order.cancelled"
  | "order.status_changed"
  | "payment.verified"
  | "upgrade.submitted"
  | "upgrade.approved"
  | "upgrade.rejected"
  | "subscription.expiring"
  | "subscription.expired"
  | "product.out_of_stock"
  | "seller.registered"
  | "platform.alert";

export interface AppNotification {
  id: string;
  recipient_id: string;
  recipient_type: NotificationRecipientType;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  entity_type?: "order" | "product" | "subscription" | "store" | "seller" | "system";
  entity_id?: string;
  is_read: boolean;
  read_at?: string;
  idempotency_key?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface NotificationPreferences {
  seller_id: string;
  email_new_orders: boolean;
  email_order_status: boolean;
  email_stock_alerts: boolean;
  email_subscription: boolean;
  in_app_notifications: boolean;
  updated_at?: string;
}

export type EmailTemplateType =
  | "welcome_seller"
  | "new_order_seller"
  | "order_confirmation_customer"
  | "order_status_update_customer"
  | "payment_confirmation_customer"
  | "upgrade_request_received"
  | "upgrade_approved"
  | "upgrade_rejected"
  | "subscription_expiring";

export interface EmailDeliveryLog {
  id: string;
  recipient_email: string;
  recipient_type: "seller" | "customer" | "admin";
  template_type: EmailTemplateType | string;
  event_type: string;
  subject: string;
  provider: "resend" | "simulated";
  status: "sent" | "failed" | "simulated_dev" | "skipped_missing_credentials";
  provider_message_id?: string;
  error_details?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
