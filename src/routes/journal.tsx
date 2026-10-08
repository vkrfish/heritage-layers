import { createFileRoute, Link } from "@tanstack/react-router";

import { Eyebrow, SectionHeading } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";
import { blogPosts } from "@/lib/blog";
import craftGhee from "@/assets/craft-ghee.jpg";
import craftSheet from "@/assets/craft-sheet.jpg";
import heritage from "@/assets/heritage.jpg";
import occasionFestival from "@/assets/occasion-festival.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Stories from the Kitchen | 9 Stories & Co. Blog" },
      {
        name: "description",
        content:
          "Discover stories from Atreyapuram kitchen - Putharekulu heritage, traditional crafting techniques, festival recipes, and authentic Andhra food culture. Expert insights on Indian sweets.",
      },
      { name: "keywords", content: "Putharekulu blog, Andhra sweets blog, Indian food blog, traditional sweets recipes, Indian festival food, heritage food stories, authentic Indian cooking" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Journal — Stories from the Kitchen" },
      { property: "og:url", content: "https://9storiesandco.com/journal" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://9storiesandco.com/journal" },
    ],
  }),
  component: Journal,
});

const displayPosts = [
  { img: craftSheet, tag: "Craft", title: "Why it has to be a clay pot", date: "12 August 2026", excerpt: "Metal heats too evenly. Clay breathes, and the sheet lifts clean." },
  { img: craftGhee, tag: "Ingredients", title: "Clarifying ghee for four hours", date: "28 July 2026", excerpt: "The difference between good ghee and great ghee is patience measured in hours." },
  { img: heritage, tag: "Heritage", title: "The women who kept the recipe", date: "9 July 2026", excerpt: "Three grandmothers, one notebook, and a measurement written as 'enough'." },
  { img: occasionFestival, tag: "Festivals", title: "What Sankranti tastes like", date: "21 June 2026", excerpt: "Rice, jaggery and sesame — and a house that smells of all three at once." },
];

function Journal() {
  return (
    <div className="bg-cream px-5 py-16 lg:px-10 lg:py-24 font-sans">
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: "Home", url: "/" },
          { name: "Journal", url: "/journal" },
        ]} 
      />
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Journal"
          title="Notes from the kitchen"
          subtitle="Slow writing about a slow sweet."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {displayPosts.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-xl border border-brown/15 bg-cream-light transition-all duration-300 hover:shadow-lift"
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
                <Eyebrow tone="terracotta">{p.tag}</Eyebrow>
                <h2 className="mt-2 font-display text-3xl text-brown">{p.title}</h2>
                <p className="mt-3 font-sans text-base font-bold leading-relaxed text-brown/80">{p.excerpt}</p>
                <p className="mt-5 font-sans text-xs font-bold tracking-[0.2em] text-brown/60 uppercase">
                  {p.date}
                </p>
              </div>
            </article>
          ))}
        </div>
        
        {/* Blog Posts Section */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Blog"
            title="Stories from our kitchen"
            subtitle="In-depth articles about Putharekulu, Andhra heritage, and traditional sweet making."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-xl border border-brown/15 bg-cream-light transition-all duration-300 hover:shadow-lift"
              >
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  width={1200}
                  height={700}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-8">
                  <div className="flex items-center gap-3">
                    <Eyebrow tone="terracotta">{post.category}</Eyebrow>
                    <span className="text-xs text-brown/40">•</span>
                    <span className="font-sans text-xs font-bold text-brown/70">{post.readingTime} min read</span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl text-brown">{post.title}</h2>
                  <p className="mt-3 font-sans text-base font-bold leading-relaxed text-brown/80">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between font-sans">
                    <p className="text-xs font-bold tracking-[0.2em] text-brown/60 uppercase">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <Link 
                      to="/journal/$slug"
                      params={{ slug: post.slug }}
                      className="text-sm font-bold text-terracotta hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
