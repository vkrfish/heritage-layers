import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Package, Sparkles, Truck, Star, ChevronRight, CheckCircle2, ShieldCheck, Phone } from "lucide-react";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { Button, Eyebrow, SectionHeading } from "@/components/ui-kit";
import { products } from "@/lib/products";
import hero from "@/assets/hero-putharekulu.jpg";
import craftSheet from "@/assets/craft-sheet.jpg";
import giftbox from "@/assets/product-giftbox.jpg";
import classic from "@/assets/product-classic.jpg";
import ghee from "@/assets/product-ghee.jpg";
import jaggery from "@/assets/product-jaggery.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "9 Stories & Co. — Handcrafted Andhra Putharekulu & Heritage Delicacies" },
      {
        name: "description",
        content:
          "Authentic paper-thin Putharekulu, A2 ghee sweets, savouries, gunpowder podi, and luxury gift boxes. Shipped fresh across India, USA, UK & worldwide.",
      },
      { name: "keywords", content: "9 Stories, Putharekulu, Andhra sweets, Indian sweets, butter murukku, gunpowder podi, Atreyapuram sweets, online sweet shop" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "9 Stories & Co. — Handcrafted Andhra Putharekulu & Heritage Delicacies" },
      { property: "og:image", content: "https://9storiesandco.com/hero-putharekulu.jpg" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://9storiesandco.com" }],
  }),
  component: Home,
});

const heroSlides = [
  {
    tagline: "Festive Season & Luxury Gifting",
    title: "Handcrafted Andhra Putharekulu Shipped Worldwide",
    copy: "Paper-thin rice sheets brushed with pure A2 cow ghee and organic jaggery. Delivered fresh within 48 hours.",
    image: hero,
    ctaText: "Explore Collection",
    ctaLink: "/shop",
  },
  {
    tagline: "Royal Heritage Gift Boxes",
    title: "The Ultimate Celebration Gift Box",
    copy: "Four artisanal sweet varieties wrapped in gold parchment paper inside a hand-tied keepsake box.",
    image: giftbox,
    ctaText: "Shop Gift Sets",
    ctaLink: "/gifting",
  },
];

const categoryIcons = [
  { name: "Sweets", image: classic, category: "Sweets", badge: "Hot" },
  { name: "Savouries", image: ghee, category: "Savouries" },
  { name: "Podi & Mixes", image: jaggery, category: "Podi & Mixes" },
  { name: "Gift Sets", image: giftbox, category: "Gift Boxes", badge: "Luxury" },
  { name: "New Arrivals", image: classic, tag: "New" },
  { name: "Under ₹99", image: ghee, category: "Special Offers", badge: "₹99" },
];

