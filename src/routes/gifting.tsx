import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Gift, Check, Send, PhoneCall } from "lucide-react";
import * as React from "react";

import { ProductCard } from "@/components/product-card";
import { Button, SectionHeading } from "@/components/ui-kit";
import { products } from "@/lib/products";
import giftbox from "@/assets/product-giftbox.jpg";
import occasionWedding from "@/assets/occasion-wedding.jpg";
import occasionFestival from "@/assets/occasion-festival.jpg";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Bespoke & Festive Gifting | 9 Stories & Co." },
      {
        name: "description",
        content:
          "Handcrafted Putharekulu gift hampers for weddings, Diwali, Sankranti, and corporate celebrations. Gold foil sleeves, customized handwritten cards, and pan-India refrigerated shipping.",
      },
      { name: "keywords", content: "Indian sweets gifts, wedding return gifts, Diwali gift boxes, corporate gifting, premium gift boxes, Indian sweet hampers, festival gifts, traditional sweets gifts, bulk sweets order" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Bespoke & Festive Gifting — 9 Stories & Co." },
      { property: "og:url", content: "https://9storiesandco.com/gifting" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://9storiesandco.com/gifting" },
    ],
  }),
  component: Gifting,
});

const occasions = [
  {
    img: occasionWedding,
    title: "Wedding Favors & Return Gifts",
    copy: "Customized boxes tailored with gold wax seals, bride-and-groom monogrammed card inserts, and curated assortments from 50 to 2,000+ units.",
    tag: "From 50+ Boxes",
  },
  {
    img: occasionFestival,
    title: "Diwali & Sankranti Festivities",
    copy: "Seasonal gift collections dispatched fresh in temperature-controlled insulated packaging right on auspicious calendar dates.",
    tag: "Festive Editions",
  },
  {
    img: giftbox,
    title: "Executive & Corporate Gifting",
    copy: "Understated elegance for founders, partners, and clients with custom brand sleeves, PAN-India bulk dispatch, and GST-compliant invoicing.",
    tag: "Corporate Concierge",
  },
];

const bespokeFeatures = [
  "Custom hot-stamped gold foil logo sleeves",
  "Calligraphy parchment cards with personalized notes",
  "Choice of Pure Godavari Jaggery or Organic Khand",
  "Direct drop-shipping to client addresses across India",
];

function Gifting() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] font-sans text-stone-900 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-[#241814] text-[#FAF7F2] px-4 py-16 sm:py-24 lg:px-10 lg:py-28 border-b border-[#3D2B23]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C88A36_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E6C687] mb-3">
            Handcrafted Hospitality
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            A box crafted to be opened slowly
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Wrapped in warm gold parchment, cushioned with natural rice paper, and tied with traditional handloom ribbon. Each delicacy inside carries 300 years of Andhra heritage.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#bespoke-inquiry"
              className="rounded-lg bg-[#C88A36] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#241814] hover:bg-[#D49847] active:scale-95 transition-all shadow-sm"
            >
              Request Custom Quote
            </a>
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%209%20Stories%20Gifting"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-600 px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-200 hover:bg-white/10 active:scale-95 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#E6C687]" /> Speak with Concierge
            </a>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="px-4 py-14 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Occasions"
            title="Curated for celebrations that matter"
            subtitle="Whether it is an intimate family gathering or a nationwide client milestone."
          />

          <div className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-3">
            {occasions.map((o) => (
              <article
                key={o.title}
                className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-2xs transition-all hover:shadow-xs group"
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-100">
                  <img
                    src={o.img}
                    alt={o.title}
                    loading="lazy"
                    width={900}
                    height={700}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-103"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#241814]/85 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-[#E6C687] tracking-wider uppercase">
                    {o.tag}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#241814]">{o.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {o.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Gift Boxes Catalog Grid */}
      <section className="bg-[#F5F0E8] px-4 py-14 sm:py-20 lg:px-10 border-y border-stone-200/80">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Ready to Gift"
            title="Signature Hampers &amp; Keepsake Boxes"
            subtitle="Pre-curated boxes ready to be sent across India in 48 to 72 hours."
          />

          <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((p) => p.badge === "Gifting" || p.category === "Gift Boxes" || p.slug === "dry-fruit-putharekulu")
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </div>
      </section>

      {/* Bespoke Gifting Concierge Form */}
      <section id="bespoke-inquiry" className="px-4 py-14 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-2xs">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C88A36]">
                <Sparkles className="h-3.5 w-3.5" /> Bespoke Concierge
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#241814] leading-tight">
                Plan your custom gift experience
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Our gifting specialists work with you one-on-one to design custom sleeves, dietary assortments, and coordinated PAN-India delivery.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-stone-700">
                {bespokeFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#C88A36] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-7 bg-[#FAF7F2] p-5 sm:p-6 rounded-xl border border-stone-200">
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl text-[#241814]">Inquiry Received</h3>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    Thank you. Our gifting concierge will reach out within 4 business hours with our catalog and sample options.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sravan Varma"
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="sravan@example.com"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Occasion</label>
                      <select className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 cursor-pointer">
                        <option>Wedding Favors</option>
                        <option>Corporate Celebration</option>
                        <option>Festival (Diwali / Sankranti)</option>
                        <option>Private Milestone / Birthday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Estimated Boxes</label>
                      <select className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 cursor-pointer">
                        <option>25 - 50 boxes</option>
                        <option>50 - 150 boxes</option>
                        <option>150 - 500 boxes</option>
                        <option>500+ boxes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Special Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Custom monograms, dietary preferences (jaggery only), preferred delivery date..."
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#241814] py-2.5 text-xs font-medium text-white hover:bg-stone-800 active:scale-98 transition-all cursor-pointer shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Gifting Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
