import { toNumber } from "./normalizer";
import type { TikTokStory } from "./types";

const STORY_TTL_MS = 24 * 60 * 60 * 1000;

export function parseStoryList(payload: unknown, now = Date.now()): TikTokStory[] {
  if (!isRecord(payload)) {
    return [];
  }

  const items = collectItems(payload.itemList);
  const stories: TikTokStory[] = [];

  for (const raw of items) {
    const story = normalizeStoryItem(raw, now);
    if (story) {
      stories.push(story);
    }
  }

  return stories;
}

export function isAllowedMediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }

    return /(^|\.)((tiktokcdn(-[a-z]+)?|tiktok|muscdn|musical|ibyteimg|byteoversea|byteicdn)\.com|musical\.ly)$/i.test(
      url.hostname,
    );
  } catch {
    return false;
  }
}

function collectItems(itemList: unknown): unknown[] {
  if (Array.isArray(itemList)) {
    return itemList;
  }

  if (isRecord(itemList)) {
    return Object.values(itemList);
  }

  return [];
}

function normalizeStoryItem(raw: unknown, now: number): TikTokStory | null {
  const item = unwrapItem(raw);
  if (!item) {
    return null;
  }

  const id = item.id === undefined || item.id === null ? "" : String(item.id);
  if (!id) {
    return null;
  }

  const video = isRecord(item.video) ? item.video : null;
  const imagePost = isRecord(item.imagePost) ? item.imagePost : null;
  const mediaUrl =
    pickUrl(video?.playAddr) ||
    pickUrl(video?.PlayAddrStruct) ||
    pickUrl(video?.downloadAddr) ||
    pickUrl(imagePost?.images) ||
    pickUrl(item.imageURL);
  const coverUrl =
    pickUrl(video?.originCover) ||
    pickUrl(video?.cover) ||
    pickUrl(video?.dynamicCover) ||
    pickUrl(imagePost?.cover) ||
    pickUrl(item.cover);

  if (!mediaUrl || !isAllowedMediaUrl(mediaUrl)) {
    return null;
  }

  const safeCover = coverUrl && isAllowedMediaUrl(coverUrl) ? coverUrl : null;

  const createdAt = timestampToIso(item.createTime ?? video?.createTime);
  const expiresAt =
    timestampToIso(item.expireTime) ??
    (createdAt ? new Date(new Date(createdAt).getTime() + STORY_TTL_MS).toISOString() : null);

  if (expiresAt && new Date(expiresAt).getTime() <= now) {
    return null;
  }

  const type: TikTokStory["type"] =
    imagePost || looksLikeImage(mediaUrl) ? "photo" : "video";
  const durationSeconds = toNumber(
    typeof video?.duration === "number" || typeof video?.duration === "string"
      ? video.duration
      : null,
  );

  return {
    id,
    type,
    coverUrl: safeCover,
    mediaUrl,
    createdAt,
    expiresAt,
    durationSeconds,
  };
}

function unwrapItem(raw: unknown): Record<string, unknown> | null {
  if (!isRecord(raw)) {
    return null;
  }

  const nested = isRecord(raw.story) ? raw.story : null;
  if (!nested) {
    return raw;
  }

  return {
    ...nested,
    ...raw,
    id: raw.id ?? nested.id,
    video: isRecord(raw.video) ? raw.video : nested.video,
    imagePost: isRecord(raw.imagePost) ? raw.imagePost : nested.imagePost,
    createTime: raw.createTime ?? nested.createTime,
    expireTime: raw.expireTime ?? nested.expireTime,
  };
}

function pickUrl(value: unknown): string | null {
  if (typeof value === "string" && /^https:\/\//i.test(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = pickUrl(entry);
      if (found) {
        return found;
      }
    }
    return null;
  }

  if (isRecord(value)) {
    return (
      pickUrl(value.UrlList) ||
      pickUrl(value.urlList) ||
      pickUrl(value.url) ||
      pickUrl(value.imageURL)
    );
  }

  return null;
}

function looksLikeImage(url: string): boolean {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url) || /\/tos-[^/]+\/.*image/i.test(url);
}

function timestampToIso(value: unknown): string | null {
  const numeric = toNumber(value as number | string | undefined | null);
  if (numeric === null || numeric <= 0) {
    return null;
  }

  const ms = numeric > 1e12 ? numeric : numeric * 1000;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
