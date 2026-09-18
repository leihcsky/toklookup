import type { TikTokStory } from "@/lib/tiktok/types";

export function storyMediaPath(
  username: string,
  id: string,
  kind: "play" | "cover" | "download" = "play",
): string {
  const params = new URLSearchParams({ username, id });
  if (kind === "cover") {
    params.set("kind", "cover");
    return `/api/tiktok/stories/media?${params.toString()}`;
  }
  if (kind === "download") {
    return `/api/tiktok/stories/download?${params.toString()}`;
  }
  return `/api/tiktok/stories/media?${params.toString()}`;
}

export function toClientStories(username: string, stories: TikTokStory[]): TikTokStory[] {
  return stories.map((story) => ({
    ...story,
    mediaUrl: storyMediaPath(username, story.id, "play"),
    coverUrl: story.coverUrl ? storyMediaPath(username, story.id, "cover") : null,
  }));
}
