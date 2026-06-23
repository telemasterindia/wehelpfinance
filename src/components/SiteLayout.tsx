"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronDown, Menu, Phone, ShieldCheck, X } from "lucide-react";

type NavItem = { to: string; label: string; soon?: boolean };
const SERVICES: NavItem[] = [
  { to: "/debt-relief", label: "Debt Relief" },
  { to: "/credit-card-debt-relief", label: "Credit Card Debt Relief" },
  { to: "/debt-settlement", label: "Debt Settlement" },
  { to: "/debt-consolidation", label: "Debt Consolidation" },
  { to: "/personal-loans", label: "Personal Loans" },
  { to: "/tax-relief", label: "Tax Relief" },
  { to: "/irs-debt-relief", label: "IRS Debt Relief" },
  { to: "/back-taxes-help", label: "Back Taxes Help" },
];

const NAV: NavItem[] = [
  { to: "/credit-repair", label: "Credit Repair", soon: true },
  { to: "/consumer-rights", label: "Consumer Rights", soon: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const servicesActive = SERVICES.some((service) => pathname === service.to);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>WeHelpFinance</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-muted ${servicesActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"}`}
                aria-haspopup="true"
              >
                Services
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 rounded-2xl border border-border bg-background p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {SERVICES.map((service) => (
                  <Link
                    key={service.to}
                    href={service.to}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-muted ${pathname === service.to ? "bg-primary-soft text-primary" : "text-foreground"}`}
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={`rounded-full px-3 py-2 text-sm font-medium hover:bg-muted ${pathname === n.to ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
                {n.soon && <span className="ml-1 text-[10px] uppercase tracking-wide text-gold">Soon</span>}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+17183604806"
              aria-label="Call (718) 360-4806"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(718) 360-4806</span>
            </a>
            <Link href="/get-help" className="btn-cta hidden h-11 min-h-0 px-5 text-sm sm:inline-flex">
              Get Free Help
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="container-page flex flex-col gap-1 py-3">
              <div className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Services
              </div>
              {SERVICES.map((service) => (
                <Link
                  key={service.to}
                  href={service.to}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center rounded-xl px-3 text-base font-medium hover:bg-muted ${pathname === service.to ? "bg-primary-soft text-primary" : "text-foreground"}`}
                >
                  {service.label}
                </Link>
              ))}
              <div className="mt-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company
              </div>
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  <span>{n.label}</span>
                  {n.soon && <span className="text-xs uppercase tracking-wide text-gold">Coming soon</span>}
                </Link>
              ))}
              <Link href="/get-help" onClick={() => setOpen(false)} className="btn-cta mt-2">
                Get Free Help Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border bg-cream">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </span>
              WeHelpFinance
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A calm, judgment-free way to explore debt relief, tax relief, and personal loan
              options with vetted financial specialists.
            </p>
            <address className="mt-4 not-italic text-sm text-muted-foreground">
              539 W. Commerce St #4251<br />
              Dallas, TX 75208<br />
              <a href="tel:+17183604806" className="hover:text-primary">(718) 360-4806</a>
            </address>
          </div>
          <FooterCol title="Services" links={SERVICES} />
          <FooterCol title="Coming Soon" links={[
            { to: "/credit-repair", label: "Credit Repair" },
            { to: "/consumer-rights", label: "Consumer Rights" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]} />
        </div>
        <div className="border-t border-border">
          <div className="container-page py-6 text-xs leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Disclaimer:</strong> WeHelpFinance is not a lender,
              bank, law firm, credit repair organization, or tax advisory firm. We connect consumers
              with independent financial service providers. Results vary by individual circumstances.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} WeHelpFinance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link href={l.to} className="text-muted-foreground hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
