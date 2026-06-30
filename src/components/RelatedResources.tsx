import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ResourceLink = { href: string; label: string };
export type ResourceGroup = { heading: string; links: ResourceLink[] };

export function RelatedResources({
  groups,
  title = "Explore Related Resources",
}: {
  groups: ResourceGroup[];
  title?: string;
}) {
  if (!groups.length) return null;

  return (
    <section className="container-page max-w-4xl border-t border-border py-10">
      <h2 className="mb-6 font-display text-xl font-semibold">{title}</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.heading}
            </h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export const DEBT_RELIEF_RELATED: ResourceGroup[] = [
  {
    heading: "Related Services",
    links: [
      { href: "/personal-loans", label: "Personal Loans" },
      { href: "/tax-relief", label: "Tax Relief" },
    ],
  },
  {
    heading: "Tools",
    links: [{ href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" }],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/editorial-policy", label: "Our Editorial Standards" },
      { href: "/about", label: "About WeHelpFinance" },
    ],
  },
];

export const PERSONAL_LOANS_RELATED: ResourceGroup[] = [
  {
    heading: "Related Services",
    links: [
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/tax-relief", label: "Tax Relief" },
    ],
  },
  {
    heading: "Tools",
    links: [{ href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" }],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/editorial-policy", label: "Our Editorial Standards" },
      { href: "/about", label: "About WeHelpFinance" },
    ],
  },
];

export const TAX_RELIEF_RELATED: ResourceGroup[] = [
  {
    heading: "Related Services",
    links: [
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/personal-loans", label: "Personal Loans" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/editorial-policy", label: "Our Editorial Standards" },
      { href: "/about", label: "About WeHelpFinance" },
    ],
  },
];
