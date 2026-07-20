import type { Metadata } from "next";
import Link from "next/link";
import { ConsumerRightsWizard } from "@/components/tools/ConsumerRightsWizard";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd, articleJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/organizationConfig";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/consumer-rights-wizard";

export const metadata: Metadata = {
  title: "Consumer Rights & Debt Options Wizard — Know Your Rights, See Your Options | WeHelpFinance",
  description:
    "Free interactive wizard: answer a few questions about your debt and get plain-English education on your consumer rights, the debt collection process, debt validation, and every option worth exploring — settlement, consolidation, payoff plans, and more. Not legal advice. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Consumer Rights & Debt Options Wizard | WeHelpFinance",
    description:
      "Understand your rights when debt collectors call, how debt validation works, and which financial options fit your situation — in one free guided wizard with a printable summary.",
    url: CANONICAL,
    type: "website",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "WeHelpFinance — Financial Help Made Human" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consumer Rights & Debt Options Wizard | WeHelpFinance",
    description:
      "Know your rights. See your options. A free guided wizard for anyone dealing with debt or debt collectors — educational, private, 3 minutes.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "What are my rights when a debt collector calls me?",
    a: "Third-party debt collectors are governed by the federal Fair Debt Collection Practices Act (FDCPA). In general terms: they can't harass or threaten you, can't call at unreasonable hours (generally before 8 a.m. or after 9 p.m. your local time), can't misrepresent who they are or what you owe, can't discuss your debt with most third parties, and generally must honor written requests to limit or stop contact. Stopping contact doesn't erase a valid debt — but the pressure tactics are regulated, and documented violations can be reported to the CFPB and your state attorney general. State laws sometimes add protections on top; the specifics vary.",
  },
  {
    q: "What is debt validation and how do I request it?",
    a: "Debt validation is your general right to written proof before you pay a collector. After first contact, collectors are generally required to send a validation notice — the amount, the creditor's name, and your dispute rights. If you dispute the debt in writing within the federal window (generally 30 days of receiving that notice), collection activity on the disputed portion generally must pause until the collector responds with verification. Practical version: send the request in writing, keep a copy, and don't make payments or promises on a debt you haven't verified — especially an old one you don't recognize.",
  },
  {
    q: "Can a debt collector sue me — and what happens if I ignore a lawsuit?",
    a: "Yes, creditors and collectors can sue over unpaid debts within your state's time limits, and ignoring the papers is the one response that reliably makes things worse: missing the court deadline typically produces a default judgment, which can unlock stronger collection tools like wage garnishment or bank levies depending on your state. If you're served, read everything, note the response deadline, and get case-specific help — a consumer attorney or your state's legal-aid program. Many consumer attorneys offer free consultations, and showing up (even just to respond) preserves defenses that silence forfeits.",
  },
  {
    q: "How long can a debt be collected? What is the statute of limitations on debt?",
    a: "Every state limits how long a creditor can successfully sue over a debt — commonly somewhere between three and ten years depending on the state and the type of debt. Two crucial nuances: first, a time-barred debt doesn't vanish; collectors may generally still request payment, they just typically lose the courtroom lever. Second, in some states a partial payment or written acknowledgment can restart the clock. That's why the standard educational advice on old debt is: verify it, understand its age and status in your state, and think before paying anything — a small 'good-faith' payment can have outsized legal consequences.",
  },
  {
    q: "How does a collection account affect my credit score?",
    a: "A collection tradeline is a significant negative that generally can remain on your credit reports for about seven years from the original delinquency — though its scoring impact fades over time, and newer scoring models weigh paid collections less than unpaid ones. Medical debt now gets gentler treatment: paid medical collections have been removed from reports entirely, and small or recent medical balances face reporting restrictions. You always retain the FCRA right to dispute inaccurate entries — wrong amounts, wrong dates, debts that aren't yours — and bureaus generally must investigate.",
  },
  {
    q: "Should I pay a collection agency or the original creditor?",
    a: "It depends on who currently owns or services the debt — which is exactly what a validation request establishes. If the debt was sold, the original creditor typically can't accept payment anymore; if it was merely placed for collection, payment may route either way. Before paying anyone: verify the debt in writing, confirm the amount, get any settlement or payment agreement in writing first, and keep proof of payment permanently. Paying the wrong party, or paying without written terms, creates exactly the disputes this page exists to help you avoid.",
  },
  {
    q: "What's the difference between debt settlement, debt consolidation, and a debt management plan?",
    a: "Three different tools. Debt settlement negotiates eligible unsecured balances down — you pay less than owed, but accounts typically must be delinquent, credit takes significant damage during the program, and forgiven amounts can be taxable. Debt consolidation repays 100% through a new fixed-rate loan — it requires credit-based approval and works best around fair credit or better. A debt management plan (through a nonprofit credit-counseling agency) keeps the original debts but negotiates lower APRs into one payment — no new loan, no approval hurdle. Our Debt Solutions Comparison prices all of them with one engine so the trade-offs are visible side by side.",
  },
  {
    q: "How do I know if a debt relief company is legitimate or a scam?",
    a: "Warning signs are consistent: large upfront fees before any debt is resolved (the FTC's Telemarketing Sales Rule generally bans advance fees for debt settlement), guarantees of specific results, instructions to cut off all contact with your creditors, pressure to sign today, and vagueness about total cost. Legitimate signals: fees collected only after settlements occur, written agreements, realistic ranges instead of promises, and clear explanations of the credit and tax trade-offs. Cross-check any company with your state attorney general and the CFPB complaint database before signing anything.",
  },
  {
    q: "Will checking my rights or using this wizard affect my credit?",
    a: "No. Nothing here touches your credit file: the wizard runs entirely in your browser, asks for ranges rather than identifiers, and sends nothing anywhere. Reviewing your own credit reports is also a 'soft' inquiry that never affects scores — and you're entitled to free reports from the official source, AnnualCreditReport.com. The only credit-relevant actions are the ones you choose to take afterward, and each option's education here spells out its credit trade-offs before you get there.",
  },
  {
    q: "What should I do first if I'm behind on my debts?",
    a: "In order: (1) Get the facts — exact balances, creditors, and status for every account, in one folder. (2) Protect the essentials — housing, utilities, food, transportation come before unsecured debts. (3) Talk to original creditors about hardship programs while accounts are 30–90 days behind; more doors are open before charge-off. (4) Know your DTI — it's the number every future option checks. (5) Compare at least two paths with real math before committing to any program. The wizard above walks this sequence for your specific answers, and every step links the free tool that does the math.",
  },
];

