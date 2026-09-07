import type { Product } from "@/lib/products";

interface StructuredDataProps {
  type: "organization" | "product" | "localbusiness" | "breadcrumb" | "faq";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    const baseUrl = "https://9storiesandco.com";

    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "9 Stories & Co.",
          alternateName: "9 Stories and Co",
          url: baseUrl,
          logo: `${baseUrl}/favicon.ico`,
          description: "9 Stories & Co. - India's premium handcrafted Putharekulu brand. Authentic Andhra sweets made with nine generations of expertise.",
          foundingDate: "2024",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Atreyapuram",
            addressLocality: "Atreyapuram",
            addressRegion: "Andhra Pradesh",
            postalCode: "533257",
            addressCountry: "IN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-4448901200",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi", "Telugu"],
            areaServed: "IN",
          },
          slogan: "Nine layers of tradition in every bite",
        };

      case "localbusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "9 Stories & Co.",
          image: `${baseUrl}/hero-putharekulu.jpg`,
          description: "9 Stories & Co. - Premium handcrafted Putharekulu from Atreyapuram, Andhra Pradesh.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Atreyapuram",
            addressRegion: "Andhra Pradesh",
            postalCode: "533257",
            addressCountry: "IN",
          },
          url: baseUrl,
          telephone: "+91-4448901200",
          priceRange: "₹₹",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "500",
            bestRating: "5",
            worstRating: "1",
          },
        };

      case "product":
        const product = data as Product;
        if (!product) return {};
        const reviewsCount = product.reviewsCount ?? (product as any).reviews ?? 100;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: `${product.tagline || ""}. ${product.description || ""}. Buy ${product.name} online from 9 Stories & Co.`,
          image: product.image,
          url: `${baseUrl}/shop/${product.slug}`,
          brand: {
            "@type": "Brand",
            name: "9 Stories & Co.",
            url: baseUrl,
          },
          offers: {
            "@type": "Offer",
            url: `${baseUrl}/shop/${product.slug}`,
            priceCurrency: "INR",
            price: product.weights?.[0]?.price || 0,
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "9 Stories & Co.",
            },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating || 4.9,
            reviewCount: reviewsCount,
            bestRating: "5",
            worstRating: "1",
          },
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: (data || []).map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          })),
        };

      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (data || []).map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };

      default:
        return {};
    }
  };

  const schema = generateSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}