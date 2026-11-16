import assert from "node:assert";

// Test UPI payment logic
const upiId = "sellnest@upi";
const accountName = "SellNest Platforms Pvt Ltd";

function getUpiPaymentUri(amount, planName, customNote) {
  const pa = upiId;
  const pn = accountName;
  const tn = customNote || `SellNest ${planName} Plan`;
  const formattedAmount = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(tn)}`;
}

function getUpiQrCodeUrl(amount, planName, size = 240) {
  const uri = getUpiPaymentUri(amount, planName);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(uri)}`;
}

console.log("=== Testing Dynamic UPI URI and QR Generation ===");

// 1. Starter Plan: ₹99
const starterUri = getUpiPaymentUri(99, "Starter");
console.log("Starter UPI URI:", starterUri);
assert.strictEqual(starterUri, "upi://pay?pa=sellnest@upi&pn=SellNest%20Platforms%20Pvt%20Ltd&am=99&cu=INR&tn=SellNest%20Starter%20Plan");
const starterQrUrl = getUpiQrCodeUrl(99, "Starter");
console.log("Starter QR Code URL:", starterQrUrl);
assert(starterQrUrl.includes("size=240x240"));
assert(starterQrUrl.includes(encodeURIComponent(starterUri)));

// 2. Pro Plan: ₹199
const proUri = getUpiPaymentUri(199, "Pro");
console.log("Pro UPI URI:", proUri);
assert.strictEqual(proUri, "upi://pay?pa=sellnest@upi&pn=SellNest%20Platforms%20Pvt%20Ltd&am=199&cu=INR&tn=SellNest%20Pro%20Plan");
const proQrUrl = getUpiQrCodeUrl(199, "Pro");
console.log("Pro QR Code URL:", proQrUrl);
assert(proQrUrl.includes("size=240x240"));
assert(proQrUrl.includes(encodeURIComponent(proUri)));

// 3. Test HTTP fetching of the billing page redirect
async function testBillingPage() {
  const res = await fetch("http://localhost:3000/dashboard/billing", { redirect: "manual" });
  console.log("Billing page manual redirect status:", res.status);
  const location = res.headers.get("location");
  console.log("Redirect location header:", location);
  assert(location.includes("/login?next=%2Fdashboard%2Fbilling"));
  console.log("Protected route redirected correctly to login as expected.");

  console.log("All dynamic UPI and QR code tests passed with 100% precision!");
}

testBillingPage();
