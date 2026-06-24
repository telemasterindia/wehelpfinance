import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/schema";
import { SiteLayout } from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Editorial Policy — How We Create and Review Content | WeHelpFinance",
  description: "WeHelpFinance's editorial standards, fact-checking process, content review guidelines, and corrections policy. We are committed to accurate, independent, consumer-first financial education.",
  alternates: { canonical: "https://wehelpfinance.com/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | WeHelpFinance",
    description: "Our commitment to accurate, independent, consumer-first financial education content.",
    url: "https://wehelpfinance.com/editorial-policy",
    type: "website",
  },
};

export default function Page() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://wehelpfinance.com/" },
        { name: "Editorial Policy", path: "https://wehelpfinance.com/editorial-policy" },
      ])) }} />

      <div className="bg-gradient-to-b from-primary-soft/30 to-background">
        <div className="container-page max-w-3xl py-14 lg:py-20">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Editorial Policy</span>
          </nav>
          <h1>Editorial Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            WeHelpFinance is committed to providing accurate, transparent, and consumer-first financial education content.
            This page explains how our content is created, reviewed, and maintained.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 24, 2026</p>
        </div>
      </div>

      <div className="container-page max-w-3xl py-12 pb-24">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-p:text-foreground/90">

          <h2>Our Mission</h2>
          <p>WeHelpFinance exists to help Americans facing financial hardship — debt, tax problems, and credit challenges — understand their options clearly and without pressure. Our editorial mission is to provide educational content that is accurate, unbiased, and genuinely useful to the people who need it most.</p>
          <p>We are a consumer connection platform. Our business model involves connecting consumers with vetted financial specialists. This means we have a commercial interest in the topic areas we write about. We believe transparency about this relationship is essential to maintaining the trust of our readers.</p>

          <h2>Content Standards</h2>
          <p>All content published on WeHelpFinance is held to the following standards:</p>
          <ul>
            <li><strong>Accuracy:</strong> Claims and statistics must be sourced from credible, verifiable sources including Federal Reserve data, CFPB reports, IRS publications, and peer-reviewed research.</li>
            <li><strong>Consumer-first perspective:</strong> Content is written to help consumers understand their situation and options — not to push them toward any particular product or service.</li>
            <li><strong>Transparency about limitations:</strong> Content on WeHelpFinance is educational. It is not a substitute for advice from a licensed financial advisor, attorney, or tax professional. We disclose this clearly.</li>
            <li><strong>No misleading language:</strong> We do not use terms like "government forgiveness" to describe private debt relief services. We do not imply guarantees of outcomes.</li>
            <li><strong>Balanced presentation:</strong> Where legitimate differences of opinion or outcome exist, we present them. We do not present only favorable information about the services in our network.</li>
          </ul>

          <h2>Editorial Independence</h2>
          <p>Editorial content on WeHelpFinance is created independently from our business development and partner relations functions. The existence of a commercial relationship with a debt relief company, lender, or tax firm does not influence our editorial coverage or recommendations.</p>
          <p>We do not accept payment for editorial placement or positive coverage. Companies that work with us through our referral network do not receive favorable editorial treatment in exchange for that relationship.</p>

          <h2>Fact-Checking Process</h2>
          <p>Before publication, factual claims in our content are verified against primary sources. Our standard process includes:</p>
          <ul>
            <li>Identifying the original source for statistics and data points (Federal Reserve, CFPB, IRS, academic research)</li>
            <li>Verifying that quoted statistics are accurate to the source and not misrepresented out of context</li>
            <li>Confirming that descriptions of legal processes (bankruptcy, IRS programs, debt settlement) are accurate as of the publication date</li>
            <li>Flagging content that describes dynamic situations (interest rates, regulatory programs) for timely review and update</li>
          </ul>

          <h2>Content Review Process</h2>
          <p>Content is reviewed for accuracy, consumer-appropriate tone, and compliance with our editorial standards before publication. Content describing specific IRS programs, legal rights, or regulatory frameworks is reviewed with particular care given how quickly these areas can change.</p>

          <h2>Content Updates</h2>
          <p>Financial information can change quickly. Interest rate data, IRS program details, and regulatory frameworks are subject to change. We are committed to reviewing and updating time-sensitive content when material changes occur. Articles that have been substantively updated will display a "Last updated" date alongside the original publication date.</p>

          <h2>Corrections Policy</h2>
          <p>If we publish content that contains a factual error, we correct it promptly and transparently. Corrections are noted within the affected article. For significant corrections that materially change the substance of an article, we will note the nature of the correction.</p>
          <p>If you believe you have found an error in our content, please contact us at <a href="mailto:editorial@wehelpfinance.com">editorial@wehelpfinance.com</a>. We take correction requests seriously and will respond within 5 business days.</p>

          <h2>Contact the Editorial Team</h2>
          <p>For questions about our editorial standards, to report an error, or to provide feedback on our content:</p>
          <ul>
            <li>Email: <a href="mailto:editorial@wehelpfinance.com">editorial@wehelpfinance.com</a></li>
            <li>Mailing address: WeHelpFinance, 539 W. Commerce St #4251, Dallas TX 75208</li>
          </ul>
          <p>We welcome feedback from readers, financial professionals, and consumer advocates. Our editorial standards are improved by thoughtful engagement with the people who use our content.</p>
        </div>
      </div>
    </SiteLayout>
  );
}
