import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { X, Trash2, ShoppingBag } from "lucide-react";
import * as React from "react";

import { Button, QuantitySelector } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";

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

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const value = React.useMemo(
    () => ({ lines, add, remove, setQty, count, subtotal, open, setOpen }),
    [lines, add, remove, setQty, count, subtotal, open],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { lines, remove, setQty, subtotal, open, setOpen } = useCart();
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-lift duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <Dialog.Title className="text-2xl text-primary">Your Cart</Dialog.Title>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:text-accent"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingBag className="h-8 w-8 text-gold" />
              <p className="text-sm text-muted-foreground">
                Your cart is waiting for something delicate.
              </p>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Continue shopping
              </Button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
                {lines.map((line) => (
                  <li key={line.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-[8px] border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-primary">{line.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{line.variant}</p>
                        </div>
                        <button
                          onClick={() => remove(line.id)}
                          aria-label={`Remove ${line.name}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
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
                        <span className="text-sm font-medium tabular-nums text-primary">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border bg-parchment/40 px-6 py-5">
                <dl className="space-y-2 text-sm">
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
                <Link to="/checkout" onClick={() => setOpen(false)} className="mt-5 block">
                  <Button className="w-full">Proceed to checkout</Button>
                </Link>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setOpen(false)}>
                  Continue shopping
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
