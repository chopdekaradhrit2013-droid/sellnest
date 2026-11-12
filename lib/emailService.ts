import { EmailDeliveryLog, EmailTemplateType } from "./types";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";

const STORAGE_EMAIL_LOGS = "sellnest_email_delivery_logs";

// In-memory cache for demo/serverless execution
let memoryEmailLogs: EmailDeliveryLog[] = [];

// Helper to get local data safely
function getLocalLogs(): EmailDeliveryLog[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_EMAIL_LOGS);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return memoryEmailLogs;
}

function saveLocalLogs(logs: EmailDeliveryLog[]) {
  memoryEmailLogs = logs;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_EMAIL_LOGS, JSON.stringify(logs.slice(0, 200)));
    } catch {}
  }
}

export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const isConfigured = Boolean(apiKey && apiKey.startsWith("re_"));
  const fromEmail = process.env.EMAIL_FROM || "SellNest <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    isConfigured,
    provider: "resend",
    fromEmail,
    appUrl,
  };
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  templateType: EmailTemplateType | string;
  eventType: string;
  recipientType: "seller" | "customer" | "admin";
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

export async function sendTransactionalEmail(
  params: SendEmailParams
): Promise<{ success: boolean; log: EmailDeliveryLog }> {
  const { isConfigured, fromEmail } = getEmailConfig();
  const cleanTo = (params.to || "").trim().toLowerCase();

  // Basic email syntax validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanTo);
  const logId = "email-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  // Check idempotency in memory to avoid rapid accidental re-dispatches
  if (params.idempotencyKey) {
    const existing = memoryEmailLogs.find(
      (l) => l.metadata?.idempotencyKey === params.idempotencyKey && l.status === "sent"
    );
    if (existing) {
      return { success: true, log: existing };
    }
  }

  // 1. Missing or Invalid Email
  if (!cleanTo || !isValidEmail) {
    const failedLog: EmailDeliveryLog = {
      id: logId,
      recipient_email: cleanTo || "unknown@invalid",
      recipient_type: params.recipientType,
      template_type: params.templateType,
      event_type: params.eventType,
      subject: params.subject,
      provider: "resend",
      status: "failed",
      error_details: "Invalid or empty recipient email address.",
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
      created_at: new Date().toISOString(),
    };
    await recordEmailLog(failedLog);
    return { success: false, log: failedLog };
  }

  // 2. Safe Fallback when RESEND_API_KEY is not configured
  if (!isConfigured) {
    const simulatedLog: EmailDeliveryLog = {
      id: logId,
      recipient_email: cleanTo,
      recipient_type: params.recipientType,
      template_type: params.templateType,
      event_type: params.eventType,
      subject: params.subject,
      provider: "simulated",
      status: "skipped_missing_credentials",
      provider_message_id: undefined,
      error_details: "RESEND_API_KEY environment variable not set. Email delivery simulated for local testing.",
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
      created_at: new Date().toISOString(),
    };

    console.info(`[Email Service Simulation] Skipped real network dispatch for ${cleanTo} (${params.templateType}) - RESEND_API_KEY not configured.`);
    await recordEmailLog(simulatedLog);
    return { success: true, log: simulatedLog };
  }

  // 3. Dispatch to Resend API
  try {
    const resendApiKey = process.env.RESEND_API_KEY!.trim();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [cleanTo],
        subject: params.subject,
        html: params.html,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const failedLog: EmailDeliveryLog = {
        id: logId,
        recipient_email: cleanTo,
        recipient_type: params.recipientType,
        template_type: params.templateType,
        event_type: params.eventType,
        subject: params.subject,
        provider: "resend",
        status: "failed",
        error_details: resData?.message || `Resend API returned status ${response.status}`,
        metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
        created_at: new Date().toISOString(),
      };
      await recordEmailLog(failedLog);
      return { success: false, log: failedLog };
    }

    const sentLog: EmailDeliveryLog = {
      id: logId,
      recipient_email: cleanTo,
      recipient_type: params.recipientType,
      template_type: params.templateType,
      event_type: params.eventType,
      subject: params.subject,
      provider: "resend",
      status: "sent",
      provider_message_id: resData.id,
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
      created_at: new Date().toISOString(),
    };

    await recordEmailLog(sentLog);
    return { success: true, log: sentLog };
  } catch (err: any) {
    const errorLog: EmailDeliveryLog = {
      id: logId,
      recipient_email: cleanTo,
      recipient_type: params.recipientType,
      template_type: params.templateType,
      event_type: params.eventType,
      subject: params.subject,
      provider: "resend",
      status: "failed",
      error_details: err.message || "Network error contacting Resend API.",
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
      created_at: new Date().toISOString(),
    };
    await recordEmailLog(errorLog);
    return { success: false, log: errorLog };
  }
}

async function recordEmailLog(log: EmailDeliveryLog) {
  // Always update memory/local cache
  const local = getLocalLogs();
  local.unshift(log);
  saveLocalLogs(local);

  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const supabase = createClient();
    await supabase.from("email_delivery_logs").insert({
      id: log.id.startsWith("email-") ? undefined : log.id,
      recipient_email: log.recipient_email,
      recipient_type: log.recipient_type,
      template_type: log.template_type,
      event_type: log.event_type,
      subject: log.subject,
      provider: log.provider,
      status: log.status,
      provider_message_id: log.provider_message_id || null,
      error_details: log.error_details || null,
      metadata: log.metadata || {},
      created_at: log.created_at,
    });
  } catch (err) {
    console.warn("Failed to record email log to Supabase:", err);
  }
}

export async function fetchEmailDeliveryLogs(limit = 100): Promise<EmailDeliveryLog[]> {
  if (!isSupabaseConfigured()) {
    return getLocalLogs().slice(0, limit);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("email_delivery_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return getLocalLogs().slice(0, limit);
    }

    return data as EmailDeliveryLog[];
  } catch {
    return getLocalLogs().slice(0, limit);
  }
}

