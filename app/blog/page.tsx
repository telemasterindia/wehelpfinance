import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Financial Education Blog — Debt Relief, Tax & Loans | WeHelpFinance",
  description:
    "Research-backed articles on debt relief, credit card debt, inflation, layoffs, and tax problems. Written to help Americans understand their financial options.",
  alternates: { canonical: "https://www.wehelpfinance.com/blog" },
  openGraph: {
    title: "Financial Education Blog | WeHelpFinance",
    description:
      "Research-backed articles to help Americans understand debt relief, tax relief, and personal loan options.",
    url: "https://www.wehelpfinance.com/blog",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Education Blog | WeHelpFinance",
    description:
      "Research-backed articles on debt, tax relief, and personal finance.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const ARTICLES = [
  {
    slug: "what-happens-if-i-stop-paying-my-credit-cards",
    title: "What Happens If I Stop Paying My Credit Cards?",
    excerpt:
      "Before you make the decision to stop paying, understand exactly what the timeline looks like — from the first missed payment to a potential lawsuit — and what your options are at every stage.",
    category: "Debt Relief",
    date: "2026-05-08",
    readingTime: 9,
    featured: true,
  },
  {
    slug: "minimum-payment-trap",
    title: "The Minimum Payment Trap: Why Your Balance Never Goes Down",
    excerpt:
      "If you've been making minimum payments for years and your balance barely moves, you're not doing it wrong — the math is just designed to keep you paying interest indefinitely.",
    category: "Debt Relief",
    date: "2026-05-04",
    readingTime: 8,
    featured: true,
  },
  {
    slug: "credit-card-apr-all-time-high",
    title: "Credit Card APR Is at an All-Time High — Here's What To Do",
    excerpt:
      "Average credit card interest rates hit record highs in 2025–2026. Here's what that means for your balance and what practical steps you can take right now.",
    category: "Research",
    date: "2026-05-13",
    readingTime: 7,
    featured: false,
  },
  {
    slug: "laid-off-drowning-in-debt",
    title: "Laid Off and Drowning in Debt: Your Options in 2026",
    excerpt:
      "Losing your income while carrying credit card debt is one of the most stressful financial situations Americans face right now. Here's a clear-headed guide to your options.",
    category: "Research",
    date: "2026-06-18",
    readingTime: 9,
    featured: false,
  },
  {
    slug: "inflation-debt-crisis-middle-america",
    title: "How Inflation Created a Debt Crisis for Middle America",
    excerpt:
      "Groceries, rent, insurance, and utilities have all risen faster than wages. For millions of middle-income Americans, credit cards became the gap-filler — and the debt accumulated fast.",
    category: "Research",
    date: "2026-06-10",
    readingTime: 8,
    featured: false,
  },
  {
    slug: "government-credit-card-forgiveness-real-or-myth",
    title: "Government Credit Card Forgiveness: Real or Myth?",
    excerpt:
      "Millions of Americans search for government credit card forgiveness programs every month. Here's the truth about what exists, what doesn't, and what legitimate options are actually available.",
    category: "Debt Relief",
    date: "2026-05-26",
    readingTime: 7,
    featured: false,
  },
  {
    slug: "subscription-debt-trap",
    title:
      "The Subscription Debt Trap: How Digital Expenses Are Maxing Out America",
    excerpt:
      "The average American pays for over a dozen subscription services. Combined with rising costs elsewhere, this hidden drain on income is pushing more households into credit card debt.",
    category: "Research",
    date: "2026-05-19",
    readingTime: 7,
    featured: false,
  },
  {
    slug: "is-debt-settlement-a-sin",
    title: "Is Debt Settlement a Sin? What No One Tells You",
    excerpt:
      "For many Americans — particularly those with religious values — the idea of paying less than what you owe feels morally wrong. This article addresses that concern honestly.",
    category: "Debt Relief",
    date: "2026-06-02",
    readingTime: 8,
    featured: false,
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://www.wehelpfinance.com/" },
  { name: "Blog", path: "https://www.wehelpfinance.com/blog" },
];

export default function BlogIndex() {
  const featured = ARTICLES.filter((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-14 lg:py-20">
          <h1>Financial Education &amp; Research</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Research-backed articles on debt relief, credit card debt,
            inflation, layoffs, and tax problems — written to help Americans
            understand their financial options without pressure or jargon.
          </p>
        </div>
      </section>

      <div className="container-page max-w-5xl py-12">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Featured articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((a) => (
                <ArticleCard key={a.slug} article={a} featured />
              ))}
            </div>
          </section>
        )}

        {/* All articles */}
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            All articles
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* Categories nav */}
        <section className="mt-14 rounded-3xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl">Looking for something specific?</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Explore by financial situation
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { href: "/debt-relief", label: "Debt Relief" },
              { href: "/debt-settlement", label: "Debt Settlement" },
              { href: "/debt-consolidation", label: "Debt Consolidation" },
              { href: "/personal-loans", label: "Personal Loans" },
              { href: "/tax-relief", label: "Tax Relief" },
              { href: "/irs-debt-relief", label: "IRS Debt Relief" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: (typeof ARTICLES)[0];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className={`group flex flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-md ${
        featured ? "lg:p-8" : ""
      }`}
    >
      <span className="inline-flex w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {article.category}
      </span>
      <h3
        className={`mt-3 font-display font-semibold text-foreground group-hover:text-primary leading-snug ${featured ? "text-xl" : "text-base"}`}
      >
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {new Date(article.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {article.readingTime} min
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
        Read article{" "}
        <ArrowRight
          className="h-3.5 w-3.5 transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
