import { getCachedProfile, setCachedProfile } from "@/lib/cache/memory";
import { allowRequest, getClientIp } from "@/lib/rate-limit";
import { USER_MESSAGES } from "@/lib/tiktok/messages";
import { tiktokDataProvider } from "@/lib/tiktok/provider";
import type { LookupResult, LookupStatus, TikTokProfile } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ProfileResponse = {
  success: boolean;
  status: LookupStatus;
  cached: boolean;
  message?: string;
  profile?: TikTokProfile;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("username") ?? searchParams.get("q") ?? "";
  const username = normalizeUsername(rawQuery);

  if (!username) {
    return NextResponse.json<ProfileResponse>(
      {
        success: false,
        status: "invalid_username",
        cached: false,
        message: USER_MESSAGES.invalid_username,
      },
      { status: 400 },
    );
  }

  const cached = getCachedProfile(username);
  if (cached) {
    return NextResponse.json(toResponse(cached, true));
  }

  const ip = getClientIp(request);
  if (!allowRequest(ip)) {
    return NextResponse.json<ProfileResponse>(
      {
        success: false,
        status: "rate_limited",
        cached: false,
        message: USER_MESSAGES.rate_limited,
      },
      { status: 429 },
    );
  }

  const result = await tiktokDataProvider.getProfile(username);
  setCachedProfile(username, result);
  return NextResponse.json(toResponse(result, false), {
    status: httpStatusFor(result.status),
  });
}

function toResponse(result: LookupResult, cached: boolean): ProfileResponse {
  if (result.status === "success") {
    return {
      success: true,
      status: "success",
      cached,
      profile: result.profile,
    };
  }

  return {
    success: false,
    status: result.status,
    cached,
    message: USER_MESSAGES[result.status],
    profile: result.profile,
  };
}

function httpStatusFor(status: LookupStatus): number {
  switch (status) {
    case "success":
      return 200;
    case "invalid_username":
      return 400;
    case "rate_limited":
      return 429;
    case "not_found":
      return 404;
    case "private":
      return 200;
    default:
      return 502;
  }
}
