import { authorJsonLd } from "@/lib/authorConfig";
import { ORGANIZATION, SITE_URL } from "@/lib/organizationConfig";

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
      item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    serviceType: opts.serviceType,
    provider: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    areaServed: ORGANIZATION.areaServed,
  };
}

export function articleJsonLd({
  title,
  excerpt,
  published,
  updated,
  slug,
  author,
  path,
}: {
  title: string;
  excerpt: string;
  published: string;
  updated?: string;
  slug: string;
  author: string;
  path?: string;
}) {
  const pagePath = path ?? `/blog/${slug}`;
  const url = pagePath.startsWith("http") ? pagePath : `${SITE_URL}${pagePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: published,
    dateModified: updated ?? published,
    url,
    author: author ? { "@type": "Organization", name: author, url: ORGANIZATION.url } : authorJsonLd(pagePath),
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function howToJsonLd(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
