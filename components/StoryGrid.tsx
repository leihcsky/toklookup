"use client";

import { formatDateTime, formatDuration } from "@/lib/format";
import { storyMediaPath } from "@/lib/tiktok/story-media-url";
import type { TikTokProfile, TikTokStory } from "@/lib/tiktok/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type StoryGridProps = {
  username: string;
  stories: TikTokStory[];
};

export function StoryGrid({ username, stories }: StoryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
        {stories.map((story, index) => (
          <li key={story.id}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-zinc-950 text-left ring-1 ring-zinc-200"
            >
              <span className="relative block aspect-[9/16]">
                {story.coverUrl || story.type === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={storyMediaPath(username, story.id, "cover")}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:opacity-90"
                  />
                ) : (
                  <span className="block h-full w-full bg-zinc-800" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-900">
                    ▶
                  </span>
                </span>
                <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {story.type === "photo"
                    ? "Photo"
                    : formatDuration(story.durationSeconds)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {activeIndex !== null ? (
        <StoryPlayer
          username={username}
          stories={stories}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}

type StoryPlayerProps = {
  username: string;
  stories: TikTokStory[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

function StoryPlayer({
  username,
  stories,
  index,
  onIndexChange,
  onClose,
}: StoryPlayerProps) {
  const story = stories[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight" && index < stories.length - 1) {
        onIndexChange(index + 1);
      }
      if (event.key === "ArrowLeft" && index > 0) {
        onIndexChange(index - 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndexChange, stories.length]);

  useEffect(() => {
    setPaused(false);
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = 0;
    void video.play().catch(() => setPaused(true));
  }, [story?.id]);

  if (!story) {
    return null;
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  const downloadHref = storyMediaPath(username, story.id, "download");
  const playSrc = storyMediaPath(username, story.id, "play");
  const coverSrc = story.coverUrl
    ? storyMediaPath(username, story.id, "cover")
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Public story from @${username}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
      >
        Close
      </button>

      <div
        className="flex w-[min(100%,22rem,calc((100dvh-11rem)*9/16))] flex-col items-stretch gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-black shadow-2xl ring-1 ring-white/15">
          {story.type === "photo" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={playSrc}
              alt={`Public TikTok story from @${username}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
              playsInline
              autoPlay
              poster={coverSrc}
              src={playSrc}
              onClick={togglePlayback}
              onEnded={() => {
                if (index < stories.length - 1) {
                  onIndexChange(index + 1);
                } else {
                  setPaused(true);
                }
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/55 to-transparent px-3 pt-3 pb-10">
            <div className="flex gap-1">
              {stories.map((item, storyIndex) => (
                <span
                  key={item.id}
                  className={`h-0.5 flex-1 rounded-full ${storyIndex === index ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
            <p className="pt-3 text-sm font-medium text-white">@{username}</p>
          </div>
          {story.type === "video" && paused ? (
            <button
              type="button"
              onClick={togglePlayback}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 text-4xl text-white"
              aria-label="Play"
            >
              ▶
            </button>
          ) : null}
        </div>
        <a
          href={downloadHref}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-teal-800 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Download
        </a>
        <p className="text-center text-xs text-white/70">
          {story.expiresAt
            ? `Expires ${formatDateTime(story.expiresAt)}`
            : "Active public story"}
        </p>
      </div>
    </div>
  );
}

type StoryProfileStripProps = {
  profile: TikTokProfile;
};

export function StoryProfileStrip({ profile }: StoryProfileStripProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-3xl border border-zinc-200 bg-white p-4">
      {profile.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-500">
          {profile.displayName.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-semibold text-zinc-900">{profile.displayName}</p>
        <p className="truncate text-sm text-zinc-500">@{profile.username}</p>
      </div>
      <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
        <Link
          href={`/?username=${encodeURIComponent(profile.username)}`}
          className="text-sm font-semibold text-teal-800 hover:underline"
        >
          View profile
        </Link>
        {profile.userId ? (
          <p className="hidden font-mono text-xs text-zinc-500 sm:block">
            ID {profile.userId}
          </p>
        ) : null}
      </div>
    </div>
  );
}
