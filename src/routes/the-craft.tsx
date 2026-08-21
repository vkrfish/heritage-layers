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
          "Four steps, no shortcuts: soaking the rice, lifting the sheet, brushing the ghee, folding the nine layers.",
      },
      { property: "og:title", content: "The Craft — How Putharekulu Is Made" },
      {
        property: "og:description",
        content: "Soaking, lifting, brushing, folding — the four steps behind every sheet.",
      },
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
    <>
      <section className="bg-primary px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            onDark
            eyebrow="The Craft"
            title="Nothing here can be rushed"
            subtitle="A sheet takes eight seconds to set and fifteen years to master."
          />
        </div>
      </section>

      <section className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-20">
          {steps.map((s, i) => (
            <article
              key={s.n}
              className="grid items-center gap-12 lg:grid-cols-2"
            >
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                width={1200}
                height={900}
                className={`rounded-[12px] object-cover ${i % 2 ? "lg:order-2" : ""}`}
              />
              <div>
                <p className="font-display text-6xl text-gold">{s.n}</p>
                <h2 className="mt-4 text-4xl text-primary">{s.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="paper px-5 py-24 text-center lg:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl text-primary">Taste the difference eight seconds makes</h2>
          <div className="mt-8">
            <Link to="/shop">
              <Button size="lg">Shop the collection</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
