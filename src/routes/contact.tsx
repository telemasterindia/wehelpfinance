import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LeadForm } from "@/components/LeadForm";
import { Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact WeHelpFinance" },
      { name: "description", content: "Get in touch with WeHelpFinance. Start a free consultation or send us a message — we respond within one business day." },
      { property: "og:title", content: "Contact WeHelpFinance" },
      { property: "og:url", content: "https://wehelpfinance.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Contact</span>
            <h1 className="mt-4">We're here when you're ready.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The fastest way to get help is the short form on this page. Prefer email? Reach us anytime.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:hello@wehelpfinance.com" className="text-primary hover:underline">
                    hello@wehelpfinance.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Response time</p>
                  <p className="text-muted-foreground">Most messages answered within one business day.</p>
                </div>
              </li>
            </ul>
          </div>

          <LeadForm />
        </div>
      </section>
    </SiteLayout>
  );
}
