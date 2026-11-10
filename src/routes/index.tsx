import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Star, CheckCircle2, ShieldCheck } from "lucide-react";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { Button, Eyebrow, SectionHeading } from "@/components/ui-kit";
import { BrandTrustStrip } from "@/components/brand-trust-strip";
import { products } from "@/lib/products";
import craftSheet from "@/assets/craft-sheet.jpg";
import giftbox from "@/assets/product-giftbox.jpg";
import classic from "@/assets/product-classic.jpg";
import ghee from "@/assets/product-ghee.jpg";
import jaggery from "@/assets/product-jaggery.jpg";
import heroPutharekulu from "@/assets/hero-putharekulu.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "9 Stories & Co. — Handcrafted Andhra Putharekulu & Heritage Delicacies" },
      {
        name: "description",
        content:
          "Authentic paper-thin Putharekulu, A2 ghee sweets, savouries, gunpowder podi, and luxury gift boxes. Shipped fresh across India & worldwide.",
      },
      { name: "keywords", content: "9 Stories, Putharekulu, Andhra sweets, Indian sweets, butter murukku, gunpowder podi, Atreyapuram sweets, online sweet shop" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "9 Stories & Co. — Handcrafted Andhra Putharekulu & Heritage Delicacies" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://9storiesandco.com" }],
  }),
  component: Home,
});

const categoryIcons = [
  { name: "Putharekulu", image: classic, category: "Sweets", badge: "Must Try" },
  { name: "A2 Ghee Sweets", image: ghee, category: "Sweets" },
  { name: "Savouries", image: ghee, category: "Savouries" },
  { name: "Podi & Mixes", image: jaggery, category: "Podi & Mixes" },
  { name: "Gift Boxes", image: giftbox, category: "Gift Boxes", badge: "Luxury" },
  { name: "Under ₹99", image: ghee, category: "Special Offers", badge: "Offer" },
];

const heroPosters = [
  {
    id: "putharekulu",
    image: heroPutharekulu,
    eyebrow: "Festive Collection · Atreyapuram Original",
    title: "Handcrafted Paper-Thin Putharekulu",
    subtitle: "Brushed with pure A2 cow ghee, layered with organic jaggery & dry fruits. A 300-year Godavari heritage.",
    primaryCta: "Explore Sweets",
    primaryLink: "/shop",
    secondaryCta: "Discover Gifting",
    secondaryLink: "/gifting",
    badge: "9 Generations Craft",
  },
  {
    id: "gifting",
    image: giftbox,
    eyebrow: "Royal Gifting · Corporate & Weddings",
    title: "Luxury Heritage Gift Hampers",
    subtitle: "Exquisite gold-embossed hampers curated with fresh Putharekulu, savouries, and traditional sweets.",
    primaryCta: "Explore Gifting",
    primaryLink: "/gifting",
    secondaryCta: "Custom Bulk Orders",
    secondaryLink: "/contact",
    badge: "Luxury Edition",
  },
  {
    id: "heritage",
    image: craftSheet,
    eyebrow: "Artisan Heritage · Handmade Daily",
    title: "Slow-Made In Pot Kilns",
    subtitle: "Hand-swiped over earthen pots in Atreyapuram village. 100% natural ingredients, zero preservatives.",
    primaryCta: "Our Craft Story",
    primaryLink: "/the-craft",
    secondaryCta: "View Catalog",
    secondaryLink: "/shop",
    badge: "Authentic Recipe",
  },
];

import { useAdminStore } from "@/lib/admin-store.tsx";

