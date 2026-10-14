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
    setIsWishlistOpen(false);
  };

  return (
    <Dialog.Root open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brown/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-right font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brown/15 p-5 sm:p-6 bg-cream-light">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-terracotta fill-terracotta" />
              <Dialog.Title className="font-display text-2xl text-brown font-normal">
                Your Wishlist ({wishlistedItems.length})
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close Wishlist"
              className="rounded-full p-2 text-brown/70 hover:bg-cream hover:text-brown transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {wishlistedItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-brown">
                  <Heart className="h-8 w-8 text-brown/40" />
                </div>
                <h3 className="font-display text-2xl text-brown">Your wishlist is empty</h3>
                <p className="font-sans text-xs font-bold text-brown/70 max-w-xs mx-auto">
                  Save your favorite artisanal sweets and gift boxes to enjoy later or share with family.
                </p>
                <Button
                  onClick={() => setIsWishlistOpen(false)}
                  variant="primary"
                  className="bg-brown text-white hover:bg-terracotta mt-2"
                >
                  Explore Collection
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-brown/15 space-y-3">
                {wishlistedItems.map((item) => {
                  const basePrice = item.weights[0]?.price || 0;
                  return (
                    <li key={item.slug} className="flex gap-4 pt-3 pb-3 items-center">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: item.slug }}
                        onClick={() => setIsWishlistOpen(false)}
                        className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-brown/20 bg-cream-light"
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to="/shop/$slug"
                          params={{ slug: item.slug }}
                          onClick={() => setIsWishlistOpen(false)}
                          className="font-sans text-sm font-bold text-brown hover:text-terracotta truncate block"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-brown/60 font-bold block">{item.tagline}</span>
                        <span className="text-sm font-bold text-terracotta block mt-0.5">
                          From {formatPrice(basePrice)}
                        </span>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brown px-3 py-1 text-xs font-bold text-white hover:bg-terracotta transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                          </button>
                          <button
                            onClick={() => void toggleWishlist(item.slug)}
                            className="rounded-lg p-1.5 text-brown/50 hover:bg-terracotta/10 hover:text-terracotta transition-colors cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
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
            <div className="border-t border-brown/15 p-5 bg-cream-light space-y-2">
              <Link to="/shop" onClick={() => setIsWishlistOpen(false)}>
                <Button variant="secondary" className="w-full justify-center gap-2 text-xs">
                  Continue Shopping <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
