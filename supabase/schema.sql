-- ==============================================================================
-- SellNest Database Schema & Authentication Configuration
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

create extension if not exists "uuid-ossp";

-- 1. Create profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  username text not null,
  email text not null,
  avatar_url text,
  is_admin boolean default false not null,
  is_suspended boolean default false not null,
  suspended_reason text,
  suspended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint username_format check (username ~ '^[a-z0-9_-]+$')
);

create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username));
create unique index if not exists profiles_email_unique_idx on public.profiles (lower(email));

-- 2. Create stores table with draft settings and appearance fields
create table if not exists public.stores (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text not null,
  description text,
  business_category text default 'General',
  logo_url text,
  banner_url text,
  email text,
  phone text,
  whatsapp_number text,
  theme text default 'modern' not null,
  accent_color text default '#7C3AED' not null,
  secondary_color text default '#4F46E5' not null,
  font_family text default 'sans' not null,
  announcement text default 'Welcome to our store! Fast delivery across India.' not null,
  social_links jsonb default '{"instagram": "", "facebook": "", "website": ""}'::jsonb not null,
  draft_settings jsonb default null,
  currency text default 'INR' not null,
  is_published boolean default true not null,
  is_suspended boolean default false not null,
  suspension_reason text,
  moderation_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint store_slug_format check (slug ~ '^[a-z0-9_-]+$')
);

create unique index if not exists stores_slug_unique_idx on public.stores (lower(slug));
create index if not exists stores_seller_id_idx on public.stores (seller_id);

-- 3. Create products table with multi-image gallery support
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text default 'General' not null,
  image_url text,
  images jsonb default '[]'::jsonb not null,
  stock_quantity integer default 0 not null check (stock_quantity >= 0),
  is_active boolean default true not null,
  is_eggless boolean default false not null,
  prep_time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists products_store_id_idx on public.products (store_id);

-- 4. Create customers table
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  address text,
  total_orders integer default 0 not null check (total_orders >= 0),
  total_spent numeric(10, 2) default 0.00 not null check (total_spent >= 0),
  last_order_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists customers_store_id_idx on public.customers (store_id);

