import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { TrustSignals } from "@/components/TrustSignals";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { CheckCircle2, ArrowRight, MapPin, Calculator } from "lucide-react";
import type { CityData } from "@/lib/cityData";
import { OTHER_CITIES } from "@/lib/cityData";

const INTERNAL_LINKS = {
  services: [
    { href: "/debt-settlement", label: "Debt Settlement" },
    { href: "/debt-consolidation", label: "Debt Consolidation" },
    { href: "/personal-loans", label: "Personal Loans" },
    { href: "/debt-relief", label: "Debt Relief Overview" },
    { href: "/tax-relief", label: "Tax Relief" },
  ],
  tools: [
    { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
    { href: "/debt-validation-letter", label: "Debt Validation Letter" },
  ],
  rights: [
    { href: "/fdcpa-rights", label: "FDCPA Rights" },
    { href: "/debt-validation", label: "Debt Validation" },
    { href: "/collection-agency-rights", label: "Collection Agency Rights" },
  ],
  comparisons: [
    { href: "/debt-settlement-vs-bankruptcy", label: "Settlement vs. Bankruptcy" },
    { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
    { href: "/debt-relief-vs-personal-loan", label: "Debt Relief vs. Personal Loan" },
  ],
};

export type CityPageProps = {
  city: CityData;
  faqs: FAQItem[];
  stateSOL: number;
  stateWageNote: string;
  stateHomesteadNote: string;
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function CityServicePage({
  city,
  faqs,
  stateSOL,
  stateWageNote,
  stateHomesteadNote,
}: CityPageProps) {
  const otherCities = OTHER_CITIES(city.slug).slice(0, 9);

  return (
    <article className="pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-6xl py-10 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/debt-settlement" className="hover:text-primary">Debt Settlement</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{city.city}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Debt Settlement — {city.city}, {city.stateAbbr}
              </span>

              <h1 className="mt-4">
                Debt Settlement in{" "}
                <span className="italic text-primary">{city.city}</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                {city.city} residents carry an average of {fmt(city.avgDebtLow)}–{fmt(city.avgDebtHigh)} in credit card debt per household. A vetted debt settlement specialist can negotiate with your creditors to accept significantly less than you owe.
              </p>

              <ul className="mt-7 space-y-3">
                {[
                  `Average ${city.city} debt settled for 40–60% of original balance`,
                  `Programs for $10,000+ in credit card, medical, or personal loan debt`,
                  `${city.stateAbbr} consumer protections: ${stateSOL}-year statute of limitations`,
                  "Free, confidential consultation — no obligation to enroll",
                  "Specialists with experience in the " + city.metroArea + " market",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Calculator CTA */}
              <Link
                href="/debt-settlement-calculator"
                className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Estimate your savings with our calculator
              </Link>
            </div>

            {/* Lead form */}
            <div id="get-help" className="lg:sticky lg:top-24">
              <LeadForm defaultCategory="debt-relief" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="container-page max-w-5xl py-8">
        <TrustSignals variant="compact" />
      </section>

      {/* Main content */}
      <section className="container-page max-w-4xl py-8">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">

          <h2>{city.city} Debt Landscape</h2>
          <p>{city.debtContext}</p>
          <p>{city.localChallenges}</p>

          <h2>The {city.city} Economy and Debt Stress</h2>
          <p>{city.economyNote}</p>

          <h2>{city.stateAbbr} Consumer Protections You Should Know</h2>
          <h3>Statute of Limitations</h3>
          <p>{city.state} has a {stateSOL}-year statute of limitations on credit card debt. After {stateSOL} years from the date of last payment or default, creditors cannot successfully sue you to collect the debt. For {city.city} residents dealing with older collection accounts, verifying the date of last activity before making any payment or acknowledgment is critical — a payment can restart this clock.</p>

          <h3>Wage Garnishment</h3>
          <p>{stateWageNote}</p>

          <h3>Homestead Exemption</h3>
          <p>{stateHomesteadNote}</p>

          <h2>How Debt Settlement Works for {city.city} Residents</h2>
          <p>Debt settlement is a negotiation process where a specialist works with your creditors to accept a lump-sum payment for less than the full balance. The typical process for {city.city} residents:</p>
          <ol>
            <li><strong>Free consultation:</strong> A specialist reviews your specific accounts, income, and financial situation to determine whether settlement is appropriate and what results are realistic.</li>
            <li><strong>Program enrollment:</strong> You enroll qualifying unsecured debts — typically credit cards, personal loans, and medical bills. Secured debts like mortgages and car loans are not included.</li>
            <li><strong>Monthly deposits:</strong> Instead of making minimum payments, you deposit money into a dedicated savings account. This builds the settlement fund.</li>
            <li><strong>Negotiation:</strong> As the account grows, your specialist negotiates with each creditor. When agreement is reached, funds are used to pay the settlement.</li>
            <li><strong>Resolution:</strong> Each settled account is resolved, typically for 40–60% of the original balance. The remaining balance is forgiven.</li>
          </ol>
          <p>The full program typically runs 24–48 months depending on the total enrolled debt and how quickly the settlement fund builds.</p>

          <h2>Is Debt Settlement Right for You in {city.city}?</h2>
          <p>Debt settlement is most appropriate for {city.city} residents who:</p>
          <ul>
            <li>Have $10,000 or more in unsecured debt (credit cards, personal loans, medical bills)</li>
            <li>Are experiencing genuine financial hardship — income has dropped, expenses have increased, or the full balance is realistically unaffordable</li>
            <li>Are 60+ days delinquent or approaching delinquency on accounts</li>
            <li>Have a monthly income sufficient to make program deposits (approximately 1.5–2% of enrolled debt per month)</li>
          </ul>
          <p>If your accounts are current and your credit score is above 660, a personal loan for debt consolidation may protect your credit and provide similar financial relief without the delinquency impact of settlement. Use our <Link href="/debt-settlement-calculator">debt settlement calculator</Link> to see which option makes more financial sense for your situation.</p>

          <h2>Debt Settlement Regulation in {city.state}</h2>
          <p>{city.settlementNote}</p>
          <p>When evaluating debt settlement companies for your {city.city} situation, verify that the company is properly licensed to operate in {city.state}, charges fees only after successful settlements (per the FTC's advance fee ban), and provides a written agreement before beginning work.</p>

        </div>
      </section>

      {/* FAQ */}
      <section className="container-page max-w-4xl pb-10">
        <h2 className="mb-6">Frequently Asked Questions — Debt Settlement in {city.city}</h2>
        <FAQ items={faqs} />
      </section>

      {/* Internal links */}
      <section className="container-page max-w-4xl pb-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Services</h3>
            <ul className="space-y-2">
              {INTERNAL_LINKS.services.map((l) => (
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
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</h3>
            <ul className="space-y-2">
              {INTERNAL_LINKS.tools.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Rights</h3>
            <ul className="space-y-2">
              {INTERNAL_LINKS.rights.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare Options</h3>
            <ul className="space-y-2">
              {INTERNAL_LINKS.comparisons.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* State page link */}
            <div className="mt-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{city.state} Resources</h3>
              <Link href={`/debt-relief/${city.statePageSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                Debt Relief in {city.state}
              </Link>
              <Link href={`/personal-loans/${city.statePageSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                Personal Loans in {city.state}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other cities */}
      <section className="container-page max-w-4xl pb-10">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Debt settlement in other cities
        </h3>
        <div className="flex flex-wrap gap-2">
          {otherCities.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby areas */}
      {city.nearbyAreas.length > 0 && (
        <section className="container-page max-w-4xl pb-10">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Also serving nearby
          </h3>
          <p className="text-sm text-muted-foreground">
            {city.nearbyAreas.join(" · ")}
          </p>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="container-page max-w-4xl pb-8">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-primary-foreground">
            Ready to explore your options in {city.city}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            A free, confidential consultation with a specialist can show you exactly what settlement could save you — no obligation to enroll.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#get-help" className="btn-gold inline-flex min-h-[48px]">
              Get Free Help Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/debt-settlement-calculator" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              <Calculator className="h-4 w-4" />
              Use the Calculator First
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
