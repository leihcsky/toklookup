import { DataRemovalForm } from "@/components/DataRemovalForm";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Data Removal",
  description:
    "Request removal or correction of publicly displayed TikTok profile information on TokLookup.",
  path: "/data-removal",
});

export default function DataRemovalPage() {
  return (
    <LegalPage
      title="Data Removal"
      description="If you believe publicly displayed information should be removed or corrected, contact us. Requests are reviewed by a person, not an automated filter."
    >
      <LegalSection title="What this covers">
        <p>
          TokLookup only looks up public TikTok profile pages and may cache a
          result for a short time. It does not keep a permanent TikTok user
          database. A removal request can cover cached lookup results and any
          display of that public profile on this site.
        </p>
        <p>
          Removing a result here does not change the profile on TikTok. To
          change or hide a TikTok profile itself, use TikTok&apos;s settings.
        </p>
      </LegalSection>

      <LegalSection title="Request form">
        <p>
          Send the TikTok username, profile URL, reason, and a contact email.
          You can use the form below, which opens a message to{" "}
          {SITE.contactEmail}, or email that address directly.
        </p>
        <DataRemovalForm />
      </LegalSection>

      <LegalSection title="After you submit">
        <p>
          We review requests manually and may ask for a reasonable confirmation
          that you are connected to the profile. We may decline requests that
          are incomplete, abusive, or that ask us to hide information that is
          still public on TikTok while still operating a public lookup tool.
        </p>
        <p>
          Other questions:{" "}
          <Link className="text-teal-800 underline" href="/contact">
            Contact
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}