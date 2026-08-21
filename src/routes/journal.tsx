import { createFileRoute } from "@tanstack/react-router";

import { Eyebrow, SectionHeading } from "@/components/ui-kit";
import craftGhee from "@/assets/craft-ghee.jpg";
import craftSheet from "@/assets/craft-sheet.jpg";
import heritage from "@/assets/heritage.jpg";
import occasionFestival from "@/assets/occasion-festival.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Notes from the Kitchen | 9 Stories & Co." },
      {
        name: "description",
        content:
          "Stories from Atreyapuram: why clay pots matter, how ghee is clarified, and what Sankranti tastes like.",
      },
      { property: "og:title", content: "Journal — Notes from the Kitchen" },
      {
        property: "og:description",
        content: "Stories from Atreyapuram on clay pots, ghee and festival tables.",
      },
    ],
  }),
  component: Journal,
});

const posts = [
  { img: craftSheet, tag: "Craft", title: "Why it has to be a clay pot", date: "12 August 2026", excerpt: "Metal heats too evenly. Clay breathes, and the sheet lifts clean." },
  { img: craftGhee, tag: "Ingredients", title: "Clarifying ghee for four hours", date: "28 July 2026", excerpt: "The difference between good ghee and great ghee is patience measured in hours." },
  { img: heritage, tag: "Heritage", title: "The women who kept the recipe", date: "9 July 2026", excerpt: "Three grandmothers, one notebook, and a measurement written as 'enough'." },
  { img: occasionFestival, tag: "Festivals", title: "What Sankranti tastes like", date: "21 June 2026", excerpt: "Rice, jaggery and sesame — and a house that smells of all three at once." },
];

function Journal() {
  return (
    <div className="px-5 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Journal"
          title="Notes from the kitchen"
          subtitle="Slow writing about a slow sweet."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {posts.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-[12px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                width={1200}
                height={700}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="p-8">
                <Eyebrow>{p.tag}</Eyebrow>
                <h2 className="mt-3 text-3xl leading-tight text-primary">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <p className="mt-5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {p.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
