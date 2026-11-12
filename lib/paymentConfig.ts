/**
 * SellNest Manual Payment Configuration
 * Centralized, configurable settings for manual payment verification workflow.
 * Do not hardcode account details elsewhere in the application.
 */

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
}

export interface PaymentConfig {
  paymentMethod: string;
  upiId: string;
  upiQrCodeUrl?: string;
  bankDetails: BankDetails;
  paymentInstructions: string[];
  supportEmail: string;
  processingPromiseHours: number;
  adminEmails: string[];
}

export const PAYMENT_CONFIG: PaymentConfig = {
  // Configurable payment method label
  paymentMethod:
    process.env.NEXT_PUBLIC_PAYMENT_METHOD || "UPI / Direct Bank Transfer (IMPS/NEFT)",

  // Configurable UPI ID
  upiId: process.env.NEXT_PUBLIC_PAYMENT_UPI_ID || "sellnest@upi",

  // Configurable Bank Details
  bankDetails: {
    accountName: process.env.PAYMENT_ACCOUNT_NAME || "SellNest Platforms Pvt Ltd",
    accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || "50200084920194",
    ifscCode: process.env.PAYMENT_IFSC || "HDFC0001234",
    bankName: process.env.PAYMENT_BANK_NAME || "HDFC Bank",
    branchName: process.env.PAYMENT_BRANCH_NAME || "Indiranagar, Bengaluru",
  },

  // Step-by-step payment instructions
  paymentInstructions: [
    "Open your preferred UPI app (Google Pay, PhonePe, Paytm, BHIM) or Net Banking portal.",
    "Transfer the exact plan amount to the official SellNest UPI ID or Bank Account provided.",
    "Copy or screenshot the 12-digit UTR (Unique Transaction Reference) / Bank Reference Number.",
    "Fill in your transaction reference and payment date in the verification form below.",
    "Attach an optional payment screenshot to accelerate manual verification.",
    "Our admin team will verify your transaction against bank records and activate your plan within 24 hours.",
  ],

  // Configurable support contact
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "chopdekaradhrit2013@gmail.com",

  // Turnaround promise
  processingPromiseHours: 24,

  // Authorized Admin emails
  adminEmails: [
    "chopdekaradhrit2013@gmail.com",
    (process.env.ADMIN_EMAIL || "").toLowerCase(),
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase(),
  ].filter(Boolean),
};

/**
 * Check if an email address belongs to an authorized administrator
 */
export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return PAYMENT_CONFIG.adminEmails.some((adminEmail) => adminEmail.toLowerCase().trim() === clean);
}

