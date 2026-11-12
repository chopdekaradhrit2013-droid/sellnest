"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  MapPin,
  ChevronDown,
  Loader2,
  Plus,
  X,
  ExternalLink,
  Eye,
  Package,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import { getStoreOrders, updateOrderStatus, createOrder } from "@/lib/dashboardService";
import { Order, OrderStatus } from "@/lib/types";
import { formatINR, getWhatsAppUrl } from "@/lib/utils";

export default function OrdersPage() {
  const { store, loading: storeLoading } = useDashboard();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Test Order Modal
  const [isTestOrderModalOpen, setIsTestOrderModalOpen] = useState(false);
  const [custName, setCustName] = useState("Karan Malhotra");
  const [custPhone, setCustPhone] = useState("+91 98112 34567");
  const [custAddress, setCustAddress] = useState("Apt 402, Lotus Greens, Indiranagar, Bengaluru");
  const [custCity, setCustCity] = useState("Bengaluru");
  const [custState, setCustState] = useState("Karnataka");
  const [custPincode, setCustPincode] = useState("560038");
  const [custNotes, setCustNotes] = useState("Deliver before 4 PM. Call upon arrival.");
  const [orderAmount, setOrderAmount] = useState("760");
  const [orderItemName, setOrderItemName] = useState("2x Pistachio Cruffins, 1x Country Sourdough");
  const [creatingOrder, setCreatingOrder] = useState(false);

  const loadOrders = async () => {
    if (!store?.id) return;
    setLoading(true);
    try {
      const data = await getStoreOrders(store.id);
      setOrders(data);
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      loadOrders();
    }
  }, [store?.id]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.error("Status update error:", e);
      await loadOrders(); // Rollback if failed
    }
  };

  const handleCreateTestOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;

    setCreatingOrder(true);
    try {
      const total = parseFloat(orderAmount) || 500;
      await createOrder(
        store.id,
        {
          order_code: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
          customer_name: custName.trim(),
          customer_phone: custPhone.trim(),
          delivery_address: custAddress.trim(),
          city: custCity.trim(),
          state: custState.trim(),
          pincode: custPincode.trim(),
          notes: custNotes.trim(),
          subtotal_amount: total,
          delivery_fee: 0,
          total_amount: total,
          status: "pending",
        },
        [
          {
            product_name: orderItemName.trim(),
            quantity: 1,
            unit_price: total,
          },
        ]
      );
      setIsTestOrderModalOpen(false);
      await loadOrders();
    } catch (e) {
      console.error("Failed to create test order:", e);
    } finally {
      setCreatingOrder(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus = statusTab === "all" || ord.status === statusTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ord.customer_name.toLowerCase().includes(q) ||
        (ord.customer_phone && ord.customer_phone.includes(q)) ||
        (ord.order_code && ord.order_code.toLowerCase().includes(q)) ||
        (ord.order_number && ord.order_number.toString().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  if (storeLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading orders...</p>
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
              Orders Management
            </h1>
            <span className="text-xs font-semibold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              {orders.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Track customer storefront checkouts, manage kitchen fulfillment, and update delivery statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadOrders}
            className="p-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-charcoal-700 rounded-xl transition-colors shadow-xs"
            title="Refresh orders"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsTestOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-purple-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log / Test Order</span>
          </button>
        </div>
      </div>

      {/* Status Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold scrollbar-none">
          {[
            { id: "all", label: "All Orders", count: counts.all },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed },
            { id: "processing", label: "Processing", count: counts.processing },
            { id: "completed", label: "Completed", count: counts.completed },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap text-xs ${
                statusTab === tab.id
                  ? "bg-charcoal-900 text-white shadow-xs font-bold"
                  : "bg-white text-charcoal-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  statusTab === tab.id ? "bg-white/20 text-white" : "bg-stone-100 text-charcoal-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, phone, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 shadow-xs"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/90 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900 mb-1">No orders found</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4 leading-relaxed">
            {orders.length === 0
              ? "When shoppers checkout on your SellNest storefront, orders will appear here in real-time."
              : "No orders match the selected filter."}
          </p>
          <button
            type="button"
            onClick={() => setIsTestOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a Test Order</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const cleanPhone = ord.customer_phone?.replace(/[^0-9]/g, "");
            const displayCode = ord.order_code || (ord.order_number ? `SN-${ord.order_number}` : ord.id.slice(0, 8));

            return (
              <div
                key={ord.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all space-y-4"
              >
                {/* Top Row: Order Code, Date & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-charcoal-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {displayCode}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-charcoal-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-colors ${
                        ord.status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : ord.status === "processing"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : ord.status === "confirmed"
                          ? "bg-purple-50 text-purple-800 border-purple-300"
                          : ord.status === "cancelled"
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Main Row: Customer info & Items summary */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Customer Information */}
                  <div className="md:col-span-5 space-y-1">
                    <h3 className="font-bold text-sm text-charcoal-950 flex items-center gap-2">
                      <span>{ord.customer_name}</span>
                    </h3>

                    {ord.customer_phone && (
                      <div className="flex items-center gap-2 text-xs text-charcoal-600">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono">{ord.customer_phone}</span>
                        {cleanPhone && (
                          <a
                            href={getWhatsAppUrl(
                              ord.customer_phone,
                              `Hello ${ord.customer_name}! Regarding your order ${displayCode} from ${store?.name}...`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5 ml-1"
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    )}

                    {ord.delivery_address && (
                      <div className="flex items-start gap-1.5 text-xs text-charcoal-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {[ord.delivery_address, ord.city, ord.state, ord.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="md:col-span-4 bg-stone-50/70 p-3 rounded-xl border border-stone-200/60 text-xs space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400 block">
                      Ordered Products
                    </span>
                    {ord.items && ord.items.length > 0 ? (
                      <div className="space-y-0.5">
                        {ord.items.slice(0, 2).map((it, idx) => (
                          <p key={idx} className="font-medium text-charcoal-800 truncate">
                            {it.product_name} &times; {it.quantity}
                          </p>
                        ))}
                        {ord.items.length > 2 && (
                          <p className="text-[11px] text-purple-700 font-semibold">
                            +{ord.items.length - 2} more items...
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-charcoal-600 italic">Custom artisan order</p>
                    )}
                  </div>

                  {/* Total & Detail trigger */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2">
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-stone-400 block uppercase">
                        Order Amount
                      </span>
                      <span className="text-lg font-bold text-charcoal-950">
                        {formatINR(ord.total_amount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Notes if any */}
                {ord.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                    <span className="font-bold">Customer Note:</span> {ord.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {selectedOrder.order_code || `SN-${selectedOrder.order_number}`}
                </span>
                <h3 className="font-bold text-charcoal-900 text-base mt-1">
                  Order Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Change Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <span className="text-xs font-bold text-charcoal-700">Update Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Details */}
            <div className="text-xs space-y-1.5">
              <h4 className="font-bold text-charcoal-900 uppercase tracking-wider text-[11px] text-stone-400">
                Customer & Delivery
              </h4>
              <p className="font-semibold text-charcoal-900 text-sm">{selectedOrder.customer_name}</p>
              {selectedOrder.customer_phone && (
                <p className="text-charcoal-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{selectedOrder.customer_phone}</span>
                </p>
              )}
              {selectedOrder.customer_email && (
                <p className="text-charcoal-600">Email: {selectedOrder.customer_email}</p>
              )}
              <p className="text-charcoal-600 flex items-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  {[
                    selectedOrder.delivery_address,
                    selectedOrder.city,
                    selectedOrder.state,
                    selectedOrder.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
              {selectedOrder.notes && (
                <p className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 mt-1">
                  <strong>Notes:</strong> {selectedOrder.notes}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="border-t border-stone-100 pt-3 space-y-2">
              <h4 className="font-bold text-charcoal-900 uppercase tracking-wider text-[11px] text-stone-400">
                Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-charcoal-900">{it.product_name}</p>
                      <p className="text-[11px] text-stone-400">
                        {it.quantity} &times; {formatINR(it.unit_price)}
                      </p>
                    </div>
                    <span className="font-bold text-charcoal-900">
                      {formatINR(it.total_price || it.unit_price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-extrabold text-sm text-charcoal-950">
                <span>Total Amount:</span>
                <span className="text-purple-700">{formatINR(selectedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            {selectedOrder.customer_phone && (
              <a
                href={getWhatsAppUrl(
                  selectedOrder.customer_phone,
                  `Hello ${selectedOrder.customer_name}! Your order ${selectedOrder.order_code || selectedOrder.order_number} is now ${selectedOrder.status}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Customer on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* CREATE / LOG TEST ORDER MODAL */}
      {isTestOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsTestOrderModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-charcoal-900 text-base">Log / Test Order</h3>
              <button
                onClick={() => setIsTestOrderModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTestOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">City</label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">State</label>
                  <input
                    type="text"
                    value={custState}
                    onChange={(e) => setCustState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">PIN</label>
                  <input
                    type="text"
                    value={custPincode}
                    onChange={(e) => setCustPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Items Summary *</label>
                <input
                  type="text"
                  required
                  value={orderItemName}
                  onChange={(e) => setOrderItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Total Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <button
                type="submit"
                disabled={creatingOrder}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs"
              >
                {creatingOrder ? "Recording Order..." : "Create Test Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