export function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<"bestsellers" | "new" | "gifting" | "offers">("bestsellers");

  // Filter products based on active showcase tab
  const showcaseProducts = React.useMemo(() => {
    switch (activeTab) {
      case "bestsellers":
        return products.filter((p) => p.isBestSeller).slice(0, 4);
      case "new":
        return products.filter((p) => p.isNewArrival || p.badge === "Must Try" || p.isBestSeller).slice(0, 4);
      case "gifting":
        return products.filter((p) => p.isGiftingFavorite || p.category === "Gift Boxes").slice(0, 4);
      case "offers":
        return products.filter((p) => p.isSpecialOffer || p.isUnder99).concat(products.slice(0, 2)).slice(0, 4);
      default:
        return products.slice(0, 4);
    }
  }, [activeTab]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. HERO CAROUSEL */}
      <section className="relative isolate overflow-hidden bg-primary" aria-label="Hero Showcase">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 relative z-10" : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover opacity-45"
              width={1920}
              height={1200}
            />
            <div className="relative mx-auto grid min-h-[75vh] max-w-[1400px] items-center px-5 py-20 lg:px-10">
              <div className="max-w-2xl reveal">
                <Eyebrow tone="gold">{slide.tagline}</Eyebrow>
                <h1 className="mt-4 text-4xl leading-[1.1] text-on-dark sm:text-6xl lg:text-7xl font-light">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-on-dark-muted sm:text-lg">
                  {slide.copy}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to={slide.ctaLink}>
                    <Button size="lg" className="shadow-lift">{slide.ctaText}</Button>
                  </Link>
                  <Link to="/our-story">
                    <Button size="lg" variant="onDark">
                      Our Heritage Story
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-accent" : "w-2.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. CATEGORY ICON GRID */}
      <section className="paper py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center mb-8">
            <span className="eyebrow text-accent font-semibold">Explore Categories</span>
            <h2 className="font-display text-2xl text-primary sm:text-3xl font-light mt-1">
              Curated Delicacies &amp; Heritage Treats
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 text-center">
            {categoryIcons.map((cat) => (
              <Link
                key={cat.name}
                to="/shop"
                search={cat.category ? { category: cat.category } : undefined}
                className="group flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-cream hover:shadow-soft"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 border-2 border-gold/40 group-hover:border-accent transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground shadow-sm">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-primary group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TABBED PRODUCT SHOWCASE GRID */}
      <section className="px-5 py-20 lg:px-10" aria-labelledby="showcase-heading">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Handcrafted Selection"
            title="Popular Heritage Delights"
            subtitle="Select your preferred weight variant (250g, 500g, 1kg) and add directly to your cart."
          />

          {/* Interactive Showcase Tabs */}
          <div className="mt-8 flex justify-center border-b border-border">
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
                  className={`py-3 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="gap-2">
                View Full Catalog <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BRAND LEGACY BANNER */}
      <section className="bg-primary text-on-dark px-5 py-20 lg:px-10" aria-labelledby="legacy-heading">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src={craftSheet}
              alt="Artisan lifting paper thin Putharekulu sheet"
              loading="lazy"
              className="rounded-2xl object-cover shadow-lift border border-gold/30"
              width={1200}
              height={1200}
            />
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-gold/50 bg-cream p-4 text-primary shadow-lift">
              <ShieldCheck className="h-8 w-8 text-accent shrink-0" />
              <div>
                <p className="text-xs font-bold">100% Authentic Guarantee</p>
                <p className="text-[11px] text-muted-foreground">Pure A2 Ghee &amp; Organic Jaggery</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Eyebrow tone="gold">Artisan Tradition · Nine Generations</Eyebrow>
            <h2 id="legacy-heading" className="text-3xl sm:text-5xl font-light leading-tight text-on-dark">
              Crafted slowly, the way grandmothers made it.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-on-dark-muted">
              Every Putharekulu sheet is hand-swiped over a hot earthen pot in Atreyapuram village. 
              We use no artificial preservatives, zero palm oil, and only 100% natural clarified cow ghee.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/20 text-xs">
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

            <div className="pt-4">
              <Link to="/the-craft">
                <Button variant="onDark" size="lg">
                  Learn About Our Craft
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS & REVIEWS SLIDER */}
      <section className="px-5 py-20 lg:px-10" aria-labelledby="reviews-heading">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Real Buyer Reviews"
            title="Over 10,000+ Happy Customers"
            subtitle="Rated 4.9 ★★★★★ across 1,500+ verified customer ratings."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
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
              <figure key={idx} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-primary italic">
                  "{rev.quote}"
                </blockquote>
                <figcaption className="border-t border-border pt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-primary">{rev.author}</p>
                    <p className="text-muted-foreground">{rev.location}</p>
                  </div>
                  {rev.verified && (
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
                      ✓ Verified Buyer
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER NAVIGATION COMPONENT */}
      <footer className="border-t border-border bg-cream pt-16 pb-12 px-5 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-gold text-base font-bold">9</span>
              <span className="font-display text-xl text-primary font-bold">9 Stories &amp; Co.</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Handcrafted Andhra Putharekulu, A2 ghee sweets, savouries, and traditional spice powders made fresh in small batches.
            </p>
            <p className="text-xs text-primary font-medium flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-accent" /> Hotline: +91 44 4890 1200
            </p>
          </div>

          {/* Col 2: Store Links */}
          <div className="space-y-3">
            <h4 className="font-display text-base text-primary font-semibold">Store Links</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/shop" search={{ category: "Sweets" }} className="hover:text-accent">Classic Putharekulu</Link></li>
              <li><Link to="/shop" search={{ category: "Sweets" }} className="hover:text-accent">Royal A2 Ghee Sweets</Link></li>
              <li><Link to="/shop" search={{ category: "Savouries" }} className="hover:text-accent">Spicy Butter Murukku</Link></li>
              <li><Link to="/shop" search={{ category: "Podi & Mixes" }} className="hover:text-accent">Artisan Gunpowder Podi</Link></li>
              <li><Link to="/gifting" className="hover:text-accent">Festive Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Col 3: Policies & Support */}
          <div className="space-y-3">
            <h4 className="font-display text-base text-primary font-semibold">Customer Support</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/contact" className="hover:text-accent">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Shipping &amp; Delivery Policy</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Refunds &amp; Returns</Link></li>
              <li><Link to="/journal" className="hover:text-accent">Culinary Journal</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials */}
          <div className="space-y-4">
            <h4 className="font-display text-base text-primary font-semibold">Join the Circle</h4>
            <p className="text-xs text-muted-foreground">
              Subscribe for exclusive festive offers, free recipes, and secret drops.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
              />
              <Button size="sm" className="shrink-0 text-xs">Join</Button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} 9 Stories &amp; Co. All rights reserved. Handcrafted with pride in Atreyapuram, Andhra Pradesh.
        </div>
      </footer>
    </>
  );
}
