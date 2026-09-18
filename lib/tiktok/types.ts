export interface TikTokProfile {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  bioLink: string | null;
  followerCount: number | null;
  followingCount: number | null;
  likeCount: number | null;
  videoCount: number | null;
  verified: boolean | null;
  userId: string | null;
  language: string | null;
  region: string | null;
  createdAt: string | null;
  usernameChangedAt: string | null;
  nicknameChangedAt: string | null;
  profileUrl: string;
  fetchedAt: string;
}

export type LookupStatus =
  | "success"
  | "not_found"
  | "private"
  | "unavailable"
  | "rate_limited"
  | "fetch_error"
  | "parse_error"
  | "invalid_username";

export type LookupResult =
  | { status: "success"; profile: TikTokProfile }
  | { status: Exclude<LookupStatus, "success">; profile?: TikTokProfile };

export interface TikTokDataProvider {
  getProfile(username: string): Promise<LookupResult>;
}

export interface RawUserDetail {
  statusCode?: number | string;
  statusMsg?: string;
  userInfo?: {
    user?: RawTikTokUser;
    stats?: RawTikTokStats;
    statsV2?: RawTikTokStats;
  };
}

export interface RawTikTokUser {
  id?: string | number;
  uniqueId?: string;
  nickname?: string;
  avatarLarger?: string;
  avatarMedium?: string;
  avatarThumb?: string;
  signature?: string;
  verified?: boolean;
  privateAccount?: boolean;
  region?: string;
  language?: string;
  createTime?: number | string;
  uniqueIdModifyTime?: number | string;
  nickNameModifyTime?: number | string;
  bioLink?: string | { link?: string };
}

export interface RawTikTokStats {
  followerCount?: number | string;
  followingCount?: number | string;
  heartCount?: number | string;
  heart?: number | string;
  videoCount?: number | string;
}
