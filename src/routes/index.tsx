import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Package, Sparkles, Truck } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Button, Eyebrow, SectionHeading } from "@/components/ui-kit";
import { products } from "@/lib/products";
import hero from "@/assets/hero-putharekulu.jpg";
import craftSheet from "@/assets/craft-sheet.jpg";
import heritage from "@/assets/heritage.jpg";
import occasionWedding from "@/assets/occasion-wedding.jpg";
import occasionFestival from "@/assets/occasion-festival.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "9 Stories & Co. — Handcrafted Andhra Putharekulu" },
      {
        name: "description",
        content:
          "Paper-thin Putharekulu handmade in small batches in Andhra Pradesh. Pure ghee, palm jaggery and premium gift boxes delivered fresh.",
      },
      { property: "og:title", content: "9 Stories & Co. — Handcrafted Andhra Putharekulu" },
      {
        property: "og:description",
        content:
          "Paper-thin Putharekulu handmade in small batches in Andhra Pradesh. Pure ghee, palm jaggery and premium gift boxes.",
      },
    ],
  }),
  component: Home,
});

const promises = [
  { icon: Leaf, title: "Pure Ingredients", copy: "Rice, ghee, jaggery. Nothing else, ever." },
  { icon: Sparkles, title: "Made By Hand", copy: "Each sheet lifted by hand over an earthen pot." },
  { icon: Package, title: "Made To Order", copy: "Baked in small batches the day we ship." },
  { icon: Truck, title: "Delivered Fresh", copy: "Insulated packing across India in 2–4 days." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary">
        <img
          src={hero}
          alt="Layers of handcrafted Putharekulu on a brass plate"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          width={1920}
          height={1200}
        />
        <div className="relative mx-auto grid min-h-[78vh] max-w-[1400px] items-center px-5 py-24 lg:px-10">
          <div className="max-w-2xl reveal">
            <Eyebrow tone="gold">Since Nine Generations · Atreyapuram, Andhra</Eyebrow>
            <h1 className="mt-6 text-5xl leading-[1.05] text-on-dark sm:text-6xl lg:text-7xl">
              The paper-thin sweet that carries a story.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted">
              Putharekulu, made the slow way — rice sheets lifted by hand, folded around ghee and
              powdered sugar, and sent to you within hours of being made.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg">Shop the collection</Button>
              </Link>
              <Link to="/the-craft">
                <Button size="lg" variant="onDark">
                  See how it's made
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="paper px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="flex gap-4">
              <p.icon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-primary">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="The Collection"
            title="Nine layers, four ways"
            subtitle="Each variety begins with the same paper-thin sheet and takes a different turn."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                View all products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section className="bg-primary px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2">
          <img
            src={craftSheet}
            alt="A translucent rice sheet being lifted from an earthen pot"
            loading="lazy"
            width={1200}
            height={1500}
            className="rounded-[12px] object-cover"
          />
          <div>
            <SectionHeading
              onDark
              align="left"
              eyebrow="The Craft"
              title="A sheet thinner than paper"
              subtitle="A ladle of rice batter is swept across an inverted clay pot. In seconds it sets into a translucent film, lifted with fingertips alone. Fifteen years of practice sit inside every single sheet."
            />
            <div className="mt-10">
              <Link to="/the-craft">
                <Button variant="onDark" size="lg">
                  Inside the kitchen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Nine stories, one family kitchen"
              subtitle="From a single household in Atreyapuram to a brand carrying Andhra's most delicate sweet across the world — without changing a single step of the recipe."
            />
            <div className="mt-10">
              <Link to="/our-story">
                <Button variant="secondary" size="lg">
                  Read our story
                </Button>
              </Link>
            </div>
          </div>
          <img
            src={heritage}
            alt="Traditional Andhra kitchen with brass vessels"
            loading="lazy"
            width={1200}
            height={1500}
            className="order-1 rounded-[12px] object-cover lg:order-2"
          />
        </div>
      </section>

      {/* Gifting */}
      <section className="paper px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="Gifting"
            title="For the occasions that matter"
            subtitle="Teal and gold keepsake boxes, hand-tied and ready to be given."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {[
              { img: occasionWedding, title: "Weddings", copy: "Return gifts guests remember." },
              { img: occasionFestival, title: "Festivals", copy: "Diwali, Sankranti, Ugadi." },
            ].map((o) => (
              <article
                key={o.title}
                className="group relative overflow-hidden rounded-[12px] bg-primary"
              >
                <img
                  src={o.img}
                  alt={o.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-80 w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <h3 className="text-3xl text-on-dark">{o.title}</h3>
                  <p className="mt-2 text-sm text-on-dark-muted">{o.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/gifting">
              <Button size="lg">Explore gifting</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading eyebrow="Kind Words" title="What people tell us" />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              ["It tasted exactly like my grandmother's, and I hadn't had that in twenty years.", "Sailaja R., Hyderabad"],
              ["We sent 200 boxes as wedding favours. Everyone asked where they were from.", "Karthik & Meera, Chennai"],
              ["The packaging alone made it feel like a gift worth opening slowly.", "Anita D., Bengaluru"],
            ].map(([quote, name]) => (
              <figure key={name} className="rounded-[12px] border border-border bg-card p-8">
                <blockquote className="text-xl leading-snug text-primary">"{quote}"</blockquote>
                <figcaption className="mt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
