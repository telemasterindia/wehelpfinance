import { Link } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Menu, X, ShieldCheck, Phone } from "lucide-react";

// ─── Analytics IDs — update these ────────────────────────────────────────────
const GA4_ID = "G-B9PXMRG885";
const CLARITY_ID = "your-clarity-id"; // Replace with real Clarity project ID from clarity.microsoft.com

// ─── Nav items ────────────────────────────────────────────────────────────────
type NavItem = { to: string; label: string; soon?: boolean };
const NAV: NavItem[] = [
  { to: "/debt-relief", label: "Debt Relief" },
  { to: "/personal-loans", label: "Personal Loans" },
  { to: "/tax-relief", label: "Tax Relief" },
  { to: "/credit-repair", label: "Credit Repair", soon: true },
  { to: "/consumer-rights", label: "Consumer Rights", soon: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// ─── Analytics scripts ────────────────────────────────────────────────────────
function AnalyticsScripts() {
  useEffect(() => {
    // ── GA4 ──────────────────────────────────────────────────────────────────
    if (GA4_ID && GA4_ID !== "G-XXXXXXXX") {
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(s1);

      const s2 = document.createElement("script");
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}', { send_page_view: true });
      `;
      document.head.appendChild(s2);
    }

    // ── Microsoft Clarity ─────────────────────────────────────────────────────
    if (CLARITY_ID && CLARITY_ID !== "your-clarity-id") {
      const s = document.createElement("script");
      s.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(s);
    }

    // ── Landing page + UTM capture on first load ──────────────────────────────
    try {
      if (!sessionStorage.getItem("whf_landing")) {
        sessionStorage.setItem("whf_landing", window.location.href);
      }
      const p = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"]
        .forEach((k) => { const v = p.get(k); if (v) utm[k] = v; });
      if (Object.keys(utm).length) {
        sessionStorage.setItem("whf_utm", JSON.stringify(utm));
      }
    } catch {}
  }, []);

  return null;
}

// ─── Main layout ──────────────────────────────────────────────────────────────
export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsScripts />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-semibold text-primary"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>WeHelpFinance</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to as any}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{
                  className:
                    "rounded-full px-3 py-2 text-sm font-medium text-primary bg-primary-soft",
                }}
              >
                {n.label}
                {n.soon && (
                  <span className="ml-1 text-[10px] uppercase tracking-wide text-gold">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side — phone + CTA + hamburger */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+17183604806"
              aria-label="Call (718) 360-4806"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">(718) 360-4806</span>
            </a>
            <Link
              to="/get-help"
              className="btn-cta hidden h-11 min-h-0 px-5 text-sm sm:inline-flex"
            >
              Get Free Help
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border lg:hidden"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="container-page flex flex-col gap-1 py-3">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to as any}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  <span>{n.label}</span>
                  {n.soon && (
                    <span className="text-xs uppercase tracking-wide text-gold">
                      Coming soon
                    </span>
                  )}
                </Link>
              ))}
              <a
                href="tel:+17183604806"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-base font-semibold text-primary hover:bg-muted"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                (718) 360-4806
              </a>
              <Link
                to="/get-help"
                onClick={() => setOpen(false)}
                className="btn-cta mt-2"
              >
                Get Free Help Now
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="mt-20 border-t border-border bg-cream">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              WeHelpFinance
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A calm, judgment-free way to explore debt relief, tax relief, and personal loan
              options with vetted financial specialists.
            </p>
            <address className="mt-4 not-italic text-sm text-muted-foreground">
              539 W. Commerce St #4251
              <br />
              Dallas, TX 75208
              <br />
              <a href="tel:+17183604806" className="hover:text-primary">
                (718) 360-4806
              </a>
            </address>
          </div>

          <FooterCol
            title="Services"
            links={[
              { to: "/debt-relief", label: "Debt Relief" },
              { to: "/personal-loans", label: "Personal Loans" },
              { to: "/tax-relief", label: "Tax Relief" },
            ]}
          />
          <FooterCol
            title="Coming Soon"
            links={[
              { to: "/credit-repair", label: "Credit Repair" },
              { to: "/consumer-rights", label: "Consumer Rights" },
            ]}
          />
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
              <strong className="text-foreground">Disclaimer:</strong> WeHelpFinance is not a
              lender, bank, law firm, credit repair organization, or tax advisory firm. We connect
              consumers with independent financial service providers. Results vary by individual
              circumstances.
            </p>
            <p className="mt-3">
              © {new Date().getFullYear()} WeHelpFinance. All rights reserved. Operated by
              Telemaster India (TMI).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to as any} className="text-muted-foreground hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
