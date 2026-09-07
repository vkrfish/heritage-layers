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
  const [expressItem, setExpressItem] = React.useState<{ name?: string; variant?: string; price?: number; qty?: number }>({});

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

  // Recommendations to upsell inside cart
  const upsellItems = products.filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 2);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-lift duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              <Dialog.Title className="font-display text-xl text-primary">Your Cart</Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:text-accent"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Free Shipping Threshold Progress Bar */}
          <div className="bg-parchment/70 px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs text-primary font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-accent" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE Express Shipping!`
                  : "🎉 You unlocked FREE Express Shipping!"}
              </span>
              <span className="text-accent font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gold/60 stroke-1" />
              <p className="font-display text-lg text-primary">Your cart is empty</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Explore our authentic handcrafted Putharekulu, Savouries, Podi mixes, and Gift boxes.
              </p>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Explore Catalog
              </Button>
            </div>
          ) : (
            <>
              {/* Line Items List */}
              <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
                {lines.map((line) => (
                  <li key={line.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-4">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-primary">{line.name}</p>
                          <span className="inline-block mt-0.5 rounded bg-parchment px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {line.variant}
                          </span>
                        </div>
                        <button
                          onClick={() => remove(line.id)}
                          aria-label={`Remove ${line.name}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive p-1"
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
                        <span className="text-sm font-bold tabular-nums text-primary">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Cart Upsell Carousel */}
                {upsellItems.length > 0 && (
                  <li className="py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Frequently Added Together
                    </p>
                    <div className="space-y-2">
                      {upsellItems.map((item) => (
                        <div
                          key={item.slug}
                          className="flex items-center justify-between rounded-lg border border-border/80 bg-cream p-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover border border-border"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-primary">{item.name}</p>
                              <p className="text-[11px] text-accent font-semibold">
                                {formatPrice(item.weights[0].price)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              add({
                                slug: item.slug,
                                name: item.name,
                                variant: item.weights[0].label,
                                price: item.weights[0].price,
                                image: item.image,
                                qty: 1,
                              })
                            }
                            className="flex items-center gap-1 rounded-md border border-accent bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
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
              <div className="border-t border-border bg-parchment/40 px-6 py-4 space-y-3">
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums font-medium">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Estimated Delivery</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-accent font-semibold">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-primary">
                    <dt>Total Amount</dt>
                    <dd className="tabular-nums text-accent">{formatPrice(subtotal + shipping)}</dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full text-xs justify-center py-2.5">
                      Standard Checkout
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openExpress();
                    }}
                    className="w-full text-xs justify-center gap-1 py-2.5 bg-accent text-accent-foreground hover:bg-accent-hover"
                  >
                    <Zap className="h-3.5 w-3.5 fill-current" /> Express Buy
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
