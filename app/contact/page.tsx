import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact TokLookup about the TikTok User Finder, privacy, or data removal.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      description="TokLookup is a small independent lookup tool. We read every message, but we cannot provide TikTok account recovery or official TikTok support."
    >
      <LegalSection title="Email">
        <p>
          <a className="text-teal-800 underline" href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </a>
        </p>
        <p>Use this address for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>questions about the TikTok User Finder</li>
          <li>privacy or legal notices</li>
          <li>abuse reports</li>
          <li>data removal or correction requests</li>
        </ul>
      </LegalSection>

      <LegalSection title="Data removal">
        <p>
          To ask us to stop showing a public profile lookup, use the{" "}
          <Link className="text-teal-800 underline" href="/data-removal">
            Data Removal
          </Link>{" "}
          form. Include the TikTok username, profile URL, reason, and a contact
          email. Requests are handled manually.
        </p>
      </LegalSection>

      <LegalSection title="What we cannot do">
        <p>
          We cannot reset TikTok passwords, unlock banned accounts, change a
          TikTok username, or access private profiles. Those requests must go to
          TikTok.
        </p>
      </LegalSection>
    </LegalPage>
  );
}