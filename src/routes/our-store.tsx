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
      <main className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-parchment px-3 py-1 text-accent font-semibold">
              <MapPin className="h-3.5 w-3.5" /> Flagship Outlets
            </span>
            <h1 className="font-display text-3xl font-light text-primary sm:text-5xl">
              Experience Our Sweet Boutiques
            </h1>
            <p className="text-sm text-muted-foreground">
              Step into the world of 9 Stories &amp; Co. Taste our freshly handcrafted Putharekulu, pure ghee delights, and authentic spice blends made fresh every morning.
            </p>
          </div>

          {/* Store Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {physicalStores.map((store) => (
              <div
                key={store.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-lift hover:border-gold"
              >
                <div>
                  {store.isFlagship && (
                    <span className="inline-flex items-center gap-1 mb-3 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                      <Sparkles className="h-3 w-3" /> Flagship Store
                    </span>
                  )}
                  <h3 className="font-display text-xl text-primary font-semibold group-hover:text-accent transition-colors">
                    {store.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{store.city}</p>

                  <div className="mt-4 space-y-2.5 text-xs text-primary/90">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-accent shrink-0" />
                      <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent shrink-0" />
                      <span>{store.hours}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-parchment/60 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent"
                  >
                    Get Directions on Map <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="mt-16 rounded-2xl border border-gold/40 bg-parchment/80 p-8 text-center max-w-3xl mx-auto space-y-3">
            <ShieldCheck className="h-10 w-10 text-accent mx-auto" />
            <h3 className="font-display text-2xl text-primary">Can't visit a physical store?</h3>
            <p className="text-xs text-muted-foreground">
              We pack every order in airtight tamper-proof containers and ship directly to your doorstep anywhere in India or across the globe within 24 hours.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
