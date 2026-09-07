import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Eyebrow, SectionHeading } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";
import { getBlogPost, blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post not found — 9 Stories & Co." }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const postUrl = `https://9storiesandco.com/journal/${post.slug}`;
    const keywords = post.keywords?.join(", ") || `${post.category}, ${post.tags.join(", ")}`;

    return {
      meta: [
        { title: `${post.seoTitle || post.title} — 9 Stories & Co. Journal` },
        { name: "description", content: post.seoDescription || post.excerpt },
        { name: "keywords", content: keywords },
        { name: "author", content: post.author },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:image", content: post.featuredImage },
        { property: "og:url", content: postUrl },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:modified_time", content: post.updatedAt },
        { property: "article:author", content: post.author },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.featuredImage },
      ],
      links: [
        { rel: "canonical", href: postUrl },
      ],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);

  const breadcrumbData = [
    { name: "Home", url: "/" },
    { name: "Journal", url: "/journal" },
    { name: post.title, url: `/journal/${post.slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "9 Stories & Co.",
      logo: {
        "@type": "ImageObject",
        url: "https://9storiesandco.com/favicon.ico",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://9storiesandco.com/journal/${post.slug}`,
    },
  };

  return (
    <div className="px-5 py-20 lg:px-10 lg:py-28">
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-[4xl]">
        {/* Article Header */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/journal" className="hover:text-accent">
            Journal
          </Link>
          <span className="px-2">/</span>
          <span className="text-primary">{post.title}</span>
        </nav>

        <article className="mt-8">
          <div className="flex items-center gap-3">
            <Eyebrow>{post.category}</Eyebrow>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{post.readingTime} min read</span>
          </div>
          
          <h1 className="mt-4 text-5xl leading-tight text-primary lg:text-6xl">{post.title}</h1>
          
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            width={1200}
            height={700}
            className="mt-8 w-full rounded-[12px] object-cover"
          />

          <div className="mt-8 prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <SectionHeading
              eyebrow="Related"
              title="You might also like"
            />
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/journal/${relatedPost.slug}`}
                  className="group overflow-hidden rounded-[12px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <img
                    src={relatedPost.featuredImage}
                    alt={relatedPost.title}
                    loading="lazy"
                    width={600}
                    height={400}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-6">
                    <Eyebrow>{relatedPost.category}</Eyebrow>
                    <h3 className="mt-2 text-xl leading-tight text-primary">{relatedPost.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}