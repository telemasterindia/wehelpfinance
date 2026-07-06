// src/components/tools/ToolField.tsx
//
// Reusable, fully-accessible form control for all Financial Tools.
// Matches the existing WeHelpFinance input style exactly (same classes
// as LeadForm / DebtSettlementCalculator inputs) and bakes in the
// label/id pairing, aria-invalid, aria-describedby and role="alert"
// error announcement pattern from the site's accessibility standard.

"use client";

import type { ChangeEvent } from "react";

export interface ToolFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Visual prefix inside the input, e.g. "$" */
  prefix?: string;
  /** Visual suffix inside the input, e.g. "%" */
  suffix?: string;
  placeholder?: string;
  error?: string;
  /** Compact variant for dense multi-column debt rows. */
  size?: "md" | "lg";
  inputMode?: "decimal" | "numeric" | "text";
  autoComplete?: string;
  srOnlyLabel?: boolean;
}

export function ToolField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  error,
  size = "md",
  inputMode = "decimal",
  autoComplete = "off",
  srOnlyLabel = false,
}: ToolFieldProps) {
  const errorId = `${id}-error`;
  const height = size === "lg" ? "h-14 text-lg" : "h-12 text-base";
  const padLeft = prefix ? "pl-9" : "pl-4";
  const padRight = suffix ? "pr-10" : "pr-4";

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={
          srOnlyLabel
            ? "sr-only"
            : "mb-1.5 block text-sm font-medium text-foreground"
        }
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${height} w-full rounded-xl border border-input bg-background ${padLeft} ${padRight} text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
        />
        {suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
