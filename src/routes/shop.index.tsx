import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui-kit";
import { useAdminStore } from "@/lib/admin-store.tsx";
import { products as initialProducts } from "@/lib/products";

type ShopSearch = {
  category?: string;
  tag?: string;
};

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    return {
      category: search.category as string | undefined,
      tag: search.tag as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Artisanal Collection & Catalog | 9 Stories & Co." },
      {
        name: "description",
        content:
          "Browse our full catalog of handcrafted Putharekulu, A2 ghee sweets, savory butter murukku, roasted gunpowder podi, and luxury gift sets.",
      },
    ],
    links: [{ rel: "canonical", href: "https://9storiesandco.com/shop" }],
  }),
  component: Shop,
});

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "bestselling", label: "Best Selling" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

const categories = ["All", "Sweets", "Savouries", "Podi & Mixes", "Gift Boxes", "Special Offers"];
const dietaryList = ["Pure A2 Ghee", "Jaggery Based", "Refined Sugar Free", "Vegan", "Gluten-Free", "Under ₹99"];

function Shop() {
  const searchParams = useSearch({ from: "/shop/" });
  const { products: dynamicProducts } = useAdminStore();
  const catalogProducts = dynamicProducts || initialProducts;

  const [selectedCategory, setSelectedCategory] = React.useState<string>(searchParams.category || "All");
  const [selectedTag, setSelectedTag] = React.useState<string>(searchParams.tag || "All");
  const [maxPrice, setMaxPrice] = React.useState<number>(2000);
  const [sort, setSort] = React.useState<string>("featured");
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.category) setSelectedCategory(searchParams.category);
    if (searchParams.tag) setSelectedTag(searchParams.tag);
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    let result = [...catalogProducts];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedTag !== "All") {
      result = result.filter((p) => p.dietaryTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));
    }

    result = result.filter((p) => (p.weights[0]?.price || 0) <= maxPrice);

    if (sort === "bestselling") {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sort === "price-asc") {
      result.sort((a, b) => (a.weights[0]?.price || 0) - (b.weights[0]?.price || 0));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b.weights[0]?.price || 0) - (a.weights[0]?.price || 0));
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [catalogProducts, selectedCategory, selectedTag, maxPrice, sort]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedTag("All");
    setMaxPrice(2000);
    setSort("featured");
  };

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="The Heritage Catalog"
          title="All Sweets, Savouries &amp; Podi"
          subtitle="Handmade in small batches in Atreyapuram. Delivered fresh in airtight packaging."
        />

        {/* Top Controls Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <span>Showing {filteredProducts.length} Products</span>
            {(selectedCategory !== "All" || selectedTag !== "All" || maxPrice < 2000) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full bg-parchment px-2.5 py-1 text-[11px] text-accent font-bold hover:bg-accent hover:text-accent-foreground transition-colors ml-2"
              >
                <RotateCcw className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterDrawerOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-primary"
            >
              <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-muted-foreground">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:border-accent"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* FILTER ACCORDION SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-lg text-primary font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4 text-accent" /> Filter Catalog
                </h3>
              </div>

              {/* Category Filter */}
              <div>
                <p className="eyebrow text-primary font-semibold mb-2.5">Category</p>
                <div className="space-y-1.5 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left rounded-lg px-2.5 py-1.5 transition-colors ${
                        selectedCategory === cat
                          ? "bg-accent/10 text-accent font-bold"
                          : "text-muted-foreground hover:bg-parchment hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="border-t border-border pt-4">
                <p className="eyebrow text-primary font-semibold mb-2.5">Dietary &amp; Preference</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag("All")}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedTag === "All"
                        ? "bg-primary text-cream font-bold"
                        : "bg-parchment text-muted-foreground hover:bg-border"
                    }`}
                  >
                    All Tags
                  </button>
                  {dietaryList.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedTag === tag
                          ? "bg-accent text-accent-foreground font-bold"
                          : "bg-parchment text-muted-foreground hover:bg-border"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-primary">Max Price</span>
                  <span className="text-accent">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-border bg-card p-8">
                <p className="font-display text-xl text-primary">No products match your filters</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Try clearing filters or raising max price range.</p>
                <button
                  onClick={resetFilters}
                  className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground hover:bg-accent-hover"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT FILTER DRAWER */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs h-full bg-cream p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-lg text-primary font-bold">Filter Products</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-1 text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <p className="eyebrow text-primary font-semibold mb-2">Category</p>
              <div className="space-y-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterDrawerOpen(false);
                    }}
                    className={`block w-full text-left rounded-lg px-2 py-1.5 ${
                      selectedCategory === cat ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="eyebrow text-primary font-semibold mb-2">Dietary Preference</p>
              <div className="flex flex-wrap gap-1.5">
                {dietaryList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setFilterDrawerOpen(false);
                    }}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      selectedTag === tag ? "bg-accent text-accent-foreground font-bold" : "bg-parchment text-muted-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <button
                onClick={() => {
                  resetFilters();
                  setFilterDrawerOpen(false);
                }}
                className="w-full rounded-xl border border-accent bg-accent/10 py-2.5 text-xs font-bold text-accent"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
