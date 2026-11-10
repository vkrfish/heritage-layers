import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import * as React from "react";
import { useCustomerAuth } from "@/lib/customer-auth";
import { useAdminStore } from "@/lib/admin-store";
import { useCart } from "@/components/cart";
import { formatPrice, products as staticProducts, type Product } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useCustomerAuth();
  const { products: dynamicProducts } = useAdminStore();
  const { add } = useCart();

  const allProducts = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : staticProducts;

  const wishlistedItems = React.useMemo(() => {
    return wishlist
      .map((slug) => allProducts.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p));
  }, [wishlist, allProducts]);

  const handleMoveToCart = (product: Product) => {
    const defaultWeight = product.weights[0] || { label: "250g", price: 349 };
    add({
      slug: product.slug,
      name: product.name,
      variant: defaultWeight.label,
      price: defaultWeight.price,
      image: product.image,
      qty: 1,
    });
    void toggleWishlist(product.slug);
  };

  return (
    <Dialog.Root open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200" />
        <Dialog.Content
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] text-stone-900 shadow-2xl transition-transform duration-300 ease-[var(--ease-drawer,cubic-bezier(0.32,0.72,0,1))] font-sans border-l border-stone-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4 bg-[#F5F0E8]">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FAF7F2] border border-stone-200 text-[#C88A36]">
                <Heart className="h-4 w-4 fill-[#C88A36]" />
              </span>
              <div>
                <Dialog.Title className="font-serif text-xl text-[#241814] font-normal tracking-tight">
                  Saved Sweets
                </Dialog.Title>
                <p className="text-[11px] text-stone-500 font-medium">
                  {wishlistedItems.length} {wishlistedItems.length === 1 ? "delicacy" : "delicacies"} in your wishlist
                </p>
              </div>
            </div>
            <Dialog.Close
              aria-label="Close Wishlist"
              className="rounded-full p-2 text-stone-500 hover:bg-stone-200/60 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {wishlistedItems.length === 0 ? (
              <div className="py-20 text-center space-y-4 px-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F5F0E8] border border-stone-200 text-stone-400">
                  <Heart className="h-6 w-6 stroke-stone-400" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#241814]">Your collection is empty</h3>
                  <p className="font-sans text-xs text-stone-500 max-w-xs mx-auto mt-1.5 leading-relaxed">
                    Bookmark your favorite artisanal Putharekulu and sweets to review or share anytime.
                  </p>
                </div>
                <Button
                  onClick={() => setIsWishlistOpen(false)}
                  variant="primary"
                  className="bg-[#241814] text-white hover:bg-stone-800 text-xs mt-2"
                >
                  Explore Collection
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-stone-200/70">
                {wishlistedItems.map((item) => {
                  const basePrice = item.weights[0]?.price || 0;
                  return (
                    <li key={item.slug} className="py-3.5 flex gap-3.5 items-center">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: item.slug }}
                        onClick={() => setIsWishlistOpen(false)}
                        className="h-18 w-18 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to="/shop/$slug"
                          params={{ slug: item.slug }}
                          onClick={() => setIsWishlistOpen(false)}
                          className="font-serif text-base text-[#241814] hover:text-[#C88A36] truncate block leading-tight"
                        >
                          {item.name}
                        </Link>
                        <span className="text-[11px] text-stone-500 truncate block mt-0.5">{item.tagline}</span>
                        <div className="text-xs font-semibold text-stone-900 mt-1 tabular-nums">
                          From {formatPrice(basePrice)}
                        </div>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#241814] px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <ShoppingBag className="h-3 w-3" /> Add to Bag
                          </button>
                          <button
                            onClick={() => void toggleWishlist(item.slug)}
                            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors cursor-pointer"
                            title="Remove from wishlist"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {wishlistedItems.length > 0 && (
            <div
              className="border-t border-stone-200/80 p-4 sm:p-5 bg-[#F5F0E8] space-y-2"
              style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              <Link to="/shop" onClick={() => setIsWishlistOpen(false)} className="block">
                <Button variant="secondary" className="w-full justify-center gap-2 text-xs py-2.5">
                  Continue Exploring <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
