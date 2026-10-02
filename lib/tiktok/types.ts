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
  secUid: string | null;
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
  | "invalid_username"
  | "no_stories"
  | "no_reposts";

export type StoryKind = "video" | "photo";

export interface TikTokStory {
  id: string;
  type: StoryKind;
  coverUrl: string | null;
  mediaUrl: string | null;
  createdAt: string | null;
  expiresAt: string | null;
  durationSeconds: number | null;
}

export type StoriesLookupResult =
  | {
      status: "success";
      profile: TikTokProfile;
      stories: TikTokStory[];
    }
  | {
      status: "no_stories";
      profile: TikTokProfile;
      stories: [];
    }
  | {
      status: Exclude<LookupStatus, "success" | "no_stories">;
      profile?: TikTokProfile;
      stories?: TikTokStory[];
    };

export interface TikTokRepostAuthor {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface TikTokRepost {
  id: string;
  type: StoryKind;
  description: string | null;
  coverUrl: string | null;
  durationSeconds: number | null;
  createdAt: string | null;
  playCount: number | null;
  likeCount: number | null;
  author: TikTokRepostAuthor | null;
  videoUrl: string;
  images: string[];
  playable: boolean;
}

export interface RepostRecord extends TikTokRepost {
  playUrl: string | null;
}

export interface RepostPage {
  reposts: TikTokRepost[];
  hasMore: boolean;
  cursor: string | null;
}

export interface RepostRecordPage {
  reposts: RepostRecord[];
  hasMore: boolean;
  cursor: string | null;
}

export type RepostsLookupResult =
  | ({ status: "success"; profile: TikTokProfile } & RepostPage)
  | { status: "no_reposts"; profile: TikTokProfile; reposts: []; hasMore: false; cursor: null }
  | {
      status: Exclude<LookupStatus, "success" | "no_reposts">;
      profile?: TikTokProfile;
    };

export type LookupResult =
  | { status: "success"; profile: TikTokProfile }
  | {
      status: Exclude<LookupStatus, "success" | "no_stories" | "no_reposts">;
      profile?: TikTokProfile;
    };

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
  secUid?: string;
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
