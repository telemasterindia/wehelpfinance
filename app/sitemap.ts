import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wehelpfinance.com";
  const pages = [
    ["", "weekly", 1], ["/debt-relief", "weekly", 0.9], ["/personal-loans", "weekly", 0.9],
    ["/tax-relief", "weekly", 0.9], ["/get-help", "monthly", 0.7], ["/about", "monthly", 0.6],
    ["/contact", "monthly", 0.6], ["/privacy", "yearly", 0.3], ["/terms", "yearly", 0.3],
  ] as const;
  return pages.map(([route, changeFrequency, priority]) => ({ url: `${base}${route}`, changeFrequency, priority }));
}
