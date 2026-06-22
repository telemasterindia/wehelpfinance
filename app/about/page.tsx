import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WeHelpFinance — Who We Are",
  description: "WeHelpFinance connects Americans with vetted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About WeHelpFinance — Who We Are", description: "WeHelpFinance connects Americans with vetted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.", url: "/about", type: "website" },
};

import { SiteLayout } from "@/components/SiteLayout";
import { HeartHandshake, ShieldCheck, Users, Sparkles } from "lucide-react";

export default function About() {
  return (
    <SiteLayout>
      <section className="container-page pt-14 pb-10">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">About</span>
          <h1 className="mt-4">Real help, without the runaround.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            WeHelpFinance was founded on a simple idea: people facing financial stress deserve calm,
            honest guidance — not pressure or judgment. We connect everyday Americans with vetted
            specialists who can walk them through real options for debt relief, tax relief, and
            personal loans.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {[
            { Icon: HeartHandshake, t: "Empathy first", d: "We've all been overwhelmed by money at some point. Every conversation starts with listening." },
            { Icon: ShieldCheck, t: "Vetted specialists", d: "We work with established, experienced partners — not fly-by-night operators." },
            { Icon: Users, t: "You're in control", d: "Free consultations, no obligation. You decide what's right for your situation." },
            { Icon: Sparkles, t: "Plain-English guidance", d: "We translate jargon, weigh trade-offs honestly, and respect your time." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="surface-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-page mx-auto max-w-3xl">
          <h2>What we are — and what we're not</h2>
          <p className="mt-4 text-muted-foreground">
            WeHelpFinance is a referral and matching service. We're not a lender, bank, law firm,
            credit repair organization, or tax advisory firm. The specialists you connect with are
            independent providers who deliver the services directly. Results vary by individual
            circumstances, and we encourage you to ask every provider questions until you feel
            confident.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl">
          <h2>Who's behind WeHelpFinance</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              WeHelpFinance is operated by Telemaster India (TMI), a financial services company
              founded in 2005 with over 21 years of experience connecting American consumers with
              debt relief and financial recovery specialists.
            </p>
            <p>
              Our founder, Amit Chadha, has spent two decades in the US financial services industry
              working directly with consumers navigating debt, tax problems, and credit challenges.
            </p>
            <address className="not-italic text-foreground">
              Business address: 539 W. Commerce St #4251, Dallas TX 75208<br />
              Phone: <a href="tel:+17183604806" className="text-primary hover:underline">(718) 360-4806</a><br />
              Email: <a href="mailto:amit@wehelpfinance.com" className="text-primary hover:underline">amit@wehelpfinance.com</a>
            </address>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
