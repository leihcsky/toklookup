export const BRAND = {
  teal: "#115e59",
  ink: "#18181b",
  paper: "#f7f5f0",
} as const;

export const SITE = {
  name: "TokLookup",
  product: "TikTok User Finder",
  url: "https://toklookup.click",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@toklookup.click",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-BH8QHKNRV0",
  legalUpdated: "September 18, 2026",
} as const;

export function siteUrl(path = "/"): string {
  if (path === "/" || path === "") {
    return SITE.url;
  }

  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
