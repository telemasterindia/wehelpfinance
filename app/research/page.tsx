import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/schema";
import {
  RESEARCH_REPORTS,
  CATEGORY_LABELS,
  type ResearchCategory,
} from "@/lib/researchData";

export const metadata: Metadata = {
  title:
    "Research Center — Consumer Debt & Financial Hardship Reports | WeHelpFinance",
  description:
    "Original research on consumer debt trends, credit card APRs, household debt, inflation impact, and financial hardship. Data-driven reports for consumers and media.",
  alternates: { canonical: "https://www.wehelpfinance.com/research" },
  openGraph: {
    title: "Research Center | WeHelpFinance",
    description:
      "Original research reports on consumer debt, credit card statistics, inflation impact, and financial hardship trends in America.",
    url: "https://www.wehelpfinance.com/research",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Center | WeHelpFinance",
    description:
      "Consumer debt research, credit card statistics, and financial hardship data.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const CATEGORIES: ResearchCategory[] = [
  "credit-cards",
  "consumer-debt",
  "employment",
  "inflation",
  "interest-rates",
  "economic-trends",
];

export default function ResearchIndex() {
  const featured = RESEARCH_REPORTS.filter((r) => r.featured);
  const all = RESEARCH_REPORTS;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              {
                name: "Research Center",
                path: "https://www.wehelpfinance.com/research",
              },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-14 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Original Research
          </div>

          <h1>WeHelpFinance Research Center</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Data-driven research on consumer debt, credit card trends, inflation
            impact, and financial hardship facing American households. Published
            for consumers, journalists, and policymakers.
          </p>

          {/* Media note */}
          <div className="mt-6 inline-flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
            <BookOpen
              className="h-5 w-5 shrink-0 text-primary mt-0.5"
              aria-hidden="true"
            />
            <div>
              <span className="font-semibold text-foreground">
                Media &amp; Citation:
              </span>
              <span className="text-muted-foreground">
                {" "}
                Research from this center may be cited freely with attribution
                to WeHelpFinance. Contact us at{" "}
              </span>
              <a
                href="mailto:help@wehelpfinance.com"
                className="text-primary hover:underline"
              >
                help@wehelpfinance.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page max-w-5xl py-12 pb-24">
        {/* Category filter row */}
        <div className="mb-10 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            All Research
          </span>
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors"
            >
              {CATEGORY_LABELS[c]}
            </span>
          ))}
        </div>

        {/* Featured reports */}
        <section className="mb-14">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Featured Reports
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <ReportCard key={r.slug} report={r} featured />
            ))}
          </div>
        </section>

        {/* All reports */}
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            All Research Reports
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {all.map((r) => (
              <ReportCard key={r.slug} report={r} />
            ))}
          </div>
        </section>

        {/* About section */}
        <section className="mt-14 rounded-3xl border border-border bg-card p-8">
          <h2 className="text-xl">About This Research</h2>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            The WeHelpFinance Research Center publishes original analysis of
            consumer debt trends, credit market conditions, and financial
            hardship data affecting American households. Our research team draws
            on Federal Reserve data, CFPB reports, Bureau of Labor Statistics
            publications, and financial industry research to produce accessible,
            data-driven reports.
          </p>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            Reports are published for educational purposes and are designed to
            help consumers, journalists, policy researchers, and financial
            professionals better understand the consumer debt landscape.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              About WeHelpFinance{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Editorial Policy{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function ReportCard({
  report,
  featured = false,
}: {
  report: (typeof RESEARCH_REPORTS)[0];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/research/${report.slug}`}
      className={`group flex flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-md ${featured ? "lg:p-7" : ""}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          {CATEGORY_LABELS[report.category]}
        </span>
        {report.featured && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Featured
          </span>
        )}
      </div>

      <h3
        className={`font-display font-semibold text-foreground group-hover:text-primary leading-snug ${featured ? "text-lg" : "text-base"}`}
      >
        {report.title}
      </h3>
      <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {report.excerpt}
      </p>

      {/* Key findings preview */}
      {report.keyFindings.length > 0 && (
        <div className="mt-4 rounded-xl bg-muted/50 p-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">
            Key finding:
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {report.keyFindings[0]}
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {new Date(report.publishedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1 font-medium text-primary">
          Read report{" "}
          <ArrowRight
            className="h-3.5 w-3.5 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
