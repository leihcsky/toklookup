import { SITE, siteUrl } from "@/lib/brand";
import type { Metadata } from "next";

export const HOME_SEO = {
  title: "TikTok User Finder | See User ID & Region, No Login",
  description:
    "Free TikTok User Finder and region finder. Look up public profiles by username or URL. See User ID, region, bio, and followers. No login required.",
} as const;

type PageSeo = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageSeo): Metadata {
  const url = siteUrl(path);
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      locale: "en_US",
      title: ogTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const homeMetadata = pageMetadata({
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  path: "/",
  absoluteTitle: true,
});
