import Link from "next/link";
import type { ReactNode } from "react";
import { LeadForm } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { ArrowRight, BookOpen, Calendar, Clock, Phone } from "lucide-react";

export type Author = {
  name: string;
  bio: string;
  role: string;
};

export type RelatedArticle = {
  href: string;
  title: string;
  excerpt: string;
};

export type RelatedService = {
  href: string;
  label: string;
};

export type TocItem = {
  id: string;
  label: string;
};

export type BlogPostProps = {
  title: string;
  excerpt: string;
  publishedDate: string;
  updatedDate?: string;
  readingTime: number;
  author: Author;
  category: string;
  slug: string;
  canonicalPath?: string;
  sectionLabel?: string;
  sectionHref?: string;
  toc: TocItem[];
  content: ReactNode;
  faqs?: FAQItem[];
  relatedArticles?: RelatedArticle[];
  relatedServices?: RelatedService[];
};

export const AUTHORS: Record<string, Author> = {
  financial_education: {
    name: "WeHelpFinance Financial Education Team",
    role: "Financial Education",
    bio: "The WeHelpFinance Financial Education Team researches consumer debt, personal finance, credit management, and financial hardship topics to help Americans make informed financial decisions. Our content is reviewed for accuracy and updated regularly to reflect current market conditions and IRS guidelines.",
  },
  research: {
    name: "WeHelpFinance Research Team",
    role: "Financial Research",
    bio: "The WeHelpFinance Research Team analyzes consumer debt trends, credit usage, inflation impacts, and financial hardship data to provide educational insights and research-backed content. We draw on publicly available Federal Reserve data, CFPB reports, and industry research to inform our analysis.",
  },
};

const PHONE_NUMBER = "+17183604806";
const PHONE_DISPLAY = "(718) 360-4806";

export function InlineCTA({
  variant = "primary",
  heading,
  subtext,
  ctaLabel = "Get Free Consultation",
  ctaHref = "/get-help",
}: {
  variant?: "primary" | "soft" | "phone";
  heading: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  if (variant === "phone") {
    return (
      <div className="not-prose my-8 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-soft/40 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-display font-semibold text-foreground">{heading}</p>
          {subtext && <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>}
        </div>
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  if (variant === "soft") {
    return (
      <div className="not-prose my-8 rounded-2xl border border-border bg-card p-6">
        <p className="font-display font-semibold text-foreground">{heading}</p>
        {subtext && <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>}
        <Link
          href={ctaHref}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border border-primary px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft"
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="not-prose my-8 rounded-2xl bg-primary p-6 text-primary-foreground">
      <p className="font-display text-lg font-semibold">{heading}</p>
      {subtext && <p className="mt-2 text-sm text-primary-foreground/85">{subtext}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={ctaHref}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary transition hover:bg-white/90"
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-primary-foreground transition hover:bg-white/10"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}

export function BlogPost({
  title,
  excerpt,
  publishedDate,
  updatedDate,
  readingTime,
  author,
  category,
  slug,
  canonicalPath,
  toc,
  content,
  faqs,
  relatedArticles,
  relatedServices,
}: BlogPostProps) {
  const canonicalUrl = `https://wehelpfinance.com${canonicalPath ?? `/blog/${slug}`}`;
  const authorInitials = author.name.split(" ").slice(0, 2).map((word) => word[0]).join("");

  return (
    <article className="pb-24" itemScope itemType="https://schema.org/Article">
      <meta itemProp="headline" content={title} />
      <meta itemProp="description" content={excerpt} />
      <meta itemProp="datePublished" content={publishedDate} />
      {updatedDate && <meta itemProp="dateModified" content={updatedDate} />}
      <meta itemProp="url" content={canonicalUrl} />
      <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
        <meta itemProp="name" content="WeHelpFinance" />
        <meta itemProp="url" content="https://wehelpfinance.com" />
      </div>
      <div itemProp="author" itemScope itemType="https://schema.org/Organization" className="hidden">
        <meta itemProp="name" content={author.name} />
      </div>

      <header className="relative bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {category}
          </span>
          <h1 className="mt-4 max-w-3xl" itemProp="name">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Published {formatDate(publishedDate)}
            </span>
            {updatedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Updated {formatDate(updatedDate)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {readingTime} min read
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary">
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{author.name}</p>
              <p className="text-xs text-muted-foreground">{author.role} • WeHelpFinance</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page max-w-6xl">
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-14">
          <div className="min-w-0">
            {toc.length > 0 && (
              <details className="mb-8 rounded-2xl border border-border bg-card p-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between text-left">
                  <span className="flex items-center gap-2 font-display font-semibold text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                    In this article
                  </span>
                </summary>
                <ol className="mt-4 space-y-2 pl-2">
                  {toc.map((item, index) => (
                    <li key={item.id} className="text-sm">
                      <a href={`#${item.id}`} className="flex items-start gap-2 text-muted-foreground hover:text-primary">
                        <span className="mt-0.5 shrink-0 text-xs font-semibold text-primary">{index + 1}.</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
              {content}
            </div>

            {faqs && faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6">Frequently Asked Questions</h2>
                <FAQ items={faqs} />
              </div>
            )}

            <InlineCTA
              heading="Ready to explore your options?"
              subtext="A free, confidential consultation with a vetted specialist can show you exactly what's available for your situation — no obligation."
            />

            <div className="mt-12 rounded-2xl border border-border bg-card p-6" itemScope itemType="https://schema.org/Organization">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-lg font-bold text-primary">
                  {authorInitials}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground" itemProp="name">{author.name}</p>
                  <p className="mb-2 text-xs text-primary">{author.role}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground" itemProp="description">{author.bio}</p>
                  <Link href="/editorial-policy" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
                    Our editorial standards →
                  </Link>
                </div>
              </div>
            </div>

            {relatedArticles && relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6">Related Articles</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedArticles.map((article) => (
                    <Link
                      key={article.href}
                      href={article.href}
                      className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-sm"
                    >
                      <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Read more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedServices && relatedServices.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Explore your options</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <InlineCTA
              variant="phone"
              heading="Speak with a specialist today — it's free."
              subtext="No obligation. No pressure. Just a clear conversation about your options."
            />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <LeadForm />
            <div className="space-y-2 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              <p className="text-sm font-semibold text-foreground">About this content</p>
              <p>This article is for educational purposes only and does not constitute financial, legal, or tax advice.</p>
              <Link href="/editorial-policy" className="text-xs text-primary hover:underline">
                View our editorial policy →
              </Link>
            </div>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-primary bg-primary-soft/40 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary-soft"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium text-muted-foreground">Talk to a specialist</span>
                {PHONE_DISPLAY}
              </span>
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
