import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { Badge, Button, Price, Rating } from "@/components/ui-kit";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [weightIndex, setWeightIndex] = React.useState(0);
  const [wished, setWished] = React.useState(false);
  const weight = product.weights[weightIndex];

  return (
    <article className="group flex flex-col overflow-hidden rounded-[12px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
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
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
          className="absolute top-2 right-2 grid h-11 w-11 place-items-center rounded-full text-primary transition-colors duration-200 hover:text-accent"
        >
          <Heart className={cn("h-[18px] w-[18px]", wished && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-2xl leading-tight text-primary">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-3">
          <Rating value={product.rating} count={product.reviews} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.weights.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setWeightIndex(i)}
              aria-pressed={i === weightIndex}
              className={cn(
                "rounded-[8px] border px-3 py-1.5 text-xs transition-colors duration-200",
                i === weightIndex
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {w.label.split(" · ")[0]}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Price value={weight.price} className="text-lg" />
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
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
