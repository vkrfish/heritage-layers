import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { X, Trash2, ShoppingBag, Truck, Zap, Plus } from "lucide-react";
import * as React from "react";

import { Button, QuantitySelector } from "@/components/ui-kit";
import { ExpressCheckoutModal } from "@/components/express-checkout";
import { formatPrice, products } from "@/lib/products";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  variant: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  openExpress: (productName?: string, variantLabel?: string, price?: number, qty?: number) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [open, setOpen] = React.useState(false);
  const [expressOpen, setExpressOpen] = React.useState(false);
  const [expressItem, setExpressItem] = React.useState<{ name?: string | undefined; variant?: string | undefined; price?: number | undefined; qty?: number | undefined }>({});

  const add = React.useCallback((line: Omit<CartLine, "id">) => {
    const id = `${line.slug}__${line.variant}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...prev, { ...line, id }];
    });
    setOpen(true);
  }, []);

  const remove = React.useCallback(
    (id: string) => setLines((prev) => prev.filter((l) => l.id !== id)),
    [],
  );

  const setQty = React.useCallback(
    (id: string, qty: number) =>
      setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l))),
    [],
  );

  const openExpress = React.useCallback((name?: string, variant?: string, price?: number, qty?: number) => {
    setExpressItem({ name, variant, price, qty });
    setExpressOpen(true);
  }, []);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const value = React.useMemo(
    () => ({ lines, add, remove, setQty, count, subtotal, open, setOpen, openExpress }),
    [lines, add, remove, setQty, count, subtotal, open, openExpress],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <ExpressCheckoutModal
        open={expressOpen}
        onOpenChange={setExpressOpen}
        productName={expressItem.name || (lines[0]?.name ?? "Classic Putharekulu")}
        variantLabel={expressItem.variant || (lines[0]?.variant ?? "500g")}
        price={expressItem.price || (lines[0]?.price ?? subtotal)}
        qty={expressItem.qty || 1}
      />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { lines, add, remove, setQty, subtotal, open, setOpen, openExpress } = useCart();
  const FREE_SHIPPING_THRESHOLD = 999;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 79;

  const upsellItems = products.filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 2);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brown/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-lift duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brown/15 px-6 py-4 bg-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-terracotta" />
              <Dialog.Title className="font-display text-2xl text-brown font-normal">Your Cart</Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-10 w-10 place-items-center rounded-full text-brown transition-colors hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-cream-light px-6 py-3 border-b border-brown/15 border-l-4 border-l-gold">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-brown mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-terracotta" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE Express Shipping!`
                  : "🎉 You unlocked FREE Express Shipping!"}
              </span>
              <span className="text-terracotta font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-brown/10 overflow-hidden">
              <div
                className="h-full bg-terracotta transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gold stroke-1" />
              <p className="font-display text-2xl text-brown">Your cart is empty</p>
              <p className="font-sans text-sm font-bold text-brown/70 max-w-xs">
                Explore our authentic handcrafted Putharekulu, Savouries, Podi mixes, and Gift boxes.
              </p>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Explore Catalog
              </Button>
            </div>
          ) : (
            <>
              {/* Line Items List */}
              <ul className="flex-1 divide-y divide-brown/15 overflow-y-auto px-6">
                {lines.map((line) => (
                  <li key={line.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-4">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-lg border border-brown/15 object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-normal text-brown">{line.name}</p>
                          <span className="inline-block mt-0.5 rounded bg-gold/20 px-2 py-0.5 font-sans text-xs font-bold text-brown">
                            {line.variant}
                          </span>
                        </div>
                        <button
                          onClick={() => remove(line.id)}
                          aria-label={`Remove ${line.name}`}
                          className="shrink-0 text-brown/60 transition-colors hover:text-terracotta p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QuantitySelector
                          compact
                          value={line.qty}
                          onChange={(n) => setQty(line.id, n)}
                        />
                        <span className="font-sans text-base font-bold tabular-nums text-terracotta">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Cart Upsell Items */}
                {upsellItems.length > 0 && (
                  <li className="py-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-brown/70 mb-3">
                      Frequently Added Together
                    </p>
                    <div className="space-y-2">
                      {upsellItems.map((item) => (
                        <div
                          key={item.slug}
                          className="flex items-center justify-between rounded-lg border border-brown/15 bg-cream-light p-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover border border-brown/15"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-sans text-sm font-bold text-brown">{item.name}</p>
                              <p className="font-sans text-xs font-bold text-terracotta">
                                {formatPrice(item.weights[0]?.price ?? 0)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              add({
                                slug: item.slug,
                                name: item.name,
                                variant: item.weights[0]?.label ?? "",
                                price: item.weights[0]?.price ?? 0,
                                image: item.image,
                                qty: 1,
                              })
                            }
                            className="flex items-center gap-1 rounded-md border border-terracotta bg-terracotta/10 px-2.5 py-1 font-sans text-xs font-bold text-terracotta hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </li>
                )}
              </ul>

              {/* Drawer Footer & Checkout */}
              <div className="border-t border-brown/15 bg-cream-light px-6 py-4 space-y-3">
                <dl className="space-y-1.5 font-sans text-sm font-bold">
                  <div className="flex justify-between text-brown/70">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-brown/70">
                    <dt>Estimated Delivery</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-green font-bold">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-brown/15 pt-2 font-sans text-lg font-bold text-brown">
                    <dt>Total Amount</dt>
                    <dd className="tabular-nums text-terracotta">{formatPrice(subtotal + shipping)}</dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full text-sm justify-center py-2.5">
                      Standard Checkout
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openExpress();
                    }}
                    variant="accent"
                    className="w-full text-sm justify-center gap-1 py-2.5 bg-terracotta text-white hover:bg-brown"
                  >
                    <Zap className="h-4 w-4 fill-current" /> Express Buy
                  </Button>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
