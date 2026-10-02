import { formatCount, formatExactCount } from "@/lib/format";
import type { TikTokProfile } from "@/lib/tiktok/types";
import Link from "next/link";

type ProfileStripProps = {
  profile: TikTokProfile;
};

export function ProfileStrip({ profile }: ProfileStripProps) {
  const stats = [
    { label: "Followers", value: profile.followerCount },
    { label: "Following", value: profile.followingCount },
    { label: "Likes", value: profile.likeCount },
    { label: "Videos", value: profile.videoCount },
  ];

  return (
    <div className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            width={56}
            height={56}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-zinc-100 sm:h-14 sm:w-14"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-500 sm:h-14 sm:w-14">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate font-semibold text-zinc-900 sm:text-lg">
              {profile.displayName}
            </p>
            {profile.verified ? (
              <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                Verified
              </span>
            ) : null}
          </div>
          <p className="truncate text-sm text-zinc-500">@{profile.username}</p>
        </div>
        <Link
          href={`/?username=${encodeURIComponent(profile.username)}`}
          className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
        >
          View profile
        </Link>
      </div>

      <dl className="mt-4 grid grid-cols-4 divide-x divide-zinc-100 rounded-2xl bg-zinc-50 py-2.5">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-col-reverse px-2 text-center"
            title={formatExactCount(item.value)}
          >
            <dt className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">
              {item.label}
            </dt>
            <dd className="truncate text-base font-semibold text-zinc-900 sm:text-lg">
              {formatCount(item.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
