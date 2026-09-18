import type { StoriesLookupResult, LookupStatus } from "@/lib/tiktok/types";

const STORY_TTL_MS = 10 * 60 * 1000;

const CACHEABLE_STATUSES = new Set<LookupStatus>([
  "success",
  "no_stories",
  "not_found",
  "private",
]);

type CacheEntry = {
  expiresAt: number;
  result: StoriesLookupResult;
  cookies: string | null;
};

const store = new Map<string, CacheEntry>();

export function getCachedStories(username: string): StoriesLookupResult | null {
  return getEntry(username)?.result ?? null;
}

export function getCachedStoryCookies(username: string): string | null {
  return getEntry(username)?.cookies ?? null;
}

export function setCachedStories(
  username: string,
  result: StoriesLookupResult,
  cookies: string | null = null,
  ttlMs = STORY_TTL_MS,
): void {
  if (!CACHEABLE_STATUSES.has(result.status)) {
    return;
  }

  store.set(cacheKey(username), {
    result,
    cookies,
    expiresAt: Date.now() + ttlMs,
  });
}

function getEntry(username: string): CacheEntry | null {
  const key = cacheKey(username);
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry;
}

function cacheKey(username: string): string {
  return `stories:v3:${username.toLowerCase()}`;
}
