"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  Store,
  CreditCard,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Code2,
} from "lucide-react";
import { AdminAuditLog } from "@/lib/types";

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [targetFilter, setTargetFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/activity?limit=100");
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.admin_email.toLowerCase().includes(q) ||
      (log.target_name && log.target_name.toLowerCase().includes(q)) ||
      (log.reason && log.reason.toLowerCase().includes(q)) ||
      log.target_id.toLowerCase().includes(q);

    const matchesTarget =
      targetFilter === "all" ||
      (targetFilter === "seller" && log.target_type === "seller") ||
      (targetFilter === "store" && log.target_type === "store") ||
      (targetFilter === "upgrade" && (log.target_type === "upgrade_request" || log.target_type === "subscription")) ||
      (targetFilter === "settings" && log.target_type === "settings");

    return matchesSearch && matchesTarget;
  });

  const getActionBadge = (action: string) => {
    if (action.includes("suspend") || action.includes("unpublish")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (action.includes("reactivate") || action.includes("restore") || action.includes("approve")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (action.includes("reject")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <XCircle className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (action.includes("settings")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
          <Settings className="w-3 h-3" />
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
        <Info className="w-3 h-3" />
        {action}
      </span>
    );
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case "seller":
        return <User className="w-3.5 h-3.5 text-blue-600" />;
      case "store":
        return <Store className="w-3.5 h-3.5 text-purple-600" />;
      case "upgrade_request":
      case "subscription":
        return <CreditCard className="w-3.5 h-3.5 text-emerald-600" />;
      case "settings":
        return <Settings className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-charcoal-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Compliance & Security
            </span>
            <span className="text-xs text-charcoal-400">Total Entries: {logs.length}</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-950 tracking-tight mt-1">
            Admin Activity Audit Log
          </h1>
          <p className="text-xs text-charcoal-600">
            Immutable log of all administrative actions, account suspensions, store moderations, and upgrade verifications.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-charcoal-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition shadow-subtle self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
          Refresh Log
        </button>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search action type, admin email, target record, or moderation reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
            {(
              [
                { id: "all", label: "All Events" },
                { id: "seller", label: "Seller Actions" },
                { id: "store", label: "Store Moderations" },
                { id: "upgrade", label: "Upgrade Requests" },
                { id: "settings", label: "Settings Changes" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTargetFilter(tab.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  targetFilter === tab.id
                    ? "bg-white text-charcoal-950 shadow-subtle"
                    : "text-charcoal-600 hover:text-charcoal-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-xs font-bold text-charcoal-500">Loading audit trail...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center">
            <History className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-charcoal-900">No activity logs recorded</p>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              No administrative events match your filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-black uppercase tracking-wider text-charcoal-500">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Record</th>
                  <th className="py-3.5 px-4">Admin Actor</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-charcoal-700">
                {filteredLogs.map((log) => {
                  const date = new Date(log.created_at);
                  const formattedDate = date.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-charcoal-900 font-mono">{formattedDate}</div>
                        <div className="text-[10px] text-charcoal-400 font-mono">{formattedTime}</div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        {getActionBadge(log.action)}
                      </td>

                      {/* Target Record */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-charcoal-950">
                          {getTargetIcon(log.target_type)}
                          <span>{log.target_name || log.target_id}</span>
                        </div>
                        <div className="text-[10px] text-charcoal-400 font-mono uppercase tracking-wider">
                          Type: {log.target_type}
                        </div>
                      </td>

                      {/* Admin Actor */}
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono text-charcoal-700 font-medium">
                          {log.admin_email}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4 max-w-xs truncate text-charcoal-600">
                        {log.reason ? (
                          <span>{log.reason}</span>
                        ) : (
                          <span className="text-charcoal-400 italic">No notes specified</span>
                        )}
                      </td>

                      {/* Details View */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 text-[11px] font-bold text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg border border-purple-200 transition"
                        >
                          View Payload
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-charcoal-950">Audit Event Metadata</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-charcoal-400 hover:text-charcoal-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-bold text-charcoal-500">Event ID:</span>
                <span className="font-mono text-charcoal-800">{selectedLog.id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-bold text-charcoal-500">Action:</span>
                <span className="font-bold text-purple-700">{selectedLog.action}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-bold text-charcoal-500">Target Type:</span>
                <span className="capitalize text-charcoal-800">{selectedLog.target_type}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-bold text-charcoal-500">Target ID:</span>
                <span className="font-mono text-charcoal-800">{selectedLog.target_id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-bold text-charcoal-500">Admin Email:</span>
                <span className="font-mono text-charcoal-800">{selectedLog.admin_email}</span>
              </div>
              <div className="py-1">
                <span className="font-bold text-charcoal-500">Recorded Reason:</span>
                <p className="mt-1 p-2 bg-stone-50 rounded-lg border border-stone-200 text-charcoal-800">
                  {selectedLog.reason || "None specified"}
                </p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <span className="font-bold text-charcoal-500">Raw Metadata:</span>
                  <pre className="mt-1 p-3 bg-stone-900 text-purple-300 rounded-xl overflow-x-auto text-[11px] font-mono max-h-48">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-charcoal-800 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

