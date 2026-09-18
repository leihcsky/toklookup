"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { SearchBox } from "@/components/SearchBox";
import { StoryGrid, StoryProfileStrip } from "@/components/StoryGrid";
import {
  STORY_SEARCHES_KEY,
  clearRecentSearches,
  forgetSearch,
  readRecentSearches,
  rememberSearch,
} from "@/lib/recent-searches";
import { STORY_MESSAGES } from "@/lib/tiktok/messages";
import type { LookupStatus, TikTokProfile, TikTokStory } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type ApiResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
  stories?: TikTokStory[];
};

export function StoryLookupTool() {
  return (
    <Suspense fallback={<div className="min-h-28" />}>
      <StoryLookupToolInner />
    </Suspense>
  );
}

function StoryLookupToolInner() {
  const searchParams = useSearchParams();
  const usernameFromUrl = (
    searchParams.get("username") ??
    searchParams.get("q") ??
    ""
  ).trim();
  const [query, setQuery] = useState(usernameFromUrl);
  const [loading, setLoading] = useState(Boolean(usernameFromUrl));
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [stories, setStories] = useState<TikTokStory[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches(STORY_SEARCHES_KEY));
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
      setStories([]);
      setError(STORY_MESSAGES.invalid_username);
      return;
    }

    setQuery(value);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tiktok/stories?username=${encodeURIComponent(value)}`,
      );
      const data = (await response.json()) as ApiResponse;
      const attempted = data.profile?.username || normalizeUsername(value);

      if (attempted) {
        setRecentSearches((current) =>
          rememberSearch(attempted, current, STORY_SEARCHES_KEY),
        );
      }

      setProfile(data.profile ?? null);
      setStories(data.stories ?? []);

      if (data.status === "success") {
        setError(null);
        return;
      }

      setError(data.message || STORY_MESSAGES.unavailable);
    } catch {
      setProfile(null);
      setStories([]);
      setError(STORY_MESSAGES.fetch_error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-5">
      <SearchBox
        value={query}
        loading={loading}
        recentSearches={recentSearches}
        inputId="tiktok-story-username"
        submitLabel="View Stories"
        loadingLabel="Loading stories…"
        onChange={setQuery}
        onSubmit={() => handleSubmit()}
        onSelectRecent={(username) => handleSubmit(`@${username}`)}
        onRemoveRecent={(username) =>
          setRecentSearches((current) =>
            forgetSearch(username, current, STORY_SEARCHES_KEY),
          )
        }
        onClearRecent={() =>
          setRecentSearches(clearRecentSearches(STORY_SEARCHES_KEY))
        }
      />
      {error ? <ErrorMessage message={error} /> : null}
      {profile ? <StoryProfileStrip profile={profile} /> : null}
      {stories.length > 0 && profile ? (
        <StoryGrid username={profile.username} stories={stories} />
      ) : null}
    </div>
  );
}
