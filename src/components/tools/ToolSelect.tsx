// src/components/tools/ToolSelect.tsx
//
// Reusable, accessible <select> for Financial Tools — the dropdown
// sibling of ToolField. Same visual language (h-12 rounded-xl,
// border-input, primary focus ring), same label/id + error pattern
// (aria-invalid, aria-describedby, role="alert").

"use client";

import type { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface ToolSelectOption {
  value: string;
  label: string;
}

export interface ToolSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: ToolSelectOption[];
  placeholder?: string;
  error?: string;
  size?: "md" | "lg";
}

export function ToolSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  size = "md",
}: ToolSelectProps) {
  const errorId = `${id}-error`;
  const height = size === "lg" ? "h-14 text-lg" : "h-12 text-base";

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${height} w-full appearance-none rounded-xl border border-input bg-background pl-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            value === "" ? "text-muted-foreground/70" : ""
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
