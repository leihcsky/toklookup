import { RelatedTools } from "@/components/RelatedTools";
import { StoryFAQ, STORY_FAQS } from "@/components/StoryFAQ";
import { StoryLookupTool } from "@/components/StoryLookupTool";
import { SITE, siteUrl } from "@/lib/brand";
import { STORY_SEO, storyMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = storyMetadata;

const HIGHLIGHTS = [
  "No login",
  "Watch anonymously",
  "Public stories only",
  "Download when available",
];

const STEPS = [
  {
    title: "Enter a public username",
    body: "Paste a TikTok username, @handle, or public profile URL.",
  },
  {
    title: "Read active public stories",
    body: "TokLookup looks up that public account and checks for stories that are still live, usually for about 24 hours.",
  },
  {
    title: "Preview or download",
    body: "Tap a story cover to open it in a vertical player. You watch it here without a TikTok login. Download from there if a public file is available. Private and expired stories are not shown.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `${SITE.name} TikTok Story Viewer`,
      url: siteUrl("/tiktok-story-viewer"),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: STORY_SEO.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: STORY_FAQS.map((item) => ({
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

export default function StoryViewerPage() {
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
          TikTok Story Viewer
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Watch currently active public TikTok stories anonymously in your
          browser. No login, no app — paste a handle or profile URL. You are
          not viewing under a TikTok account of yours. If a public story is
          live, you can preview it here and download the file. Private, Friends,
          and expired stories stay closed.
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
        <RelatedTools current="stories" />
        <StoryLookupTool />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          How this Story Viewer works
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
            Watch without an account
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            You watch public stories here anonymously: no TikTok login, and the
            lookup is not tied to your username. This tool only requests stories
            TikTok already makes public. It does not open private accounts or
            recover stories after they expire. Need profile fields such as User
            ID or region instead? Use the{" "}
            <Link className="font-medium text-teal-800 underline" href="/">
              TikTok User Finder
            </Link>
            .
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            About downloads
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Download is limited to the public story files returned by this page.
            Only save stories you have a right to keep. TokLookup is not a
            general TikTok video downloader and is not affiliated with TikTok.
          </p>
        </div>
      </section>

      <StoryFAQ />
    </main>
  );
}
