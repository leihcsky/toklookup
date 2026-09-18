import type {
  RawTikTokStats,
  RawTikTokUser,
  RawUserDetail,
  TikTokProfile,
} from "./types";

export function toNumber(value: number | string | undefined | null): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function unixToIso(value: number | string | undefined | null): string | null {
  const seconds = toNumber(value);
  if (seconds === null || seconds <= 0) {
    return null;
  }

  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function normalizeBioLink(
  value: RawTikTokUser["bioLink"],
): string | null {
  const raw = typeof value === "string" ? value : value?.link;
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export function normalizeProfile(
  user: RawTikTokUser,
  stats: RawTikTokStats | undefined,
  fetchedAt = new Date().toISOString(),
): TikTokProfile | null {
  const username = user.uniqueId?.trim();
  if (!username) {
    return null;
  }

  const likeCount = toNumber(stats?.heartCount) ?? toNumber(stats?.heart);

  return {
    username,
    displayName: user.nickname?.trim() || username,
    avatarUrl:
      user.avatarLarger || user.avatarMedium || user.avatarThumb || null,
    bio: user.signature?.trim() ? user.signature.trim() : null,
    bioLink: normalizeBioLink(user.bioLink),
    followerCount: toNumber(stats?.followerCount),
    followingCount: toNumber(stats?.followingCount),
    likeCount,
    videoCount: toNumber(stats?.videoCount),
    verified: toBoolean(user.verified),
    userId: user.id === undefined || user.id === null ? null : String(user.id),
    language: user.language?.trim() || null,
    region: user.region?.trim() || null,
    createdAt: unixToIso(user.createTime),
    usernameChangedAt: unixToIso(user.uniqueIdModifyTime),
    nicknameChangedAt: unixToIso(user.nickNameModifyTime),
    profileUrl: `https://www.tiktok.com/@${username}`,
    fetchedAt,
  };
}

export function statsFromDetail(detail: RawUserDetail): RawTikTokStats | undefined {
  return detail.userInfo?.stats ?? detail.userInfo?.statsV2;
}
