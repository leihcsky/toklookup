import { RelatedTools } from "@/components/RelatedTools";
import { RepostFAQ, REPOST_FAQS } from "@/components/RepostFAQ";
import { RepostLookupTool } from "@/components/RepostLookupTool";
import { SITE, siteUrl } from "@/lib/brand";
import { REPOST_SEO, repostMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = repostMetadata;

const HIGHLIGHTS = [
  "No login",
  "Browse anonymously",
  "Public reposts only",
  "Watch in the browser",
];

const REPOST_FIELDS = [
  {
    label: "Reposted videos",
    detail: "Every public repost, laid out in a grid like the Reposts tab on TikTok",
  },
  {
    label: "Original creator",
    detail: "The @username of the person who made each reposted video",
  },
  { label: "Captions", detail: "The caption the original creator wrote" },
  { label: "Plays and likes", detail: "Public play and like counts for each repost" },
  { label: "Photo posts", detail: "Reposted photo carousels, viewable image by image" },
  { label: "Older reposts", detail: "Load more to go further back through the list" },
];

const STEPS = [
  {
    title: "Enter a public username",
    body: "Paste a TikTok username, @handle, or public profile URL, then tap View Reposts.",
  },
  {
    title: "Browse their reposts",
    body: "TokLookup reads the reposts TikTok already shows on that public profile and lists them newest first.",
  },
  {
    title: "Watch without leaving",
    body: "Tap a cover to play the repost in a vertical player, then move up or down through the list. Load more brings in older reposts.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `${SITE.name} TikTok Repost Viewer`,
      url: siteUrl("/tiktok-repost-viewer"),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: REPOST_SEO.description,
      featureList: REPOST_FIELDS.map((field) => field.label),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: REPOST_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function RepostViewerPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl min-w-0 flex-1 flex-col gap-10 px-4 py-8 sm:gap-16 sm:py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-800">
          {SITE.name}
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-4xl lg:text-5xl">
          TikTok Repost Viewer
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          This TikTok Repost Viewer shows which videos a public account has
          reposted. No login, no app — paste a handle or profile URL, browse
          their reposts in a grid like the Reposts tab on TikTok, and watch
          them right here. Hidden Reposts tabs and private accounts stay
          closed.
        </p>
        <ul className="flex flex-wrap gap-2">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="rounded-full border border-teal-800/15 bg-white px-3 py-1 text-sm font-medium text-teal-900"
            >
              {item}
            </li>
          ))}
        </ul>
        <RelatedTools current="reposts" />
        <RepostLookupTool />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          What the TikTok Repost Viewer shows
        </h2>
        <p className="max-w-2xl text-zinc-600 leading-7">
          When an account keeps its Reposts tab public, you see the same
          reposts you would find on its TikTok profile, plus who originally
          posted each one.
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {REPOST_FIELDS.map((field) => (
            <div
              key={field.label}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-3 sm:px-4 sm:py-4"
            >
              <h3 className="font-semibold text-zinc-900">{field.label}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{field.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          How to see someone&apos;s reposts on TikTok
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-teal-800">
                Step {index + 1}
              </p>
              <h3 className="mt-2 font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-5 sm:grid-cols-2 sm:p-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Public reposts only
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            TikTok lets each account choose whether its Reposts tab is visible.
            This repost viewer only lists reposts TikTok already shows
            publicly. It does not sign in to TikTok, open private accounts, or
            reveal a hidden Reposts tab.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            More public lookups
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Need User ID or region? Use the{" "}
            <Link className="font-medium text-teal-800 underline" href="/">
              TikTok User Finder
            </Link>
            . Want to watch currently active public stories anonymously? Open
            the{" "}
            <Link
              className="font-medium text-teal-800 underline"
              href="/tiktok-story-viewer"
            >
              TikTok Story Viewer
            </Link>
            .
          </p>
        </div>
      </section>

      <RepostFAQ />
    </main>
  );
}
