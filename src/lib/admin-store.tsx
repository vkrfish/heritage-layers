import * as React from "react";
import { products as initialProducts, type Product } from "@/lib/products";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
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

const STORAGE_KEYS = {
  PRODUCTS: "9s_admin_products_v1",
  ORDERS: "9s_admin_orders_v1",
  DISCOUNTS: "9s_admin_discounts_v1",
  ANNOUNCEMENTS: "9s_admin_announcements_v1",
  AUTH: "9s_admin_auth_v1",
};

const defaultAnnouncements = [
  "✨ Special Festive Offer: Get 10% OFF on Gift Boxes with code FESTIVE10",
  "🚚 FREE Shipping on all Orders Above ₹999 across India!",
  "✈️ International Diaspora Express Shipping to USA, UK, UAE & Australia",
  "🌿 100% Pure Organic Ingredients & Fresh Artisanal A2 Ghee Sweets",
];

const defaultDiscounts: PromoCode[] = [
  { id: "d1", code: "FESTIVE10", discountType: "percentage", discountValue: 10, minSubtotal: 499, isActive: true },
  { id: "d2", code: "FREESHIP", discountType: "flat", discountValue: 79, minSubtotal: 999, isActive: true },
];

const defaultOrders: AdminOrder[] = [
  {
    id: "ORD-9S-89101",
    customerName: "Lakshmi Rao",
    customerPhone: "9876543210",
    customerEmail: "lakshmi@example.com",
    address: "B-402, Jubilee Hills",
    city: "Hyderabad",
    items: [
      { slug: "classic-putharekulu", name: "Classic Putharekulu", variant: "500g (12 pcs)", price: 649, qty: 2 },
      { slug: "artisan-gunpowder-podi", name: "Artisan Gunpowder Podi", variant: "250g jar", price: 249, qty: 1 },
    ],
    subtotal: 1547,
    shipping: 0,
    total: 1547,
    paymentMethod: "UPI",
    status: "Processing",
    createdAt: "2026-09-07T10:30:00Z",
  },
  {
    id: "ORD-9S-89102",
    customerName: "Siddharth Verma",
    customerPhone: "9812345678",
    customerEmail: "siddharth@example.com",
    address: "12th Main Road, Indiranagar",
    city: "Bengaluru",
    items: [
      { slug: "premium-gift-box", name: "Royal Heritage Gift Box", variant: "1kg (24 pcs)", price: 1999, qty: 1 },
    ],
    subtotal: 1999,
    shipping: 0,
    total: 1999,
    paymentMethod: "Card",
    status: "Shipped",
    createdAt: "2026-09-06T15:20:00Z",
  },
];

type AdminStoreContextType = {
  products: Product[];
  orders: AdminOrder[];
  discounts: PromoCode[];
  announcements: string[];
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (slug: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Omit<AdminOrder, "id" | "createdAt">) => AdminOrder;
  addDiscount: (discount: Omit<PromoCode, "id">) => void;
  toggleDiscount: (id: string) => void;
  setAnnouncements: (list: string[]) => void;
};

const AdminStoreContext = React.createContext<AdminStoreContextType | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [productsState, setProductsState] = React.useState<Product[]>(() => {
    if (typeof window === "undefined") return initialProducts;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [ordersState, setOrdersState] = React.useState<AdminOrder[]>(() => {
    if (typeof window === "undefined") return defaultOrders;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : defaultOrders;
    } catch {
      return defaultOrders;
    }
  });

  const [discountsState, setDiscountsState] = React.useState<PromoCode[]>(() => {
    if (typeof window === "undefined") return defaultDiscounts;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
      return saved ? JSON.parse(saved) : defaultDiscounts;
    } catch {
      return defaultDiscounts;
    }
  });

  const [announcementsState, setAnnouncementsState] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return defaultAnnouncements;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : defaultAnnouncements;
    } catch {
      return defaultAnnouncements;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsState));
    } catch {}
  }, [productsState]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersState));
    } catch {}
  }, [ordersState]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discountsState));
    } catch {}
  }, [discountsState]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcementsState));
    } catch {}
  }, [announcementsState]);

  const login = (passcode: string) => {
    if (passcode === "admin123" || passcode === "admin") {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
  };

  const addProduct = (p: Product) => {
    setProductsState((prev) => [p, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProductsState((prev) => prev.map((item) => (item.slug === p.slug ? p : item)));
  };

  const deleteProduct = (slug: string) => {
    setProductsState((prev) => prev.filter((item) => item.slug !== slug));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrdersState((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const addOrder = (orderData: Omit<AdminOrder, "id" | "createdAt">): AdminOrder => {
    const newOrder: AdminOrder = {
      ...orderData,
      id: `ORD-9S-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };
    setOrdersState((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const addDiscount = (d: Omit<PromoCode, "id">) => {
    const newDiscount: PromoCode = {
      ...d,
      id: `d_${Date.now()}`,
    };
    setDiscountsState((prev) => [newDiscount, ...prev]);
  };

  const toggleDiscount = (id: string) => {
    setDiscountsState((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const value = React.useMemo(
    () => ({
      products: productsState,
      orders: ordersState,
      discounts: discountsState,
      announcements: announcementsState,
      isAuthenticated,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addOrder,
      addDiscount,
      toggleDiscount,
      setAnnouncements: setAnnouncementsState,
    }),
    [productsState, ordersState, discountsState, announcementsState, isAuthenticated]
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = React.useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used inside AdminStoreProvider");
  }
  return ctx;
}
