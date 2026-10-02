"use client";

import { formatCount } from "@/lib/format";
import type { TikTokRepost } from "@/lib/tiktok/types";
import { useEffect, useRef, useState } from "react";

type RepostPlayerProps = {
  ownerUsername: string;
  reposts: TikTokRepost[];
  index: number;
  hasMore: boolean;
  loadingMore: boolean;
  onIndexChange: (index: number) => void;
  onLoadMore: () => void;
  onClose: () => void;
};

export function repostMediaPath(ownerUsername: string, id: string): string {
  const params = new URLSearchParams({ username: ownerUsername, id });
  return `/api/tiktok/reposts/media?${params.toString()}`;
}

export function RepostPlayer({
  ownerUsername,
  reposts,
  index,
  hasMore,
  loadingMore,
  onIndexChange,
  onLoadMore,
  onClose,
}: RepostPlayerProps) {
  const repost = reposts[index];
  const canPrev = index > 0;
  const canNext = index < reposts.length - 1;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (hasMore && !loadingMore && index >= reposts.length - 3) {
      onLoadMore();
    }
  }, [hasMore, index, loadingMore, onLoadMore, reposts.length]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if ((event.key === "ArrowDown" || event.key === "ArrowRight") && canNext) {
        event.preventDefault();
        onIndexChange(index + 1);
      } else if ((event.key === "ArrowUp" || event.key === "ArrowLeft") && canPrev) {
        event.preventDefault();
        onIndexChange(index - 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canNext, canPrev, index, onClose, onIndexChange]);

  if (!repost) {
    return null;
  }

  const navButton =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Repost by @${ownerUsername}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
      >
        Close
      </button>

      <div className="flex items-center gap-4" onClick={(event) => event.stopPropagation()}>
        <div className="flex w-[min(calc(100vw-1.5rem),24rem,calc((100dvh-10rem)*9/16))] flex-col items-stretch gap-3">
          <RepostSlide key={repost.id} ownerUsername={ownerUsername} repost={repost} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onIndexChange(index - 1)}
              disabled={!canPrev}
              className={`${navButton} sm:hidden`}
              aria-label="Previous repost"
            >
              <ChevronIcon direction="up" />
            </button>
            <a
              href={repost.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Open on TikTok
            </a>
            <button
              type="button"
              onClick={() => onIndexChange(index + 1)}
              disabled={!canNext}
              className={`${navButton} sm:hidden`}
              aria-label="Next repost"
            >
              <ChevronIcon direction="down" />
            </button>
          </div>
          <p className="text-center text-xs text-white/60">
            {index + 1} / {reposts.length}
            {hasMore ? "+" : ""}
            {loadingMore ? " · Loading more…" : ""}
          </p>
        </div>

        <div className="hidden flex-col gap-3 sm:flex">
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            disabled={!canPrev}
            className={navButton}
            aria-label="Previous repost"
          >
            <ChevronIcon direction="up" />
          </button>
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            disabled={!canNext}
            className={navButton}
            aria-label="Next repost"
          >
            <ChevronIcon direction="down" />
          </button>
        </div>
      </div>
    </div>
  );
}

type RepostSlideProps = {
  ownerUsername: string;
  repost: TikTokRepost;
};

function RepostSlide({ ownerUsername, repost }: RepostSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const isPhoto = repost.type === "photo" && repost.images.length > 0;
  const canPlayVideo = repost.type === "video" && repost.playable;

  useEffect(() => {
    void videoRef.current?.play().catch(() => setPaused(true));
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      video.pause();
      setPaused(true);
    }
  }

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-black shadow-2xl ring-1 ring-white/15">
      {isPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={repost.images[photoIndex]}
          alt={repost.description ? repost.description.slice(0, 120) : "Reposted TikTok photo"}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : canPlayVideo && !failed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full cursor-pointer object-contain"
          playsInline
          loop
          poster={repost.coverUrl ?? undefined}
          src={repostMediaPath(ownerUsername, repost.id)}
          onClick={togglePlayback}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0">
          {repost.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={repost.coverUrl} alt="" className="h-full w-full object-cover opacity-40" />
          ) : null}
          <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-sm leading-6 text-white">
            This repost can&apos;t be played here. Open it on TikTok to watch.
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent px-4 pt-4 pb-10">
        {repost.author?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={repost.author.avatarUrl}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/30"
          />
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            @{repost.author?.username ?? "unknown"}
          </p>
          <p className="truncate text-xs text-white/70">Reposted by @{ownerUsername}</p>
        </div>
      </div>

      {isPhoto && repost.images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setPhotoIndex((current) => Math.max(0, current - 1))}
            disabled={photoIndex === 0}
            className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white disabled:opacity-0"
            aria-label="Previous photo"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() =>
              setPhotoIndex((current) => Math.min(repost.images.length - 1, current + 1))
            }
            disabled={photoIndex === repost.images.length - 1}
            className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white disabled:opacity-0"
            aria-label="Next photo"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-4 pt-12 pb-4">
        {isPhoto && repost.images.length > 1 ? (
          <div className="mb-2 flex justify-center gap-1">
            {repost.images.map((image, imageIndex) => (
              <span
                key={image}
                className={`h-1.5 w-1.5 rounded-full ${imageIndex === photoIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        ) : null}
        {repost.description ? (
          <p className="line-clamp-2 text-sm leading-5 text-white">{repost.description}</p>
        ) : null}
        <p className="mt-1.5 flex items-center gap-3 text-xs font-medium text-white/80">
          <span>{formatCount(repost.playCount)} plays</span>
          <span>{formatCount(repost.likeCount)} likes</span>
        </p>
      </div>

      {canPlayVideo && !failed && paused ? (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 text-white"
          aria-label="Play"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-3xl">
            ▶
          </span>
        </button>
      ) : null}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  const rotation = { up: "rotate-180", down: "", left: "rotate-90", right: "-rotate-90" }[direction];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-4 w-4 ${rotation}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}
