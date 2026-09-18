"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { ProfileCard } from "@/components/ProfileCard";
import { SearchBox } from "@/components/SearchBox";
import {
  clearRecentSearches,
  forgetSearch,
  readRecentSearches,
  rememberSearch,
} from "@/lib/recent-searches";
import { USER_MESSAGES } from "@/lib/tiktok/messages";
import type { LookupStatus, TikTokProfile } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { useEffect, useState } from "react";

type ApiResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
};

export function LookupTool() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  async function handleSubmit(nextQuery = query) {
    const value = nextQuery.trim();
    if (!value) {
      setProfile(null);
      setError(USER_MESSAGES.invalid_username);
      return;
    }

    setQuery(value);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tiktok/profile?username=${encodeURIComponent(value)}`,
      );
      const data = (await response.json()) as ApiResponse;

      if (data.success && data.profile) {
        const found = data.profile;
        setProfile(found);
        setError(null);
        setRecentSearches((current) => rememberSearch(found.username, current));
        return;
      }

      const attempted = normalizeUsername(value);
      if (attempted) {
        setRecentSearches((current) => rememberSearch(attempted, current));
      }

      setProfile(data.profile ?? null);
      setError(data.message || USER_MESSAGES.unavailable);
    } catch {
      setProfile(null);
      setError(USER_MESSAGES.fetch_error);
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
        onChange={setQuery}
        onSubmit={() => handleSubmit()}
        onSelectRecent={(username) => handleSubmit(`@${username}`)}
        onRemoveRecent={(username) =>
          setRecentSearches((current) => forgetSearch(username, current))
        }
        onClearRecent={() => setRecentSearches(clearRecentSearches())}
      />
      {error ? <ErrorMessage message={error} /> : null}
      {profile ? <ProfileCard profile={profile} /> : null}
    </div>
  );
}
