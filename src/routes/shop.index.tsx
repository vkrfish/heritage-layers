import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";
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
  { id: "featured", label: "Curated (Featured)" },
  { id: "bestselling", label: "Most Loved" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
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

  // Active filter count
  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedTag !== "All" ? 1 : 0) +
    (maxPrice < 2000 ? 1 : 0);

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
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 px-3.5 sm:px-6 lg:px-10 font-sans text-stone-900 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[1400px]">
        {/* Editorial Heading */}
        <div className="mb-6 sm:mb-8">
          <SectionHeading
            eyebrow="The Heritage Catalog"
            title="All Sweets, Savouries &amp; Podi"
            subtitle="Handcrafted in small batches in Atreyapuram. Delivered fresh in airtight packaging."
          />
        </div>

        {/* Mobile Quick Category Rail (1-tap access on phones) */}
        <div className="lg:hidden -mx-3.5 px-3.5 mb-5 overflow-x-auto scrollbar-none flex items-center gap-2 touch-pan-x">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-[#241814] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-stone-200/70 py-3 sm:py-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
            <span className="font-medium text-stone-900 tabular-nums">{filteredProducts.length}</span>
            <span>{filteredProducts.length === 1 ? "item found" : "handcrafted items"}</span>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 hover:bg-stone-200 hover:text-stone-900 transition-colors ml-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="h-3 w-3" /> Clear filters ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 shadow-2xs hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#C88A36]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#241814] text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="catalog-sort" className="hidden sm:inline text-stone-500 font-medium">
                Sort:
              </label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 shadow-2xs focus:outline-none focus:border-stone-400 cursor-pointer"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-12">
          {/* FILTER ACCORDION SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5">
            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-5 shadow-2xs space-y-5 backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                <h3 className="font-serif text-lg tracking-tight text-[#241814] flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#C88A36]" /> Filter Collection
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-medium text-stone-500 hover:text-stone-900 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">Category</p>
                <div className="space-y-1 text-xs">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between text-left rounded-md px-2.5 py-1.5 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#241814] text-white font-medium"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#E6C687]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="border-t border-stone-200/60 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">Dietary &amp; Preference</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag("All")}
                    className={`rounded-full px-2.5 py-1 text-xs transition-all cursor-pointer ${
                      selectedTag === "All"
                        ? "bg-[#241814] text-white font-medium"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                    }`}
                  >
                    All Tags
                  </button>
                  {dietaryList.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`rounded-full px-2.5 py-1 text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C88A36] text-white font-medium"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="border-t border-stone-200/60 pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-stone-700">Max Price</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C88A36] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹100</span>
                  <span>₹2,000</span>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid gap-2.5 sm:gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-24 rounded-2xl border border-stone-200 bg-white/60 p-8">
                <p className="font-serif text-2xl sm:text-3xl text-stone-900">No artisanal sweets match these filters</p>
                <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-5 max-w-sm mx-auto">
                  Try clearing dietary tags or raising your price range to see our full handcrafted collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-[#241814] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-stone-800 transition-colors cursor-pointer active:scale-95"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT FILTER DRAWER (Emil Kowalski --ease-drawer motion) */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-200">
          <div
            className="w-full max-w-xs h-full bg-[#FAF7F2] p-5 overflow-y-auto space-y-5 font-sans border-l border-stone-200 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-[var(--ease-drawer,cubic-bezier(0.32,0.72,0,1))]"
            style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          >
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3.5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#C88A36]" />
                  <h3 className="font-serif text-xl text-[#241814]">Filter Catalog</h3>
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="rounded-full p-1.5 text-stone-500 hover:bg-stone-200/60 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">Category</p>
                <div className="space-y-1 text-xs">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left font-medium transition-colors cursor-pointer ${
                          isSelected ? "bg-[#241814] text-white" : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#E6C687]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="border-t border-stone-200/80 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">Dietary</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag("All")}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedTag === "All" ? "bg-[#241814] text-white" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    All
                  </button>
                  {dietaryList.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected ? "bg-[#C88A36] text-white" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="border-t border-stone-200/80 pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-stone-700">Max Price</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C88A36] cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200/80 space-y-2">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full rounded-lg bg-[#241814] py-2.5 text-xs font-medium text-white shadow-xs hover:bg-stone-800 transition-colors active:scale-98"
              >
                Show {filteredProducts.length} Results
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setFilterDrawerOpen(false);
                }}
                className="w-full rounded-lg border border-stone-200 bg-white py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
