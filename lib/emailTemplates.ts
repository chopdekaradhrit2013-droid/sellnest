/**
 * SellNest Transactional Email Templates
 * Branded, responsive HTML templates matching the Stripe/Linear/Shopify aesthetic:
 * - Off-white clean background (#f9f8f6)
 * - Deep charcoal typography (#18181b)
 * - Elegant lavender/purple accents (#7c3aed)
 * - Responsive container with clear call-to-actions and footer
 */

interface BaseEmailProps {
  appUrl?: string;
  supportEmail?: string;
}

const DEFAULT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const DEFAULT_SUPPORT_EMAIL = "chopdekaradhrit2013@gmail.com";

function emailWrapper({
  title,
  preheader,
  content,
  appUrl = DEFAULT_APP_URL,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
}: {
  title: string;
  preheader: string;
  content: string;
  appUrl?: string;
  supportEmail?: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f9f8f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f9f8f6;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      border: 1px solid #e7e5e4;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    .header {
      padding: 32px 36px 24px;
      border-bottom: 1px solid #f5f5f4;
    }
    .brand-pill {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7c3aed;
      background-color: #f5f3ff;
      border: 1px solid #ddd6fe;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #18181b;
      margin: 0;
    }
    .content {
      padding: 32px 36px;
      line-height: 1.6;
      font-size: 14px;
      color: #3f3f46;
    }
    .content h2 {
      font-size: 18px;
      font-weight: 700;
      color: #18181b;
      margin-top: 0;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .card-box {
      background-color: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 14px;
      padding: 20px;
      margin: 20px 0;
    }
    .card-box table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .card-box td {
      padding: 6px 0;
      vertical-align: top;
    }
    .card-box td.label {
      color: #71717a;
      width: 40%;
      font-weight: 500;
    }
    .card-box td.value {
      color: #18181b;
      font-weight: 600;
      text-align: right;
    }
    .cta-btn {
      display: inline-block;
      background-color: #7c3aed;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      margin-top: 12px;
      margin-bottom: 8px;
      text-align: center;
    }
    .footer {
      padding: 24px 36px 32px;
      background-color: #fafaf9;
      border-top: 1px solid #f5f5f4;
      font-size: 12px;
      color: #71717a;
      line-height: 1.5;
      text-align: center;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <table class="wrapper" role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <span class="brand-pill">SellNest</span>
            <h1 class="brand-title">SellNest</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>Sent with care by <strong>SellNest</strong> • Your own corner of the internet.</p>
            <p>Need support or have questions? Email us at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
            <p style="margin-top: 8px; font-size: 11px; color: #a1a1aa;">© ${new Date().getFullYear()} SellNest. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ------------------------------------------------------------------------------
// 1. Welcome to SellNest (Seller)
// ------------------------------------------------------------------------------
export function renderWelcomeSellerEmail({
  sellerName,
  storeName,
  storeSlug,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  storeSlug: string;
}) {
  const storeUrl = `${appUrl}/store/${storeSlug}`;
  const dashboardUrl = `${appUrl}/dashboard`;

  const content = `
    <h2>Welcome to SellNest, ${sellerName}! 🎉</h2>
    <p>Congratulations on opening your new online storefront. Your store <strong>${storeName}</strong> is created and ready to be customized.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Store Name</td>
          <td class="value">${storeName}</td>
        </tr>
        <tr>
          <td class="label">Public Storefront</td>
          <td class="value"><a href="${storeUrl}" style="color:#7c3aed;">/store/${storeSlug}</a></td>
        </tr>
        <tr>
          <td class="label">Starter Plan</td>
          <td class="value">Free Tier (10 Products)</td>
        </tr>
      </table>
    </div>

    <p>Get started by listing your first product, personalizing your brand colors and theme, and sharing your store link with customers on Instagram and WhatsApp.</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${dashboardUrl}" class="cta-btn">Open Seller Dashboard →</a>
    </div>
  `;

  return {
    subject: `Welcome to SellNest! Your storefront ${storeName} is ready`,
    html: emailWrapper({
      title: "Welcome to SellNest",
      preheader: `Your new storefront ${storeName} is live and ready for customers.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 2. New Order Received (Seller)
// ------------------------------------------------------------------------------
export function renderNewOrderSellerEmail({
  sellerName,
  storeName,
  orderCode,
  customerName,
  customerPhone,
  deliveryAddress,
  totalAmount,
  items,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  orderCode: string;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: string;
  totalAmount: number;
  items: Array<{ product_name: string; quantity: number; unit_price: number }>;
}) {
  const ordersUrl = `${appUrl}/dashboard/orders`;

  const itemsHtml = items
    .map(
      (it) => `
      <tr>
        <td style="padding: 4px 0;">${it.quantity}x ${it.product_name}</td>
        <td style="text-align: right; padding: 4px 0; font-weight: 600;">₹${(it.quantity * it.unit_price).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const content = `
    <h2>🎉 New Order Received! (${orderCode})</h2>
    <p>Great news, ${sellerName}! You have a new customer order on <strong>${storeName}</strong>.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Order Code</td>
          <td class="value">${orderCode}</td>
        </tr>
        <tr>
          <td class="label">Customer</td>
          <td class="value">${customerName}</td>
        </tr>
        ${customerPhone ? `<tr><td class="label">Phone</td><td class="value">${customerPhone}</td></tr>` : ""}
        ${deliveryAddress ? `<tr><td class="label">Delivery To</td><td class="value" style="font-size:12px;">${deliveryAddress}</td></tr>` : ""}
        <tr>
          <td class="label" style="border-top: 1px solid #e7e5e4; padding-top: 8px;">Order Total</td>
          <td class="value" style="border-top: 1px solid #e7e5e4; padding-top: 8px; font-size: 16px; color: #7c3aed;">₹${totalAmount.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 16px 0;">
      <p style="font-weight: 700; margin-bottom: 8px;">Items Ordered:</p>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        ${itemsHtml}
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${ordersUrl}" class="cta-btn">Review Order & Update Status →</a>
    </div>
  `;

  return {
    subject: `🎉 New Order #${orderCode} received on ${storeName} (₹${totalAmount})`,
    html: emailWrapper({
      title: `New Order ${orderCode}`,
      preheader: `New order from ${customerName} for ₹${totalAmount} on ${storeName}.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 3. Order Confirmation (Customer)
// ------------------------------------------------------------------------------
export function renderOrderConfirmationCustomerEmail({
  customerName,
  storeName,
  orderCode,
  totalAmount,
  items,
  trackUrl,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  customerName: string;
  storeName: string;
  orderCode: string;
  totalAmount: number;
  items: Array<{ product_name: string; quantity: number; unit_price: number }>;
  trackUrl?: string;
}) {
  const trackingLink = trackUrl || `${appUrl}/track?code=${orderCode}`;

  const itemsHtml = items
    .map(
      (it) => `
      <tr>
        <td style="padding: 4px 0;">${it.quantity}x ${it.product_name}</td>
        <td style="text-align: right; padding: 4px 0; font-weight: 600;">₹${(it.quantity * it.unit_price).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const content = `
    <h2>Thank you for your order, ${customerName}! ✨</h2>
    <p>Your order has been received by <strong>${storeName}</strong>. The seller is reviewing your order and will begin preparation shortly.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Order Code</td>
          <td class="value">${orderCode}</td>
        </tr>
        <tr>
          <td class="label">Store</td>
          <td class="value">${storeName}</td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="value" style="color: #d97706;">Received / Pending</td>
        </tr>
        <tr>
          <td class="label" style="border-top: 1px solid #e7e5e4; padding-top: 8px;">Total Amount</td>
          <td class="value" style="border-top: 1px solid #e7e5e4; padding-top: 8px; font-size: 16px; color: #7c3aed;">₹${totalAmount.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 16px 0;">
      <p style="font-weight: 700; margin-bottom: 8px;">Order Summary:</p>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        ${itemsHtml}
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${trackingLink}" class="cta-btn">Track Order Status Live →</a>
    </div>
  `;

  return {
    subject: `Order Confirmation #${orderCode} from ${storeName}`,
    html: emailWrapper({
      title: `Order Confirmation #${orderCode}`,
      preheader: `Thank you for your order on ${storeName}. Order code: ${orderCode}.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 4. Order Status Update (Customer)
// ------------------------------------------------------------------------------
export function renderOrderStatusUpdateCustomerEmail({
  customerName,
  storeName,
  orderCode,
  newStatus,
  trackUrl,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  customerName: string;
  storeName: string;
  orderCode: string;
  newStatus: string;
  trackUrl?: string;
}) {
  const trackingLink = trackUrl || `${appUrl}/track?code=${orderCode}`;

  let statusLabel = newStatus.toUpperCase();
  let statusDesc = "Your order status has been updated by the seller.";
  let badgeColor = "#7c3aed";

  if (newStatus === "confirmed") {
    statusLabel = "Confirmed";
    statusDesc = "The seller has accepted your order and confirmed your items.";
    badgeColor = "#0284c7";
  } else if (newStatus === "processing") {
    statusLabel = "In Preparation";
    statusDesc = "Your items are being lovingly freshly prepared and packed.";
    badgeColor = "#8b5cf6";
  } else if (newStatus === "completed") {
    statusLabel = "Fulfilled / Delivered";
    statusDesc = "Your order has been completed and dispatched/delivered. Enjoy!";
    badgeColor = "#16a34a";
  } else if (newStatus === "cancelled") {
    statusLabel = "Cancelled";
    statusDesc = "This order has been marked as cancelled. If you have questions, please reach out directly to the seller.";
    badgeColor = "#dc2626";
  }

  const content = `
    <h2>Order Update: #${orderCode}</h2>
    <p>Hi ${customerName},</p>
    <p>${statusDesc}</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Order Code</td>
          <td class="value">${orderCode}</td>
        </tr>
        <tr>
          <td class="label">Store</td>
          <td class="value">${storeName}</td>
        </tr>
        <tr>
          <td class="label">Current Status</td>
          <td class="value" style="color: ${badgeColor}; font-weight: 800;">${statusLabel}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${trackingLink}" class="cta-btn">View Live Tracking Details →</a>
    </div>
  `;

  return {
    subject: `Order #${orderCode} Update: ${statusLabel} (${storeName})`,
    html: emailWrapper({
      title: `Order Update #${orderCode}`,
      preheader: `Your order #${orderCode} from ${storeName} is now ${statusLabel}.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 5. Payment Confirmation (Customer)
// ------------------------------------------------------------------------------
export function renderPaymentConfirmationCustomerEmail({
  customerName,
  storeName,
  orderCode,
  amountPaid,
  trackUrl,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  customerName: string;
  storeName: string;
  orderCode: string;
  amountPaid: number;
  trackUrl?: string;
}) {
  const trackingLink = trackUrl || `${appUrl}/track?code=${orderCode}`;

  const content = `
    <h2>Payment Verified! 💳</h2>
    <p>Hi ${customerName},</p>
    <p>We are pleased to confirm that your payment of <strong>₹${amountPaid.toLocaleString("en-IN")}</strong> for Order <strong>#${orderCode}</strong> has been successfully verified.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Order Code</td>
          <td class="value">${orderCode}</td>
        </tr>
        <tr>
          <td class="label">Store</td>
          <td class="value">${storeName}</td>
        </tr>
        <tr>
          <td class="label">Amount Verified</td>
          <td class="value" style="color: #16a34a; font-size: 15px;">₹${amountPaid.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td class="label">Payment Status</td>
          <td class="value" style="color: #16a34a;">Verified & Cleared</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${trackingLink}" class="cta-btn">View Order Receipt →</a>
    </div>
  `;

  return {
    subject: `Payment Verified for Order #${orderCode} (${storeName})`,
    html: emailWrapper({
      title: `Payment Verified #${orderCode}`,
      preheader: `Payment of ₹${amountPaid} for Order #${orderCode} has been verified.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 6. Subscription Upgrade Request Received (Seller)
// ------------------------------------------------------------------------------
export function renderUpgradeRequestReceivedEmail({
  sellerName,
  storeName,
  planName,
  requestNumber,
  amount,
  promiseHours = 24,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  planName: string;
  requestNumber: string;
  amount: number;
  promiseHours?: number;
}) {
  const billingUrl = `${appUrl}/dashboard/billing`;

  const content = `
    <h2>Upgrade Request Received! ⏳</h2>
    <p>Hi ${sellerName},</p>
    <p>Your plan upgrade request to <strong>SellNest ${planName}</strong> has been submitted successfully.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Request Reference</td>
          <td class="value">${requestNumber}</td>
        </tr>
        <tr>
          <td class="label">Target Plan</td>
          <td class="value" style="text-transform: capitalize;">${planName}</td>
        </tr>
        <tr>
          <td class="label">Amount Paid</td>
          <td class="value">₹${amount}</td>
        </tr>
        <tr>
          <td class="label">Verification Window</td>
          <td class="value">Within ${promiseHours} hours</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #52525b;">
      Our platform team will verify your submitted transaction reference against bank records and activate your new plan benefits. If your upgrade hasn't been completed within ${promiseHours} hours, please contact <a href="mailto:${supportEmail}">${supportEmail}</a>.
    </p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${billingUrl}" class="cta-btn">View Plan Status in Billing →</a>
    </div>
  `;

  return {
    subject: `Upgrade Request Submitted: ${planName} Plan (${requestNumber})`,
    html: emailWrapper({
      title: "Upgrade Request Received",
      preheader: `Your plan upgrade to ${planName} has been received and will be verified within ${promiseHours}h.`,
      content,
      appUrl,
      supportEmail,
    }),
  };
}

// ------------------------------------------------------------------------------
// 7. Subscription Upgrade Approved (Seller)
// ------------------------------------------------------------------------------
export function renderUpgradeApprovedEmail({
  sellerName,
  storeName,
  planName,
  invoiceNumber,
  amount,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  planName: string;
  invoiceNumber: string;
  amount: number;
}) {
  const dashboardUrl = `${appUrl}/dashboard`;

  const content = `
    <h2>Your Plan Upgrade is Live! 🚀</h2>
    <p>Hi ${sellerName},</p>
    <p>Great news! Your manual payment has been verified and your storefront <strong>${storeName}</strong> is now upgraded to the <strong>${planName} Plan</strong>.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">New Active Plan</td>
          <td class="value" style="color: #7c3aed; text-transform: capitalize; font-size: 15px;">${planName} Plan</td>
        </tr>
        <tr>
          <td class="label">Tax Invoice No</td>
          <td class="value">${invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">Amount Paid</td>
          <td class="value">₹${amount}</td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="value" style="color: #16a34a;">Active & Entitled</td>
        </tr>
      </table>
    </div>

    <p>Your higher product catalog limits, theme customizer features, and priority tools have been unlocked immediately.</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${dashboardUrl}" class="cta-btn">Go to Seller Dashboard →</a>
    </div>
  `;

  return {
    subject: `🚀 Your SellNest ${planName} Plan is now Active! (${storeName})`,
    html: emailWrapper({
      title: "Plan Upgraded Successfully",
      preheader: `Payment verified! Your ${planName} plan is active with upgraded store features.`,
      content,
      appUrl,
    }),
  };
}

// ------------------------------------------------------------------------------
// 8. Subscription Upgrade Rejected (Seller)
// ------------------------------------------------------------------------------
export function renderUpgradeRejectedEmail({
  sellerName,
  storeName,
  planName,
  rejectionReason,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  planName: string;
  rejectionReason: string;
}) {
  const billingUrl = `${appUrl}/dashboard/billing`;

  const content = `
    <h2>Upgrade Verification Notice</h2>
    <p>Hi ${sellerName},</p>
    <p>We reviewed your recent subscription upgrade request for <strong>${storeName}</strong> to the <strong>${planName} Plan</strong>, but were unable to verify the transaction reference provided.</p>
    
    <div class="card-box" style="border-left: 4px solid #ef4444;">
      <p style="font-weight: 700; color: #dc2626; margin-bottom: 6px;">Reason Provided by Administrator:</p>
      <p style="font-size: 13px; color: #18181b; margin: 0;">${rejectionReason}</p>
    </div>

    <p style="font-size: 13px; color: #52525b;">
      Your store remains safely on its current tier. You can submit a corrected UTR reference number and payment proof anytime from your Billing page, or reach out to <a href="mailto:${supportEmail}">${supportEmail}</a> for assistance.
    </p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${billingUrl}" class="cta-btn">Review Billing & Re-submit →</a>
    </div>
  `;

  return {
    subject: `Update regarding your SellNest ${planName} upgrade request`,
    html: emailWrapper({
      title: "Upgrade Verification Notice",
      preheader: `Important update regarding your SellNest ${planName} upgrade request for ${storeName}.`,
      content,
      appUrl,
      supportEmail,
    }),
  };
}

// ------------------------------------------------------------------------------
// 9. Subscription Expiration Reminder (Seller)
// ------------------------------------------------------------------------------
export function renderSubscriptionExpiringEmail({
  sellerName,
  storeName,
  planName,
  expiresAt,
  appUrl = DEFAULT_APP_URL,
}: BaseEmailProps & {
  sellerName: string;
  storeName: string;
  planName: string;
  expiresAt: string;
}) {
  const billingUrl = `${appUrl}/dashboard/billing`;
  const expiryDate = new Date(expiresAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const content = `
    <h2>Plan Renewal Reminder 🔔</h2>
    <p>Hi ${sellerName},</p>
    <p>This is a friendly reminder that your <strong>${planName} Plan</strong> for <strong>${storeName}</strong> is scheduled to renew on <strong>${expiryDate}</strong>.</p>
    
    <div class="card-box">
      <table>
        <tr>
          <td class="label">Store</td>
          <td class="value">${storeName}</td>
        </tr>
        <tr>
          <td class="label">Current Plan</td>
          <td class="value" style="text-transform: capitalize;">${planName}</td>
        </tr>
        <tr>
          <td class="label">Expiration Date</td>
          <td class="value" style="color: #d97706;">${expiryDate}</td>
        </tr>
      </table>
    </div>

    <p>To ensure uninterrupted access to your expanded catalog limits and custom themes, please visit your Billing settings to review your plan renewal.</p>

    <div style="text-align: center; margin: 24px 0 16px;">
      <a href="${billingUrl}" class="cta-btn">Manage Plan Renewal →</a>
    </div>
  `;

  return {
    subject: `Reminder: Your SellNest ${planName} plan renews on ${expiryDate}`,
    html: emailWrapper({
      title: "Plan Renewal Reminder",
      preheader: `Your SellNest ${planName} plan for ${storeName} renews on ${expiryDate}.`,
      content,
      appUrl,
    }),
  };
}

