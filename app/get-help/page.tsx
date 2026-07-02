import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";

const CANONICAL = "https://www.wehelpfinance.com/get-help";
const title = "Get Free Help - Start Your Free Consultation | WeHelpFinance";
const description =
  "Tell us a little about your situation. A trusted specialist will reach out to discuss your options - free, confidential, no obligation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title,
    description,
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function GetHelpPage() {
  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Back home
        </Link>
        <h1 className="mt-3">Get free, confidential help</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          It takes about 2 minutes. No obligation, no pressure - just real
          options from real specialists.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-xl">
        <LeadForm />
      </div>
    </section>
  );
}
