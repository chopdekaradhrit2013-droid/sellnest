"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { getStoreCustomers } from "@/lib/dashboardService";
import { Customer } from "@/lib/types";
import { formatINR, getWhatsAppUrl } from "@/lib/utils";

export default function CustomersPage() {
  const { store, loading: storeLoading } = useDashboard();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = async () => {
    if (!store?.id) return;
    setLoading(true);
    try {
      const data = await getStoreCustomers(store.id);
      setCustomers(data);
    } catch (e) {
      console.error("Failed to load customers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      loadCustomers();
    }
  }, [store?.id]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [customers, searchQuery]);

  const totalSpentAll = customers.reduce((sum, c) => sum + Number(c.total_spent), 0);
  const repeatCount = customers.filter((c) => c.total_orders > 1).length;
  const avgOrderValue = customers.length > 0 ? totalSpentAll / customers.length : 0;

  if (storeLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading customer directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Customers
            </h1>
            <span className="text-xs font-semibold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              {customers.length} buyers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            People who have placed orders on your store. Message buyers directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Customer Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1">
            Total Unique Buyers
          </div>
          <div className="text-2xl font-bold text-charcoal-900">{customers.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1">
            Repeat Customers
          </div>
          <div className="text-2xl font-bold text-purple-800">{repeatCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1">
            Avg Customer Lifetime Value
          </div>
          <div className="text-2xl font-bold text-emerald-700">{formatINR(avgOrderValue)}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, phone, address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 shadow-xs"
        />
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/90 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900 mb-1">No customers yet</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
            As soon as shoppers place an order on your storefront or test orders are logged, customer profiles will automatically build here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3.5 pl-6">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Delivery Address</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 pr-6 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone?.replace(/[^0-9]/g, "");

                  return (
                    <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-900 text-sm">{cust.name}</div>
                            {cust.total_orders > 1 && (
                              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                                Repeat Buyer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {cust.phone && (
                            <div className="flex items-center gap-1.5 text-charcoal-700">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span>{cust.phone}</span>
                              {cleanPhone && (
                                <a
                                  href={getWhatsAppUrl(cust.phone)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1 text-[11px] ml-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>Chat</span>
                                </a>
                              )}
                            </div>
                          )}
                          {cust.email && (
                            <div className="flex items-center gap-1.5 text-charcoal-500 text-[11px]">
                              <Mail className="w-3 h-3 text-stone-400" />
                              <span>{cust.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-charcoal-600 text-[11px] max-w-xs">
                        {cust.address ? (
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{cust.address}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-stone-100 rounded-full font-bold text-charcoal-900">
                          {cust.total_orders}
                        </span>
                      </td>

                      <td className="py-4 pr-6 text-right font-black text-sm text-charcoal-950 font-sans">
                        {formatINR(cust.total_spent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

