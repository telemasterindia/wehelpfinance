export type AuthorMode = "team" | "expert";

export const AUTHOR_MODE: AuthorMode = "team";

export const EDITORIAL_TEAM = {
  name: "WeHelpFinance Editorial Team",
  shortName: "Editorial Team",
  role: "Consumer Finance Research Team",
  description:
    "Our editorial team researches, writes, and reviews consumer finance content using primary sources including the CFPB, FTC, IRS, and AFCC. Every article is reviewed against current regulations before publishing.",
  url: "https://www.wehelpfinance.com/editorial-policy",
  sameAs: [] as string[],
};

export const NAMED_EXPERT = {
  name: "Amit Chadha",
  shortName: "Amit Chadha",
  role: "Founder, WeHelpFinance",
  credential: "20+ years in U.S. consumer financial services lead generation and operations",
  description:
    "Amit Chadha is the founder of WeHelpFinance and has spent over two decades working directly with U.S. consumers navigating debt relief, personal loans, and tax relief decisions.",
  url: "https://www.wehelpfinance.com/about",
  sameAs: [] as string[],
};

export const PAGE_AUTHOR_OVERRIDES: Record<string, AuthorMode> = {};

export type ResolvedAuthor = {
  mode: AuthorMode;
  name: string;
  role: string;
  description: string;
  url: string;
  sameAs: string[];
  credential?: string;
};

export function getAuthorForPath(path: string): ResolvedAuthor {
  const mode = PAGE_AUTHOR_OVERRIDES[path] ?? AUTHOR_MODE;

  if (mode === "expert") {
    return {
      mode,
      name: NAMED_EXPERT.name,
      role: NAMED_EXPERT.role,
      description: NAMED_EXPERT.description,
      url: NAMED_EXPERT.url,
      sameAs: NAMED_EXPERT.sameAs,
      credential: NAMED_EXPERT.credential,
    };
  }

  return {
    mode,
    name: EDITORIAL_TEAM.name,
    role: EDITORIAL_TEAM.role,
    description: EDITORIAL_TEAM.description,
    url: EDITORIAL_TEAM.url,
    sameAs: EDITORIAL_TEAM.sameAs,
  };
}

export function authorJsonLd(path: string) {
  const author = getAuthorForPath(path);

  if (author.mode === "expert") {
    return {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.description,
      url: author.url,
      ...(author.sameAs.length > 0 && { sameAs: author.sameAs }),
    };
  }

  return {
    "@type": "Organization",
    name: author.name,
    description: author.description,
    url: author.url,
  };
}
