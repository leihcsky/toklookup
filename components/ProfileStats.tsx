import { formatCount, formatExactCount } from "@/lib/format";

type ProfileStatsProps = {
  followerCount: number | null;
  followingCount: number | null;
  likeCount: number | null;
  videoCount: number | null;
};

export function ProfileStats({
  followerCount,
  followingCount,
  likeCount,
  videoCount,
}: ProfileStatsProps) {
  const items = [
    { label: "Followers", value: followerCount },
    { label: "Following", value: followingCount },
    { label: "Likes", value: likeCount },
    { label: "Videos", value: videoCount },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl bg-zinc-50 px-3 py-3 sm:px-4 sm:py-4"
          title={formatExactCount(item.value)}
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {item.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold text-zinc-900">
            {formatCount(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
