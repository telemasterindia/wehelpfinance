import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Bot,
  FileCheck,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { EDITORIAL_TEAM } from "@/lib/authorConfig";
import { breadcrumbJsonLd } from "@/lib/schema";

const CANONICAL = "https://www.wehelpfinance.com/editorial-policy";

export const metadata: Metadata = {
  title: "Editorial Policy - How We Research & Review Content | WeHelpFinance",
  description:
    "How WeHelpFinance researches, writes, fact-checks, and reviews consumer finance content. Our sourcing standards, update policy, and AI usage disclosure.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Editorial Policy | WeHelpFinance",
    description:
      "Our standards for accurate, helpful, and current consumer finance content.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const sources = [
  "The Consumer Financial Protection Bureau (CFPB)",
  "The Federal Trade Commission (FTC), including the Telemarketing Sales Rule and FDCPA guidance",
  "The Internal Revenue Service (IRS) for tax relief content",
  "State-level statute of limitations and consumer protection statutes",
  "Industry standards from organizations such as the American Fair Credit Council (AFCC)",
];

export default function EditorialPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Editorial Policy", path: "/editorial-policy" },
            ]),
          ),
        }}
      />

      <section className="bg-linear-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-3xl py-12 lg:py-16">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span data-current="true">Editorial Policy</span>
          </nav>
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Editorial Standards
          </span>
          <h1 className="mt-4">How We Research and Review Our Content</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            WeHelpFinance publishes information about debt relief, personal
            loans, and tax relief that affects real financial decisions. Here is
            how we research, write, fact-check, and maintain it.
          </p>
        </div>
      </section>

      <section className="container-page max-w-3xl space-y-12 py-12">
        <PolicyBlock icon={BookOpen} title={EDITORIAL_TEAM.role}>
          <p>{EDITORIAL_TEAM.description}</p>
        </PolicyBlock>

        <PolicyBlock icon={FileCheck} title="Research Methodology">
          <p>
            Every page on WeHelpFinance is built from primary sources before
            secondary commentary. Where relevant, we reference and link to:
          </p>
          <ul className="mt-3 space-y-2">
            {sources.map((source) => (
              <li key={source} className="flex gap-2">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                {source}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            We do not rely solely on secondary summaries. Where a claim is
            specific, such as a fee percentage, time limit, or legal right, we
            trace it back to the originating source.
          </p>
        </PolicyBlock>

        <PolicyBlock icon={Scale} title="Fact-Checking & Review Process">
          <p>
            Before publication, every page is checked for accuracy, currency,
            and clarity.
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-2">
            <li>
              <strong className="text-foreground">Accuracy:</strong> factual
              claims are verified against current primary sources.
            </li>
            <li>
              <strong className="text-foreground">Currency:</strong> laws,
              regulations, and data points are checked against recent available
              information.
            </li>
            <li>
              <strong className="text-foreground">Clarity:</strong> financial
              hardship topics are written in plain language.
            </li>
          </ol>
        </PolicyBlock>

        <PolicyBlock icon={RefreshCw} title="Update Policy">
          <p>
            We review and update money pages, state pages, and city pages at
            minimum annually, and sooner when we become aware of a material
            regulatory change such as an FTC rule change, state statute
            amendment, or updated IRS program term.
          </p>
          <p className="mt-3">
            Material corrections are reviewed and updated promptly when
            warranted.
          </p>
        </PolicyBlock>

        <PolicyBlock icon={Bot} title="AI Usage Disclosure">
          <p>
            We use AI tools to assist with drafting and research efficiency.
            AI-assisted drafts are never published without human review against
            the methodology and fact-checking standards described here. We do
            not use AI to fabricate statistics, quotes, or claims.
          </p>
        </PolicyBlock>

        <PolicyBlock icon={AlertCircle} title="Corrections Policy">
          <p>
            If you believe something on WeHelpFinance is inaccurate or out of
            date, email{" "}
            <a
              href="mailto:help@wehelpfinance.com"
              className="text-primary underline"
            >
              help@wehelpfinance.com
            </a>{" "}
            with the page URL and specific concern.
          </p>
        </PolicyBlock>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-base font-semibold text-amber-900">
            Financial Content Disclaimer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            WeHelpFinance is a free matching service. We are not a lender, bank,
            law firm, credit repair organization, or tax advisory firm, and
            nothing on this site constitutes financial, legal, or tax advice.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Related Pages
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/about", label: "About WeHelpFinance" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PolicyBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <h2>{title}</h2>
      </div>
      <div className="space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
