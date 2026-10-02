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
  no_reposts:
    "No public reposts were found for this account. The creator may not have reposted anything, or may have hidden their Reposts tab.",
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

export const REPOST_MESSAGES = {
  ...USER_MESSAGES,
  private:
    "This account is private, so its reposts are not public.",
  unavailable:
    "Public reposts are temporarily unavailable. Please try again later.",
  fetch_error:
    "Public reposts are temporarily unavailable. Please try again later.",
  parse_error:
    "Public reposts are temporarily unavailable. Please try again later.",
} as const;
