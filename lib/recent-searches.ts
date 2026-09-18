const STORAGE_KEY = "toklookup.recentSearches";
export const STORY_SEARCHES_KEY = "toklookup.recentStorySearches";
const MAX_RECENT = 8;

export function readRecentSearches(
  storageKey = STORAGE_KEY,
): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function rememberSearch(
  username: string,
  current: string[],
  storageKey = STORAGE_KEY,
): string[] {
  const next = [
    username,
    ...current.filter((item) => item.toLowerCase() !== username.toLowerCase()),
  ].slice(0, MAX_RECENT);

  persist(next, storageKey);
  return next;
}

export function forgetSearch(
  username: string,
  current: string[],
  storageKey = STORAGE_KEY,
): string[] {
  const next = current.filter(
    (item) => item.toLowerCase() !== username.toLowerCase(),
  );
  persist(next, storageKey);
  return next;
}

export function clearRecentSearches(storageKey = STORAGE_KEY): string[] {
  persist([], storageKey);
  return [];
}

function persist(items: string[], storageKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items));
}
