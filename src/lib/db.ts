/**
 * db.ts — Supabase data-fetching and mutation functions
 */

import { supabase } from "@/lib/supabase";
import type { Product, WeightVariant } from "@/lib/products";
import type { AdminOrder, OrderStatus, PromoCode } from "@/lib/admin-store";

// ─────────────────────────────────────────────────────────
// ADAPTERS — DB row ➜ app types
// ─────────────────────────────────────────────────────────

function dbProductToProduct(p: any): Product {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline || "",
    category: p.category as Product["category"],
    description: p.description || "",
    image: p.image_url || "",
    badge: p.badge || undefined,
    rating: Number(p.rating) || 4.9,
    reviewsCount: Number(p.reviews_count) || 0,
    isBestSeller: Boolean(p.is_best_seller),
    isNewArrival: Boolean(p.is_new_arrival),
    isGiftingFavorite: Boolean(p.is_gifting_favorite),
    isSpecialOffer: Boolean(p.is_special_offer),
    isUnder99: Boolean(p.is_under_99),
    dietaryTags: Array.isArray(p.dietary_tags) ? p.dietary_tags : [],
    flavorProfile: p.flavor_profile || "",
    ingredients: p.ingredients || "",
    allergens: p.allergens || "",
    storage: p.storage || "",
    shelfLife: p.shelf_life || "",
    ratingHistogram: (p.rating_histogram as Product["ratingHistogram"]) || { 5: 90, 4: 10, 3: 0, 2: 0, 1: 0 },
    weights: (p.weights as unknown as WeightVariant[]) || [],
    frequentlyBoughtWithSlugs: p.frequently_bought_with_slugs || [],
    customerReviews: [],
  };
}

function dbOrderToAdminOrder(o: any): AdminOrder {
  return {
    id: o.id,
    customerName: o.customer_name || "",
    customerPhone: o.customer_phone || "",
    customerEmail: o.customer_email || undefined,
    address: o.address || "",
    city: o.city || "",
    items: Array.isArray(o.items) ? o.items : [],
    subtotal: Number(o.subtotal) || 0,
    shipping: Number(o.shipping) || 0,
    total: Number(o.total) || 0,
    paymentMethod: (o.payment_method || "UPI") as AdminOrder["paymentMethod"],
    status: (o.status || "Pending") as OrderStatus,
    createdAt: o.created_at || new Date().toISOString(),
  };
}

function dbPromoToPromoCode(p: any): PromoCode {
  return {
    id: p.id,
    code: p.code,
    discountType: p.discount_type === "free_shipping" ? "flat" : p.discount_type,
    discountValue: Number(p.discount_value) || 0,
    minSubtotal: Number(p.min_subtotal) || 0,
    isActive: Boolean(p.is_active),
  };
}

// ─────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[db] fetchProducts fallback:", error.message);
      return [];
    }
    return (data || []).map(dbProductToProduct);
  } catch (err: any) {
    console.warn("[db] fetchProducts error:", err.message);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "Active")
      .maybeSingle();

    if (error || !data) return null;
    return dbProductToProduct(data);
  } catch {
    return null;
  }
}

export async function adminFetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []).map(dbProductToProduct);
  } catch {
    return [];
  }
}

export async function adminAddProduct(
  product: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("products").insert(product as any);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminUpdateProduct(
  slug: string,
  updates: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("products").update(updates as any).eq("slug", slug);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminDeleteProduct(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("products").delete().eq("slug", slug);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────

export async function adminFetchOrders(): Promise<AdminOrder[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []).map(dbOrderToAdminOrder);
  } catch {
    return [];
  }
}

export async function placeOrder(
  order: Omit<AdminOrder, "id" | "createdAt">
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const newId = `ORD-9S-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    const { error } = await supabase.from("orders").insert({
      id: newId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail || null,
      address: order.address,
      city: order.city,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      payment_method: order.paymentMethod,
      status: "Pending",
    } as any);

    if (error) return { success: false, error: error.message };
    return { success: true, orderId: newId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("orders").update({ status } as any).eq("id", orderId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────
// PROMO CODES
// ─────────────────────────────────────────────────────────

export async function validatePromoCode(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; promo?: PromoCode; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return { valid: false, error: "Invalid or expired promo code." };

    if (data["expires_at"] && new Date(data["expires_at"]) < new Date()) {
      return { valid: false, error: "This promo code has expired." };
    }
    if (data["uses"] >= data["use_limit"]) {
      return { valid: false, error: "This promo code has reached its usage limit." };
    }
    if (subtotal < Number(data["min_subtotal"])) {
      return { valid: false, error: `Minimum order of ₹${data["min_subtotal"]} required.` };
    }

    return { valid: true, promo: dbPromoToPromoCode(data) };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

export async function adminFetchPromoCodes(): Promise<PromoCode[]> {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []).map(dbPromoToPromoCode);
  } catch {
    return [];
  }
}

export async function adminAddPromoCode(
  promo: Omit<PromoCode, "id">
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("promo_codes").insert({
      code: promo.code.toUpperCase(),
      discount_type: promo.discountType === "flat" ? "flat" : "percentage",
      discount_value: promo.discountValue,
      min_subtotal: promo.minSubtotal,
      is_active: promo.isActive,
    } as any);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminTogglePromoCode(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("promo_codes").update({ is_active: isActive } as any).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("text")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return (data || []).map((a: any) => a.text);
  } catch {
    return [];
  }
}

export async function adminFetchAnnouncements(): Promise<{ id: string; text: string; is_active: boolean; sort_order: number }[]> {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function adminSetAnnouncements(
  texts: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await supabase.from("announcements").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (texts.length === 0) return { success: true };

    const { error } = await supabase.from("announcements").insert(
      texts.map((text, i) => ({ text, is_active: true, sort_order: i + 1 })) as any
    );

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────
// IMAGE UPLOAD (Supabase Storage)
// ─────────────────────────────────────────────────────────

export async function uploadProductImage(
  file: File,
  slug: string
): Promise<{ url?: string; error?: string }> {
  try {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${slug}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ─────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────

export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
