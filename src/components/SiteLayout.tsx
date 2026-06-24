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
import { MobileCallButton } from "@/components/MobileCallButton";
import { TawkChat } from "@/components/TawkChat";

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
  { to: "/blog", label: "Financial Education Blog" },
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

      <header className={`sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>WeHelpFinance</span>
          </Link>

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
              className="grid h-11 w-11 place-items-center rounded-full border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
            <div className="container-page flex flex-col gap-1 py-3 pb-4">
              <MobileSection title="Services" items={SERVICES} pathname={pathname} onClick={() => setOpen(false)} />
              <MobileSection title="Resources" items={RESOURCES} pathname={pathname} onClick={() => setOpen(false)} />
              <MobileSection title="Company" items={NAV} pathname={pathname} onClick={() => setOpen(false)} />
              <Link href="/get-help" onClick={() => setOpen(false)} className="btn-cta mt-2 min-h-12">
                Get Free Help Now
              </Link>
              <a
                href={`tel:${PHONE_NUMBER}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-semibold text-primary transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <section className="border-t border-border bg-primary-soft/30">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Need help? We're here.</p>
            <p className="mt-1 text-sm text-muted-foreground">Free, confidential consultation — no obligation.</p>
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
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              WeHelpFinance
            </div>
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
    <>
      <div className="mt-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {items.map((item) => (
        <Link
          key={item.to}
          href={item.to}
          onClick={onClick}
          className={`flex min-h-11 items-center justify-between rounded-xl px-3 text-base font-medium transition-colors hover:bg-muted ${
            pathname === item.to ? "bg-primary-soft text-primary" : "text-foreground"
          }`}
        >
          <span>{item.label}</span>
          {item.soon && <span className="text-xs uppercase tracking-wide text-gold">Coming soon</span>}
        </Link>
      ))}
    </>
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
