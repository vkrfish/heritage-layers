import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/product-card";
import { Button, SectionHeading } from "@/components/ui-kit";
import { products } from "@/lib/products";
import giftbox from "@/assets/product-giftbox.jpg";
import occasionWedding from "@/assets/occasion-wedding.jpg";
import occasionFestival from "@/assets/occasion-festival.jpg";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Gifting — Premium Putharekulu Gift Boxes | 9 Stories & Co." },
      {
        name: "description",
        content:
          "Premium Putharekulu gift boxes for weddings, festivals, and corporate gifting. Handcrafted in Andhra Pradesh with elegant packaging. Order bulk gift boxes across India.",
      },
      { name: "keywords", content: "Indian sweets gifts, wedding return gifts, Diwali gift boxes, corporate gifting, premium gift boxes, Indian sweet hampers, festival gifts, traditional sweets gifts, bulk sweets order" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Gifting — Premium Putharekulu Boxes" },
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
  { img: occasionWedding, title: "Weddings", copy: "Return gifts from 100 boxes upward, with custom sleeves and hand-written name cards." },
  { img: occasionFestival, title: "Festivals", copy: "Diwali, Sankranti and Ugadi collections, shipped fresh in insulated cartons." },
  { img: giftbox, title: "Corporate", copy: "Branded boxes for clients and teams, with GST invoicing and bulk despatch." },
];

function Gifting() {
  return (
    <div className="bg-cream font-sans">
      <section className="bg-brown text-cream px-5 py-20 lg:px-10 lg:py-28 border-b border-gold/30">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            onDark
            align="left"
            eyebrow="Gifting"
            title="A box worth opening slowly"
            subtitle="Hand-finished in gold parchment, lined with rice paper, tied with traditional ribbon."
          />
        </div>
      </section>

      <section className="px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading eyebrow="Occasions" title="However you'd like to give it" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {occasions.map((o) => (
              <article key={o.title} className="overflow-hidden rounded-xl border border-brown/15 bg-cream-light shadow-flat">
                <img
                  src={o.img}
                  alt={o.title}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-3xl text-brown">{o.title}</h3>
                  <p className="mt-3 font-sans text-base font-bold leading-relaxed text-brown/80">{o.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-light px-5 py-20 lg:px-10 lg:py-28 border-t border-brown/15">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading eyebrow="Ready to gift" title="Boxes made for giving" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.badge === "Gifting" || p.slug === "dry-fruit-putharekulu" || p.slug === "ghee-putharekulu")
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="border-brown text-brown hover:bg-brown hover:text-white">
                Enquire about bulk orders
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
