import { fetchPublicProfile } from "./public-page-provider";
import type { TikTokDataProvider } from "./types";

export const tiktokDataProvider: TikTokDataProvider = {
  getProfile: fetchPublicProfile,
};
