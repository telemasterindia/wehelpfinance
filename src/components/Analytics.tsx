"use client";

import { useEffect } from "react";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-B9PXMRG885";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

export function Analytics() {
  useEffect(() => {
    if (GA4_ID) {
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(s1);

      const s2 = document.createElement("script");
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}', { send_page_view: true });
      `;
      document.head.appendChild(s2);
    }

    if (CLARITY_ID) {
      const s = document.createElement("script");
      s.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(s);
    }

    try {
      if (!sessionStorage.getItem("whf_landing")) {
        sessionStorage.setItem("whf_landing", window.location.href);
      }
      const p = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"]
        .forEach((k) => { const v = p.get(k); if (v) utm[k] = v; });
      if (Object.keys(utm).length) {
        sessionStorage.setItem("whf_utm", JSON.stringify(utm));
      }
    } catch {
      // Campaign capture should never affect rendering.
    }
  }, []);

  return null;
}
