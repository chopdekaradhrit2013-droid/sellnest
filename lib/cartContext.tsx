"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product, CartItem } from "./types";

interface CartContextType {
  storeSlug: string;
  storeName?: string;
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  storeSlug: string;
  storeName?: string;
}

export function CartProvider({ children, storeSlug, storeName }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const storageKey = useMemo(() => {
    const clean = (storeSlug || "default").toLowerCase().trim();
    return `sellnest_cart_${clean}`;
  }, [storeSlug]);

  // Load cart from localStorage for this specific store
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.warn("Could not read cart from localStorage:", e);
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, [storageKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [items, loaded, storageKey]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.product.id === product.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + quantity,
        };
        return copy;
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((it) => it.product.id !== productId);
      }
      return prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it));
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn("Could not clear cart:", e);
      }
    }
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  }, [items]);

  // Delivery fee: Free for orders >= 1000 INR, else 60 INR
  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 1000 ? 0 : 60;
  }, [items, subtotal]);

  const total = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  return (
    <CartContext.Provider
      value={{
        storeSlug,
        storeName,
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

