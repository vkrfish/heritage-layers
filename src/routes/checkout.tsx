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
      <div className="px-5 py-32 text-center lg:px-10">
        <SectionHeading
          eyebrow="Thank you"
          title="Your order is with our kitchen"
          subtitle="We'll email a confirmation shortly. Everything is made fresh the day it ships."
        />
        <div className="mt-10">
          <Link to="/shop">
            <Button size="lg">Continue shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-20 lg:px-10 lg:py-28">
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
                <label htmlFor={f.id} className="eyebrow block text-muted-foreground">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  required
                  className="mt-2 h-12 w-full rounded-[10px] border border-border bg-card px-4 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            ))}
            <Button type="submit" size="lg" className="w-full" disabled={lines.length === 0}>
              Place order
            </Button>
          </form>

          <aside className="h-fit rounded-[12px] border border-border bg-card p-8">
            <h2 className="text-2xl text-primary">Order summary</h2>
            {lines.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Your cart is empty.{" "}
                <Link to="/shop" className="text-accent underline-offset-4 hover:underline">
                  Browse the collection
                </Link>
                .
              </p>
            ) : (
              <>
                <ul className="mt-5 divide-y divide-border">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-4 py-3 text-sm">
                      <span className="min-w-0 text-primary">
                        {l.name}
                        <span className="block text-xs text-muted-foreground">
                          {l.variant} × {l.qty}
                        </span>
                      </span>
                      <span className="tabular-nums text-primary">
                        {formatPrice(l.price * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Shipping</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base font-medium text-primary">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd>
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
