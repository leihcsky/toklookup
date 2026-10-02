import {
  getCachedRepostPage,
  getCachedRepostSession,
  setCachedRepostPage,
  setCachedRepostSession,
} from "@/lib/cache/reposts";
import { allowRequest, getClientIp } from "@/lib/rate-limit";
import { REPOST_MESSAGES } from "@/lib/tiktok/messages";
import { fetchRepostPage, openRepostSession } from "@/lib/tiktok/reposts-provider";
import type {
  LookupStatus,
  RepostRecord,
  TikTokProfile,
  TikTokRepost,
} from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RepostsResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
  reposts: TikTokRepost[];
  hasMore: boolean;
  cursor: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("username") ?? searchParams.get("q") ?? "";
  const username = normalizeUsername(rawQuery);
  const cursorParam = searchParams.get("cursor") ?? "0";
  const cursor = /^\d{1,20}$/.test(cursorParam) ? cursorParam : "0";

  if (!username) {
    return respond({ status: "invalid_username", cached: false }, 400);
  }

  const ip = getClientIp(request);
  let cached = true;
  let charged = false;

  let sessionEntry = getCachedRepostSession(username);
  if (!sessionEntry) {
    if (!allowRequest(ip)) {
      return respond({ status: "rate_limited", cached: false }, 429);
    }
    charged = true;
    cached = false;

    const opened = await openRepostSession(username);
    sessionEntry =
      opened.status === "success"
        ? { status: "success", session: opened.session }
        : { status: opened.status, profile: opened.profile };
    setCachedRepostSession(username, sessionEntry);
  }

  if (sessionEntry.status !== "success") {
    return respond(
      { status: sessionEntry.status, cached, profile: sessionEntry.profile },
      httpStatusFor(sessionEntry.status),
    );
  }

  let { session } = sessionEntry;
  let page = getCachedRepostPage(session.profile.username, cursor);
  if (!page) {
    if (!charged && !allowRequest(ip)) {
      return respond({ status: "rate_limited", cached: false, profile: session.profile }, 429);
    }
    cached = false;

    let fetched = await fetchRepostPage(session, cursor);
    if (fetched.status === "success" && isEmptyFirstPage(cursor, fetched)) {
      // TikTok sometimes answers a throttled request with an empty first page; retry on fresh cookies.
      const reopened = await openRepostSession(username);
      if (reopened.status === "success") {
        session = reopened.session;
        setCachedRepostSession(username, { status: "success", session });
        fetched = await fetchRepostPage(session, cursor);
      }
    }
    if (fetched.status !== "success") {
      return respond({ status: "unavailable", cached: false, profile: session.profile }, 502);
    }

    page = { reposts: fetched.reposts, hasMore: fetched.hasMore, cursor: fetched.cursor };
    if (!isEmptyFirstPage(cursor, page)) {
      setCachedRepostPage(session.profile.username, cursor, page, session.cookies);
    }
  }

  if (isEmptyFirstPage(cursor, page)) {
    return respond({ status: "no_reposts", cached, profile: session.profile }, 200);
  }

  return NextResponse.json<RepostsResponse>({
    success: true,
    status: "success",
    cached,
    profile: session.profile,
    reposts: page.reposts.map(toClientRepost),
    hasMore: page.hasMore,
    cursor: page.cursor,
  });
}

function isEmptyFirstPage(
  cursor: string,
  page: { reposts: unknown[]; hasMore: boolean },
): boolean {
  return cursor === "0" && page.reposts.length === 0 && !page.hasMore;
}

function toClientRepost(record: RepostRecord): TikTokRepost {
  const repost: TikTokRepost & { playUrl?: string | null } = { ...record };
  delete repost.playUrl;
  return repost;
}

function respond(
  {
    status,
    cached,
    profile,
  }: { status: Exclude<LookupStatus, "success">; cached: boolean; profile?: TikTokProfile },
  httpStatus: number,
) {
  return NextResponse.json<RepostsResponse>(
    {
      success: status === "no_reposts",
      status,
      cached,
      message: REPOST_MESSAGES[status],
      profile,
      reposts: [],
      hasMore: false,
      cursor: null,
    },
    { status: httpStatus },
  );
}

function httpStatusFor(status: LookupStatus): number {
  switch (status) {
    case "success":
    case "no_reposts":
    case "private":
      return 200;
    case "invalid_username":
      return 400;
    case "rate_limited":
      return 429;
    case "not_found":
      return 404;
    default:
      return 502;
  }
}
