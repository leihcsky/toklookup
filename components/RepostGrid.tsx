"use client";

import { RepostPlayer } from "@/components/RepostPlayer";
import { formatCount } from "@/lib/format";
import type { TikTokRepost } from "@/lib/tiktok/types";
import { useState } from "react";

type RepostGridProps = {
  ownerUsername: string;
  reposts: TikTokRepost[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

export function RepostGrid({
  ownerUsername,
  reposts,
  hasMore,
  loadingMore,
  onLoadMore,
}: RepostGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-3 lg:grid-cols-5">
        {reposts.map((repost, index) => (
          <li key={repost.id} className="min-w-0">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block w-full text-left"
              title={repost.description ?? undefined}
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-200">
                {repost.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={repost.coverUrl}
                    alt={
                      repost.description
                        ? repost.description.slice(0, 120)
                        : "Reposted TikTok video"
                    }
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="block h-full w-full bg-zinc-800" />
                )}
                {repost.type === "photo" ? (
                  <span className="absolute top-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Photo
                  </span>
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white">
                    <PlayIcon />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-xs font-semibold text-white">
                  <PlayIcon />
                  {formatCount(repost.playCount)}
                </span>
              </span>
              {repost.author ? (
                <span className="mt-1.5 block truncate text-xs font-medium text-zinc-700 group-hover:text-teal-800">
                  @{repost.author.username}
                </span>
              ) : null}
              {repost.description ? (
                <span className="block truncate text-xs text-zinc-500">{repost.description}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
      {activeIndex !== null ? (
        <RepostPlayer
          ownerUsername={ownerUsername}
          reposts={reposts}
          index={activeIndex}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onIndexChange={setActiveIndex}
          onLoadMore={onLoadMore}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}
