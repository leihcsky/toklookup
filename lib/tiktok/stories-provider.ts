import { PROFILE_HEADERS, cookieHeaderFrom, fetchPublicProfilePage } from "./public-page-provider";
import { parseStoryList } from "./stories-parser";
import type { StoriesLookupResult } from "./types";

const FETCH_TIMEOUT_MS = 15_000;

export type StoryLookupSession = {
  result: StoriesLookupResult;
  cookies: string | null;
};

export async function lookupPublicStories(
  username: string,
): Promise<StoryLookupSession> {
  const page = await fetchPublicProfilePage(username);
  let cookies = page.cookies;
  const { result } = page;

  if (result.status === "private") {
    return { result: { status: "private", profile: result.profile }, cookies };
  }

  if (result.status !== "success" || !result.profile?.userId) {
    if (result.status === "success") {
      return { result: { status: "unavailable", profile: result.profile }, cookies };
    }

    return {
      result: {
        status: result.status,
        profile: result.profile,
      },
      cookies,
    };
  }

  const payload = await requestStoryList(
    result.profile.userId,
    result.profile.username,
    cookies,
  );
  if (payload.json === null || !isRecord(payload.json)) {
    return { result: { status: "unavailable", profile: result.profile }, cookies };
  }

  cookies = mergeCookies(cookies, payload.cookies);

  const statusCode = Number(payload.json.statusCode);
  if (Number.isFinite(statusCode) && statusCode !== 0) {
    return { result: { status: "unavailable", profile: result.profile }, cookies };
  }

  if (!("itemList" in payload.json) && statusCode !== 0) {
    return { result: { status: "unavailable", profile: result.profile }, cookies };
  }

  const stories = parseStoryList(payload.json);
  if (stories.length === 0) {
    const total = Number(payload.json.TotalCount);
    if (Number.isFinite(total) && total > 0) {
      return { result: { status: "unavailable", profile: result.profile }, cookies };
    }

    return {
      result: { status: "no_stories", profile: result.profile, stories: [] },
      cookies,
    };
  }

  return {
    result: { status: "success", profile: result.profile, stories },
    cookies,
  };
}

function mergeCookies(current: string | null, extra: string | null): string | null {
  if (!current) {
    return extra;
  }
  if (!extra) {
    return current;
  }

  const map = new Map<string, string>();
  for (const part of `${current}; ${extra}`.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name) {
      map.set(name, rest.join("="));
    }
  }

  return [...map.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function requestStoryList(
  userId: string,
  username: string,
  cookies: string | null,
): Promise<{ json: unknown | null; cookies: string | null }> {
  const url = new URL("https://www.tiktok.com/api/story/item_list/");
  url.searchParams.set("aid", "1988");
  url.searchParams.set("app_language", "en");
  url.searchParams.set("authorId", userId);
  url.searchParams.set("count", "20");
  url.searchParams.set("cursor", "0");
  url.searchParams.set("loadBackward", "false");

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        ...PROFILE_HEADERS,
        Accept: "application/json, text/plain, */*",
        Referer: `https://www.tiktok.com/@${encodeURIComponent(username)}`,
        ...(cookies ? { Cookie: cookies } : {}),
      },
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return { json: null, cookies: null };
  }

  if (!response.ok) {
    return { json: null, cookies: cookieHeaderFrom(response) };
  }

  try {
    return {
      json: await response.json(),
      cookies: cookieHeaderFrom(response),
    };
  } catch {
    return { json: null, cookies: cookieHeaderFrom(response) };
  }
}
