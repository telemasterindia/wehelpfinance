import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WeHelpFinance — Debt Relief, Tax Relief & Personal Loan Help",
  description: "Making good money but still struggling with debt? WeHelpFinance connects you with trusted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.",
  alternates: { canonical: "/" },
  openGraph: { title: "WeHelpFinance — Debt Relief, Tax Relief & Personal Loan Help", description: "Making good money but still struggling with debt? WeHelpFinance connects you with trusted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.", url: "/", type: "website" },
};

import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/SiteLayout";
import { LeadForm } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { ShieldCheck, Lock, Clock, HeartHandshake, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const FAQS: FAQItem[] = [
  { q: "What does WeHelpFinance do?", a: "We're a free matching service that connects everyday Americans with vetted financial specialists for debt relief, tax relief, and personal loans. We listen to your situation, then introduce you to a provider who fits your needs." },
  { q: "Is WeHelpFinance a lender?", a: "No. WeHelpFinance is not a lender, bank, law firm, credit repair organization, or tax advisory firm. We connect you with independent providers who handle the actual services." },
  { q: "What is debt relief?", a: "Debt relief is an umbrella term for programs that help reduce, restructure, or pay off unsecured debt — including debt settlement, consolidation, and management plans. The right option depends on your income, balances, and goals." },
  { q: "How does debt settlement work?", a: "A specialist negotiates with your creditors to accept less than what you owe. You typically make deposits into a dedicated account until enough has accumulated to fund a negotiated settlement." },
  { q: "Will this affect my credit?", a: "Some programs can impact your credit during the process; others are credit-neutral. Your specialist will walk you through the trade-offs honestly so you can decide what's right for you." },
  { q: "How quickly will someone contact me?", a: "Most consultations are scheduled within one business day. You're never obligated to move forward — the call is free and judgment-free." },
];

export default function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/50 via-cream to-background" />
        <div className="container-page grid gap-10 pt-10 pb-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Trusted financial recovery, made human
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Debt Relief, Tax Relief &amp; Personal Loans — Free Help for Americans
            </h1>
            <h2 className="mt-4">
              Making good money but still <span className="italic text-primary">struggling with debt?</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              WeHelpFinance helps Americans explore debt relief, tax relief, personal loan, and
              financial recovery solutions through trusted specialists.
            </p>

            <ul className="mt-6 grid gap-2 text-[15px] sm:grid-cols-3">
              {["Free Consultation","No Obligation","Secure & Confidential"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/get-help" className="btn-cta">
                Get Free Help Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="btn-ghost-pill">How it works</a>
            </div>
          </div>

          <div className="relative">
            <Image
              src={heroImg}
              alt="A woman reviewing her finances at a sunlit table, looking relieved"
              loading="eager"
              fetchPriority="high"
              className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:right-6 sm:w-72">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">You're not alone.</p>
                  <p className="text-xs text-muted-foreground">Specialists are standing by — judgment-free.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2>Choose the path that fits your situation</h2>
          <p className="mt-3 text-muted-foreground">
            Every journey to financial relief starts with one honest conversation.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <CategoryCard
            tag="Debt Relief"
            title="Reduce financial stress and explore debt relief options."
            href="/debt-relief"
            cta="Explore Debt Relief"
          />
          <CategoryCard
            tag="Personal Loans"
            title="Compare personal loan options and debt consolidation opportunities."
            href="/personal-loans"
            cta="Explore Personal Loans"
          />
          <CategoryCard
            tag="Tax Relief"
            title="Get help with IRS debt, back taxes and tax resolution options."
            href="/tax-relief"
            cta="Explore Tax Relief"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-cream py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2>How it works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps. No pressure.</p>
          </div>
          <ol className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Tell us about your situation", d: "Answer a few quick questions in under 2 minutes." },
              { n: "02", t: "We review your options", d: "We match you with specialists suited to your needs." },
              { n: "03", t: "Speak with a specialist", d: "Have a free, no-obligation conversation when it's right for you." },
            ].map((s) => (
              <li key={s.n} className="surface-card">
                <div className="font-display text-3xl text-gold">{s.n}</div>
                <h3 className="mt-2 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="get-help" className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2>Start your free consultation</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Tell us a little about what you're facing. A specialist will reach out — when it works for you.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {[
                { Icon: Clock, t: "Fast response", d: "Most callbacks within one business day." },
                { Icon: Lock, t: "Secure & confidential", d: "Your information is never sold." },
                { Icon: HeartHandshake, t: "No obligation", d: "Decide on your own timeline — no pressure." },
                { Icon: ShieldCheck, t: "Experienced specialists", d: "Vetted partners with deep industry experience." },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>

      <FAQ items={FAQS} />

      <section className="container-page pb-24">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-primary-foreground">Take the first step today.</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            A short conversation can open the door to real options. It's free, confidential, and no obligation.
          </p>
          <Link href="/get-help" className="btn-gold mt-7 inline-flex">
            Get Free Help Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function CategoryCard({ tag, title, href, cta }: { tag: string; title: string; href: string; cta: string }) {
  return (
    <div className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <span className="inline-flex w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {tag}
      </span>
      <p className="mt-4 flex-1 font-display text-xl text-foreground">{title}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
        {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export { breadcrumbJsonLd };
