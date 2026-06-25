import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/Analytics";
import { SiteLayout } from "@/components/SiteLayout";
import "@/styles.css";

const title = "WeHelpFinance — Debt Relief, Tax Relief & Personal Loan Help";
const description = "WeHelpFinance connects Americans with trusted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.";
const siteUrl = "https://www.wehelpfinance.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WeHelpFinance",
  url: siteUrl,
  logo: `${siteUrl}/og-default.svg`,
  description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "539 W. Commerce St #4251",
    addressLocality: "Dallas",
    addressRegion: "TX",
    postalCode: "75208",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-718-360-4806",
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: "English",
  },
  sameAs: [
    "https://youtube.com/@wehelpfinance",
    "https://linkedin.com/company/wehelpfinance",
    "https://facebook.com/wehelpfinance",
    "https://instagram.com/wehelpfinance",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WeHelpFinance",
  url: siteUrl,
};

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
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "WeHelpFinance — Financial Help Made Human" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-default.svg"] },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}

