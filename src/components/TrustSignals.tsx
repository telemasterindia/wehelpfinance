import { ShieldCheck, Phone, Lock, MapPin } from "lucide-react";
import type { ElementType } from "react";

type Variant = "horizontal" | "vertical" | "compact" | "banner";

type TrustItem = {
  icon: ElementType;
  label: string;
  sub?: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    label: "Free Consultation",
    sub: "No cost to explore your options",
  },
  {
    icon: Lock,
    label: "Secure & Confidential",
    sub: "Your information stays private",
  },
  {
    icon: Phone,
    label: "No Obligation",
    sub: "No pressure to enroll in anything",
  },
  {
    icon: MapPin,
    label: "Nationwide Assistance",
    sub: "Available in all 50 states",
  },
];

export function TrustSignals({
  variant = "horizontal",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 ${className}`}>
        {TRUST_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`rounded-2xl border border-border bg-card px-6 py-5 ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`space-y-4 ${className}`}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/10 text-success">
              <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              {item.sub && (
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: horizontal grid
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-success/10 text-success">
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-foreground">{item.label}</p>
          {item.sub && (
            <p className="text-xs text-muted-foreground leading-relaxed">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
