"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/types";
import { EVENT_PREFIX, STORAGE_KEYS } from "./constants";

function subscribe(key: string, callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(`${EVENT_PREFIX}${key}`, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(`${EVENT_PREFIX}${key}`, handler);
    window.removeEventListener("storage", handler);
  };
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.cart);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(`elda:update:${STORAGE_KEYS.cart}`));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
    return subscribe(STORAGE_KEYS.cart, () => setItems(readCart()));
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    writeCart(next);
    setItems(next);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      const current = readCart();
      const existing = current.find((i) => i.productId === product.id);
      let next: CartItem[];
      if (existing) {
        next = current.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        next = [
          ...current,
          {
            productId: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            price: product.price,
            quantity,
          },
        ];
      }
      persist(next);
    },
    [persist]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const current = readCart();
      if (quantity <= 0) {
        persist(current.filter((i) => i.productId !== productId));
        return;
      }
      persist(
        current.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    },
    [persist]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      persist(readCart().filter((i) => i.productId !== productId));
    },
    [persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, itemCount, addToCart, updateQuantity, removeFromCart, clearCart }),
    [items, itemCount, addToCart, updateQuantity, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
