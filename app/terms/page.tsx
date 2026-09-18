import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using TokLookup, an independent third-party TikTok public profile lookup tool.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description={`Last updated ${SITE.legalUpdated}`}
    >
      <LegalSection title="Service">
        <p>
          TokLookup is an independent third-party lookup tool. You may enter a
          TikTok username, @handle, or public profile URL to request publicly
          available profile information through our TikTok User Finder.
        </p>
        <p>
          TokLookup is not a TikTok client, does not require a TikTok login, and
          does not provide private account access, downloads, follower lists, or
          a permanent TikTok user database.
        </p>
      </LegalSection>

      <LegalSection title="Public information">
        <p>
          The service only attempts to retrieve information that is already
          publicly accessible on TikTok profile pages. If a profile is private,
          missing, restricted, or otherwise unavailable, TokLookup may return no
          data or an incomplete result.
        </p>
      </LegalSection>

      <LegalSection title="No TikTok affiliation">
        <p>
          TokLookup is not affiliated with, endorsed by, or sponsored by TikTok
          or ByteDance. TikTok, related marks, and the TikTok platform are
          trademarks or services of their respective owners. Use of those names
          is solely to describe the public information the tool looks up.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You may not use TokLookup to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>harass, stalk, threaten, or dox anyone</li>
          <li>violate another person&apos;s privacy or applicable law</li>
          <li>conduct unlawful investigations or identity abuse</li>
          <li>scrape, overload, or otherwise abuse the service</li>
          <li>bypass rate limits or automate excessive requests</li>
          <li>misrepresent TokLookup as TikTok or as an official tool</li>
        </ul>
        <p>
          We may throttle, block, or refuse requests that appear abusive or
          unlawful.
        </p>
      </LegalSection>

      <LegalSection title="Accuracy">
        <p>
          Information may be incomplete, outdated, or inaccurate. TikTok can
          change public pages, fields, or availability at any time. Do not treat
          TokLookup results as official records, identity verification, or legal
          evidence.
        </p>
      </LegalSection>

      <LegalSection title="Availability">
        <p>
          The service depends on third-party public pages remaining reachable.
          Platform changes, blocking, outages, or network issues may make
          lookups temporarily or permanently unavailable. We do not guarantee
          uptime or uninterrupted access.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          TokLookup is provided “AS IS” and “AS AVAILABLE,” without warranties of
          any kind, whether express or implied, including merchantability,
          fitness for a particular purpose, title, and non-infringement.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, TokLookup and its operators
          are not liable for any indirect, incidental, special, consequential,
          or punitive damages, or for lost profits, data, or goodwill, arising
          from your use of the service. Our total liability for any claim
          relating to the service is limited to the greater of (a) the amount
          you paid us for the service in the 12 months before the claim, or (b)
          USD $50.
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You agree to indemnify and hold TokLookup harmless from claims,
          damages, and expenses (including reasonable legal fees) arising out of
          your misuse of the service, your violation of these terms, or your
          infringement of another person&apos;s rights.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms as the product changes. The “Last updated”
          date at the top of this page will change when we do. Continued use of
          TokLookup after an update means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a className="text-teal-800 underline" href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </a>
          . Privacy requests can also go through{" "}
          <Link className="text-teal-800 underline" href="/data-removal">
            Data Removal
          </Link>{" "}
          or{" "}
          <Link className="text-teal-800 underline" href="/contact">
            Contact
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}