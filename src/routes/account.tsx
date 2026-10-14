import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, Package, MapPin, LogOut, CheckCircle2, Clock, Truck, Check, Loader2, AlertCircle } from "lucide-react";
import * as React from "react";
import { useCustomerAuth } from "@/lib/customer-auth";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

type CustomerOrder = {
  id: string;
  items: { name: string; variant: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

function AccountPage() {
  const { user, profile, isLoading, signOut, updateProfile, openAuthModal } = useCustomerAuth();
  const [activeTab, setActiveTab] = React.useState<"orders" | "profile">("orders");
  const [orders, setOrders] = React.useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  // Profile Form state
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pinCode, setPinCode] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setPinCode(profile.pinCode || "");
    }
  }, [profile]);

  // Load customer orders from Supabase
  React.useEffect(() => {
    if (!user) {
      setLoadingOrders(false);
      return;
    }

    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const email = user?.email || "";
        const userPhone = profile?.phone || "";

        let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

        if (email && userPhone) {
          query = query.or(`customer_email.eq.${email},customer_phone.eq.${userPhone}`);
        } else if (email) {
          query = query.eq("customer_email", email);
        }

        const { data, error } = await query;
        if (data && !error) {
          setOrders(
            data.map((o: any) => ({
              id: o.id,
              items: Array.isArray(o.items) ? o.items : [],
              subtotal: Number(o.subtotal) || 0,
              shipping: Number(o.shipping) || 0,
              total: Number(o.total) || 0,
              status: o.status || "Pending",
              paymentMethod: o.payment_method || "UPI",
              createdAt: o.created_at,
            }))
          );
        }
      } catch (e) {
        console.warn("Orders fetch error:", e);
      } finally {
        setLoadingOrders(false);
      }
    }

    void loadOrders();
  }, [user, profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    await updateProfile({
      fullName,
      phone,
      address,
      city,
      pinCode,
    });

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-cream flex items-center justify-center font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 font-sans py-16">
        <div className="max-w-md w-full bg-cream-light border border-gold/40 rounded-2xl p-8 text-center shadow-lift space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-brown">
            <User className="h-8 w-8 text-terracotta" />
          </div>
          <h1 className="font-display text-3xl text-brown font-normal">Customer Account</h1>
          <p className="font-sans text-xs font-bold text-brown/70">
            Sign in to access your order history, delivery addresses, and wishlisted sweets.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => openAuthModal({ mode: "signin" })}
              variant="primary"
              className="w-full justify-center bg-brown text-white hover:bg-terracotta"
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16 px-4 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* User Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brown/15 pb-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/30 text-brown border-2 border-gold font-display text-2xl">
              {(profile?.fullName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-brown font-normal">
                Namaste, {profile?.fullName || user.email?.split("@")[0]}
              </h1>
              <p className="text-xs font-bold text-brown/70">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-brown/30 bg-cream-light px-4 py-2 font-sans text-xs font-bold text-brown hover:bg-terracotta hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-brown/15 space-x-6 font-sans font-bold text-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === "orders"
                ? "border-terracotta text-terracotta font-extrabold"
                : "border-transparent text-brown/70 hover:text-brown"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === "profile"
                ? "border-terracotta text-terracotta font-extrabold"
                : "border-transparent text-brown/70 hover:text-brown"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Delivery &amp; Profile Details</span>
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="py-12 text-center text-brown/60">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-terracotta mb-2" />
                <p className="text-xs font-bold">Retrieving orders from kitchen database...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-brown/15 bg-cream-light p-10 text-center space-y-3">
                <Package className="h-10 w-10 text-brown/40 mx-auto" />
                <h3 className="font-display text-2xl text-brown">No orders placed yet</h3>
                <p className="text-xs font-bold text-brown/70 max-w-sm mx-auto">
                  When you purchase from 9 Stories &amp; Co., your orders will show up here with live status updates.
                </p>
                <Link to="/shop">
                  <Button variant="primary" className="bg-brown text-white hover:bg-terracotta mt-2">
                    Browse Heritage Sweets
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl border border-brown/15 bg-cream-light p-5 sm:p-6 shadow-flat space-y-4 font-sans font-bold"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brown/15 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-brown/60 uppercase tracking-widest block">Order ID</span>
                        <span className="font-display text-xl text-brown">{o.id}</span>
                        <span className="text-xs text-brown/60 ml-2">
                          • {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1 ${
                            o.status === "Delivered"
                              ? "bg-green/15 text-green"
                              : o.status === "Shipped"
                              ? "bg-gold/30 text-brown"
                              : "bg-terracotta/15 text-terracotta"
                          }`}
                        >
                          {o.status === "Delivered" && <CheckCircle2 className="h-3 w-3" />}
                          {o.status === "Shipped" && <Truck className="h-3 w-3" />}
                          {o.status === "Pending" && <Clock className="h-3 w-3" />}
                          {o.status}
                        </span>
                        <span className="font-display text-xl text-terracotta">{formatPrice(o.total)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-brown">
                          <span>
                            {item.name} <span className="text-brown/60 font-normal">({item.variant})</span> × {item.qty}
                          </span>
                          <span className="text-terracotta">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-brown/60 border-t border-brown/10 pt-2 flex justify-between">
                      <span>Payment: {o.paymentMethod}</span>
                      <span>Complimentary Fresh Delivery Included</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE DETAILS */}
        {activeTab === "profile" && (
          <div className="rounded-xl border border-brown/15 bg-cream-light p-6 sm:p-8 shadow-flat max-w-2xl font-sans font-bold">
            <h2 className="font-display text-2xl text-brown mb-4 font-normal">Saved Delivery Details</h2>
            <p className="text-xs text-brown/70 mb-6">
              These details will be automatically prefilled during checkout for one-click ordering.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-brown mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ananya Rao"
                  className="w-full rounded-lg border border-brown/30 bg-cream p-2.5 text-brown focus:border-terracotta focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-brown/30 bg-cream p-2.5 text-brown focus:border-terracotta focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown mb-1">Default Delivery Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat No, Apartment, Street name"
                  className="w-full rounded-lg border border-brown/30 bg-cream p-2.5 text-brown focus:border-terracotta focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full rounded-lg border border-brown/30 bg-cream p-2.5 text-brown focus:border-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-brown mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="500033"
                    className="w-full rounded-lg border border-brown/30 bg-cream p-2.5 text-brown focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>

              {saveSuccess && (
                <p className="flex items-center gap-1.5 text-green text-xs font-bold pt-1">
                  <Check className="h-4 w-4" /> Details saved successfully!
                </p>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="primary"
                  className="bg-brown text-white hover:bg-terracotta disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Saving...
                    </>
                  ) : (
                    "Save Delivery Details"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
