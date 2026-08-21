import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as React from "react";

import { useCart } from "@/components/cart";
import { ProductCard } from "@/components/product-card";
import { Badge, Button, Eyebrow, Price, QuantitySelector, Rating } from "@/components/ui-kit";
import { getProduct, products } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — 9 Stories & Co." }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const description = `${product.tagline}. ${product.description}`;
    return {
      meta: [
        { title: `${product.name} — 9 Stories & Co.` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} — 9 Stories & Co.` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [index, setIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const weight = product.weights[index] ?? product.weights[0]!;
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="px-5 py-12 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:text-accent">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <img
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            width={1200}
            height={1200}
            className="w-full rounded-[12px] border border-border object-cover"
          />

          <div>
            {product.badge ? <Badge>{product.badge}</Badge> : null}
            <Eyebrow className="mt-4 block">{product.tagline}</Eyebrow>
            <h1 className="mt-3 text-5xl leading-tight text-primary">{product.name}</h1>
            <div className="mt-4">
              <Rating value={product.rating} count={product.reviews} />
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8">
              <p className="eyebrow text-muted-foreground">Choose a size</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.weights.map((w, i) => (
                  <button
                    key={w.label}
                    onClick={() => setIndex(i)}
                    aria-pressed={i === index}
                    className={cn(
                      "min-h-11 rounded-[10px] border px-4 text-sm transition-colors",
                      i === index
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Price value={weight.price * qty} className="text-3xl" />
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() =>
                  add({
                    slug: product.slug,
                    name: product.name,
                    variant: weight.label,
                    price: weight.price,
                    image: product.image,
                    qty,
                  })
                }
              >
                Add to cart
              </Button>
              <Link to="/gifting">
                <Button size="lg" variant="secondary">
                  Gift this
                </Button>
              </Link>
            </div>

            <dl className="mt-10 divide-y divide-border border-t border-border text-sm">
              {[
                ["Ingredients", product.ingredients],
                ["Allergens", product.allergens],
                ["Storage", product.storage],
                ["Shelf life", product.shelfLife],
              ].map(([term, detail]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                  <dt className="eyebrow text-muted-foreground">{term}</dt>
                  <dd className="leading-relaxed text-primary">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl text-primary">You may also like</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
