import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import {
  Calendar, Clock, ArrowRight, BookOpen,
  TrendingUp, AlertCircle, User,
} from "lucide-react";
import {
  RESEARCH_INTERNAL_LINKS,
  CATEGORY_LABELS,
  type ResearchReport as ReportMeta,
  getRelatedReports,
} from "@/lib/researchData";
import type { ReactNode } from "react";

export type Source = {
  name: string;
  url?: string;
  accessed?: string;
};

export type ResearchReportProps = {
  meta: ReportMeta;
  executiveSummary: ReactNode;
  keyFindings: string[];
  content: ReactNode;
  faqs: FAQItem[];
  sources: Source[];
  relatedBlogPosts?: { href: string; title: string }[];
};

const RESEARCH_AUTHOR = {
  name: "WeHelpFinance Research Team",
  role: "Financial Research & Analysis",
  bio: "The WeHelpFinance Research Team analyzes consumer debt, credit trends, inflation impacts, and financial hardship data to help consumers better understand the financial challenges facing American households. We draw on Federal Reserve data, CFPB reports, Bureau of Labor Statistics publications, and academic research.",
};

export function ResearchReport({
  meta,
  executiveSummary,
  keyFindings,
  content,
  faqs,
  sources,
  relatedBlogPosts = [],
}: ResearchReportProps) {
  const relatedReports = getRelatedReports(meta.slug);

  return (
    <article className="pb-24" itemScope itemType="https://schema.org/Article">
      {/* Schema microdata */}
      <meta itemProp="headline" content={meta.title} />
      <meta itemProp="description" content={meta.excerpt} />
      <meta itemProp="datePublished" content={meta.publishedDate} />
      {meta.updatedDate && <meta itemProp="dateModified" content={meta.updatedDate} />}
      <meta itemProp="url" content={`https://www.wehelpfinance.com/research/${meta.slug}`} />
      <div itemProp="author" itemScope itemType="https://schema.org/Organization" className="hidden">
        <meta itemProp="name" content={RESEARCH_AUTHOR.name} />
      </div>
      <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
        <meta itemProp="name" content="WeHelpFinance" />
        <meta itemProp="url" content="https://www.wehelpfinance.com" />
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {CATEGORY_LABELS[meta.category]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Research Report
            </span>
          </div>

          <h1 className="max-w-3xl" itemProp="name">{meta.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.excerpt}</p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Published {formatDate(meta.publishedDate)}
            </span>
            {meta.updatedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Updated {formatDate(meta.updatedDate)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {Math.ceil(meta.wordCount / 250)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {meta.wordCount.toLocaleString()} words
            </span>
          </div>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <User className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{RESEARCH_AUTHOR.name}</p>
              <p className="text-xs text-muted-foreground">{RESEARCH_AUTHOR.role} • WeHelpFinance</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body grid ── */}
      <div className="container-page max-w-6xl mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-14">

          {/* Main content */}
          <div className="min-w-0 space-y-0">

            {/* Executive Summary */}
            <div className="mb-10 rounded-2xl border-l-4 border-primary bg-primary-soft/30 p-6">
              <h2 className="mt-0 text-lg font-display font-semibold text-foreground">Executive Summary</h2>
              <div className="mt-3 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                {executiveSummary}
              </div>
            </div>

            {/* Key Findings */}
            <div className="mb-10 rounded-2xl border border-border bg-card p-6">
              <h2 className="mt-0 flex items-center gap-2 text-lg font-display font-semibold text-foreground">
                <AlertCircle className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                Key Findings
              </h2>
              <ul className="mt-4 space-y-3">
                {keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main article content */}
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
              {content}
            </div>

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6">Frequently Asked Questions</h2>
                <FAQ items={faqs} />
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
              <div className="mt-12 rounded-2xl border border-border bg-card p-6">
                <h2 className="mt-0 text-base font-display font-semibold text-foreground">Sources & Methodology</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  This report draws on publicly available data from government agencies, Federal Reserve publications, and financial industry research. All statistics represent best available estimates at the time of publication.
                </p>
                <ul className="mt-4 space-y-2">
                  {sources.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 font-semibold text-foreground">[{i + 1}]</span>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">
                          {s.name}
                        </a>
                      ) : (
                        <span>{s.name}</span>
                      )}
                      {s.accessed && <span className="text-muted-foreground/60"> (accessed {s.accessed})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author bio */}
            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <User className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{RESEARCH_AUTHOR.name}</p>
                  <p className="text-xs text-primary mb-2">{RESEARCH_AUTHOR.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{RESEARCH_AUTHOR.bio}</p>
                </div>
              </div>
            </div>

            {/* Related blog posts */}
            {relatedBlogPosts.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Articles</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedBlogPosts.map((p) => (
                    <Link key={p.href} href={p.href} className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary leading-snug">{p.title}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                        Read <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related research */}
            {relatedReports.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Research</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedReports.map((r) => (
                    <Link key={r.slug} href={`/research/${r.slug}`} className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary">
                      <span className="text-xs text-primary font-medium">{CATEGORY_LABELS[r.category]}</span>
                      <p className="mt-1 text-sm font-medium text-foreground group-hover:text-primary leading-snug">{r.title}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                        Read report <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Internal links */}
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Get Help</h3>
                <ul className="space-y-2">
                  {RESEARCH_INTERNAL_LINKS.services.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Know Your Rights</h3>
                <ul className="space-y-2">
                  {RESEARCH_INTERNAL_LINKS.consumerRights.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Options</h3>
                <ul className="space-y-2">
                  {RESEARCH_INTERNAL_LINKS.comparisons.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <LeadForm />

            <div className="rounded-2xl border border-border bg-card p-5 text-sm space-y-2">
              <p className="font-semibold text-foreground">About this report</p>
              <p className="text-xs text-muted-foreground">
                This research report is produced by the WeHelpFinance Research Team for educational purposes. It does not constitute financial, legal, or investment advice.
              </p>
              <div className="pt-2 space-y-1">
                {meta.tags.map((tag) => (
                  <span key={tag} className="mr-1.5 inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="font-display font-semibold">Concerned about your debt?</p>
              <p className="mt-2 text-sm text-primary-foreground/85">
                A free consultation shows you what options are available for your situation.
              </p>
              <Link href="/get-help" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-primary transition hover:bg-white/90">
                Get Free Help <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
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

