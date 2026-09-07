import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, ShieldCheck, Truck, PackageCheck, Zap, ShoppingBag, ChevronRight, ZoomIn } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { ProductCard } from "@/components/product-card";
import { Badge, Button, QuantitySelector, Rating } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";
import { formatPrice, getProduct, products } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
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

  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeAccordion, setActiveAccordion] = React.useState<"desc" | "ing" | "shelf" | "ship">("desc");
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl text-primary">Product Not Found</h1>
        <Link to="/shop" className="text-accent underline mt-4 inline-block text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const weights = product.weights || [{ label: "250g", weightGrams: 250, price: 349 }];
  const selectedVariant = weights[selectedVariantIndex] ?? weights[0];
  const reviewsCount = product.reviewsCount ?? (product as any).reviews ?? 128;
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
    <div className="bg-background min-h-screen pb-28 lg:pb-20">
      <StructuredData type="product" data={product} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-accent">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" search={{ category: product.category }} className="hover:text-accent">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-medium truncate">{product.name}</span>
        </nav>

        {/* MAIN PDP GRID */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-parchment/30 group">
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
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-cream/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-primary shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <ZoomIn className="h-3.5 w-3.5" /> Lightbox Zoom
              </button>
              {product.badge && (
                <span className="absolute top-3 left-3">
                  <Badge>{product.badge}</Badge>
                </span>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxOpen(true)}
                  className="h-20 w-20 shrink-0 rounded-xl border-2 border-accent p-0.5 overflow-hidden"
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="eyebrow text-accent font-bold uppercase tracking-wider">{product.category}</span>
              <h1 className="font-display text-3xl font-light text-primary sm:text-4xl lg:text-5xl mt-1">
                {product.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground italic">{product.tagline}</p>

              <div className="mt-3 flex items-center gap-3">
                <Rating value={product.rating || 4.9} count={reviewsCount} />
                <span className="text-xs text-muted-foreground">({reviewsCount} verified customer reviews)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 border-y border-border py-4">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(selectedVariant.price * qty)}
              </span>
              {selectedVariant.msrp && selectedVariant.msrp > selectedVariant.price && (
                <>
                  <span className="text-base text-muted-foreground line-through tabular-nums">
                    {formatPrice(selectedVariant.msrp * qty)}
                  </span>
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                    Save {Math.round(((selectedVariant.msrp - selectedVariant.price) / selectedVariant.msrp) * 100)}%
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Weight Variant Selector Pills */}
            <div>
              <p className="eyebrow text-primary font-semibold mb-2">Select Weight Variant:</p>
              <div className="flex flex-wrap gap-2.5">
                {weights.map((w, i) => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200",
                      i === selectedVariantIndex
                        ? "border-accent bg-accent/10 text-accent ring-1 ring-accent shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-parchment/50",
                    )}
                  >
                    <span>{w.label}</span>
                    <span className="font-bold text-primary">{formatPrice(w.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="eyebrow text-primary font-semibold">Quantity:</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
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
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>

              <Button
                size="lg"
                onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
                className="justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent-hover shadow-lift"
              >
                <Zap className="h-4 w-4 fill-current" /> Buy Now (Express)
              </Button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-gold/30 bg-parchment/40 p-3 text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="font-medium text-primary">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <PackageCheck className="h-4 w-4 text-accent" />
                <span className="font-medium text-primary">Freshly Packed</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-accent" />
                <span className="font-medium text-primary">Express Shipping</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-border pt-4">
              <div className="flex border-b border-border text-xs font-semibold">
                {[
                  { id: "desc", label: "Description" },
                  { id: "ing", label: "Ingredients & Nutrition" },
                  { id: "shelf", label: "Shelf Life & Storage" },
                  { id: "ship", label: "Shipping Info" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAccordion(tab.id as any)}
                    className={`py-2 px-3 border-b-2 transition-colors ${
                      activeAccordion === tab.id
                        ? "border-accent text-accent"
                        : "border-transparent text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-4 text-xs leading-relaxed text-muted-foreground">
                {activeAccordion === "desc" && <p>{product.description}</p>}
                {activeAccordion === "ing" && (
                  <div className="space-y-2">
                    <p><strong className="text-primary">Ingredients:</strong> {product.ingredients || "N/A"}</p>
                    <p><strong className="text-primary">Allergens:</strong> {product.allergens || "N/A"}</p>
                  </div>
                )}
                {activeAccordion === "shelf" && (
                  <div className="space-y-2">
                    <p><strong className="text-primary">Storage:</strong> {product.storage || "N/A"}</p>
                    <p><strong className="text-primary">Shelf Life:</strong> {product.shelfLife || "N/A"}</p>
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
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-light text-primary sm:text-3xl mb-8">
            Customer Reviews &amp; Ratings
          </h2>

          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="text-center">
                <span className="font-display text-5xl font-bold text-primary">{product.rating || 4.9}</span>
                <div className="flex justify-center gap-1 text-gold my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Based on {reviewsCount} verified ratings</p>
              </div>

              <div className="space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = (ratingHisto as any)[star] || 0;
                  const pct = Math.round((count / reviewsCount) * 100) || 10;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-8 text-right font-medium">{star} ★</span>
                      <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-muted-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              {customerReviews.length > 0 ? (
                customerReviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-border bg-card p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{rev.author}</span>
                        {rev.location && <span className="text-muted-foreground">• {rev.location}</span>}
                        {rev.verified && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-xs text-primary leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No customer reviews yet. Be the first to leave a review!</p>
              )}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl text-primary font-light mb-6">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-cream/95 backdrop-blur-md p-3 shadow-lift">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-muted-foreground">{selectedVariant.label}</span>
            <p className="text-lg font-bold text-primary">{formatPrice(selectedVariant.price * qty)}</p>
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
              className="text-xs px-3"
            >
              Add
            </Button>
            <Button
              size="sm"
              onClick={() => openExpress(product.name, selectedVariant.label, selectedVariant.price, qty)}
              className="text-xs px-3 bg-accent text-accent-foreground hover:bg-accent-hover"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <img src={product.image} alt={product.name} className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-lift" />
        </div>
      )}
    </div>
  );
}
