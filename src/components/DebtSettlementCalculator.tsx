"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Calculator, DollarSign,
  TrendingDown, Clock, AlertCircle, CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;
type Result = {
  settlementLow: number;
  settlementHigh: number;
  feeLow: number;
  feeHigh: number;
  totalLow: number;
  totalHigh: number;
  savingsLow: number;
  savingsHigh: number;
  monthlyDeposit: number;
  programMonths: number;
  minimumPayoffYears: number;
  minimumTotalCost: number;
  recommendation: "settlement" | "personal-loan" | "dmp" | "consult";
  recommendationLabel: string;
  recommendationNote: string;
};

// ─── Calculation engine ───────────────────────────────────────────────────────
function calculate(debt: number, creditScore: number, delinquency: string, income: number): Result {
  // Settlement percentage depends on delinquency stage
  // Based on industry averages from AFCC data
  const settlePctLow = delinquency === "current" ? 0.50 :
    delinquency === "30-60" ? 0.45 :
    delinquency === "60-120" ? 0.40 :
    delinquency === "120-180" ? 0.38 : 0.35;
  const settlePctHigh = delinquency === "current" ? 0.65 :
    delinquency === "30-60" ? 0.58 :
    delinquency === "60-120" ? 0.55 :
    delinquency === "120-180" ? 0.50 : 0.48;

  const settlementLow = Math.round(debt * settlePctLow);
  const settlementHigh = Math.round(debt * settlePctHigh);
  const feeLow = Math.round(debt * 0.15);
  const feeHigh = Math.round(debt * 0.25);
  const totalLow = settlementLow + feeLow;
  const totalHigh = settlementHigh + feeHigh;
  const savingsLow = debt - totalHigh;
  const savingsHigh = debt - totalLow;

  // Program duration: 24–48 months
  const programMonths = debt < 20000 ? 28 : debt < 40000 ? 36 : 48;
  const monthlyDeposit = Math.round((settlementHigh + feeHigh) / programMonths);

  // Minimum payment comparison (2% of balance, 22% APR)
  const minimumPayoffYears = Math.round(debt * 0.0034); // rough calc
  const minimumTotalCost = Math.round(debt * 2.5); // roughly 2.5x at 22% APR minimum payments

  // Recommendation logic
  let recommendation: Result["recommendation"];
  let recommendationLabel: string;
  let recommendationNote: string;

  if (creditScore >= 660 && delinquency === "current" && debt <= 40000) {
    recommendation = "personal-loan";
    recommendationLabel = "Personal Loan for Debt Consolidation";
    recommendationNote = "Your credit score and account status suggest you may qualify for a personal loan at a lower interest rate — which could save money without the credit impact of settlement.";
  } else if (creditScore >= 580 && delinquency !== "120-180" && delinquency !== "180+" && debt < 20000) {
    recommendation = "dmp";
    recommendationLabel = "Debt Management Plan (DMP)";
    recommendationNote = "A nonprofit debt management plan may allow you to pay the full balance at significantly reduced interest rates (6–9%) without missing payments.";
  } else if (debt >= 10000 && income >= 2000) {
    recommendation = "settlement";
    recommendationLabel = "Debt Settlement Program";
    recommendationNote = "Based on your debt level and delinquency status, debt settlement is likely a realistic option. A specialist can negotiate with your creditors to accept significantly less than you owe.";
  } else {
    recommendation = "consult";
    recommendationLabel = "Free Specialist Consultation";
    recommendationNote = "Your situation has some nuances that are best evaluated by a specialist. A free consultation will clarify which options are realistically available.";
  }

  return {
    settlementLow, settlementHigh,
    feeLow, feeHigh,
    totalLow, totalHigh,
    savingsLow, savingsHigh,
    monthlyDeposit, programMonths,
    minimumPayoffYears, minimumTotalCost,
    recommendation, recommendationLabel, recommendationNote,
  };
}