-- 5. Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete set null,
  order_code text unique,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  delivery_address text,
  city text,
  state text,
  pincode text,
  subtotal_amount numeric(10, 2) default 0,
  delivery_fee numeric(10, 2) default 0,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text default 'pending' not null check (status in ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  notes text,
  order_number serial,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists orders_store_id_idx on public.orders (store_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_order_code_idx on public.orders (order_code);
create index if not exists orders_customer_phone_idx on public.orders (customer_phone);

-- Migration helpers if updating existing database:
-- alter table public.orders drop constraint if exists orders_status_check;
-- alter table public.orders add constraint orders_status_check check (status in ('pending', 'confirmed', 'processing', 'completed', 'cancelled'));
-- alter table public.orders add column if not exists order_code text unique;
-- alter table public.orders add column if not exists city text;
-- alter table public.orders add column if not exists state text;
-- alter table public.orders add column if not exists pincode text;
-- alter table public.orders add column if not exists subtotal_amount numeric(10, 2) default 0;
-- alter table public.orders add column if not exists delivery_fee numeric(10, 2) default 0;

-- 6. Create order_items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer default 1 not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- 7. Create subscriptions table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  seller_id uuid references auth.users(id) on delete cascade not null,
  plan_id text default 'free' not null check (plan_id in ('free', 'starter', 'pro')),
  status text default 'active' not null check (status in ('active', 'past_due', 'cancelled', 'trialing')),
  billing_cycle text default 'monthly' not null check (billing_cycle in ('monthly', 'yearly')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '30 days'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_store_subscription unique (store_id)
);

create index if not exists subscriptions_store_id_idx on public.subscriptions (store_id);
create index if not exists subscriptions_seller_id_idx on public.subscriptions (seller_id);
create index if not exists subscriptions_plan_id_idx on public.subscriptions (plan_id);

-- 8. Create billing_invoices table
create table if not exists public.billing_invoices (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  store_id uuid references public.stores(id) on delete cascade not null,
  seller_id uuid references auth.users(id) on delete cascade not null,
  invoice_number text not null,
  plan_id text not null check (plan_id in ('free', 'starter', 'pro')),
  amount numeric(10, 2) not null check (amount >= 0),
  currency text default 'INR' not null,
  status text default 'paid' not null check (status in ('paid', 'pending', 'refunded', 'failed')),
  payment_method text default 'simulated' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists billing_invoices_store_id_idx on public.billing_invoices (store_id);
create index if not exists billing_invoices_seller_id_idx on public.billing_invoices (seller_id);

-- 9. Create subscription_upgrade_requests table for manual verification workflow
create table if not exists public.subscription_upgrade_requests (
  id uuid default gen_random_uuid() primary key,
  request_number text unique not null,
  store_id uuid references public.stores(id) on delete cascade not null,
  store_name text,
  seller_id uuid references auth.users(id) on delete cascade not null,
  seller_name text not null,
  seller_email text not null,
  current_plan_id text not null check (current_plan_id in ('free', 'starter', 'pro')),
  target_plan_id text not null check (target_plan_id in ('starter', 'pro')),
  amount numeric(10, 2) not null check (amount >= 0),
  currency text default 'INR' not null,
  payment_method text not null,
  transaction_reference text not null,
  payment_date date not null,
  payment_proof_url text,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by text,
  reviewed_at timestamp with time zone,
  activated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists upgrade_requests_store_id_idx on public.subscription_upgrade_requests (store_id);
create index if not exists upgrade_requests_seller_id_idx on public.subscription_upgrade_requests (seller_id);
create index if not exists upgrade_requests_status_idx on public.subscription_upgrade_requests (status);
create index if not exists upgrade_requests_ref_idx on public.subscription_upgrade_requests (request_number);

-- 10. Create admin_audit_logs table
create table if not exists public.admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_email text not null,
  admin_id text,
  action text not null,
  target_type text not null,
  target_id text not null,
  target_name text,
  reason text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);
create index if not exists audit_logs_action_idx on public.admin_audit_logs (action);
create index if not exists audit_logs_target_type_idx on public.admin_audit_logs (target_type);

-- 11. Create platform_settings table
create table if not exists public.platform_settings (
  id text primary key default 'default',
  platform_name text default 'SellNest' not null,
  support_email text default 'chopdekaradhrit2013@gmail.com' not null,
  processing_promise_hours integer default 24 not null,
  maintenance_mode boolean default false not null,
  plan_pricing jsonb default '{"free": 0, "starter": 99, "pro": 199}'::jsonb not null,
  plan_limits jsonb default '{"free": 10, "starter": 100, "pro": null}'::jsonb not null,
  payment_instructions jsonb default '["Open your preferred UPI app or Net Banking", "Transfer the exact plan amount to the official SellNest account", "Submit your 12-digit UTR reference number for manual verification"]'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by text
);

-- ==============================================================================
-- Row Level Security (RLS) Setup
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles Policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Stores Policies
-- Public can view published stores, or sellers can view their own unpublished store
drop policy if exists "Public stores are viewable by everyone" on public.stores;
create policy "Public stores are viewable by everyone" on public.stores
  for select using (is_published = true or auth.uid() = seller_id);

drop policy if exists "Sellers can create their own stores" on public.stores;
create policy "Sellers can create their own stores" on public.stores
  for insert with check (auth.uid() = seller_id);

drop policy if exists "Sellers can update their own stores" on public.stores;
create policy "Sellers can update their own stores" on public.stores
  for update using (auth.uid() = seller_id);

drop policy if exists "Sellers can delete their own stores" on public.stores;
create policy "Sellers can delete their own stores" on public.stores
  for delete using (auth.uid() = seller_id);

-- Products Policies
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products" on public.products
  for select using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and (stores.is_published = true or stores.seller_id = auth.uid())
    )
  );

drop policy if exists "Sellers can add products to their stores" on public.products;
create policy "Sellers can add products to their stores" on public.products
  for insert with check (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Sellers can update their products" on public.products;
create policy "Sellers can update their products" on public.products
  for update using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Sellers can delete their products" on public.products;
create policy "Sellers can delete their products" on public.products
  for delete using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.seller_id = auth.uid()
    )
  );

