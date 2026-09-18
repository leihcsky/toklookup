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
          User Finder or TikTok Story Viewer, how public TikTok data is handled,
          and how long anything is kept. TokLookup does not require an account
          and does not sell personal information.
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
          <li>
            usage data collected by Google Analytics, including pages viewed,
            referrer, device and browser information, and approximate location
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="TikTok data">
        <p>
          TokLookup retrieves publicly available TikTok profile information and,
          when you use the Story Viewer, currently active public story media
          URLs. We do not log into TikTok on your behalf, access private
          accounts, or collect follower/following lists. Displayed fields may
          include username, display name, avatar URL, bio, public stats,
          verification status, profile URL, user ID, and public story files when
          those values are present.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          Query results are not stored as a permanent TikTok user database.
          Successful and some unsuccessful profile lookups may be cached in
          server memory for up to six hours. Public story lookups are cached for
          a much shorter window, about 10 minutes, because stories expire
          quickly. After that window, the cache entry expires.
        </p>
        <p>
          Recent searches are saved in your browser&apos;s local storage. You
          can clear them from the lookup form, or by clearing site data in your
          browser. Rate-limit counters are kept briefly in memory and are not
          used to build a user profile.
        </p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          TokLookup uses Google Analytics 4 (gtag.js) to understand traffic and
          how the site is used. Google may set cookies or similar identifiers
          and process IP address, device data, and page URLs. Lookup usernames
          typed into the tool are not sent to Google Analytics as search events.
          Google&apos;s privacy policy is at{" "}
          <a
            className="text-teal-800 underline"
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            policies.google.com/privacy
          </a>
          . You can block analytics with a browser extension or by disabling
          cookies. We do not use Google Analytics for advertising remarketing.
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>
          The site is designed to run on a standard web host (for example
          Vercel or a similar Node.js host). That host may process IP addresses
          and request logs as part of delivering the site. Usage data is sent to
          Google Analytics as described above. We do not send lookup queries to
          advertising networks or a separate Redis/database provider.
        </p>
        <p>
          Avatar images and public story files, when shown or downloaded, are
          requested from the public URLs returned by TikTok. TokLookup does not
          keep a permanent library of those files.
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