import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { BlogPost, AUTHORS } from "@/components/BlogPost";
import { faqJsonLd, breadcrumbJsonLd, articleJsonLd } from "@/lib/schema";

const SLUG = "fdcpa-rights";
const TITLE = "Your FDCPA Rights: What Debt Collectors Can and Cannot Do";
const EXCERPT =
  "The Fair Debt Collection Practices Act gives you powerful protections against abusive, deceptive, and unfair debt collection. Here is a complete guide to what collectors can and cannot legally do.";
const PUBLISHED = "2026-06-24";
const AUTHOR = AUTHORS.financial_education;

export const metadata: Metadata = {
  title: `${TITLE} | WeHelpFinance`,
  description: EXCERPT,
  alternates: { canonical: `https://www.wehelpfinance.com/fdcpa-rights` },
  openGraph: {
    title: TITLE,
    description: EXCERPT,
    url: `https://www.wehelpfinance.com/fdcpa-rights`,
    type: "article",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: EXCERPT,
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the FDCPA?",
    a: "The Fair Debt Collection Practices Act (FDCPA) is a federal law passed in 1977 that governs the behavior of third-party debt collectors. It prohibits abusive, deceptive, and unfair collection practices and gives consumers specific rights including the right to validation, the right to cease contact, and the right to sue collectors who violate the law.",
  },
  {
    q: "What hours can debt collectors call?",
    a: "Under the FDCPA, debt collectors cannot call you before 8 a.m. or after 9 p.m. in your local time zone. Calling outside these hours is an FDCPA violation.",
  },
  {
    q: "Can a debt collector call my workplace?",
    a: "Debt collectors can contact you at work unless you tell them your employer prohibits such calls. If you inform a collector — verbally or in writing — that your employer does not allow personal calls at work, the collector must stop calling you there.",
  },
  {
    q: "Can a debt collector contact my family or friends about my debt?",
    a: "Collectors may contact third parties — family, friends, neighbors — but only to locate you (find your contact information). They cannot discuss the details of your debt with anyone other than you, your spouse, or your attorney.",
  },
  {
    q: "Can I tell a debt collector to stop contacting me?",
    a: "Yes. Under the FDCPA, you can send a written cease communication request, and the collector must stop contacting you except to inform you of specific actions they intend to take (such as filing a lawsuit). Note: this stops contact, but does not eliminate the debt.",
  },
  {
    q: "What can I do if a debt collector violates the FDCPA?",
    a: "You can file a complaint with the CFPB at consumerfinance.gov and with the FTC at ftc.gov. You can also sue the collector in federal or state court. Successful FDCPA plaintiffs can recover actual damages, up to $1,000 in statutory damages, and attorney's fees — meaning many consumer rights attorneys take these cases on contingency.",
  },
  {
    q: "Does the FDCPA apply to original creditors?",
    a: "Generally, no. The FDCPA applies to third-party debt collectors — companies hired to collect on behalf of creditors or companies that have purchased debt. Original creditors collecting their own debt are not covered by the FDCPA, though many states have their own debt collection laws that extend similar protections.",
  },
  {
    q: "Can a debt collector threaten to sue me?",
    a: "A collector can tell you they intend to file a lawsuit if they actually intend to and have the legal authority to do so. However, threatening legal action they do not intend to take, or that they cannot legally pursue, is an FDCPA violation.",
  },
];

const TOC = [
  { id: "what-is-the-fdcpa", label: "What is the FDCPA?" },
  { id: "who-is-covered", label: "Who is covered by the FDCPA?" },
  { id: "what-collectors-cannot-do", label: "What debt collectors cannot do" },
  {
    id: "contact-rules",
    label: "Contact rules: when and how collectors can reach you",
  },
  { id: "what-collectors-must-do", label: "What collectors must do" },
  { id: "your-rights-in-writing", label: "Using your rights in writing" },
  { id: "how-to-report-violations", label: "How to report FDCPA violations" },
  { id: "fdcpa-and-debt-relief", label: "FDCPA rights and debt relief" },
];

