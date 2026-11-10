import { createFileRoute, Link } from "@tanstack/react-router";

import { Button, SectionHeading } from "@/components/ui-kit";
import craftBatter from "@/assets/craft-batter.jpg";
import craftSheet from "@/assets/craft-sheet.jpg";
import craftGhee from "@/assets/craft-ghee.jpg";
import craftLayers from "@/assets/craft-layers.jpg";

export const Route = createFileRoute("/the-craft")({
  head: () => ({
    meta: [
      { title: "The Craft — How Putharekulu Is Made | 9 Stories & Co." },
      {
        name: "description",
        content:
          "Discover the traditional art of making Putharekulu - four authentic steps from rice batter to paper-thin layers. Handcrafted in Andhra Pradesh using age-old techniques.",
      },
      { name: "keywords", content: "how Putharekulu is made, Putharekulu recipe, Indian sweet making, traditional food craft, Andhra cuisine, handmade sweets, authentic Indian cooking, food heritage" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "The Craft — How Putharekulu Is Made" },
      { property: "og:url", content: "https://9storiesandco.com/the-craft" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://9storiesandco.com/the-craft" },
    ],
  }),
  component: TheCraft,
});

const steps = [
  {
    img: craftBatter,
    n: "01",
    title: "The Batter",
    copy: "Local rice soaks overnight, then is stone-ground to a batter loose enough to sweep and thick enough to hold.",
  },
  {
    img: craftSheet,
    n: "02",
    title: "The Sheet",
    copy: "A cloth sweeps the batter across an inverted clay pot. Within seconds it sets into a translucent film.",
  },
  {
    img: craftGhee,
    n: "03",
    title: "The Ghee",
    copy: "Cow ghee, clarified slowly until it smells of caramel, is brushed over the sheet while still warm.",
  },
  {
    img: craftLayers,
    n: "04",
    title: "The Fold",
    copy: "Powdered sugar or palm jaggery is scattered, and the sheet is folded — nine times — into its final form.",
  },
];

function TheCraft() {
  return (
    <div className="bg-[#FAF7F2] font-sans">
      <section className="bg-[#1B120E] text-[#FAF7F2] px-5 py-16 lg:px-10 lg:py-24 border-b border-white/10">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            onDark
            eyebrow="The Technique"
            title="Nothing here can be rushed"
            subtitle="A gossamer sheet takes eight seconds to set and fifteen years to master."
          />
        </div>
      </section>

      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-16">
          {steps.map((s, i) => (
            <article
              key={s.n}
              className="grid items-center gap-10 lg:grid-cols-2"
            >
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                width={1200}
                height={900}
                className={`rounded-lg border border-brown/10 object-cover shadow-soft ${i % 2 ? "lg:order-2" : ""}`}
              />
              <div className="max-w-md">
                <p className="font-display text-4xl sm:text-5xl text-gold/80 font-normal">{s.n}</p>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl text-brown font-normal tracking-tight">{s.title}</h2>
                <p className="mt-3 font-sans text-sm sm:text-base font-normal leading-relaxed text-brown/70">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-center lg:px-10 border-t border-brown/10">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-brown tracking-tight">Taste the difference eight seconds makes</h2>
          <p className="font-sans text-sm font-normal text-brown/60 max-w-md mx-auto">
            Order fresh small-batch Putharekulu delivered straight from Godavari pot kilns.
          </p>
          <div className="pt-2">
            <Link to="/shop">
              <Button size="lg" variant="primary" className="bg-[#C88A36] text-white hover:bg-[#B4782B] text-sm font-medium">
                Explore the Confectionery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
