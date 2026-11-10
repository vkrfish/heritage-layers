import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { X, Trash2, ShoppingBag, Truck, Zap, Plus } from "lucide-react";
import * as React from "react";

import { Button, QuantitySelector } from "@/components/ui-kit";
import { ExpressCheckoutModal } from "@/components/express-checkout";
import { formatPrice, products } from "@/lib/products";
import { useCustomerAuth } from "@/lib/customer-auth";

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
  clear: () => void;
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
  const { user, openAuthModal } = useCustomerAuth();
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [open, setOpen] = React.useState(false);
  const [expressOpen, setExpressOpen] = React.useState(false);
  const [expressItem, setExpressItem] = React.useState<{ name?: string | undefined; variant?: string | undefined; price?: number | undefined; qty?: number | undefined }>({});

  const addDirect = React.useCallback((line: Omit<CartLine, "id">) => {
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

  const add = React.useCallback(
    (line: Omit<CartLine, "id">) => {
      if (!user) {
        openAuthModal({
          mode: "signin",
          onAuthenticated: () => addDirect(line),
        });
        return;
      }
      addDirect(line);
    },
    [user, openAuthModal, addDirect]
  );

  const remove = React.useCallback(
    (id: string) => setLines((prev) => prev.filter((l) => l.id !== id)),
    [],
  );

  const setQty = React.useCallback(
    (id: string, qty: number) =>
      setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l))),
    [],
  );

  const openExpress = React.useCallback(
    (name?: string, variant?: string, price?: number, qty?: number) => {
      if (!user) {
        openAuthModal({
          mode: "signin",
          onAuthenticated: () => {
            setExpressItem({ name, variant, price, qty });
            setExpressOpen(true);
          },
        });
        return;
      }
      setExpressItem({ name, variant, price, qty });
      setExpressOpen(true);
    },
    [user, openAuthModal]
  );

  const clear = React.useCallback(() => setLines([]), []);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const value = React.useMemo(
    () => ({ lines, add, remove, setQty, clear, count, subtotal, open, setOpen, openExpress }),
    [lines, add, remove, setQty, clear, count, subtotal, open, openExpress],
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-250 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brown/10 px-5 py-4 bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-brown" />
              <Dialog.Title className="font-display text-2xl text-brown font-normal tracking-tight">Your Selection</Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full text-brown/70 transition-colors hover:text-brown border border-brown/10"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-white px-5 py-3 border-b border-brown/10">
            <div className="flex items-center justify-between font-sans text-xs font-normal text-brown/80 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-gold" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for Free Shipping`
                  : "Complimentary Express Delivery unlocked"}
              </span>
              <span className="font-medium text-brown tabular-nums">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-brown/10 overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <ShoppingBag className="h-10 w-10 text-brown/30 stroke-1" />
              <p className="font-display text-2xl text-brown font-normal">Your bag is empty</p>
              <p className="font-sans text-xs font-normal text-brown/60 max-w-xs leading-relaxed">
                Handcrafted Putharekulu, A2 ghee sweets, savouries, and heritage gift hampers made fresh daily.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Explore Catalog
              </Button>
            </div>
          ) : (
            <>
              {/* Line Items List */}
              <ul className="flex-1 divide-y divide-brown/10 overflow-y-auto px-5">
                {lines.map((line) => (
                  <li key={line.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3.5 py-4">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded border border-brown/10 object-cover bg-white"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-base font-normal text-brown">{line.name}</p>
                          <span className="inline-block mt-0.5 rounded border border-brown/15 bg-white px-1.5 py-0.2 font-sans text-[10px] font-medium text-brown/70">
                            {line.variant}
                          </span>
                        </div>
                        <button
                          onClick={() => remove(line.id)}
                          aria-label={`Remove ${line.name}`}
                          className="shrink-0 text-brown/40 transition-colors hover:text-brown p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <QuantitySelector
                          compact
                          value={line.qty}
                          onChange={(n) => setQty(line.id, n)}
                        />
                        <span className="font-sans text-sm font-semibold tabular-nums text-brown">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Cart Upsell Items */}
                {upsellItems.length > 0 && (
                  <li className="py-4">
                    <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-brown/60 mb-2.5">
                      Frequently Paired Together
                    </p>
                    <div className="space-y-2">
                      {upsellItems.map((item) => (
                        <div
                          key={item.slug}
                          className="flex items-center justify-between rounded border border-brown/10 bg-white p-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-9 w-9 rounded object-cover border border-brown/10"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-sans text-xs font-medium text-brown">{item.name}</p>
                              <p className="font-sans text-[11px] font-normal text-brown/60 tabular-nums">
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
                            className="flex items-center gap-1 rounded border border-brown/20 bg-white px-2 py-0.5 font-sans text-xs font-medium text-brown hover:bg-brown hover:text-white transition-colors cursor-pointer"
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
              <div className="border-t border-brown/10 bg-white px-5 py-4 space-y-3">
                <dl className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between text-brown/70">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums font-medium text-brown">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-brown/70">
                    <dt>Shipping</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? (
                        <span className="text-green font-medium">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-brown/10 pt-2 font-sans text-base font-semibold text-brown">
                    <dt>Total Amount</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full text-xs justify-center h-10">
                      Standard Checkout
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openExpress();
                    }}
                    variant="gold"
                    className="w-full text-xs justify-center gap-1 h-10"
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
