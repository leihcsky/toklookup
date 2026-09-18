import { parseProfileHtml } from "./parser";
import type { LookupResult } from "./types";

export const PROFILE_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

const FETCH_TIMEOUT_MS = 15_000;

export async function fetchPublicProfile(username: string): Promise<LookupResult> {
  const page = await fetchPublicProfilePage(username);
  return page.result;
}

export async function fetchPublicProfilePage(username: string): Promise<{
  result: LookupResult;
  cookies: string | null;
}> {
  const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: PROFILE_HEADERS,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return { result: { status: "fetch_error" }, cookies: null };
  }

  const cookies = cookieHeaderFrom(response);

  if (response.status === 404) {
    return { result: { status: "not_found" }, cookies };
  }

  if (!response.ok) {
    return { result: { status: "fetch_error" }, cookies };
  }

  const html = await response.text();
  return { result: parseProfileHtml(html), cookies };
}

export function cookieHeaderFrom(response: Response): string | null {
  const raw =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  const parts = raw
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join("; ") : null;
}
