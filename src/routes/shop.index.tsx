import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui-kit";
import { useAdminStore } from "@/lib/admin-store.tsx";
import { products as initialProducts } from "@/lib/products";

type ShopSearch = {
  category?: string | undefined;
  tag?: string | undefined;
};

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    return {
      category: typeof search["category"] === "string" ? search["category"] : undefined,
      tag: typeof search["tag"] === "string" ? search["tag"] : undefined,
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
  const catalogProducts = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : initialProducts;

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
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="The Heritage Catalog"
          title="All Sweets, Savouries &amp; Podi"
          subtitle="Handmade in small batches in Atreyapuram. Delivered fresh in airtight packaging."
        />

        {/* Top Controls Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-brown/15 pb-4">
          <div className="flex items-center gap-2 font-sans text-sm font-bold text-brown">
            <span>Showing {filteredProducts.length} Products</span>
            {(selectedCategory !== "All" || selectedTag !== "All" || maxPrice < 2000) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full bg-cream-light px-3 py-1 font-sans text-xs font-bold text-terracotta hover:bg-gold hover:text-brown transition-colors ml-2 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 font-sans font-bold">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterDrawerOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-brown/20 bg-cream-light px-3 py-2 text-sm text-brown"
            >
              <SlidersHorizontal className="h-4 w-4 text-terracotta" /> Filters
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-brown/70">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-brown/20 bg-cream-light px-3 py-2 text-sm font-bold text-brown focus:outline-none focus:border-terracotta cursor-pointer"
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
            <div className="rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat space-y-6">
              <div className="flex items-center justify-between border-b border-brown/15 pb-3">
                <h3 className="font-display text-2xl text-brown flex items-center gap-2">
                  <Filter className="h-5 w-5 text-terracotta" /> Filter Catalog
                </h3>
              </div>

              {/* Category Filter */}
              <div>
                <p className="eyebrow text-terracotta mb-2.5">Category</p>
                <div className="space-y-1.5 font-sans text-sm font-bold">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-terracotta/15 text-terracotta font-bold"
                          : "text-brown/70 hover:bg-cream hover:text-brown"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="border-t border-brown/15 pt-4">
                <p className="eyebrow text-terracotta mb-2.5">Dietary &amp; Preference</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag("All")}
                    className={`rounded-full px-3 py-1 font-sans text-xs font-bold transition-all cursor-pointer ${
                      selectedTag === "All"
                        ? "bg-brown text-white"
                        : "bg-cream text-brown/70 hover:bg-brown/10"
                    }`}
                  >
                    All Tags
                  </button>
                  {dietaryList.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full px-3 py-1 font-sans text-xs font-bold transition-all cursor-pointer ${
                        selectedTag === tag
                          ? "bg-terracotta text-white"
                          : "bg-cream text-brown/70 hover:bg-brown/10"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="border-t border-brown/15 pt-4">
                <div className="flex justify-between font-sans text-sm font-bold mb-2">
                  <span className="text-brown">Max Price</span>
                  <span className="text-terracotta">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-terracotta cursor-pointer"
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
              <div className="text-center py-20 rounded-xl border border-brown/15 bg-cream-light p-8">
                <p className="font-display text-3xl text-brown">No products match your filters</p>
                <p className="font-sans text-sm font-bold text-brown/70 mt-1 mb-4">Try clearing filters or raising max price range.</p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-brown px-5 py-2.5 font-sans text-sm font-bold text-white hover:bg-terracotta transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex justify-end bg-brown/50 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs h-full bg-cream p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right font-sans">
            <div className="flex items-center justify-between border-b border-brown/15 pb-4">
              <h3 className="font-display text-2xl text-brown">Filter Products</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-1 text-brown/70">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div>
              <p className="eyebrow text-terracotta mb-2">Category</p>
              <div className="space-y-1 font-sans text-sm font-bold">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterDrawerOpen(false);
                    }}
                    className={`block w-full text-left rounded-md px-3 py-2 ${
                      selectedCategory === cat ? "bg-terracotta/15 text-terracotta" : "text-brown/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-brown/15 pt-4">
              <p className="eyebrow text-terracotta mb-2">Dietary Preference</p>
              <div className="flex flex-wrap gap-1.5">
                {dietaryList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setFilterDrawerOpen(false);
                    }}
                    className={`rounded-full px-3 py-1 font-sans text-xs font-bold ${
                      selectedTag === tag ? "bg-terracotta text-white" : "bg-cream-light text-brown/70"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-brown/15 pt-4">
              <button
                onClick={() => {
                  resetFilters();
                  setFilterDrawerOpen(false);
                }}
                className="w-full rounded-lg border border-brown bg-brown/10 py-2.5 font-sans text-sm font-bold text-brown"
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