const RELATED_ARTICLES = [
  {
    href: "/debt-validation",
    title:
      "Debt Validation: Your Legal Right to Verify Any Debt Before You Pay",
    excerpt:
      "How to require a collector to prove the debt before you take action.",
  },
  {
    href: "/debt-validation-letter",
    title: "Debt Validation Letter: A Complete Template and Guide",
    excerpt:
      "The exact letter to send a debt collector to invoke your validation rights.",
  },
  {
    href: "/collection-agency-rights",
    title: "Collection Agency Rights: What They Can and Cannot Do",
    excerpt:
      "A detailed look at the authority — and limits — of collection agencies.",
  },
];

const RELATED_SERVICES = [
  { href: "/debt-relief", label: "Debt Relief Overview" },
  { href: "/debt-settlement", label: "Debt Settlement" },
  { href: "/debt-consolidation", label: "Debt Consolidation" },
  { href: "/personal-loans", label: "Personal Loans" },
  { href: "/tax-relief", label: "Tax Relief" },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: TITLE,
              excerpt: EXCERPT,
              published: PUBLISHED,
              slug: SLUG,
              author: AUTHOR.name,
              path: "/fdcpa-rights",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              {
                name: "Consumer Rights",
                path: "https://www.wehelpfinance.com/consumer-rights",
              },
              {
                name: "FDCPA Rights",
                path: "https://www.wehelpfinance.com/fdcpa-rights",
              },
            ]),
          ),
        }}
      />
      <BlogPost
        canonicalPath="/fdcpa-rights"
        sectionLabel="Consumer Rights"
        sectionHref="/consumer-rights"
        title={TITLE}
        excerpt={EXCERPT}
        publishedDate={PUBLISHED}
        readingTime={10}
        author={AUTHOR}
        category="Consumer Rights"
        slug={SLUG}
        toc={TOC}
        faqs={FAQS}
        relatedArticles={RELATED_ARTICLES}
        relatedServices={RELATED_SERVICES}
        content={<Content />}
      />
    </>
  );
}