const HOWTO_STEPS = [
  { name: "Answer a few adaptive questions", text: "State, debt type, status, collector contact, homeownership, credit range, monthly payments, income range, and your goal — the flow adapts to your answers, and nothing is saved or sent." },
  { name: "Read your situation and rights overview", text: "A plain-English summary plus general education on the federal protections that apply — FDCPA collector rules, debt validation, credit-reporting rights, and lawsuit basics." },
  { name: "Compare your options", text: "Ranked, explained options — hardship programs, settlement, consolidation, debt management, refinancing, budgeting — each with its honest trade-offs and the free calculator that prices it." },
  { name: "Leave with a plan", text: "Recommended next steps, an action checklist, relevant document templates to watch for, and a printable summary you can keep or share." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "Financial Tools",
    links: [
      { href: "/financial-tools/debt-freedom-planner", label: "Debt Freedom Planner" },
      { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      { href: "/financial-tools/financial-health-score", label: "Financial Health Score" },
      { href: "/financial-tools/budget-planner", label: "Budget Planner" },
      { href: "/financial-tools", label: "All Financial Tools" },
    ],
  },
  {
    heading: "Related Services",
    links: [
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/debt-settlement", label: "Debt Settlement" },
      { href: "/debt-consolidation", label: "Debt Consolidation" },
      { href: "/consumer-rights", label: "Consumer Rights Hub" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/debt-relief-guide", label: "Complete Debt Relief Guide" },
      { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
      { href: "/editorial-policy", label: "Our Editorial Standards" },
    ],
  },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              { name: "Financial Tools", path: "https://www.wehelpfinance.com/financial-tools" },
              { name: "Consumer Rights & Debt Options Wizard", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to understand your consumer rights and debt options",
              description:
                "Use the free WeHelpFinance Consumer Rights & Debt Options Wizard to learn your rights with debt collectors, understand debt validation, and compare every debt-relief option for your situation.",
              steps: HOWTO_STEPS,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: "Consumer Rights & Debt Options: The Complete Educational Guide",
              excerpt:
                "How debt collection actually works, the consumer rights that regulate it, and every major debt option — settlement, consolidation, management plans, payoff strategies — explained without legal advice or sales pressure.",
              published: "2026-07-17",
              updated: "2026-07-17",
              slug: "consumer-rights-wizard",
              author: "WeHelpFinance Editorial Team",
              path: "/financial-tools/consumer-rights-wizard",
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Consumer Rights & Debt Options Wizard",
            url: CANONICAL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            provider: { "@type": "Organization", name: "WeHelpFinance", url: "https://www.wehelpfinance.com" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": CANONICAL,
            url: CANONICAL,
            name: "Consumer Rights & Debt Options Wizard",
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable-summary"],
            },
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/financial-tools" className="hover:text-primary">Financial Tools</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Consumer Rights Wizard</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Guided Wizard · Educational · No Sign-Up
          </span>
          <h1 className="mt-4">Consumer Rights &amp; Debt Options Wizard</h1>
          <p className="speakable-summary mt-4 max-w-2xl text-lg text-muted-foreground">
            Debt collectors have rules. You have rights. And your situation has more options
            than the phone calls suggest. Answer a few questions and get plain-English
            education on the debt collection process, debt validation, your consumer
            protections, and every path worth exploring — with the free calculator that
            prices each one. Educational guidance only — never legal advice.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {["Know your rights, plainly", "Every option, honestly ranked", "Nothing saved or submitted"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wizard ── */}
      <section className="container-page py-10" aria-label="Consumer rights and debt options wizard">
        <ConsumerRightsWizard />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ══════════════ CORNERSTONE EDUCATIONAL CONTENT ══════════════ */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90 prose-table:text-sm">

          <h2>Understanding debt collection: what actually happens, stage by stage</h2>
          <p>
            Debt collection feels chaotic from the inside — calls, letters, unfamiliar company
            names — but underneath it runs a fairly predictable machine. Understanding the
            machine is the first act of self-defense, because <strong>your rights and your
            options both change by stage</strong>, and most costly mistakes come from
            responding to one stage with another stage&rsquo;s playbook.
          </p>

          <h3>The typical debt collection timeline</h3>
          <p>
            Dates vary by creditor and account type, but most unsecured debt — credit card
            debt especially — moves through recognizable phases:
          </p>
          <div className="not-prose overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl border border-border text-sm">
              <caption className="sr-only">Typical debt collection timeline by days past due</caption>
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th scope="col" className="border-b border-border p-3 font-semibold">Stage</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">What typically happens</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">What's usually still open</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border p-3 font-medium">1–29 days late</td>
                  <td className="border-b border-border p-3">Late fee; internal reminders; usually not yet reported to credit bureaus.</td>
                  <td className="border-b border-border p-3">Everything — catch up, and often nothing permanent has happened.</td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">30–89 days</td>
                  <td className="border-b border-border p-3">Late marks generally begin reporting at 30 days; the creditor's own collections department calls.</td>
                  <td className="border-b border-border p-3">Hardship programs, reduced-interest plans, catch-up arrangements — the widest door.</td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">90–179 days</td>
                  <td className="border-b border-border p-3">Escalating internal collection; account may be placed with an outside agency.</td>
                  <td className="border-b border-border p-3">Settlement conversations become realistic; hardship options narrow but exist.</td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">~180 days</td>
                  <td className="border-b border-border p-3">Charge-off: the creditor writes the debt off its books — an accounting event, not forgiveness. The debt is still owed.</td>
                  <td className="border-b border-border p-3">Settlement with the creditor or its agency; the account often sells to a debt buyer.</td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Post charge-off</td>
                  <td className="border-b border-border p-3">Third-party collectors or debt buyers take over; FDCPA protections squarely apply; validation rights matter most here.</td>
                  <td className="border-b border-border p-3">Validation, dispute, negotiated settlement — often for less, since buyers pay pennies on the dollar.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Lawsuit window</td>
                  <td className="p-3">Within the state statute of limitations, the owner of the debt may sue; after judgment, state-law collection tools may apply.</td>
                  <td className="p-3">Responding on time, defenses, settlement before or after filing — silence is the only universally bad option.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Original creditors vs. collection agencies vs. debt buyers</h3>
          <p>
            Three different animals, three different rulebooks. Your <strong>original
            creditor</strong> (the bank behind your card) isn&rsquo;t generally covered by the
            FDCPA&rsquo;s collector rules — though state laws and other federal rules still
            constrain it — and it has the most flexibility on hardship programs. A{" "}
            <strong>collection agency</strong> works the debt on the creditor&rsquo;s behalf
            for a fee; the FDCPA applies. A <strong>debt buyer</strong> purchased the debt
            outright, often for a small fraction of face value — the FDCPA applies, validation
            requests matter enormously (documentation gets thin as debts change hands), and
            negotiating room is often widest. When a new name appears on a letter, your first
            question is always: <em>which of the three are you?</em>
          </p>

          <h2>Your consumer rights, in plain English</h2>
          <p>
            None of what follows is legal advice — it&rsquo;s the general federal landscape,
            and state laws frequently add more. For anything case-specific, especially a
            lawsuit, a licensed consumer attorney or your state&rsquo;s legal-aid program is
            the right resource. With that said, the baseline every consumer should know:
          </p>

          <h3>The FDCPA: rules for third-party collectors</h3>
          <ul>
            <li><strong>No harassment or abuse.</strong> Repeated calls intended to annoy, obscene language, and threats of violence are prohibited.</li>
            <li><strong>No lies.</strong> Collectors generally can&rsquo;t misrepresent the amount owed, pretend to be attorneys or government agents, or threaten actions they can&rsquo;t or won&rsquo;t take.</li>
            <li><strong>Time and place limits.</strong> Generally no calls before 8 a.m. or after 9 p.m. your local time, and no workplace calls once told your employer prohibits them.</li>
            <li><strong>Privacy.</strong> Collectors generally can&rsquo;t discuss your debt with most third parties — family, neighbors, coworkers — beyond locating you.</li>
            <li><strong>Written control over contact.</strong> You can generally limit channels or request in writing that contact stop. The debt remains; the pressure campaign doesn&rsquo;t have to.</li>
            <li><strong>Enforcement exists.</strong> Documented violations can be reported to the CFPB and your state attorney general, and the statute provides private remedies.</li>
          </ul>

          <h3>Debt validation: your &ldquo;prove it&rdquo; right</h3>
          <p>
            Shortly after first contact, a collector generally must send a{" "}
            <strong>validation notice</strong>: the amount, the creditor, and your dispute
            rights. Dispute in writing within the federal window — generally 30 days — and
            collection on the disputed debt generally must pause until verification arrives.
            This single mechanism resolves an enormous share of real-world problems: wrong
            amounts, wrong people, debts already paid, debts too old to sue on, and debts so
            many times resold that no one can document them. The educational rule of thumb:{" "}
            <em>never pay a collector you haven&rsquo;t validated, and never validate by
            phone what you can validate on paper.</em>
          </p>

          <h3>The FCRA: rules for your credit reports</h3>
          <ul>
            <li>You can dispute inaccurate information with the bureaus, which generally must investigate — typically within about 30 days.</li>
            <li>Most negative items generally age off after around seven years; the scoring impact fades well before the item does.</li>
            <li>Medical debt gets special treatment now: paid medical collections have been removed from reports, and small or recent medical balances face reporting limits.</li>
            <li>Your own report checks are free at the official source and never hurt your score.</li>
          </ul>

          <h3>Statutes of limitations: the clock on lawsuits</h3>
          <p>
            Every state caps how long a debt owner can successfully sue — commonly somewhere
            between <strong>three and ten years</strong>, varying by state and debt type
            (written contracts, open accounts, and judgments often carry different clocks).
            Three qualitative points matter more than any table of numbers: the clock limits{" "}
            <em>lawsuits</em>, not collection requests; in some states a{" "}
            <strong>partial payment or written acknowledgment can restart the clock</strong>;
            and judgments, once entered, live by their own much longer rules. This is exactly
            where state specifics decide outcomes — and exactly why this page stays
            qualitative and points you toward state-licensed help for anything contested. If
            you&rsquo;re researching your own state, our state education pages — like{" "}
            <Link href="/debt-relief/texas">debt relief in Texas</Link> — are built for that
            first orientation.
          </p>

          <h2>A worked example: Maria&rsquo;s collection letter</h2>
          <p>
            A fictional scenario, because abstractions land better with names attached. Maria,
            in Dallas, gets a letter from &ldquo;Meridian Recovery Group&rdquo; about a
            $4,830 credit card debt from a bank she hasn&rsquo;t used in years. The letter
            demands payment within ten days. Her instincts say pay something to make it stop;
            the playbook says otherwise.
          </p>
          <ol>
            <li><strong>She identifies the animal.</strong> Meridian isn&rsquo;t her bank — it&rsquo;s a third party, so FDCPA rules apply in full.</li>
            <li><strong>She requests validation in writing</strong> within the window, keeping a copy. Collection on the debt generally must pause pending verification.</li>
            <li><strong>She checks her credit reports</strong> at the free official source: the original account shows a 2019 delinquency date.</li>
            <li><strong>She considers the clock qualitatively.</strong> A debt this old <em>may</em> be near or past her state&rsquo;s limitation period — a question for verification and, if it heads to court, for a Texas-licensed attorney, not for guesswork.</li>
            <li><strong>She makes no payment and no promises</strong> until the paper trail is complete — because in some states even a small payment can restart the clock.</li>
          </ol>
          <p>
            Whatever the eventual resolution — validated and settled, disputed and deleted, or
            time-barred and declined — every branch of Maria&rsquo;s tree goes better because
            she moved the conversation to paper and verified before paying. That&rsquo;s the
            whole lesson, transferable to any letter from any collector in any state.
          </p>

          <h2>Every major debt option, honestly compared</h2>
          <p>
            Once you know your rights, the second question is strategy: what do you actually{" "}
            <em>do</em> about the debt? There are six mainstream answers, and none of them is
            universally right — which is why every row below links the free calculator that
            prices it for your numbers instead of ours.
          </p>

          <div className="not-prose overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl border border-border text-sm">
              <caption className="sr-only">Comparison of major debt relief and payoff options</caption>
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th scope="col" className="border-b border-border p-3 font-semibold">Option</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">How it works</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">Typical fit</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">Main trade-offs</th>
                  <th scope="col" className="border-b border-border p-3 font-semibold">Price it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Structured payoff (snowball / avalanche / hybrid)</td>
                  <td className="border-b border-border p-3">Repay in a deliberate order with a fixed extra payment.</td>
                  <td className="border-b border-border p-3">Repayment is realistic; income is stable.</td>
                  <td className="border-b border-border p-3">Requires monthly margin and persistence; no balance reduction.</td>
                  <td className="border-b border-border p-3"><Link href="/financial-tools/debt-freedom-planner" className="text-primary underline">Debt Freedom Planner</Link></td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Debt consolidation loan</td>
                  <td className="border-b border-border p-3">One fixed-rate personal loan repays everything; one payment remains.</td>
                  <td className="border-b border-border p-3">Fair credit or better; DTI still workable.</td>
                  <td className="border-b border-border p-3">Approval required; the habit that built the balances must change too.</td>
                  <td className="border-b border-border p-3"><Link href="/financial-tools/personal-loan-calculator" className="text-primary underline">Personal Loan Calculator</Link></td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Debt management plan (DMP)</td>
                  <td className="border-b border-border p-3">Nonprofit credit counseling negotiates lower APRs into one payment.</td>
                  <td className="border-b border-border p-3">Steady income; wants structure without a new loan.</td>
                  <td className="border-b border-border p-3">Cards typically closed; 3–5 year commitment; small monthly fee.</td>
                  <td className="border-b border-border p-3"><Link href="/financial-tools/debt-solutions-comparison" className="text-primary underline">Debt Solutions Comparison</Link></td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Debt settlement</td>
                  <td className="border-b border-border p-3">Negotiate eligible unsecured balances for less than owed.</td>
                  <td className="border-b border-border p-3">Full repayment isn't realistic; hardship is genuine.</td>
                  <td className="border-b border-border p-3">Typically requires delinquency; significant credit impact; forgiven amounts can be taxable; fees only after settlement.</td>
                  <td className="border-b border-border p-3"><Link href="/debt-settlement-calculator" className="text-primary underline">Settlement Calculator</Link></td>
                </tr>
                <tr>
                  <td className="border-b border-border p-3 font-medium">Mortgage refinance (homeowners)</td>
                  <td className="border-b border-border p-3">Lower the housing payment; redirect freed dollars at debt.</td>
                  <td className="border-b border-border p-3">Homeowner, ~640+ credit zone, workable DTI.</td>
                  <td className="border-b border-border p-3">Closing costs and break-even math; term resets can raise lifetime cost.</td>
                  <td className="border-b border-border p-3"><Link href="/financial-tools/mortgage-refinance-calculator" className="text-primary underline">Refinance Calculator</Link></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Bankruptcy (Ch. 7 / Ch. 13)</td>
                  <td className="p-3">Court process that discharges or restructures debts under federal law.</td>
                  <td className="p-3">Debts far exceed any realistic repayment; other paths priced out.</td>
                  <td className="p-3">Long credit impact; attorney guidance essential — beyond this page's educational scope.</td>
                  <td className="p-3">Consult a bankruptcy attorney</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Which option fits which goal? A decision shortcut</h3>
          <ul>
            <li><strong>Stop collection pressure fastest →</strong> written validation + contact-limitation rights first; then choose the repayment or settlement path the math supports.</li>
            <li><strong>Lowest monthly payment →</strong> compare a longer-term <Link href="/financial-tools/personal-loan-calculator">consolidation loan</Link>, a DMP, and settlement deposits side by side — three very different prices for &ldquo;lower.&rdquo;</li>
            <li><strong>Cheapest total cost →</strong> usually avalanche with a real extra payment; the <Link href="/financial-tools/debt-freedom-planner">Debt Freedom Planner</Link> proves it against five alternatives.</li>
            <li><strong>Protect or rebuild credit →</strong> paths that build unbroken on-time history: structured payoff, consolidation, DMP. Track the ratio side with the <Link href="/financial-tools/dti-calculator">DTI Calculator</Link>.</li>
            <li><strong>Qualify for a mortgage →</strong> lenders weigh BOTH credit and DTI — clear whole payments, protect history, and pressure-test readiness with the <Link href="/financial-tools/financial-health-score">Financial Health Score</Link>.</li>
            <li><strong>Genuine hardship, repayment unrealistic →</strong> price settlement transparently, understand its trade-offs, and compare before enrolling anywhere.</li>
          </ul>

          <h2>The numbers that decide your options: DTI, budget, and the cushion</h2>
          <h3>Debt-to-income: the gatekeeper ratio</h3>
          <p>
            Nearly every door above checks your <strong>debt-to-income ratio</strong> — monthly
            debt payments divided by gross monthly income. Under ~36% is broadly healthy;
            36–43% is workable-but-selective; above ~43% many lending doors narrow, and above
            50% the priority usually flips from borrowing to reducing. The leverage insight
            most people miss: DTI responds to <em>eliminated payments</em>, not shrinking
            balances — clearing one whole account moves it the same month. Get your exact
            figure with the <Link href="/financial-tools/dti-calculator">DTI Calculator</Link>,
            then watch what each strategy does to it inside the{" "}
            <Link href="/financial-tools/debt-freedom-planner">Debt Freedom Planner</Link>.
          </p>

          <h3>The budget is where every plan is funded</h3>
          <p>
            Settlement deposits, consolidation payments, extra snowball dollars — every option
            runs on monthly margin, and margin comes from a written budget. The{" "}
            <Link href="/financial-tools/budget-planner">Budget Planner</Link> maps all of it —
            income, twenty expense lines, a Budget Health Score with disclosed factors, a
            50/30/20 comparison without judgment, and a what-if simulator that finds the extra
            payment hiding in most budgets. Pair it with the{" "}
            <Link href="/financial-tools/debt-payoff-calculator">Debt Payoff Calculator</Link>{" "}
            to turn that margin into a month-by-month schedule with your exact balances.
          </p>

          <h3>The emergency fund is debt prevention</h3>
          <p>
            Federal Reserve household surveys keep finding the same dividing line: families
            who can absorb a modest surprise in cash, and families for whom the same surprise
            becomes a new balance. One month of expenses in reserve — before aggressive debt
            acceleration — is the milestone that keeps a repayment plan from being undone by
            the first flat tire. The <Link href="/financial-tools/financial-health-score">Financial
            Health Score</Link> weighs this cushion explicitly, because financial recovery is a
            whole-picture project, not just a payoff race.
          </p>

          <h2>Avoiding debt-relief scams: the pattern recognition guide</h2>
          <p>
            Financial stress attracts predators, and they follow scripts. Memorize the
            patterns and you&rsquo;re protected from most of them:
          </p>
          <h4>Warning signs</h4>
          <ul>
            <li><strong>Large upfront fees</strong> before any debt is settled — the FTC&rsquo;s rules generally ban advance fees for telemarketed debt settlement.</li>
            <li><strong>Guarantees</strong> of specific results (&ldquo;we&rsquo;ll cut your debt 60%, guaranteed&rdquo;) — no legitimate provider can promise outcomes.</li>
            <li><strong>&ldquo;Stop talking to your creditors&rdquo;</strong> as a blanket instruction — isolation serves the fee, not you.</li>
            <li><strong>Pressure to sign today</strong> — real options survive a night&rsquo;s sleep and a second opinion.</li>
            <li><strong>&ldquo;New government program&rdquo;</strong> claims with urgency and vagueness — check the CFPB or FTC directly instead.</li>
            <li><strong>Vague total cost</strong> — if nobody will put the all-in number in writing, the number is the problem.</li>
          </ul>
          <h4>Legitimacy signals</h4>
          <ul>
            <li>Fees tied to results and collected only after settlements occur.</li>
            <li>Written agreements, realistic ranges, and unprompted explanation of credit and tax trade-offs.</li>
            <li>Clean records with your state attorney general and searchable history in the CFPB complaint database.</li>
            <li>Willingness to say &ldquo;this option isn&rsquo;t your best fit&rdquo; — sellers of one product rarely say it; educators do.</li>
          </ul>

          <h2>Debt collection myths, corrected</h2>
          <ul>
            <li><strong>&ldquo;A charge-off means I no longer owe it.&rdquo;</strong> No — it&rsquo;s the creditor&rsquo;s accounting event. The debt survives and is usually sold or placed for collection.</li>
            <li><strong>&ldquo;Paying an old collection always boosts my score.&rdquo;</strong> Not automatically — effects vary by scoring model and account age. Verify first, negotiate terms in writing, and know why you&rsquo;re paying before you pay.</li>
            <li><strong>&ldquo;Collectors can have me arrested.&rdquo;</strong> Consumer debt isn&rsquo;t a crime, and threatening arrest is itself a classic FDCPA violation. (Ignoring a court order in a lawsuit is a separate matter — another reason court papers always get a response.)</li>
            <li><strong>&ldquo;If I ignore them long enough, it all goes away.&rdquo;</strong> The calls may pause; the debt, the credit reporting, and the lawsuit window don&rsquo;t. Engagement on paper beats avoidance every time.</li>
            <li><strong>&ldquo;Small good-faith payments always show cooperation and help me.&rdquo;</strong> On old debt, a partial payment can restart the limitation clock in some states — the opposite of helping. Verify age and status first.</li>
            <li><strong>&ldquo;Debt settlement is either a scam or a magic fix.&rdquo;</strong> Neither — it&rsquo;s a real, regulated, trade-off-heavy tool for a specific situation, which is why we <Link href="/debt-settlement-calculator">price it transparently</Link> instead of preaching for or against it.</li>
          </ul>

          <h2>Your first-week action plan when debt pressure hits</h2>
          <ol>
            <li><strong>Inventory everything.</strong> Every balance, creditor, status, and monthly minimum — one page, one folder for every letter.</li>
            <li><strong>Protect the essentials.</strong> Housing, utilities, food, and transportation are paid first; unsecured creditors are negotiated with, not prioritized over shelter.</li>
            <li><strong>Move contested debts to paper.</strong> Validation requests for any collector, disputes for any inaccuracy — written, copied, dated.</li>
            <li><strong>Learn your two numbers.</strong> Your exact <Link href="/financial-tools/dti-calculator">DTI</Link> and your real monthly margin from the <Link href="/financial-tools/budget-planner">Budget Planner</Link> — every option is priced in those two currencies.</li>
            <li><strong>Compare before committing.</strong> Run the <Link href="/financial-tools/debt-freedom-planner">Debt Freedom Planner</Link> and the <Link href="/financial-tools/debt-solutions-comparison">Debt Solutions Comparison</Link>; take the printable summaries into any consultation.</li>
            <li><strong>Escalate the legal pieces to licensed help.</strong> Lawsuits, judgments, garnishment questions, and anything statute-of-limitations-shaped go to a consumer attorney or your state legal-aid program — early, not eventually.</li>
          </ol>

          <p>
            If your debt is concentrated where you live, our local education pages add
            city-level context — for example{" "}
            <Link href="/debt-settlement/houston">debt settlement in Houston</Link>,{" "}
            <Link href="/debt-settlement/dallas">Dallas</Link>, or{" "}
            <Link href="/debt-settlement/los-angeles">Los Angeles</Link> — alongside the
            state-level overviews like <Link href="/debt-relief/texas">Texas debt relief</Link>.
            And when you want the full landscape in one long read, the{" "}
            <Link href="/debt-relief-guide">Complete Debt Relief Guide</Link> is this
            page&rsquo;s companion cornerstone.
          </p>
        </div>

        <KeyTakeaway>
          <strong>Rights first, math second, signatures last.</strong> Validate before you
          pay, write before you call, and price at least two options with real numbers before
          you commit to any program. The collectors&rsquo; urgency is a tactic; your
          deliberateness is a right — and every calculator on this site exists so the math
          side of that deliberateness is free.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Paying a collector before validating the debt",
              reality:
                "Wrong amounts, wrong owners, and time-barred debts are common — and in some states a payment can restart the lawsuit clock. Written validation first is the single highest-value habit in all of debt collection.",
            },
            {
              mistake: "Ignoring court papers because 'it's just debt'",
              reality:
                "Missing the response deadline typically produces a default judgment — which can unlock garnishment and levies under state law. Court papers always get a response and, ideally, licensed eyes.",
            },
            {
              mistake: "Signing with the first debt-relief company that calls",
              reality:
                "Inbound urgency is a sales channel, not a credential. Compare at least two paths with independent math, check the CFPB complaint database, and remember: legitimate settlement fees come only after settlements.",
            },
            {
              mistake: "Treating the debt in isolation from the budget",
              reality:
                "Every option is funded by monthly margin. A plan chosen without a budget behind it fails on the first surprise expense — cushion first, then acceleration, is the order that survives real life.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/consumer-tools/debt-collection/" target="_blank" rel="noopener noreferrer">
              debt collection resource center
            </a>{" "}
            covers your federal rights, validation, and sample letters. The FTC&rsquo;s{" "}
            <a href="https://consumer.ftc.gov/articles/debt-collection-faqs" target="_blank" rel="noopener noreferrer">
              Debt Collection FAQs
            </a>{" "}
            explain the FDCPA in consumer language, and its{" "}
            <a href="https://consumer.ftc.gov/articles/how-get-out-debt" target="_blank" rel="noopener noreferrer">
              How to Get Out of Debt
            </a>{" "}
            guide covers settlement protections including the advance-fee rules. Your free
            official credit reports live at{" "}
            <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">
              AnnualCreditReport.com
            </a>
            , and the CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" target="_blank" rel="noopener noreferrer">
              debt-to-income explainer
            </a>{" "}
            covers the ratio this wizard estimates.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Price every payoff strategy for your numbers", href: "/financial-tools/debt-freedom-planner" },
            { label: "Get your exact DTI the way lenders compute it", href: "/financial-tools/dti-calculator" },
            { label: "Talk through your situation with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Consumer rights & debt collection questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
