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
        <div className="relative min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] flex items-center">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/80 to-brown/40 lg:bg-gradient-to-r lg:from-brown/95 lg:via-brown/75 lg:to-transparent" />
                </div>

                {/* Poster Content */}
                <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center py-14 lg:py-24">
                  <div className="max-w-2xl space-y-4 sm:space-y-6">
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-gold bg-brown/90 backdrop-blur-md px-4 py-1.5 text-gold shadow-md">
                      <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
                      <span className="font-sans text-sm sm:text-base font-bold uppercase tracking-widest text-gold">
                        {poster.eyebrow}
                      </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-tight text-cream drop-shadow-md">
                      {poster.title}
                    </h1>

                    <p className="font-sans text-xl sm:text-2xl font-bold leading-relaxed text-cream tracking-wide max-w-xl drop-shadow-sm">
                      {poster.subtitle}
                    </p>

                    <div className="pt-3 sm:pt-5 flex flex-wrap items-center gap-4 sm:gap-5">
                      <Link to={poster.primaryLink}>
                        <Button size="lg" variant="primary" className="bg-gold text-brown hover:bg-terracotta hover:text-white font-extrabold text-base sm:text-lg shadow-lift border border-gold/80">
                          {poster.primaryCta}
                        </Button>
                      </Link>
                      <Link to={poster.secondaryLink}>
                        <Button size="lg" variant="secondary" className="border-2 border-gold bg-brown/70 text-gold hover:bg-gold hover:text-brown font-extrabold text-base sm:text-lg shadow-lift backdrop-blur-sm">
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
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full border border-gold/40 bg-brown/70 text-cream hover:bg-gold hover:text-brown transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full border border-gold/40 bg-brown/70 text-cream hover:bg-gold hover:text-brown transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
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
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-10 border-b border-brown/15 bg-cream-light/40">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-5xl font-normal text-brown inline-block relative">
              Shop by <span className="text-terracotta underline decoration-gold decoration-4 underline-offset-4">Category</span>
            </h2>
            <p className="font-sans text-xs sm:text-base font-bold text-brown/70 mt-1">Jump straight to what you're looking for</p>
          </div>

          {/* Mobile Horizontal Swipe Rail / Desktop Grid */}
          <div className="flex gap-4 overflow-x-auto pb-3 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 snap-x text-center scrollbar-none">
            {categoryIcons.map((cat) => (
              <Link
                key={cat.name}
                to="/shop"
                search={cat.category ? { category: cat.category } : {}}
                className="group flex-shrink-0 w-24 sm:w-auto flex flex-col items-center gap-2 p-2 sm:p-4 rounded-xl border border-brown/15 bg-cream transition-all duration-300 hover:shadow-lift snap-start"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 border-2 border-gold group-hover:border-terracotta transition-colors shadow-flat">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-gold px-1.5 py-0.5 font-sans text-[9px] font-bold text-brown shadow-flat">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="font-sans text-xs sm:text-base font-bold text-brown group-hover:text-terracotta transition-colors truncate max-w-full">
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
      <section className="px-4 sm:px-6 lg:px-10 py-10 sm:py-20" aria-labelledby="showcase-heading">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Handcrafted Selection"
            title="Popular Heritage Delights"
            subtitle="Select your preferred weight variant and add directly to your cart."
          />

          {/* Showcase Tabs */}
          <div className="mt-6 sm:mt-8 flex justify-center border-b border-brown/15">
            <div className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-px">
              {[
                { id: "bestsellers", label: "Best Sellers" },
                { id: "new", label: "New Arrivals" },
                { id: "gifting", label: "Gifting Favorites" },
                { id: "offers", label: "Special Offers" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-3 font-sans text-xs sm:text-base font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-terracotta text-terracotta"
                      : "border-transparent text-brown/70 hover:text-brown"
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
              <ProductCard key={p.slug} product={p} />
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
      <section className="bg-brown text-cream px-4 sm:px-6 lg:px-10 py-12 sm:py-20" aria-labelledby="legacy-heading">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src={craftSheet}
              alt="Artisan lifting paper thin Putharekulu sheet"
              loading="lazy"
              className="rounded-xl object-cover border border-gold/40 shadow-lift"
              width={1200}
              height={1200}
            />
            <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-3 rounded-xl border border-gold/40 bg-cream p-4 text-brown shadow-lift">
              <ShieldCheck className="h-8 w-8 text-terracotta shrink-0" />
              <div>
                <p className="font-sans text-sm font-bold">100% Authentic Guarantee</p>
                <p className="font-sans text-xs font-bold text-brown/70">Pure A2 Ghee &amp; Organic Jaggery</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Eyebrow tone="gold">Artisan Tradition · Nine Generations</Eyebrow>
            <h2 id="legacy-heading" className="font-display text-2xl sm:text-5xl font-normal leading-tight text-cream">
              Crafted slowly, the way grandmothers made it.
            </h2>
            <p className="font-sans text-sm sm:text-lg font-bold leading-relaxed text-cream/80">
              Every Putharekulu sheet is hand-swiped over a hot earthen pot in Atreyapuram village. 
              We use no artificial preservatives, zero palm oil, and only 100% natural clarified cow ghee.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cream/15 font-sans text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                <span>Slow-roasted ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                <span>Zero white sugar options</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                <span>Eco-friendly packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                <span>Airtight freshness seal</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/the-craft">
                <Button variant="onDark" size="md">
                  Learn About Our Craft
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-20 bg-cream" aria-labelledby="reviews-heading">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Real Buyer Reviews"
            title="Over 10,000+ Happy Customers"
            subtitle="Rated 4.9 ★★★★★ across 1,500+ verified customer ratings."
          />

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                quote: "The Dry Fruit Putharekulu melted in my mouth. Exactly like my childhood memories in Godavari district!",
                author: "Lakshmi R.",
                location: "Hyderabad",
                verified: true,
                rating: 5,
              },
              {
                quote: "Ordered 50 gift boxes for our daughter's wedding return gifts. The packaging and fresh ghee aroma wowed every guest!",
                author: "Siddharth V.",
                location: "Bengaluru",
                verified: true,
                rating: 5,
              },
              {
                quote: "Fast express delivery to USA! Arrived completely fresh and crispy in airtight tins.",
                author: "Prasad K.",
                location: "Dallas, Texas",
                verified: true,
                rating: 5,
              },
            ].map((rev, idx) => (
              <figure key={idx} className="rounded-xl border border-brown/15 bg-cream-light p-5 sm:p-6 shadow-flat space-y-3">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-display text-lg sm:text-xl leading-relaxed text-brown">
                  "{rev.quote}"
                </blockquote>
                <figcaption className="border-t border-brown/15 pt-3 flex items-center justify-between font-sans text-xs font-bold">
                  <div>
                    <p className="text-brown">{rev.author}</p>
                    <p className="text-brown/70">{rev.location}</p>
                  </div>
                  {rev.verified && (
                    <span className="rounded-full bg-green/15 px-2 py-0.5 text-green">
                      ✓ Verified Buyer
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
