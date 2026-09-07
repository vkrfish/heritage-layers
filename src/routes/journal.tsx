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
      {
        property: "og:description",
        content: "Stories from Atreyapuram on clay pots, ghee, festival tables, and the art of making Putharekulu.",
      },
      { property: "og:image", content: "https://9storiesandco.com/craft-sheet.jpg" },
      { property: "og:url", content: "https://9storiesandco.com/journal" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Journal — Stories from the Kitchen" },
      { name: "twitter:description", content: "Stories from Atreyapuram on clay pots, ghee, festival tables, and the art of making Putharekulu." },
      { name: "twitter:image", content: "https://9storiesandco.com/craft-sheet.jpg" },
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
    <div className="px-5 py-20 lg:px-10 lg:py-28">
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
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {displayPosts.map((p) => (
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
        
        {/* Blog Posts Section */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Blog"
            title="Stories from our kitchen"
            subtitle="In-depth articles about Putharekulu, Andhra heritage, and traditional sweet making."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-[12px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
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
                    <Eyebrow>{post.category}</Eyebrow>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.readingTime} min read</span>
                  </div>
                  <h2 className="mt-3 text-3xl leading-tight text-primary">{post.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <Link 
                      to={`/journal/${post.slug}`}
                      className="text-sm font-medium text-accent hover:text-accent-hover"
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
