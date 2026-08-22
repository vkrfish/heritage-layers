import { products, type Product } from "@/lib/products";

export type AdminProduct = Product & {
  status: "Active" | "Draft" | "Archived";
  stock: number;
  category: string;
};

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = { name: string; weight: string; qty: number; price: number };

export type Order = {
  id: string;
  customer: string;
  email: string;
  city: string;
  placedAt: string;
  status: OrderStatus;
  payment: "Paid" | "COD" | "Refunded";
  items: OrderItem[];
  total: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  since: string;
  tier: "New" | "Repeat" | "VIP";
};

export type Discount = {
  id: string;
  code: string;
  type: "Percent" | "Flat" | "Free shipping";
  value: number;
  uses: number;
  limit: number;
  status: "Active" | "Scheduled" | "Expired";
  expires: string;
};

export type JournalPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
};

export type Review = {
  id: string;
  product: string;
  author: string;
  rating: number;
  body: string;
  status: "Published" | "Pending";
  date: string;
};

export type SiteContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  heroCta: string;
  announcement: string;
  storyHeading: string;
  storyBody: string;
  craftHeading: string;
  craftBody: string;
  giftingHeading: string;
  giftingBody: string;
  footerNote: string;
};

export type Settings = {
  storeName: string;
  supportEmail: string;
  phone: string;
  address: string;
  currency: string;
  freeShippingAbove: number;
  shippingFlat: number;
  codEnabled: boolean;
  giftNotesEnabled: boolean;
  metaTitle: string;
  metaDescription: string;
  instagram: string;
};

export const seedProducts: AdminProduct[] = products.map((p, i) => ({
  ...p,
  status: i === 4 ? "Draft" : "Active",
  stock: [48, 120, 36, 64, 18][i] ?? 40,
  category: p.slug.includes("gift") ? "Gifting" : "Putharekulu",
}));

export const seedOrders: Order[] = [
  {
    id: "9SC-1042",
    customer: "Ananya Rao",
    email: "ananya.rao@example.com",
    city: "Hyderabad",
    placedAt: "2026-08-21",
    status: "Pending",
    payment: "Paid",
    items: [{ name: "Ghee Putharekulu", weight: "500 g · 12 pieces", qty: 2, price: 799 }],
    total: 1598,
  },
  {
    id: "9SC-1041",
    customer: "Rahul Menon",
    email: "rahul.menon@example.com",
    city: "Bengaluru",
    placedAt: "2026-08-21",
    status: "Processing",
    payment: "Paid",
    items: [
      { name: "Premium Gift Box", weight: "1 kg · 24 pieces", qty: 1, price: 1999 },
      { name: "Classic Putharekulu", weight: "250 g · 6 pieces", qty: 1, price: 349 },
    ],
    total: 2348,
  },
  {
    id: "9SC-1040",
    customer: "Sneha Kulkarni",
    email: "sneha.k@example.com",
    city: "Pune",
    placedAt: "2026-08-20",
    status: "Shipped",
    payment: "COD",
    items: [{ name: "Dry Fruit Putharekulu", weight: "500 g · 12 pieces", qty: 1, price: 929 }],
    total: 929,
  },
  {
    id: "9SC-1039",
    customer: "Vikram Iyer",
    email: "vikram.iyer@example.com",
    city: "Chennai",
    placedAt: "2026-08-19",
    status: "Delivered",
    payment: "Paid",
    items: [{ name: "Jaggery Putharekulu", weight: "250 g · 6 pieces", qty: 3, price: 399 }],
    total: 1197,
  },
  {
    id: "9SC-1038",
    customer: "Meera Prasad",
    email: "meera.p@example.com",
    city: "Vijayawada",
    placedAt: "2026-08-18",
    status: "Delivered",
    payment: "Paid",
    items: [{ name: "Premium Gift Box", weight: "500 g · 12 pieces", qty: 2, price: 1099 }],
    total: 2198,
  },
  {
    id: "9SC-1037",
    customer: "Arjun Sethi",
    email: "arjun.sethi@example.com",
    city: "Delhi",
    placedAt: "2026-08-17",
    status: "Cancelled",
    payment: "Refunded",
    items: [{ name: "Classic Putharekulu", weight: "1 kg · 24 pieces", qty: 1, price: 1199 }],
    total: 1199,
  },
];

