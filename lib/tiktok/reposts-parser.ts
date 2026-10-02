import { toNumber } from "./normalizer";
import { isAllowedMediaUrl } from "./stories-parser";
import type { RepostRecord, RepostRecordPage, TikTokRepostAuthor } from "./types";

export function parseRepostPage(payload: unknown): RepostRecordPage {
  if (!isRecord(payload) || !Array.isArray(payload.itemList)) {
    return { reposts: [], hasMore: false, cursor: null };
  }

  const reposts: RepostRecord[] = [];
  const seen = new Set<string>();
  for (const raw of payload.itemList) {
    const repost = normalizeRepostItem(raw);
    if (repost && !seen.has(repost.id)) {
      seen.add(repost.id);
      reposts.push(repost);
    }
  }

  const hasMore = payload.hasMore === true || payload.hasMore === 1;
  const cursor =
    hasMore && (typeof payload.cursor === "string" || typeof payload.cursor === "number")
      ? String(payload.cursor)
      : null;

  return { reposts, hasMore: hasMore && cursor !== null, cursor };
}

function normalizeRepostItem(raw: unknown): RepostRecord | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = typeof raw.id === "string" || typeof raw.id === "number" ? String(raw.id) : "";
  if (!id || raw.privateItem === true || raw.secret === true) {
    return null;
  }

  const video = isRecord(raw.video) ? raw.video : null;
  const imagePost = isRecord(raw.imagePost) ? raw.imagePost : null;
  const stats = isRecord(raw.statsV2) ? raw.statsV2 : isRecord(raw.stats) ? raw.stats : null;
  const author = normalizeAuthor(raw.author);

  const coverUrl =
    pickUrl(video?.cover) ||
    pickUrl(video?.originCover) ||
    pickUrl(video?.dynamicCover) ||
    pickUrl(imagePost?.cover) ||
    pickUrl(imagePost?.images);
  const safeCover = coverUrl && isAllowedMediaUrl(coverUrl) ? coverUrl : null;

  const images = imagePost && Array.isArray(imagePost.images)
    ? imagePost.images
        .map((image) => pickUrl(image))
        .filter((url): url is string => Boolean(url && isAllowedMediaUrl(url)))
    : [];
  const playCandidate = imagePost
    ? null
    : pickUrl(video?.playAddr) || pickUrl(video?.PlayAddrStruct) || pickUrl(video?.downloadAddr);
  const playUrl = playCandidate && isAllowedMediaUrl(playCandidate) ? playCandidate : null;

  const authorPath = author ? `@${encodeURIComponent(author.username)}` : "@";
  const durationSeconds = toNumber(
    typeof video?.duration === "number" || typeof video?.duration === "string"
      ? video.duration
      : null,
  );

  return {
    id,
    type: imagePost ? "photo" : "video",
    description: typeof raw.desc === "string" && raw.desc.trim() ? raw.desc.trim() : null,
    coverUrl: safeCover,
    durationSeconds: durationSeconds && durationSeconds > 0 ? durationSeconds : null,
    createdAt: timestampToIso(raw.createTime),
    playCount: countFrom(stats?.playCount),
    likeCount: countFrom(stats?.diggCount),
    author,
    videoUrl: `https://www.tiktok.com/${authorPath}/${imagePost ? "photo" : "video"}/${id}`,
    images,
    playable: Boolean(playUrl) || images.length > 0,
    playUrl,
  };
}

function normalizeAuthor(value: unknown): TikTokRepostAuthor | null {
  if (!isRecord(value) || typeof value.uniqueId !== "string" || !value.uniqueId.trim()) {
    return null;
  }

  const username = value.uniqueId.trim();
  const avatar =
    pickUrl(value.avatarThumb) || pickUrl(value.avatarMedium) || pickUrl(value.avatarLarger);

  return {
    username,
    displayName:
      typeof value.nickname === "string" && value.nickname.trim()
        ? value.nickname.trim()
        : username,
    avatarUrl: avatar && isAllowedMediaUrl(avatar) ? avatar : null,
  };
}

function countFrom(value: unknown): number | null {
  if (typeof value === "number" || typeof value === "string") {
    return toNumber(value);
  }
  return null;
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

function timestampToIso(value: unknown): string | null {
  const numeric = countFrom(value);
  if (numeric === null || numeric <= 0) {
    return null;
  }

  const date = new Date(numeric > 1e12 ? numeric : numeric * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
