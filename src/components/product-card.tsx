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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden bg-parchment/40">
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
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {product.badge ? (
          <span className="absolute top-3 left-3">
            <Badge>{product.badge}</Badge>
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => setWished((v) => !v)}
          className="absolute top-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-cream/80 backdrop-blur-sm text-primary transition-colors duration-200 hover:text-accent shadow-sm"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="eyebrow text-[10px] font-bold text-muted-foreground uppercase">{product.category}</span>
          <Rating value={product.rating} count={reviews} />
        </div>

        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-xl leading-snug text-primary font-medium hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.tagline || product.description}
        </p>

        {/* Interactive Weight Variant Selector Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.weights.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWeightIndex(i)}
              aria-pressed={i === weightIndex}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200",
                i === weightIndex
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-parchment/50",
              )}
            >
              {w.label.split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 border-t border-border/60">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-primary">{formatPrice(weight.price)}</span>
              {weight.msrp && weight.msrp > weight.price && (
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {formatPrice(weight.msrp)}
                </span>
              )}
            </div>
            {weight.msrp && weight.msrp > weight.price && (
              <span className="text-[10px] font-bold text-accent">
                Save {Math.round(((weight.msrp - weight.price) / weight.msrp) * 100)}%
              </span>
            )}
          </div>

          <Button
            size="sm"
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
            className="gap-1 px-3 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