export const seedCustomers: Customer[] = [
  {
    id: "C-101",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98490 11223",
    city: "Hyderabad",
    orders: 7,
    spent: 12480,
    since: "2024-11-02",
    tier: "VIP",
  },
  {
    id: "C-102",
    name: "Rahul Menon",
    email: "rahul.menon@example.com",
    phone: "+91 99010 44556",
    city: "Bengaluru",
    orders: 3,
    spent: 6120,
    since: "2025-02-14",
    tier: "Repeat",
  },
  {
    id: "C-103",
    name: "Sneha Kulkarni",
    email: "sneha.k@example.com",
    phone: "+91 97300 77889",
    city: "Pune",
    orders: 1,
    spent: 929,
    since: "2026-08-20",
    tier: "New",
  },
  {
    id: "C-104",
    name: "Vikram Iyer",
    email: "vikram.iyer@example.com",
    phone: "+91 90030 22114",
    city: "Chennai",
    orders: 5,
    spent: 8340,
    since: "2025-06-08",
    tier: "Repeat",
  },
  {
    id: "C-105",
    name: "Meera Prasad",
    email: "meera.p@example.com",
    phone: "+91 91210 33447",
    city: "Vijayawada",
    orders: 11,
    spent: 21760,
    since: "2024-05-19",
    tier: "VIP",
  },
];

export const seedDiscounts: Discount[] = [
  {
    id: "D-1",
    code: "FIRSTFOLD10",
    type: "Percent",
    value: 10,
    uses: 214,
    limit: 500,
    status: "Active",
    expires: "2026-12-31",
  },
  {
    id: "D-2",
    code: "GIFTING250",
    type: "Flat",
    value: 250,
    uses: 62,
    limit: 200,
    status: "Active",
    expires: "2026-10-15",
  },
  {
    id: "D-3",
    code: "DIWALISHIP",
    type: "Free shipping",
    value: 0,
    uses: 0,
    limit: 1000,
    status: "Scheduled",
    expires: "2026-11-12",
  },
  {
    id: "D-4",
    code: "SUMMER5",
    type: "Percent",
    value: 5,
    uses: 340,
    limit: 340,
    status: "Expired",
    expires: "2026-06-30",
  },
];

export const seedPosts: JournalPost[] = [
  {
    id: "P-1",
    title: "The women of Atreyapuram",
    excerpt: "Six families, one recipe, and a rice sheet thinner than paper.",
    author: "Editorial",
    date: "2026-08-12",
    status: "Published",
  },
  {
    id: "P-2",
    title: "Why ghee matters more than sugar",
    excerpt: "A slow-clarified fat that decides the aroma of the entire fold.",
    author: "Editorial",
    date: "2026-07-28",
    status: "Published",
  },
  {
    id: "P-3",
    title: "Gifting notes for the festival season",
    excerpt: "How to build a box that travels well and arrives beautifully.",
    author: "Studio",
    date: "2026-08-19",
    status: "Draft",
  },
];

export const seedReviews: Review[] = [
  {
    id: "R-1",
    product: "Ghee Putharekulu",
    author: "Divya S.",
    rating: 5,
    body: "Tastes exactly like the ones from my grandmother's kitchen.",
    status: "Published",
    date: "2026-08-18",
  },
  {
    id: "R-2",
    product: "Premium Gift Box",
    author: "Karthik N.",
    rating: 5,
    body: "The packaging alone made the gift feel expensive.",
    status: "Published",
    date: "2026-08-14",
  },
  {
    id: "R-3",
    product: "Jaggery Putharekulu",
    author: "Fatima R.",
    rating: 4,
    body: "Less sweet, more earthy. Took a bite to love it.",
    status: "Pending",
    date: "2026-08-21",
  },
];

export const seedContent: SiteContent = {
  heroEyebrow: "Andhra Heritage · Handcrafted",
  heroHeading: "Sweets folded thinner than paper",
  heroBody:
    "Handcrafted Putharekulu from Atreyapuram, made fresh in small batches and delivered with care.",
  heroCta: "Shop the collection",
  announcement: "Handcrafted Andhra Putharekulu • Made Fresh • Delivered With Care",
  storyHeading: "Nine stories, one fold",
  storyBody: "A family archive of recipes, carried forward by the hands that still make them.",
  craftHeading: "The craft",
  craftBody: "Rice batter, an inverted pot, and a hand that knows the exact moment to lift.",
  giftingHeading: "Gifting, considered",
  giftingBody: "Keepsake boxes in teal and gold, finished by hand and tied with silk.",
  footerNote: "Made in Andhra Pradesh. Shipped across India.",
};

export const seedSettings: Settings = {
  storeName: "9 Stories & Co.",
  supportEmail: "care@9stories.co",
  phone: "+91 90000 90000",
  address: "Atreyapuram, East Godavari, Andhra Pradesh",
  currency: "INR (₹)",
  freeShippingAbove: 999,
  shippingFlat: 79,
  codEnabled: true,
  giftNotesEnabled: true,
  metaTitle: "9 Stories & Co. — Handcrafted Andhra Putharekulu",
  metaDescription:
    "Authentic handcrafted Putharekulu from Andhra Pradesh. Paper-thin layers, pure ghee, made fresh in small batches.",
  instagram: "@9storiesandco",
};

export const revenueSeries = [
  { label: "Feb", value: 42 },
  { label: "Mar", value: 58 },
  { label: "Apr", value: 51 },
  { label: "May", value: 74 },
  { label: "Jun", value: 69 },
  { label: "Jul", value: 88 },
  { label: "Aug", value: 96 },
];

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
