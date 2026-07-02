import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — We'll Be in Touch | WeHelpFinance",
  description:
    "Thanks for reaching out. A specialist will contact you shortly to discuss your free, no-obligation options.",
  alternates: { canonical: "/thank-you" },
  openGraph: {
    title: "Thank You — We'll Be in Touch | WeHelpFinance",
    description:
      "Thanks for reaching out. A specialist will contact you shortly to discuss your free, no-obligation options.",
    url: "/thank-you",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: false, follow: false },
};

import Link from "next/link";
import { CheckCircle2, Phone, Mail, ArrowRight } from "lucide-react";

export default function ThankYou() {
  return (
    <>
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6">Thank you — we got your request.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A trusted specialist will reach out within one business day. Keep an
            eye on your phone and email.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="surface-card text-left">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="font-semibold">By phone</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Calls typically come from a local or toll-free number. No
                obligation to proceed.
              </p>
            </div>
            <div className="surface-card text-left">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="font-semibold">By email</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Check your inbox (and spam folder) for a follow-up with next
                steps.
              </p>
            </div>
          </div>

          <Link href="/" className="btn-ghost-pill mt-10 inline-flex">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
