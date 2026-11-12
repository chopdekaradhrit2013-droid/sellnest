"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { useDashboard } from "@/lib/DashboardContext";
import {
  getStoreProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  populateSampleDataIfEmpty,
} from "@/lib/dashboardService";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { canAddProduct, PLANS } from "@/lib/plans";

export default function ProductsPage() {
  const { store, plan, loading: storeLoading } = useDashboard();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive, out_of_stock
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "stock">("newest");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const planCheck = canAddProduct(plan?.id || "free", products.length);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Artisan Breads");
  const [imageUrl, setImageUrl] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [isActive, setIsActive] = useState(true);
  const [isEggless, setIsEggless] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadProducts = async () => {
    if (!store?.id) return;
    setLoading(true);
    try {
      const data = await getStoreProducts(store.id);
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      loadProducts();
    }
  }, [store?.id]);

  // Open modal for Create
  const handleOpenCreate = () => {
    if (!planCheck.allowed) {
      setShowUpgradeModal(true);
      return;
    }
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Artisan Breads");
    setImageUrl("");
    setStockQuantity("12");
    setIsActive(true);
    setIsEggless(false);
    setIsModalOpen(true);
    setActionError(null);
  };

  // Open modal for Edit
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description || "");
    setPrice(prod.price.toString());
    setCategory(prod.category || "General");
    setImageUrl(prod.image_url || "");
    setStockQuantity(prod.stock_quantity.toString());
    setIsActive(prod.is_active);
    setIsEggless(prod.is_eggless || false);
    setIsModalOpen(true);
    setActionError(null);
  };

  // Handle Form Submit (Add / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;

    const numPrice = parseFloat(price);
    const numStock = parseInt(stockQuantity, 10);

    if (!name.trim()) {
      setActionError("Product name is required.");
      return;
    }

    if (isNaN(numPrice) || numPrice < 0) {
      setActionError("Please enter a valid price in INR.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      if (editingProduct) {
        // Update product
        const { error } = await updateProduct(editingProduct.id, {
          name: name.trim(),
          description: description.trim(),
          price: numPrice,
          category: category.trim(),
          image_url: imageUrl.trim() || undefined,
          stock_quantity: isNaN(numStock) ? 0 : numStock,
          is_active: isActive,
          is_eggless: isEggless,
        });

        if (error) {
          setActionError(error);
        } else {
          setIsModalOpen(false);
          setActionSuccess("Product updated successfully!");
          await loadProducts();
          setTimeout(() => setActionSuccess(null), 3000);
        }
      } else {
        // Create product
        const { error, limitReached } = await createProduct(store.id, {
          name: name.trim(),
          description: description.trim(),
          price: numPrice,
          category: category.trim(),
          image_url:
            imageUrl.trim() ||
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
          stock_quantity: isNaN(numStock) ? 0 : numStock,
          is_active: isActive,
          is_eggless: isEggless,
        });

        if (limitReached) {
          setActionError(error || "Product limit reached for your current plan.");
          setShowUpgradeModal(true);
        } else if (error) {
          setActionError(error);
        } else {
          setIsModalOpen(false);
          setActionSuccess("New product added to your storefront!");
          await loadProducts();
          setTimeout(() => setActionSuccess(null), 3000);
        }
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const { success, error } = await deleteProduct(id);
      if (success) {
        setDeleteConfirmId(null);
        setActionSuccess("Product deleted successfully.");
        await loadProducts();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(error || "Could not delete product");
      }
    } catch (err: any) {
      setActionError(err.message || "Delete failed");
    }
  };

  // Filter & Sort Logic
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === "all" || p.category === selectedCategory;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && p.is_active && p.stock_quantity > 0) ||
          (statusFilter === "inactive" && !p.is_active) ||
          (statusFilter === "out_of_stock" && p.stock_quantity <= 0);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "stock") return b.stock_quantity - a.stock_quantity;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy]);

  if (storeLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-charcoal-500">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-950 tracking-tight">
              Products
            </h1>
            <span className="text-xs font-semibold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              {products.length} / {isFinite(plan?.limits.maxProducts || 10) ? (plan?.limits.maxProducts || 10) : "∞"} items ({plan?.name || "Free"} Plan)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Manage your catalog, prices in INR, dietary tags, and stock inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className={`inline-flex items-center gap-2 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs ${
              !planCheck.allowed
                ? "bg-stone-800 hover:bg-stone-900"
                : "bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-purple-glow hover:shadow-purple-glow-lg"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Limit Upgrade Banner */}
      {!planCheck.allowed && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">{planCheck.reason}</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Upgrade to Starter or Pro to continue expanding your menu and taking more orders.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Plan</span>
          </Link>
        </div>
      )}

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Controls Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal-700 focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal-700 focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active & In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="inactive">Hidden / Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal-700 focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock">Highest Stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/90 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900 mb-1">No products found</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-5 leading-relaxed">
            {products.length === 0
              ? "Your catalog is empty. Add your first handcrafted product or sample bakes to launch your store."
              : "No products match your current search and filter criteria."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white rounded-2xl border border-stone-200/90 shadow-card hover:shadow-card-hover hover:border-purple-200 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Package className="w-10 h-10" />
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {prod.is_eggless && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                        Eggless
                      </span>
                    )}
                    {prod.stock_quantity <= 0 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                        Sold Out
                      </span>
                    ) : prod.stock_quantity <= 5 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                        Low Stock ({prod.stock_quantity})
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60 inline-block mb-1.5">
                    {prod.category}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900 group-hover:text-purple-900 transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-charcoal-500 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal-400 block uppercase">Price</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {formatINR(prod.price)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="p-2 rounded-xl text-charcoal-600 hover:text-purple-700 hover:bg-purple-50 border border-stone-200 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(prod.id)}
                    className="p-2 rounded-xl text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <p className="text-[11px] text-charcoal-500">
                    Display item on your SellNest storefront
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-charcoal-700 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardamom & Brown Butter Blondies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Category & Price Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastries or Cakes"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                    Price in INR (₹) *
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-300 px-3 py-2 bg-stone-50/50 focus-within:border-purple-600 focus-within:bg-white">
                    <span className="text-charcoal-400 font-bold mr-1.5">₹</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1}
                      placeholder="350"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-charcoal-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                  Available Stock Units
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="12"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  placeholder="36-hour cold fermented sourdough, French butter, Callebaut chocolate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-purple-600"
                />
                {/* Preset Bakery Image Pills */}
                <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] text-charcoal-500">
                  <span>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80")
                    }
                    className="text-purple-700 underline"
                  >
                    Sourdough
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80")
                    }
                    className="text-purple-700 underline"
                  >
                    Cruffin
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80")
                    }
                    className="text-purple-700 underline"
                  >
                    Cheesecake
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80")
                    }
                    className="text-purple-700 underline"
                  >
                    Blondie
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEggless}
                    onChange={(e) => setIsEggless(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 border-stone-300"
                  />
                  <span className="font-semibold text-charcoal-800">100% Eggless Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 border-stone-300"
                  />
                  <span className="font-semibold text-charcoal-800">Active in Storefront</span>
                </label>
              </div>

              {/* Footer submit */}
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-charcoal-600 hover:bg-stone-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-semibold flex items-center gap-1.5 shadow-purple-glow"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-charcoal-900">Delete Product?</h4>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Are you sure you want to remove this product from your store? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-charcoal-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE PROMPT MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Plan Limit Reached
                </span>
                <h3 className="text-lg font-bold text-charcoal-950 mt-1">
                  Ready to expand your catalog?
                </h3>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              You are currently on the <strong className="text-charcoal-900">{plan?.name || "Free"} plan</strong> with a limit of {plan?.limits.maxProducts || 10} products. Upgrade to add more products and unlock premium themes & analytics.
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal-900">Starter Plan (₹99/mo)</span>
                <span className="text-purple-700 font-semibold">Up to 100 products</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal-900">Pro Plan (₹199/mo)</span>
                <span className="text-emerald-700 font-semibold">Unlimited products</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-charcoal-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Close
              </button>
              <Link
                href="/dashboard/billing"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-purple-glow text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Plans & Billing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

