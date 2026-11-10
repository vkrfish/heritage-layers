import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/ui-kit";
import craftLayers from "@/assets/craft-layers.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — 9 Stories & Co. | Nine Generations of Andhra Heritage" },
      {
        name: "description",
        content:
          "Discover the story of 9 Stories & Co. - nine generations of Putharekulu craftsmanship from Atreyapuram, Andhra Pradesh. Authentic tradition passed down since 1908.",
      },
      { name: "keywords", content: "Andhra heritage, traditional sweets, family recipe, Atreyapuram sweets, Indian sweet history, Putharekulu origin, authentic Indian food, heritage food brand" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Our Story — 9 Stories & Co." },
      { property: "og:url", content: "https://9storiesandco.com/our-story" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://9storiesandco.com/our-story" },
    ],
  }),
  component: OurStory,
});

const timeline = [
  ["1908", "A single household in Atreyapuram begins folding rice sheets for temple offerings."],
  ["1954", "The recipe passes to the third generation, who add slow-clarified cow ghee."],
  ["1987", "Palm jaggery joins sugar, made the old way for families who preferred it."],
  ["2016", "The kitchen opens to visitors — the first time outsiders watch a sheet being lifted."],
  ["2024", "9 Stories & Co. is founded to carry the same nine-layer sweet beyond Andhra."],
];

function BotanicalLeafIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M200 360C200 360 220 280 280 220C340 160 370 80 370 40C370 40 290 70 230 130C170 190 160 270 160 270"
        stroke="#4A2C20"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
      />
      <path
        d="M200 360C200 360 170 290 120 240C70 190 30 140 30 90C30 90 100 100 150 150C200 200 200 270 200 270"
        stroke="#4A2C20"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />
    </svg>
  );
}

function OurStory() {
  return (
    <div className="bg-[#FAF7F2] font-sans">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#FAF7F2] py-14 lg:py-20 border-b border-brown/10">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-2 lg:px-10">
          <div className="max-w-xl space-y-4">
            <SectionHeading
              align="left"
              eyebrow="Provenance"
              title="Nine generations. One unhurried recipe."
              subtitle="We didn't invent Putharekulu. We simply refused to let it become something faster."
            />
          </div>

          <div className="relative flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm aspect-square rounded-lg bg-white border border-brown/10 p-8 flex items-center justify-center shadow-soft">
              <BotanicalLeafIllustration className="w-full h-full max-h-[260px] object-contain opacity-40" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY BODY */}
      <section className="px-5 py-14 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="max-w-xl space-y-5 font-sans text-base sm:text-lg font-normal leading-relaxed text-brown/80">
            <p>
              In Atreyapuram, a village nestled along the Godavari River delta, the morning begins with the
              sound of a ladle against warm earthen clay. The rice has soaked overnight. The inverted pot kiln is gently heated. And a
              sheet thinner than paper is lifted with nothing but calloused fingertips.
            </p>
            <p>
              Our family has preserved this culinary art across nine generations. It has never scaled to industrial machinery, and we
              have never tried to make it. Every gossamer sheet is an individual decision. Every fold is an artisan's hand.
            </p>
            <p>
              9 Stories & Co. exists so this 300-year sweet travels across the globe — to a wedding in Chennai, a Diwali table
              in London, a homesick family in New York — without ever losing the quiet village kitchen it was born in.
            </p>
          </div>
          <img
            src={craftLayers}
            alt="Layers of Putharekulu being folded"
            loading="lazy"
            width={1200}
            height={1400}
            className="rounded-lg border border-brown/10 object-cover shadow-soft"
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white px-5 py-14 lg:px-10 lg:py-20 border-t border-brown/10">
        <div className="mx-auto max-w-2xl">
          <SectionHeading align="left" eyebrow="Chronicle" title="A century on the Godavari" />
          <ol className="mt-10 border-l border-gold/40 font-sans">
            {timeline.map(([year, copy]) => (
              <li key={year} className="relative pb-8 pl-7 last:pb-0">
                <span className="absolute top-1.5 -left-[4.5px] h-2 w-2 rounded-full bg-gold" />
                <p className="font-display text-3xl text-brown font-normal">{year}</p>
                <p className="mt-1.5 font-sans text-sm sm:text-base font-normal leading-relaxed text-brown/70">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
