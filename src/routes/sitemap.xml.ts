import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/sitemap/xml")({
  loader: () => {
    const baseUrl = "https://9storiesandco.com"; // Replace with actual domain
    
    const staticPages = [
      { url: "", lastmod: "2024-08-22", changefreq: "daily", priority: "1.0" },
      { url: "/shop", lastmod: "2024-08-22", changefreq: "daily", priority: "0.9" },
      { url: "/our-story", lastmod: "2024-08-22", changefreq: "weekly", priority: "0.8" },
      { url: "/the-craft", lastmod: "2024-08-22", changefreq: "weekly", priority: "0.8" },
      { url: "/gifting", lastmod: "2024-08-22", changefreq: "weekly", priority: "0.8" },
      { url: "/journal", lastmod: "2024-08-22", changefreq: "weekly", priority: "0.7" },
      { url: "/contact", lastmod: "2024-08-22", changefreq: "monthly", priority: "0.5" },
      { url: "/checkout", lastmod: "2024-08-22", changefreq: "monthly", priority: "0.3" },
    ];

    const productPages = products.map((product) => ({
      url: `/shop/${product.slug}`,
      lastmod: "2024-08-22",
      changefreq: "daily",
      priority: "0.8",
    }));

    const blogPages = blogPosts.map((post) => ({
      url: `/journal/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: "weekly",
      priority: "0.7",
    }));

    const allPages = [...staticPages, ...productPages, ...blogPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});