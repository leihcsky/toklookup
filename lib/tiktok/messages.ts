import type { LookupStatus } from "./types";

export const USER_MESSAGES: Record<Exclude<LookupStatus, "success">, string> = {
  not_found: "We couldn't find a public TikTok profile for this username.",
  private:
    "This account may be private or its public information is unavailable.",
  unavailable:
    "TikTok profile data is temporarily unavailable. Please try again later.",
  rate_limited: "Too many lookups. Please wait a moment and try again.",
  fetch_error:
    "TikTok profile data is temporarily unavailable. Please try again later.",
  parse_error:
    "TikTok profile data is temporarily unavailable. Please try again later.",
  invalid_username: "Enter a TikTok username, @username, or profile URL.",
  no_stories:
    "This public account has no currently active stories. Stories expire after about 24 hours.",
};

export const STORY_MESSAGES = {
  ...USER_MESSAGES,
  unavailable:
    "Public stories are temporarily unavailable. Please try again later.",
  fetch_error:
    "Public stories are temporarily unavailable. Please try again later.",
  parse_error:
    "Public stories are temporarily unavailable. Please try again later.",
} as const;
