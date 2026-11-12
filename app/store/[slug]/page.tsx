"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Store as StoreIcon,
  Loader2,
  AlertCircle,
  Eye,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Store, Product } from "@/lib/types";
import { getStoreBySlug, getStoreProducts } from "@/lib/dashboardService";
import StorefrontView from "@/components/storefront/StorefrontView";

function StorefrontContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params.slug as string)?.toLowerCase() || "";
  const isPreviewMode = searchParams.get("preview") === "draft";

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnpublished, setIsUnpublished] = useState(false);

  useEffect(() => {
    async function loadStore() {
      setLoading(true);
      try {
        const { store: fetchedStore, isUnpublished: unpublishedFlag } = await getStoreBySlug(
          slug,
          isPreviewMode
        );

        if (!fetchedStore) {
          setStore(null);
          setIsUnpublished(false);
          setLoading(false);
          return;
        }

        if (unpublishedFlag && !isPreviewMode) {
          setStore(fetchedStore);
          setIsUnpublished(true);
          setLoading(false);
          return;
        }

        setStore(fetchedStore);
        setIsUnpublished(false);

        const prods = await getStoreProducts(fetchedStore.id);
        setProducts(prods);
      } catch (err) {
        console.error("Error loading storefront:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadStore();
    }
  }, [slug, isPreviewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-medium">Loading storefront...</p>
      </div>
    );
  }

  // 1. Store Not Found
  if (!store && !loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Store Not Found</h2>
        <p className="text-sm text-zinc-500 max-w-md mt-2 leading-relaxed">
          There is no live storefront registered at{" "}
          <span className="font-mono font-medium text-zinc-800">sellnest.com/store/{slug}</span>.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-xs"
          >
            Claim this URL & Build Store
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            Explore SellNest
          </Link>
        </div>
      </div>
    );
  }

  // 2. Store is Unpublished / Coming Soon
  if (isUnpublished && store) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-900/10 shadow-sm space-y-4">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name}
              className="w-16 h-16 rounded-full mx-auto object-cover border border-amber-900/10 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl mx-auto border border-amber-200">
              {store.name?.charAt(0) || "S"}
            </div>
          )}

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Coming Soon / Currently Offline</span>
            </span>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight pt-2">{store.name}</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {store.description || "The store owner is curating their menu and will be live shortly."}
            </p>
          </div>

          {store.whatsapp_number && (
            <div className="pt-2">
              <a
                href={`https://wa.me/${store.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                <span>Inquire on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <Link href={`/store/${slug}?preview=draft`} className="text-purple-600 hover:underline">
              Owner Preview (Draft Mode)
            </Link>
            <Link href="/" className="hover:text-zinc-600">
              Powered by SellNest
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Draft Preview Bar for Sellers */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-amber-500 text-zinc-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-zinc-900" />
            <span>Storefront Draft Preview Mode — Changes are not yet visible to the public.</span>
          </div>
          <Link
            href="/dashboard/appearance"
            className="px-3 py-1 bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors text-[11px]"
          >
            Back to Editor
          </Link>
        </div>
      )}

      {store && <StorefrontView store={store} products={products} />}
    </>
  );
}

export default function PublicStorefrontPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-xs text-zinc-500 font-medium">Loading storefront...</p>
        </div>
      }
    >
      <StorefrontContent />
    </Suspense>
  );
}
