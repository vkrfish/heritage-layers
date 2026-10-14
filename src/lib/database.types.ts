// Auto-generated database types for Supabase
// Matches the schema in supabase/migrations/001_schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string;
          category: string;
          description: string;
          image_url: string;
          badge: string | null;
          rating: number;
          reviews_count: number;
          ingredients: string;
          allergens: string;
          storage: string;
          shelf_life: string;
          dietary_tags: string[];
          flavor_profile: string;
          is_best_seller: boolean;
          is_new_arrival: boolean;
          is_gifting_favorite: boolean;
          is_special_offer: boolean;
          is_under_99: boolean;
          status: "Active" | "Draft" | "Archived";
          stock: number;
          rating_histogram: Json;
          weights: Json;
          frequently_bought_with_slugs: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          address: string;
          city: string;
          items: Json;
          subtotal: number;
          shipping: number;
          total: number;
          payment_method: "UPI" | "Card" | "COD";
          status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_type: "percentage" | "flat" | "free_shipping";
          discount_value: number;
          min_subtotal: number;
          is_active: boolean;
          uses: number;
          use_limit: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promo_codes"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["promo_codes"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          text: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      journal_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          author: string;
          cover_image_url: string | null;
          status: "Published" | "Draft";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["journal_posts"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["journal_posts"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
