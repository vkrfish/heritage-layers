import * as React from "react";

import {
  seedContent,
  seedCustomers,
  seedDiscounts,
  seedOrders,
  seedPosts,
  seedProducts,
  seedReviews,
  seedSettings,
  type AdminProduct,
  type Customer,
  type Discount,
  type JournalPost,
  type Order,
  type OrderStatus,
  type Review,
  type Settings,
  type SiteContent,
} from "@/lib/admin-data";

type AdminState = {
  products: AdminProduct[];
  orders: Order[];
  customers: Customer[];
  discounts: Discount[];
  posts: JournalPost[];
  reviews: Review[];
  content: SiteContent;
  settings: Settings;
};

type AdminContextValue = AdminState & {
  updateProduct: (slug: string, patch: Partial<AdminProduct>) => void;
  addProduct: (product: AdminProduct) => void;
  removeProduct: (slug: string) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  updateDiscount: (id: string, patch: Partial<Discount>) => void;
  addDiscount: (discount: Discount) => void;
  removeDiscount: (id: string) => void;
  updatePost: (id: string, patch: Partial<JournalPost>) => void;
  removePost: (id: string) => void;
  setReviewStatus: (id: string, status: Review["status"]) => void;
  removeReview: (id: string) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
};

const AdminContext = React.createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<AdminProduct[]>(seedProducts);
  const [orders, setOrders] = React.useState<Order[]>(seedOrders);
  const [customers] = React.useState<Customer[]>(seedCustomers);
  const [discounts, setDiscounts] = React.useState<Discount[]>(seedDiscounts);
  const [posts, setPosts] = React.useState<JournalPost[]>(seedPosts);
  const [reviews, setReviews] = React.useState<Review[]>(seedReviews);
  const [content, setContent] = React.useState<SiteContent>(seedContent);
  const [settings, setSettings] = React.useState<Settings>(seedSettings);

  const value: AdminContextValue = {
    products,
    orders,
    customers,
    discounts,
    posts,
    reviews,
    content,
    settings,
    updateProduct: (slug, patch) =>
      setProducts((list) => list.map((p) => (p.slug === slug ? { ...p, ...patch } : p))),
    addProduct: (product) => setProducts((list) => [product, ...list]),
    removeProduct: (slug) => setProducts((list) => list.filter((p) => p.slug !== slug)),
    setOrderStatus: (id, status) =>
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o))),
    updateDiscount: (id, patch) =>
      setDiscounts((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d))),
    addDiscount: (discount) => setDiscounts((list) => [discount, ...list]),
    removeDiscount: (id) => setDiscounts((list) => list.filter((d) => d.id !== id)),
    updatePost: (id, patch) =>
      setPosts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    removePost: (id) => setPosts((list) => list.filter((p) => p.id !== id)),
    setReviewStatus: (id, status) =>
      setReviews((list) => list.map((r) => (r.id === id ? { ...r, status } : r))),
    removeReview: (id) => setReviews((list) => list.filter((r) => r.id !== id)),
    updateContent: (patch) => setContent((c) => ({ ...c, ...patch })),
    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = React.useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
