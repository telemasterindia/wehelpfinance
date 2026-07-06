"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  Phone,
  ShieldCheck,
  X,
  Youtube,
} from "lucide-react";
import { FooterLogo, Logo } from "@/components/Logo";
import { MobileCallButton } from "@/components/MobileCallButton";
import { TawkChat } from "@/components/TawkChat";
import { TrustSignals } from "@/components/TrustSignals";

const PHONE_NUMBER = "+17183604806";
const PHONE_DISPLAY = "(718) 360-4806";

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

const RESOURCES: NavItem[] = [
  { to: "/financial-tools", label: "Financial Tools" },
  { to: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
  { to: "/blog", label: "Financial Education Blog" },
  { to: "/research", label: "Research Reports" },
  { to: "/consumer-rights", label: "Consumer Rights" },
  { to: "/debt-validation", label: "Debt Validation" },
  { to: "/debt-validation-letter", label: "Debt Validation Letter" },
  { to: "/fdcpa-rights", label: "FDCPA Rights" },
  { to: "/collection-agency-rights", label: "Collection Rights" },
  { to: "/editorial-policy", label: "Editorial Policy" },
];

const NAV: NavItem[] = [
  { to: "/credit-repair", label: "Credit Repair", soon: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL = [
  { href: "https://youtube.com/@wehelpfinance", label: "YouTube", icon: Youtube, color: "hover:text-red-500" },
  { href: "https://linkedin.com/company/wehelpfinance", label: "LinkedIn", icon: Linkedin, color: "hover:text-blue-600" },
  { href: "https://facebook.com/wehelpfinance", label: "Facebook", icon: Facebook, color: "hover:text-blue-500" },
  { href: "https://instagram.com/wehelpfinance", label: "Instagram", icon: Instagram, color: "hover:text-pink-500" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const servicesActive = SERVICES.some((service) => pathname === service.to || pathname.startsWith(`${service.to}/`));
  const resourcesActive = RESOURCES.some((resource) => pathname === resource.to || pathname.startsWith(`${resource.to}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <TawkChat />

      <header className={`sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur transition-shadow ${scrolled || open ? "shadow-sm" : ""}`}>
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:gap-4">
          <Logo size="md" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Dropdown label="Services" active={servicesActive} items={SERVICES} pathname={pathname} />
            <Dropdown label="Resources" active={resourcesActive} items={RESOURCES} pathname={pathname} />
            {NAV.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  pathname === item.to ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.soon && <span className="ml-1 text-[10px] uppercase tracking-wide text-gold">Soon</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_NUMBER}`}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <Link href="/get-help" className="btn-cta hidden h-10 min-h-0 px-5 text-sm lg:inline-flex">
              Get Free Help
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-foreground transition-colors lg:hidden ${
                open ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-border bg-background/98 shadow-lg lg:hidden">
            <div className="container-page max-h-[calc(100dvh-4rem)] overflow-y-auto py-4">
              <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/get-help" onClick={() => setOpen(false)} className="btn-cta min-h-12 px-3 text-sm">
                    Get Free Help
                  </Link>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft/75"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Call Now
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/70 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Free, confidential consultation
                </div>
              </div>

              <nav className="mt-3 space-y-3" aria-label="Mobile navigation">
                <MobileSection title="Services" items={SERVICES} pathname={pathname} onClick={() => setOpen(false)} />
                <MobileSection title="Resources" items={RESOURCES} pathname={pathname} onClick={() => setOpen(false)} />
                <MobileSection title="Company" items={NAV} pathname={pathname} onClick={() => setOpen(false)} />
              </nav>

              <div className="mt-3 rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                <a href={`tel:${PHONE_NUMBER}`} onClick={() => setOpen(false)} className="text-sm font-semibold text-primary">
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">Speak with a financial help specialist.</p>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>

      <section className="border-t border-border bg-primary-soft/30">
        <div className="container-page flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Need help? We're here.</p>
            <p className="mt-1 text-sm text-muted-foreground">Free, confidential consultation — no obligation.</p>
            <TrustSignals variant="compact" className="mt-3 justify-start" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/get-help"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Free Help <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Send a message →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-cream">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <FooterLogo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A calm, judgment-free way to explore debt relief, tax relief, and personal loan options with vetted financial specialists.
            </p>
            <address className="mt-4 not-italic text-sm text-muted-foreground">
              539 W. Commerce St #4251
              <br />
              Dallas, TX 75208
              <br />
              <a href={`tel:${PHONE_NUMBER}`} className="transition-colors hover:text-primary">
                {PHONE_DISPLAY}
              </a>
            </address>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors ${social.color}`}
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Services" links={SERVICES} />
          <FooterCol title="Resources" links={RESOURCES} />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/editorial-policy", label: "Editorial Policy" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Service" },
            ]}
          />
        </div>
        <div className="border-t border-border">
          <div className="container-page py-6 text-xs leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Disclaimer:</strong> WeHelpFinance is not a lender, bank, law firm, credit repair organization, or tax advisory firm. We connect consumers with independent financial service providers. Results vary by individual circumstances. This website is for informational purposes only and does not constitute financial, legal, or tax advice.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} WeHelpFinance. All rights reserved. Operated by Telemaster India (TMI).</p>
          </div>
        </div>
      </footer>

      <MobileCallButton />
    </div>
  );
}

function Dropdown({ label, active, items, pathname }: { label: string; active: boolean; items: NavItem[]; pathname: string }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
          active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" aria-hidden="true" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-80 translate-y-2 rounded-2xl border border-border bg-background p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted ${
              pathname === item.to ? "bg-primary-soft text-primary" : "text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSection({ title, items, pathname, onClick }: { title: string; items: NavItem[]; pathname: string; onClick: () => void }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-2 shadow-sm">
      <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <div className="grid gap-1">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);

          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={onClick}
              className={`flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 text-[15px] font-medium leading-snug transition-colors ${
                active ? "bg-primary-soft text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <span>{item.label}</span>
              {item.soon && (
                <span className="shrink-0 rounded-full bg-gold/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link href={link.to} className="text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
