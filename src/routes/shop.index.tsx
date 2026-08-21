import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui-kit";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop Putharekulu — 9 Stories & Co." },
      {
        name: "description",
        content:
          "Classic, ghee, dry fruit and jaggery Putharekulu plus premium gift boxes, handmade fresh in Andhra Pradesh.",
      },
      { property: "og:title", content: "Shop Putharekulu — 9 Stories & Co." },
      {
        property: "og:description",
        content: "Handmade Andhra Putharekulu in four varieties and keepsake gift boxes.",
      },
    ],
  }),
  component: Shop,
});

const sorts = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"] as const;

function Shop() {
  const [sort, setSort] = React.useState<(typeof sorts)[number]>("Featured");

  const list = React.useMemo(() => {
    const copy = [...products];
    if (sort === "Price: Low to High") copy.sort((a, b) => a.weights[0]!.price - b.weights[0]!.price);
    if (sort === "Price: High to Low") copy.sort((a, b) => b.weights[0]!.price - a.weights[0]!.price);
    if (sort === "Top Rated") copy.sort((a, b) => b.rating - a.rating);
    return copy;
  }, [sort]);

  return (
    <div className="px-5 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="The Collection"
          title="Every variety we make"
          subtitle="Made to order, packed the same day, and never sitting on a shelf."
        />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {sorts.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              aria-pressed={s === sort}
              className={cn(
                "min-h-11 rounded-full border px-5 text-xs tracking-[0.12em] uppercase transition-colors",
                s === sort
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
