import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

import { StructuredData } from "@/components/seo";
import { physicalStores } from "@/lib/products";

export const Route = createFileRoute("/our-store")({
  head: () => ({
    meta: [
      { title: "Physical Store Finder | 9 Stories & Co. Flagship Outlets" },
      {
        name: "description",
        content:
          "Visit 9 Stories & Co. flagship sweet boutiques in Chennai, Hyderabad, Coimbatore, Bengaluru, and London. Experience fresh heritage Putharekulu and authentic delicacies.",
      },
      { name: "keywords", content: "9 Stories store location, Putharekulu shop near me, Chennai sweet shop, Hyderabad Putharekulu boutique, London Indian sweets" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://9storiesandco.com/our-store" }],
  }),
  component: OurStorePage,
});

function OurStorePage() {
  return (
    <>
      <StructuredData type="localbusiness" data={{}} />
      <main className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-gold bg-cream-light px-4 py-1.5 text-terracotta font-bold">
              <MapPin className="h-4 w-4" /> Flagship Outlets
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-normal text-brown">
              Experience Our Sweet Boutiques
            </h1>
            <p className="font-sans text-base font-bold text-brown/80">
              Step into the world of 9 Stories &amp; Co. Taste our freshly handcrafted Putharekulu, pure ghee delights, and authentic spice blends made fresh every morning.
            </p>
          </div>

          {/* Store Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {physicalStores.map((store) => (
              <div
                key={store.id}
                className="group relative flex flex-col justify-between rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat transition-all duration-300 hover:shadow-lift"
              >
                <div>
                  {store.isFlagship && (
                    <span className="inline-flex items-center gap-1 mb-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-bold text-brown">
                      <Sparkles className="h-3.5 w-3.5" /> Flagship Store
                    </span>
                  )}
                  <h3 className="font-display text-2xl text-brown group-hover:text-terracotta transition-colors">
                    {store.name}
                  </h3>
                  <p className="mt-1 font-sans text-xs font-bold text-brown/70">{store.city}</p>

                  <div className="mt-4 space-y-2.5 font-sans text-xs font-bold text-brown/90">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-terracotta shrink-0" />
                      <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-terracotta shrink-0" />
                      <span>{store.hours}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-brown/15 pt-4">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brown bg-brown/10 py-2.5 font-sans text-xs font-bold text-brown transition-all hover:bg-brown hover:text-white"
                  >
                    Get Directions on Map <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="mt-16 rounded-xl border border-gold bg-cream-light p-8 text-center max-w-3xl mx-auto space-y-3 font-sans">
            <ShieldCheck className="h-10 w-10 text-terracotta mx-auto" />
            <h3 className="font-display text-3xl text-brown">Can't visit a physical store?</h3>
            <p className="font-sans text-sm font-bold text-brown/80">
              We pack every order in airtight tamper-proof containers and ship directly to your doorstep anywhere in India or across the globe within 24 hours.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
