import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How TokLookup handles lookup queries, public TikTok profile data, caching, and contact requests.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description={`Last updated ${SITE.legalUpdated}`}
    >
      <LegalSection title="Overview">
        <p>
          This policy explains what TokLookup collects when you use the TikTok
          User Finder, how public TikTok data is handled, and how long anything
          is kept. TokLookup does not require an account and does not sell
          personal information.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>When you use the service, we may process:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>the username, @handle, or profile URL you submit</li>
          <li>IP address and basic request metadata used for rate limiting</li>
          <li>browser storage for recent searches on your device only</li>
          <li>
            contact details you send us, such as an email address on a data
            removal or support request
          </li>
        </ul>
        <p>
          We do not currently run third-party advertising or analytics pixels.
          If that changes, this policy will be updated first.
        </p>
      </LegalSection>

      <LegalSection title="TikTok data">
        <p>
          TokLookup retrieves publicly available TikTok profile information. We
          do not log into TikTok on your behalf, access private accounts, or
          collect follower/following lists. Displayed fields may include
          username, display name, avatar URL, bio, public stats, verification
          status, profile URL, and user ID when those values are present on the
          public page.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          Query results are not stored as a permanent TikTok user database.
          Successful and some unsuccessful lookups may be cached in server
          memory for up to six hours so repeated searches are faster and put
          less load on public pages. After that window, the cache entry expires.
        </p>
        <p>
          Recent searches are saved in your browser&apos;s local storage. You
          can clear them from the lookup form, or by clearing site data in your
          browser. Rate-limit counters are kept briefly in memory and are not
          used to build a user profile.
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>
          The site is designed to run on a standard web host (for example
          Vercel or a similar Node.js host). That host may process IP addresses
          and request logs as part of delivering the site. We do not currently
          send lookup queries to advertising networks, analytics vendors, or a
          separate Redis/database provider.
        </p>
        <p>
          Avatar images, when shown, are loaded from the public URL returned by
          TikTok. TokLookup does not download or re-host those files.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can stop using the service at any time. If you believe information
          shown by TokLookup should be removed or corrected, use{" "}
          <Link className="text-teal-800 underline" href="/data-removal">
            Data Removal
          </Link>
          . Requests are reviewed manually.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          TokLookup is not directed at children under 13, and we do not
          knowingly collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Privacy questions:{" "}
          <a className="text-teal-800 underline" href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}