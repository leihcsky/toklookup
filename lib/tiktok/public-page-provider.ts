import { parseProfileHtml } from "./parser";
import type { LookupResult } from "./types";

const PROFILE_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

const FETCH_TIMEOUT_MS = 15_000;

export async function fetchPublicProfile(username: string): Promise<LookupResult> {
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
    return { status: "fetch_error" };
  }

  if (response.status === 404) {
    return { status: "not_found" };
  }

  if (!response.ok) {
    return { status: "fetch_error" };
  }

  const html = await response.text();
  return parseProfileHtml(html);
}
