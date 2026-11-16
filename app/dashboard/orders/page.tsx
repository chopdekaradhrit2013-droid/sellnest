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
  Printer,
  FileText,
  Gift,
  Heart,
  QrCode,
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
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

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

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReceiptOrder(ord)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        title="Print / Share Order Bill"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Baker & Maker Delivery Schedule & Cake Note Banner */}
                {(ord.delivery_date || ord.custom_message || (ord.dietary_preference && ord.dietary_preference !== "Standard")) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-stone-100 text-xs">
                    {ord.delivery_date && (
                      <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                        <Calendar className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>Schedule: <strong>{ord.delivery_date}</strong> {ord.delivery_slot ? `• ${ord.delivery_slot}` : ""}</span>
                      </span>
                    )}
                    {ord.custom_message && (
                      <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-800 border border-pink-200 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                        <Gift className="w-3 h-3 text-pink-600 shrink-0" />
                        <span>Cake Note: <em>&ldquo;{ord.custom_message}&rdquo;</em></span>
                      </span>
                    )}
                    {ord.dietary_preference && ord.dietary_preference !== "Standard" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        {ord.dietary_preference}
                      </span>
                    )}
                    {ord.discount_amount && ord.discount_amount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                        Coupon: {ord.promo_code || "DISCOUNT"} (-{formatINR(ord.discount_amount)})
                      </span>
                    )}
                  </div>
                )}

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

              {/* Delivery Schedule & Cake Customization Cards */}
              {(selectedOrder.delivery_date || selectedOrder.custom_message) && (
                <div className="pt-2 space-y-2">
                  {selectedOrder.delivery_date && (
                    <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-700" />
                        <div>
                          <span className="font-bold text-purple-950 block">Delivery Scheduled:</span>
                          <span className="text-[11px] text-purple-700">
                            {selectedOrder.delivery_date} {selectedOrder.delivery_slot ? `• ${selectedOrder.delivery_slot}` : ""}
                          </span>
                        </div>
                      </div>
                      {selectedOrder.dietary_preference && selectedOrder.dietary_preference !== "Standard" && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                          {selectedOrder.dietary_preference}
                        </span>
                      )}
                    </div>
                  )}

                  {selectedOrder.custom_message && (
                    <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-200 flex items-start gap-2 text-xs">
                      <Gift className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-pink-950 block">Message on Cake / Greeting:</span>
                        <span className="text-[11px] text-pink-800 italic">&ldquo;{selectedOrder.custom_message}&rdquo;</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

            {/* Actions: Receipt and WhatsApp */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setReceiptOrder(selectedOrder);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-charcoal-800 font-semibold text-xs bg-stone-100 hover:bg-stone-200 transition-colors shadow-2xs"
              >
                <FileText className="w-4 h-4 text-stone-600" />
                <span>View &amp; Print Order Receipt / Bill</span>
              </button>

              {selectedOrder.customer_phone && (
                <a
                  href={getWhatsAppUrl(
                    selectedOrder.customer_phone,
                    `Hello ${selectedOrder.customer_name}! Your order ${selectedOrder.order_code || selectedOrder.order_number} is now ${selectedOrder.status}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Customer on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT / BILL GENERATOR MODAL */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 print:p-0 print:border-none print:shadow-none">
            {/* Header / Brand */}
            <div className="flex items-start justify-between border-b-2 border-dashed border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Retail Order Receipt
                </span>
                <h3 className="text-xl font-extrabold text-charcoal-950 mt-1">
                  {store?.name || "SellNest Store"}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {store?.email || "Artisanal Baker & Maker"} &bull; WhatsApp: {store?.whatsapp_number || "Active"}
                </p>
              </div>

              <button
                onClick={() => setReceiptOrder(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Order Code</span>
                <span className="font-mono font-bold text-charcoal-900 text-sm">
                  {receiptOrder.order_code || `SN-${receiptOrder.order_number}`}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Order Date</span>
                <span className="font-semibold text-charcoal-800">
                  {new Date(receiptOrder.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-stone-200/50">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Billed To</span>
                <span className="font-bold text-charcoal-950 block">{receiptOrder.customer_name}</span>
                {receiptOrder.customer_phone && (
                  <span className="text-stone-500 block">Phone: {receiptOrder.customer_phone}</span>
                )}
                {receiptOrder.delivery_address && (
                  <span className="text-stone-500 block">
                    {[receiptOrder.delivery_address, receiptOrder.city, receiptOrder.state, receiptOrder.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Scheduled Delivery & Custom Note Highlight */}
            {(receiptOrder.delivery_date || receiptOrder.custom_message) && (
              <div className="space-y-2 text-xs">
                {receiptOrder.delivery_date && (
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-purple-950">
                    <span className="font-bold">
                      📅 Scheduled Delivery: {receiptOrder.delivery_date} {receiptOrder.delivery_slot ? `(${receiptOrder.delivery_slot})` : ""}
                    </span>
                    {receiptOrder.dietary_preference && (
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
                        {receiptOrder.dietary_preference}
                      </span>
                    )}
                  </div>
                )}
                {receiptOrder.custom_message && (
                  <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-900 text-xs">
                    <span className="font-bold">🎂 Cake / Box Inscription:</span> &ldquo;{receiptOrder.custom_message}&rdquo;
                  </div>
                )}
              </div>
            )}

            {/* Itemized Table */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-12 font-bold text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-200 pb-1.5">
                <span className="col-span-7">Item Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-3 text-right">Amount</span>
              </div>
              <div className="divide-y divide-stone-100">
                {(receiptOrder.items || []).map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 py-2 text-charcoal-800">
                    <span className="col-span-7 font-medium truncate">{it.product_name}</span>
                    <span className="col-span-2 text-center text-stone-500">{it.quantity}</span>
                    <span className="col-span-3 text-right font-bold text-charcoal-900">
                      {formatINR(it.total_price || it.unit_price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatINR(receiptOrder.subtotal_amount || receiptOrder.total_amount)}</span>
                </div>
                {receiptOrder.discount_amount && receiptOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({receiptOrder.promo_code || "COUPON"})</span>
                    <span>-{formatINR(receiptOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">
                    {receiptOrder.delivery_fee ? formatINR(receiptOrder.delivery_fee) : "FREE"}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-charcoal-900 flex justify-between font-extrabold text-base text-charcoal-950">
                  <span>Grand Total</span>
                  <span className="text-purple-700">{formatINR(receiptOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* UPI QR & Payment Info */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                  `upi://pay?pa=thebutterroom@okhdfcbank&pn=${encodeURIComponent(store?.name || "SellNest Maker")}&am=${receiptOrder.total_amount}&cu=INR`
                )}`}
                alt="Store Payment QR"
                className="w-16 h-16 rounded-lg bg-white border border-stone-200 p-1 shrink-0"
              />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-charcoal-900 block">Instant UPI Payment</span>
                <p className="text-[11px] text-stone-500">Scan via GPay, PhonePe, or Paytm to pay {formatINR(receiptOrder.total_amount)}.</p>
                <span className="font-mono text-[10px] text-purple-700 font-bold block">Status: {receiptOrder.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Action Buttons (Hidden on Print) */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-stone-100 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-charcoal-900 hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill / Save PDF</span>
              </button>

              {receiptOrder.customer_phone && (
                <a
                  href={getWhatsAppUrl(
                    receiptOrder.customer_phone,
                    `*Order Bill - ${store?.name}*\n🧾 Order Ref: ${receiptOrder.order_code || `SN-${receiptOrder.order_number}`}\n👤 Customer: ${receiptOrder.customer_name}\n💵 Total Amount: ₹${receiptOrder.total_amount}\n📅 Scheduled: ${receiptOrder.delivery_date || "Standard"}\n\nThank you for supporting our artisanal shop!`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Bill on WhatsApp</span>
                </a>
              )}
            </div>
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
