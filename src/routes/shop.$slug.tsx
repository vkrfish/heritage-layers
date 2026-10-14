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
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-sans text-xs font-bold text-brown/70 mb-6">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-brown/50" />
          <Link to="/shop" className="hover:text-terracotta">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 text-brown/50" />
          <Link to="/shop" search={{ category: product.category }} className="hover:text-terracotta">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5 text-brown/50" />
          <span className="text-brown truncate font-bold">{product.name}</span>
        </nav>

        {/* MAIN PDP GRID */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-brown/15 bg-cream-light group">
              <img
                src={product.image}
                alt={product.name}
                width={1200}
                height={1200}
                onClick={() => setLightboxOpen(true)}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-cream/90 backdrop-blur px-3 py-1.5 font-sans text-xs font-bold text-brown shadow-flat hover:bg-gold hover:text-brown cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" /> Lightbox Zoom
              </button>
              <button
                type="button"
                aria-pressed={isWished}
                aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                onClick={() => toggleWishlist(product.slug)}
                className="absolute top-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream/90 backdrop-blur text-brown transition-colors duration-200 hover:text-terracotta shadow-flat cursor-pointer"
              >
                <Heart className={cn("h-5 w-5 stroke-[2]", isWished && "fill-terracotta text-terracotta")} />
              </button>
              {product.badge && (
                <span className="absolute top-3 left-3">
                  <Badge variant={product.badge.toLowerCase().includes("pure") || product.badge.toLowerCase().includes("natural") ? "green" : "gold"}>
                    {product.badge}
                  </Badge>
                </span>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxOpen(true)}
                  className="h-20 w-20 shrink-0 rounded-lg border-2 border-terracotta p-0.5 overflow-hidden cursor-pointer"
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover rounded-md" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="eyebrow text-terracotta font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="font-display text-4xl sm:text-5xl font-normal leading-tight text-brown mt-1">
                {product.name}
              </h1>
              <p className="mt-1 font-sans text-base font-bold text-brown/70 italic">{product.tagline}</p>

              <div className="mt-3 flex items-center gap-3">
                <Rating value={product.rating || 4.9} count={reviewsCount} />
                <span className="font-sans text-xs font-bold text-brown/70">({reviewsCount} verified customer reviews)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 border-y border-brown/15 py-4">
              <span className="font-sans text-3xl font-bold text-terracotta">
                {formatPrice(selectedVariant.price * qty)}
              </span>
              {selectedVariant.msrp && selectedVariant.msrp > selectedVariant.price && (
                <>
                  <span className="font-sans text-lg font-bold text-brown/50 line-through tabular-nums">
                    {formatPrice(selectedVariant.msrp * qty)}
                  </span>
                  <span className="rounded bg-gold/20 px-2.5 py-0.5 font-sans text-xs font-bold text-brown">
                    Save {Math.round(((selectedVariant.msrp - selectedVariant.price) / selectedVariant.msrp) * 100)}%
                  </span>
                </>
              )}
              <span className="font-sans text-xs font-bold text-brown/60 ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Weight Variant Selector Pills */}
            <div>
              <p className="eyebrow text-brown font-bold mb-2">Select Weight Variant:</p>
              <div className="flex flex-wrap gap-2.5">
                {weights.map((w: any, i: number) => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-4 py-2.5 font-sans text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                      i === selectedVariantIndex
                        ? "border-terracotta bg-terracotta/15 text-terracotta"
                        : "border-brown/20 bg-cream-light text-brown/70 hover:border-brown hover:bg-cream",
                    )}
                  >
                    <span>{w.label}</span>
                    <span className="font-bold text-brown">{formatPrice(w.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="eyebrow text-brown font-bold">Quantity:</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
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
                  className="justify-center gap-2 border-brown text-brown hover:bg-brown hover:text-white"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </Button>

                <Button
                  size="lg"
                  variant="accent"
                  onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
                  className="justify-center gap-2 bg-terracotta text-white hover:bg-brown shadow-lift"
                >
                  <Zap className="h-4 w-4 fill-current" /> Express Buy Now
                </Button>
              </div>

              <Button
                size="md"
                variant="secondary"
                onClick={() => toggleWishlist(product.slug)}
                className="w-full justify-center gap-2 border-brown/20 bg-cream/40 text-brown hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <Heart className={cn("h-4 w-4 stroke-[2]", isWished && "fill-terracotta text-terracotta")} />
                {isWished ? "Saved in Your Wishlist (Click to remove)" : "Save to Wishlist"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-brown/15 bg-cream-light p-3 text-center font-sans text-xs font-bold">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-5 w-5 text-terracotta" />
                <span className="text-brown">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PackageCheck className="h-5 w-5 text-terracotta" />
                <span className="text-brown">Freshly Packed</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-terracotta" />
                <span className="text-brown">Express Shipping</span>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="border-t border-brown/15 pt-4">
              <div className="flex border-b border-brown/15 font-sans text-xs font-bold">
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
                        ? "border-terracotta text-terracotta"
                        : "border-transparent text-brown/70 hover:text-brown"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-4 font-sans text-sm font-bold leading-relaxed text-brown/80">
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

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-brown/15 bg-cream/95 backdrop-blur-md p-3 shadow-lift font-sans">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-sans text-xs font-bold text-brown/70">{selectedVariant.label}</span>
            <p className="font-sans text-lg font-bold text-terracotta">{formatPrice(selectedVariant.price * qty)}</p>
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
              className="text-xs px-3 border-brown text-brown"
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="accent"
              onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
              className="text-xs px-3 bg-terracotta text-white"
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
