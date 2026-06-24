import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/Analytics";
import { SiteLayout } from "@/components/SiteLayout";
import "@/styles.css";

const title = "WeHelpFinance — Debt Relief, Tax Relief & Personal Loan Help";
const description = "WeHelpFinance connects Americans with trusted specialists for debt relief, tax relief, and personal loans. Free, confidential, no obligation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wehelpfinance.com"),
  title,
  description,
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    siteName: "WeHelpFinance",
    type: "website",
    title,
    description,
    images: ["https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/00f1d7b7-7616-41f7-9638-f9e6d14b12d5"],
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1a4a4a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}

