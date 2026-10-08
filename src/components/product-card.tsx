import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { Badge, Button, Rating } from "@/components/ui-kit";
import { formatPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [weightIndex, setWeightIndex] = React.useState(0);
  const [wished, setWished] = React.useState(false);
  const weight = product.weights[weightIndex] ?? product.weights[0]!;

  const reviews = product.reviewsCount ?? (product as any).reviews ?? 100;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-brown/15 bg-cream-light p-2.5 sm:p-4 transition-all duration-300 hover:shadow-lift font-sans">
      <div className="relative overflow-hidden rounded-lg bg-cream">
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
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {product.badge ? (
          <span className="absolute top-2 left-2">
            <Badge variant={product.badge.toLowerCase().includes("pure") || product.badge.toLowerCase().includes("natural") ? "green" : "gold"}>
              {product.badge}
            </Badge>
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => setWished((v) => !v)}
          className="absolute top-2 right-2 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-cream/90 text-brown transition-colors duration-200 hover:text-terracotta shadow-flat cursor-pointer"
        >
          <Heart className={cn("h-4 w-4 stroke-[2]", wished && "fill-terracotta text-terracotta")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brown/70">{product.category}</span>
          <Rating value={product.rating} count={reviews} />
        </div>

        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-base sm:text-2xl font-normal leading-snug text-brown hover:text-terracotta transition-colors line-clamp-2 min-h-[40px] sm:min-h-[48px]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 sm:line-clamp-2 font-sans text-xs sm:text-sm font-bold leading-relaxed text-brown/70">
          {product.tagline || product.description}
        </p>

        {/* Weight Variant Selector Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {product.weights.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWeightIndex(i)}
              aria-pressed={i === weightIndex}
              className={cn(
                "rounded-md border px-2 py-0.5 font-sans text-[11px] font-bold transition-all duration-200 cursor-pointer",
                i === weightIndex
                  ? "border-terracotta bg-terracotta/15 text-terracotta font-bold"
                  : "border-brown/20 text-brown/70 hover:border-brown hover:bg-cream",
              )}
            >
              {w.label.split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-lg sm:text-2xl font-bold text-terracotta">{formatPrice(weight.price)}</span>
              {weight.msrp && weight.msrp > weight.price && (
                <span className="font-sans text-[11px] sm:text-xs text-brown/50 line-through tabular-nums">
                  {formatPrice(weight.msrp)}
                </span>
              )}
            </div>
            {weight.msrp && weight.msrp > weight.price && (
              <span className="rounded bg-gold/20 px-1.5 py-0.5 font-sans text-[10px] font-bold text-brown">
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
            className="w-full h-9 gap-1.5 text-xs bg-brown text-white hover:bg-terracotta rounded-lg font-bold"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
