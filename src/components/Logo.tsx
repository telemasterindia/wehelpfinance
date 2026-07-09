import Link from "next/link";
import { type SVGProps } from "react";

// ─── Shield icon ──────────────────────────────────────────────────────────────
export function ShieldMark({
  className = "h-8 w-8",
  ...props
}: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M24 4L6 12V28C6 37.4 14.1 46.1 24 48C33.9 46.1 42 37.4 42 28V12L24 4Z"
        className="fill-primary"
      />
      <path
        d="M24 8L10 15V28C10 35.5 16.3 42.8 24 44.5C31.7 42.8 38 35.5 38 28V15L24 8Z"
        fill="currentColor"
        className="text-primary"
        opacity="0.15"
      />
      <path
        d="M16 27L21.5 32.5L32 22"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Full horizontal logo ─────────────────────────────────────────────────────
export function Logo({
  variant = "default",
  size = "md",
  asLink = true,
  className = "",
}: {
  variant?: "default" | "dark" | "compact";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}) {
  const sizeMap = {
    sm: { icon: "h-6 w-6", text: "text-base", tag: "text-[9px]" },
    md: { icon: "h-8 w-8", text: "text-lg", tag: "text-[9px]" },
    lg: { icon: "h-10 w-10", text: "text-2xl", tag: "text-[10px]" },
  };

  const s = sizeMap[size];
  const isDark = variant === "dark";
  const isCompact = variant === "compact";

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Shield mark */}
      <span
        className={`grid shrink-0 place-items-center rounded-xl ${
          isDark ? "bg-white/15" : "bg-primary"
        } ${s.icon}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4/6 w-4/6"
          aria-hidden="true"
        >
          <path
            d="M12 2L4 6V13C4 16.9 7.4 20.5 12 22C16.6 20.5 20 16.9 20 13V6L12 2Z"
            fill={isDark ? "#0b4d3b" : "white"}
          />
          <path
            d="M8.5 13L11 15.5L15.5 10.5"
            stroke={isDark ? "white" : "#0b4d3b"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Wordmark */}
      {!isCompact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-semibold tracking-tight ${s.text} ${
              isDark ? "text-white" : "text-foreground"
            }`}
          >
            <span className={isDark ? "text-green-400" : "text-primary"}>We</span>
            <span className={isDark ? "text-white" : "text-foreground"}>Help</span>
            <span
              className={`font-normal ${isDark ? "text-white/80" : "text-primary"}`}
            >
              Finance
            </span>
          </span>
          <span
            className={`${s.tag} font-medium uppercase tracking-[0.18em] ${
              isDark ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            Financial Help · Made Human
          </span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label="WeHelpFinance — home">
      {content}
    </Link>
  );
}

// ─── Footer logo variant ──────────────────────────────────────────────────────
export function FooterLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="WeHelpFinance — home" className={className}>
      <span className="inline-flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path d="M12 2L4 6V13C4 16.9 7.4 20.5 12 22C16.6 20.5 20 16.9 20 13V6L12 2Z" fill="white" />
            <path d="M8.5 13L11 15.5L15.5 10.5" stroke="#0b4d3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-display text-lg font-semibold text-foreground">
          <span className="text-primary">We</span>Help<span className="font-normal text-primary">Finance</span>
        </span>
      </span>
    </Link>
  );
}
