import {
  PROFILE_HEADERS,
  cookieHeaderFrom,
  fetchPublicProfilePage,
  mergeCookies,
} from "./public-page-provider";
import { parseRepostPage } from "./reposts-parser";
import type { LookupResult, RepostRecordPage, TikTokProfile } from "./types";

const FETCH_TIMEOUT_MS = 15_000;
const PAGE_SIZE = 30;

export type RepostSession = {
  profile: TikTokProfile;
  secUid: string;
  cookies: string | null;
};

export type RepostSessionResult =
  | { status: "success"; session: RepostSession }
  | { status: Exclude<LookupResult["status"], "success">; profile?: TikTokProfile };

export type RepostPageResult =
  | ({ status: "success" } & RepostRecordPage)
  | { status: "unavailable" };

export async function openRepostSession(username: string): Promise<RepostSessionResult> {
  const page = await fetchPublicProfilePage(username);
  const { result } = page;

  if (result.status !== "success") {
    return { status: result.status, profile: result.profile };
  }

  if (!result.profile.secUid) {
    return { status: "unavailable", profile: result.profile };
  }

  return {
    status: "success",
    session: {
      profile: result.profile,
      secUid: result.profile.secUid,
      cookies: page.cookies,
    },
  };
}

export async function fetchRepostPage(
  session: RepostSession,
  cursor: string,
): Promise<RepostPageResult> {
  const url = new URL("https://www.tiktok.com/api/repost/item_list/");
  url.searchParams.set("aid", "1988");
  url.searchParams.set("app_language", "en");
  url.searchParams.set("count", String(PAGE_SIZE));
  url.searchParams.set("cursor", cursor);
  url.searchParams.set("secUid", session.secUid);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        ...PROFILE_HEADERS,
        Accept: "application/json, text/plain, */*",
        Referer: `https://www.tiktok.com/@${encodeURIComponent(session.profile.username)}`,
        ...(session.cookies ? { Cookie: session.cookies } : {}),
      },
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return { status: "unavailable" };
  }

  session.cookies = mergeCookies(session.cookies, cookieHeaderFrom(response));

  if (!response.ok) {
    return { status: "unavailable" };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { status: "unavailable" };
  }

  if (!isRecord(json)) {
    return { status: "unavailable" };
  }

  const statusCode = Number(json.statusCode ?? json.status_code ?? 0);
  if (Number.isFinite(statusCode) && statusCode !== 0) {
    return { status: "unavailable" };
  }

  return { status: "success", ...parseRepostPage(json) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
