import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type CustomerProfile = {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  address?: string;
  city?: string;
  pinCode?: string;
};

type CustomerAuthContextType = {
  user: User | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  wishlist: string[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (slug: string) => Promise<void>;
  authModalOpen: boolean;
  authModalMode: "signin" | "signup";
  setAuthModalMode: (mode: "signin" | "signup") => void;
  openAuthModal: (options?: { mode?: "signin" | "signup"; onAuthenticated?: () => void }) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
};

const CustomerAuthContext = React.createContext<CustomerAuthContextType | null>(null);

const WISHLIST_LOCAL_KEY = "9s_customer_wishlist_v1";

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [wishlist, setWishlist] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(WISHLIST_LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authModalMode, setAuthModalMode] = React.useState<"signin" | "signup">("signin");
  const onAuthenticatedCallbackRef = React.useRef<(() => void) | null>(null);

  // Sync wishlist to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_LOCAL_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Load customer profile from DB
  const loadProfile = React.useCallback(async (u: User) => {
    try {
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", u.id)
        .maybeSingle();

      if (data && !error) {
        setProfile({
          id: data.id,
          email: data.email || u.email || "",
          phone: data.phone || u.phone || "",
          fullName: data.full_name || (u.user_metadata ? (u.user_metadata as any).full_name : "") || "",
          address: data.address || "",
          city: data.city || "",
          pinCode: data.pin_code || "",
        });
      } else {
        // Create initial profile if missing
        const newProf = {
          id: u.id,
          email: u.email || "",
          phone: u.phone || "",
          full_name: (u.user_metadata ? (u.user_metadata as any).full_name : "") || "",
          address: "",
          city: "",
          pin_code: "",
        };
        await supabase.from("customer_profiles").upsert(newProf);
        setProfile({
          id: u.id,
          email: u.email || "",
          phone: u.phone || "",
          fullName: (u.user_metadata ? (u.user_metadata as any).full_name : "") || "",
        });
      }

      // Load DB wishlist
      const { data: wlData } = await supabase
        .from("wishlists")
        .select("product_slug")
        .eq("user_id", u.id);

      if (wlData && wlData.length > 0) {
        setWishlist((prev) => {
          const set = new Set([...prev, ...wlData.map((w: any) => w.product_slug)]);
          return Array.from(set);
        });
      }
    } catch (err) {
      console.warn("Profile load error:", err);
    }
  }, []);

  // Auth state listener
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) void loadProfile(u);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        void loadProfile(u);
        if (onAuthenticatedCallbackRef.current) {
          onAuthenticatedCallbackRef.current();
          onAuthenticatedCallbackRef.current = null;
        }
        setAuthModalOpen(false);
      } else {
        setProfile(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [loadProfile]);

  const openAuthModal = React.useCallback(
    (options?: { mode?: "signin" | "signup"; onAuthenticated?: () => void }) => {
      if (options?.mode) setAuthModalMode(options.mode);
      if (options?.onAuthenticated) {
        onAuthenticatedCallbackRef.current = options.onAuthenticated;
      } else {
        onAuthenticatedCallbackRef.current = null;
      }
      setAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = React.useCallback(() => {
    setAuthModalOpen(false);
    onAuthenticatedCallbackRef.current = null;
  }, []);

  const signInWithEmail = React.useCallback(async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signUpWithEmail = React.useCallback(
    async (email: string, pass: string, fullName: string, phone?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName, phone: phone || "" },
        },
      });

      if (error) return { success: false, error: error.message };

      if (data.user) {
        await supabase.from("customer_profiles").upsert({
          id: data.user.id,
          email,
          phone: phone || "",
          full_name: fullName,
        });
      }

      return { success: true };
    },
    []
  );

  const signInWithGoogle = React.useCallback(async () => {
    const options = typeof window !== "undefined" ? { redirectTo: window.location.origin } : undefined;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      ...(options ? { options } : {}),
    });
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfile = React.useCallback(
    async (updates: Partial<CustomerProfile>) => {
      if (!user) return;
      const dbUpdates: any = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.city !== undefined) dbUpdates.city = updates.city;
      if (updates.pinCode !== undefined) dbUpdates.pin_code = updates.pinCode;

      await supabase.from("customer_profiles").update(dbUpdates).eq("id", user.id);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    },
    [user]
  );

  const isInWishlist = React.useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist]
  );

  const toggleWishlist = React.useCallback(
    async (slug: string) => {
      const exists = wishlist.includes(slug);
      const next = exists ? wishlist.filter((s) => s !== slug) : [...wishlist, slug];
      setWishlist(next);

      if (user) {
        if (exists) {
          await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", slug);
        } else {
          await supabase.from("wishlists").insert({ user_id: user.id, product_slug: slug });
        }
      }
    },
    [wishlist, user]
  );

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isLoading,
      wishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      isInWishlist,
      toggleWishlist,
      authModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      closeAuthModal,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      updateProfile,
    }),
    [
      user,
      profile,
      isLoading,
      wishlist,
      isWishlistOpen,
      isInWishlist,
      toggleWishlist,
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      updateProfile,
    ]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = React.useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  return ctx;
}
