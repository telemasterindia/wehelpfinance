import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { BlogPost, AUTHORS } from "@/components/BlogPost";
import { faqJsonLd, breadcrumbJsonLd, articleJsonLd } from "@/lib/schema";

const SLUG = "laid-off-drowning-in-debt";
const TITLE = "Laid Off and Drowning in Debt: Your Options in 2026";
const EXCERPT =
  "Losing your income while carrying credit card debt is one of the most stressful financial situations Americans face right now. Here's a clear-headed guide to your options.";
const PUBLISHED = "2026-06-24";
const AUTHOR = AUTHORS.research;

export const metadata: Metadata = {
  title: `${TITLE} | WeHelpFinance`,
  description: EXCERPT,
  alternates: { canonical: `https://www.wehelpfinance.com/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: EXCERPT,
    url: `https://www.wehelpfinance.com/blog/${SLUG}`,
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
    q: "Can I do debt settlement if I am unemployed?",
    a: "Yes. Unemployment is actually one of the qualifying circumstances that makes debt settlement more accessible. Creditors are more likely to settle accounts when a borrower can demonstrate genuine financial hardship. A specialist can evaluate your situation.",
  },
  {
    q: "What should I do with my credit cards after a layoff?",
    a: "Do not immediately stop all payments without a plan. Understand your severance timeline, file for unemployment immediately, and speak with a debt specialist early — while you still have options before accounts become severely delinquent.",
  },
  {
    q: "Can I defer my credit card payments during unemployment?",
    a: "Many credit card issuers offer hardship programs that allow temporary payment deferrals, reduced minimums, or waived interest. These programs are often not advertised — you have to call and ask specifically.",
  },
  {
    q: "How long do I have before my credit card accounts go to collections?",
    a: "Accounts typically go to collections after 90–180 days of non-payment. The timeline varies by creditor. Understanding this window is important for planning your next steps.",
  },
  {
    q: "Should I use my 401k to pay off credit card debt after a layoff?",
    a: "This is generally not advisable. Early 401k withdrawals trigger a 10% penalty plus income tax, meaning you might only receive 60–70 cents of every dollar withdrawn. This is usually more expensive than the alternatives, including debt settlement.",
  },
];

const TOC = [
  {
    id: "the-layoff-debt-intersection",
    label: "Why layoffs and debt create a unique crisis",
  },
  { id: "immediate-steps", label: "What to do in the first 30 days" },
  { id: "your-debt-options", label: "Your debt options during unemployment" },
  {
    id: "hardship-programs",
    label: "Hardship programs most people don't know about",
  },
  { id: "what-not-to-do", label: "What not to do after a layoff" },
  { id: "getting-help", label: "Getting qualified help early" },
];

