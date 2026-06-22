import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LeadForm } from "@/components/LeadForm";

export const Route = createFileRoute("/get-help")({
  head: () => ({
    meta: [
      { title: "Get Free Help — Start Your Free Consultation | WeHelpFinance" },
      { name: "description", content: "Tell us a little about your situation. A trusted specialist will reach out to discuss your options — free, confidential, no obligation." },
      { property: "og:title", content: "Get Free Help | WeHelpFinance" },
      { property: "og:url", content: "/get-help" },
    ],
    links: [{ rel: "canonical", href: "/get-help" }],
  }),
  component: GetHelpPage,
});

function GetHelpPage() {
  return (
    <SiteLayout>
      <section className="container-page py-14">
        <div className="mx-auto max-w-xl text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back home</Link>
          <h1 className="mt-3">Get free, confidential help</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            It takes about 2 minutes. No obligation, no pressure — just real options from real specialists.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <LeadForm />
        </div>
      </section>
    </SiteLayout>
  );
}
