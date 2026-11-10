import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, ShieldCheck, Truck, PackageCheck, Zap, ShoppingBag, ChevronRight, ZoomIn, Heart } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { ProductCard } from "@/components/product-card";
import { Badge, Button, QuantitySelector, Rating } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";
import { formatPrice, getProduct, products } from "@/lib/products";
import { fetchProductBySlug } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params }) => {
    let product = getProduct(params.slug);
    if (!product) {
      try {
        const dbProduct = await fetchProductBySlug(params.slug);
        if (dbProduct) product = dbProduct;
      } catch (e) {
        // fallback
      }
    }
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.product) {
      return { meta: [{ title: "Product not found — 9 Stories & Co." }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const description = `Buy ${product.name} online from 9 Stories & Co. - ${product.tagline || ""}. ${product.description || ""}`;
    const productUrl = `https://9storiesandco.com/shop/${product.slug}`;

    return {
      meta: [
        { title: `Buy ${product.name} Online | Best Price | 9 Stories & Co.` },
        { name: "description", content: description },
        { property: "og:title", content: `Buy ${product.name} Online - 9 Stories & Co.` },
        { property: "og:description", content: description },
        { property: "og:image", content: product.image },
        { property: "og:url", content: productUrl },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: productUrl }],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const loaderData = Route.useLoaderData();
  const product = loaderData?.product;
  const { add, openExpress } = useCart();
  const { isInWishlist, toggleWishlist } = useCustomerAuth();

  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeAccordion, setActiveAccordion] = React.useState<"desc" | "ing" | "shelf" | "ship">("desc");
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center bg-cream font-sans">
        <h1 className="font-display text-4xl text-brown">Product Not Found</h1>
        <Link to="/shop" className="text-terracotta underline mt-4 inline-block font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const weights = product.weights || [{ label: "250g", weightGrams: 250, price: 349 }];
  const selectedVariant = weights[selectedVariantIndex] ?? weights[0] ?? { label: "250g", weightGrams: 250, price: 349 };
  const reviewsCount = product.reviewsCount ?? (product as any).reviews ?? 128;
  const isWished = isInWishlist(product.slug);
  const ratingHisto = product.ratingHistogram ?? { 5: 100, 4: 20, 3: 5, 2: 2, 1: 1 };
  const customerReviews = product.customerReviews ?? [];
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const breadcrumbData = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: product.category || "Sweets", url: `/shop?category=${encodeURIComponent(product.category || "Sweets")}` },
    { name: product.name, url: `/shop/${product.slug}` },
  ];

  return (
    <div className="bg-cream min-h-screen pb-28 lg:pb-20 font-sans">
      <StructuredData type="product" data={product} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-sans text-xs font-normal text-brown/60 mb-6">
          <Link to="/" className="hover:text-brown">Home</Link>
          <ChevronRight className="h-3 w-3 text-brown/40" />
          <Link to="/shop" className="hover:text-brown">Shop</Link>
          <ChevronRight className="h-3 w-3 text-brown/40" />
          <Link to="/shop" search={{ category: product.category }} className="hover:text-brown">{product.category}</Link>
          <ChevronRight className="h-3 w-3 text-brown/40" />
          <span className="text-brown truncate font-medium">{product.name}</span>
        </nav>

        {/* MAIN PDP GRID */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative overflow-hidden rounded-lg border border-brown/10 bg-white group">
              <img
                src={product.image}
                alt={product.name}
                width={1200}
                height={1200}
                onClick={() => setLightboxOpen(true)}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-zoom-in"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-brown/10 bg-white/90 backdrop-blur px-2.5 py-1 font-sans text-xs font-medium text-brown shadow-soft hover:bg-white cursor-pointer"
              >
                <ZoomIn className="h-3.5 w-3.5" /> Lightbox Zoom
              </button>
              <button
                type="button"
                aria-pressed={isWished}
                aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                onClick={() => toggleWishlist(product.slug)}
                className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur text-brown transition-colors duration-150 hover:text-terracotta border border-brown/10 cursor-pointer"
              >
                <Heart className={cn("h-4 w-4 stroke-[1.75]", isWished && "fill-terracotta text-terracotta")} />
              </button>
              {product.badge && (
                <span className="absolute top-3 left-3">
                  <Badge variant={product.badge.toLowerCase().includes("pure") || product.badge.toLowerCase().includes("natural") ? "green" : "gold"}>
                    {product.badge}
                  </Badge>
                </span>
              )}
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {[product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxOpen(true)}
                  className="h-16 w-16 shrink-0 rounded border border-brown/20 p-0.5 overflow-hidden cursor-pointer"
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Specs */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="eyebrow text-terracotta font-medium uppercase tracking-[0.14em] text-[11px]">{product.category}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-normal leading-tight text-brown mt-1 tracking-tight">
                {product.name}
              </h1>
              <p className="mt-1 font-sans text-sm font-normal text-brown/70">{product.tagline}</p>

              <div className="mt-2.5 flex items-center gap-2.5">
                <Rating value={product.rating || 4.9} count={reviewsCount} />
                <span className="font-sans text-xs font-normal text-brown/60">({reviewsCount} verified ratings)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 border-y border-brown/10 py-3.5">
              <span className="font-sans text-2xl sm:text-3xl font-semibold text-brown tabular-nums">
                {formatPrice(selectedVariant.price * qty)}
              </span>
              {selectedVariant.msrp && selectedVariant.msrp > selectedVariant.price && (
                <>
                  <span className="font-sans text-base text-brown/40 line-through tabular-nums">
                    {formatPrice(selectedVariant.msrp * qty)}
                  </span>
                  <span className="rounded border border-gold/30 bg-[#FFF9EE] px-2 py-0.5 font-sans text-xs font-medium text-[#8F5B1D]">
                    Save {Math.round(((selectedVariant.msrp - selectedVariant.price) / selectedVariant.msrp) * 100)}%
                  </span>
                </>
              )}
              <span className="font-sans text-xs font-normal text-brown/50 ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Weight Variant Selector Pills */}
            <div>
              <p className="font-sans text-xs font-medium text-brown mb-2 uppercase tracking-wide">Select Weight Variant:</p>
              <div className="flex flex-wrap gap-2">
                {weights.map((w: any, i: number) => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={cn(
                      "flex items-center gap-2 rounded border px-3.5 py-2 font-sans text-xs font-medium transition-colors cursor-pointer",
                      i === selectedVariantIndex
                        ? "border-brown bg-brown text-white"
                        : "border-brown/15 bg-white text-brown/70 hover:border-brown/40",
                    )}
                  >
                    <span>{w.label}</span>
                    <span className="font-medium text-inherit">{formatPrice(w.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs font-medium text-brown uppercase tracking-wide">Quantity:</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() =>
                    add({
                      slug: product.slug,
                      name: product.name,
                      variant: selectedVariant.label,
                      price: selectedVariant.price,
                      image: product.image,
                      qty,
                    })
                  }
                  className="justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Bag
                </Button>

                <Button
                  size="lg"
                  variant="gold"
                  onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
                  className="justify-center gap-2"
                >
                  <Zap className="h-4 w-4 fill-current" /> Express Buy Now
                </Button>
              </div>

              <Button
                size="md"
                variant="secondary"
                onClick={() => toggleWishlist(product.slug)}
                className="w-full justify-center gap-2 text-xs"
              >
                <Heart className={cn("h-3.5 w-3.5 stroke-[1.75]", isWished && "fill-[#C88A36] text-[#C88A36]")} />
                {isWished ? "Saved in Your Wishlist (Click to remove)" : "Save to Wishlist"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 rounded-md border border-brown/10 bg-white p-3 text-center font-sans text-xs font-normal">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-brown/70" />
                <span className="text-brown/80 text-[11px]">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PackageCheck className="h-4 w-4 text-brown/70" />
                <span className="text-brown/80 text-[11px]">Freshly Packed</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-brown/70" />
                <span className="text-brown/80 text-[11px]">Express Shipping</span>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="border-t border-brown/10 pt-4">
              <div className="flex border-b border-brown/10 font-sans text-xs font-medium">
                {[
                  { id: "desc", label: "Description" },
                  { id: "ing", label: "Ingredients & Nutrition" },
                  { id: "shelf", label: "Shelf Life & Storage" },
                  { id: "ship", label: "Shipping Info" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAccordion(tab.id as any)}
                    className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                      activeAccordion === tab.id
                        ? "border-brown text-brown"
                        : "border-transparent text-brown/60 hover:text-brown"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-3 font-sans text-xs sm:text-sm font-normal leading-relaxed text-brown/80">
                {activeAccordion === "desc" && <p>{product.description}</p>}
                {activeAccordion === "ing" && (
                  <div className="space-y-2">
                    <p><strong className="text-brown">Ingredients:</strong> {product.ingredients || "N/A"}</p>
                    <p><strong className="text-brown">Allergens:</strong> {product.allergens || "N/A"}</p>
                  </div>
                )}
                {activeAccordion === "shelf" && (
                  <div className="space-y-2">
                    <p><strong className="text-brown">Storage:</strong> {product.storage || "N/A"}</p>
                    <p><strong className="text-brown">Shelf Life:</strong> {product.shelfLife || "N/A"}</p>
                  </div>
                )}
                {activeAccordion === "ship" && (
                  <p>Dispatched within 24 hours of preparation. Insulated tamper-proof packing ensures fresh arrival across India and worldwide.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-16 border-t border-brown/15 pt-12">
          <h2 className="font-display text-3xl sm:text-4xl text-brown font-normal mb-8">
            Customer Reviews &amp; Ratings
          </h2>

          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4 rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat space-y-4">
              <div className="text-center">
                <span className="font-display text-5xl text-brown">{product.rating || 4.9}</span>
                <div className="flex justify-center gap-1 text-gold my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-sans text-xs font-bold text-brown/70">Based on {reviewsCount} verified ratings</p>
              </div>

              <div className="space-y-2 font-sans text-xs font-bold">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = (ratingHisto as any)[star] || 0;
                  const pct = Math.round((count / reviewsCount) * 100) || 10;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-8 text-right font-bold text-brown">{star} ★</span>
                      <div className="h-2 flex-1 rounded-full bg-brown/10 overflow-hidden">
                        <div className="h-full bg-terracotta rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-brown/70">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              {customerReviews.length > 0 ? (
                customerReviews.map((rev: any) => (
                  <div key={rev.id} className="rounded-xl border border-brown/15 bg-cream-light p-5 space-y-2 font-sans">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-brown">{rev.author}</span>
                        {rev.location && <span className="text-brown/70">• {rev.location}</span>}
                        {rev.verified && (
                          <span className="rounded-full bg-green/15 px-2 py-0.5 text-green">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-brown/60">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="font-display text-lg text-brown leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="font-sans text-sm font-bold text-brown/70">No customer reviews yet. Be the first to leave a review!</p>
              )}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="mt-16 border-t border-brown/15 pt-12">
          <h2 className="font-display text-3xl text-brown font-normal mb-6">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Floats cleanly right above the bottom tab bar) */}
      <div className="fixed bottom-[calc(52px+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden border-t border-brown/10 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-soft font-sans">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-sans text-[11px] font-normal text-brown/60 truncate block">{selectedVariant.label}</span>
            <p className="font-sans text-base font-semibold text-brown tabular-nums">{formatPrice(selectedVariant.price * qty)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                add({
                  slug: product.slug,
                  name: product.name,
                  variant: selectedVariant.label,
                  price: selectedVariant.price,
                  image: product.image,
                  qty,
                })
              }
              className="text-xs px-3 h-8"
            >
              Add to Bag
            </Button>
            <Button
              size="sm"
              variant="gold"
              onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
              className="text-xs px-3.5 h-8"
            >
              Express Buy
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <img src={product.image} alt={product.name} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-lift" />
        </div>
      )}
    </div>
  );
}