const RELATED_ARTICLES = [
  {
    href: "/blog/what-happens-if-i-stop-paying-my-credit-cards",
    title: "What Happens If I Stop Paying My Credit Cards?",
    excerpt:
      "Understand the full timeline of consequences before making any decision.",
  },
  {
    href: "/blog/inflation-debt-crisis-middle-america",
    title: "How Inflation Created a Debt Crisis for Middle America",
    excerpt: "For many, the debt crisis started before the layoff.",
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
              { name: "Blog", path: "https://www.wehelpfinance.com/blog" },
              {
                name: TITLE,
                path: `https://www.wehelpfinance.com/blog/${SLUG}`,
              },
            ]),
          ),
        }}
      />
      <BlogPost
        title={TITLE}
        excerpt={EXCERPT}
        publishedDate={PUBLISHED}
        readingTime={9}
        author={AUTHOR}
        category="Research"
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
        Corporate layoffs reached significant levels in 2025 and 2026 across
        technology, finance, healthcare, and retail sectors. For workers who
        were already carrying credit card debt when the layoff happened, the
        situation creates a specific kind of financial emergency that requires a
        clear-headed response — not panic, and not avoidance.
      </p>
      <p>
        This guide is written for people who are currently in this situation, or
        who have recently been laid off and are trying to understand what their
        options are before things get worse.
      </p>

      <h2 id="the-layoff-debt-intersection">
        Why Layoffs and Debt Create a Unique Crisis
      </h2>
      <p>
        Losing income while carrying high-interest debt is uniquely difficult
        because of how quickly the situation compounds. Unlike a mortgage or car
        loan, credit card debt has no secured asset attached to it — the
        creditor's primary leverage is your credit score, collection calls, and
        ultimately the courts.
      </p>
      <p>
        When income stops, the math shifts dramatically. A $400/month minimum
        payment that was 10% of take-home pay becomes an impossible demand on
        unemployment benefits. Most people respond by prioritizing housing and
        food — which is correct — while credit card payments fall behind.
      </p>
      <p>
        The problem is that without a plan, the debt continues to grow. Interest
        accrues daily. Late fees add up. And the window for certain options —
        like enrolling in a debt management plan without significant credit
        damage — narrows with each passing month.
      </p>

      <h2 id="immediate-steps">What to Do in the First 30 Days</h2>
      <p>
        The first month after a layoff is the most important for debt
        management. Here is what to prioritize:
      </p>
      <p>
        <strong>File for unemployment benefits immediately.</strong> Do not
        wait. Every week of delay is income you cannot get back. In most states,
        there is a waiting period before payments begin, so filing on day one is
        critical.
      </p>
      <p>
        <strong>Take a clear inventory of your debt.</strong> Write down every
        account, the balance, the APR, and the minimum payment. Understanding
        your full picture is essential before you can make good decisions.
      </p>
      <p>
        <strong>
          Contact your credit card companies before you miss a payment.
        </strong>{" "}
        This is counterintuitive to many people, but calling before you miss a
        payment gives you more options than calling after. Ask specifically
        about hardship programs, payment deferrals, and temporary interest rate
        reductions.
      </p>
      <p>
        <strong>Do not close accounts.</strong> Closing credit accounts reduces
        your available credit and can hurt your credit score. Keep accounts open
        even if you cannot use them.
      </p>
      <p>
        <strong>Prioritize housing and utilities above credit cards.</strong>{" "}
        This is financially sound. Credit card debt is unsecured — creditors
        have limited immediate leverage compared to your landlord or utility
        company.
      </p>

      <h2 id="your-debt-options">Your Debt Options During Unemployment</h2>
      <p>
        The options available to you depend on how much debt you carry, how long
        you expect the income gap to last, and what resources you have
        available.
      </p>
      <p>
        <strong>
          If your job loss is temporary (less than 3 months expected):
        </strong>{" "}
        Hardship programs, payment deferrals, and drawing on savings are the
        primary tools. The goal is to get through the gap with minimal credit
        damage and resume normal payments when income resumes.
      </p>
      <p>
        <strong>If your job search is expected to take 3–6+ months:</strong> You
        will likely need a more structured approach. Accounts will start
        becoming delinquent. A debt management plan or debt settlement program
        may be worth evaluating — the earlier you engage with these options, the
        more choices you have.
      </p>
      <p>
        <strong>If your income drop is permanent or long-term:</strong> Debt
        settlement becomes significantly more relevant. Creditors know that
        someone who has experienced a genuine income disruption may not be able
        to pay the full balance, and they adjust their negotiating position
        accordingly.
      </p>

      <h2 id="hardship-programs">
        Hardship Programs Most People Don't Know About
      </h2>
      <p>
        Credit card companies do not advertise their hardship programs, but most
        major issuers have them. These programs vary significantly by issuer,
        but common offerings include:
      </p>
      <ul>
        <li>
          Temporary interest rate reductions — some issuers will drop rates to
          0% for 3–6 months for qualifying hardship cases
        </li>
        <li>
          Minimum payment deferrals — a pause on minimum payment requirements
          for one to three months
        </li>
        <li>Waived late fees during a defined hardship period</li>
        <li>
          Structured repayment plans at reduced rates for borrowers who cannot
          afford current minimums
        </li>
      </ul>
      <p>
        To access these programs, call the number on the back of your card. Ask
        specifically for the hardship department or financial hardship program.
        Explain your situation factually — job loss date, whether you are
        receiving unemployment benefits, your monthly shortfall. The
        representative you speak with will typically have specific authority to
        offer arrangements that are not available through normal customer
        service.
      </p>
      <p>
        These programs will not solve a large debt problem, but they can buy you
        time without the credit damage of simply missing payments.
      </p>

      <h2 id="what-not-to-do">What Not to Do After a Layoff</h2>
      <p>
        Several common instincts after a layoff make the financial situation
        worse:
      </p>
      <p>
        <strong>Do not use retirement savings to pay credit card debt.</strong>{" "}
        Early 401k withdrawals are taxed as ordinary income and incur a 10%
        penalty. Depending on your tax bracket, you could lose 30–40% of the
        withdrawal immediately. This almost never makes mathematical sense
        compared to debt settlement.
      </p>
      <p>
        <strong>
          Do not take out a payday loan or high-rate personal loan to cover
          credit card minimums.
        </strong>{" "}
        Swapping credit card debt at 22% for a payday loan at 300–400% APR is
        not a solution. It accelerates the crisis.
      </p>
      <p>
        <strong>
          Do not ignore the situation and assume it will resolve itself.
        </strong>{" "}
        Credit card debt does not go away. The accounts continue accumulating
        interest and fees. The window for certain options closes. Proactive
        engagement — even difficult conversations with creditors or debt
        specialists — consistently produces better outcomes than avoidance.
      </p>
      <p>
        <strong>Do not make financial decisions out of shame.</strong> Layoffs
        and financial difficulty are not personal failures — they are economic
        circumstances that millions of Americans face. The decisions you make in
        the next 30–90 days will have real consequences; make them from
        information, not from shame.
      </p>

      <h2 id="getting-help">Getting Qualified Help Early</h2>
      <p>
        The most consistent piece of advice from people who have been through
        this situation: get qualified help earlier than feels necessary. The
        options available to someone who contacts a debt specialist one month
        after a layoff are meaningfully better than the options available to
        someone who waits six months and has four accounts in collections.
      </p>
      <p>
        A free consultation with a vetted debt specialist typically covers your
        full debt picture, what programs you qualify for, realistic estimates of
        what each option would cost and how long it would take, and the credit
        implications of different paths forward.
      </p>
      <p>
        There is no obligation to enroll in anything after that conversation.
        But the information you gain from it — specific to your situation, not
        generic — is genuinely useful for making the decisions that are coming.
      </p>
    </>
  );
}