function Content() {
  return (
    <>
      <p>
        Dealing with debt collectors is stressful under any circumstances. But
        many of the tactics collectors use — calling repeatedly, threatening
        legal action, contacting family members, using aggressive or misleading
        language — are not just unpleasant. Many are illegal.
      </p>
      <p>
        The Fair Debt Collection Practices Act (FDCPA) is a federal law that
        gives consumers specific, enforceable rights when dealing with
        third-party debt collectors. Understanding these rights does not make
        the debt disappear, but it fundamentally changes the dynamic of every
        interaction you have with a collector — because you know what they can
        legally do, and what they cannot.
      </p>

      <h2 id="what-is-the-fdcpa">What Is the FDCPA?</h2>
      <p>
        The Fair Debt Collection Practices Act was enacted by Congress in 1977
        in response to widespread abusive debt collection practices. It is
        codified at 15 U.S.C. § 1692 and is enforced by the Consumer Financial
        Protection Bureau (CFPB) and, historically, by the Federal Trade
        Commission (FTC).
      </p>
      <p>
        The FDCPA prohibits abusive, deceptive, and unfair debt collection
        practices and establishes consumer rights including the right to request
        validation of a debt, the right to require collectors to cease contact,
        and the right to sue collectors who violate the law.
      </p>
      <p>
        In 2021, the CFPB issued Regulation F, which updated and clarified
        certain FDCPA requirements — including new rules about electronic
        communications (email and text messages), which are now permissible
        under specific conditions.
      </p>

      <h2 id="who-is-covered">Who Is Covered by the FDCPA?</h2>
      <p>
        The FDCPA applies to "debt collectors" as defined by the law — meaning
        third parties collecting debts on behalf of someone else, or companies
        that have purchased debts for collection. This includes:
      </p>
      <ul>
        <li>Collection agencies hired by original creditors</li>
        <li>Debt buyers who purchase charged-off accounts</li>
        <li>
          Attorneys who regularly collect debts as a significant part of their
          practice
        </li>
        <li>Companies that collect debts for other businesses</li>
      </ul>
      <p>
        The FDCPA generally does not cover original creditors collecting their
        own debts — meaning if your credit card company's own internal
        collections department calls you, those calls may not be subject to
        FDCPA rules. However, once a debt is transferred to a third party, the
        FDCPA applies.
      </p>
      <p>
        Many states have their own debt collection laws that extend FDCPA-style
        protections to original creditors and provide consumers with additional
        rights beyond the federal minimum.
      </p>

      <h2 id="what-collectors-cannot-do">What Debt Collectors Cannot Do</h2>
      <p>
        The FDCPA contains specific prohibitions on collector behavior. The
        following are illegal:
      </p>
      <p>
        <strong>Harassment and abuse:</strong>
      </p>
      <ul>
        <li>
          Threatening violence or harm to you, your reputation, or your property
        </li>
        <li>Using obscene or profane language</li>
        <li>
          Publishing your name on a "deadbeat list" (except to credit bureaus)
        </li>
        <li>
          Calling repeatedly or continuously with intent to annoy, abuse, or
          harass
        </li>
        <li>Failing to identify themselves as debt collectors when asked</li>
      </ul>
      <p>
        <strong>False or misleading representations:</strong>
      </p>
      <ul>
        <li>Falsely claiming to be an attorney or government representative</li>
        <li>Misrepresenting the amount of the debt</li>
        <li>Falsely claiming you committed a crime</li>
        <li>
          Threatening arrest or imprisonment for not paying a debt (debt is a
          civil matter, not criminal)
        </li>
        <li>
          Threatening to take legal action they cannot legally take or do not
          intend to take
        </li>
        <li>
          Using false, deceptive, or misleading statements to collect a debt
        </li>
      </ul>
      <p>
        <strong>Unfair practices:</strong>
      </p>
      <ul>
        <li>
          Collecting amounts not authorized by the original agreement or by law
        </li>
        <li>Depositing a post-dated check before its date</li>
        <li>Threatening to take your property unless they can legally do so</li>
        <li>
          Communicating by postcard (which would expose your debt situation to
          anyone handling the mail)
        </li>
        <li>
          Using deceptive envelopes that appear to be from government agencies
        </li>
      </ul>

      <h2 id="contact-rules">
        Contact Rules: When and How Collectors Can Reach You
      </h2>
      <p>
        The FDCPA establishes specific rules about when and how debt collectors
        can contact you:
      </p>
      <p>
        <strong>Time restrictions:</strong> Collectors cannot contact you before
        8 a.m. or after 9 p.m. in your local time zone. Calls outside these
        hours are FDCPA violations regardless of the reason for the call.
      </p>
      <p>
        <strong>Workplace contact:</strong> Collectors can contact you at work
        unless you inform them that your employer prohibits such calls. Once
        notified, they must stop calling you at your place of employment.
      </p>
      <p>
        <strong>Third-party contact:</strong> Collectors may contact third
        parties — family, neighbors, employers — but only to locate you (find
        your contact information). They cannot reveal that they are attempting
        to collect a debt or discuss any details of your account with third
        parties. They can only ask for your address and phone number.
      </p>
      <p>
        <strong>Attorney representation:</strong> If you have an attorney who is
        representing you regarding the debt, the collector must contact the
        attorney directly and cannot contact you unless the attorney fails to
        respond within a reasonable time.
      </p>
      <p>
        <strong>Electronic communications:</strong> Under Regulation F,
        collectors may contact you by email or text message under specific
        conditions, including providing clear opt-out mechanisms. You can opt
        out of electronic communications.
      </p>

      <h2 id="what-collectors-must-do">What Collectors Must Do</h2>
      <p>
        The FDCPA does not only restrict what collectors can do — it also
        requires certain affirmative actions:
      </p>
      <p>
        <strong>Send a validation notice:</strong> Within five days of first
        contacting you, a collector must send you a written notice containing
        the amount of the debt, the name of the creditor, and a statement of
        your right to dispute the debt and request validation within 30 days.
      </p>
      <p>
        <strong>Identify themselves:</strong> Collectors must identify
        themselves as debt collectors in every communication with you. They
        cannot pretend to be someone else.
      </p>
      <p>
        <strong>Respond to validation requests:</strong> If you request
        validation within the 30-day window, the collector must provide
        verification of the debt before continuing collection activity.
      </p>
      <p>
        <strong>Honor cease contact requests:</strong> If you send a written
        request for the collector to stop contacting you, they must honor it —
        with narrow exceptions for informing you of specific intended legal
        actions.
      </p>
      <p>
        <strong>Stop collection during disputes:</strong> If you dispute a debt
        in writing within the 30-day window, the collector must obtain and mail
        you verification before resuming collection.
      </p>

      <h2 id="your-rights-in-writing">Using Your Rights in Writing</h2>
      <p>
        The most effective way to use your FDCPA rights is always in writing,
        sent via certified mail with return receipt. Oral requests — telling a
        collector on the phone to stop calling — do not carry the same legal
        weight as written requests.
      </p>
      <p>Two key written requests you should know about:</p>
      <p>
        <strong>Debt validation request:</strong> Sent within 30 days of the
        initial validation notice, this letter requires the collector to prove
        the debt before continuing collection. See our{" "}
        <a href="/debt-validation-letter">debt validation letter template</a>{" "}
        for the exact language to use.
      </p>
      <p>
        <strong>Cease communication request:</strong> A letter telling the
        collector to stop all contact. After receiving this, they can only
        contact you to inform you of specific intended actions (like filing a
        lawsuit). This does not eliminate the debt, but it stops the contact.
      </p>
      <p>
        Keep copies of everything you send and receive. The documentation trail
        matters if you need to file a complaint or pursue legal action later.
      </p>

      <h2 id="how-to-report-violations">How to Report FDCPA Violations</h2>
      <p>If a debt collector violates the FDCPA, you have several options:</p>
      <p>
        <strong>File a complaint with the CFPB:</strong> The Consumer Financial
        Protection Bureau accepts complaints about debt collectors at
        consumerfinance.gov/complaint. The CFPB sends complaints to the company
        and publishes complaint data in a public database.
      </p>
      <p>
        <strong>File a complaint with your state attorney general:</strong> Most
        state attorneys general have consumer protection divisions that handle
        debt collection complaints. States with their own debt collection laws
        can take enforcement action under state law in addition to the federal
        FDCPA.
      </p>
      <p>
        <strong>Consult a consumer rights attorney:</strong> The FDCPA allows
        consumers to sue debt collectors in federal or state court. Successful
        plaintiffs can recover:
      </p>
      <ul>
        <li>Actual damages (for real harm caused by the violation)</li>
        <li>Statutory damages up to $1,000 per lawsuit (not per violation)</li>
        <li>Attorney's fees and court costs</li>
      </ul>
      <p>
        Because the FDCPA provides for attorney's fees, many consumer rights
        attorneys take FDCPA cases on contingency — meaning you pay nothing
        unless you win. An initial consultation with a consumer rights attorney
        is typically free.
      </p>

      <h2 id="fdcpa-and-debt-relief">FDCPA Rights and Debt Relief</h2>
      <p>
        Understanding your FDCPA rights changes how you interact with
        collectors, but it does not change the underlying financial reality of
        the debt. Even if a collector has violated the FDCPA — and you have
        grounds for a legal claim — the debt itself may still be valid and
        collectible.
      </p>
      <p>
        For many consumers, the most effective path forward combines FDCPA
        knowledge with a clear assessment of their overall debt situation.
        Knowing your rights helps you:
      </p>
      <ul>
        <li>
          Stop abusive collection activity while you evaluate your options
        </li>
        <li>Avoid making payments on debts you have not verified</li>
        <li>Negotiate from a position of knowledge rather than fear</li>
        <li>
          Identify collection activity that may itself be a source of legal
          remedies
        </li>
      </ul>
      <p>
        If you have validated debts that you are struggling to pay, a free
        consultation with a debt relief specialist can help you understand what
        structured relief options — debt settlement, consolidation, or other
        programs — might be available for your situation.
      </p>
    </>
  );
}
