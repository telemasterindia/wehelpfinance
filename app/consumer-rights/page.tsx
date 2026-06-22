import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consumer Rights — Coming Soon | WeHelpFinance",
  description: "Consumer rights support is coming soon.",
  alternates: { canonical: "/consumer-rights" },
  openGraph: { title: "Consumer Rights — Coming Soon | WeHelpFinance", description: "Consumer rights support is coming soon.", url: "/consumer-rights", type: "website" },
  robots: { index: false, follow: false },
};

import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function Page() {
  return (
    <>
<ComingSoonPage
      name="Consumer Rights"
      description="Coming soon: guidance on debt validation, the Fair Debt Collection Practices Act, and how to stand up for your consumer rights."
    />
    </>
  );
}
