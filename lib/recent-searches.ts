const STORAGE_KEY = "toklookup.recentSearches";
const MAX_RECENT = 8;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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

export function rememberSearch(username: string, current: string[]): string[] {
  const next = [
    username,
    ...current.filter((item) => item.toLowerCase() !== username.toLowerCase()),
  ].slice(0, MAX_RECENT);

  persist(next);
  return next;
}

export function forgetSearch(username: string, current: string[]): string[] {
  const next = current.filter(
    (item) => item.toLowerCase() !== username.toLowerCase(),
  );
  persist(next);
  return next;
}

export function clearRecentSearches(): string[] {
  persist([]);
  return [];
}

function persist(items: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
