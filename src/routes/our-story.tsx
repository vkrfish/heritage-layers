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
    <div className="bg-cream font-sans">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-cream py-16 lg:py-24 border-b border-brown/15">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
          <div className="max-w-2xl reveal space-y-4">
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Nine generations. One recipe."
              subtitle="We didn't invent Putharekulu. We simply refused to let it become something faster."
            />
          </div>

          <div className="relative flex items-center justify-center p-6">
            <div className="relative w-full max-w-md aspect-square rounded-xl bg-cream-light/60 border border-brown/15 p-8 flex items-center justify-center">
              <BotanicalLeafIllustration className="w-full h-full max-h-[280px] object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY BODY */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="max-w-2xl space-y-6 font-sans text-lg font-bold leading-relaxed text-brown/85">
            <p>
              In Atreyapuram, a village on the banks of the Godavari, the morning begins with the
              sound of a ladle against clay. The rice has soaked overnight. The pot is warm. And a
              sheet thinner than paper is about to be lifted with nothing but fingertips.
            </p>
            <p>
              Our family has made this sweet for nine generations. It has never scaled well, and we
              have never tried to make it. Every sheet is a decision. Every fold is a hand.
            </p>
            <p>
              9 Stories & Co. exists so this sweet travels — to a wedding in Chennai, a Diwali table
              in London, a homesick student in Toronto — without losing the kitchen it came from.
            </p>
          </div>
          <img
            src={craftLayers}
            alt="Layers of Putharekulu being folded"
            loading="lazy"
            width={1200}
            height={1400}
            className="rounded-xl border border-brown/15 object-cover shadow-lift"
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-cream-light px-5 py-16 lg:px-10 lg:py-24 border-t border-brown/15">
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="left" eyebrow="Timeline" title="How we got here" />
          <ol className="mt-12 border-l border-terracotta/40 font-sans">
            {timeline.map(([year, copy]) => (
              <li key={year} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-terracotta" />
                <p className="font-display text-4xl text-brown">{year}</p>
                <p className="mt-2 font-sans text-base font-bold leading-relaxed text-brown/80">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
