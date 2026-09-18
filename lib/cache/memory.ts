import type { LookupResult, LookupStatus } from "@/lib/tiktok/types";

const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000;

const CACHEABLE_STATUSES = new Set<LookupStatus>([
  "success",
  "not_found",
  "private",
]);

type CacheEntry = {
  expiresAt: number;
  result: LookupResult;
};

const store = new Map<string, CacheEntry>();

export function getCachedProfile(username: string): LookupResult | null {
  const key = cacheKey(username);
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.result;
}

export function setCachedProfile(
  username: string,
  result: LookupResult,
  ttlMs = DEFAULT_TTL_MS,
): void {
  if (!CACHEABLE_STATUSES.has(result.status)) {
    return;
  }

  store.set(cacheKey(username), {
    result,
    expiresAt: Date.now() + ttlMs,
  });
}

function cacheKey(username: string): string {
  return username.toLowerCase();
}