export function Home() {
  const { products: dynamicProducts } = useAdminStore();
  const allProducts = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : products;

  const [activeTab, setActiveTab] = React.useState<"bestsellers" | "new" | "gifting" | "offers">("bestsellers");
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroPosters.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroPosters.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroPosters.length) % heroPosters.length);

  const showcaseProducts = React.useMemo(() => {
    switch (activeTab) {
      case "bestsellers":
        return allProducts.filter((p) => p.isBestSeller).slice(0, 4);
      case "new":
        return allProducts.filter((p) => p.isNewArrival || p.badge === "Must Try" || p.isBestSeller).slice(0, 4);
      case "gifting":
        return allProducts.filter((p) => p.isGiftingFavorite || p.category === "Gift Boxes").slice(0, 4);
      case "offers":
        return allProducts.filter((p) => p.isSpecialOffer || p.isUnder99).concat(allProducts.slice(0, 2)).slice(0, 4);
      default:
        return allProducts.slice(0, 4);
    }
  }, [activeTab, allProducts]);

  return (
    <div className="pb-16 lg:pb-0">
      {/* 1. HERO POSTER CAROUSEL SECTION */}
      <section className="relative overflow-hidden bg-brown text-cream" aria-label="Hero Posters">
        <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[600px] flex items-center">
          {heroPosters.map((poster, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={poster.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Poster Image Background */}
                <div className="absolute inset-0">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Rich Gradient Overlay for Crisp Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/85 to-brown/40 lg:bg-gradient-to-r lg:from-brown/95 lg:via-brown/75 lg:to-transparent" />
                </div>

                {/* Poster Content */}
                <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center py-10 sm:py-16 lg:py-24">
                  <div className="max-w-2xl space-y-3 sm:space-y-5">
                    <div className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.14em] text-gold/90 border border-gold/25 bg-black/40 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span>{poster.eyebrow}</span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-cream tracking-tight">
                      {poster.title}
                    </h1>

                    <p className="font-sans text-xs sm:text-base font-normal leading-relaxed text-cream/80 max-w-lg">
                      {poster.subtitle}
                    </p>

                    <div className="pt-1 sm:pt-3 flex items-center gap-2.5 sm:gap-4">
                      <Link to={poster.primaryLink}>
                        <Button size="md" variant="gold" className="text-xs sm:text-sm font-medium h-9 sm:h-10 px-4 sm:px-5">
                          {poster.primaryCta}
                        </Button>
                      </Link>
                      <Link to={poster.secondaryLink}>
                        <Button size="md" variant="secondary" className="border border-white/30 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm h-9 sm:h-10 px-4 sm:px-5">
                          {poster.secondaryCta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-full border border-white/20 bg-black/40 text-white hover:bg-black/70 hover:border-white/40 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full border border-white/20 bg-black/40 text-white hover:bg-black/70 hover:border-white/40 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Carousel Dots & Badge Indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
            {heroPosters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? "w-8 bg-gold" : "w-2.5 bg-cream/40 hover:bg-cream/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY HORIZONTAL SWIPE RAIL / GRID SECTION */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 lg:px-10 border-b border-brown/10 bg-[#FAF7F2]">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-4xl font-normal text-brown tracking-tight">
              Curated by Category
            </h2>
            <p className="font-sans text-xs sm:text-sm font-normal text-brown/60 mt-1">Authentic regional confectionery and artisanal pantry essentials</p>
          </div>

          {/* Mobile Horizontal Swipe Rail / Desktop Grid */}
          <div className="flex gap-4 overflow-x-auto pb-3 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 snap-x text-center scrollbar-none">
            {categoryIcons.map((cat) => (
              <Link
                key={cat.name}
                to="/shop"
                search={cat.category ? { category: cat.category } : {}}
                className="group flex-shrink-0 w-24 sm:w-auto flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg border border-brown/10 bg-white transition-all duration-150 hover:border-brown/25 snap-start shadow-soft"
              >
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full p-0.5 border border-brown/15 group-hover:border-brown/40 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 rounded bg-[#FAF7F2] border border-brown/15 px-1 py-0.2 font-sans text-[8px] font-medium text-brown/80">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="font-sans text-xs sm:text-sm font-medium text-brown group-hover:text-terracotta transition-colors truncate max-w-full">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND TRUST STRIP */}
      <BrandTrustStrip />

      {/* 4. TABBED PRODUCT SHOWCASE GRID (2-Column Mobile Grid) */}
      <section className="px-4 sm:px-6 lg:px-10 py-10 sm:py-16" aria-labelledby="showcase-heading">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="Handcrafted Selection"
            title="Signature Heritage Delights"
            subtitle="Fresh daily batches made with Godavari jaggery and pure clarified cow butter."
          />

          {/* Showcase Tabs */}
          <div className="mt-6 sm:mt-8 flex justify-center border-b border-brown/10">
            <div className="flex space-x-2 sm:space-x-6 overflow-x-auto pb-px">
              {[
                { id: "bestsellers", label: "Best Sellers" },
                { id: "new", label: "New Arrivals" },
                { id: "gifting", label: "Gifting Favorites" },
                { id: "offers", label: "Special Offers" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-3 font-sans text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-brown text-brown"
                      : "border-transparent text-brown/60 hover:text-brown"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Mobile Product Cards Grid */}
          <div className="mt-6 sm:mt-10 grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {showcaseProducts.map((p) => (
              <div key={p.slug} className="stagger-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Link to="/shop">
              <Button variant="secondary" size="md" className="gap-2 text-xs sm:text-base">
                View Full Catalog <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BRAND LEGACY BANNER */}
      <section className="bg-[#1B120E] text-[#FAF7F2] px-4 sm:px-6 lg:px-10 py-12 sm:py-20" aria-labelledby="legacy-heading">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src={craftSheet}
              alt="Artisan lifting paper thin Putharekulu sheet"
              loading="lazy"
              className="rounded-lg object-cover border border-white/10 shadow-soft"
              width={1200}
              height={1200}
            />
            <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-3 rounded-lg border border-white/10 bg-[#221612] p-3.5 text-[#FAF7F2] shadow-soft">
              <ShieldCheck className="h-6 w-6 text-gold shrink-0" />
              <div>
                <p className="font-sans text-xs font-medium">Authentic Pot Kiln Craft</p>
                <p className="font-sans text-[11px] font-normal text-[#FAF7F2]/60">Pure A2 Ghee &amp; Godavari Jaggery</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <Eyebrow tone="gold">Artisan Provenance · Godavari Delta</Eyebrow>
            <h2 id="legacy-heading" className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#FAF7F2] tracking-tight">
              Crafted slowly, the way grandmothers made it.
            </h2>
            <p className="font-sans text-sm sm:text-base font-normal leading-relaxed text-[#FAF7F2]/80 max-w-lg">
              Every Putharekulu sheet is hand-swiped over an inverted earthen pot in Atreyapuram village. 
              We use no artificial preservatives, zero palm oil, and only 100% natural clarified cow butter.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-sans text-xs font-normal text-[#FAF7F2]/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>Slow-roasted ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>Zero refined sugar options</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>Biodegradable boxes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
                <span>Airtight freshness seal</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/the-craft">
                <Button variant="onDark" size="md">
                  Discover the Technique
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-20 bg-[#FAF7F2]" aria-labelledby="reviews-heading">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="Customer Notes"
            title="Cherished Across Generations"
            subtitle="Verified reviews from families celebrating weddings, festivals, and everyday reunions."
          />

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                quote: "The Dry Fruit Putharekulu melted in my mouth. Exactly like my childhood memories in Godavari district.",
                author: "Lakshmi R.",
                location: "Hyderabad",
                verified: true,
                rating: 5,
              },
              {
                quote: "Ordered 50 gift boxes for our daughter's wedding return gifts. The packaging and fresh ghee aroma wowed every guest.",
                author: "Siddharth V.",
                location: "Bengaluru",
                verified: true,
                rating: 5,
              },
              {
                quote: "Express international delivery was flawless. Arrived completely fresh and crispy in airtight tins.",
                author: "Prasad K.",
                location: "Dallas, Texas",
                verified: true,
                rating: 5,
              },
            ].map((rev, idx) => (
              <figure key={idx} className="rounded-lg border border-brown/10 bg-white p-5 sm:p-6 shadow-soft space-y-3">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-display text-base sm:text-lg italic font-normal leading-relaxed text-brown">
                  "{rev.quote}"
                </blockquote>
                <figcaption className="border-t border-brown/10 pt-3 flex items-center justify-between font-sans text-xs">
                  <div>
                    <p className="font-medium text-brown">{rev.author}</p>
                    <p className="text-brown/60 text-[11px]">{rev.location}</p>
                  </div>
                  {rev.verified && (
                    <span className="rounded bg-green/10 border border-green/20 px-2 py-0.5 text-[10px] font-medium text-green">
                      Verified Order
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
