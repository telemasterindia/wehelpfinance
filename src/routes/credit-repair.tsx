import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const Route = createFileRoute("/credit-repair")({
  head: () => ({
    meta: [
      { title: "Credit Repair — Coming Soon | WeHelpFinance" },
      { name: "description", content: "Credit repair support is coming soon to WeHelpFinance. We'll help you dispute errors and rebuild your credit profile." },
      { property: "og:url", content: "https://wehelpfinance.com/credit-repair" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/credit-repair" }],
  }),
  component: () => (
    <ComingSoonPage
      name="Credit Repair"
      description="We're partnering with credit repair specialists to help you dispute inaccuracies and rebuild your credit profile with confidence."
    />
  ),
});
