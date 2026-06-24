import Link from "next/link";
import type { ReactNode } from "react";
import { LeadForm } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Authors ─────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

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
  sectionLabel = "Blog",
  sectionHref = "/blog",
  toc,
  content,
  faqs,
  relatedArticles,
  relatedServices,
}: BlogPostProps) {
  const canonicalUrl = `https://wehelpfinance.com${canonicalPath ?? `/blog/${slug}`}`;

  return (
    <article className="pb-24" itemScope itemType="https://schema.org/Article">
      {/* Hidden schema fields */}
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

      {/* ── Hero ── */}
      <header className="relative bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {category}
          </span>

          <h1 className="mt-4 max-w-3xl" itemProp="name">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{excerpt}</p>

          {/* Meta row */}
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

          {/* Author strip */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-display font-semibold text-sm">
              {author.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{author.name}</p>
              <p className="text-xs text-muted-foreground">{author.role} • WeHelpFinance</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body grid ── */}
      <div className="container-page max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-14 mt-10">

          {/* ── Main content ── */}
          <div className="min-w-0">

            {/* Table of contents */}
            {toc.length > 0 && (
              <details className="mb-8 rounded-2xl border border-border bg-card p-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between text-left">
                  <span className="flex items-center gap-2 font-display font-semibold text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                    In this article
                  </span>
                </summary>
                <ol className="mt-4 space-y-2 pl-2">
                  {toc.map((item, i) => (
                    <li key={item.id} className="text-sm">
                      <a
                        href={`#${item.id}`}
                        className="flex items-start gap-2 text-muted-foreground hover:text-primary"
                      >
                        <span className="mt-0.5 shrink-0 text-xs text-primary font-semibold">{i + 1}.</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            {/* Article content */}
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
              {content}
            </div>

            {/* FAQs */}
            {faqs && faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6">Frequently Asked Questions</h2>
                <FAQ items={faqs} />
              </div>
            )}

            {/* Author bio */}
            <div className="mt-12 rounded-2xl border border-border bg-card p-6" itemScope itemType="https://schema.org/Organization">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-display font-bold text-lg">
                  {author.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground" itemProp="name">{author.name}</p>
                  <p className="text-xs text-primary mb-2">{author.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" itemProp="description">{author.bio}</p>
                  <Link href="/editorial-policy" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
                    Our editorial standards →
                  </Link>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6">Related Articles</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-sm"
                    >
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary leading-snug">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Read more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related services */}
            {relatedServices && relatedServices.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Explore your options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <LeadForm />

            {/* Trust block */}
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground text-sm">About this content</p>
              <p>This article is for educational purposes only and does not constitute financial, legal, or tax advice.</p>
              <Link href="/editorial-policy" className="text-xs text-primary hover:underline">
                View our editorial policy →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
