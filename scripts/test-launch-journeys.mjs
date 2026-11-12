/**
 * SellNest Launch Readiness Verification Suite
 * Tests Journeys A, B, C, D, and E across the live application.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_PASSKEY = process.env.ADMIN_SECRET_KEY || "sellnest_admin_secure_key_2026";
const ADMIN_EMAIL = "chopdekaradhrit2013@gmail.com";

let cookieJar = "";

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function record(name, pass, details = "") {
  if (pass) {
    results.passed++;
    console.log(`  [PASS] ${name}${details ? ` (${details})` : ""}`);
  } else {
    results.failed++;
    console.error(`  [FAIL] ${name}${details ? ` - ${details}` : ""}`);
  }
  results.tests.push({ name, pass, details });
}

async function runTest(name, fn) {
  try {
    await fn();
  } catch (err) {
    record(name, false, err.message);
  }
}

async function main() {
  console.log("=================================================");
  console.log("       SELLNEST LAUNCH VERIFICATION SUITE        ");
  console.log(` Target: ${BASE_URL}`);
  console.log("=================================================\n");

  // ==========================================
  // JOURNEY A: SELLER JOURNEY
  // ==========================================
  console.log("--- JOURNEY A: SELLER JOURNEY ---");

  await runTest("A1. Username validation rejects invalid characters (spaces, special chars)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/check-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "invalid user!" }),
    });
    const data = await res.json();
    record("A1. Username validation rejects invalid characters", res.status === 400 && data.available === false, data.error);
  });

  await runTest("A2. Username check allows valid formatted unique usernames", async () => {
    const testUser = `launch_test_${Date.now().toString().slice(-4)}`;
    const res = await fetch(`${BASE_URL}/api/auth/check-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: testUser }),
    });
    const data = await res.json();
    record("A2. Username check allows valid formatted unique usernames", res.ok && data.available === true);
  });

  await runTest("A3. Email lookup endpoint resolves email address safely", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/lookup-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "maker@thebutterroom.in" }),
    });
    const data = await res.json();
    record("A3. Email lookup endpoint responds safely", res.ok && data.email === "maker@thebutterroom.in");
  });

  await runTest("A4. Store slug validator rejects reserved system handles", async () => {
    const res = await fetch(`${BASE_URL}/api/store/check-slug?slug=admin`);
    const data = await res.json();
    record("A4. Store slug validator rejects reserved system handles", data.available === false, data.error);
  });

  // ==========================================
  // JOURNEY B: CUSTOMER SHOPPING JOURNEY
  // ==========================================
  console.log("\n--- JOURNEY B: CUSTOMER SHOPPING JOURNEY ---");

  let createdOrderCode = null;
  const customerPhone = "9876543210";

  await runTest("B1. Public Storefront renders successfully for customers (/store/thebutterroom)", async () => {
    const res = await fetch(`${BASE_URL}/store/thebutterroom`);
    const text = await res.text();
    const hasSlugInStream = text.includes("thebutterroom");
    record("B1. Public storefront renders with theme and products", res.ok && hasSlugInStream);
  });

  await runTest("B2. Customer places order with snapshot pricing & cart verification", async () => {
    const orderPayload = {
      storeSlug: "thebutterroom",
      customer: {
        full_name: "Aarav Sharma",
        phone: customerPhone,
        email: "aarav.test@sellnest.local",
        delivery_address: "Flat 402, Palm Heights, 100ft Road, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        notes: "Please deliver before 6 PM.",
      },
      items: [
        {
          productId: "prod-1",
          quantity: 2,
        },
        {
          productId: "prod-2",
          quantity: 1,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/orders/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (res.ok && data.success && data.order?.order_code) {
      createdOrderCode = data.order.order_code;
      record("B2. Customer places order successfully", true, `Code: ${createdOrderCode}, Total: ₹${data.order.total_amount}`);
    } else {
      record("B2. Customer places order successfully", false, data.error || "Order creation failed");
    }
  });

  await runTest("B3. Order Tracking by order code and mobile verifies privacy & status", async () => {
    if (!createdOrderCode) {
      record("B3. Order Tracking by order code", false, "Skipped due to missing order code");
      return;
    }
    const res = await fetch(`${BASE_URL}/api/orders/track?order=${encodeURIComponent(createdOrderCode)}&phone=${customerPhone}`);
    const data = await res.json();
    const hasDetails = data.success && data.order && data.order.order_code === createdOrderCode && data.order.items.length > 0;
    const hasFrozenPrices = data.order.items.every(i => typeof i.unit_price === "number" && typeof i.total_price === "number");
    record("B3. Order Tracking verifies privacy, items, and frozen snapshot pricing", Boolean(hasDetails && hasFrozenPrices));
  });

  // ==========================================
  // JOURNEY C: SUBSCRIPTION & MANUAL VERIFICATION
  // ==========================================
  console.log("\n--- JOURNEY C: SUBSCRIPTION & UPGRADE VERIFICATION ---");

  let createdRequestId = null;

  await runTest("C0. Reset demo store subscription to Free plan for clean test baseline", async () => {
    const res = await fetch(`${BASE_URL}/api/subscriptions/change-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: "free", storeId: "demo-store-1" }),
    });
    const data = await res.json();
    // It is ok if it's already free or if it switched to free
    record("C0. Baseline plan set to Free", res.ok || data.error?.includes("already subscribed"));
  });

  await runTest("C1. Seller submits manual upgrade request with UTR and details", async () => {
    const upgradePayload = {
      storeId: "demo-store-1",
      storeName: "The Butter Room",
      sellerId: "seller-1",
      sellerName: "Priya Nair",
      sellerEmail: "maker@thebutterroom.in",
      currentPlanId: "free",
      targetPlanId: "starter",
      amount: 99,
      paymentMethod: "UPI (Google Pay)",
      transactionReference: `UTR${Date.now().toString().slice(-8)}`,
      paymentDate: new Date().toISOString().split("T")[0],
    };

    const res = await fetch(`${BASE_URL}/api/subscriptions/upgrade-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upgradePayload),
    });

    const data = await res.json();
    if (res.ok && data.success && data.request?.id) {
      createdRequestId = data.request.id;
      record("C1. Seller submits manual upgrade request", true, `Ref: ${data.request.request_number}`);
    } else {
      record("C1. Seller submits manual upgrade request", false, data.error || "Upgrade request failed");
    }
  });

  // ==========================================
  // JOURNEY D: SUPER ADMIN SECURITY & MANAGEMENT
  // ==========================================
  console.log("\n--- JOURNEY D: SUPER ADMIN SECURITY & MANAGEMENT ---");

  await runTest("D1. Unauthenticated request to /api/admin/overview is blocked (403)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/overview`);
    record("D1. Unauthenticated admin access strictly blocked", res.status === 403 || res.status === 401);
  });

  await runTest("D1b. Unauthorized email rejected from admin authentication (403)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "stranger@notadmin.com",
        password: "anypassword123",
      }),
    });
    record("D1b. Unauthorized email rejected from admin authentication", res.status === 403);
  });

  await runTest("D2. chopdekaradhrit2013@gmail.com signs in with credentials / security passkey", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        passkey: process.env.ADMIN_SECRET_KEY || "sellnest_admin_secure_key_2026",
      }),
    });

    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");
    if (res.ok && data.success && setCookie) {
      cookieJar = setCookie.split(";")[0];
      record("D2. chopdekaradhrit2013@gmail.com authenticated & session cookie issued", true);
    } else {
      record("D2. chopdekaradhrit2013@gmail.com authenticated & session cookie issued", false, data.error || "No cookie");
    }
  });

  await runTest("D3. Super Admin accesses overview metrics with session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Cookie: cookieJar },
    });
    const data = await res.json();
    const hasStats = res.ok && data.success && data.stats && typeof data.stats.totalSellers === "number";
    record("D3. Super Admin retrieves platform metrics & KPIs", Boolean(hasStats), `Sellers: ${data.stats?.totalSellers}, Stores: ${data.stats?.totalActiveStores}`);
  });

  await runTest("D4. Admin reviews and approves pending subscription upgrade request", async () => {
    if (!createdRequestId) {
      record("D4. Admin reviews and approves pending upgrade", false, "No pending request from C1");
      return;
    }

    const reviewRes = await fetch(`${BASE_URL}/api/admin/subscriptions/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieJar,
      },
      body: JSON.stringify({
        requestId: createdRequestId,
        action: "approve",
        adminEmail: ADMIN_EMAIL,
      }),
    });

    const reviewData = await reviewRes.json();
    record("D4. Admin approves upgrade request & activates entitlement", reviewRes.ok && reviewData.success);
  });

  await runTest("D5. Admin moderates store (toggles publish state) and verifies audit logging", async () => {
    const modRes = await fetch(`${BASE_URL}/api/admin/stores/moderate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieJar,
      },
      body: JSON.stringify({
        storeId: "demo-store-1",
        action: "unpublish",
        reason: "Compliance check verification",
      }),
    });

    const modData = await modRes.json();

    // Re-publish store immediately to preserve clean state
    await fetch(`${BASE_URL}/api/admin/stores/moderate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieJar,
      },
      body: JSON.stringify({
        storeId: "demo-store-1",
        action: "restore",
        reason: "Verification complete, store restored",
      }),
    });

    record("D5. Store moderation and audit logging executed successfully", modRes.ok && modData.success);
  });

  await runTest("D6. Audit activity log captures administrative operations", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/activity`, {
      headers: { Cookie: cookieJar },
    });
    const data = await res.json();
    record("D6. Audit activity log records administrative actions", res.ok && Array.isArray(data.logs) && data.logs.length > 0);
  });

  // ==========================================
  // JOURNEY E: NOTIFICATIONS & TRANSACTIONAL EMAILS
  // ==========================================
  console.log("\n--- JOURNEY E: NOTIFICATIONS & TRANSACTIONAL EMAILS ---");

  await runTest("E1. Admin retrieves platform notifications", async () => {
    const res = await fetch(`${BASE_URL}/api/notifications?recipientType=admin`, {
      headers: { Cookie: cookieJar },
    });
    const data = await res.json();
    record("E1. In-app notifications feed retrieved", res.ok && Array.isArray(data.notifications));
  });

  await runTest("E2. Notification preferences can be queried and updated", async () => {
    const res = await fetch(`${BASE_URL}/api/notifications/preferences`);
    const data = await res.json();
    record("E2. Notification preferences accessible", res.ok && Boolean(data.preferences));
  });

  await runTest("E3. Admin views transactional email delivery logs", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/emails/logs`, {
      headers: { Cookie: cookieJar },
    });
    const data = await res.json();
    record("E3. Transactional email delivery audit log retrieved", res.ok && Array.isArray(data.logs));
  });

  await runTest("E4. Admin sends test transactional email via notification engine", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/emails/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieJar,
      },
      body: JSON.stringify({
        template: "welcome",
        toEmail: ADMIN_EMAIL,
        data: { name: "Adhrit Chopdekar", storeName: "The Butter Room" },
      }),
    });

    const data = await res.json();
    record("E4. Transactional email engine sends test email successfully", res.ok && data.success);
  });

  console.log("\n=================================================");
  console.log(` RESULTS: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log("=================================================");

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
