import { FAQ, FAQS } from "@/components/FAQ";
import { LookupTool } from "@/components/LookupTool";
import { RelatedTools } from "@/components/RelatedTools";
import { SITE, siteUrl } from "@/lib/brand";
import { HOME_SEO, homeMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = homeMetadata;

const HIGHLIGHTS = [
  "No login",
  "Free to use",
  "Public profiles only",
  "Includes User ID",
  "Region detection",
];

const PROFILE_FIELDS = [
  { label: "Username", detail: "The public @handle" },
  { label: "Display name", detail: "The name shown on the profile" },
  { label: "Bio", detail: "The public profile signature" },
  { label: "Followers", detail: "Public follower count" },
  { label: "Following", detail: "Public following count" },
  { label: "Likes", detail: "Public like total" },
  { label: "Videos", detail: "Public video count" },
  { label: "User ID", detail: "The numeric account ID. It stays the same if the username changes." },
  { label: "Bio link", detail: "The public link on the profile, when present" },
  { label: "Language", detail: "The language set on the public profile" },
  {
    label: "Region",
    detail: "The public profile region — often the account country — when present",
  },
  { label: "Account created", detail: "The public account creation date" },
];

const STEPS = [
  {
    title: "Enter a username",
    body: "Paste a TikTok username, @handle, or public profile URL.",
  },
  {
    title: "Read the public page",
    body: "TokLookup requests the public TikTok profile page and reads the embedded profile data.",
  },
  {
    title: "See public details",
    body: "Display name, stats, User ID, and region appear on this page. Results are not saved as separate profile URLs.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: `${SITE.name} ${SITE.product}`,
      url: siteUrl("/"),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description: HOME_SEO.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
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

export default function Home() {
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
          TikTok User Finder
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Look up public TikTok profile information by username. No login, no
          app — paste a handle or profile URL and see what is already public,
          including User ID and region. When a region is listed, it is usually
          the account country. It also works as a TikTok region finder for that
          public field.
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
        <RelatedTools current="finder" />
        <LookupTool />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          What this TikTok User Finder shows
        </h2>
        <p className="max-w-2xl text-zinc-600 leading-7">
          When the profile is public, TokLookup tries to return the same kind of
          fields you would see on the public web profile — including User ID,
          language, and region. The public region is typically the account
          country.
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PROFILE_FIELDS.map((field) => (
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
          How it works
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
            Public lookup only
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            TokLookup is a TikTok User Finder for information that is already
            public on the web, including region when TikTok shows it. It does
            not sign in to TikTok, open private accounts, or download videos.
            For currently active public stories you can watch anonymously, use
            the{" "}
            <Link
              href="/tiktok-story-viewer"
              className="font-medium text-teal-800 underline"
            >
              TikTok Story Viewer
            </Link>
            .
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Use it when you have a username
          </h2>
          <p className="text-sm leading-7 text-zinc-600">
            Check a public handle, confirm a display name or verification badge,
            or read the User ID without opening the TikTok app. If the profile
            lists a region, you can also see the account country. If the account
            is private or missing, the tool says so instead of guessing.
          </p>
        </div>
      </section>

      <FAQ />
    </main>
  );
}
