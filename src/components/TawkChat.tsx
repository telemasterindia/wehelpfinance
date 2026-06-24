"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

const TAWK_PROPERTY_ID = "";
const TAWK_WIDGET_ID = "default";

export function TawkChat() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !TAWK_PROPERTY_ID) return;

    const events = ["mousemove", "touchstart", "keydown", "scroll", "click"] as const;

    const loadTawk = () => {
      if (loaded.current) return;
      loaded.current = true;

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.head.appendChild(script);

      events.forEach((event) => window.removeEventListener(event, loadTawk));
    };

    events.forEach((event) => window.addEventListener(event, loadTawk, { once: true, passive: true }));
    const timer = window.setTimeout(loadTawk, 8000);

    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, loadTawk));
    };
  }, []);

  return null;
}
