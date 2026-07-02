import type { Metadata, Viewport } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics as MarketingAnalytics } from "@/components/Analytics";
import { SiteLayout } from "@/components/SiteLayout";
import { organizationJsonLd, websiteJsonLd } from "@/lib/organizationConfig";
import "@/styles.css";

const title = "WeHelpFinance — Debt Relief, Tax Relief & Personal Loan Help";
const description = "WeHelpFinance connects Americans with trusted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.";
const siteUrl = "https://www.wehelpfinance.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "debt relief",
    "tax relief",
    "personal loans",
    "debt settlement",
    "debt consolidation",
    "IRS debt help",
  ],
  authors: [{ name: "WeHelpFinance", url: siteUrl }],
  creator: "WeHelpFinance",
  publisher: "WeHelpFinance",
  applicationName: "WeHelpFinance",
  category: "Finance",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#0b4d3b" }],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    siteName: "WeHelpFinance",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title,
    description,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "WeHelpFinance — Financial Help Made Human" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-default.png"] },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b4d3b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" />
        <meta name="msapplication-TileColor" content="#0b4d3b" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <SiteLayout>{children}</SiteLayout>
        <MarketingAnalytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