-- Customers Policies (seller-isolated)
drop policy if exists "Sellers can view their store customers" on public.customers;
create policy "Sellers can view their store customers" on public.customers
  for select using (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Sellers can manage their store customers" on public.customers;
create policy "Sellers can manage their store customers" on public.customers
  for all using (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
      and stores.seller_id = auth.uid()
    )
  );

-- Orders Policies
drop policy if exists "Sellers can view their store orders" on public.orders;
create policy "Sellers can view their store orders" on public.orders
  for select using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Sellers can update their store orders" on public.orders;
create policy "Sellers can update their store orders" on public.orders
  for update using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Allow order creation" on public.orders;
create policy "Allow order creation" on public.orders
  for insert with check (true);

-- Order Items Policies
drop policy if exists "Sellers can view their store order items" on public.order_items;
create policy "Sellers can view their store order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      join public.stores on stores.id = orders.store_id
      where orders.id = order_items.order_id
      and stores.seller_id = auth.uid()
    )
  );

drop policy if exists "Allow order items creation" on public.order_items;
create policy "Allow order items creation" on public.order_items
  for insert with check (true);

-- Subscriptions Policies
alter table public.subscriptions enable row level security;

drop policy if exists "Sellers can view their own subscriptions" on public.subscriptions;
create policy "Sellers can view their own subscriptions" on public.subscriptions
  for select using (auth.uid() = seller_id);

drop policy if exists "Sellers can update their own subscriptions" on public.subscriptions;
create policy "Sellers can update their own subscriptions" on public.subscriptions
  for update using (auth.uid() = seller_id);

drop policy if exists "Sellers can insert their own subscription" on public.subscriptions;
create policy "Sellers can insert their own subscription" on public.subscriptions
  for insert with check (auth.uid() = seller_id);

-- Billing Invoices Policies
alter table public.billing_invoices enable row level security;

drop policy if exists "Sellers can view their own billing invoices" on public.billing_invoices;
create policy "Sellers can view their own billing invoices" on public.billing_invoices
  for select using (auth.uid() = seller_id);

drop policy if exists "Sellers can insert their own billing invoices" on public.billing_invoices;
create policy "Sellers can insert their own billing invoices" on public.billing_invoices
  for insert with check (auth.uid() = seller_id);

-- Subscription Upgrade Requests Policies
alter table public.subscription_upgrade_requests enable row level security;

