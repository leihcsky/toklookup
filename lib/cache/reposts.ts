import type { RepostSession } from "@/lib/tiktok/reposts-provider";
import type { LookupStatus, RepostRecordPage, TikTokProfile } from "@/lib/tiktok/types";

const TTL_MS = 10 * 60 * 1000;
const MEDIA_TTL_MS = 30 * 60 * 1000;

export type RepostSessionData =
  | { status: "success"; session: RepostSession }
  | { status: Exclude<LookupStatus, "success">; profile?: TikTokProfile };

export type RepostMediaSource = {
  playUrl: string;
  referer: string;
  cookies: string | null;
};

type SessionEntry = RepostSessionData & { expiresAt: number };
type PageEntry = { expiresAt: number; page: RepostRecordPage };
type MediaEntry = RepostMediaSource & { expiresAt: number };

const CACHEABLE_STATUSES = new Set<LookupStatus>(["success", "not_found", "private"]);

const sessions = new Map<string, SessionEntry>();
const pages = new Map<string, PageEntry>();
const media = new Map<string, MediaEntry>();

export function getCachedRepostSession(username: string): RepostSessionData | null {
  return fresh(sessions, sessionKey(username));
}

export function setCachedRepostSession(username: string, entry: RepostSessionData): void {
  if (!CACHEABLE_STATUSES.has(entry.status)) {
    return;
  }
  sessions.set(sessionKey(username), { ...entry, expiresAt: Date.now() + TTL_MS });
}

export function getCachedRepostPage(username: string, cursor: string): RepostRecordPage | null {
  return fresh(pages, pageKey(username, cursor))?.page ?? null;
}

export function setCachedRepostPage(
  username: string,
  cursor: string,
  page: RepostRecordPage,
  cookies: string | null,
): void {
  const now = Date.now();
  pages.set(pageKey(username, cursor), { page, expiresAt: now + TTL_MS });

  for (const repost of page.reposts) {
    if (!repost.playUrl) {
      continue;
    }
    media.set(mediaKey(username, repost.id), {
      playUrl: repost.playUrl,
      referer: repost.videoUrl,
      cookies,
      expiresAt: now + MEDIA_TTL_MS,
    });
  }
}

export function getCachedRepostMedia(username: string, id: string): RepostMediaSource | null {
  return fresh(media, mediaKey(username, id));
}

function fresh<T extends { expiresAt: number }>(store: Map<string, T>, key: string): T | null {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry;
}

function sessionKey(username: string): string {
  return `reposts:session:${username.toLowerCase()}`;
}

function pageKey(username: string, cursor: string): string {
  return `reposts:page:v2:${username.toLowerCase()}:${cursor}`;
}

function mediaKey(username: string, id: string): string {
  return `reposts:media:${username.toLowerCase()}:${id}`;
}
