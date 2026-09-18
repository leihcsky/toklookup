import { getCachedStories, setCachedStories } from "@/lib/cache/stories";
import { allowRequest, getClientIp } from "@/lib/rate-limit";
import { STORY_MESSAGES } from "@/lib/tiktok/messages";
import { lookupPublicStories } from "@/lib/tiktok/stories-provider";
import { toClientStories } from "@/lib/tiktok/story-media-url";
import type {
  LookupStatus,
  StoriesLookupResult,
  TikTokProfile,
  TikTokStory,
} from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StoriesResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
  stories?: TikTokStory[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("username") ?? searchParams.get("q") ?? "";
  const username = normalizeUsername(rawQuery);

  if (!username) {
    return NextResponse.json<StoriesResponse>(
      {
        success: false,
        status: "invalid_username",
        cached: false,
        message: STORY_MESSAGES.invalid_username,
      },
      { status: 400 },
    );
  }

  const cached = getCachedStories(username);
  if (cached) {
    return NextResponse.json(toResponse(cached, true, username));
  }

  const ip = getClientIp(request);
  if (!allowRequest(ip)) {
    return NextResponse.json<StoriesResponse>(
      {
        success: false,
        status: "rate_limited",
        cached: false,
        message: STORY_MESSAGES.rate_limited,
      },
      { status: 429 },
    );
  }

  const lookup = await lookupPublicStories(username);
  setCachedStories(username, lookup.result, lookup.cookies);
  return NextResponse.json(toResponse(lookup.result, false, username), {
    status: httpStatusFor(lookup.result.status),
  });
}

function toResponse(
  result: StoriesLookupResult,
  cached: boolean,
  username: string,
): StoriesResponse {
  if (result.status === "success") {
    return {
      success: true,
      status: "success",
      cached,
      profile: result.profile,
      stories: toClientStories(username, result.stories),
    };
  }

  if (result.status === "no_stories") {
    return {
      success: true,
      status: "no_stories",
      cached,
      message: STORY_MESSAGES.no_stories,
      profile: result.profile,
      stories: [],
    };
  }

  return {
    success: false,
    status: result.status,
    cached,
    message: STORY_MESSAGES[result.status],
    profile: result.profile,
    stories: result.stories,
  };
}

function httpStatusFor(status: LookupStatus): number {
  switch (status) {
    case "success":
    case "no_stories":
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
