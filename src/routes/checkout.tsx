import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldCheck, CreditCard, Banknote, Smartphone, ArrowRight, Lock } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { Button, SectionHeading } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "@/lib/db";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — 9 Stories & Co." },
      {
        name: "description",
        content: "Review your handcrafted Putharekulu order and complete your delivery details.",
      },
      { property: "og:title", content: "Checkout — 9 Stories & Co." },
      { property: "og:description", content: "Review your order and complete delivery details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState<{ id: string; name: string } | null>(null);

  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"UPI" | "Card" | "COD">("UPI");

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;

    setIsSubmitting(true);
    const orderItems = lines.map((l) => ({
      slug: l.slug,
      name: l.name,
      variant: l.variant,
      price: l.price,
      qty: l.qty,
    }));

    const fullAddress = `${address}, ${city} - ${pin}`;
    const result = await placeOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      address: fullAddress,
      city,
      items: orderItems,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: "Pending",
    });

    setIsSubmitting(false);

    if (result.success) {
      setPlacedOrder({
        id: result.orderId || `ORD-9S-${Math.floor(10000 + Math.random() * 90000)}`,
        name,
      });
      clear();
    }
  };

  if (placedOrder) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen px-4 py-16 sm:py-24 text-center font-sans text-stone-900 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C88A36]">Order Confirmed</p>
            <h1 className="font-serif text-3xl text-[#241814]">Your order is with our kitchen</h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Every box is freshly rolled the morning of dispatch in Atreyapuram and packed in airtight protective casing.
            </p>
          </div>

          <div className="rounded-xl bg-[#FAF7F2] border border-stone-200 p-4 text-center">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">Order Reference</p>
            <p className="font-serif text-2xl text-[#241814] font-medium mt-0.5 tracking-tight">{placedOrder.id}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="h-4 w-4 text-[#C88A36]" />
            <span>Recorded in 9 Stories &amp; Co. culinary queue</span>
          </div>

          <div className="pt-2">
            <Link to="/shop">
              <Button size="md" variant="primary" className="w-full sm:w-auto">
                Continue Exploring <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen px-4 py-10 sm:py-16 lg:px-10 font-sans text-stone-900 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C88A36]">Final Step</p>
            <h1 className="font-serif text-2xl sm:text-4xl text-[#241814]">Delivery &amp; Payment</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="h-3.5 w-3.5 text-stone-400" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Checkout Form */}
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg text-[#241814] border-b border-stone-100 pb-2.5">
                1. Customer Details
              </h2>

              <div>
                <label htmlFor="co-name" className="block font-medium text-stone-700 mb-1">
                  Full name
                </label>
                <input
                  id="co-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lakshmi Rao"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="co-email" className="block font-medium text-stone-700 mb-1">
                    Email address (for dispatch updates)
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lakshmi@example.com"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="block font-medium text-stone-700 mb-1">
                    Phone / WhatsApp (for courier delivery)
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg text-[#241814] border-b border-stone-100 pb-2.5">
                2. Shipping Address
              </h2>

              <div>
                <label htmlFor="co-address" className="block font-medium text-stone-700 mb-1">
                  Street address &amp; apartment / house no.
                </label>
                <input
                  id="co-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Sai Vihar, Jubilee Hills"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="co-city" className="block font-medium text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    id="co-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="co-pin" className="block font-medium text-stone-700 mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    id="co-pin"
                    type="text"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="500033"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg text-[#241814] border-b border-stone-100 pb-2.5">
                3. Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: "UPI", label: "Instant UPI", icon: Smartphone },
                    { id: "Card", label: "Debit / Card", icon: CreditCard },
                    { id: "COD", label: "Cash on Delivery", icon: Banknote },
                  ] as const
                ).map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`rounded-xl border p-3 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? "border-[#241814] bg-[#241814] text-white shadow-2xs"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-[11px] text-center leading-tight">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="gold"
              disabled={isSubmitting || lines.length === 0}
              className="w-full h-11 text-sm font-medium shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Finalizing Order...
                </>
              ) : (
                `Complete Order • ${formatPrice(total)}`
              )}
            </Button>
          </form>

          {/* Order Summary Aside */}
          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs font-sans">
            <h2 className="font-serif text-xl text-[#241814]">Order Summary</h2>
            {lines.length === 0 ? (
              <p className="mt-3 text-xs text-stone-500">
                Your cart is empty.{" "}
                <Link to="/shop" className="text-[#C88A36] underline-offset-4 hover:underline font-medium">
                  Browse the collection
                </Link>
                .
              </p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-stone-100 text-xs">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <span className="font-medium text-stone-900 block truncate">{l.name}</span>
                        <span className="text-[11px] text-stone-500 block mt-0.5">
                          {l.variant} × {l.qty}
                        </span>
                      </div>
                      <span className="tabular-nums font-semibold text-stone-900 shrink-0">
                        {formatPrice(l.price * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-2 border-t border-stone-200/80 pt-4 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums font-medium text-stone-900">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <dt>Express Shipping</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-medium">Complimentary</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-stone-200/80 pt-3 text-sm font-semibold text-[#241814]">
                    <dt>Total</dt>
                    <dd className="tabular-nums text-base">{formatPrice(total)}</dd>
                  </div>
                </dl>

                <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C88A36] shrink-0" />
                    <span>Prepared fresh on the morning of dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-3.5 w-3.5 text-[#C88A36] shrink-0" />
                    <span>Airtight seal preserves authentic wafer crunch</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
