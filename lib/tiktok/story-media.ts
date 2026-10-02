import { getCachedStories, getCachedStoryCookies, setCachedStories } from "@/lib/cache/stories";
import { allowRequest, getClientIp } from "@/lib/rate-limit";
import { streamTikTokMedia } from "@/lib/tiktok/media-proxy";
import { lookupPublicStories } from "@/lib/tiktok/stories-provider";
import type { TikTokStory } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";

export async function proxyStoryAsset(
  request: Request,
  options: { download?: boolean } = {},
): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const username = normalizeUsername(searchParams.get("username") ?? "");
  const itemId = searchParams.get("id") ?? "";
  const kind = searchParams.get("kind") === "cover" ? "cover" : "play";

  if (!username || !itemId) {
    return Response.json({ error: "Missing username or story id." }, { status: 400 });
  }

  const resolved = await resolveStory(username, itemId, request);
  if (resolved instanceof Response) {
    return resolved;
  }

  const { story } = resolved;
  const isImage = kind === "cover" || story.type === "photo";

  return streamTikTokMedia(request, {
    sourceUrl: kind === "cover" ? story.coverUrl || story.mediaUrl : story.mediaUrl,
    referer: `https://www.tiktok.com/@${encodeURIComponent(username)}`,
    cookies: resolved.cookies,
    fallbackType: isImage ? "image/jpeg" : "video/mp4",
    attachmentName: options.download
      ? `${username}-story-${itemId}.${story.type === "photo" ? "jpg" : "mp4"}`
      : undefined,
  });
}

async function resolveStory(
  username: string,
  itemId: string,
  request: Request,
): Promise<{ story: TikTokStory; cookies: string | null } | Response> {
  let result = getCachedStories(username);
  let cookies = getCachedStoryCookies(username);

  if (!result) {
    const ip = getClientIp(request);
    if (!allowRequest(ip)) {
      return Response.json({ error: "Too many lookups." }, { status: 429 });
    }

    const lookup = await lookupPublicStories(username);
    result = lookup.result;
    cookies = lookup.cookies;
    setCachedStories(username, lookup.result, lookup.cookies);
  }

  if (result.status !== "success") {
    return Response.json({ error: "No public story to load." }, { status: 404 });
  }

  const story = result.stories.find((item) => item.id === itemId);
  if (!story) {
    return Response.json({ error: "That public story is no longer available." }, { status: 404 });
  }

  return { story, cookies };
}
