import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const Route = createFileRoute("/consumer-rights")({
  head: () => ({
    meta: [
      { title: "Consumer Rights — Coming Soon | WeHelpFinance" },
      { name: "description", content: "Consumer rights support is coming soon. Learn about FDCPA protections, debt validation, and your rights as a consumer." },
      { property: "og:url", content: "https://wehelpfinance.com/consumer-rights" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/consumer-rights" }],
  }),
  component: () => (
    <ComingSoonPage
      name="Consumer Rights"
      description="Coming soon: guidance on debt validation, the Fair Debt Collection Practices Act, and how to stand up for your consumer rights."
    />
  ),
});
