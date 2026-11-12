"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Loader2,
  Search,
  Filter,
  Info,
  Calendar,
  ExternalLink,
  Zap,
} from "lucide-react";
import { EmailDeliveryLog } from "@/lib/types";

export default function AdminEmailLogsPage() {
  const [logs, setLogs] = useState<EmailDeliveryLog[]>([]);
  const [config, setConfig] = useState<{ isConfigured: boolean; provider: string; fromEmail: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Test Email state
  const [testEmailTo, setTestEmailTo] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEmailLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/emails/logs?limit=100");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setConfig(data.config || null);
      }
    } catch (err) {
      console.error("Failed to fetch email logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo.trim()) return;

    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailTo.trim() }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setTestResult({ type: "error", text: data.error || "Failed to trigger test email." });
      } else {
        setTestResult({
          type: "success",
          text: data.message || "Test email processed successfully.",
        });
        await fetchEmailLogs();
      }
    } catch (err: any) {
      setTestResult({ type: "error", text: err.message || "Network error occurred." });
    } finally {
      setSendingTest(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.recipient_email.toLowerCase().includes(q) ||
      log.template_type.toLowerCase().includes(q) ||
      log.subject.toLowerCase().includes(q) ||
      (log.error_details && log.error_details.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "sent" && log.status === "sent") ||
      (statusFilter === "simulated" && (log.status === "simulated_dev" || log.status === "skipped_missing_credentials")) ||
      (statusFilter === "failed" && log.status === "failed");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Transactional Email Engine
            </span>
            <span className="text-xs text-charcoal-400">Total Logs: {logs.length}</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight mt-1">
            Email Delivery & Audit
          </h1>
          <p className="text-xs text-charcoal-600">
            Real transactional emails sent to sellers, customers, and administrators with Resend delivery diagnostics.
          </p>
        </div>

        <button
          onClick={fetchEmailLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
          Refresh Logs
        </button>
      </div>

      {/* Provider Status Diagnostic Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle ${
          config?.isConfigured
            ? "bg-emerald-50/70 border-emerald-200"
            : "bg-amber-50/70 border-amber-200"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              config?.isConfigured
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {config?.isConfigured ? <Zap className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-charcoal-950">
                Resend Email Gateway: {config?.isConfigured ? "Connected (Live)" : "Safe Development Simulation"}
              </h3>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border ${
                  config?.isConfigured
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {config?.isConfigured ? "Ready" : "Credentials Missing"}
              </span>
            </div>
            <p className="text-xs text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              {config?.isConfigured
                ? `Active sender: "${config.fromEmail}". Real transactional emails will be dispatched to customer and seller inboxes.`
                : `RESEND_API_KEY is not set in environment variables. SellNest is logging all email dispatches to this table in simulated mode. In-app notifications remain fully functional.`}
            </p>
          </div>
        </div>

        {/* Quick Test Form */}
        <form onSubmit={handleSendTestEmail} className="flex items-center gap-2 flex-shrink-0">
          <input
            type="email"
            placeholder="recipient@example.com"
            value={testEmailTo}
            onChange={(e) => setTestEmailTo(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-purple-600 w-48 sm:w-56"
            required
          />
          <button
            type="submit"
            disabled={sendingTest}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-subtle disabled:opacity-50"
          >
            {sendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Send Test
          </button>
        </form>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            testResult.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <span>{testResult.text}</span>
          <button onClick={() => setTestResult(null)} className="underline font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by recipient email, template name, subject, or error details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          {(
            [
              { id: "all", label: "All Logs" },
              { id: "sent", label: "Sent (Live)" },
              { id: "simulated", label: "Simulated Dev" },
              { id: "failed", label: "Failed" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === tab.id
                  ? "bg-white text-charcoal-950 shadow-subtle"
                  : "text-charcoal-600 hover:text-charcoal-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Delivery Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-xs font-bold text-charcoal-500">Loading email delivery audit logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-charcoal-900">No email delivery logs recorded</p>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              Transactional email dispatches will appear here with delivery timestamps and status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Template / Event</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-charcoal-700">
                {filteredLogs.map((log) => {
                  const date = new Date(log.created_at);
                  const formattedDate = date.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  });
                  const formattedTime = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-charcoal-900 font-mono">{formattedDate}</div>
                        <div className="text-[10px] text-charcoal-400 font-mono">{formattedTime}</div>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-charcoal-900 font-bold">{log.recipient_email}</div>
                        <div className="text-[10px] font-bold uppercase text-charcoal-400">
                          Role: {log.recipient_type}
                        </div>
                      </td>

                      {/* Template */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          {log.template_type}
                        </span>
                        <div className="text-[10px] text-charcoal-400 font-mono mt-0.5">
                          {log.event_type}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-charcoal-800 font-medium">
                        {log.subject}
                      </td>

                      {/* Provider */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] uppercase font-bold text-charcoal-600">
                          {log.provider}
                        </span>
                        {log.provider_message_id && (
                          <div className="text-[10px] font-mono text-stone-400 truncate max-w-[120px]">
                            ID: {log.provider_message_id}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {log.status === "sent" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Sent
                          </span>
                        ) : log.status === "failed" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              Failed
                            </span>
                            {log.error_details && (
                              <p className="text-[10px] text-red-600 mt-1 max-w-xs leading-tight">
                                {log.error_details}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <Info className="w-3 h-3" />
                            Simulated Dev
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

