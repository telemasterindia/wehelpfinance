import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Repair — Coming Soon | WeHelpFinance",
  description: "Credit repair support is coming soon to WeHelpFinance.",
  alternates: { canonical: "/credit-repair" },
  openGraph: { title: "Credit Repair — Coming Soon | WeHelpFinance", description: "Credit repair support is coming soon to WeHelpFinance.", url: "/credit-repair", type: "website" },
  robots: { index: false, follow: false },
};

import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function Page() {
  return (
    <>
<ComingSoonPage
      name="Credit Repair"
      description="We're partnering with credit repair specialists to help you dispute inaccuracies and rebuild your credit profile with confidence."
    />
    </>
  );
}
