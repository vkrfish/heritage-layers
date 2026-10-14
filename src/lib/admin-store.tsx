/**
 * admin-store.tsx — Real-time Supabase-backed admin state
 * Replaces the previous localStorage mock store.
 */

import * as React from "react";
import { supabase } from "@/lib/supabase";
import {
  adminFetchProducts,
  adminFetchOrders,
  adminFetchPromoCodes,
  adminFetchAnnouncements,
  adminAddProduct,
  adminUpdateProduct as dbUpdateProduct,
  adminDeleteProduct,
  adminUpdateOrderStatus,
  adminAddPromoCode,
  adminTogglePromoCode,
  adminSetAnnouncements,
  signInAdmin,
  signOutAdmin,
  getAdminSession,
  placeOrder,
} from "@/lib/db";
import type { Product } from "@/lib/products";

// ─────────────────────────────────────────────────────────
// TYPES (kept compatible with existing admin route imports)
// ─────────────────────────────────────────────────────────

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | undefined;
  address: string;
  city: string;
  items: {
    slug: string;
    name: string;
    variant: string;
    price: number;
    qty: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "UPI" | "Card" | "COD";
  status: OrderStatus;
  createdAt: string;
};

export type PromoCode = {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minSubtotal: number;
  isActive: boolean;
};

// ─────────────────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────────────────

type AdminStoreContextType = {
  products: Product[];
  orders: AdminOrder[];
  discounts: PromoCode[];
  announcements: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  addProduct: (product: Omit<Product, "customerReviews">) => Promise<void>;
  updateProduct: (product: Omit<Product, "customerReviews">) => Promise<void>;
  deleteProduct: (slug: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addOrder: (order: Omit<AdminOrder, "id" | "createdAt">) => Promise<AdminOrder>;
  addDiscount: (discount: Omit<PromoCode, "id">) => Promise<void>;
  toggleDiscount: (id: string) => Promise<void>;
  setAnnouncements: (list: string[]) => Promise<void>;
};

// ─────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────

const AdminStoreContext = React.createContext<AdminStoreContextType | null>(null);

// ─────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [discounts, setDiscounts] = React.useState<PromoCode[]>([]);
  const [announcements, setAnnouncementsState] = React.useState<string[]>([]);

  // ── Auth state listener ──────────────────────────────
  React.useEffect(() => {
    // Check existing session on mount
    getAdminSession().then((session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // ── Load data when authenticated ────────────────────
  React.useEffect(() => {
    if (!isAuthenticated) return;

    void Promise.all([
      adminFetchProducts().then(setProducts),
      adminFetchOrders().then(setOrders),
      adminFetchPromoCodes().then(setDiscounts),
      adminFetchAnnouncements().then((rows) =>
        setAnnouncementsState(rows.map((r) => r.text))
      ),
    ]);
  }, [isAuthenticated]);

  // ── Auth ─────────────────────────────────────────────
  const login = React.useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    const result = await signInAdmin(email, password);
    if (!result.success) {
      setLoginError(result.error ?? "Login failed");
      return false;
    }
    return true;
  }, []);

  const logout = React.useCallback(async () => {
    await signOutAdmin();
    setProducts([]);
    setOrders([]);
    setDiscounts([]);
    setAnnouncementsState([]);
  }, []);

  // ── Data refresh ──────────────────────────────────────
  const refreshProducts = React.useCallback(async () => {
    const data = await adminFetchProducts();
    setProducts(data);
  }, []);

  const refreshOrders = React.useCallback(async () => {
    const data = await adminFetchOrders();
    setOrders(data);
  }, []);

  // ── Product CRUD ──────────────────────────────────────
  const addProduct = React.useCallback(async (p: Omit<Product, "customerReviews">) => {
    await adminAddProduct({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      category: p.category,
      description: p.description,
      image_url: p.image,
      badge: p.badge ?? null,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      is_best_seller: p.isBestSeller ?? false,
      is_new_arrival: p.isNewArrival ?? false,
      is_gifting_favorite: p.isGiftingFavorite ?? false,
      is_special_offer: p.isSpecialOffer ?? false,
      is_under_99: p.isUnder99 ?? false,
      dietary_tags: p.dietaryTags,
      flavor_profile: p.flavorProfile,
      ingredients: p.ingredients,
      allergens: p.allergens,
      storage: p.storage,
      shelf_life: p.shelfLife,
      rating_histogram: p.ratingHistogram,
      weights: p.weights,
      frequently_bought_with_slugs: p.frequentlyBoughtWithSlugs ?? [],
      status: "Active",
      stock: 0,
    });
    await refreshProducts();
  }, [refreshProducts]);

  const updateProduct = React.useCallback(async (p: Omit<Product, "customerReviews">) => {
    await dbUpdateProduct(p.slug, {
      name: p.name,
      tagline: p.tagline,
      category: p.category,
      description: p.description,
      image_url: p.image,
      badge: p.badge ?? null,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      is_best_seller: p.isBestSeller ?? false,
      is_new_arrival: p.isNewArrival ?? false,
      is_gifting_favorite: p.isGiftingFavorite ?? false,
      is_special_offer: p.isSpecialOffer ?? false,
      is_under_99: p.isUnder99 ?? false,
      dietary_tags: p.dietaryTags,
      flavor_profile: p.flavorProfile,
      ingredients: p.ingredients,
      allergens: p.allergens,
      storage: p.storage,
      shelf_life: p.shelfLife,
      weights: p.weights,
      frequently_bought_with_slugs: p.frequentlyBoughtWithSlugs ?? [],
    });
    await refreshProducts();
  }, [refreshProducts]);

  const deleteProduct = React.useCallback(async (slug: string) => {
    await adminDeleteProduct(slug);
    await refreshProducts();
  }, [refreshProducts]);

  // ── Order management ──────────────────────────────────
  const updateOrderStatus = React.useCallback(async (orderId: string, status: OrderStatus) => {
    await adminUpdateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const addOrder = React.useCallback(async (orderData: Omit<AdminOrder, "id" | "createdAt">): Promise<AdminOrder> => {
    const result = await placeOrder(orderData);
    const newOrder: AdminOrder = {
      ...orderData,
      id: result.orderId ?? `ORD-9S-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // ── Discounts ─────────────────────────────────────────
  const addDiscount = React.useCallback(async (d: Omit<PromoCode, "id">) => {
    await adminAddPromoCode(d);
    const updated = await adminFetchPromoCodes();
    setDiscounts(updated);
  }, []);

  const toggleDiscount = React.useCallback(async (id: string) => {
    const promo = discounts.find((d) => d.id === id);
    if (!promo) return;
    await adminTogglePromoCode(id, !promo.isActive);
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  }, [discounts]);

  // ── Announcements ─────────────────────────────────────
  const setAnnouncements = React.useCallback(async (list: string[]) => {
    await adminSetAnnouncements(list);
    setAnnouncementsState(list);
  }, []);

  // ── Context value ─────────────────────────────────────
  const value = React.useMemo(
    () => ({
      products,
      orders,
      discounts,
      announcements,
      isAuthenticated,
      isLoading,
      loginError,
      login,
      logout,
      refreshProducts,
      refreshOrders,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addOrder,
      addDiscount,
      toggleDiscount,
      setAnnouncements,
    }),
    [
      products, orders, discounts, announcements,
      isAuthenticated, isLoading, loginError,
      login, logout, refreshProducts, refreshOrders,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, addOrder, addDiscount, toggleDiscount, setAnnouncements,
    ]
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

// ─────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────

export function useAdminStore() {
  const ctx = React.useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used inside AdminStoreProvider");
  }
  return ctx;
}
