export const SITE_URL = "https://www.wehelpfinance.com";

/** Shared site-wide Open Graph / Twitter card image (also used by layout). */
export const DEFAULT_OG_IMAGE = "/og-default.png";

export const ORGANIZATION = {
  name: "WeHelpFinance",
  legalName: "WeHelpFinance",
  url: SITE_URL,
  logo: `${SITE_URL}/og-default.png`,
  description:
    "Free service that connects consumers with vetted debt relief, tax relief, and personal loan specialists.",
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
    email: "hello@wehelpfinance.com",
    areaServed: "US",
    availableLanguage: ["English"],
  },
  knowsAbout: [
    "Debt Relief",
    "Debt Settlement",
    "Debt Consolidation",
    "Personal Loans",
    "Tax Relief",
    "Consumer Financial Rights",
    "Fair Debt Collection Practices Act",
  ],
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  sameAs: [
    "https://youtube.com/@wehelpfinance",
    "https://linkedin.com/company/wehelpfinance",
    "https://facebook.com/wehelpfinance",
    "https://instagram.com/wehelpfinance",
  ],
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    description: ORGANIZATION.description,
    address: ORGANIZATION.address,
    contactPoint: ORGANIZATION.contactPoint,
    knowsAbout: ORGANIZATION.knowsAbout,
    areaServed: ORGANIZATION.areaServed,
    ...(ORGANIZATION.sameAs.length > 0 && { sameAs: ORGANIZATION.sameAs }),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: ORGANIZATION.logo,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${ORGANIZATION.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
