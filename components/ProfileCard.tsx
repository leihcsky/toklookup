import { formatDate, formatLanguage, formatRegion } from "@/lib/format";
import type { TikTokProfile } from "@/lib/tiktok/types";
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { ProfileStats } from "./ProfileStats";

type ProfileCardProps = {
  profile: TikTokProfile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const accountDetails = [
    {
      label: "User ID",
      value: profile.userId,
      copy: profile.userId,
      hint: "Stays the same if the username changes.",
    },
    { label: "Language", value: formatLanguage(profile.language) },
    {
      label: "Region",
      value: formatRegion(profile.region),
      hint: "Usually the account country, when TikTok includes it.",
    },
    { label: "Account created", value: formatDate(profile.createdAt) },
    {
      label: "Username last changed",
      value: formatDate(profile.usernameChangedAt),
    },
    {
      label: "Nickname last changed",
      value: formatDate(profile.nicknameChangedAt),
    },
  ];

  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={`${profile.displayName} avatar`}
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-zinc-100 sm:h-24 sm:w-24"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-2xl font-semibold text-zinc-500 sm:h-24 sm:w-24">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight break-words text-zinc-900 sm:text-2xl">
                  {profile.displayName}
                </h2>
                {profile.verified ? (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-zinc-500">@{profile.username}</p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
              <Link
                href={`/tiktok-story-viewer?username=${encodeURIComponent(profile.username)}`}
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-teal-800 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                View stories
              </Link>
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
              >
                View on TikTok
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
          {profile.bio ? (
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {profile.bio}
            </p>
          ) : null}
          {profile.bioLink ? (
            <a
              href={profile.bioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex break-all text-sm font-medium text-teal-800 hover:underline"
            >
              {displayLink(profile.bioLink)}
            </a>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 border-t border-zinc-100 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-5">
        <ProfileStats
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
          likeCount={profile.likeCount}
          videoCount={profile.videoCount}
        />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Account details
          </h3>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accountDetails.map((item) => (
              <div key={item.label} className="min-w-0 rounded-2xl bg-zinc-50 px-3 py-3 sm:px-4 sm:py-4">
                <dt className="flex items-start justify-between gap-2 text-[11px] font-medium uppercase leading-4 tracking-wide text-zinc-500 sm:text-xs">
                  {item.label}
                  {item.copy ? <CopyButton value={item.copy} /> : null}
                </dt>
                <dd className="mt-1 break-all font-mono text-sm text-zinc-900">
                  {item.value ?? "—"}
                </dd>
                {item.hint ? (
                  <p className="mt-2 text-xs font-sans font-normal leading-5 normal-case tracking-normal text-zinc-500">
                    {item.hint}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}

function displayLink(url: string): string {
  return url.replace(/^https?:\/\//i, "");
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 opacity-70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H3.5A1.5 1.5 0 0 0 2 5v7.5A1.5 1.5 0 0 0 3.5 14H11a1.5 1.5 0 0 0 1.5-1.5V9.5" />
      <path d="M9.5 2.5h4v4M13.5 2.5 7 9" />
    </svg>
  );
}
