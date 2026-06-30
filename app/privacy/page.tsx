import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WeHelpFinance",
  description: "How WeHelpFinance collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | WeHelpFinance", description: "How WeHelpFinance collects, uses, and protects your information.", url: "/privacy", type: "website" },
};


export default function Privacy() {
  return (
    <>
      <article className="container-page mx-auto max-w-3xl py-14 prose-page">
        <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Legal</span>
        <h1 className="mt-4">Privacy Policy</h1>
<p className="mt-2 text-sm text-muted-foreground">Last updated: June 24, 2026</p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground">
          <p>
            This Privacy Policy explains how WeHelpFinance ("we", "us", "our") collects, uses, and
            shares information when you use wehelpfinance.com (the "Site"). By using the Site, you
            agree to the practices described here.
          </p>

          <h2 className="text-2xl">Information we collect</h2>
          <p>
            We collect information you provide directly — such as your name, email, phone number,
            state, and details about the financial help you're seeking — as well as technical
            information collected automatically, including IP address, device data, and usage data.
          </p>

          <h2 className="text-2xl">How we use information</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>To match you with independent financial service providers ("Partners").</li>
            <li>To respond to inquiries and provide customer support.</li>
            <li>To improve the Site, our matching, and your experience.</li>
            <li>To send transactional or marketing communications (you can opt out anytime).</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>

          <h2 className="text-2xl">How we share information</h2>
          <p>
            We share the information you submit with one or more Partners that match your needs.
            Those Partners may contact you by phone, text, or email to discuss services. We may also
            share data with service providers acting on our behalf, or as required by law.
          </p>

          <h2 className="text-2xl">Communications consent (TCPA)</h2>
          <p>
            By submitting your information, you authorize WeHelpFinance and its Partners to contact
            you at the phone number you provided — including via autodialed calls, prerecorded
            messages, and SMS — even if your number is on a do-not-call list. Consent is not a
            condition of any purchase. Message and data rates may apply.
          </p>

          <h2 className="text-2xl">Your choices</h2>
          <p>
            You may opt out of marketing communications at any time. You may also request access,
            correction, or deletion of your personal information by emailing us at
            hello@wehelpfinance.com. State residents (including California) may have additional
            rights under applicable law.
          </p>

          <h2 className="text-2xl">Children</h2>
          <p>The Site is not directed to children under 18, and we do not knowingly collect data from them.</p>

          <h2 className="text-2xl">Updates</h2>
          <p>We may update this Privacy Policy from time to time. Updates will be posted on this page.</p>

          <h2 className="text-2xl">Contact</h2>
          <p>Questions? Email <a href="mailto:hello@wehelpfinance.com" className="text-primary underline">hello@wehelpfinance.com</a>.</p>
        </div>
      </article>
    </>
  );
}
