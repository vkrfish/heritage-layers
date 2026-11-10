import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { Badge, Button, Rating } from "@/components/ui-kit";
import { formatPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { isInWishlist, toggleWishlist } = useCustomerAuth();
  const [weightIndex, setWeightIndex] = React.useState(0);
  const wished = isInWishlist(product.slug);
  const weight = product.weights[weightIndex] ?? product.weights[0]!;

  const reviews = product.reviewsCount ?? (product as any).reviews ?? 100;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-brown/10 bg-white p-2 sm:p-3.5 transition-all duration-200 hover:border-brown/20 shadow-soft font-sans">
      <div className="relative overflow-hidden rounded-md bg-[#FAF7F2] border border-brown/5">
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          aria-label={`View ${product.name}`}
          className="block"
        >
          <img
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            loading="lazy"
            width={900}
            height={900}
            className="aspect-square w-full object-cover product-image-zoom"
          />
        </Link>
        {product.badge ? (
          <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
            <Badge variant={product.badge.toLowerCase().includes("pure") || product.badge.toLowerCase().includes("natural") ? "green" : "gold"}>
              {product.badge}
            </Badge>
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggleWishlist(product.slug)}
          className={cn(
            "absolute top-2 right-2 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-white/95 text-stone-700 shadow-2xs border border-stone-200/80 transition-all duration-140 hover:bg-white hover:text-[#C88A36] hover:scale-105 active:scale-90 cursor-pointer",
            wished && "text-[#C88A36] border-[#C88A36]/40 bg-white"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5 stroke-[1.75]", wished && "fill-[#C88A36] text-[#C88A36]")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-2 sm:pt-2.5">
        <div className="mb-0.5 flex items-center justify-between">
          <span className="font-sans text-[9px] sm:text-[11px] font-medium uppercase tracking-wider text-stone-500 truncate">{product.category}</span>
          <div className="hidden sm:block">
            <Rating value={product.rating} count={reviews} />
          </div>
        </div>

        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <h3 className="font-serif text-sm sm:text-lg font-normal leading-snug text-[#241814] hover:text-[#C88A36] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 font-sans text-[10px] sm:text-xs font-normal leading-relaxed text-stone-500">
          {product.tagline || product.description}
        </p>

        {/* Weight Variant Selector Pills (Figma SDS Pill Tokens) */}
        <div className="mt-1.5 flex flex-nowrap sm:flex-wrap gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {product.weights.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWeightIndex(i)}
              aria-pressed={i === weightIndex}
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 font-sans text-[9px] sm:text-[11px] font-medium transition-all duration-140 cursor-pointer active:scale-95",
                i === weightIndex
                  ? "bg-[#241814] text-white shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/50",
              )}
            >
              {w.label.split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-2.5">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="font-sans text-sm sm:text-base font-semibold text-[#241814] tabular-nums">{formatPrice(weight.price)}</span>
              {weight.msrp && weight.msrp > weight.price && (
                <span className="font-sans text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                  {formatPrice(weight.msrp)}
                </span>
              )}
            </div>
            {weight.msrp && weight.msrp > weight.price && (
              <span className="rounded-full bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 font-sans text-[9px] font-medium text-[#8F5B1D] tabular-nums">
                Save {Math.round(((weight.msrp - weight.price) / weight.msrp) * 100)}%
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              add({
                slug: product.slug,
                name: product.name,
                variant: weight.label,
                price: weight.price,
                image: product.image,
                qty: 1,
              })
            }
            className="w-full h-8.5 sm:h-9 gap-1.5 text-xs font-medium"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </Button>
        </div>
      </div>
    </article>
  );
}
