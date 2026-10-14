import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Loader2, PackageCheck, ShieldCheck } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { Button, SectionHeading } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "@/lib/db";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — 9 Stories & Co." },
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
      <div className="bg-cream px-5 py-24 text-center lg:px-10 font-sans">
        <div className="mx-auto max-w-lg bg-cream-light border border-gold/40 rounded-2xl p-8 shadow-lift space-y-5">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green/20 text-green">
            <CheckCircle className="h-10 w-10 text-green" />
          </div>
          <SectionHeading
            eyebrow="Order Confirmed"
            title="Your order is with our kitchen"
            subtitle="We prepare every box fresh on the day of dispatch. Handcrafted in Atreyapuram, delivered with care."
          />
          <div className="rounded-xl bg-gold/15 border border-gold/40 p-4 text-center">
            <p className="text-xs font-bold text-brown/70 uppercase tracking-widest">Order Reference</p>
            <p className="font-display text-2xl text-brown font-bold mt-1">{placedOrder.id}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-brown/70">
            <ShieldCheck className="h-4 w-4 text-terracotta" />
            <span>Saved to 9 Stories live database &amp; kitchen queue</span>
          </div>
          <div className="pt-4">
            <Link to="/shop">
              <Button size="lg" variant="primary" className="bg-brown text-white hover:bg-terracotta">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream px-5 py-16 lg:px-10 lg:py-24 font-sans">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading align="left" eyebrow="Checkout" title="Almost there" />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="co-name" className="eyebrow block text-brown mb-1">
                Full name
              </label>
              <input
                id="co-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lakshmi Rao"
                className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-email" className="eyebrow block text-brown mb-1">
                  Email
                </label>
                <input
                  id="co-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="co-phone" className="eyebrow block text-brown mb-1">
                  Phone
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-address" className="eyebrow block text-brown mb-1">
                Delivery address
              </label>
              <input
                id="co-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No, Street, Landmark"
                className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-city" className="eyebrow block text-brown mb-1">
                  City
                </label>
                <input
                  id="co-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="co-pin" className="eyebrow block text-brown mb-1">
                  PIN code
                </label>
                <input
                  id="co-pin"
                  type="text"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="500033"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow block text-brown mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {(["UPI", "Card", "COD"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-lg border p-3 font-sans text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === method
                        ? "border-terracotta bg-terracotta/15 text-terracotta"
                        : "border-brown/20 bg-cream-light text-brown/70 hover:bg-cream"
                    }`}
                  >
                    {method === "COD" ? "Cash on Delivery" : method}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={isSubmitting || lines.length === 0}
              className="w-full bg-brown text-white hover:bg-terracotta disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" /> Placing Order...
                </>
              ) : (
                `Place Order • ${formatPrice(total)}`
              )}
            </Button>
          </form>

          <aside className="h-fit rounded-xl border border-brown/15 bg-cream-light p-8 shadow-flat">
            <h2 className="font-display text-3xl text-brown">Order summary</h2>
            {lines.length === 0 ? (
              <p className="mt-4 font-sans text-sm font-bold text-brown/70">
                Your cart is empty.{" "}
                <Link to="/shop" className="text-terracotta underline-offset-4 hover:underline">
                  Browse the collection
                </Link>
                .
              </p>
            ) : (
              <>
                <ul className="mt-5 divide-y divide-brown/15 font-sans">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-4 py-3 text-sm font-bold">
                      <span className="min-w-0 text-brown">
                        {l.name}
                        <span className="block text-xs text-brown/60 font-bold">
                          {l.variant} × {l.qty}
                        </span>
                      </span>
                      <span className="tabular-nums text-terracotta font-bold">
                        {formatPrice(l.price * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 space-y-2 border-t border-brown/15 pt-5 font-sans text-sm font-bold">
                  <div className="flex justify-between text-brown/70">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-brown/70">
                    <dt>Shipping</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? <span className="text-green">Complimentary</span> : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-brown/15 pt-3 font-sans text-lg font-bold text-brown">
                    <dt>Total</dt>
                    <dd className="tabular-nums text-terracotta">{formatPrice(total)}</dd>
                  </div>
                </dl>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
