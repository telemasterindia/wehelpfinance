import Link from "next/link";
import { BookOpen, FileCheck, Info, Lock, Phone, ScrollText, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DEFAULT_POINTS: TrustPoint[] = [
  { icon: Phone, text: "Free consultation - no cost to speak with a specialist" },
  { icon: FileCheck, text: "No obligation to enroll in any program" },
  { icon: Lock, text: "Secure form - your information is encrypted in transit" },
  { icon: ShieldCheck, text: "Information handled confidentially, never sold to unrelated third parties" },
  { icon: BookOpen, text: "Educational content reviewed under our editorial standards" },
];

const DEFAULT_LINKS: TrustLink[] = [
  { href: "/editorial-policy", label: "Editorial Policy", icon: ScrollText },
  { href: "/privacy", label: "Privacy Policy", icon: Lock },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/about", label: "About WeHelpFinance", icon: Info },
];

export type TrustPoint = { icon: LucideIcon; text: string };
export type TrustLink = { href: string; label: string; icon: LucideIcon };

export function TrustBox({
  title = "Why Trust WeHelpFinance",
  points = DEFAULT_POINTS,
  links = DEFAULT_LINKS,
}: {
  title?: string;
  points?: TrustPoint[];
  links?: TrustLink[];
}) {
  return (
    <section className="container-page max-w-4xl py-10">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <ul className="mb-6 grid gap-3 sm:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;

            return (
              <li key={point.text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {point.text}
              </li>
            );
          })}
        </ul>
        <div className="border-t border-border pt-5">
          <div className="flex flex-wrap gap-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
