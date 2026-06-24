"use client";

import { Phone } from "lucide-react";

const PHONE_NUMBER = "+17183604806";
const PHONE_DISPLAY = "(718) 360-4806";

export function MobileCallButton() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="complementary"
      aria-label="Call WeHelpFinance"
    >
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="flex min-h-[64px] w-full items-center justify-center gap-3 bg-primary px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-primary-foreground shadow-2xl transition active:bg-primary/90"
        aria-label={`Call us at ${PHONE_DISPLAY}`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Phone className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-sm font-bold leading-tight">Call Now</span>
          <span className="block text-xs font-medium leading-tight text-primary-foreground/85">
            Speak with a specialist
          </span>
        </span>
        <span className="text-sm font-semibold tracking-wide">{PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}