drop policy if exists "Sellers can view their own upgrade requests" on public.subscription_upgrade_requests;
create policy "Sellers can view their own upgrade requests" on public.subscription_upgrade_requests
  for select using (auth.uid() = seller_id or auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

drop policy if exists "Sellers can insert pending upgrade requests" on public.subscription_upgrade_requests;
create policy "Sellers can insert pending upgrade requests" on public.subscription_upgrade_requests
  for insert with check (auth.uid() = seller_id and status = 'pending');

-- Only admins can update upgrade requests (e.g. to approve or reject)
drop policy if exists "Admins can update upgrade requests" on public.subscription_upgrade_requests;
create policy "Admins can update upgrade requests" on public.subscription_upgrade_requests
  for update using (auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

-- Admin Audit Logs Policies
alter table public.admin_audit_logs enable row level security;

drop policy if exists "Only admins can view audit logs" on public.admin_audit_logs;
create policy "Only admins can view audit logs" on public.admin_audit_logs
  for select using (auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

drop policy if exists "Only admins can insert audit logs" on public.admin_audit_logs;
create policy "Only admins can insert audit logs" on public.admin_audit_logs
  for insert with check (auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

-- Platform Settings Policies
alter table public.platform_settings enable row level security;

drop policy if exists "Platform settings viewable by everyone" on public.platform_settings;
create policy "Platform settings viewable by everyone" on public.platform_settings
  for select using (true);

drop policy if exists "Only admins can update platform settings" on public.platform_settings;
create policy "Only admins can update platform settings" on public.platform_settings
  for update using (auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

-- Backfill Migration Helper: Ensure existing stores safely receive Free plan
-- insert into public.subscriptions (store_id, seller_id, plan_id, status)
-- select s.id, s.seller_id, 'free', 'active'
-- from public.stores s
-- left join public.subscriptions sub on sub.store_id = s.id
-- where sub.id is null
-- on conflict (store_id) do nothing;

-- ==============================================================================
-- Triggers and Functions
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_username text;
  v_fullname text;
  v_slug text;
  v_category text;
begin
  v_username := lower(coalesce(new.raw_user_meta_data->>'username', ''));
  if v_username = '' or length(v_username) < 3 then
    v_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_-]', '', 'g'));
    if length(v_username) < 3 then
      v_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
    end if;
  end if;

  -- Ensure username is unique in profiles
  if exists (select 1 from public.profiles where lower(username) = v_username and id <> new.id) then
    v_username := substr(v_username, 1, 20) || '_' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;

  v_fullname := coalesce(new.raw_user_meta_data->>'full_name', v_username, 'My Store');
  v_category := coalesce(new.raw_user_meta_data->>'business_category', 'Handcrafted & Artisanal Goods');

  insert into public.profiles (id, full_name, username, email, avatar_url, is_admin, created_at, updated_at)
  values (
    new.id,
    v_fullname,
    v_username,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    (lower(trim(new.email)) = 'chopdekaradhrit2013@gmail.com'),
    now(),
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    username = excluded.username,
    email = excluded.email,
    is_admin = (lower(trim(excluded.email)) = 'chopdekaradhrit2013@gmail.com' or public.profiles.is_admin),
    updated_at = now();

  v_slug := v_username;
  if exists (select 1 from public.stores where lower(slug) = v_slug and seller_id <> new.id) then
    v_slug := substr(v_slug, 1, 20) || '-' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;

  if v_slug <> '' then
    insert into public.stores (seller_id, name, slug, description, business_category, email, whatsapp_number, theme, accent_color, secondary_color, font_family, is_published)
    values (
      new.id,
      v_fullname,
      v_slug,
      'Welcome to ' || v_fullname || ' on SellNest. Browse our ' || lower(v_category) || ' and order directly via WhatsApp.',
      v_category,
      new.email,
      coalesce(new.raw_user_meta_data->>'whatsapp_number', ''),
      'modern',
      '#7C3AED',
      '#4F46E5',
      'sans',
      true
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-confirm all users immediately on signup (bypasses manual email confirmation)
create or replace function public.auto_confirm_user()
returns trigger as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_auto_confirm on auth.users;
create trigger on_auth_user_auto_confirm
  before insert on auth.users
  for each row execute procedure public.auto_confirm_user();

-- Confirm all existing unconfirmed accounts
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;

-- Ensure platform administrator chopdekaradhrit2013@gmail.com always has is_admin privileges
update public.profiles set is_admin = true where lower(trim(email)) = 'chopdekaradhrit2013@gmail.com';

create or replace function public.get_email_by_username(p_username text)
returns text as $$
declare
  v_email text;
begin
  select email into v_email
  from public.profiles
  where lower(username) = lower(trim(p_username))
  limit 1;
  return v_email;
end;
$$ language plpgsql security definer;

create or replace function public.check_username_available(p_username text)
returns boolean as $$
begin
  return not exists (
    select 1
    from public.profiles
    where lower(username) = lower(trim(p_username))
  );
end;
$$ language plpgsql security definer;

create or replace function public.check_store_slug_available(p_slug text, p_store_id uuid default null)
returns boolean as $$
begin
  return not exists (
    select 1
    from public.stores
    where lower(slug) = lower(trim(p_slug))
    and (p_store_id is null or id <> p_store_id)
  );
end;
$$ language plpgsql security definer;


-- ==============================================================================
-- PHASE 09: NOTIFICATIONS, PREFERENCES & EMAIL DELIVERY LOGS
-- ==============================================================================

-- 1. Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  recipient_id text not null,
  recipient_type text default 'seller' not null check (recipient_type in ('seller', 'admin', 'customer')),
  type text not null,
  title text not null,
  message text not null,
  link text,
  entity_type text,
  entity_id text,
  is_read boolean default false not null,
  read_at timestamp with time zone,
  idempotency_key text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists notifications_recipient_idx on public.notifications (recipient_id, recipient_type, is_read);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);
create unique index if not exists notifications_idempotency_idx on public.notifications (idempotency_key) where idempotency_key is not null;

-- 2. Notification Preferences table
create table if not exists public.notification_preferences (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references auth.users(id) on delete cascade not null unique,
  email_new_orders boolean default true not null,
  email_order_status boolean default true not null,
  email_stock_alerts boolean default true not null,
  email_subscription boolean default true not null,
  in_app_notifications boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists notification_preferences_seller_idx on public.notification_preferences (seller_id);

-- 3. Email Delivery Logs table
create table if not exists public.email_delivery_logs (
  id uuid default gen_random_uuid() primary key,
  recipient_email text not null,
  recipient_type text default 'customer' not null check (recipient_type in ('seller', 'customer', 'admin')),
  template_type text not null,
  event_type text not null,
  subject text not null,
  provider text default 'resend' not null,
  status text not null check (status in ('sent', 'failed', 'simulated_dev', 'skipped_missing_credentials')),
  provider_message_id text,
  error_details text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists email_delivery_logs_recipient_idx on public.email_delivery_logs (recipient_email);
create index if not exists email_delivery_logs_status_idx on public.email_delivery_logs (status);
create index if not exists email_delivery_logs_created_at_idx on public.email_delivery_logs (created_at desc);

-- Enable Row Level Security
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.email_delivery_logs enable row level security;

-- Policies for notifications
drop policy if exists "Sellers can view own notifications" on public.notifications;
create policy "Sellers can view own notifications" on public.notifications
  for select using (
    recipient_type = 'seller' and recipient_id = auth.uid()::text
  );

drop policy if exists "Admins can view admin notifications" on public.notifications;
create policy "Admins can view admin notifications" on public.notifications
  for select using (
    recipient_type = 'admin' and auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com'
  );

drop policy if exists "Sellers can update own notification read state" on public.notifications;
create policy "Sellers can update own notification read state" on public.notifications
  for update using (
    (recipient_type = 'seller' and recipient_id = auth.uid()::text) or
    (recipient_type = 'admin' and auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com')
  );

drop policy if exists "Service role can insert notifications" on public.notifications;
create policy "Service role can insert notifications" on public.notifications
  for insert with check (true);

-- Policies for notification preferences
drop policy if exists "Sellers can view own preferences" on public.notification_preferences;
create policy "Sellers can view own preferences" on public.notification_preferences
  for select using (seller_id = auth.uid());

drop policy if exists "Sellers can upsert own preferences" on public.notification_preferences;
create policy "Sellers can upsert own preferences" on public.notification_preferences
  for all using (seller_id = auth.uid());

-- Policies for email delivery logs
drop policy if exists "Admins can view all email logs" on public.email_delivery_logs;
create policy "Admins can view all email logs" on public.email_delivery_logs
  for select using (auth.jwt() ->> 'email' = 'chopdekaradhrit2013@gmail.com');

drop policy if exists "Service role can insert email logs" on public.email_delivery_logs;
create policy "Service role can insert email logs" on public.email_delivery_logs
  for insert with check (true);
