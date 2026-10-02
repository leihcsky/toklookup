"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { ProfileStrip } from "@/components/ProfileStrip";
import { RepostGrid } from "@/components/RepostGrid";
import { SearchBox } from "@/components/SearchBox";
import {
  REPOST_SEARCHES_KEY,
  clearRecentSearches,
  forgetSearch,
  readRecentSearches,
  rememberSearch,
} from "@/lib/recent-searches";
import { REPOST_MESSAGES } from "@/lib/tiktok/messages";
import type { LookupStatus, TikTokProfile, TikTokRepost } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type ApiResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
  reposts?: TikTokRepost[];
  hasMore?: boolean;
  cursor?: string | null;
};

export function RepostLookupTool() {
  return (
    <Suspense fallback={<div className="min-h-28" />}>
      <RepostLookupToolInner />
    </Suspense>
  );
}

function RepostLookupToolInner() {
  const searchParams = useSearchParams();
  const usernameFromUrl = (
    searchParams.get("username") ??
    searchParams.get("q") ??
    ""
  ).trim();
  const [query, setQuery] = useState(usernameFromUrl);
  const [loading, setLoading] = useState(Boolean(usernameFromUrl));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [reposts, setReposts] = useState<TikTokRepost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches(REPOST_SEARCHES_KEY));
  }, []);

  useEffect(() => {
    if (!usernameFromUrl) {
      return;
    }
    void handleSubmit(usernameFromUrl);
    // Lookup once when the page is opened with a username.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameFromUrl]);

  async function handleSubmit(nextQuery = query) {
    const value = nextQuery.trim();
    if (!value) {
      setProfile(null);
      setReposts([]);
      setHasMore(false);
      setError(REPOST_MESSAGES.invalid_username);
      return;
    }

    setQuery(value);
    setLoading(true);
    setError(null);
    setMoreError(null);

    try {
      const response = await fetch(
        `/api/tiktok/reposts?username=${encodeURIComponent(value)}`,
      );
      const data = (await response.json()) as ApiResponse;
      const attempted = data.profile?.username || normalizeUsername(value);

      if (attempted) {
        setRecentSearches((current) =>
          rememberSearch(attempted, current, REPOST_SEARCHES_KEY),
        );
      }

      setProfile(data.profile ?? null);
      setReposts(data.reposts ?? []);
      setHasMore(Boolean(data.hasMore && data.cursor));
      setCursor(data.cursor ?? null);
      setError(data.status === "success" ? null : data.message || REPOST_MESSAGES.unavailable);
    } catch {
      setProfile(null);
      setReposts([]);
      setHasMore(false);
      setError(REPOST_MESSAGES.fetch_error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!profile || !cursor || loadingMore) {
      return;
    }

    setLoadingMore(true);
    setMoreError(null);

    try {
      const response = await fetch(
        `/api/tiktok/reposts?username=${encodeURIComponent(profile.username)}&cursor=${encodeURIComponent(cursor)}`,
      );
      const data = (await response.json()) as ApiResponse;

      if (data.status !== "success") {
        setMoreError(data.message || REPOST_MESSAGES.unavailable);
        return;
      }

      setReposts((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...(data.reposts ?? []).filter((item) => !known.has(item.id))];
      });
      setHasMore(Boolean(data.hasMore && data.cursor));
      setCursor(data.cursor ?? null);
    } catch {
      setMoreError(REPOST_MESSAGES.fetch_error);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="min-w-0 space-y-5">
      <SearchBox
        value={query}
        loading={loading}
        recentSearches={recentSearches}
        inputId="tiktok-repost-username"
        submitLabel="View Reposts"
        loadingLabel="Loading reposts…"
        onChange={setQuery}
        onSubmit={() => handleSubmit()}
        onSelectRecent={(username) => handleSubmit(`@${username}`)}
        onRemoveRecent={(username) =>
          setRecentSearches((current) =>
            forgetSearch(username, current, REPOST_SEARCHES_KEY),
          )
        }
        onClearRecent={() =>
          setRecentSearches(clearRecentSearches(REPOST_SEARCHES_KEY))
        }
      />
      {error ? <ErrorMessage message={error} /> : null}
      {profile ? <ProfileStrip profile={profile} /> : null}
      {reposts.length > 0 ? (
        <section className="space-y-4" aria-label={`Public reposts from @${profile?.username ?? ""}`}>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Reposts · {reposts.length}
            {hasMore ? "+" : ""}
          </h2>
          {profile ? (
            <RepostGrid
              ownerUsername={profile.username}
              reposts={reposts}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={loadMore}
            />
          ) : null}
          <div className="flex flex-col items-center gap-2 pt-2">
            {moreError ? <p className="text-sm text-red-700">{moreError}</p> : null}
            {hasMore ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-11 min-w-40 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-teal-700 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            ) : (
              <p className="text-sm text-zinc-500">You&apos;ve reached the end of the public reposts.</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
