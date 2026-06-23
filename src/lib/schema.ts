// lib/schema.ts — Schema helpers for WeHelpFinance

export type FAQItem = { q: string; a: string };

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path,
    })),
  };
}

export function articleJsonLd({
  title,
  excerpt,
  published,
  updated,
  slug,
  author,
}: {
  title: string;
  excerpt: string;
  published: string;
  updated?: string;
  slug: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: published,
    dateModified: updated ?? published,
    url: `https://wehelpfinance.com/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://wehelpfinance.com",
    },
    publisher: {
      "@type": "Organization",
      name: "WeHelpFinance",
      url: "https://wehelpfinance.com",
      logo: {
        "@type": "ImageObject",
        url: "https://wehelpfinance.com/assets/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://wehelpfinance.com/blog/${slug}`,
    },
  };
}