const fmt = (n: number) => `$${n.toLocaleString()}`;

// ─── Main Calculator Component ────────────────────────────────────────────────
export function DebtSettlementCalculator() {
  const [step, setStep] = useState<Step>(1);
  const [debt, setDebt] = useState<number>(0);
  const [debtInput, setDebtInput] = useState("");
  const [creditScore, setCreditScore] = useState<number>(580);
  const [delinquency, setDelinquency] = useState("");
  const [income, setIncome] = useState<number>(0);
  const [incomeInput, setIncomeInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const r = calculate(debt, creditScore, delinquency, income);
    setResult(r);
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-3">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 flex-1 transition-colors ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Debt details */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-semibold">Tell us about your debt</h2>
            <p className="mt-2 text-muted-foreground text-sm">We'll use this to estimate what settlement could save you.</p>
          </div>

          {/* Total debt */}
          <div>
            <label className="block text-sm font-medium mb-2">Total unsecured debt (credit cards, personal loans, medical bills)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                placeholder="25,000"
                value={debtInput}
                onChange={(e) => {
                  setDebtInput(e.target.value);
                  setDebt(parseInt(e.target.value) || 0);
                }}
                className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {debt > 0 && debt < 10000 && (
              <p className="mt-2 text-sm text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Debt settlement is typically most cost-effective for $10,000+ in debt. You may be better served by a personal loan or debt management plan.
              </p>
            )}
          </div>

          {/* Delinquency */}
          <div>
            <label className="block text-sm font-medium mb-2">How current are you on payments?</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { value: "current", label: "Current (not behind)", sub: "Up to date" },
                { value: "30-60", label: "30–60 days late", sub: "1–2 missed payments" },
                { value: "60-120", label: "60–120 days late", sub: "Best for settlement" },
                { value: "120-180", label: "120–180 days late", sub: "Pre-charge-off" },
                { value: "180+", label: "180+ days / Charged off", sub: "In collections" },
                { value: "unsure", label: "Not sure", sub: "We can help" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDelinquency(opt.value)}
                  className={`flex flex-col rounded-xl border px-4 py-3 text-left text-sm transition ${
                    delinquency === opt.value
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-xs opacity-70 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
            {delinquency === "60-120" && (
              <p className="mt-2 text-sm text-success flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                60–120 days delinquent is the optimal window for debt settlement negotiations.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!debt || !delinquency}
            onClick={() => setStep(2)}
            className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 2 — Financial profile */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-semibold">Your financial profile</h2>
            <p className="mt-2 text-muted-foreground text-sm">This helps us identify which options are realistically available to you.</p>
          </div>

          {/* Credit score */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Approximate credit score: <span className="text-primary font-semibold">{creditScore}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({creditScore >= 720 ? "Excellent" : creditScore >= 660 ? "Good" : creditScore >= 580 ? "Fair" : "Poor"})
              </span>
            </label>
            <input
              type="range"
              min={400}
              max={850}
              step={10}
              value={creditScore}
              onChange={(e) => setCreditScore(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor (400)</span>
              <span>Fair (580)</span>
              <span>Good (670)</span>
              <span>Excellent (800+)</span>
            </div>
          </div>

          {/* Monthly income */}
          <div>
            <label className="block text-sm font-medium mb-2">Approximate monthly take-home income</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                placeholder="3,500"
                value={incomeInput}
                onChange={(e) => {
                  setIncomeInput(e.target.value);
                  setIncome(parseInt(e.target.value) || 0);
                }}
                className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">After taxes. Used to estimate program affordability only.</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!income}
              onClick={handleCalculate}
              className="btn-cta flex-[2] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator className="h-4 w-4" /> Calculate My Savings
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your information is not stored or shared. This calculator is for educational estimates only.
          </p>
        </div>
      )}

      {/* Step 3 — Results */}
      {step === 3 && result && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-semibold">Your Debt Settlement Estimate</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Based on {fmt(debt)} in unsecured debt. These are estimates — actual results depend on your creditors and program terms.
            </p>
          </div>

          {/* Key numbers */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <TrendingDown className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">You could pay</p>
              <p className="text-2xl font-display font-bold text-foreground mt-1">
                {fmt(result.totalLow)}–{fmt(result.totalHigh)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">including all fees</p>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-primary-soft/30 p-5 text-center">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-primary font-semibold uppercase tracking-wide">Potential savings</p>
              <p className="text-2xl font-display font-bold text-primary mt-1">
                {fmt(result.savingsLow)}–{fmt(result.savingsHigh)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">vs. paying full balance</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <Clock className="h-6 w-6 text-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Program length</p>
              <p className="text-2xl font-display font-bold text-foreground mt-1">
                {result.programMonths} mo
              </p>
              <p className="text-xs text-muted-foreground mt-1">~{fmt(result.monthlyDeposit)}/month deposit</p>
            </div>
          </div>

          {/* Comparison: Minimum payments vs Settlement */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-semibold text-foreground">Settlement vs. Minimum Payments</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  label: "Total you pay",
                  min: fmt(result.minimumTotalCost),
                  settle: `${fmt(result.totalLow)}–${fmt(result.totalHigh)}`,
                  better: "settlement",
                },
                {
                  label: "Time to pay off",
                  min: `~${result.minimumPayoffYears}+ years`,
                  settle: `${Math.round(result.programMonths / 12)} years`,
                  better: "settlement",
                },
                {
                  label: "Credit impact",
                  min: "Ongoing (never resolves)",
                  settle: "Temporary, then resolves",
                  better: "settlement",
                },
                {
                  label: "Monthly cost",
                  min: `${fmt(Math.round(debt * 0.02))}/month min`,
                  settle: `${fmt(result.monthlyDeposit)}/month deposit`,
                  better: "neutral",
                },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-3 px-4 py-3 text-sm">
                  <span className="text-muted-foreground font-medium">{row.label}</span>
                  <span className={`text-center ${row.better === "settlement" ? "text-destructive" : "text-foreground"}`}>
                    {row.min}
                  </span>
                  <span className={`text-center font-medium ${row.better === "settlement" ? "text-success" : "text-foreground"}`}>
                    {row.settle}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-3 px-4 py-2 bg-muted/20 text-xs text-muted-foreground font-medium">
                <span></span>
                <span className="text-center">Minimum Payments</span>
                <span className="text-center">Settlement</span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-2xl border-l-4 p-5 ${
            result.recommendation === "settlement" ? "border-primary bg-primary-soft/30" :
            result.recommendation === "personal-loan" ? "border-blue-500 bg-blue-50" :
            result.recommendation === "dmp" ? "border-green-500 bg-green-50" :
            "border-amber-500 bg-amber-50"
          }`}>
            <p className="text-sm font-semibold text-foreground">Our recommendation based on your inputs</p>
            <p className="text-base font-bold text-foreground mt-1">{result.recommendationLabel}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{result.recommendationNote}</p>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important:</strong> These are estimates based on industry averages. Settlement percentages range from 35–65% depending on creditor, account age, and your specific financial situation. Program fees vary by company (typically 15–25% of enrolled debt). Actual results may differ. This calculator is for educational purposes only and does not constitute financial advice.
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-primary p-6 text-center text-primary-foreground">
            <p className="font-display font-semibold text-lg">Get Your Real Numbers</p>
            <p className="mt-2 text-sm text-primary-foreground/85">
              A vetted specialist can give you exact settlement estimates for your specific creditors — free, no obligation.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/get-help" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary hover:bg-white/90 transition-colors">
                Get Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+17183604806" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Call (718) 360-4806
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setStep(1); setResult(null); setDebtInput(""); setIncomeInput(""); setDebt(0); setIncome(0); setDelinquency(""); }}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Start over with different numbers
          </button>
        </div>
      )}
    </div>
  );
}
