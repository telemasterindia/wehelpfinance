import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WeHelpFinance",
  description: "The terms and conditions for using WeHelpFinance.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service | WeHelpFinance", description: "The terms and conditions for using WeHelpFinance.", url: "/terms", type: "website" },
};


export default function Terms() {
  return (
    <>
      <article className="container-page mx-auto max-w-3xl py-14">
        <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Legal</span>
        <h1 className="mt-4">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground">
          <p>
            These Terms of Service ("Terms") govern your use of wehelpfinance.com (the "Site"). By
            accessing or using the Site, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl">Nature of our service</h2>
          <p>
            WeHelpFinance is a free matching and referral service. We are <strong>not</strong> a
            lender, bank, law firm, credit repair organization, debt settlement company, or tax
            advisory firm. We connect consumers with independent third-party financial service
            providers ("Partners") who handle the actual services.
          </p>

          <h2 className="text-2xl">No guarantees</h2>
          <p>
            We do not guarantee any specific outcome, savings, approval, loan amount, interest rate,
            or tax resolution. Results vary by individual circumstances and depend on Partner
            evaluations and decisions.
          </p>

          <h2 className="text-2xl">Eligibility</h2>
          <p>
            You must be at least 18 years old and a U.S. resident to use the Site. By submitting
            information, you represent that the information is true and accurate to the best of your
            knowledge.
          </p>

          <h2 className="text-2xl">Your responsibilities</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>You agree to provide accurate, current information.</li>
            <li>You agree not to misuse the Site or interfere with its operation.</li>
            <li>You authorize WeHelpFinance and Partners to contact you per our Privacy Policy.</li>
          </ul>

          <h2 className="text-2xl">Intellectual property</h2>
          <p>
            All content, branding, and design on the Site are owned by WeHelpFinance or its
            licensors and are protected by applicable laws.
          </p>

          <h2 className="text-2xl">Disclaimer of warranties</h2>
          <p>
            The Site and any information provided are offered "as is" and "as available" without
            warranties of any kind, express or implied, including merchantability, fitness for a
            particular purpose, and non-infringement.
          </p>

          <h2 className="text-2xl">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, WeHelpFinance and its affiliates will not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or for
            any loss of profits or data arising from your use of the Site or any Partner services.
          </p>

          <h2 className="text-2xl">Governing law</h2>
          <p>These Terms are governed by the laws of the United States and the state in which WeHelpFinance is organized, without regard to conflict-of-law principles.</p>

          <h2 className="text-2xl">Changes</h2>
          <p>We may update these Terms periodically. Continued use of the Site after changes constitutes acceptance.</p>

          <h2 className="text-2xl">Contact</h2>
          <p>Email <a href="mailto:hello@wehelpfinance.com" className="text-primary underline">hello@wehelpfinance.com</a> with questions.</p>
        </div>
      </article>
    </>
  );
}
