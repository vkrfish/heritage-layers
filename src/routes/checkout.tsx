import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

import { useCart } from "@/components/cart";
import { Button, SectionHeading } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";

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
  const { lines, subtotal } = useCart();
  const [placed, setPlaced] = React.useState(false);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  if (placed) {
    return (
      <div className="bg-cream px-5 py-24 text-center lg:px-10 font-sans">
        <SectionHeading
          eyebrow="Thank you"
          title="Your order is with our kitchen"
          subtitle="We'll email a confirmation shortly. Everything is made fresh the day it ships."
        />
        <div className="mt-10">
          <Link to="/shop">
            <Button size="lg" variant="primary" className="bg-brown text-white hover:bg-terracotta">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream px-5 py-16 lg:px-10 lg:py-24 font-sans">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading align="left" eyebrow="Checkout" title="Almost there" />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setPlaced(true);
            }}
          >
            {[
              { id: "co-name", label: "Full name", type: "text" },
              { id: "co-email", label: "Email", type: "email" },
              { id: "co-phone", label: "Phone", type: "tel" },
              { id: "co-address", label: "Delivery address", type: "text" },
              { id: "co-city", label: "City", type: "text" },
              { id: "co-pin", label: "PIN code", type: "text" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="eyebrow block text-brown mb-1">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  required
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
            ))}
            <Button type="submit" size="lg" variant="primary" className="w-full bg-brown text-white hover:bg-terracotta" disabled={lines.length === 0}>
              Place order
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
                    <dd className="tabular-nums text-terracotta">{formatPrice(subtotal + shipping)}</dd>
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
