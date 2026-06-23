import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/schema";
import { ShieldCheck, Users, BookOpen, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "About WeHelpFinance — Who We Are & How We Help | WeHelpFinance",
  description: "WeHelpFinance is a consumer financial education and connection platform operated by Telemaster India (TMI). We connect Americans with vetted specialists for debt relief, tax relief, and personal loans.",
  alternates: { canonical: "https://wehelpfinance.com/about" },
  openGraph: {
    title: "About WeHelpFinance | WeHelpFinance",
    description: "Learn who we are, how we help Americans navigate financial hardship, and our commitment to consumer-first transparency.",
    url: "https://wehelpfinance.com/about",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://wehelpfinance.com/" },
        { name: "About", path: "https://wehelpfinance.com/about" },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WeHelpFinance",
        "url": "https://wehelpfinance.com",
        "description": "Consumer financial education and connection platform operated by Telemaster India (TMI)",
        "foundingDate": "2005",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "539 W. Commerce St #4251",
          "addressLocality": "Dallas",
          "addressRegion": "TX",
          "postalCode": "75208",
          "addressCountry": "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-718-360-4806",
          "contactType": "customer service"
        },
        "founder": { "@type": "Person", "name": "Amit Chadha" }
      }) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-14 lg:py-20">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">About</span>
          </nav>
          <h1>We exist because financial hardship deserves a human response.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            WeHelpFinance is a consumer financial education and connection platform. We help Americans
            understand their options when dealing with credit card debt, tax problems, and loan needs —
            and we connect them with vetted specialists who can help.
          </p>
        </div>
      </section>

      <div className="container-page max-w-4xl py-12 pb-24 space-y-16">

        {/* Who We Are */}
        <section>
          <h2>Who We Are</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            WeHelpFinance is operated by Telemaster India (TMI), a financial services company founded
            in 2005 with over 21 years of experience in the US consumer financial services market.
            Our team has spent two decades working directly with Americans navigating debt, tax
            challenges, and credit problems.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We are not a lender, a law firm, a debt settlement company, or a tax advisory firm. We are
            a platform — a connection point between people who need help and the specialists who are
            qualified to provide it. We vet the specialists in our network, and we stand behind the
            quality of the connections we make.
          </p>
        </section>

        {/* Why We Created WeHelpFinance */}
        <section>
          <h2>Why We Created WeHelpFinance</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The financial hardship industry has a trust problem. Americans in debt are often approached
            by predatory services, misleading advertising, and high-pressure sales tactics at the
            moment when they are most vulnerable.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We built WeHelpFinance to be a different kind of entry point into the financial recovery
            process. One that starts with education — helping people understand what is actually
            happening with their debt and what legitimate options exist — before making any
            commercial connection. One that is transparent about what we are, what we are not, and
            how the process works.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The Americans who come to WeHelpFinance are dealing with real stress. Credit card debt
            from inflation and layoffs. IRS notices that arrive without warning. Loan rejections when
            an emergency hits. They deserve straightforward information and a connection to people who
            can genuinely help.
          </p>
        </section>

        {/* Our Mission */}
        <section>
          <h2>Our Mission</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our mission is to help every American who comes to WeHelpFinance understand their financial
            situation more clearly and take an informed step toward improving it — whether that step is
            a free consultation with a debt specialist, a better understanding of their tax options, or
            simply the knowledge that qualified help is available.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { icon: BookOpen, title: "Education first", desc: "We explain the options before making any connection. An informed consumer makes better decisions." },
              { icon: ShieldCheck, title: "Vetted specialists", desc: "We screen the partners in our network. Not every company that wants to work with us does." },
              { icon: Users, title: "No pressure", desc: "There is no obligation to take any step after a consultation. We believe in letting people decide on their own timeline." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How We Help */}
        <section>
          <h2>How We Help Consumers</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            WeHelpFinance operates as a matching and referral platform across three primary areas:
          </p>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">Debt Relief:</strong> We connect consumers with vetted debt settlement specialists and credit counseling agencies for unsecured debt including credit cards, medical bills, and personal loans.</li>
            <li><strong className="text-foreground">Tax Relief:</strong> We connect taxpayers with vetted tax resolution specialists, enrolled agents, and tax firms for IRS debt, back taxes, wage garnishments, and payment plan arrangements.</li>
            <li><strong className="text-foreground">Personal Loans:</strong> We connect consumers with lending partners for debt consolidation loans, emergency personal loans, and other personal lending needs across a range of credit profiles.</li>
          </ul>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            In all cases, the initial consultation is free. There is no obligation to work with any specialist we introduce. Our service costs nothing to the consumer.
          </p>
        </section>

        {/* Editorial Standards */}
        <section>
          <h2>Our Editorial Standards</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The educational content on WeHelpFinance is created and reviewed to be accurate,
            consumer-appropriate, and free of misleading language. We do not describe private
            commercial services as "government programs." We do not guarantee outcomes. We present
            trade-offs honestly, including the credit implications of debt relief programs.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our content is for educational purposes and does not constitute financial, legal, or tax
            advice. We encourage consumers to consult qualified professionals for advice specific to
            their situation.
          </p>
          <Link href="/editorial-policy" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            Read our full editorial policy →
          </Link>
        </section>

        {/* Commitment to Transparency */}
        <section>
          <h2>Our Commitment to Transparency</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We will always be clear about what WeHelpFinance is and is not. We are not a nonprofit.
            We are a for-profit platform that earns revenue when consumers connect with and enroll in
            services through our network. This business model is disclosed clearly on our website and
            in our terms of service.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            This commercial model does not change our commitment to consumer-first education. We
            believe that an informed consumer who understands their options is more likely to make
            a decision that genuinely serves them — and that this is better for everyone, including
            the specialists in our network.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-3xl border border-border bg-card p-8" itemScope itemType="https://schema.org/Organization">
          <h2 className="mt-0">Dallas Office</h2>
          <meta itemProp="name" content="WeHelpFinance" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">Mailing Address</p>
              <address className="not-italic" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="streetAddress">539 W. Commerce St #4251</span><br />
                <span itemProp="addressLocality">Dallas</span>, <span itemProp="addressRegion">TX</span> <span itemProp="postalCode">75208</span>
              </address>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Contact</p>
              <p><a href="tel:+17183604806" className="hover:text-primary" itemProp="telephone">(718) 360-4806</a></p>
              <p><a href="mailto:amit@wehelpfinance.com" className="hover:text-primary" itemProp="email">amit@wehelpfinance.com</a></p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="btn-cta">Get in touch</Link>
            <Link href="/get-help" className="btn-ghost-pill">Get free help</Link>
          </div>
        </section>

      </div>
    </>
  );
}
