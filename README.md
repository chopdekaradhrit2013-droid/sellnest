# SellNest — Online Storefront Creation Platform

> **"Your business. Your own little corner of the internet."**

SellNest is a multi-tenant SaaS e-commerce platform designed for small businesses, independent sellers, home-based bakers, Instagram sellers, and creative makers. SellNest empowers entrepreneurs to launch a high-converting, mobile-first online storefront in minutes — without writing code.

---

## 🌟 Architecture & Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Dynamic Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, shared interfaces)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom SellNest design system, lavender/purple palette, dark admin aesthetic)
- **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL with Row-Level Security (RLS) & Auth
- **Icons**: [Lucide React](https://lucide.dev/)
- **Transactional Emails**: [Resend](https://resend.com/) API with safe simulation fallback for local development
- **Deployment**: Vercel & Supabase Cloud

---

## 🚀 Core Features & Implementation Highlights

### 1. Public Marketing Website & Authentication
- **Landing Page**: Polished Stripe/Linear/Shopify-inspired UI with live feature previews, pricing tiers, and interactive FAQ.
- **Secure Authentication**: Supabase Email/Password signup with client and server validation (alphanumeric usernames without spaces, password strength, terms acceptance).
- **Password Reset Flow**: Request reset email with secure token verification callback.

### 2. Seller Dashboard
- **Overview & KPI Analytics**: Real-time sales metrics, revenue charts, order counts, and recent activity.
- **Product Management**: Multi-image galleries, eggless tags, preparation times, categories, and inventory stock tracking.
- **Order Processing**: Live order kanban/list, status updates (`pending` -> `confirmed` -> `processing` -> `completed` -> `cancelled`), and WhatsApp customer notification triggers.
- **Storefront Customization**: 4 themes (**Minimal**, **Modern**, **Boutique**, **Warm / Artisan**), custom accent colors, font families, announcements, and draft settings with live preview.

### 3. Customer Shopping & Checkout
- **Public Storefronts**: Fast URLs at `/store/[slug]` (e.g. `/store/thebutterroom`).
- **Interactive Shopping Bag**: Real-time slide-over cart drawer with quantity increments and instant subtotal calculation.
- **One-Step Checkout**: Customer details, delivery address, city, pincode, and special instructions.
- **Order Snapshot Pricing**: Historical unit prices and total amounts are frozen in `order_items` at placement time, guaranteeing seller price edits never alter past financial records.
- **Order Tracking**: Customer tracking by Order Number and Mobile Number at `/track` and `/store/[slug]/track`.

### 4. Subscription & Manual Payment Verification Workflow
- **Subscription Tiers**:
  - **Free (₹0/mo)**: 1 store, up to 10 products, WhatsApp ordering, basic themes.
  - **Starter (₹99/mo)**: Up to 100 products, all themes, advanced analytics, custom branding.
  - **Pro (₹199/mo)**: Unlimited products, priority support, custom domain readiness, lowest platform overhead.
- **Manual Payment Verification**:
  - Displays configurable UPI ID (`sellnest@upi`) and corporate bank account details.
  - Seller submits 12-digit UTR transaction reference, payment date, and optional screenshot.
  - Pending status is set immediately with a 24-hour turnaround service promise.
  - No automated credit card charges or external gateway dependencies.

### 5. Super Admin Panel (`/admin`)
- **Dedicated Administrator**: `chopdekaradhrit2013@gmail.com` is configured as the platform owner and sole authorized administrator. He signs up and signs in with his own personal password via standard Supabase Auth.
- **Server-Side Security**: Multi-layer access control via Supabase SSR session, authorized email whitelist (`chopdekaradhrit2013@gmail.com`), and encrypted HTTP-only session cookies (`sellnest_admin_session`).
- **Sellers & Stores Directory**: Comprehensive search, filter, store moderation (unpublish / restore), and seller suspension.
- **Upgrade Verification Queue**: One-click approval/rejection with optional feedback; approval automatically activates store entitlements and generates a billing invoice.
- **Audit Activity Trail**: Every administrative action is logged to `admin_audit_logs` with timestamp, admin email, action type, and reason.

### 6. Notifications & Transactional Email System
- **In-App Notification Center**: Bell icon with unread badge in top navbar, slide-out feed, filter tabs, mark-as-read, and preference toggles.
- **Branded Email Templates**: 9 HTML email templates for order confirmation, order status updates, upgrade submissions, upgrade approvals, store moderation alerts, and welcome messages.
- **Resend Email Integration**: Production-ready Resend provider with automatic simulated delivery fallback that records all dispatches to `email_delivery_logs`.

### 7. Legal, Privacy & Compliance (Ad-Ready)
- **Terms of Service (`/terms`)**: Platform agreement, seller guidelines, Indian jurisdiction (Bengaluru courts), and limitation of liability.
- **Privacy Policy (`/privacy`)**: Data protection standards, two-factor tracking privacy, and user data rights.
- **Refund & Cancellation Policy (`/refund-policy`)**: 7-day money-back guarantee for plan upgrades and customer dispute guidelines.
- **Contact & Support (`/contact`)**: Support email (`chopdekaradhrit2013@gmail.com`), WhatsApp chat link, and interactive messaging form.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/sellnest.git
cd sellnest
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your configuration:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Admin Passkey (Keep this secret!)
ADMIN_SECRET_KEY=sellnest_admin_secure_key_2026
ADMIN_EMAIL=chopdekaradhrit2013@gmail.com
NEXT_PUBLIC_SUPPORT_EMAIL=chopdekaradhrit2013@gmail.com

# Resend API (Optional for local development)
RESEND_API_KEY=re_your_resend_api_key
```

### 3. Initialize Supabase Database Schema
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy the entire contents of `supabase/schema.sql`.
3. Click **Run** to execute migrations, establish tables, create performance indexes, and apply Row-Level Security (RLS) policies.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Automated Testing & Launch Verification

SellNest includes an end-to-end launch verification test suite testing all 5 critical platform journeys:
- **Journey A (Seller)**: Username uniqueness validation, format constraints, email resolution, reserved handle enforcement.
- **Journey B (Customer Shopping)**: Public storefront rendering, cart order placement, snapshot price freezing, private order tracking.
- **Journey C (Subscriptions)**: Manual upgrade submission with UTR, pending status queue, admin approval, entitlement activation.
- **Journey D (Super Admin)**: 403 access control enforcement, secret passkey authentication, platform KPIs, store moderation, audit logging.
- **Journey E (Notifications & Email)**: Notification queries, preference toggles, transactional email log auditing, test email dispatch.

To run the verification suite:
```bash
npm run build
npm run start
node scripts/test-launch-journeys.mjs
```

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Add the environment variables defined in `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_SECRET_KEY`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_SUPPORT_EMAIL`
   - `RESEND_API_KEY` (from https://resend.com)
   - `EMAIL_FROM` (e.g. `SellNest <orders@yourverifieddomain.com>`)
   - `NEXT_PUBLIC_SITE_URL` (your production Vercel domain)
   - `NEXT_PUBLIC_APP_URL` (your production Vercel domain)
4. Click **Deploy**.

---

## 🔒 Security Hardening Notes
- **Client Bundle Secret Isolation**: The `ADMIN_SECRET_KEY` is strictly accessed via server-side routines (`lib/adminAuth.ts`) and is guaranteed not to exist in client `.next/static/` chunks.
- **Row-Level Security**: All database tables enforce strict RLS policies ensuring sellers can only access and modify their own stores, products, and customer orders.
- **Order Snapshotting**: Product price updates never retroactively impact historical order invoices or line item totals.
- **Customer Privacy**: Order tracking requires both the Order Code AND the Customer's 10-digit mobile number to prevent data scraping.

---

## 📄 License
Copyright © 2026 SellNest Platforms Pvt Ltd. All rights reserved.

