import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/ui-kit";
import heritage from "@/assets/heritage.jpg";
import craftLayers from "@/assets/craft-layers.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — 9 Stories & Co." },
      {
        name: "description",
        content:
          "Nine generations of a family kitchen in Atreyapuram, Andhra Pradesh, and the sweet they refused to change.",
      },
      { property: "og:title", content: "Our Story — 9 Stories & Co." },
      {
        property: "og:description",
        content: "Nine generations of a family kitchen in Atreyapuram, Andhra Pradesh.",
      },
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

function OurStory() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary">
        <img
          src={heritage}
          alt="A traditional Andhra kitchen"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="relative mx-auto max-w-[1400px] px-5 py-28 lg:px-10 lg:py-36">
          <SectionHeading
            onDark
            align="left"
            eyebrow="Our Story"
            title="Nine generations. One recipe."
            subtitle="We didn't invent Putharekulu. We simply refused to let it become something faster."
          />
        </div>
      </section>

      <section className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
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
            className="rounded-[12px] object-cover"
          />
        </div>
      </section>

      <section className="paper px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="left" eyebrow="Timeline" title="How we got here" />
          <ol className="mt-12 border-l border-border">
            {timeline.map(([year, copy]) => (
              <li key={year} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="font-display text-3xl text-primary">{year}</p>
                <p className="mt-2 leading-relaxed text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
